import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Music, Download, ExternalLink } from 'lucide-react';
import { getPartitions } from '../../services/dashboard.service';

const DashboardScores = () => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                setLoading(true);
                const data = await getPartitions();
                setScores(data);
            } catch (error) {
                console.error("Failed to fetch scores", error);
                // On peut garder les scores mockés en cas d'erreur ou d'absence de données
            } finally {
                setLoading(false);
            }
        };
        fetchScores();
    }, []);

    if (loading) {
        return <div className="loading-simple">Chargement des partitions...</div>;
    }

    // Données de secours si la table est vide
    const displayScores = scores.length > 0 ? scores : [
        { id: 1, title: 'Laudemus Virginem', category: 'Liturgie', created_at: '2024-04-02' },
        { id: 2, title: 'Missa Brevis', category: 'Classique', created_at: '2024-03-28' },
        { id: 3, title: 'Ave Maria - Arcadelt', category: 'Soli', created_at: '2024-03-15' },
    ];

    return (
        <div className="scores-grid">
            {displayScores.map(score => (
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
                            onClick={() => score.attachment_url ? window.open(score.attachment_url, '_blank') : toast.error('Lien non disponible')}
                        >
                            <ExternalLink size={18} />
                        </button>
                        <button 
                            className="icon-btn primary" 
                            title="Télécharger"
                            onClick={() => score.attachment_url ? window.open(score.attachment_url, '_blank') : toast.error('Lien de téléchargement non disponible')}
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
