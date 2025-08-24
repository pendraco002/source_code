import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Target, Trophy, Users, PlayCircle, SkipForward } from 'lucide-react';

interface WelcomeScreenProps {
  onStartTutorial: () => void;
  onSkipToGame: () => void;
}

interface WelcomeSlide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  visual?: React.ReactNode;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartTutorial,
  onSkipToGame
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: WelcomeSlide[] = [
    {
      id: 'intro',
      title: 'Bem-vindo ao Equilibrium!',
      description: 'O jogo educativo que transforma o aprendizado de fisiologia em uma experiência envolvente e divertida.',
      icon: <BookOpen size={64} />,
      color: 'from-blue-500 to-purple-600',
      visual: (
        <div className="relative">
          <motion.div
            className="w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full flex items-center justify-center border-2 border-blue-400/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <BookOpen size={48} className="text-blue-400" />
          </motion.div>
          {/* Orbiting elements */}
          {[0, 120, 240].map((rotation, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
            >
              <motion.div
                className="w-8 h-8 bg-blue-400 rounded-full absolute"
                style={{ transform: `translateY(-60px) rotate(${rotation}deg)` }}
              />
            </motion.div>
          ))}
        </div>
      )
    },
    {
      id: 'homeostasis',
      title: 'O que é Homeostase?',
      description: 'Aprenda como o corpo humano mantém o equilíbrio interno através de sistemas complexos e fascinantes.',
      icon: <Target size={64} />,
      color: 'from-green-500 to-blue-600',
      visual: (
        <div className="grid grid-cols-3 gap-4">
          {['🩸', '🌡️', '⚗️'].map((emoji, i) => (
            <motion.div
              key={i}
              className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center text-2xl"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      )
    },
    {
      id: 'gameplay',
      title: 'Jogue e Aprenda',
      description: 'Use cartas estratégicas para equilibrar os biomarcadores do corpo. Cada decisão ensina conceitos reais de fisiologia.',
      icon: <PlayCircle size={64} />,
      color: 'from-purple-500 to-pink-600',
      visual: (
        <div className="relative">
          <motion.div
            className="flex space-x-2"
            animate={{ x: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-12 h-16 bg-gradient-to-b from-purple-400/30 to-pink-600/30 rounded-lg border border-purple-400/50"
                animate={{ 
                  y: [0, -5, 0],
                  rotateY: [0, 10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
          <motion.div
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-pink-400"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight size={20} />
          </motion.div>
        </div>
      )
    },
    {
      id: 'progress',
      title: 'Acompanhe seu Progresso',
      description: 'Desbloqueie conquistas, colete cartas e torne-se um mestre dos sistemas homeostáticos!',
      icon: <Trophy size={64} />,
      color: 'from-yellow-500 to-orange-600',
      visual: (
        <div className="space-y-2">
          {[100, 80, 60].map((width, i) => (
            <motion.div
              key={i}
              className="h-3 bg-gradient-to-r from-yellow-400/30 to-orange-600/30 rounded-full overflow-hidden"
              style={{ width: '120px' }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${width}%` }}
                transition={{ duration: 1.5, delay: i * 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onStartTutorial();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-8 bg-blue-400' 
                    : index < currentSlide 
                      ? 'w-2 bg-green-400' 
                      : 'w-2 bg-gray-600'
                }`}
                layoutId={`progress-${index}`}
              />
            ))}
          </div>
        </div>

        {/* Main content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Visual element */}
            <div className="flex justify-center mb-8">
              {currentSlideData.visual}
            </div>

            {/* Icon */}
            <motion.div
              className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${currentSlideData.color} rounded-full mb-6`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="text-white">
                {currentSlideData.icon}
              </div>
            </motion.div>

            {/* Content */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {currentSlideData.title}
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              {currentSlideData.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          {/* Skip button */}
          <motion.button
            onClick={onSkipToGame}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SkipForward size={20} />
            Pular para o jogo
          </motion.button>

          {/* Navigation buttons */}
          <div className="flex gap-4">
            {currentSlide > 0 && (
              <motion.button
                onClick={prevSlide}
                className="px-6 py-3 border border-white/30 text-white rounded-full hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Anterior
              </motion.button>
            )}
            
            <motion.button
              onClick={nextSlide}
              className={`px-8 py-3 bg-gradient-to-r ${currentSlideData.color} text-white rounded-full font-semibold flex items-center gap-2 hover:shadow-lg transition-all`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentSlide === slides.length - 1 ? 'Começar Tutorial' : 'Próximo'}
              <ArrowRight size={20} />
            </motion.button>
          </div>
        </div>

        {/* Bottom info */}
        <motion.div 
          className="text-center mt-8 text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>Você pode pular o tutorial a qualquer momento nas configurações</p>
        </motion.div>
      </div>
    </div>
  );
};