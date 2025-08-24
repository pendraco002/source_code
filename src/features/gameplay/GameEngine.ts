import { GameSession, GameEvent, GameStatus } from '../../core/domain/game.model';
import { Card, CardEffect } from '../../core/domain/card.model';
import { HomeostaticSystem } from '../../core/domain/biomarker.model';
import { BiomarkerHistory } from '../../core/domain/biomarker.model';

export class GameEngine {
  private static instance: GameEngine;

  public static getInstance(): GameEngine {
    if (!GameEngine.instance) {
      GameEngine.instance = new GameEngine();
    }
    return GameEngine.instance;
  }

  public processTurn(session: GameSession, playedCard: Card): {
    newSession: GameSession;
    history: BiomarkerHistory[];
  } {
    let newSession = { ...session };
    const history: BiomarkerHistory[] = [];

    // Process card effects
    playedCard.effects.forEach(effect => {
      const systemKey = effect.targetSystem as keyof typeof HomeostaticSystem;
      const oldValue = newSession.currentState[systemKey].currentValue;
      const newValue = oldValue + effect.value;

      newSession.currentState[systemKey] = {
        ...newSession.currentState[systemKey],
        currentValue: newValue,
        isCritical: this.isCritical(newSession.currentState[systemKey], newValue),
        trend: this.calculateTrend(oldValue, newValue),
        lastUpdate: new Date()
      };

      history.push({
        timestamp: new Date(),
        system: effect.targetSystem as HomeostaticSystem,
        oldValue,
        newValue,
        change: effect.value,
        reason: `Card played: ${playedCard.name}`
      });
    });

    // Remove played card from hand
    newSession.hand = newSession.hand.filter(card => card.id !== playedCard.id);
    newSession.discardPile = [...newSession.discardPile, playedCard];

    // Check win/loss conditions
    newSession.status = this.checkGameEnd(newSession);

    // Increment turn count
    newSession.turnCount += 1;

    return { newSession, history };
  }

  public generateRandomEvent(): GameEvent {
    const events: GameEvent[] = [
      {
        id: 'random-glucose-spike',
        title: 'Pico Glicêmico Inesperado',
        description: 'Estresse ou alimentação causou aumento súbito de glicose.',
        type: 'RANDOM',
        effects: [{ system: 'glucose', value: 25, duration: 0 }],
        severity: 'moderate',
        icon: '🍰'
      },
      {
        id: 'dehydration-risk',
        title: 'Risco de Desidratação',
        description: 'Perda excessiva de fluidos está afetando o equilíbrio.',
        type: 'RANDOM',
        effects: [{ system: 'ph', value: -0.1, duration: 0 }],
        severity: 'mild',
        icon: '💧'
      },
      {
        id: 'infection-response',
        title: 'Resposta Infecciosa',
        description: 'O corpo está combatendo uma infecção, aumentando temperatura.',
        type: 'RANDOM',
        effects: [{ system: 'temperature', value: 1.5, duration: 2 }],
        severity: 'moderate',
        icon: '🤒'
      },
      {
        id: 'exercise-effect',
        title: 'Efeito do Exercício',
        description: 'Atividade física está regulando o metabolismo.',
        type: 'RANDOM',
        effects: [
          { system: 'glucose', value: -15, duration: 0 },
          { system: 'temperature', value: 0.5, duration: 1 }
        ],
        severity: 'mild',
        icon: '🏃'
      }
    ];

    return events[Math.floor(Math.random() * events.length)];
  }

  private isCritical(biomarker: any, value: number): boolean {
    const [minNormal, maxNormal] = biomarker.normalRange;
    const [minCritical, maxCritical] = biomarker.criticalRange;
    
    return value < minCritical || value > maxCritical;
  }

  private calculateTrend(oldValue: number, newValue: number): 'stable' | 'increasing' | 'decreasing' {
    const diff = newValue - oldValue;
    if (Math.abs(diff) < 0.1) return 'stable';
    return diff > 0 ? 'increasing' : 'decreasing';
  }

  private checkGameEnd(session: GameSession): GameStatus {
    const systems = Object.values(session.currentState);
    
    // Check for defeat conditions
    const criticalSystems = systems.filter(system => system.isCritical);
    if (criticalSystems.length >= 2) {
      return GameStatus.DEFEAT;
    }

    // Check for victory conditions
    const allStable = systems.every(system => 
      !system.isCritical && 
      system.currentValue >= system.normalRange[0] && 
      system.currentValue <= system.normalRange[1]
    );

    if (allStable && session.turnCount > 5) {
      return GameStatus.VICTORY;
    }

    return GameStatus.IN_PROGRESS;
  }

  public drawCard(session: GameSession): { newSession: GameSession; drawnCard: Card | null } {
    let newSession = { ...session };
    
    if (newSession.deck.length === 0) {
      // Reshuffle discard pile into deck
      newSession.deck = [...newSession.discardPile];
      newSession.discardPile = [];
    }

    if (newSession.deck.length === 0) {
      return { newSession, drawnCard: null };
    }

    const drawnCard = newSession.deck[0];
    newSession.deck = newSession.deck.slice(1);
    newSession.hand = [...newSession.hand, drawnCard];

    return { newSession, drawnCard };
  }

  public getScore(session: GameSession): number {
    const baseScore = 1000;
    const turnPenalty = session.turnCount * 10;
    const criticalPenalty = Object.values(session.currentState).filter(s => s.isCritical).length * 50;
    const stabilityBonus = Object.values(session.currentState).filter(s => 
      s.currentValue >= s.normalRange[0] && s.currentValue <= s.normalRange[1]
    ).length * 100;

    return Math.max(0, baseScore - turnPenalty - criticalPenalty + stabilityBonus);
  }
}