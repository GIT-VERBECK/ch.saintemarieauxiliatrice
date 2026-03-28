import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';

/**
 * Composant pour un item de statistique avec compteur animé
 */
const StatItem = ({ value, label, suffix = "+" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate(v) {
          setCount(Math.round(v));
        }
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return (
    <motion.div 
      className="stat-item" 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="stat-content">
        <div className="stat-number">
          <span className="stat-suffix">{suffix}</span>
          <span>{count}</span>
        </div>
        <p className="stat-label">{label}</p>
      </div>
    </motion.div>
  );
};

/**
 * Section des chiffres clés de la chorale
 */
const StatsSection = () => {
  const stats = [
    { value: 50, label: "Choristes passionnés" },
    { value: 17, label: "Ans d'histoire" },
    { value: 20, label: "Messes par an" },
    { value: 500, label: "Partitions dans le répertoire" }
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
