export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);
      const userId = request.headers.get('X-Encrypted-Yw-ID');
      const isLogin = request.headers.get('X-Is-Login') === '1';

      if (!userId) {
        return new Response(JSON.stringify({ error: 'User not authenticated' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Handle different endpoints
      if (url.pathname === '/sessions' && request.method === 'POST') {
        return await saveSession(request, env, userId);
      } else if (url.pathname === '/sessions' && request.method === 'GET') {
        return await loadSessions(env, userId);
      } else if (url.pathname.match(/^\/sessions\/[^\/]+$/) && request.method === 'GET') {
        const sessionId = url.pathname.split('/')[2];
        return await loadSession(env, userId, sessionId);
      } else if (url.pathname.match(/^\/sessions\/[^\/]+$/) && request.method === 'PUT') {
        const sessionId = url.pathname.split('/')[2];
        return await updateSession(request, env, userId, sessionId);
      } else if (url.pathname.match(/^\/sessions\/[^\/]+$/) && request.method === 'DELETE') {
        const sessionId = url.pathname.split('/')[2];
        return await deleteSession(env, userId, sessionId);
      }

      return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Backend error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};

async function saveSession(request: Request, env: Env, userId: string): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const body = await request.json();
    const { sessionId, gameData, difficulty, status, score, turnCount, playerName } = body;

    if (!sessionId || !gameData || !difficulty || !status) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const now = new Date().toISOString();
    const completedAt = status === 'COMPLETED' || status === 'VITORIA' || status === 'DERROTA' ? now : null;

    // Insert or update session
    const stmt = env.DB.prepare(`
      INSERT INTO game_sessions (
        session_id, encrypted_yw_id, player_name, game_data, difficulty, 
        status, score, turn_count, created_at, updated_at, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(session_id) DO UPDATE SET
        game_data = excluded.game_data,
        status = excluded.status,
        score = excluded.score,
        turn_count = excluded.turn_count,
        updated_at = excluded.updated_at,
        completed_at = excluded.completed_at
    `);

    await stmt.bind(
      sessionId, userId, playerName, JSON.stringify(gameData), difficulty,
      status, score || 0, turnCount || 0, now, now, completedAt
    ).run();

    return new Response(JSON.stringify({ success: true, sessionId }), {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Save session error:', error);
    return new Response(JSON.stringify({ error: 'Failed to save session' }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

async function loadSessions(env: Env, userId: string): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const stmt = env.DB.prepare(`
      SELECT session_id, player_name, difficulty, status, score, turn_count, 
             created_at, updated_at, completed_at
      FROM game_sessions 
      WHERE encrypted_yw_id = ? 
      ORDER BY updated_at DESC
    `);

    const { results } = await stmt.bind(userId).all();

    return new Response(JSON.stringify({ sessions: results }), {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Load sessions error:', error);
    return new Response(JSON.stringify({ error: 'Failed to load sessions' }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

async function loadSession(env: Env, userId: string, sessionId: string): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const stmt = env.DB.prepare(`
      SELECT * FROM game_sessions 
      WHERE session_id = ? AND encrypted_yw_id = ?
    `);

    const result = await stmt.bind(sessionId, userId).first();

    if (!result) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: corsHeaders
      });
    }

    // Parse the game data back to object
    const session = {
      ...result,
      game_data: JSON.parse(result.game_data)
    };

    return new Response(JSON.stringify({ session }), {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Load session error:', error);
    return new Response(JSON.stringify({ error: 'Failed to load session' }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

async function updateSession(request: Request, env: Env, userId: string, sessionId: string): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const body = await request.json();
    const { gameData, status, score, turnCount } = body;

    const now = new Date().toISOString();
    const completedAt = status === 'COMPLETED' || status === 'VITORIA' || status === 'DERROTA' ? now : null;

    const stmt = env.DB.prepare(`
      UPDATE game_sessions 
      SET game_data = ?, status = ?, score = ?, turn_count = ?, updated_at = ?, completed_at = ?
      WHERE session_id = ? AND encrypted_yw_id = ?
    `);

    const result = await stmt.bind(
      JSON.stringify(gameData), status, score || 0, turnCount || 0, 
      now, completedAt, sessionId, userId
    ).run();

    if (result.changes === 0) {
      return new Response(JSON.stringify({ error: 'Session not found or not owned by user' }), {
        status: 404,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Update session error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update session' }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

async function deleteSession(env: Env, userId: string, sessionId: string): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const stmt = env.DB.prepare(`
      DELETE FROM game_sessions 
      WHERE session_id = ? AND encrypted_yw_id = ?
    `);

    const result = await stmt.bind(sessionId, userId).run();

    if (result.changes === 0) {
      return new Response(JSON.stringify({ error: 'Session not found or not owned by user' }), {
        status: 404,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Delete session error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete session' }), {
      status: 500,
      headers: corsHeaders
    });
  }
}