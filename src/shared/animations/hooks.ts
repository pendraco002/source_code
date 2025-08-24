import { useEffect, useRef, useState, useCallback } from 'react';
import { useAnimation, useMotionValue, useTransform } from 'framer-motion';

// Hook para animações de entrada em sequência
export const useStaggeredAnimation = (itemCount: number, delay: number = 0.1) => {
  const controls = useAnimation();

  const startAnimation = useCallback(async () => {
    await controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * delay,
        duration: 0.4,
        ease: "easeOut"
      }
    }));
  }, [controls, delay]);

  return { controls, startAnimation };
};

// Hook para animação de progresso
export const useProgressAnimation = (targetValue: number, duration: number = 1000) => {
  const progress = useMotionValue(0);
  const displayValue = useTransform(progress, (value) => Math.round(value));
  
  useEffect(() => {
    const animation = progress.set(targetValue);
    return () => animation;
  }, [targetValue, progress]);

  return { progress, displayValue };
};

// Hook para animação de números contadores
export const useCounterAnimation = (end: number, start: number = 0, duration: number = 1000) => {
  const [currentValue, setCurrentValue] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  const animate = useCallback(() => {
    setIsAnimating(true);
    const startTime = Date.now();
    const difference = end - start;

    const updateValue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (difference * easeOut));
      
      setCurrentValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        setIsAnimating(false);
      }
    };

    updateValue();
  }, [start, end, duration]);

  return { currentValue, animate, isAnimating };
};

// Hook para scroll animado
export const useScrollAnimation = () => {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.unobserve(element);
  }, []);

  return { ref, isInView };
};

// Hook para animação de física
export const usePhysicsAnimation = (initialPosition: { x: number; y: number }) => {
  const x = useMotionValue(initialPosition.x);
  const y = useMotionValue(initialPosition.y);
  const [isAnimating, setIsAnimating] = useState(false);

  const applyForce = useCallback((forceX: number, forceY: number, duration: number = 500) => {
    setIsAnimating(true);
    
    x.set(x.get() + forceX);
    y.set(y.get() + forceY);

    setTimeout(() => {
      setIsAnimating(false);
    }, duration);
  }, [x, y]);

  const resetPosition = useCallback(() => {
    x.set(initialPosition.x);
    y.set(initialPosition.y);
    setIsAnimating(false);
  }, [x, y, initialPosition]);

  return {
    x,
    y,
    isAnimating,
    applyForce,
    resetPosition
  };
};

// Hook para animações baseadas em performance
export const usePerformanceAnimation = () => {
  const [canAnimate, setCanAnimate] = useState(true);
  const frameRate = useRef(60);

  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    
    const measurePerformance = () => {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        frameRate.current = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        
        // Desabilitar animações se FPS muito baixo
        setCanAnimate(frameRate.current >= 30);
      }
      
      requestAnimationFrame(measurePerformance);
    };

    measurePerformance();
  }, []);

  return { canAnimate, frameRate: frameRate.current };
};

// Hook para animação de drag & drop avançado
export const useAdvancedDrag = (onDragEnd?: (info: any) => void) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const dragControls = {
    onDragStart: () => {
      setIsDragging(true);
    },
    onDrag: (event: any, info: any) => {
      setDragOffset({ x: info.offset.x, y: info.offset.y });
    },
    onDragEnd: (event: any, info: any) => {
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
      onDragEnd?.(info);
    }
  };

  return {
    isDragging,
    dragOffset,
    dragControls
  };
};

// Hook para animações de notificação
export const useNotificationAnimation = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  }>>([]);

  const addNotification = useCallback((notification: {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, notification.duration || 3000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification
  };
};