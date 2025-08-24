import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';
import { CardComponent } from './CardComponent';
import { Card, CardType, CardRarity } from '../../core/domain/card.model';
import { gameTestHelpers, feedbackHelpers } from '../../test/test-utils';

// Mock the hooks
vi.mock('../../shared/hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    dragStart: vi.fn(),
    dragEnd: vi.fn(),
    cardFlip: vi.fn(),
    buttonPress: vi.fn(),
  })
}));

vi.mock('../../shared/hooks/useAudio', () => ({
  useAudioFeedback: () => ({
    playCardFlip: vi.fn(),
    playButtonClick: vi.fn(),
  })
}));

describe('CardComponent', () => {
  let mockCard: Card;
  let mockOnClick: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockCard = {
      ...gameTestHelpers.mockCard,
      id: 'test-card-insulin',
      name: 'Insulin Shot',
      type: CardType.ACTION,
      cost: 3,
      description: 'Reduces blood glucose levels significantly',
      effects: [
        {
          targetSystem: 'glucose',
          value: -25,
          duration: 2
        }
      ],
      rarity: CardRarity.UNCOMMON,
      educationalNote: 'Insulin helps cells absorb glucose from the bloodstream',
      flavorText: 'A quick injection to restore balance'
    };

    mockOnClick = vi.fn();
  });

  describe('Rendering', () => {
    it('should render card with basic information', () => {
      render(<CardComponent card={mockCard} />);
      
      expect(screen.getByText('Insulin Shot')).toBeInTheDocument();
      expect(screen.getByText('Cost: 3')).toBeInTheDocument();
      expect(screen.getByText('Reduces blood glucose levels significantly')).toBeInTheDocument();
    });

    it('should display card effects correctly', () => {
      render(<CardComponent card={mockCard} />);
      
      expect(screen.getByText('glucose: -25 (2 turns)')).toBeInTheDocument();
    });

    it('should show educational note when provided', () => {
      render(<CardComponent card={mockCard} />);
      
      expect(screen.getByText('Insulin helps cells absorb glucose from the bloodstream')).toBeInTheDocument();
    });

    it('should show flavor text when provided', () => {
      render(<CardComponent card={mockCard} />);
      
      expect(screen.getByText('A quick injection to restore balance')).toBeInTheDocument();
    });

    it('should apply correct styling for card type', () => {
      render(<CardComponent card={mockCard} />);
      
      const cardElement = screen.getByText('Insulin Shot').closest('div');
      expect(cardElement).toHaveClass('from-blue-500/20', 'to-cyan-500/20', 'border-blue-400/30');
    });

    it('should render EVENT card with different styling', () => {
      const eventCard = { ...mockCard, type: CardType.EVENT };
      render(<CardComponent card={eventCard} />);
      
      const cardElement = screen.getByText('Insulin Shot').closest('div');
      expect(cardElement).toHaveClass('from-red-500/20', 'to-orange-500/20', 'border-red-400/30');
    });

    it('should handle card with multiple effects', () => {
      const multiEffectCard = {
        ...mockCard,
        effects: [
          { targetSystem: 'glucose', value: -15, duration: 2 },
          { targetSystem: 'ph', value: 0.05, duration: 1 }
        ]
      };

      render(<CardComponent card={multiEffectCard} />);
      
      expect(screen.getByText('glucose: -15 (2 turns)')).toBeInTheDocument();
      expect(screen.getByText('ph: +0.05 (1 turns)')).toBeInTheDocument();
    });
  });

  describe('Interactivity', () => {
    it('should call onClick when card is clicked', async () => {
      render(<CardComponent card={mockCard} onClick={mockOnClick} />);
      
      const card = screen.getByText('Insulin Shot').closest('div');
      fireEvent.click(card!);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when card is not playable', async () => {
      render(
        <CardComponent 
          card={mockCard} 
          onClick={mockOnClick} 
          isPlayable={false} 
        />
      );
      
      const card = screen.getByText('Insulin Shot').closest('div');
      fireEvent.click(card!);
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should show disabled styling when not playable', () => {
      render(<CardComponent card={mockCard} isPlayable={false} />);
      
      const cardElement = screen.getByText('Insulin Shot').closest('div');
      expect(cardElement).toHaveClass('opacity-60', 'cursor-not-allowed');
    });

    it('should show selected styling when selected', () => {
      render(<CardComponent card={mockCard} isSelected={true} />);
      
      const cardElement = screen.getByText('Insulin Shot').closest('div');
      expect(cardElement).toHaveClass('border-yellow-400/50');
    });
  });

  describe('Drag and Drop Integration', () => {
    it('should have draggable attributes when playable', () => {
      render(<CardComponent card={mockCard} isPlayable={true} />);
      
      const cardElement = screen.getByText('Insulin Shot').closest('div');
      expect(cardElement).toHaveAttribute('draggable');
    });

    it('should apply dragging styles when being dragged', () => {
      render(<CardComponent card={mockCard} isPlayable={true} />);
      
      const cardElement = screen.getByText('Insulin Shot').closest('div');
      
      // Simulate drag start
      fireEvent.dragStart(cardElement!);
      
      expect(cardElement).toHaveClass('opacity-80');
    });
  });

  describe('Audio and Haptic Feedback', () => {
    it('should trigger feedback on click', async () => {
      const { useHapticFeedback } = await import('../../shared/hooks/useHapticFeedback');
      const { useAudioFeedback } = await import('../../shared/hooks/useAudio');
      
      const mockButtonPress = vi.fn();
      const mockPlayButtonClick = vi.fn();
      
      vi.mocked(useHapticFeedback).mockReturnValue({
        buttonPress: mockButtonPress,
        dragStart: vi.fn(),
        dragEnd: vi.fn(),
        cardFlip: vi.fn(),
      } as any);
      
      vi.mocked(useAudioFeedback).mockReturnValue({
        playButtonClick: mockPlayButtonClick,
        playCardFlip: vi.fn(),
      } as any);
      
      render(<CardComponent card={mockCard} onClick={mockOnClick} />);
      
      const card = screen.getByText('Insulin Shot').closest('div');
      fireEvent.click(card!);
      
      expect(mockButtonPress).toHaveBeenCalled();
      expect(mockPlayButtonClick).toHaveBeenCalled();
    });

    it('should trigger feedback on drag start', async () => {
      const { useHapticFeedback } = await import('../../shared/hooks/useHapticFeedback');
      const { useAudioFeedback } = await import('../../shared/hooks/useAudio');
      
      const mockDragStart = vi.fn();
      const mockPlayCardFlip = vi.fn();
      
      vi.mocked(useHapticFeedback).mockReturnValue({
        dragStart: mockDragStart,
        dragEnd: vi.fn(),
        cardFlip: vi.fn(),
        buttonPress: vi.fn(),
      } as any);
      
      vi.mocked(useAudioFeedback).mockReturnValue({
        playCardFlip: mockPlayCardFlip,
        playButtonClick: vi.fn(),
      } as any);
      
      render(<CardComponent card={mockCard} isPlayable={true} />);
      
      const card = screen.getByText('Insulin Shot').closest('div');
      fireEvent.dragStart(card!);
      
      expect(mockDragStart).toHaveBeenCalled();
      expect(mockPlayCardFlip).toHaveBeenCalled();
    });
  });

  describe('Card Flip Animation', () => {
    it('should show flip button when playable', () => {
      render(<CardComponent card={mockCard} isPlayable={true} />);
      
      const flipButton = screen.getByRole('button');
      expect(flipButton).toBeInTheDocument();
    });

    it('should not show flip button when not playable', () => {
      render(<CardComponent card={mockCard} isPlayable={false} />);
      
      const flipButtons = screen.queryAllByRole('button');
      expect(flipButtons).toHaveLength(0);
    });

    it('should handle flip button click', async () => {
      const { useHapticFeedback } = await import('../../shared/hooks/useHapticFeedback');
      const { useAudioFeedback } = await import('../../shared/hooks/useAudio');
      
      const mockCardFlip = vi.fn();
      const mockPlayCardFlip = vi.fn();
      
      vi.mocked(useHapticFeedback).mockReturnValue({
        cardFlip: mockCardFlip,
        dragStart: vi.fn(),
        dragEnd: vi.fn(),
        buttonPress: vi.fn(),
      } as any);
      
      vi.mocked(useAudioFeedback).mockReturnValue({
        playCardFlip: mockPlayCardFlip,
        playButtonClick: vi.fn(),
      } as any);
      
      render(<CardComponent card={mockCard} isPlayable={true} />);
      
      const flipButton = screen.getByRole('button');
      fireEvent.click(flipButton);
      
      expect(mockCardFlip).toHaveBeenCalled();
      expect(mockPlayCardFlip).toHaveBeenCalled();
    });

    it('should prevent event bubbling on flip button click', () => {
      render(<CardComponent card={mockCard} onClick={mockOnClick} isPlayable={true} />);
      
      const flipButton = screen.getByRole('button');
      fireEvent.click(flipButton);
      
      // Main onClick should not be called when flip button is clicked
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have appropriate ARIA attributes', () => {
      render(<CardComponent card={mockCard} />);
      
      const cardElement = screen.getByText('Insulin Shot').closest('div');
      expect(cardElement).toHaveAttribute('role', 'button');
    });

    it('should be keyboard accessible', () => {
      render(<CardComponent card={mockCard} onClick={mockOnClick} />);
      
      const cardElement = screen.getByText('Insulin Shot').closest('div');
      cardElement?.focus();
      
      fireEvent.keyDown(cardElement!, { key: 'Enter' });
      expect(mockOnClick).toHaveBeenCalled();
    });

    it('should have proper contrast for text elements', () => {
      render(<CardComponent card={mockCard} />);
      
      // Text should be visible against background
      const nameElement = screen.getByText('Insulin Shot');
      const computedStyle = window.getComputedStyle(nameElement);
      
      expect(computedStyle.color).toBeDefined();
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const startTime = performance.now();
      
      render(<CardComponent card={mockCard} />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render in less than 50ms
      expect(renderTime).toBeLessThan(50);
    });

    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<CardComponent card={mockCard} />);
      
      // Re-render with same props
      rerender(<CardComponent card={mockCard} />);
      
      // Component should still be in document
      expect(screen.getByText('Insulin Shot')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle card with no effects gracefully', () => {
      const noEffectsCard = { ...mockCard, effects: [] };
      
      expect(() => {
        render(<CardComponent card={noEffectsCard} />);
      }).not.toThrow();
      
      expect(screen.getByText('Insulin Shot')).toBeInTheDocument();
    });

    it('should handle card with no educational note', () => {
      const noNoteCard = { ...mockCard, educationalNote: undefined };
      
      render(<CardComponent card={noNoteCard} />);
      
      expect(screen.getByText('Insulin Shot')).toBeInTheDocument();
      expect(screen.queryByText('Insulin helps cells absorb glucose from the bloodstream')).not.toBeInTheDocument();
    });

    it('should handle card with no flavor text', () => {
      const noFlavorCard = { ...mockCard, flavorText: undefined };
      
      render(<CardComponent card={noFlavorCard} />);
      
      expect(screen.getByText('Insulin Shot')).toBeInTheDocument();
      expect(screen.queryByText('A quick injection to restore balance')).not.toBeInTheDocument();
    });

    it('should handle very long card names', () => {
      const longNameCard = { 
        ...mockCard, 
        name: 'This is a very very very very very long card name that might cause layout issues' 
      };
      
      render(<CardComponent card={longNameCard} />);
      
      const cardElement = screen.getByText(longNameCard.name).closest('div');
      expect(cardElement).toBeInTheDocument();
    });

    it('should handle effects with zero duration', () => {
      const instantEffectCard = {
        ...mockCard,
        effects: [
          { targetSystem: 'glucose', value: -10, duration: 0 }
        ]
      };

      render(<CardComponent card={instantEffectCard} />);
      
      expect(screen.getByText('glucose: -10 (0 turns)')).toBeInTheDocument();
    });
  });
});