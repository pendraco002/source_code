-- Equilibrium Game Backend Database Schema

CREATE TABLE game_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL UNIQUE,
    encrypted_yw_id TEXT NOT NULL,
    player_name TEXT,
    game_data TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    status TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    turn_count INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    completed_at TEXT
) STRICT;