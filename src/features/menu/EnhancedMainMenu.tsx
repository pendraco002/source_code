import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, BookOpen, Trophy, Settings, ChevronRight } from 'lucide-react';
import { GameDifficulty } from '../../core/domain/game.model';

interface EnhancedMainMenuProps {
  onStartGame: (difficulty: GameDifficulty, system: string) => void;
  onOpenTutorial: () => void;
  onOpenSettings: () => void;
  onViewLeaderboard: () => void;
}

const menuItems = [
  {
    id: 'play',
    title: 'Jogar',
    description: 'Inicie uma nova sessão de equilíbrio homeostático',
    icon: Play,
    color: 'from-cyan-500 to-blue-500',
    action: 'game'
  },
  {
    id: 'tutorial',
    title: 'Tutorial',
    description: 'Aprenda como equilibrar os sistemas do corpo',
    icon: BookOpen,
    color: 'from-green-500 to-emerald-500',
    action: 'tutorial'
  },
  {
    id: 'leaderboard',
    title: 'Ranking',
    description: 'Veja as melhores pontuações',
    icon: Trophy,
    color: 'from-yellow-500 to-orange-500',
    action: 'leaderboard'
  },
  {
    id: 'settings',
    title: 'Configurações',
    description: 'Ajuste dificuldade e preferências',
    icon: Settings,
    color: 'from-purple-500 to-pink-500',
    action: 'settings'
  }
];

const systems = [
  { id: 'glucose', name: 'Sistema Glicêmico', icon: '🩸', description: 'Gerencie níveis de glicose' },
  { id: 'ph', name: 'Sistema Ácido-Base', icon: '⚗️', description: 'Equilibre o pH sanguíneo' },
  { id: 'temperature', name: 'Sistema Térmico', icon: '🌡️', description: 'Controle temperatura corporal' },
  { id: 'combined', name: 'Sistema Completo', icon: '🧬', description: 'Todos os sistemas juntos' }
];

const difficulties = [
  { id: 'easy', name: 'Fácil', description: 'Eventos menos frequentes, maior margem de erro', color: 'bg-green-500/20' },
  { id: 'medium', name: 'Médio', description: 'Desafio equilibrado para aprendizado', color: 'bg-yellow-500/20' },
  { id: 'hard', name: 'Difícil', description: 'Eventos rápidos e margem estreita', color: 'bg-red-500/20' }
];

export const EnhancedMainMenu: React.FC<EnhancedMainMenuProps> = ({
  onStartGame,
  onOpenTutorial,
  onOpenSettings,
  onViewLeaderboard
}) => {
  const [selectedSystem, setSelectedSystem] = useState<string>('combined');
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>('medium');
  const [showGameSetup, setShowGameSetup] = useState(false);

  const handleAction = (action: string) => {
    switch (action) {
      case 'game':
        setShowGameSetup(true);
        break;
      case 'tutorial':
        onOpenTutorial();
        break;
      case 'leaderboard':
        onViewLeaderboard();
        break;
      case 'settings':
        onOpenSettings();
        break;
    }
  };

  const handleStartGame = () => {
    onStartGame(selectedDifficulty, selectedSystem);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800">
      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Equilibrium
              </span>
            </h1>
            <p className="text-xl text-gray-300">
              Domine a arte da homeostase corporal
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Jogo educativo de fisiologia e anatomia
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!showGameSetup ? (
              <motion.div
                key="main-menu"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAction(item.action)}
                    className={`
                      relative p-8 rounded-xl bg-gradient-to-br ${item.color} 
                      backdrop-blur-md border border-white/10 cursor-pointer
                      transition-all duration-200 hover:shadow-2xl hover:shadow-cyan-500/20
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white/10 rounded-lg">
                          <item.icon size={32} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{item.title}</h3>
                          <p className="text-gray-200 text-sm">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="text-white/60" size={24} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="game-setup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Configurar Nova Partida</h2>
                
                {/* System Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Sistema Homeostático</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {systems.map((system) => (
                      <motion.div
                        key={system.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedSystem(system.id)}
                        className={`
                          p-4 rounded-lg cursor-pointer border-2 transition-all duration-200
                          ${selectedSystem === system.id 
                            ? 'border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/20' 
                            : 'border-white/20 hover:border-white/40 hover:bg-white/5'}
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{system.icon}</span>
                          <div>
                            <div className="font-semibold text-white">{system.name}</div>
                            <div className="text-sm text-gray-300">{system.description}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Difficulty Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Dificuldade</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {difficulties.map((diff) => (
                      <motion.div
                        key={diff.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedDifficulty(diff.id as GameDifficulty)}
                        className={`
                          p-4 rounded-lg cursor-pointer border-2 transition-all duration-200
                          ${selectedDifficulty === diff.id 
                            ? 'border-cyan-400 shadow-lg shadow-cyan-500/20' 
                            : 'border-white/20 hover:border-white/40'}
                          ${diff.color}
                        `}
                      >
                        <div className="font-semibold text-white">{diff.name}</div>
                        <div className="text-sm text-gray-300">{diff.description}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowGameSetup(false)}
                    className="px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 text-white rounded-lg transition-colors border border-gray-400/30"
                  >
                    Voltar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartGame}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all shadow-lg shadow-cyan-500/30"
                  >
                    🎮 Iniciar Jogo
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};