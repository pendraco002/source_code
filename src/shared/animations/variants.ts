import { Variants } from 'framer-motion';

export const cardVariants: Variants = {
  idle: {
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    y: 0,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  },
  hover: {
    scale: 1.05,
    rotateX: -5,
    y: -10,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25
    }
  },
  selected: {
    scale: 1.08,
    rotateY: 5,
    y: -15,
    boxShadow: '0 25px 50px rgba(255, 255, 0, 0.3)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  },
  dragging: {
    scale: 1.1,
    rotateZ: 10,
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30
    }
  },
  flipped: {
    rotateY: 180,
    transition: {
      duration: 0.6,
      ease: 'easeInOut'
    }
  }
};

export const menuVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
};

export const gameLayoutVariants: Variants = {
  enter: {
    opacity: 0,
    scale: 0.9
  },
  center: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 1.1,
    transition: {
      duration: 0.2
    }
  }
};