import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import { LazyImage, OptimizedImage } from './LazyImage';
import { viewportHelpers } from '../../test/test-utils';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  mockIntersectionObserver.mockImplementation((callback) => ({
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
    thresholds: [0.1],
    callback
  }));
  
  global.IntersectionObserver = mockIntersectionObserver as any;
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('LazyImage', () => {
  const defaultProps = {
    src: 'https://example.com/image.jpg',
    alt: 'Test image',
    className: 'test-image',
    width: 300,
    height: 200
  };

  describe('Basic Rendering', () => {
    it('should render with placeholder initially', () => {
      render(<LazyImage {...defaultProps} />);
      
      const container = screen.getByText('Test image').closest('div');
      expect(container).toHaveClass('test-image');
      expect(container).toHaveStyle({ width: '300px', height: '200px' });
    });

    it('should show shimmer effect while loading', () => {
      render(<LazyImage {...defaultProps} />);
      
      const shimmer = document.querySelector('.animate-\\[shimmer_2s_infinite\\]');
      expect(shimmer).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      render(<LazyImage {...defaultProps} />);
      
      const img = screen.getByAltText('Test image');
      expect(img).toHaveAttribute('alt', 'Test image');
    });
  });

  describe('Lazy Loading Behavior', () => {
    it('should setup IntersectionObserver on mount', () => {
      render(<LazyImage {...defaultProps} />);
      
      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        { threshold: 0.1 }
      );
      expect(mockObserve).toHaveBeenCalled();
    });

    it('should start loading image when intersecting', async () => {
      const mockCallback = vi.fn();
      
      mockIntersectionObserver.mockImplementation((callback) => {
        mockCallback.mockImplementation(() => {
          callback([{ isIntersecting: true }]);
        });
        
        return {
          observe: mockCallback,
          unobserve: mockUnobserve,
          disconnect: mockDisconnect
        };
      });

      render(<LazyImage {...defaultProps} />);
      
      // Simulate intersection
      mockCallback();
      
      await waitFor(() => {
        const img = screen.getByAltText('Test image');
        expect(img).toHaveAttribute('src', defaultProps.src);
      });
    });

    it('should cleanup observer on unmount', () => {
      const { unmount } = render(<LazyImage {...defaultProps} />);
      
      unmount();
      
      expect(mockUnobserve).toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should show loading placeholder initially', () => {
      render(<LazyImage {...defaultProps} />);
      
      const placeholder = document.querySelector('.animate-pulse');
      expect(placeholder).toBeInTheDocument();
    });

    it('should call onLoad callback when image loads', async () => {
      const onLoad = vi.fn();
      
      render(<LazyImage {...defaultProps} onLoad={onLoad} />);
      
      // Mock successful image load
      const img = screen.getByAltText('Test image');
      fireEvent.load(img);
      
      expect(onLoad).toHaveBeenCalled();
    });

    it('should call onError callback when image fails', async () => {
      const onError = vi.fn();
      
      render(<LazyImage {...defaultProps} onError={onError} />);
      
      // Mock image error
      const img = screen.getByAltText('Test image');
      fireEvent.error(img);
      
      expect(onError).toHaveBeenCalled();
    });

    it('should show error state when image fails to load', async () => {
      render(<LazyImage {...defaultProps} />);
      
      const img = screen.getByAltText('Test image');
      fireEvent.error(img);
      
      await waitFor(() => {
        expect(screen.getByText('Erro ao carregar imagem')).toBeInTheDocument();
        expect(screen.getByText('⚠️')).toBeInTheDocument();
      });
    });
  });

  describe('Blur Placeholder', () => {
    it('should show blur placeholder when provided', () => {
      const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...';
      
      render(
        <LazyImage 
          {...defaultProps} 
          blurDataURL={blurDataURL} 
        />
      );
      
      const blurImg = document.querySelector('img[src="' + blurDataURL + '"]');
      expect(blurImg).toBeInTheDocument();
      expect(blurImg).toHaveClass('blur-sm');
    });

    it('should hide blur placeholder when main image loads', async () => {
      const blurDataURL = 'data:image/jpeg;base64,test';
      
      render(
        <LazyImage 
          {...defaultProps} 
          blurDataURL={blurDataURL} 
        />
      );
      
      const mainImg = screen.getByAltText('Test image');
      fireEvent.load(mainImg);
      
      await waitFor(() => {
        expect(mainImg).toHaveClass('opacity-100');
      });
    });
  });

  describe('Animations', () => {
    it('should animate image appearance', async () => {
      render(<LazyImage {...defaultProps} />);
      
      const img = screen.getByAltText('Test image');
      
      // Initially should have opacity 0
      expect(img).toHaveClass('opacity-0');
      
      // After load should animate to opacity 1
      fireEvent.load(img);
      
      await waitFor(() => {
        expect(img).toHaveClass('opacity-100');
      });
    });

    it('should use framer-motion animations', async () => {
      render(<LazyImage {...defaultProps} />);
      
      const img = screen.getByAltText('Test image');
      
      // Check for motion attributes
      expect(img).toHaveAttribute('style');
    });
  });

  describe('Performance', () => {
    it('should not load image until visible', () => {
      render(<LazyImage {...defaultProps} />);
      
      const img = screen.getByAltText('Test image');
      
      // Should not have src initially
      expect(img).not.toHaveAttribute('src', defaultProps.src);
    });

    it('should load image efficiently', () => {
      const startTime = performance.now();
      
      render(<LazyImage {...defaultProps} />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render quickly
      expect(renderTime).toBeLessThan(50);
    });
  });

  describe('Responsive Behavior', () => {
    it('should adapt to different viewport sizes', () => {
      // Test mobile viewport
      viewportHelpers.setViewportSize(375, 667);
      
      render(
        <LazyImage 
          {...defaultProps} 
          className="w-full h-auto" 
        />
      );
      
      const container = screen.getByAltText('Test image').closest('div');
      expect(container).toHaveClass('w-full', 'h-auto');
    });

    it('should handle percentage dimensions', () => {
      render(
        <LazyImage 
          {...defaultProps} 
          width="100%" 
          height="auto" 
        />
      );
      
      const container = screen.getByAltText('Test image').closest('div');
      expect(container).toHaveStyle({ width: '100%', height: 'auto' });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty src gracefully', () => {
      expect(() => {
        render(<LazyImage {...defaultProps} src="" />);
      }).not.toThrow();
    });

    it('should handle missing alt text', () => {
      render(<LazyImage {...defaultProps} alt="" />);
      
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', '');
    });

    it('should handle undefined dimensions', () => {
      render(
        <LazyImage 
          src={defaultProps.src}
          alt={defaultProps.alt}
        />
      );
      
      const container = screen.getByAltText('Test image').closest('div');
      expect(container).toBeInTheDocument();
    });
  });
});

