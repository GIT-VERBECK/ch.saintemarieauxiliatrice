import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, AlertTriangle, Info } from 'lucide-react';
import { getAnnouncements } from '../../services/dashboard.service';
import { addAnnouncement, deleteAnnouncement } from '../../services/admin.service';

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newAnn, setNewAnn] = useState({
        title: '',
        content: '',
        type: 'info'
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addAnnouncement(newAnn);
            setShowForm(false);
            setNewAnn({ title: '', content: '', type: 'info' });
            fetchAnnouncements();
        } catch (error) {
            alert("Erreur lors de la publication");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette annonce ?")) return;
        try {
            await deleteAnnouncement(id);
            fetchAnnouncements();
        } catch (error) {
            alert("Erreur lors de la suppression");
        }
    };

    if (loading) return <div className="loading-simple">Chargement...</div>;

    return (
        <div className="admin-announcements-view">
            <div className="admin-actions-bar">
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={18} /> Nouvelle Annonce
                </button>
            </div>

            {showForm && (
                <div className="admin-form glass-panel">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-4">
                            <label>Titre de l'annonce</label>
                            <input required value={newAnn.title} onChange={(e) => setNewAnn({...newAnn, title: e.target.value})} placeholder="Titre court et clair" />
                        </div>
                        <div className="form-group mb-4">
                            <label>Contenu du message</label>
                            <textarea required rows="3" value={newAnn.content} onChange={(e) => setNewAnn({...newAnn, content: e.target.value})} placeholder="Votre message pour les choristes..."></textarea>
                        </div>
                        <div className="form-group mb-4">
                            <label>Type d'annonce</label>
                            <select value={newAnn.type} onChange={(e) => setNewAnn({...newAnn, type: e.target.value})}>
                                <option value="info">Information (Bleu)</option>
                                <option value="alert">Alerte / Important (Or)</option>
                                <option value="event">Événement (Indigo)</option>
                            </select>
                        </div>
                        <div className="form-footer">
                            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Annuler</button>
                            <button type="submit" className="btn btn-primary">Publier</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="announcements-admin-list">
                {announcements.map(ann => (
                    <div key={ann.id} className="ann-admin-card glass-panel flex align-center justify-between">
                        <div className="ann-info">
                            <div className="flex align-center gap-2 mb-1">
                                <span className={`role-tag role-${ann.type}`}>{ann.type.toUpperCase()}</span>
                                <span className="text-muted small">{new Date(ann.created_at).toLocaleDateString()}</span>
                            </div>
                            <h3>{ann.title}</h3>
                            <p className="text-secondary small">{ann.content.substring(0, 80)}...</p>
                        </div>
                        <button className="icon-btn danger" onClick={() => handleDelete(ann.id)}><Trash2 size={16} /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminAnnouncements;
