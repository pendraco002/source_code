import React from 'react';
import { motion } from 'framer-motion';
import { BiomarkerDashboard } from '../../features/dashboard/BiomarkerDashboard';
import { PlayerHand } from '../../features/gameplay/PlayerHand';
import { GameSession, HomeostaticState } from '../../core/domain/game.model';
import { Biomarker, HomeostaticSystem } from '../../core/domain/biomarker.model';
import { Card } from '../../core/domain/card.model';

interface GameLayoutProps {
  session: GameSession;
  onPlayCard: (card: Card) => void;
  onDrawCard: () => void;
  onEndTurn: () => void;
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  session,
  onPlayCard,
  onDrawCard,
  onEndTurn
}) => {
  const getSystemName = (system: HomeostaticSystem): string => {
    switch (system) {
      case HomeostaticSystem.GLUCOSE:
        return 'Glicemia';
      case HomeostaticSystem.PH:
        return 'pH Sanguíneo';
      case HomeostaticSystem.TEMPERATURE:
        return 'Temperatura Corporal';
      default:
        return system;
    }
  };

  // Convert game state to biomarker format
  const biomarkers: Biomarker[] = Object.entries(session.currentState || {})
    .filter(([key, system]) => system != null)
    .map(([key, system]) => ({
      system: key as HomeostaticSystem,
      name: getSystemName(key as HomeostaticSystem),
      currentValue: system.currentValue,
      normalRange: system.normalRange,
      criticalRange: system.criticalRange,
      unit: system.unit,
      isCritical: system.isCritical,
      trend: system.trend,
      lastUpdate: system.lastUpdate
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 p-4">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Equilibrium</h1>
          <div className="flex items-center space-x-4">
            <div className="text-white">
              <span className="text-sm text-gray-300">Turno:</span> {session.turnCount}
            </div>
            <div className="text-white">
              <span className="text-sm text-gray-300">Pontuação:</span> {session.score}
            </div>
            <div className="text-white">
              <span className="text-sm text-gray-300">Status:</span> {session.status}
            </div>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Dashboard */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <BiomarkerDashboard biomarkers={biomarkers} />
        </motion.div>

        {/* Right Panel - Event/Info */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {session.currentEvent && (
            <div className="bg-red-500/20 backdrop-blur-md rounded-xl p-4 border border-red-400/30">
              <h3 className="text-lg font-semibold text-red-300 mb-2">
                Evento Atual: {session.currentEvent.title}
              </h3>
              <p className="text-sm text-gray-300">{session.currentEvent.description}</p>
            </div>
          )}

          {/* Game Controls */}
          <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-4 space-y-3">
            <h3 className="text-lg font-semibold text-white mb-3">Controles</h3>
            
            <button
              onClick={onDrawCard}
              className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 py-2 px-4 rounded-lg transition-colors"
            >
              Comprar Carta
            </button>
            
            <button
              onClick={onEndTurn}
              className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 py-2 px-4 rounded-lg transition-colors"
            >
              Encerrar Turno
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Panel - Player Hand */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <PlayerHand
          cards={session.hand}
          onPlayCard={onPlayCard}
        />
      </motion.div>
    </div>
  );
};