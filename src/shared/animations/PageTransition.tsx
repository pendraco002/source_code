import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants } from './variants';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  key?: string | number;
  exitBeforeEnter?: boolean;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  key,
  exitBeforeEnter = false
}) => {
  return (
    <AnimatePresence mode={exitBeforeEnter ? 'wait' : 'sync'}>
      <motion.div
        key={key}
        className={`w-full h-full ${className}`}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

interface SlideTransitionProps {
  children: React.ReactNode;
  direction: number;
  className?: string;
}

export const SlideTransition: React.FC<SlideTransitionProps> = ({
  children,
  direction,
  className = ''
}) => {
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className={className}
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;