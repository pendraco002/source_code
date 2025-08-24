import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
}

interface ParticleEffectProps {
  trigger?: boolean;
  count?: number;
  colors?: string[];
  origin?: { x: number; y: number };
  spread?: number;
  duration?: number;
  className?: string;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  trigger = false,
  count = 20,
  colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'],
  origin = { x: 50, y: 50 },
  spread = 100,
  duration = 2000,
  className = ''
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const createParticle = (id: number): Particle => {
    const angle = (Math.PI * 2 * Math.random());
    const velocity = 2 + Math.random() * 3;
    
    return {
      id,
      x: origin.x + (Math.random() - 0.5) * 20,
      y: origin.y + (Math.random() - 0.5) * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 8,
      velocity: {
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity
      },
      life: 1,
      maxLife: duration / 1000
    };
  };

  useEffect(() => {
    if (!trigger) return;

    const newParticles = Array.from({ length: count }, (_, i) => createParticle(i));
    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.velocity.x,
            y: particle.y + particle.velocity.y,
            velocity: {
              x: particle.velocity.x * 0.98,
              y: particle.velocity.y * 0.98 + 0.1
            },
            life: particle.life - 0.02
          }))
          .filter(particle => particle.life > 0)
      );
    }, 16);

    const timeout = setTimeout(() => {
      setParticles([]);
      clearInterval(interval);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [trigger, count, duration]);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: particle.life,
              scale: 1,
              x: particle.velocity.x * 50,
              y: particle.velocity.y * 50
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 0.1,
              ease: "linear"
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface SuccessParticlesProps {
  trigger: boolean;
  onComplete?: () => void;
}

export const SuccessParticles: React.FC<SuccessParticlesProps> = ({ 
  trigger, 
  onComplete 
}) => {
  useEffect(() => {
    if (trigger && onComplete) {
      const timeout = setTimeout(onComplete, 2000);
      return () => clearTimeout(timeout);
    }
  }, [trigger, onComplete]);

  return (
    <ParticleEffect
      trigger={trigger}
      count={30}
      colors={['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b']}
      duration={2000}
      className="z-50"
    />
  );
};

interface ErrorParticlesProps {
  trigger: boolean;
  onComplete?: () => void;
}

export const ErrorParticles: React.FC<ErrorParticlesProps> = ({ 
  trigger, 
  onComplete 
}) => {
  useEffect(() => {
    if (trigger && onComplete) {
      const timeout = setTimeout(onComplete, 1500);
      return () => clearTimeout(timeout);
    }
  }, [trigger, onComplete]);

  return (
    <ParticleEffect
      trigger={trigger}
      count={15}
      colors={['#ef4444', '#f87171', '#fca5a5', '#dc2626']}
      duration={1500}
      spread={60}
      className="z-50"
    />
  );
};

interface FloatingNumberProps {
  value: number;
  x: number;
  y: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  show: boolean;
  onComplete?: () => void;
}

export const FloatingNumber: React.FC<FloatingNumberProps> = ({
  value,
  x,
  y,
  color = '#10b981',
  size = 'md',
  show,
  onComplete
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  useEffect(() => {
    if (show && onComplete) {
      const timeout = setTimeout(onComplete, 1500);
      return () => clearTimeout(timeout);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`absolute pointer-events-none font-bold ${sizeClasses[size]} z-50`}
          style={{ 
            left: x, 
            top: y,
            color: color,
            textShadow: '0 0 10px rgba(0,0,0,0.8)'
          }}
          initial={{ 
            opacity: 0, 
            scale: 0.5,
            y: 0
          }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.2, 1, 0.8],
            y: [0, -30, -60, -80]
          }}
          transition={{
            duration: 1.5,
            times: [0, 0.2, 0.8, 1],
            ease: "easeOut"
          }}
          onAnimationComplete={onComplete}
        >
          {value > 0 ? '+' : ''}{value}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ParticleEffect;