import { Card } from './card.model';
import { HomeostaticState } from './biomarker.model';

export enum GameStatus {
  LOBBY = 'LOBBY',
  IN_PROGRESS = 'EM_JOGO',
  VICTORY = 'VITORIA',
  DEFEAT = 'DERROTA',
  PAUSED = 'PAUSED'
}

export enum EventType {
  RANDOM = 'RANDOM',
  SCHEDULED = 'SCHEDULED',
  TRIGGERED = 'TRIGGERED'
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  effects: Array<{
    system: string;
    value: number;
    duration: number;
  }>;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  icon?: string;
}

export interface GameSession {
  id: string;
  playerId: string;
  status: GameStatus;
  currentState: HomeostaticState;
  hand: Card[];
  deck: Card[];
  discardPile: Card[];
  currentEvent?: GameEvent;
  score: number;
  turnCount: number;
  startTime: Date;
  lastSave: Date;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameRule {
  id: string;
  name: string;
  description: string;
  validator: (session: GameSession, card: Card) => boolean;
  executor: (session: GameSession, card: Card) => GameSession;
}