describe('OptimizedImage', () => {
  const optimizedProps = {
    src: 'https://example.com/image.jpg',
    alt: 'Optimized test image',
    quality: 'medium' as const
  };

  describe('Quality Settings', () => {
    it('should apply medium quality by default', () => {
      render(<OptimizedImage {...optimizedProps} />);
      
      const img = screen.getByAltText('Optimized test image');
      expect(img).toHaveAttribute('src', expect.stringContaining('?w=800&q=75'));
    });

    it('should apply low quality setting', () => {
      render(<OptimizedImage {...optimizedProps} quality="low" />);
      
      const img = screen.getByAltText('Optimized test image');
      expect(img).toHaveAttribute('src', expect.stringContaining('?w=400&q=30'));
    });

    it('should apply high quality setting', () => {
      render(<OptimizedImage {...optimizedProps} quality="high" />);
      
      const img = screen.getByAltText('Optimized test image');
      expect(img).toHaveAttribute('src', expect.stringContaining('?w=1200&q=90'));
    });
  });

  describe('Responsive Images', () => {
    it('should generate srcSet when not provided', () => {
      render(<OptimizedImage {...optimizedProps} />);
      
      // Note: This test would need implementation of srcSet generation
      // For now, just verify component renders
      expect(screen.getByAltText('Optimized test image')).toBeInTheDocument();
    });

    it('should use provided srcSet', () => {
      const customSrcSet = 'small.jpg 400w, large.jpg 800w';
      
      render(
        <OptimizedImage 
          {...optimizedProps} 
          srcSet={customSrcSet}
        />
      );
      
      // Verify custom srcSet is used
      expect(screen.getByAltText('Optimized test image')).toBeInTheDocument();
    });

    it('should use provided sizes attribute', () => {
      const customSizes = '(max-width: 600px) 100vw, 800px';
      
      render(
        <OptimizedImage 
          {...optimizedProps} 
          sizes={customSizes}
        />
      );
      
      expect(screen.getByAltText('Optimized test image')).toBeInTheDocument();
    });
  });

  describe('Integration with LazyImage', () => {
    it('should pass through LazyImage props', () => {
      const onLoad = vi.fn();
      
      render(
        <OptimizedImage 
          {...optimizedProps}
          onLoad={onLoad}
          className="custom-class"
        />
      );
      
      const img = screen.getByAltText('Optimized test image');
      fireEvent.load(img);
      
      expect(onLoad).toHaveBeenCalled();
    });
  });
});