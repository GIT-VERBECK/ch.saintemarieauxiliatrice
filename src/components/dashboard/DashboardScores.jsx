import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Music, Download, ExternalLink } from 'lucide-react';
import { getPartitions } from '../../services/dashboard.service';

const DashboardScores = () => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openingId, setOpeningId] = useState(null);

    const fetchScores = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getPartitions();
            setScores(data || []);
        } catch (error) {
            console.error("Failed to fetch scores", error);
            setError("Impossible de charger les partitions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScores();
    }, []);

    if (loading) {
        return <div className="loading-simple">Chargement des partitions...</div>;
    }

    if (error) {
        return (
            <div className="status-card glass-panel">
                <p className="status-text">{error}</p>
                <button type="button" className="btn btn-primary" onClick={fetchScores}>Réessayer</button>
            </div>
        );
    }

    if (scores.length === 0) {
        return (
            <div className="status-card glass-panel">
                <p className="status-text">Aucune partition disponible pour le moment.</p>
            </div>
        );
    }

    const handleOpen = (score) => {
        if (!score.attachment_url) {
            toast.error('Lien non disponible');
            return;
        }
        setOpeningId(score.id);
        window.open(score.attachment_url, '_blank');
        setTimeout(() => setOpeningId(null), 300);
    };

    return (
        <div className="scores-grid">
            {scores.map(score => (
                <div key={score.id} className="score-card glass-panel">
                    <div className="score-icon">
                        <Music size={24} />
                    </div>
                    <div className="score-details">
                        <h4>{score.title}</h4>
                        <span className="score-cat">{score.category || score.composer}</span>
                        <span className="score-date">Ajouté le {new Date(score.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="score-actions">
                        <button 
                            className="icon-btn" 
                            title="Ouvrir" 
                            onClick={() => handleOpen(score)}
                            disabled={openingId === score.id}
                        >
                            <ExternalLink size={18} />
                        </button>
                        <button 
                            className="icon-btn primary" 
                            title="Télécharger"
                            onClick={() => handleOpen(score)}
                            disabled={openingId === score.id}
                        >
                            <Download size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardScores;
