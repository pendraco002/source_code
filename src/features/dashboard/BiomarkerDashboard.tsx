import React from 'react';
import { motion } from 'framer-motion';
import { Biomarker, HomeostaticSystem } from '../../core/domain/biomarker.model';

interface BiomarkerDashboardProps {
  biomarkers: Biomarker[];
  className?: string;
}

export const BiomarkerDashboard: React.FC<BiomarkerDashboardProps> = ({
  biomarkers,
  className = ''
}) => {
  // Add safety check for biomarkers array
  if (!biomarkers || !Array.isArray(biomarkers)) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h2 className="text-xl font-bold text-white mb-4">Sistemas Homeostáticos</h2>
        <div className="text-center text-gray-400">
          Carregando dados dos biomarcadores...
        </div>
      </div>
    );
  }

  // Filter out any null or undefined biomarkers
  const validBiomarkers = biomarkers.filter(biomarker => biomarker && biomarker.system);
  const getSystemIcon = (system: HomeostaticSystem) => {
    switch (system) {
      case HomeostaticSystem.GLUCOSE:
        return '🩸';
      case HomeostaticSystem.PH:
        return '⚗️';
      case HomeostaticSystem.TEMPERATURE:
        return '🌡️';
      default:
        return '📊';
    }
  };

  const getStatusColor = (biomarker: Biomarker) => {
    const percentage = getPercentage(biomarker);
    
    if (biomarker.isCritical) {
      return 'from-red-500/30 to-red-600/30 border-red-400';
    }
    
    if (percentage < 20 || percentage > 80) {
      return 'from-yellow-500/30 to-orange-500/30 border-yellow-400';
    }
    
    return 'from-green-500/30 to-emerald-500/30 border-green-400';
  };

  const getPercentage = (biomarker: Biomarker) => {
    const [min, max] = biomarker.normalRange;
    const range = max - min;
    const percentage = ((biomarker.currentValue - min) / range) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  const getTrendIcon = (trend: Biomarker['trend']) => {
    switch (trend) {
      case 'increasing': return '↗️';
      case 'decreasing': return '↘️';
      case 'stable': return '➡️';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-bold text-white mb-4">Sistemas Homeostáticos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {validBiomarkers.map((biomarker) => (
          <motion.div
            key={biomarker.system}
            className={`
              relative p-6 rounded-xl bg-gradient-to-br ${getStatusColor(biomarker)}
              backdrop-blur-md border-2 shadow-lg
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getSystemIcon(biomarker.system)}</span>
                <h3 className="text-lg font-semibold text-white">
                  {biomarker.name}
                </h3>
              </div>
              <span className="text-sm text-gray-300">{getTrendIcon(biomarker.trend)}</span>
            </div>

            {/* Value Display */}
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-white">
                {biomarker.currentValue.toFixed(1)}
              </div>
              <div className="text-sm text-gray-300">{biomarker.unit}</div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>Normal: {biomarker.normalRange[0]}-{biomarker.normalRange[1]}</span>
                <span>{getPercentage(biomarker).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-3">
                <motion.div
                  className={`
                    h-3 rounded-full transition-all duration-500
                    ${biomarker.isCritical ? 'bg-red-400' : 'bg-cyan-400'}
                  `}
                  initial={{ width: 0 }}
                  animate={{ width: `${getPercentage(biomarker)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Critical Warning */}
            {biomarker.isCritical && (
              <motion.div
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                CRÍTICO
              </motion.div>
            )}

            {/* Status */}
            <div className="text-center">
              <div className={`
                text-sm font-medium px-3 py-1 rounded-full inline-block
                ${biomarker.isCritical 
                  ? 'bg-red-500/20 text-red-300 border border-red-500/50' 
                  : 'bg-green-500/20 text-green-300 border border-green-500/50'}
              `}>
                {biomarker.isCritical ? 'ESTADO CRÍTICO' : 'ESTÁVEL'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};