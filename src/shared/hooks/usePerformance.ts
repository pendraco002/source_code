import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { throttle, debounce } from 'react-use';

interface PerformanceMetrics {
  fps: number;
  memoryUsage?: number;
  renderTime: number;
  isLowPerformance: boolean;
}

// Hook para monitoramento de performance
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    renderTime: 0,
    isLowPerformance: false
  });

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const renderStart = useRef(0);

  useEffect(() => {
    let animationFrame: number;

    const measurePerformance = () => {
      const currentTime = performance.now();
      frameCount.current++;

      // Calcular FPS a cada segundo
      if (currentTime - lastTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
        
        setMetrics(prev => ({
          ...prev,
          fps,
          isLowPerformance: fps < 30,
          renderTime: performance.now() - renderStart.current
        }));

        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      animationFrame = requestAnimationFrame(measurePerformance);
    };

    animationFrame = requestAnimationFrame(measurePerformance);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Marcar início de renderização
  const startRender = useCallback(() => {
    renderStart.current = performance.now();
  }, []);

  return { metrics, startRender };
};

// Hook para lazy loading de imagens
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (imgRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const img = new Image();
            img.onload = () => {
              setImageSrc(src);
              setIsLoaded(true);
              setIsError(false);
            };
            img.onerror = () => {
              setIsError(true);
              setIsLoaded(false);
            };
            img.src = src;
            observer.unobserve(imgRef.current!);
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(imgRef.current);
    }

    return () => {
      if (observer && imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  return { imgRef, imageSrc, isLoaded, isError };
};

// Hook para virtualização de listas grandes
export const useVirtualList = <T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItemsCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length, startIndex + visibleItemsCount + overscan * 2);

  const visibleItems = useMemo(() => 
    items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index
    })), 
    [items, startIndex, endIndex]
  );

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = throttle((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, 16); // ~60fps

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  };
};

// Hook para debounce de animações
export const useAnimationDebounce = (delay: number = 100) => {
  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedAnimate = useCallback((callback: () => void) => {
    setIsPending(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback();
      setIsPending(false);
    }, delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { debouncedAnimate, isPending };
};

// Hook para otimização de re-renders
export const useRenderOptimization = <T extends Record<string, any>>(
  props: T,
  dependencies: (keyof T)[]
) => {
  return useMemo(
    () => props,
    dependencies.map(key => props[key])
  );
};

// Hook para controle adaptativo de qualidade de animação
export const useAdaptiveAnimations = () => {
  const { metrics } = usePerformanceMonitor();
  const [animationQuality, setAnimationQuality] = useState<'high' | 'medium' | 'low'>('high');

  useEffect(() => {
    if (metrics.fps < 20) {
      setAnimationQuality('low');
    } else if (metrics.fps < 40) {
      setAnimationQuality('medium');
    } else {
      setAnimationQuality('high');
    }
  }, [metrics.fps]);

  const getAnimationConfig = useCallback(() => {
    switch (animationQuality) {
      case 'low':
        return {
          duration: 0.2,
          ease: "linear",
          enableParticles: false,
          enableShadows: false,
          reduceMotion: true
        };
      case 'medium':
        return {
          duration: 0.3,
          ease: "easeOut",
          enableParticles: false,
          enableShadows: true,
          reduceMotion: false
        };
      case 'high':
      default:
        return {
          duration: 0.4,
          ease: "easeOut",
          enableParticles: true,
          enableShadows: true,
          reduceMotion: false
        };
    }
  }, [animationQuality]);

  return { animationQuality, getAnimationConfig, metrics };
};

// Hook para preload de assets
export const useAssetPreloader = (assets: string[]) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const preloadAssets = useCallback(async () => {
    setIsLoading(true);
    setLoadedCount(0);
    setErrors([]);

    const promises = assets.map((asset, index) => {
      return new Promise<void>((resolve, reject) => {
        if (asset.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          // Imagem
          const img = new Image();
          img.onload = () => {
            setLoadedCount(prev => prev + 1);
            resolve();
          };
          img.onerror = () => {
            setErrors(prev => [...prev, asset]);
            reject(new Error(`Failed to load image: ${asset}`));
          };
          img.src = asset;
        } else if (asset.match(/\.(mp3|wav|ogg)$/i)) {
          // Áudio
          const audio = new Audio();
          audio.oncanplaythrough = () => {
            setLoadedCount(prev => prev + 1);
            resolve();
          };
          audio.onerror = () => {
            setErrors(prev => [...prev, asset]);
            reject(new Error(`Failed to load audio: ${asset}`));
          };
          audio.src = asset;
        } else {
          // Outros (ex: JSON, texto)
          fetch(asset)
            .then(() => {
              setLoadedCount(prev => prev + 1);
              resolve();
            })
            .catch(() => {
              setErrors(prev => [...prev, asset]);
              reject(new Error(`Failed to load asset: ${asset}`));
            });
        }
      });
    });

    try {
      await Promise.allSettled(promises);
    } finally {
      setIsLoading(false);
    }
  }, [assets]);

  const progress = assets.length > 0 ? (loadedCount / assets.length) * 100 : 100;

  return {
    preloadAssets,
    isLoading,
    progress,
    loadedCount,
    totalCount: assets.length,
    errors
  };
};

// Hook para otimização de bundle
export const useLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  const [Component, setComponent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadComponent = useCallback(async () => {
    if (Component) return Component;

    setIsLoading(true);
    try {
      const module = await importFunc();
      setComponent(() => module.default);
      return module.default;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [importFunc, Component]);

  return { Component, loadComponent, isLoading, error };
};