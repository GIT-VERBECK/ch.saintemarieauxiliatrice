import React, { useState } from 'react';
import { LogOut, User as UserIcon, Phone, Music, CircleUser, Mail, Calendar, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

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
            toast.success("Profil mis à jour avec succès.");
        } catch {
            toast.error("Erreur lors de la mise à jour.");
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoChange = () => {
        toast("Le changement de photo sera disponible dans une prochaine version.");
    };

    const handlePasswordChange = () => {
        toast("La modification du mot de passe se fait actuellement via le support administrateur.");
    };

    return (
        <div className="profile-view-wrapper">
            <div className="profile-hero-card glass-panel">
                <div className="hero-background"></div>
                <div className="hero-content">
                    <div className="avatar-container">
                        <div className="profile-avatar-large">
                            <CircleUser size={80} />
                            <button type="button" className="change-photo-btn" onClick={handlePhotoChange}>
                                <Camera size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="hero-user-info">
                        <h2>{user?.full_name}</h2>
                        <div className="hero-badges">
                            <span className="pupitre-badge-large">{user?.voice_type}</span>
                            <span className="role-badge-large">{user?.role}</span>
                        </div>
                    </div>
                    <div className="hero-actions">
                        {!isEditing ? (
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                                Modifier le profil
                            </button>
                        ) : (
                            <div className="edit-active-badge">Mode Édition Active</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="profile-main-grid">
                {/* Section Informations Personnelles */}
                <div className="info-card glass-panel">
                    <div className="card-header">
                        <h3>Informations Personnelles</h3>
                    </div>
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="input-field-group">
                            <label><UserIcon size={16} /> Nom Complet</label>
                            <input 
                                name="full_name"
                                value={isEditing ? formData.full_name : user?.full_name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={isEditing ? "editable" : ""}
                            />
                        </div>

                        <div className="input-field-group">
                            <label><Mail size={16} /> Adresse Email</label>
                            <input 
                                value={user?.email}
                                disabled={true}
                                className="readonly"
                            />
                            <span className="input-hint">L'email ne peut pas être modifié pour le moment.</span>
                        </div>

                        <div className="input-field-group">
                            <label><Phone size={16} /> Téléphone</label>
                            <input 
                                name="phone"
                                value={isEditing ? formData.phone : (user?.phone || '')}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={isEditing ? "editable" : ""}
                                placeholder="+243 ..."
                            />
                        </div>

                        <div className="input-field-group">
                            <label><Music size={16} /> Pupitre Vocal</label>
                            {isEditing ? (
                                <select 
                                    name="voice_type" 
                                    value={formData.voice_type} 
                                    onChange={handleChange}
                                    className="editable"
                                >
                                    <option value="Soprano">Soprano</option>
                                    <option value="Alto">Alto</option>
                                    <option value="Ténor">Ténor</option>
                                    <option value="Basse">Basse</option>
                                </select>
                            ) : (
                                <input value={user?.voice_type} disabled className="readonly" />
                            )}
                        </div>

                        <AnimatePresence>
                            {isEditing && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="form-submit-row"
                                >
                                    <button type="button" className="btn btn-ghost" onClick={() => setIsEditing(false)}>
                                        Annuler
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? "Enregistrement..." : "Sauvegarder les changements"}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>

                {/* Section Compte & Stats */}
                <div className="stats-sidebar">
                    <div className="stat-mini-card glass-panel">
                        <div className="stat-content">
                            <Calendar size={20} className="stat-icon" />
                            <div className="stat-data">
                                <span className="stat-label">Membre depuis</span>
                                <span className="stat-value">Avril 2024</span>
                            </div>
                        </div>
                    </div>

                    <div className="account-safety-card glass-panel">
                        <h3>Sécurité</h3>
                        <p>Dernière connexion: Aujourd'hui</p>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={handlePasswordChange}>
                            Changer mon mot de passe
                        </button>
                        <div className="danger-zone">
                            <button className="btn btn-ghost danger btn-block mt-4" onClick={logout}>
                                <LogOut size={16} /> Se déconnecter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
