export enum HomeostaticSystem {
  GLUCOSE = 'glucose',
  PH = 'ph',
  TEMPERATURE = 'temperature'
}

export interface Biomarker {
  system: HomeostaticSystem;
  name: string;
  currentValue: number;
  normalRange: [number, number];
  criticalRange: [number, number];
  unit: string;
  isCritical: boolean;
  trend: 'stable' | 'increasing' | 'decreasing';
  lastUpdate: Date;
}

export interface HomeostaticState {
  glucose: Biomarker;
  ph: Biomarker;
  temperature: Biomarker;
}

export interface BiomarkerHistory {
  timestamp: Date;
  system: HomeostaticSystem;
  oldValue: number;
  newValue: number;
  change: number;
  reason: string;
}