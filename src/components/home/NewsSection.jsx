import React from 'react';
import { Megaphone, FileText, Sparkles, ChevronRight } from 'lucide-react';
import ScrollReveal from '../layout/ScrollReveal';

const AnnouncementItem = ({ icon, meta, title, description, index }) => (
  <ScrollReveal 
    className="anno-card"
    direction="right"
    delay={0.1 + index * 0.1}
    distance={20}
  >
    <div className="icon-box">{icon}</div>
    <div className="anno-content">
      <span className="anno-meta">{meta}</span>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </ScrollReveal>
);

const NewsSection = () => {
  return (
    <section id="chorale" style={{ backgroundColor: 'var(--bg-alt)' }}>
      <div className="container">
        <div className="anno-layout">
          <div className="anno-left">
            <ScrollReveal direction="down" distance={20} delay={0.1}>
              <span className="section-tag">Actualités</span>
              <h2 style={{ marginBottom: '32px' }}>Dernières Annonces</h2>
            </ScrollReveal>
            
            <div className="announcement-list">
              <AnnouncementItem 
                icon={<Megaphone size={22} />}
                meta="Mardi 12 Mars"
                index={0}
                title="Audition : Session Voix d'Hommes"
                description="Nous recherchons spécifiquement des barytons et des basses pour la saison prochaine."
              />
              <AnnouncementItem 
                icon={<FileText size={22} />}
                meta="Lundi 4 Mars"
                index={1}
                title="Bibliothèque de Partitions"
                description="Nouveau : les partitions numériques sont accessibles via l'espace membre."
              />
            </div>
            <ScrollReveal delay={0.4}>
              <button className="btn btn-ghost" style={{ marginTop: '24px', width: '100%', justifyContent: 'space-between', paddingTop: '20px', paddingBottom: '20px' }}>
                Voir toutes les annonces <ChevronRight size={18} />
              </button>
            </ScrollReveal>
          </div>

          <ScrollReveal 
            direction="left"
            distance={40}
            delay={0.2}
            className="anno-right"
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
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
