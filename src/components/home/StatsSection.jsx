import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Users, Calendar, Church, BookOpen } from 'lucide-react';

const StatItem = ({ icon: Icon, value, label, suffix = "+" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate(value) {
          setCount(Math.round(value));
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
      <div className="stat-icon-wrapper glass-panel">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <div className="stat-number">
          <span>{count}</span>
          <span className="stat-suffix">{suffix}</span>
        </div>
        <p className="stat-label">{label}</p>
      </div>
    </motion.div>
  );
};

const StatsSection = () => {
  const stats = [
    { icon: Users, value: 50, label: "Choristes passionnés" },
    { icon: Calendar, value: 17, label: "Ans d'histoire" },
    { icon: Church, value: 20, label: "Messes par an" },
    { icon: BookOpen, value: 500, label: "Partitions dans le répertoire" }
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
