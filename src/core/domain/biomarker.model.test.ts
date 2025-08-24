import { describe, it, expect } from 'vitest';
import { 
  HomeostaticSystem, 
  Biomarker, 
  BiomarkerHistory,
  HomeostaticState
} from './biomarker.model';

describe('Biomarker Model', () => {
  describe('HomeostaticSystem Enum', () => {
    it('should have correct HomeostaticSystem values', () => {
      expect(HomeostaticSystem.GLUCOSE).toBe('glucose');
      expect(HomeostaticSystem.PH).toBe('ph');
      expect(HomeostaticSystem.TEMPERATURE).toBe('temperature');
    });
  });

  describe('Biomarker Interface', () => {
    it('should create valid biomarker objects', () => {
      const glucoseBiomarker: Biomarker = {
        system: HomeostaticSystem.GLUCOSE,
        name: 'Glicose',
        currentValue: 90,
        normalRange: [70, 110],
        criticalRange: [50, 300],
        unit: 'mg/dL',
        isCritical: false,
        trend: 'stable',
        lastUpdate: new Date()
      };

      expect(glucoseBiomarker.system).toBe(HomeostaticSystem.GLUCOSE);
      expect(glucoseBiomarker.currentValue).toBe(90);
      expect(glucoseBiomarker.isCritical).toBe(false);
    });

    it('should handle different trend types', () => {
      const biomarker: Biomarker = {
        system: HomeostaticSystem.GLUCOSE,
        name: 'Test',
        currentValue: 100,
        normalRange: [70, 110],
        criticalRange: [50, 300],
        unit: 'mg/dL',
        isCritical: false,
        trend: 'increasing',
        lastUpdate: new Date()
      };

      expect(['stable', 'increasing', 'decreasing']).toContain(biomarker.trend);
    });
  });

  describe('HomeostaticState Interface', () => {
    it('should contain all required biomarkers', () => {
      const state: HomeostaticState = {
        glucose: {
          system: HomeostaticSystem.GLUCOSE,
          name: 'Glicose',
          currentValue: 90,
          normalRange: [70, 110],
          criticalRange: [50, 300],
          unit: 'mg/dL',
          isCritical: false,
          trend: 'stable',
          lastUpdate: new Date()
        },
        ph: {
          system: HomeostaticSystem.PH,
          name: 'pH Sanguíneo',
          currentValue: 7.40,
          normalRange: [7.35, 7.45],
          criticalRange: [7.20, 7.60],
          unit: 'pH',
          isCritical: false,
          trend: 'stable',
          lastUpdate: new Date()
        },
        temperature: {
          system: HomeostaticSystem.TEMPERATURE,
          name: 'Temperatura',
          currentValue: 37.0,
          normalRange: [36.5, 37.5],
          criticalRange: [35.0, 40.0],
          unit: '°C',
          isCritical: false,
          trend: 'stable',
          lastUpdate: new Date()
        }
      };

      expect(state.glucose).toBeDefined();
      expect(state.ph).toBeDefined();
      expect(state.temperature).toBeDefined();
    });
  });

  describe('BiomarkerHistory Interface', () => {
    it('should track biomarker changes correctly', () => {
      const history: BiomarkerHistory = {
        timestamp: new Date(),
        system: HomeostaticSystem.GLUCOSE,
        oldValue: 90,
        newValue: 110,
        change: 20,
        reason: 'Card played: Glucose tablet'
      };

      expect(history.system).toBe(HomeostaticSystem.GLUCOSE);
      expect(history.change).toBe(20);
      expect(history.newValue - history.oldValue).toBe(history.change);
    });

    it('should handle negative changes', () => {
      const history: BiomarkerHistory = {
        timestamp: new Date(),
        system: HomeostaticSystem.GLUCOSE,
        oldValue: 120,
        newValue: 90,
        change: -30,
        reason: 'Insulin effect'
      };

      expect(history.change).toBe(-30);
      expect(history.oldValue + history.change).toBe(history.newValue);
    });
  });

  describe('Data Validation Logic', () => {
    it('should identify normal glucose values', () => {
      const normalValues = [70, 85, 95, 110];
      
      normalValues.forEach(value => {
        const isNormal = value >= 70 && value <= 110;
        expect(isNormal).toBe(true);
      });
    });

    it('should identify critical glucose values', () => {
      const criticalValues = [40, 45, 320, 350];
      
      criticalValues.forEach(value => {
        const isCritical = value < 50 || value > 300;
        expect(isCritical).toBe(true);
      });
    });

    it('should identify normal pH values', () => {
      const normalValues = [7.35, 7.40, 7.42, 7.45];
      
      normalValues.forEach(value => {
        const isNormal = value >= 7.35 && value <= 7.45;
        expect(isNormal).toBe(true);
      });
    });

    it('should identify critical pH values', () => {
      const criticalValues = [7.15, 7.25, 7.55, 7.65];
      
      criticalValues.forEach(value => {
        const isCritical = value < 7.20 || value > 7.60;
        expect(isCritical).toBe(true);
      });
    });

    it('should identify normal temperature values', () => {
      const normalValues = [36.5, 36.8, 37.0, 37.3, 37.5];
      
      normalValues.forEach(value => {
        const isNormal = value >= 36.5 && value <= 37.5;
        expect(isNormal).toBe(true);
      });
    });

    it('should identify critical temperature values', () => {
      const criticalValues = [34.0, 35.5, 39.0, 41.0];
      
      criticalValues.forEach(value => {
        const isCritical = value < 35.0 || value > 40.0;
        expect(isCritical).toBe(true);
      });
    });
  });

  describe('Biomarker State Management', () => {
    it('should update biomarker values immutably', () => {
      const original: Biomarker = {
        system: HomeostaticSystem.GLUCOSE,
        name: 'Glicose',
        currentValue: 90,
        normalRange: [70, 110],
        criticalRange: [50, 300],
        unit: 'mg/dL',
        isCritical: false,
        trend: 'stable',
        lastUpdate: new Date()
      };

      const updated: Biomarker = {
        ...original,
        currentValue: 120,
        trend: 'increasing',
        lastUpdate: new Date()
      };

      expect(original.currentValue).toBe(90);
      expect(updated.currentValue).toBe(120);
      expect(original.trend).toBe('stable');
      expect(updated.trend).toBe('increasing');
    });

    it('should calculate trends based on value changes', () => {
      const calculateTrend = (oldValue: number, newValue: number): 'stable' | 'increasing' | 'decreasing' => {
        const threshold = 5;
        const diff = newValue - oldValue;
        
        if (Math.abs(diff) < threshold) return 'stable';
        return diff > 0 ? 'increasing' : 'decreasing';
      };

      expect(calculateTrend(90, 95)).toBe('increasing');
      expect(calculateTrend(90, 85)).toBe('decreasing');
      expect(calculateTrend(90, 92)).toBe('stable');
    });

    it('should detect critical states correctly', () => {
      const isCriticalGlucose = (value: number): boolean => {
        return value < 50 || value > 300;
      };

      expect(isCriticalGlucose(40)).toBe(true);
      expect(isCriticalGlucose(350)).toBe(true);
      expect(isCriticalGlucose(90)).toBe(false);
    });
  });

  describe('Range Validations', () => {
    it('should validate range boundaries correctly', () => {
      const isInRange = (value: number, range: [number, number]): boolean => {
        return value >= range[0] && value <= range[1];
      };

      const glucoseRange: [number, number] = [70, 110];
      
      expect(isInRange(70, glucoseRange)).toBe(true);
      expect(isInRange(110, glucoseRange)).toBe(true);
      expect(isInRange(69, glucoseRange)).toBe(false);
      expect(isInRange(111, glucoseRange)).toBe(false);
    });

    it('should handle edge cases for ranges', () => {
      const isInRange = (value: number, range: [number, number]): boolean => {
        return value >= range[0] && value <= range[1];
      };

      // Test with very small ranges (pH)
      const pHRange: [number, number] = [7.35, 7.45];
      
      expect(isInRange(7.35, pHRange)).toBe(true);
      expect(isInRange(7.45, pHRange)).toBe(true);
      expect(isInRange(7.349, pHRange)).toBe(false);
      expect(isInRange(7.451, pHRange)).toBe(false);
    });
  });

  describe('Performance Considerations', () => {
    it('should handle rapid biomarker updates efficiently', () => {
      const startTime = performance.now();
      const updates: BiomarkerHistory[] = [];

      for (let i = 0; i < 1000; i++) {
        const history: BiomarkerHistory = {
          timestamp: new Date(),
          system: HomeostaticSystem.GLUCOSE,
          oldValue: 90 + i,
          newValue: 90 + i + 1,
          change: 1,
          reason: `Update ${i}`
        };
        updates.push(history);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(updates.length).toBe(1000);
      expect(duration).toBeLessThan(50); // Should complete in under 50ms
    });

    it('should create homeostatic states efficiently', () => {
      const startTime = performance.now();
      const states: HomeostaticState[] = [];

      for (let i = 0; i < 100; i++) {
        const state: HomeostaticState = {
          glucose: {
            system: HomeostaticSystem.GLUCOSE,
            name: 'Glicose',
            currentValue: 90 + i,
            normalRange: [70, 110],
            criticalRange: [50, 300],
            unit: 'mg/dL',
            isCritical: false,
            trend: 'stable',
            lastUpdate: new Date()
          },
          ph: {
            system: HomeostaticSystem.PH,
            name: 'pH',
            currentValue: 7.40,
            normalRange: [7.35, 7.45],
            criticalRange: [7.20, 7.60],
            unit: 'pH',
            isCritical: false,
            trend: 'stable',
            lastUpdate: new Date()
          },
          temperature: {
            system: HomeostaticSystem.TEMPERATURE,
            name: 'Temperatura',
            currentValue: 37.0,
            normalRange: [36.5, 37.5],
            criticalRange: [35.0, 40.0],
            unit: '°C',
            isCritical: false,
            trend: 'stable',
            lastUpdate: new Date()
          }
        };
        states.push(state);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(states.length).toBe(100);
      expect(duration).toBeLessThan(100); // Should complete in under 100ms
    });
  });
});