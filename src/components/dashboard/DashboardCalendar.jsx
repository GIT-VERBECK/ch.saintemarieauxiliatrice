import React, { useState, useEffect } from 'react';
import { MapPin, Clock } from 'lucide-react';
import { getEvents } from '../../services/dashboard.service';

const DashboardCalendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState('timeline');

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

    const getStatus = (eventDate) => {
        const now = new Date();
        const d = new Date(eventDate);
        const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const eventDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        if (eventDay === nowDay) return 'today';
        if (eventDay > nowDay) return 'upcoming';
        return 'past';
    };

    const eventToDateTime = (event) => {
        const base = new Date(event.event_date);
        if (event.time) {
            const [hh, mm] = event.time.split(':');
            base.setHours(Number(hh) || 0, Number(mm) || 0, 0, 0);
        }
        return base;
    };

    const downloadIcs = (event) => {
        const start = eventToDateTime(event);
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        const fmt = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const content = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `UID:${event.id}@sma`,
            `DTSTAMP:${fmt(new Date())}`,
            `DTSTART:${fmt(start)}`,
            `DTEND:${fmt(end)}`,
            `SUMMARY:${event.title || 'Événement chorale'}`,
            `LOCATION:${event.location || ''}`,
            `DESCRIPTION:${event.description || ''}`,
            'END:VEVENT',
            'END:VCALENDAR',
        ].join('\n');

        const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(event.title || 'event').replace(/\s+/g, '-').toLowerCase()}.ics`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const openGoogleCalendar = (event) => {
        const start = eventToDateTime(event);
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        const fmt = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: event.title || 'Événement chorale',
            dates: `${fmt(start)}/${fmt(end)}`,
            details: event.description || '',
            location: event.location || '',
        });
        window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
    };

    const groupedByMonth = events.reduce((acc, event) => {
        const key = new Date(event.event_date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        if (!acc[key]) acc[key] = [];
        acc[key].push(event);
        return acc;
    }, {});

    return (
        <div className="calendar-view-wrapper">
            <div className="calendar-toolbar glass-panel">
                <div className="calendar-view-switch">
                    <button type="button" className={`btn ${viewMode === 'timeline' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setViewMode('timeline')}>Timeline</button>
                    <button type="button" className={`btn ${viewMode === 'month' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setViewMode('month')}>Mensuel</button>
                </div>
            </div>

            {viewMode === 'timeline' ? (
                <div className="calendar-timeline">
                    {events.map(event => (
                <div key={event.id} className="event-card glass-panel">
                    <div className="event-date-badge">
                        <span className="day">{new Date(event.event_date).getDate()}</span>
                        <span className="month">{new Date(event.event_date).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}</span>
                    </div>
                    <div className="event-info">
                        <h3>{event.title}</h3>
                        <span className={`event-status status-${getStatus(event.event_date)}`}>
                            {getStatus(event.event_date) === 'today' ? "Aujourd'hui" : getStatus(event.event_date) === 'upcoming' ? 'À venir' : 'Passé'}
                        </span>
                        <div className="event-meta-row">
                            <span className="meta-item"><Clock size={14} /> {event.time || "18:30"}</span>
                            <span className="meta-item"><MapPin size={14} /> {event.location}</span>
                        </div>
                        <div className="event-actions-row">
                            <button type="button" className="btn btn-ghost btn-sm" onClick={() => downloadIcs(event)}>Export .ics</button>
                            <button type="button" className="btn btn-link btn-sm" onClick={() => openGoogleCalendar(event)}>Google Calendar</button>
                        </div>
                    </div>
                </div>
                    ))}
                </div>
            ) : (
                <div className="calendar-month-grid">
                    {Object.entries(groupedByMonth).map(([month, monthEvents]) => (
                        <div key={month} className="month-card glass-panel">
                            <h4>{month}</h4>
                            {monthEvents.map((event) => (
                                <button key={event.id} type="button" className="month-event-item" onClick={() => openGoogleCalendar(event)}>
                                    <span>{new Date(event.event_date).toLocaleDateString('fr-FR', { day: '2-digit' })}</span>
                                    <span>{event.title}</span>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardCalendar;
