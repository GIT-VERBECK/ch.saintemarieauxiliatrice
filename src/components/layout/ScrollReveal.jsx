import React from 'react';
import { motion } from 'framer-motion';

/**
 * Composant utilitaire pour révéler du contenu au défilement (Scroll Reveal)
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Le contenu à animer
 * @param {string} [props.direction='up'] - Direction de l'animation ('up', 'down', 'left', 'right', 'none')
 * @param {number} [props.delay=0] - Délai avant l'animation (secondes)
 * @param {number} [props.duration=0.6] - Durée de l'animation (secondes)
 * @param {number} [props.distance=40] - Distance de déplacement (px)
 * @param {boolean} [props.once=true] - L'animation ne se joue qu'une seule fois
 * @param {string} [props.className=''] - Classes CSS additionnelles
 */
const ScrollReveal = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.8, 
  distance = 50,
  once = true,
  className = ''
}) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: { x: 0, y: 0 }
  };

  const variants = {
    hidden: { 
      opacity: 0, 
      ...directions[direction],
      filter: 'blur(10px)'
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: duration,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98] // Cubic-bezier pour un aspect "premium"
      }
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
