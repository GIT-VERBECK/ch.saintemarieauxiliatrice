import React from 'react';
import { Calendar, Info, AlertTriangle } from 'lucide-react';

const DashboardAnnouncements = () => {
  const announcements = [
    { id: 1, type: 'info', date: 'Hier, 14:30', title: 'Répétition générale', content: 'N\'oubliez pas vos chemises blanches pour l\'enregistrement de samedi matin à 9h00.' },
    { id: 2, type: 'alert', date: '01 Avril 2024', title: 'Changement de salle', content: 'Exceptionnellement, la répétition de ce mardi aura lieu à la salle municipale et non à la paroisse.' },
    { id: 3, type: 'event', date: '28 Mars 2024', title: 'Concert de Pâques', content: 'Le programme définitif a été validé. Merci de consulter la section Partitions.' }
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'alert': return <AlertTriangle size={20} color="#F59E0B" />;
      case 'event': return <Calendar size={20} color="#2563EB" />;
      default: return <Info size={20} color="#64748B" />;
    }
  };

  return (
    <div className="announcements-timeline">
      {announcements.map(ann => (
        <div key={ann.id} className="announcement-card glass-panel">
          <div className="ann-icon">
            {getIcon(ann.type)}
          </div>
          <div className="ann-content">
            <div className="ann-meta">
              <span className="ann-date">{ann.date}</span>
              <span className={`ann-type type-${ann.type}`}>{ann.type.toUpperCase()}</span>
            </div>
            <h4>{ann.title}</h4>
            <p>{ann.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardAnnouncements;
