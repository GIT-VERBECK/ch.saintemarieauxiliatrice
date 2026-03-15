import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import '../../styles/home.css';

const EventCard = ({ image, date, title, description, animation }) => (
  <motion.div className="event-card" {...animation}>
    <div className="card-img-container">
      <img src={image} alt={title} loading="lazy" />
      <span className="badge-date">{date}</span>
    </div>
    <div className="card-body">
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="btn btn-ghost" style={{ width: '100%', fontSize: '0.8125rem', padding: '8px' }}>
        Détails de l'événement <ChevronRight size={14} />
      </button>
    </div>
  </motion.div>
);

const EventsSection = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <section id="evenements">
      <div className="container">
        <div className="section-head">
          <span className="section-tag">Calendrier</span>
          <h2>Prochaines Apparitions</h2>
          <p>Rejoignez-nous pour nos prochaines interventions musicales et liturgiques.</p>
        </div>

        <div className="grid-events">
          <EventCard
            image="src/assets/images/lucien.png"
            date="15 AVRIL 2024"
            title="Grand Concert de Pâques"
            description="Une sélection d'œuvres sacrées baroques avec orchestre à cordes."
            animation={fadeIn}
          />
          <EventCard
            image="https://www.famillechretienne.fr/sites/default/files/dpistyles/ena_16_9_extra_big/node_7279/84050/public/thumbnails/image/visitation_vierge_marie.jpg?itok=lr7o5QXV1653923298"
            date="24 MAI 2024"
            title="Fête de la Vierge"
            description="Messe solennelle et procession aux flambeaux dans le vieux Lyon."
            animation={fadeIn}
          />
          <EventCard
            image="src/assets/images/pacifique.png"
            date="DIMANCHE 10H30"
            title="Messe de la Communauté"
            description="Notre rendez-vous hebdomadaire pour la louange liturgique."
            animation={fadeIn}
          />
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
