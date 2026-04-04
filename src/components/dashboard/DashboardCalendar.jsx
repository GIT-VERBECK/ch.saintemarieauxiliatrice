import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { getEvents } from '../../services/dashboard.service';

const DashboardCalendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const data = await getEvents();
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return <div className="loading-simple">Chargement de l'agenda...</div>;
    }

    const displayEvents = events.length > 0 ? events : [
        { id: 1, title: 'Répétition hebdomadaire', event_date: '2024-04-10', location: 'Paroisse Sainte Marie Auxiliatrice', time: '18:30' },
        { id: 2, title: 'Messe du Dimanche', event_date: '2024-04-14', location: 'Grande Cathédrale', time: '09:00' },
    ];

    const formatDate = (dateStr) => {
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateStr));
    };

    return (
        <div className="calendar-timeline">
            {displayEvents.map(event => (
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
