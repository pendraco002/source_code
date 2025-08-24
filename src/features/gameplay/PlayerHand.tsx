import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../core/domain/card.model';
import { CardComponent } from '../cards/CardComponent';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

interface PlayerHandProps {
  cards: Card[];
  onPlayCard: (card: Card) => void;
  maxHandSize?: number;
  className?: string;
}

export const PlayerHand: React.FC<PlayerHandProps> = ({
  cards,
  onPlayCard,
  maxHandSize = 7,
  className = ''
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (over && over.id === 'play-zone') {
      const card = cards.find(c => c.id === active.id);
      if (card) {
        onPlayCard(card);
      }
    }
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Sua Mão</h3>
        <span className="text-sm text-gray-300">
          {cards.length}/{maxHandSize} cartas
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={cards.map(card => card.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            <AnimatePresence>
              {cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex-shrink-0"
                >
                  <CardComponent
                    card={card}
                    isPlayable={true}
                    onClick={() => onPlayCard(card)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>

        {/* Drop Zone */}
        <motion.div
          id="play-zone"
          className="
            mt-8 p-8 border-2 border-dashed border-cyan-400/30 rounded-xl
            bg-cyan-500/10 backdrop-blur-sm
            flex items-center justify-center
            hover:bg-cyan-500/20 transition-colors
          "
          whileHover={{ scale: 1.02 }}
          whileDragOver={{ scale: 1.05, borderColor: 'rgba(0, 255, 255, 0.5)' }}
        >
          <div className="text-center">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-white font-semibold">Arraste cartas aqui para jogar</div>
            <div className="text-gray-300 text-sm">ou clique para selecionar</div>
          </div>
        </motion.div>
      </DndContext>

      {cards.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🃏</div>
          <div className="text-gray-400">Sem cartas na mão</div>
          <div className="text-sm text-gray-500 mt-2">
            Compre uma carta para começar
          </div>
        </motion.div>
      )}
    </div>
  );
};