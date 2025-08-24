import { useCallback } from 'react';

export const useAudioFeedback = () => {
  const playSound = useCallback((frequency: number, duration: number = 100) => {
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
      } catch (error) {
        console.log('Audio feedback não disponível:', error);
      }
    }
  }, []);

  const playCardFlip = useCallback(() => playSound(800, 150), [playSound]);
  const playButtonClick = useCallback(() => playSound(600, 100), [playSound]);
  const playSuccess = useCallback(() => playSound(1000, 200), [playSound]);
  const playError = useCallback(() => playSound(300, 300), [playSound]);

  return {
    playCardFlip,
    playButtonClick,
    playSuccess,
    playError,
    playSound
  };
};