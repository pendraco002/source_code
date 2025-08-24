# Equilibrium v1.0 - Sistema de Jogo Educativo

## Visão Geral
Aplicação web educativa de fisiologia que simula o equilíbrio homeostático do corpo humano, desenvolvida em React + TypeScript com glassmorphism, PWA e sistema completo de lançamento.

## Comandos de Desenvolvimento
- `npm install` - Instalar dependências
- `npm run build` - Build de produção (OBRIGATÓRIO após mudanças)
- `npm run dev` - Servidor de desenvolvimento (não usar em produção)
- `npm run test` - Executar suíte de testes
- `npm run test:coverage` - Testes com cobertura

## Arquitetura do Sistema

### Estrutura de Pastas Principais
```
src/
├── core/
│   ├── domain/          # Modelos de dados TypeScript
│   │   ├── card.model.ts
│   │   ├── biomarker.model.ts
│   │   └── game.model.ts
│   └── data/            # Dados estáticos do jogo
├── features/
│   ├── gameplay/        # Lógica central do jogo
│   │   └── GameEngine.ts
│   ├── onboarding/      # Tutorial e conteúdo educacional
│   ├── menu/           # Menu principal e navegação
│   ├── cards/          # Componentes de cartas
│   ├── dashboard/      # Dashboard de biomarcadores
│   └── results/        # Telas de resultado
├── shared/
│   ├── ui/             # Componentes reutilizáveis
│   ├── hooks/          # Hooks customizados
│   ├── audio/          # Sistema de áudio (AudioManager)
│   ├── animations/     # Variantes de animação (Framer Motion)
│   └── analytics/      # Sistema de analytics (AnalyticsManager)
├── pages/              # Landing Page e páginas promocionais
├── marketing/          # Press Kit e materiais promocionais
├── feedback/           # Sistema de feedback beta
├── pwa/               # Service Worker e configurações PWA
├── assets/            # Gerador de screenshots e assets
└── test/              # Configuração e utilitários de teste
```

### Fluxo de Navegação
1. **Landing Page** → Página promocional com CTA para jogo
2. **Menu Principal** → Seleção de sistema e dificuldade
3. **Tutorial (opcional)** → Guia interativo com overlays
4. **GamePlay** → Sessão de jogo ativa
5. **Resultados** → Análise de desempenho + aprendizado

### Sistema de Pontuação
- **Base**: 1000 pontos
- **Bônus de Tempo**: 500 - (turnos × 20)
- **Bônus de Estabilidade**: 100 × sistemas equilibrados
- **Eficiência**: Base/tempo gasto

### Componentes Principais
- **LandingPage**: Página promocional profissional
- **MainMenu**: Seleção de dificuldade e sistema
- **TutorialSystem**: Overlays contextuais com posicionamento dinâmico
- **GameLayout**: Interface de jogo com dashboard e mão de cartas
- **ResultScreen**: Análise detalhada com conteúdo educacional
- **BetaFeedbackSystem**: Sistema completo de coleta de feedback

## Sistemas Implementados
- Sistema Glicêmico (70-110 mg/dL)
- Sistema Ácido-Base (pH 7.35-7.45)
- Sistema Térmico (36.5-37.5°C)
- Sistema Combinado (todos os sistemas)

## Dificuldades
- **Fácil**: Eventos menos frequentes, margem ampla
- **Médio**: Desafio equilibrado para aprendizado
- **Difícil**: Eventos rápidos, margem estreita

## Sistemas de Produção Implementados

### Analytics e Métricas
- **AnalyticsManager**: Sistema completo de tracking com localStorage
- Métricas de engajamento, sessões, conversão
- Tracking de eventos de jogo, UI e erros
- Exportação de dados para análise

### PWA (Progressive Web App)
- **manifest.json**: Configuração completa para instalação
- **ServiceWorker**: Cache inteligente, offline, background sync
- Estratégias de cache diferenciadas por tipo de conteúdo
- Suporte a push notifications e periodic sync

### Marketing e Lançamento
- **Landing Page**: Página promocional profissional com analytics
- **Press Kit**: Materiais para imprensa, assets e posts sociais
- **Screenshots Generator**: Geração automática de assets para stores
- Descrições otimizadas para iOS, Android e Web

### Beta Testing
- **Sistema de Feedback**: Modal completo com tipos de feedback
- Captura de screenshots para bug reports
- Painel administrativo para gerenciamento
- Integração com analytics para métricas

### Testes
- **Vitest + React Testing Library**: Configuração completa
- Testes unitários para modelos de dados e lógica de jogo
- Testes de componentes React
- Simuladores para testes manuais
- Cobertura de código integrada

## Preparação para Stores

### Apple App Store
- Screenshots otimizados para iPhone (1290x2796)
- Ícones em alta resolução (1024x1024)
- Descrições e keywords otimizadas
- Metadados educacionais

### Google Play Store  
- Screenshots para phone (1080x1920) e tablet (2560x1600)
- Assets adaptativos e responsivos
- Descrição longa otimizada para SEO
- Tags e categorização educacional

### Web/PWA
- Meta tags otimizadas para SEO
- Open Graph para redes sociais
- Manifest.json completo para instalação
- Service Worker para performance

## Comandos de Produção
```bash
# Build completo com verificação
npm install && npm run build

# Testes antes do deploy
npm run test && npm run test:coverage

# Validação de PWA (usar ferramentas do Chrome DevTools)
# Lighthouse audit recomendado antes do lançamento
```

## Monitoramento Pós-Lançamento
- Analytics via localStorage (sem dependências externas)
- Feedback collection integrado
- Performance metrics no Service Worker
- Error tracking via AnalyticsManager

## Próximas Etapas (Pós-Lançamento)
- Integração com Youware Backend para persistência na nuvem
- Sistema de autenticação de usuários
- Leaderboard global e social features
- Mais sistemas fisiológicos (Cardiovascular, Respiratório)
- Modo multiplayer cooperativo
- Analytics avançado com backend