import { useState, useCallback } from 'react';
import { GameSession, GameDifficulty } from '../core/domain/game.model';

export type Screen = 
  | 'menu'
  | 'game'
  | 'tutorial'
  | 'results'
  | 'settings'
  | 'leaderboard';

export interface NavigationState {
  currentScreen: Screen;
  gameSession?: GameSession;
  difficulty: GameDifficulty;
  system: string;
}

export const useNavigation = () => {
  const [state, setState] = useState<NavigationState>({
    currentScreen: 'menu',
    difficulty: 'medium',
    system: 'combined'
  });

  const navigateTo = useCallback((screen: Screen, params?: Partial<NavigationState>) => {
    setState(prev => ({
      ...prev,
      currentScreen: screen,
      ...params
    }));
  }, []);

  const navigateToGame = useCallback((difficulty: GameDifficulty, system: string) => {
    navigateTo('game', { difficulty, system });
  }, [navigateTo]);

  const navigateToResults = useCallback((gameSession: GameSession) => {
    navigateTo('results', { gameSession });
  }, [navigateTo]);

  const navigateBack = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentScreen: 'menu'
    }));
  }, []);

  return {
    ...state,
    navigateTo,
    navigateToGame,
    navigateToResults,
    navigateBack
  };
};