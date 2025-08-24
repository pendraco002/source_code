export enum CardType {
  ACTION = 'ACAO',
  EVENT = 'EVENTO'
}

export enum CardRarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY'
}

export interface CardEffect {
  targetSystem: string; // 'glucose', 'ph', 'temperature'
  value: number;
  duration?: number;
  type: 'INSTANT' | 'CONTINUOUS' | 'CONDITIONAL';
  condition?: string;
}

export interface Card {
  id: string;
  name: string;
  type: CardType;
  description: string;
  imageUrl: string;
  effects: CardEffect[];
  cost: number;
  rarity: CardRarity;
  flavorText?: string;
  educationalNote?: string;
}

export interface PlayerCard extends Card {
  instanceId: string;
  isPlayed: boolean;
}

export interface Deck {
  id: string;
  name: string;
  cards: Card[];
  maxSize: number;
}