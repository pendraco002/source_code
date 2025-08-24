import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DndContext } from '@dnd-kit/core';
import { MotionConfig } from 'framer-motion';

// Wrapper com providers necessários para os testes
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MotionConfig reducedMotion="always">
      <DndContext>
        {children}
      </DndContext>
    </MotionConfig>
  );
};

// Custom render function with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const user = userEvent.setup();
  
  return {
    user,
    ...render(ui, { wrapper: AllTheProviders, ...options })
  };
};

// Test helpers for common game scenarios
export const gameTestHelpers = {
  // Mock card data
  mockCard: {
    id: 'test-card-1',
    name: 'Test Card',
    type: 'ACTION' as const,
    cost: 2,
    description: 'A test card for unit testing',
    effects: [
      {
        targetSystem: 'glucose',
        value: 10,
        duration: 2
      }
    ],
    rarity: 'common' as const,
    educationalNote: 'This is a test note',
    flavorText: 'Test flavor text'
  },

  // Mock biomarker data
  mockBiomarker: {
    id: 'glucose',
    name: 'Glicose',
    value: 90,
    minValue: 70,
    maxValue: 110,
    unit: 'mg/dL',
    status: 'normal' as const,
    trend: 'stable' as const
  },

  // Mock game state
  mockGameState: {
    currentTurn: 1,
    maxTurns: 20,
    score: 1000,
    difficulty: 'medium' as const,
    selectedSystem: 'glucose' as const,
    isGameActive: true,
    playerHand: [],
    playedCards: [],
    events: []
  },

  // Simulate card drag and drop
  simulateCardDrag: (card: HTMLElement, target: HTMLElement) => {
    // This would need to be implemented based on @dnd-kit/core testing patterns
    // For now, just a placeholder
    return Promise.resolve();
  }
};

// Performance test utilities
export const performanceHelpers = {
  // Measure render time
  measureRenderTime: async (renderFn: () => void) => {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    return end - start;
  },

  // Mock performance observer
  mockPerformanceObserver: () => {
    return {
      observe: jest.fn(),
      disconnect: jest.fn(),
      takeRecords: jest.fn(() => []),
    };
  },

  // Simulate low-end device
  simulateLowEndDevice: () => {
    // Mock reduced performance
    Object.defineProperty(window, 'deviceMemory', { value: 1 });
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 2 });
  }
};

// Viewport testing utilities
export const viewportHelpers = {
  // Set viewport size
  setViewportSize: (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', { value: width, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: height, writable: true });
    window.dispatchEvent(new Event('resize'));
  },

  // Common viewport sizes
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 },
    smallMobile: { width: 320, height: 568 }
  },

  // Test orientation change
  simulateOrientationChange: () => {
    const event = new Event('orientationchange');
    window.dispatchEvent(event);
  }
};

// Audio/Haptic testing utilities
export const feedbackHelpers = {
  // Mock audio context
  getMockAudioContext: () => ({
    createOscillator: jest.fn(),
    createGain: jest.fn(),
    destination: {},
    currentTime: 0
  }),

  // Check if vibration was called
  expectVibrationCalled: (pattern?: number | number[]) => {
    expect(navigator.vibrate).toHaveBeenCalled();
    if (pattern) {
      expect(navigator.vibrate).toHaveBeenCalledWith(pattern);
    }
  }
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
export { userEvent };