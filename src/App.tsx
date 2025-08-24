import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedMainMenu } from './features/menu/EnhancedMainMenu';
import { GameLayout } from './shared/ui/GameLayout';
import { ResultScreen } from './features/results/ResultScreen';
import { TutorialSystem } from './features/onboarding/TutorialSystem';
import { SettingsScreen } from './features/settings/SettingsScreen';
import { GameSession, GameStatus, GameDifficulty } from './core/domain/game.model';
import { HomeostaticSystem } from './core/domain/biomarker.model';
import { GameEngine } from './features/gameplay/GameEngine';
import { initialCards } from './core/data/card-data';
import { useGameSave } from './shared/hooks/useGameSave';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'menu' | 'game' | 'results' | 'tutorial' | 'settings' | 'leaderboard'>('menu');
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  const gameEngine = GameEngine.getInstance();
  const gameSave = useGameSave();

  const createNewGameSession = (difficulty: GameDifficulty, system: string) => {
    const newSession: GameSession = {
      id: Date.now().toString(),
      playerId: 'player-1',
      status: GameStatus.IN_PROGRESS,
      currentState: {
        glucose: {
          system: HomeostaticSystem.GLUCOSE,
          name: 'Glicemia',
          currentValue: 90,
          normalRange: [70, 110],
          criticalRange: [50, 140],
          unit: 'mg/dL',
          isCritical: false,
          trend: 'stable',
          lastUpdate: new Date()
        },
        ph: {
          system: HomeostaticSystem.PH,
          name: 'pH Sanguíneo',
          currentValue: 7.4,
          normalRange: [7.35, 7.45],
          criticalRange: [7.2, 7.6],
          unit: '',
          isCritical: false,
          trend: 'stable',
          lastUpdate: new Date()
        },
        temperature: {
          system: HomeostaticSystem.TEMPERATURE,
          name: 'Temperatura',
          currentValue: 37.0,
          normalRange: [36.5, 37.5],
          criticalRange: [35.0, 39.0],
          unit: '°C',
          isCritical: false,
          trend: 'stable',
          lastUpdate: new Date()
        }
      },
      hand: [],
      deck: [...initialCards.filter(card => card.type === 'ACAO')],
      discardPile: [],
      score: 0,
      turnCount: 0,
      startTime: new Date(),
      lastSave: new Date(),
      difficulty
    };

    // Draw initial cards
    let updatedSession = newSession;
    for (let i = 0; i < 5; i++) {
      const result = gameEngine.drawCard(updatedSession);
      updatedSession = result.newSession;
    }

    setGameSession(newSession);
    setCurrentScreen('game');
  };

  const handlePlayCard = async (card: any) => {
    if (!gameSession || gameSession.status !== GameStatus.IN_PROGRESS) return;

    const result = gameEngine.processTurn(gameSession, card);
    setGameSession(result.newSession);

    // Auto-save session after playing card
    await gameSave.saveSession(result.newSession);

    // Check if game should end
    if (result.newSession.status !== GameStatus.IN_PROGRESS) {
      setTimeout(() => {
        setCurrentScreen('results');
      }, 2000);
    }
  };

  const handleDrawCard = () => {
    if (!gameSession || gameSession.status !== GameStatus.IN_PROGRESS) return;

    const result = gameEngine.drawCard(gameSession);
    setGameSession(result.newSession);
  };

  const handleEndTurn = async () => {
    if (!gameSession) return;

    const event = gameEngine.generateRandomEvent();
    const newSession = { ...gameSession };
    
    event.effects.forEach(effect => {
      const systemKey = effect.system as keyof typeof gameSession.currentState;
      const system = newSession.currentState[systemKey];
      const newValue = system.currentValue + effect.value;
      
      newSession.currentState[systemKey] = {
        ...system,
        currentValue: newValue,
        isCritical: newValue < system.criticalRange[0] || newValue > system.criticalRange[1],
        lastUpdate: new Date()
      };
    });

    newSession.currentEvent = event;
    newSession.score = gameEngine.getScore(newSession);
    newSession.turnCount += 1;
    
    setGameSession(newSession);
    
    // Auto-save session after each turn
    await gameSave.saveSession(newSession);
  };

  const handleReplay = () => {
    if (gameSession) {
      createNewGameSession(gameSession.difficulty, 'combined');
    }
  };

  const handleNextLevel = () => {
    const nextDifficulty = gameSession?.difficulty === 'easy' ? 'medium' : 
                          gameSession?.difficulty === 'medium' ? 'hard' : 'hard';
    createNewGameSession(nextDifficulty, 'combined');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
    setGameSession(null);
  };

  const handleStartGame = (difficulty: GameDifficulty, system: string) => {
    createNewGameSession(difficulty, system);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return (
          <EnhancedMainMenu
            onStartGame={handleStartGame}
            onOpenTutorial={() => setShowTutorial(true)}
            onOpenSettings={() => setCurrentScreen('settings')}
            onViewLeaderboard={() => setCurrentScreen('leaderboard')}
          />
        );
      case 'game':
        return gameSession ? (
          <GameLayout
            session={gameSession}
            onPlayCard={handlePlayCard}
            onDrawCard={handleDrawCard}
            onEndTurn={handleEndTurn}
          />
        ) : null;
      case 'results':
        return gameSession ? (
          <ResultScreen
            session={gameSession}
            onReplay={handleReplay}
            onNextLevel={handleNextLevel}
            onBackToMenu={handleBackToMenu}
          />
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 flex items-center justify-center">
            <div className="text-white text-center">
              <p>Erro: Dados da sessão não encontrados</p>
              <button onClick={handleBackToMenu} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
                Voltar ao Menu
              </button>
            </div>
          </div>
        );
      case 'settings':
        return (
          <SettingsScreen
            onBack={handleBackToMenu}
          />
        );
      case 'leaderboard':
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-3xl font-bold mb-4">🏆 Ranking</h2>
              <p className="text-gray-300 mb-6">Sistema de ranking em desenvolvimento</p>
              <button onClick={handleBackToMenu} className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                Voltar ao Menu
              </button>
            </div>
          </div>
        );
      default:
        return <EnhancedMainMenu onStartGame={handleStartGame} onOpenTutorial={() => setShowTutorial(true)} onOpenSettings={() => setCurrentScreen('settings')} onViewLeaderboard={() => setCurrentScreen('leaderboard')} />;
    }
  };

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      <TutorialSystem
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={() => {
          setShowTutorial(false);
          createNewGameSession('easy', 'combined');
        }}
      />
    </div>
  );
}

export default App;