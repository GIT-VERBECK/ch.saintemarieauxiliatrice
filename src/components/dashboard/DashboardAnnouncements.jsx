import React, { useState, useEffect } from 'react';
import { Calendar, Info, AlertTriangle } from 'lucide-react';
import { getAnnouncements } from '../../services/dashboard.service';

const DashboardAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setLoading(true);
                const data = await getAnnouncements();
                setAnnouncements(data);
            } catch (error) {
                console.error("Failed to fetch announcements", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    const getIcon = (type) => {
        switch(type) {
            case 'alert': return <AlertTriangle size={20} color="#F59E0B" />;
            case 'event': return <Calendar size={20} color="#2563EB" />;
            default: return <Info size={20} color="#64748B" />;
        }
    };

    if (loading) {
        return <div className="loading-simple">Chargement des annonces...</div>;
    }

    const displayAnnouncements = announcements.length > 0 ? announcements : [
        { id: 1, type: 'info', created_at: new Date().toISOString(), title: 'Répétition générale', content: 'N\'oubliez pas vos chemises blanches pour l\'enregistrement de samedi matin à 9h00.' },
    ];

    return (
        <div className="announcements-timeline">
            {displayAnnouncements.map(ann => (
                <div key={ann.id} className="announcement-card glass-panel">
                    <div className="ann-icon">
                        {getIcon(ann.type || 'info')}
                    </div>
                    <div className="ann-content">
                        <div className="ann-meta">
                            <span className="ann-date">
                                {new Date(ann.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className={`ann-type type-${ann.type || 'info'}`}>{(ann.type || 'info').toUpperCase()}</span>
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
