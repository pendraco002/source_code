import { useState, useEffect } from 'react';
import { GameSession } from '../../core/domain/game.model';

const BACKEND_URL = 'https://backend.youware.com';

interface SavedSession {
  session_id: string;
  player_name: string;
  difficulty: string;
  status: string;
  score: number;
  turn_count: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface GameSaveService {
  saveSession: (session: GameSession, playerName?: string) => Promise<boolean>;
  loadSession: (sessionId: string) => Promise<GameSession | null>;
  loadAllSessions: () => Promise<SavedSession[]>;
  deleteSession: (sessionId: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export const useGameSave = (): GameSaveService => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveSession = async (session: GameSession, playerName?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session.id,
          gameData: session,
          difficulty: session.difficulty,
          status: session.status,
          score: session.score,
          turnCount: session.turnCount,
          playerName: playerName || 'Jogador'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao salvar sessão');
      }

      const result = await response.json();
      return result.success;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao salvar sessão:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loadSession = async (sessionId: string): Promise<GameSession | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/sessions/${sessionId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao carregar sessão');
      }

      const result = await response.json();
      return result.session.game_data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao carregar sessão:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllSessions = async (): Promise<SavedSession[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/sessions`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao carregar sessões');
      }

      const result = await response.json();
      return result.sessions || [];

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao carregar sessões:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (sessionId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao deletar sessão');
      }

      const result = await response.json();
      return result.success;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao deletar sessão:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveSession,
    loadSession,
    loadAllSessions,
    deleteSession,
    isLoading,
    error
  };
};