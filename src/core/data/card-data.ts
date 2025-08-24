import { Card, CardType, CardRarity, CardEffect } from '../domain/card.model';
import { HomeostaticSystem } from '../domain/biomarker.model';

export const initialCards: Card[] = [
  // Cartas de Ação Fisiológica
  {
    id: 'insulin-injection',
    name: 'Injeção de Insulina',
    type: CardType.ACTION,
    description: 'Administra insulina para reduzir níveis de glicose no sangue.',
    imageUrl: '/assets/cards/insulin.png',
    effects: [
      {
        targetSystem: HomeostaticSystem.GLUCOSE,
        value: -30,
        type: 'INSTANT'
      }
    ],
    cost: 2,
    rarity: CardRarity.COMMON,
    educationalNote: 'A insulina é o principal hormônio hipoglicemiante, produzido pelo pâncreas.',
    flavorText: '"O equilíbrio está a um passo de distância."'
  },
  {
    id: 'glucagon-release',
    name: 'Liberação de Glucagon',
    type: CardType.ACTION,
    description: 'Estimula o fígado a liberar glicose para o sangue.',
    imageUrl: '/assets/cards/glucagon.png',
    effects: [
      {
        targetSystem: HomeostaticSystem.GLUCOSE,
        value: 25,
        type: 'INSTANT'
      }
    ],
    cost: 2,
    rarity: CardRarity.COMMON,
    educationalNote: 'O glucagon age como hormônio hiperglicemiante, antagonista da insulina.',
    flavorText: '"Quando o açúcar cai, a vida chama."'
  },
  {
    id: 'sodium-bicarbonate',
    name: 'Bicarbonato de Sódio',
    type: CardType.ACTION,
    description: 'Correção rápida da acidose metabólica.',
    imageUrl: '/assets/cards/bicarbonate.png',
    effects: [
      {
        targetSystem: HomeostaticSystem.PH,
        value: 0.2,
        type: 'INSTANT'
      }
    ],
    cost: 3,
    rarity: CardRarity.RARE,
    educationalNote: 'O bicarbonato atua como tampão para neutralizar excesso de ácido no sangue.',
    flavorText: '"Equilibrando o ácido e a base da vida."'
  },
  {
    id: 'cooling-protocol',
    name: 'Protocolo de Resfriamento',
    type: CardType.ACTION,
    description: 'Reduz a temperatura corporal em casos de hipertermia.',
    imageUrl: '/assets/cards/cooling.png',
    effects: [
      {
        targetSystem: HomeostaticSystem.TEMPERATURE,
        value: -1.5,
        type: 'CONTINUOUS',
        duration: 3
      }
    ],
    cost: 3,
    rarity: CardRarity.RARE,
    educationalNote: 'A termorregulação é crucial para o funcionamento enzimático adequado.',
    flavorText: '"O corpo encontra seu equilíbrio térmico."'
  },
  {
    id: 'heating-blanket',
    name: 'Manta Térmica',
    type: CardType.ACTION,
    description: 'Aumenta gradualmente a temperatura corporal em hipotermia.',
    imageUrl: '/assets/cards/heating.png',
    effects: [
      {
        targetSystem: HomeostaticSystem.TEMPERATURE,
        value: 0.8,
        type: 'CONTINUOUS',
        duration: 4
      }
    ],
    cost: 2,
    rarity: CardRarity.COMMON,
    educationalNote: 'A hipotermia é uma emergência médica que requer aquecimento cuidadoso.',
    flavorText: '"Calor que restaura o equilíbrio vital."'
  },
  {
    id: 'metformin',
    name: 'Metformina',
    type: CardType.ACTION,
    description: 'Reduz produção hepática de glicose e aumenta sensibilidade à insulina.',
    imageUrl: '/assets/cards/metformin.png',
    effects: [
      {
        targetSystem: HomeostaticSystem.GLUCOSE,
        value: -15,
        type: 'CONTINUOUS',
        duration: 5
      }
    ],
    cost: 4,
    rarity: CardRarity.EPIC,
    educationalNote: 'Metformina é primeira linha para diabetes tipo 2, age reduzindo gliconeogênese.',
    flavorText: '"Controle metabólico refinado."'
  },
  {
    id: 'electrolyte-balance',
    name: 'Balanceamento Eletrolítico',
    type: CardType.ACTION,
    description: 'Restaura o equilíbrio eletrolítico afetando pH sanguíneo.',
    imageUrl: '/assets/cards/electrolytes.png',
    effects: [
      {
        targetSystem: HomeostaticSystem.PH,
        value: 0.1,
        type: 'INSTANT'
      }
    ],
    cost: 2,
    rarity: CardRarity.COMMON,
    educationalNote: 'Sódio, potássio e bicarbonato mantêm o pH e função celular.',
    flavorText: '"Os minerais que equilibram a vida."'
  },
  {
    id: 'stress-response',
    name: 'Resposta ao Estresse',
    type: CardType.ACTION,
    description: 'Ativa sistema endócrino para manter homeostase sob estresse.',
    imageUrl: '/assets/cards/stress.png',
    effects: [
      {
        targetSystem: HomeostaticSystem.GLUCOSE,
        value: 20,
        type: 'INSTANT'
      },
      {
        targetSystem: HomeostaticSystem.TEMPERATURE,
        value: 0.3,
        type: 'INSTANT'
      }
    ],
    cost: 3,
    rarity: CardRarity.RARE,
    educationalNote: 'Cortisol e adrenalina mobilizam energia para enfrentar desafios.',
    flavorText: '"O corpo em estado de alerta máximo."'
  },

  // Cartas de Evento
  {
    id: 'hyperglycemia-crisis',
    name: 'Crise de Hiperglicemia',
    type: CardType.EVENT,
    description: 'Açúcar no sangue dispara perigosamente! Responda rapidamente.',
    imageUrl: '/assets/cards/hyperglycemia.png',
    effects: [
      {
        targetSystem: HomeostaticSystem.GLUCOSE,
        value: 50,
        type: 'INSTANT'
      }
    ],
    cost: 0,
    rarity: CardRarity.COMMON,
    educationalNote: 'Hiperglicemia >250mg/dL requer intervenção imediata para prevenir cetoacidose.',
    flavorText: '"O doce veneno que ameaça o equilíbrio."'
  },
  {
    id: 'acidosis-attack',
    name: 'Ataque de Acidose',
    type: CardType.EVENT,
    description: 'pH sanguíneo cai drasticamente! Neutralize rapidamente.',
    imageUrl: '/assets/cards/acidosis.png',
    effects: [
      {
        targetSystem: HomeostaticSystem.PH,
        value: -0.3,
        type: 'INSTANT'
      }
    ],
    cost: 0,
    rarity: CardRarity.RARE,
    educationalNote: 'Acidose metabólica pH <7.35 pode levar à disfunção orgânica severa.',
    flavorText: '"Quando o sangue fica ácido demais, a vida hesita."'
  },
  {
    id: 'fever-spike',
    name: 'Pico Febril',
    type: CardType.EVENT,
    description: 'Temperatura corporal sobe perigosamente! Contenha a febre.',
    imageUrl: '/assets/cards/fever.png',
    effects: [
      {
        targetSystem: HomeostaticSystem.TEMPERATURE,
        value: 2.0,
        type: 'INSTANT'
      }
    ],
    cost: 0,
    rarity: CardRarity.COMMON,
    educationalNote: 'Febre >39°C pode causar danos celulares e requer resfriamento agressivo.',
    flavorText: '"O fogo interno que consome o equilíbrio."'
  },
  {
    id: 'hypoglycemic-shock',
    name: 'Choque Hipoglicêmico',
    type: CardType.EVENT,
    description: 'Glicose cai para níveis perigosos! Ataque imediato necessário.',
    imageUrl: '/assets/cards/hypoglycemia.png',
    effects: [
      {
        targetSystem: HomeostaticSystem.GLUCOSE,
        value: -40,
        type: 'INSTANT'
      }
    ],
    cost: 0,
    rarity: CardRarity.RARE,
    educationalNote: 'Hipoglicemia <50mg/dL é emergência médica com risco de coma.',
    flavorText: '"Quando o açúcar falta, a vida oscila."'
  },
  {
    id: 'heat-stroke',
    name: 'Insolação',
    type: CardType.EVENT,
    description: 'Exposição extrema ao calor! Core temperature crítico.',
    imageUrl: '/assets/cards/heatstroke.png',
    effects: [
      {
        targetSystem: HomeostaticSystem.TEMPERATURE,
        value: 3.5,
        type: 'INSTANT'
      }
    ],
    cost: 0,
    rarity: CardRarity.EPIC,
    educationalNote: 'Insolação >40°C é emergência médica com risco de falência orgânica.',
    flavorText: '"O calor que desafia os limites humanos."'
  },
  {
    id: 'diuretic-therapy',
    name: 'Terapia Diurética',
    type: CardType.ACTION,
    description: 'Elimina excesso de fluidos para auxiliar equilíbrio ácido-base.',
    imageUrl: '/assets/cards/diuretic.png',
    effects: [
      {
        targetSystem: HomeostaticSystem.PH,
        value: 0.1,
        type: 'CONTINUOUS',
        duration: 2
      }
    ],
    cost: 2,
    rarity: CardRarity.COMMON,
    educationalNote: 'Diuréticos ajudam na eliminação de ácidos através dos rins.',
    flavorText: '"Purificando o sangue, gota a gota."'
  },
  {
    id: 'glucose-iv',
    name: 'Glicose IV',
    type: CardType.ACTION,
    description: 'Administração intravenosa de glicose para hipoglicemia severa.',
    imageUrl: '/assets/cards/glucose-iv.png',
    effects: [
      {
        targetSystem: HomeostaticSystem.GLUCOSE,
        value: 40,
        type: 'INSTANT'
      }
    ],
    cost: 3,
    rarity: CardRarity.RARE,
    educationalNote: 'Glicose IV é o tratamento padrão-ouro para hipoglicemia grave.',
    flavorText: '"Energia vital correndo nas veias."'
  },
  {
    id: 'shivering-response',
    name: 'Resposta de Tremor',
    type: CardType.ACTION,
    description: 'Ativa termogênese muscular para combater hipotermia.',
    imageUrl: '/assets/cards/shivering.png',
    effects: [
      {
        targetSystem: HomeostaticSystem.TEMPERATURE,
        value: 1.2,
        type: 'CONTINUOUS',
        duration: 3
      }
    ],
    cost: 1,
    rarity: CardRarity.COMMON,
    educationalNote: 'O tremor é mecanismo natural de aquecimento por contração muscular.',
    flavorText: '"O corpo luta contra o frio."'
  }
];