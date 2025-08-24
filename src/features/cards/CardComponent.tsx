import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../core/domain/card.model';
import { CardType } from '../../core/domain/card.model';
import { useDraggable } from '@dnd-kit/core';
import { useHapticFeedback } from '../../shared/hooks/useHapticFeedback';
import { useAudioFeedback } from '../../shared/hooks/useAudio';
import { cardVariants } from '../../shared/animations/variants';

interface CardComponentProps {
  card: Card;
  isPlayable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export const CardComponent: React.FC<CardComponentProps> = ({
  card,
  isPlayable = true,
  isSelected = false,
  onClick
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { dragStart, dragEnd, cardFlip, buttonPress } = useHapticFeedback();
  const { playCardFlip, playButtonClick } = useAudioFeedback();
  
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    data: { card }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : {};

  // Handlers com feedback integrado
  const handleClick = () => {
    if (!isPlayable) return;
    buttonPress();
    playButtonClick();
    onClick?.();
  };

  const handleFlip = () => {
    if (!isPlayable) return;
    setIsFlipped(!isFlipped);
    cardFlip();
    playCardFlip();
  };

  const handleDragStart = () => {
    if (!isPlayable) return;
    dragStart();
    playCardFlip();
  };

  const handleDragEnd = () => {
    dragEnd();
  };

  // Determinar variante atual
  const getCurrentVariant = () => {
    if (isDragging) return 'dragging';
    if (isSelected) return 'selected';
    return 'idle';
  };

  const getCardColor = (type: CardType) => {
    switch (type) {
      case CardType.ACTION:
        return 'from-blue-500/20 to-cyan-500/20 border-blue-400/30';
      case CardType.EVENT:
        return 'from-red-500/20 to-orange-500/20 border-red-400/30';
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-400/30';
    }
  };

  return (
    <div className="relative perspective-1000">
      <motion.div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`
          relative w-64 h-88 rounded-xl p-4 cursor-pointer preserve-3d
          bg-gradient-to-br ${getCardColor(card.type)}
          border-2 ${isSelected ? 'border-yellow-400/50' : 'border-transparent'}
          backdrop-blur-md shadow-lg
          ${isDragging ? 'opacity-80' : ''}
          ${!isPlayable ? 'opacity-60 cursor-not-allowed' : ''}
        `}
        variants={cardVariants}
        initial="idle"
        animate={getCurrentVariant()}
        whileHover={isPlayable ? "hover" : undefined}
        whileTap={isPlayable ? { scale: 0.98 } : undefined}
        onClick={handleClick}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        layoutId={card.id}
        drag={isPlayable}
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
      >
      {/* Card Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-bold text-white drop-shadow-lg">{card.name}</h3>
        <div className="text-xs text-yellow-300/80">Cost: {card.cost}</div>
      </div>

      {/* Card Image Placeholder */}
      <div className="w-full h-32 bg-gray-800/30 rounded-lg mb-3 flex items-center justify-center">
        <div className="text-gray-400 text-xs">{card.type}</div>
      </div>

      {/* Card Description */}
      <div className="text-xs text-gray-200 mb-3 leading-relaxed">
        {card.description}
      </div>

      {/* Effects */}
      <div className="space-y-1">
        {card.effects.map((effect, index) => (
          <div key={index} className="text-xs text-cyan-300/80">
            {effect.targetSystem}: {effect.value > 0 ? '+' : ''}{effect.value}
            {effect.duration && ` (${effect.duration} turns)`}
          </div>
        ))}
      </div>

      {/* Educational Note */}
      {card.educationalNote && (
        <div className="absolute bottom-2 left-2 right-2">
          <div className="text-xs text-purple-300/70 italic">
            {card.educationalNote}
          </div>
        </div>
      )}

      {/* Flavor Text */}
      {card.flavorText && (
        <div className="absolute bottom-8 left-2 right-2">
          <div className="text-xs text-gray-400/60 italic">
            {card.flavorText}
          </div>
        </div>
      )}
      {/* Botão de flip */}
      {isPlayable && (
        <motion.button
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm 
                   flex items-center justify-center hover:bg-white/30 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handleFlip();
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            className="w-3 h-3 border border-white/60 rounded"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      )}
    </motion.div>
    </div>
  );
};