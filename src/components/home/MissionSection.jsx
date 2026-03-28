import React from 'react';
import { motion } from 'framer-motion';
import { Music4, Heart } from 'lucide-react';

const MissionSection = () => {
  const missions = [
    { 
      icon: Music4, 
      title: "Chanter le Sacré", 
      text: "Nous portons les chants liturgiques avec une exigence de perfection pour magnifier chaque célébration." 
    },
    { 
      icon: Heart, 
      title: "Partager l'Émotion", 
      text: "La musique est un langage universel qui unit notre communauté dans une même prière vocale." 
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="mission-v2">
      <div className="container">
        {/* Header Content */}
        <div className="mission-header-v2">
          <motion.span 
            className="mission-badge-v2"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            NOTRE MISSION
          </motion.span>           
        </div>

        <div className="mission-main-v2">
          {/* Grid of Missions */}
          <motion.div 
            className="mission-grid-v2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {missions.map((mission, idx) => (
              <motion.div key={idx} className="mission-card-v2" variants={itemVariants}>
                <div className="mission-card-icon-v2">
                  <mission.icon size={28} />
                </div>
                <h3>{mission.title}</h3>
                <p>{mission.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Featured Visual Wrapper */}
          <motion.div 
            className="mission-visual-v2"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="visual-image-stack">
              <div className="main-image-frame">
                <img src="https://images.unsplash.com/photo-1548705085-101177834f47?auto=format&fit=crop&q=80&w=1200" alt="Chorale en action" />
              </div>
              <div className="side-image-frame">
                <img src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800" alt="Détail partition" />
              </div>
              
              {/* Decorative Text */}
              <div className="bg-text-decoration">HISTOIRE</div>
            </div>

            <div className="mission-stats-floating glass-panel">
              <div className="stat-floater">
                <div className="stat-val">17</div>
                <div className="stat-txt">Années d'Excellence</div>
              </div>
              <div className="stat-separator"></div>
              <div className="stat-floater">
                <div className="stat-val">2008</div>
                <div className="stat-txt">Fondation</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
