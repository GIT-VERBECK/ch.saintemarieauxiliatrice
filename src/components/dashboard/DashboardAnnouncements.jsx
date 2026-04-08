import React, { useState, useEffect } from 'react';
import { Calendar, Info, AlertTriangle } from 'lucide-react';
import { getAnnouncements } from '../../services/dashboard.service';

const DashboardAnnouncements = ({ readIds = [], onToggleRead, onMarkAllRead }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [readFilter, setReadFilter] = useState('all');

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getAnnouncements();
            setAnnouncements(data || []);
        } catch (error) {
            console.error("Failed to fetch announcements", error);
            setError("Impossible de charger les annonces.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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

    if (error) {
        return (
            <div className="status-card glass-panel">
                <p className="status-text">{error}</p>
                <button type="button" className="btn btn-primary" onClick={fetchAnnouncements}>Réessayer</button>
            </div>
        );
    }

    if (announcements.length === 0) {
        return (
            <div className="status-card glass-panel">
                <p className="status-text">Aucune annonce pour le moment.</p>
            </div>
        );
    }

    const filteredAnnouncements = announcements.filter((ann) => {
        const byType = typeFilter === 'all' || (ann.type || 'info') === typeFilter;
        const isRead = readIds.includes(ann.id);
        const byRead = readFilter === 'all' || (readFilter === 'read' ? isRead : !isRead);
        return byType && byRead;
    });

    return (
        <div className="announcements-timeline">
            <div className="notifications-toolbar glass-panel">
                <div className="notifications-filters">
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        <option value="all">Tous types</option>
                        <option value="info">Info</option>
                        <option value="alert">Alerte</option>
                        <option value="event">Événement</option>
                    </select>
                    <select value={readFilter} onChange={(e) => setReadFilter(e.target.value)}>
                        <option value="all">Lues et non lues</option>
                        <option value="unread">Non lues</option>
                        <option value="read">Lues</option>
                    </select>
                </div>
                <button type="button" className="btn btn-link" onClick={onMarkAllRead}>
                    Marquer tout comme lu
                </button>
            </div>

            {filteredAnnouncements.map(ann => {
                const isRead = readIds.includes(ann.id);
                return (
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
                            {!isRead && <span className="ann-new-badge">NOUVEAU</span>}
                        </div>
                        <h4>{ann.title}</h4>
                        <p>{ann.content}</p>
                        <div className="ann-actions-row">
                            <button type="button" className="btn btn-link" onClick={() => onToggleRead?.(ann.id)}>
                                {isRead ? 'Marquer non lue' : 'Marquer lue'}
                            </button>
                        </div>
                    </div>
                </div>
            );
            })}

            {filteredAnnouncements.length === 0 && (
                <div className="status-card glass-panel">
                    <p className="status-text">Aucune notification pour ce filtre.</p>
                </div>
            )}
        </div>
    );
};

export default DashboardAnnouncements;
