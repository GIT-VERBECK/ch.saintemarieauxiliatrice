import React from 'react';
import { Music, Download, ExternalLink } from 'lucide-react';

const DashboardScores = () => {
  const scores = [
    { id: 1, title: 'Laudemus Virginem', category: 'Liturgie', date: '02/04/2024' },
    { id: 2, title: 'Missa Brevis', category: 'Classique', date: '28/03/2024' },
    { id: 3, title: 'Ave Maria - Arcadelt', category: 'Soli', date: '15/03/2024' },
    { id: 4, title: 'Canticorum Jubilo', category: 'Hymne', date: '10/03/2024' },
  ];

  return (
    <div className="scores-grid">
      {scores.map(score => (
        <div key={score.id} className="score-card glass-panel">
          <div className="score-icon">
            <Music size={24} />
          </div>
          <div className="score-details">
            <h4>{score.title}</h4>
            <span className="score-cat">{score.category}</span>
            <span className="score-date">Ajouté le {score.date}</span>
          </div>
          <div className="score-actions">
            <button className="icon-btn" title="Ouvrir"><ExternalLink size={18} /></button>
            <button className="icon-btn primary" title="Télécharger"><Download size={18} /></button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardScores;
