import { describe, it, expect } from 'vitest';
import { Card, CardType, CardRarity, CardEffect, createCard, validateCard, isValidCardEffect } from './card.model';

describe('Card Model', () => {
  const validCardData = {
    id: 'test-card-1',
    name: 'Test Insulin',
    type: CardType.ACTION,
    cost: 2,
    description: 'Reduces blood glucose levels',
    effects: [
      {
        targetSystem: 'glucose',
        value: -15,
        duration: 2
      }
    ],
    rarity: CardRarity.COMMON,
    educationalNote: 'Insulin helps cells absorb glucose from the bloodstream',
    flavorText: 'The body\'s natural glucose regulator'
  };

  describe('CardType Enum', () => {
    it('should have correct card types', () => {
      expect(CardType.ACTION).toBe('ACTION');
      expect(CardType.EVENT).toBe('EVENT');
    });
  });

  describe('CardRarity Enum', () => {
    it('should have all rarity levels', () => {
      expect(CardRarity.COMMON).toBe('common');
      expect(CardRarity.UNCOMMON).toBe('uncommon');
      expect(CardRarity.RARE).toBe('rare');
      expect(CardRarity.EPIC).toBe('epic');
    });
  });

  describe('createCard', () => {
    it('should create a valid card with all properties', () => {
      const card = createCard(validCardData);
      
      expect(card.id).toBe('test-card-1');
      expect(card.name).toBe('Test Insulin');
      expect(card.type).toBe(CardType.ACTION);
      expect(card.cost).toBe(2);
      expect(card.effects).toHaveLength(1);
      expect(card.rarity).toBe(CardRarity.COMMON);
    });

    it('should create card with minimal required properties', () => {
      const minimalCard = createCard({
        id: 'minimal-card',
        name: 'Minimal Card',
        type: CardType.EVENT,
        cost: 1,
        description: 'A minimal card',
        effects: [],
        rarity: CardRarity.COMMON
      });

      expect(minimalCard.id).toBe('minimal-card');
      expect(minimalCard.effects).toHaveLength(0);
      expect(minimalCard.educationalNote).toBeUndefined();
      expect(minimalCard.flavorText).toBeUndefined();
    });

    it('should handle multiple effects', () => {
      const multiEffectCard = createCard({
        ...validCardData,
        effects: [
          { targetSystem: 'glucose', value: -10, duration: 1 },
          { targetSystem: 'ph', value: 0.05, duration: 2 }
        ]
      });

      expect(multiEffectCard.effects).toHaveLength(2);
      expect(multiEffectCard.effects[0].targetSystem).toBe('glucose');
      expect(multiEffectCard.effects[1].targetSystem).toBe('ph');
    });
  });

  describe('validateCard', () => {
    it('should validate a correct card', () => {
      const result = validateCard(validCardData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject card with empty id', () => {
      const invalidCard = { ...validCardData, id: '' };
      const result = validateCard(invalidCard);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Card ID cannot be empty');
    });

    it('should reject card with empty name', () => {
      const invalidCard = { ...validCardData, name: '' };
      const result = validateCard(invalidCard);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Card name cannot be empty');
    });

    it('should reject card with negative cost', () => {
      const invalidCard = { ...validCardData, cost: -1 };
      const result = validateCard(invalidCard);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Card cost cannot be negative');
    });

    it('should reject card with excessive cost', () => {
      const invalidCard = { ...validCardData, cost: 15 };
      const result = validateCard(invalidCard);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Card cost cannot exceed 10');
    });

    it('should reject card with empty description', () => {
      const invalidCard = { ...validCardData, description: '' };
      const result = validateCard(invalidCard);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Card description cannot be empty');
    });

    it('should reject card with invalid type', () => {
      const invalidCard = { ...validCardData, type: 'INVALID_TYPE' as CardType };
      const result = validateCard(invalidCard);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid card type');
    });

    it('should reject card with invalid rarity', () => {
      const invalidCard = { ...validCardData, rarity: 'invalid' as CardRarity };
      const result = validateCard(invalidCard);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid card rarity');
    });

    it('should collect multiple validation errors', () => {
      const invalidCard = {
        ...validCardData,
        id: '',
        name: '',
        cost: -5,
        description: ''
      };
      
      const result = validateCard(invalidCard);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(3);
    });
  });

  describe('isValidCardEffect', () => {
    it('should validate correct card effects', () => {
      const validEffect: CardEffect = {
        targetSystem: 'glucose',
        value: -10,
        duration: 2
      };

      expect(isValidCardEffect(validEffect)).toBe(true);
    });

    it('should reject effect with invalid target system', () => {
      const invalidEffect: CardEffect = {
        targetSystem: 'invalid_system',
        value: -10,
        duration: 2
      };

      expect(isValidCardEffect(invalidEffect)).toBe(false);
    });

    it('should reject effect with zero value', () => {
      const invalidEffect: CardEffect = {
        targetSystem: 'glucose',
        value: 0,
        duration: 2
      };

      expect(isValidCardEffect(invalidEffect)).toBe(false);
    });

    it('should reject effect with negative duration', () => {
      const invalidEffect: CardEffect = {
        targetSystem: 'glucose',
        value: -10,
        duration: -1
      };

      expect(isValidCardEffect(invalidEffect)).toBe(false);
    });

    it('should accept instant effects (duration 0)', () => {
      const instantEffect: CardEffect = {
        targetSystem: 'glucose',
        value: -10,
        duration: 0
      };

      expect(isValidCardEffect(instantEffect)).toBe(true);
    });

    it('should handle extreme but valid values', () => {
      const extremeEffect: CardEffect = {
        targetSystem: 'temperature',
        value: 5.0, // High fever
        duration: 1
      };

      expect(isValidCardEffect(extremeEffect)).toBe(true);
    });
  });

  describe('Card Business Logic', () => {
    describe('Cost Mechanics', () => {
      it('should categorize cards by cost efficiency', () => {
        const lowCostCard = createCard({ ...validCardData, cost: 1 });
        const highCostCard = createCard({ ...validCardData, cost: 8 });
        
        expect(lowCostCard.cost < 3).toBe(true);
        expect(highCostCard.cost > 6).toBe(true);
      });
    });

    describe('Effect Impact', () => {
      it('should calculate total effect impact', () => {
        const card = createCard({
          ...validCardData,
          effects: [
            { targetSystem: 'glucose', value: -15, duration: 2 },
            { targetSystem: 'ph', value: 0.1, duration: 1 }
          ]
        });

        const totalImpact = card.effects.reduce((sum, effect) => 
          sum + Math.abs(effect.value), 0
        );

        expect(totalImpact).toBe(15.1);
      });

      it('should identify single vs multi-target cards', () => {
        const singleTarget = createCard(validCardData);
        const multiTarget = createCard({
          ...validCardData,
          effects: [
            { targetSystem: 'glucose', value: -10, duration: 1 },
            { targetSystem: 'temperature', value: -0.5, duration: 1 }
          ]
        });

        expect(singleTarget.effects.length).toBe(1);
        expect(multiTarget.effects.length).toBe(2);
        
        const uniqueSystems = new Set(multiTarget.effects.map(e => e.targetSystem));
        expect(uniqueSystems.size).toBe(2);
      });
    });

    describe('Educational Content', () => {
      it('should have educational value for learning cards', () => {
        const educationalCard = createCard({
          ...validCardData,
          educationalNote: 'Insulin is produced by beta cells in the pancreas'
        });

        expect(educationalCard.educationalNote).toBeDefined();
        expect(educationalCard.educationalNote?.length).toBeGreaterThan(10);
      });
    });
  });

  describe('Performance and Memory', () => {
    it('should create cards efficiently', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        createCard({
          ...validCardData,
          id: `perf-card-${i}`
        });
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should create 1000 cards in less than 50ms
      expect(duration).toBeLessThan(50);
    });

    it('should validate cards efficiently', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        validateCard({
          ...validCardData,
          id: `validation-card-${i}`
        });
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should validate 1000 cards in less than 100ms
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Type Safety', () => {
    it('should maintain type safety for card properties', () => {
      const card = createCard(validCardData);
      
      // These should be properly typed
      expect(typeof card.id).toBe('string');
      expect(typeof card.name).toBe('string');
      expect(typeof card.cost).toBe('number');
      expect(Array.isArray(card.effects)).toBe(true);
      
      if (card.effects.length > 0) {
        expect(typeof card.effects[0].targetSystem).toBe('string');
        expect(typeof card.effects[0].value).toBe('number');
        expect(typeof card.effects[0].duration).toBe('number');
      }
    });
  });
});