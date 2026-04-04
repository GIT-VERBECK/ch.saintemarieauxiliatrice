import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, MapPin, Clock } from 'lucide-react';
import { getEvents } from '../../services/dashboard.service';
import { addEvent, deleteEvent } from '../../services/admin.service';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        event_date: '',
        location: '',
        time: '',
        description: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addEvent(newEvent);
            setShowForm(false);
            setNewEvent({ title: '', event_date: '', location: '', time: '', description: '' });
            fetchEvents();
        } catch (error) {
            alert("Erreur lors de la programmation");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Annuler cet événement ?")) return;
        try {
            await deleteEvent(id);
            fetchEvents();
        } catch (error) {
            alert("Erreur lors de l'annulation");
        }
    };

    if (loading) return <div className="loading-simple">Chargement...</div>;

    return (
        <div className="admin-events-view">
            <div className="admin-actions-bar">
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={18} /> Programmer un événement
                </button>
            </div>

            {showForm && (
                <div className="admin-form glass-panel">
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Titre de l'événement</label>
                                <input required value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} placeholder="Ex: Répétition Générale" />
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input type="date" required value={newEvent.event_date} onChange={(e) => setNewEvent({...newEvent, event_date: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Heure</label>
                                <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Lieu</label>
                                <input required value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} placeholder="Lieu de rendez-vous" />
                            </div>
                        </div>
                        <div className="form-footer">
                            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Annuler</button>
                            <button type="submit" className="btn btn-primary">Enregistrer</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="admin-list glass-panel">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Événement</th>
                            <th>Lieu</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event.id}>
                                <td><strong>{new Date(event.event_date).toLocaleDateString('fr-FR')}</strong></td>
                                <td>{event.title}</td>
                                <td>{event.location}</td>
                                <td>
                                    <div className="admin-actions">
                                        <button className="icon-btn danger" onClick={() => handleDelete(event.id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminEvents;
