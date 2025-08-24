import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Activity, Heart } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  duration = 3000 
}) => {
  const [currentPhase, setCurrentPhase] = useState<'logo' | 'tagline' | 'loading'>('logo');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentPhase('tagline'), 1000);
    const timer2 = setTimeout(() => {
      setCurrentPhase('loading');
      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(onComplete, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center z-50">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        <AnimatePresence mode="wait">
          {currentPhase === 'logo' && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              {/* Logo with floating elements */}
              <div className="relative">
                <motion.div
                  className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mb-6 shadow-2xl"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <BookOpen size={48} className="text-white" />
                </motion.div>

                {/* Floating icons */}
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                  animate={{ 
                    y: [-5, 5, -5],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    delay: 0.5
                  }}
                >
                  <Activity size={16} className="text-white" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-2 -left-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                  animate={{ 
                    y: [5, -5, 5],
                    rotate: [0, -180, -360]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    delay: 1
                  }}
                >
                  <Heart size={16} className="text-white" />
                </motion.div>
              </div>

              <motion.h1 
                className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Equilibrium
              </motion.h1>
            </motion.div>
          )}

          {currentPhase === 'tagline' && (
            <motion.div
              key="tagline"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Equilibrium
              </h1>
              <motion.p 
                className="text-2xl text-gray-300 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Guardiões da Homeostase
              </motion.p>
              <motion.p 
                className="text-lg text-gray-400 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Domine a fisiologia através do gameplay
              </motion.p>
            </motion.div>
          )}

          {currentPhase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
                Equilibrium
              </h1>
              
              {/* Loading progress */}
              <div className="w-80 mx-auto mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Carregando sistemas...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Loading states */}
              <motion.div 
                className="text-gray-400 text-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {progress < 30 && "Inicializando biomarcadores..."}
                {progress >= 30 && progress < 60 && "Preparando sistemas fisiológicos..."}
                {progress >= 60 && progress < 90 && "Carregando cartas educativas..."}
                {progress >= 90 && "Finalizando configuração..."}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom branding */}
      <motion.div 
        className="absolute bottom-8 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 2 }}
      >
        <p>Powered by Advanced Educational Technology</p>
      </motion.div>
    </div>
  );
};