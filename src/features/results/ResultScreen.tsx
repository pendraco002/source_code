import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, Target, BookOpen, RotateCcw, ArrowRight } from 'lucide-react';
import { GameSession } from '../../core/domain/game.model';
import { educationalContent } from '../onboarding/EducationalContent';

interface ResultScreenProps {
  session: GameSession;
  onReplay: () => void;
  onNextLevel: () => void;
  onBackToMenu: () => void;
}

interface ResultMetrics {
  totalScore: number;
  accuracy: number;
  timeBonus: number;
  stabilityBonus: number;
  efficiency: number;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  session,
  onReplay,
  onNextLevel,
  onBackToMenu
}) => {
  // Add safety check for session
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 flex items-center justify-center p-4">
        <div className="text-white text-center">
          <p>Erro: Sessão de jogo não encontrada</p>
          <button 
            onClick={onBackToMenu}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Voltar ao Menu
          </button>
        </div>
      </div>
    );
  }

  const calculateMetrics = (): ResultMetrics => {
    const baseScore = 1000;
    const accuracy = Math.min(100, (session.score / baseScore) * 100);
    const timeBonus = Math.max(0, 500 - (session.turnCount * 20));
    
    // Add safety check for currentState
    const systems = session.currentState ? Object.values(session.currentState).filter(s => s != null) : [];
    const stableSystems = systems.filter(s => 
      s && s.currentValue >= s.normalRange[0] && s.currentValue <= s.normalRange[1]
    ).length;
    const stabilityBonus = stableSystems * 100;
    
    const totalScore = session.score + timeBonus + stabilityBonus;
    const efficiency = Math.min(100, (baseScore / (Math.max(1, session.turnCount) * 50)) * 100);

    return {
      totalScore,
      accuracy,
      timeBonus,
      stabilityBonus,
      efficiency
    };
  };

  const metrics = calculateMetrics();

  const getPerformanceGrade = (score: number) => {
    if (score >= 2000) return { grade: 'A+', color: 'text-green-400', description: 'Mestre da Homeostase' };
    if (score >= 1500) return { grade: 'A', color: 'text-green-300', description: 'Excelente Controle' };
    if (score >= 1000) return { grade: 'B', color: 'text-yellow-300', description: 'Bom Desempenho' };
    if (score >= 500) return { grade: 'C', color: 'text-orange-300', description: 'Satisfatório' };
    return { grade: 'D', color: 'text-red-300', description: 'Necessita Prática' };
  };

  const performance = getPerformanceGrade(metrics.totalScore);

  const getEducationalSummary = () => {
    if (!session?.currentState) return [];
    
    const systems = Object.keys(session.currentState);
    const summary = systems.map(system => {
      const content = educationalContent[system];
      const value = session.currentState[system as keyof typeof session.currentState];
      
      // Add safety check for undefined value
      if (!value) {
        return {
          system: system,
          finalValue: 0,
          status: 'Desconhecido',
          keyLearning: 'Continue aprendendo!'
        };
      }
      
      return {
        system: content?.system || system,
        finalValue: value.currentValue,
        status: value.isCritical ? 'Crítico' : 'Estável',
        keyLearning: content?.keyConcepts[0] || 'Continue aprendendo!'
      };
    }).filter(item => item !== null); // Remove any null entries

    return summary;
  };

  const educationalSummary = getEducationalSummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="mb-4"
          >
            <Award size={80} className={`mx-auto ${performance.color}`} />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-white mb-2">
            {session.status === 'VITORIA' ? 'Vitória!' : 'Fim de Jogo'}
          </h1>
          <p className={`text-2xl font-semibold ${performance.color}`}>
            {performance.grade} - {performance.description}
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/10"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Resumo de Pontuação</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Target className="text-cyan-400" size={24} />
              <div>
                <div className="text-sm text-gray-300">Pontuação Base</div>
                <div className="text-xl font-bold text-white">{session.score}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="text-green-400" size={24} />
              <div>
                <div className="text-sm text-gray-300">Bônus de Tempo</div>
                <div className="text-xl font-bold text-white">+{metrics.timeBonus}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-400 rounded-full"></div>
              <div>
                <div className="text-sm text-gray-300">Bônus de Estabilidade</div>
                <div className="text-xl font-bold text-white">+{metrics.stabilityBonus}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Award className="text-yellow-400" size={24} />
              <div>
                <div className="text-sm text-gray-300">Pontuação Total</div>
                <div className="text-2xl font-bold text-white">{metrics.totalScore}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-white/5 rounded-lg">
            <div className="text-sm text-gray-300">Turnos: {session.turnCount}</div>
            <div className="text-sm text-gray-300">Eficiência: {metrics.efficiency.toFixed(1)}%</div>
          </div>
        </motion.div>

        {/* Educational Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/10"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <BookOpen className="mr-2" size={24} />
            O que você aprendeu
          </h2>
          
          <div className="space-y-4">
            {educationalSummary.map((item, index) => (
              <motion.div
                key={item.system}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="p-4 bg-white/5 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">{item.system}</h3>
                    <p className="text-sm text-gray-300">Valor final: {item.finalValue.toFixed(1)}</p>
                    <p className="text-sm text-gray-300">Status: {item.status}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Aprendizado-chave:</div>
                    <div className="text-sm text-cyan-300">{item.keyLearning}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReplay}
            className="flex items-center space-x-2 px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 rounded-lg text-white transition-colors"
          >
            <RotateCcw size={20} />
            <span>Jogar Novamente</span>
          </motion.button>

          {session.status === 'VITORIA' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNextLevel}
              className="flex items-center space-x-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-white transition-colors"
            >
              <ArrowRight size={20} />
              <span>Próximo Nível</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToMenu}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-400/30 rounded-lg text-white transition-colors"
          >
            <span>Menu Principal</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};