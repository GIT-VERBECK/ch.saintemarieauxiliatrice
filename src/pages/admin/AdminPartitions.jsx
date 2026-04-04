import React, { useState, useEffect } from 'react';
import { Music, Plus, Trash2, ExternalLink } from 'lucide-react';
import { getPartitions } from '../../services/dashboard.service';
import { addPartition, deletePartition } from '../../services/admin.service';

const AdminPartitions = () => {
    const [partitions, setPartitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newPartition, setNewPartition] = useState({
        title: '',
        composer: '',
        category: 'Liturgie',
        voice_type: 'Tous',
        attachment_url: ''
    });

    useEffect(() => {
        fetchPartitions();
    }, []);

    const fetchPartitions = async () => {
        try {
            setLoading(true);
            const data = await getPartitions();
            setPartitions(data);
        } catch (error) {
            console.error("Failed to fetch partitions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPartition = async (e) => {
        e.preventDefault();
        try {
            await addPartition(newPartition);
            setShowForm(false);
            setNewPartition({ title: '', composer: '', category: 'Liturgie', voice_type: 'Tous', attachment_url: '' });
            fetchPartitions();
        } catch (error) {
            alert("Erreur lors de l'ajout");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette partition ?")) return;
        try {
            await deletePartition(id);
            fetchPartitions();
        } catch (error) {
            alert("Erreur lors de la suppression");
        }
    };

    if (loading) return <div className="loading-simple">Chargement...</div>;

    return (
        <div className="admin-scores-view">
            <div className="admin-actions-bar">
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={18} /> Nouvelle Partition
                </button>
            </div>

            {showForm && (
                <div className="admin-form glass-panel">
                    <form onSubmit={handleAddPartition}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Titre de l'œuvre</label>
                                <input required value={newPartition.title} onChange={(e) => setNewPartition({...newPartition, title: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Compositeur / Auteur</label>
                                <input value={newPartition.composer} onChange={(e) => setNewPartition({...newPartition, composer: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Catégorie</label>
                                <select value={newPartition.category} onChange={(e) => setNewPartition({...newPartition, category: e.target.value})}>
                                    <option value="Liturgie">Liturgie</option>
                                    <option value="Classique">Classique</option>
                                    <option value="Hymne">Hymne</option>
                                    <option value="Soli">Soli</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Lien du document (PDF/Drive)</label>
                                <input value={newPartition.attachment_url} onChange={(e) => setNewPartition({...newPartition, attachment_url: e.target.value})} placeholder="URL du fichier..." />
                            </div>
                        </div>
                        <div className="form-footer">
                            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Annuler</button>
                            <button type="submit" className="btn btn-primary">Publier la partition</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="admin-list glass-panel">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Titre</th>
                            <th>Compositeur</th>
                            <th>Catégorie</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partitions.map(p => (
                            <tr key={p.id}>
                                <td><strong>{p.title}</strong></td>
                                <td>{p.composer || 'Anonyme'}</td>
                                <td><span className="cat-badge">{p.category}</span></td>
                                <td>
                                    <div className="admin-actions">
                                        <button className="icon-btn danger" onClick={() => handleDelete(p.id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {partitions.length === 0 && <tr><td colSpan="4">Aucune partition trouvée.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPartitions;
