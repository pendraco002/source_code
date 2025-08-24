import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, SkipForward } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  targetElement: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao Equilibrium',
    content: 'Aprenda a equilibrar os sistemas do corpo humano de forma interativa e educativa.',
    targetElement: 'body',
    position: 'bottom'
  },
  {
    id: 'dashboard-intro',
    title: 'Dashboard de Biomarcadores',
    content: 'Estas barras mostram os níveis vitais do corpo: glicemia, pH e temperatura. Mantenha-os no equilíbrio!',
    targetElement: '.biomarker-dashboard',
    position: 'bottom'
  },
  {
    id: 'cards-intro',
    title: 'Suas Cartas de Ação',
    content: 'Cada carta representa uma ação médica ou fisiológica. Use-as para corrigir desequilíbrios.',
    targetElement: '.player-hand',
    position: 'top'
  },
  {
    id: 'drag-drop',
    title: 'Como Jogar',
    content: 'Arraste uma carta para a zona de jogo ou clique para selecionar. Observe os efeitos nos biomarcadores!',
    targetElement: '.play-zone',
    position: 'top'
  },
  {
    id: 'events',
    title: 'Eventos Aleatórios',
    content: 'Eventos como "Crise de Glicemia" ou "Febre" aparecerão. Responda rapidamente!',
    targetElement: '.current-event',
    position: 'bottom'
  },
  {
    id: 'education',
    title: 'Aprendizado Ativo',
    content: 'Cada carta e evento inclui explicações científicas. Aprenda anatomia e fisiologia jogando!',
    targetElement: '.educational-note',
    position: 'top'
  }
];

interface TutorialSystemProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const TutorialSystem: React.FC<TutorialSystemProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const currentTutorialStep = tutorialSteps[currentStep];

  const updateTargetPosition = useCallback(() => {
    if (currentTutorialStep) {
      const element = document.querySelector(currentTutorialStep.targetElement);
      if (element) {
        setTargetRect(element.getBoundingClientRect());
      }
    }
  }, [currentTutorialStep]);

  useEffect(() => {
    if (isOpen) {
      updateTargetPosition();
      window.addEventListener('resize', updateTargetPosition);
      window.addEventListener('scroll', updateTargetPosition);
      
      return () => {
        window.removeEventListener('resize', updateTargetPosition);
        window.removeEventListener('scroll', updateTargetPosition);
      };
    }
  }, [isOpen, updateTargetPosition]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const getTooltipPosition = () => {
    if (!targetRect || !currentTutorialStep) return { top: '50%', left: '50%' };

    const { position } = currentTutorialStep;
    const offset = 20;

    switch (position) {
      case 'top':
        return {
          top: targetRect.top - offset,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translateX(-50%) translateY(-100%)'
        };
      case 'bottom':
        return {
          top: targetRect.bottom + offset,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.left - offset,
          transform: 'translateY(-50%) translateX(-100%)'
        };
      case 'right':
        return {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.right + offset,
          transform: 'translateY(-50%)'
        };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={handleSkip}
          />

          {/* Highlight */}
          {targetRect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed border-4 border-cyan-400 rounded-lg pointer-events-none z-50"
              style={{
                top: targetRect.top - 4,
                left: targetRect.left - 4,
                width: targetRect.width + 8,
                height: targetRect.height + 8,
              }}
            />
          )}

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-sm"
            style={getTooltipPosition()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-white">{currentTutorialStep.title}</h3>
              <button
                onClick={handleSkip}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-200 mb-6 leading-relaxed">
              {currentTutorialStep.content}
            </p>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`
                      w-2 h-2 rounded-full transition-colors
                      ${index === currentStep ? 'bg-cyan-400' : 'bg-gray-500'}
                    `}
                  />
                ))}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="p-2 text-gray-300 hover:text-white disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  {currentStep === tutorialSteps.length - 1 ? 'Concluir' : 'Próximo'}
                </button>
              </div>
            </div>

            <button
              onClick={handleSkip}
              className="absolute top-2 right-2 text-xs text-gray-400 hover:text-gray-200 flex items-center space-x-1"
            >
              <SkipForward size={14} />
              <span>Pular tutorial</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};