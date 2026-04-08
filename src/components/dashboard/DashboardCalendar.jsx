import React, { useState, useEffect } from 'react';
import { MapPin, Clock } from 'lucide-react';
import { getEvents } from '../../services/dashboard.service';

const DashboardCalendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getEvents();
            setEvents(data || []);
        } catch (error) {
            console.error("Failed to fetch events", error);
            setError("Impossible de charger l'agenda.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    if (loading) {
        return <div className="loading-simple">Chargement de l'agenda...</div>;
    }

    if (error) {
        return (
            <div className="status-card glass-panel">
                <p className="status-text">{error}</p>
                <button type="button" className="btn btn-primary" onClick={fetchEvents}>Réessayer</button>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="status-card glass-panel">
                <p className="status-text">Aucun événement planifié pour le moment.</p>
            </div>
        );
    }

    return (
        <div className="calendar-timeline">
            {events.map(event => (
                <div key={event.id} className="event-card glass-panel">
                    <div className="event-date-badge">
                        <span className="day">{new Date(event.event_date).getDate()}</span>
                        <span className="month">{new Date(event.event_date).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}</span>
                    </div>
                    <div className="event-info">
                        <h3>{event.title}</h3>
                        <div className="event-meta-row">
                            <span className="meta-item"><Clock size={14} /> {event.time || "18:30"}</span>
                            <span className="meta-item"><MapPin size={14} /> {event.location}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardCalendar;
