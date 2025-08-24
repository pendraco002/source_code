export interface EducationalContent {
  system: string;
  overview: string;
  normalRange: string;
  criticalConditions: string;
  keyConcepts: string[];
  funFacts: string[];
}

export const educationalContent: Record<string, EducationalContent> = {
  glucose: {
    system: 'Sistema Glicêmico',
    overview: 'O sistema glicêmico regula os níveis de glicose no sangue através de hormônios como insulina e glucagon.',
    normalRange: 'Níveis normais: 70-110 mg/dL em jejum, <140 mg/dL pós-prandial',
    criticalConditions: 'Hipoglicemia: <50 mg/dL (risco de coma) | Hiperglicemia: >250 mg/dL (risco de cetoacidose)',
    keyConcepts: [
      'Insulina: reduz glicemia facilitando entrada de glicose nas células',
      'Glucagon: aumenta glicemia estimulando gliconeogênese hepática',
      'Regulação feedback: sistema monitora constantemente e ajusta',
      'Reserva hepática: fígado armazena glicogênio como "banco de energia"'
    ],
    funFacts: [
      'O cérebro usa ~20% da glicose corporal total',
      'Células beta pancreáticas são os "sensores" de glicose',
      'Exercício físico aumenta sensibilidade à insulina por até 48h'
    ]
  },
  ph: {
    system: 'Sistema Ácido-Base',
    overview: 'O equilíbrio ácido-base mantém o pH sanguíneo entre 7.35-7.45 através de sistemas tampão, respiratório e renal.',
    normalRange: 'pH arterial: 7.35-7.45 | pH venoso: 7.32-7.42',
    criticalConditions: 'Acidose: pH <7.20 | Alcalose: pH >7.60 (ambos podem ser fatais)',
    keyConcepts: [
      'Sistema tampão bicarbonato: principal regulador de pH',
      'Compensação respiratória: alteração na ventilação em minutos',
      'Compensação renal: alteração excreção de H+ e HCO3- em horas/dias',
      'Equação Henderson-Hasselbalch: pH = 6.1 + log([HCO3-]/0.03×PCO2)'
    ],
    funFacts: [
      'O sangue é 20x mais tamponado que a água',
      'Rins podem reabsorver 99.9% do bicarbonato filtrado',
      'Respiração controlada por quimiorreceptores sensíveis a pH'
    ]
  },
  temperature: {
    system: 'Sistema Termorregulador',
    overview: 'O hipotálamo regula temperatura corporal através de vasodilatação, sudorese, tremor e comportamento.',
    normalRange: 'Temperatura core: 36.5-37.5°C | Temperatura periférica: 35-36°C',
    criticalConditions: 'Hipotermia: <35°C | Febre: >38°C | Hipertermia: >40°C',
    keyConcepts: [
      'Termostato hipotalâmico: centro de regulação na base do cérebro',
      'Vasodilatação cutânea: perda de calor por radiação/convecção',
      'Sudorese: resfriamento evaporativo eficiente',
      'Tremor termogênico: produção de calor por contração muscular'
    ],
    funFacts: [
      '1°C de febre aumenta metabolismo basal em 10%',
      'Crianças perdem calor mais rápido (maior superfície/massa)',
      'Temperatura varia 0.5°C ao longo do dia (ritmo circadiano)'
    ]
  }
};

export interface TutorialHint {
  trigger: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success';
}

export const tutorialHints: TutorialHint[] = [
  {
    trigger: 'glucose_critical',
    title: 'Crise Glicêmica!',
    content: 'Glicose <50 ou >250 mg/dL é emergência. Use insulina ou glucagon conforme necessário.',
    type: 'warning'
  },
  {
    trigger: 'ph_critical',
    title: 'Desequilíbrio Ácido-Base',
    content: 'pH fora de 7.2-7.6 pode causar disfunção orgânica. Use bicarbonato ou ventilação.',
    type: 'warning'
  },
  {
    trigger: 'temperature_critical',
    title: 'Temperatura Extrema',
    content: '<35°C ou >39°C requer intervenção. Use resfriamento ou aquecimento controlado.',
    type: 'warning'
  },
  {
    trigger: 'combo_played',
    title: 'Combo Eficiente!',
    content: 'Você usou cartas que trabalham sinergicamente. Continue assim!',
    type: 'success'
  },
  {
    trigger: 'perfect_balance',
    title: 'Equilíbrio Perfeito!',
    content: 'Todos os sistemas estão em faixa ideal. Excelente trabalho!',
    type: 'success'
  }
];

export const glossary = {
  homeostase: {
    term: 'Homeostase',
    definition: 'Capacidade do organismo de manter condições internas estáveis apesar de mudanças externas.',
    example: 'Como o corpo mantém 37°C mesmo em ambientes frios ou quentes.'
  },
  biomarcador: {
    term: 'Biomarcador',
    definition: 'Indicador mensurável de processo biológico ou condição de saúde.',
    example: 'Glicemia, pH sanguíneo, temperatura corporal.'
  },
  gliconeogênese: {
    term: 'Gliconeogênese',
    definition: 'Síntese de glicose a partir de precursores não-carboidratos.',
    example: 'Fígado produzindo glicose a partir de proteínas durante jejum.'
  },
  acidose: {
    term: 'Acidose',
    definition: 'Condição onde o sangue fica excessivamente ácido (pH baixo).',
    example: 'Acidose metabólica em diabetes descontrolado.'
  },
  termorregulação: {
    term: 'Termorregulação',
    definition: 'Processo de manter temperatura corporal constante.',
    example: 'Sudorese para resfriar o corpo quando está quente.'
  }
};