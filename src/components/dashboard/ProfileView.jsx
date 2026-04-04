import React, { useState } from 'react';
import { LogOut, Save, User as UserIcon, Phone, Music } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProfileView = () => {
    const { user, logout, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        voice_type: user?.voice_type || '',
        phone: user?.phone || ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await updateUser(formData);
            setIsEditing(false);
            alert("Profil mis à jour !");
        } catch (error) {
            alert("Erreur lors de la mise à jour");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-section glass-panel">
            <div className="profile-header">
                <div className="profile-avatar-large">
                    {user?.full_name?.charAt(0) || 'U'}
                </div>
                {!isEditing ? (
                    <div className="profile-info">
                        <h2>{user?.full_name}</h2>
                        <p>{user?.email}</p>
                        <span className="pupitre-badge">{user?.voice_type}</span>
                    </div>
                ) : (
                    <div className="profile-info-edit">
                        <input 
                            name="full_name" 
                            value={formData.full_name} 
                            onChange={handleChange} 
                            placeholder="Nom complet"
                            className="edit-input title-input"
                        />
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="profile-details-grid">
                <div className="detail-item">
                    <label><Phone size={14} /> Téléphone</label>
                    {isEditing ? (
                        <input name="phone" value={formData.phone} onChange={handleChange} className="edit-input" />
                    ) : (
                        <p>{user?.phone || 'Non renseigné'}</p>
                    )}
                </div>
                <div className="detail-item">
                    <label><Music size={14} /> Pupitre</label>
                    {isEditing ? (
                        <select name="voice_type" value={formData.voice_type} onChange={handleChange} className="edit-input">
                            <option value="Soprano">Soprano</option>
                            <option value="Alto">Alto</option>
                            <option value="Ténor">Ténor</option>
                            <option value="Basse">Basse</option>
                        </select>
                    ) : (
                        <p>{user?.voice_type}</p>
                    )}
                </div>
                <div className="detail-item">
                    <label>Date d'inscription</label>
                    <p>Avril 2024</p>
                </div>
            </form>

            <div className="profile-actions-footer">
                <button className="btn btn-ghost danger" onClick={logout} type="button">
                    <LogOut size={18} /> Me déconnecter
                </button>
                {isEditing ? (
                    <div className="edit-actions">
                        <button className="btn btn-ghost" onClick={() => setIsEditing(false)} type="button">Annuler</button>
                        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                            <Save size={18} /> {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                ) : (
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Modifier mes infos</button>
                )}
            </div>
        </div>
    );
};

export default ProfileView;
