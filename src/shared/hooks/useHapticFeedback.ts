import { useCallback } from 'react';

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [50],
        medium: [100],
        heavy: [200]
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  const dragStart = useCallback(() => triggerHaptic('light'), [triggerHaptic]);
  const dragEnd = useCallback(() => triggerHaptic('medium'), [triggerHaptic]);
  const cardFlip = useCallback(() => triggerHaptic('light'), [triggerHaptic]);
  const buttonPress = useCallback(() => triggerHaptic('light'), [triggerHaptic]);

  return {
    dragStart,
    dragEnd,
    cardFlip,
    buttonPress,
    triggerHaptic
  };
};