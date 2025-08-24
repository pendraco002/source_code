import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameEngine } from './GameEngine';
import { GameSession, GameStatus } from '../../core/domain/game.model';
import { Card, CardType } from '../../core/domain/card.model';
import { HomeostaticSystem } from '../../core/domain/biomarker.model';
import { gameTestHelpers } from '../../test/test-utils';

describe('GameEngine', () => {
  let gameEngine: GameEngine;
  let mockSession: GameSession;
  let mockCard: Card;

  beforeEach(() => {
    gameEngine = GameEngine.getInstance();
    
    // Create mock game session
    mockSession = {
      id: 'test-session',
      playerId: 'test-player',
      startTime: new Date(),
      endTime: null,
      status: GameStatus.ACTIVE,
      difficulty: 'medium',
      selectedSystem: 'glucose',
      turnCount: 1,
      maxTurns: 20,
      score: 1000,
      currentState: {
        [HomeostaticSystem.GLUCOSE]: {
          id: 'glucose',
          name: 'Glicose',
          currentValue: 90,
          normalRange: { min: 70, max: 110 },
          unit: 'mg/dL',
          status: 'normal',
          trend: 'stable',
          isCritical: false,
          lastUpdate: new Date()
        },
        [HomeostaticSystem.PH]: {
          id: 'ph',
          name: 'pH Sanguíneo',
          currentValue: 7.40,
          normalRange: { min: 7.35, max: 7.45 },
          unit: 'pH',
          status: 'normal',
          trend: 'stable',
          isCritical: false,
          lastUpdate: new Date()
        },
        [HomeostaticSystem.TEMPERATURE]: {
          id: 'temperature',
          name: 'Temperatura Corporal',
          currentValue: 37.0,
          normalRange: { min: 36.5, max: 37.5 },
          unit: '°C',
          status: 'normal',
          trend: 'stable',
          isCritical: false,
          lastUpdate: new Date()
        }
      },
      hand: [],
      deck: [],
      discardPile: [],
      playedCards: [],
      events: []
    };

    // Create mock card
    mockCard = {
      ...gameTestHelpers.mockCard,
      effects: [{
        targetSystem: 'glucose',
        value: -10,
        duration: 1
      }]
    };

    mockSession.hand = [mockCard];
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = GameEngine.getInstance();
      const instance2 = GameEngine.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('processTurn', () => {
    it('should apply card effects to biomarkers', () => {
      const { newSession, history } = gameEngine.processTurn(mockSession, mockCard);
      
      // Should decrease glucose by 10
      expect(newSession.currentState.glucose.currentValue).toBe(80);
      
      // Should have history entry
      expect(history).toHaveLength(1);
      expect(history[0].change).toBe(-10);
      expect(history[0].reason).toContain('Test Card');
    });

    it('should remove played card from hand', () => {
      const { newSession } = gameEngine.processTurn(mockSession, mockCard);
      
      expect(newSession.hand).toHaveLength(0);
      expect(newSession.discardPile).toContain(mockCard);
    });

    it('should increment turn count', () => {
      const { newSession } = gameEngine.processTurn(mockSession, mockCard);
      
      expect(newSession.turnCount).toBe(2);
    });

    it('should detect critical biomarker values', () => {
      const criticalCard: Card = {
        ...mockCard,
        effects: [{
          targetSystem: 'glucose',
          value: -50, // This would make glucose = 40 (critical)
          duration: 1
        }]
      };

      const { newSession } = gameEngine.processTurn(mockSession, criticalCard);
      
      expect(newSession.currentState.glucose.currentValue).toBe(40);
      expect(newSession.currentState.glucose.isCritical).toBe(true);
    });

    it('should calculate biomarker trends correctly', () => {
      const increasingCard: Card = {
        ...mockCard,
        effects: [{
          targetSystem: 'glucose',
          value: 20,
          duration: 1
        }]
      };

      const { newSession } = gameEngine.processTurn(mockSession, increasingCard);
      
      expect(newSession.currentState.glucose.trend).toBe('increasing');
    });

    it('should handle multiple effects from one card', () => {
      const multiEffectCard: Card = {
        ...mockCard,
        effects: [
          { targetSystem: 'glucose', value: -10, duration: 1 },
          { targetSystem: 'ph', value: 0.05, duration: 1 }
        ]
      };

      const { newSession, history } = gameEngine.processTurn(mockSession, multiEffectCard);
      
      expect(newSession.currentState.glucose.currentValue).toBe(80);
      expect(newSession.currentState.ph.currentValue).toBe(7.45);
      expect(history).toHaveLength(2);
    });

    it('should end game when max turns reached', () => {
      const sessionNearEnd = {
        ...mockSession,
        turnCount: 19,
        maxTurns: 20
      };

      const { newSession } = gameEngine.processTurn(sessionNearEnd, mockCard);
      
      expect(newSession.turnCount).toBe(20);
      expect(newSession.status).toBe(GameStatus.COMPLETED);
    });
  });

  describe('generateRandomEvent', () => {
    it('should generate valid random events', () => {
      const event = gameEngine.generateRandomEvent();
      
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('title');
      expect(event).toHaveProperty('description');
      expect(event).toHaveProperty('effects');
      expect(event.effects).toBeInstanceOf(Array);
      expect(event.effects.length).toBeGreaterThan(0);
    });

    it('should generate events with different severities', () => {
      const events = [];
      // Generate multiple events to test variety
      for (let i = 0; i < 10; i++) {
        events.push(gameEngine.generateRandomEvent());
      }

      const severities = events.map(e => e.severity);
      const uniqueSeverities = [...new Set(severities)];
      
      expect(uniqueSeverities.length).toBeGreaterThan(1);
    });
  });

  describe('calculateScore', () => {
    it('should calculate base score correctly', () => {
      const score = gameEngine.calculateScore(mockSession);
      
      expect(score).toHaveProperty('totalScore');
      expect(score).toHaveProperty('breakdown');
      expect(score.totalScore).toBeGreaterThan(0);
    });

    it('should give bonus for stable systems', () => {
      const stableSession = {
        ...mockSession,
        currentState: {
          ...mockSession.currentState,
          glucose: { ...mockSession.currentState.glucose, status: 'normal' },
          ph: { ...mockSession.currentState.ph, status: 'normal' },
          temperature: { ...mockSession.currentState.temperature, status: 'normal' }
        }
      };

      const score = gameEngine.calculateScore(stableSession);
      
      expect(score.breakdown.stabilityBonus).toBeGreaterThan(0);
    });

    it('should penalize critical systems', () => {
      const criticalSession = {
        ...mockSession,
        currentState: {
          ...mockSession.currentState,
          glucose: { 
            ...mockSession.currentState.glucose, 
            isCritical: true,
            currentValue: 40
          }
        }
      };

      const score = gameEngine.calculateScore(criticalSession);
      
      expect(score.breakdown.criticalPenalty).toBeLessThan(0);
    });
  });

  describe('checkGameEnd', () => {
    it('should continue game when conditions are normal', () => {
      const status = gameEngine.checkGameEnd(mockSession);
      expect(status).toBe(GameStatus.ACTIVE);
    });

    it('should end game when max turns reached', () => {
      const endSession = { ...mockSession, turnCount: 20, maxTurns: 20 };
      const status = gameEngine.checkGameEnd(endSession);
      expect(status).toBe(GameStatus.COMPLETED);
    });

    it('should fail game when multiple systems are critical', () => {
      const criticalSession = {
        ...mockSession,
        currentState: {
          ...mockSession.currentState,
          glucose: { ...mockSession.currentState.glucose, isCritical: true },
          ph: { ...mockSession.currentState.ph, isCritical: true }
        }
      };

      const status = gameEngine.checkGameEnd(criticalSession);
      expect(status).toBe(GameStatus.FAILED);
    });
  });

  describe('Edge Cases', () => {
    it('should handle playing card not in hand gracefully', () => {
      const invalidCard: Card = {
        ...mockCard,
        id: 'not-in-hand'
      };

      const { newSession } = gameEngine.processTurn(mockSession, invalidCard);
      
      // Should still process the turn but not remove anything from hand
      expect(newSession.hand).toHaveLength(1);
      expect(newSession.discardPile).toContain(invalidCard);
    });

    it('should handle extreme biomarker values', () => {
      const extremeCard: Card = {
        ...mockCard,
        effects: [{
          targetSystem: 'glucose',
          value: -1000, // Extreme negative value
          duration: 1
        }]
      };

      const { newSession } = gameEngine.processTurn(mockSession, extremeCard);
      
      // Should not crash and should mark as critical
      expect(newSession.currentState.glucose.isCritical).toBe(true);
      expect(newSession.currentState.glucose.currentValue).toBe(-910);
    });

    it('should handle card with no effects', () => {
      const noEffectCard: Card = {
        ...mockCard,
        effects: []
      };

      const { newSession, history } = gameEngine.processTurn(mockSession, noEffectCard);
      
      expect(history).toHaveLength(0);
      expect(newSession.turnCount).toBe(2); // Turn should still increment
    });
  });

  describe('Performance Tests', () => {
    it('should process turn quickly', () => {
      const startTime = performance.now();
      
      gameEngine.processTurn(mockSession, mockCard);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete within 10ms
      expect(duration).toBeLessThan(10);
    });

    it('should handle many simultaneous calculations', () => {
      const manyEffectsCard: Card = {
        ...mockCard,
        effects: Array.from({ length: 100 }, (_, i) => ({
          targetSystem: 'glucose',
          value: i % 2 === 0 ? 1 : -1,
          duration: 1
        }))
      };

      const startTime = performance.now();
      const { newSession } = gameEngine.processTurn(mockSession, manyEffectsCard);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50); // Should handle many effects quickly
      expect(newSession.currentState.glucose.currentValue).toBe(90); // Net effect should be 0
    });
  });
});