import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone, FileText, Sparkles, ChevronRight } from 'lucide-react';

const AnnouncementItem = ({ icon, meta, title, description }) => (
  <div className="anno-card">
    <div className="icon-box">{icon}</div>
    <div className="anno-content">
      <span className="anno-meta">{meta}</span>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </div>
);

const NewsSection = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <section id="chorale" style={{ backgroundColor: 'var(--bg-alt)' }}>
      <div className="container">
        <div className="anno-layout">
          <motion.div {...fadeIn}>
            <span className="section-tag">Actualités</span>
            <h2 style={{ marginBottom: '32px' }}>Dernières Annonces</h2>
            <div className="announcement-list">
              <AnnouncementItem 
                icon={<Megaphone size={22} />}
                meta="Mardi 12 Mars"
                title="Audition : Session Voix d'Hommes"
                description="Nous recherchons spécifiquement des barytons et des basses pour la saison prochaine."
              />
              <AnnouncementItem 
                icon={<FileText size={22} />}
                meta="Lundi 4 Mars"
                title="Bibliothèque de Partitions"
                description="Nouveau : les partitions numériques sont accessibles via l'espace membre."
              />
            </div>
            <button className="btn btn-ghost" style={{ marginTop: '24px', width: '100%', justifyContent: 'space-between' }}>
              Voir toutes les annonces <ChevronRight size={18} />
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <br />
            <div style={{ background: 'var(--bg-primary)', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <Sparkles size={32} color="var(--brand-accent)" style={{ marginBottom: '24px' }} />
              <blockquote style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '32px', fontStyle: 'italic', lineHeight: '1.5' }}>
                "La musique est le langage de l'âme. Nos voix ne sont que les instruments d'une harmonie qui nous dépasse."
              </blockquote>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>JD</div>
                <div>
                  <h5 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Jean-Dominique</h5>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Maître de Chapelle</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
