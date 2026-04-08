import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Music, Download, ExternalLink } from 'lucide-react';
import { getPartitions } from '../../services/dashboard.service';

const DashboardScores = ({ favorites = [], onFavoritesChange, lastOpenedScore, onLastOpenedChange }) => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openingId, setOpeningId] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [voiceFilter, setVoiceFilter] = useState('all');
    const [composerFilter, setComposerFilter] = useState('all');
    const [previewUrl, setPreviewUrl] = useState('');

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
        onLastOpenedChange?.({
            id: score.id,
            title: score.title,
            at: new Date().toISOString(),
        });
        setTimeout(() => setOpeningId(null), 300);
    };

    const categories = ['all', ...new Set(scores.map((s) => s.category).filter(Boolean))];
    const voices = ['all', ...new Set(scores.map((s) => s.voice_type).filter(Boolean))];
    const composers = ['all', ...new Set(scores.map((s) => s.composer).filter(Boolean))];

    const filteredScores = scores.filter((score) => {
        const byCategory = categoryFilter === 'all' || score.category === categoryFilter;
        const byVoice = voiceFilter === 'all' || score.voice_type === voiceFilter || score.voice_type === 'Tous';
        const byComposer = composerFilter === 'all' || score.composer === composerFilter;
        return byCategory && byVoice && byComposer;
    });

    const toggleFavorite = (id) => {
        const next = favorites.includes(id) ? favorites.filter((v) => v !== id) : [...favorites, id];
        onFavoritesChange?.(next);
    };

    const isPreviewable = (url = '') => /\.(pdf|mp3|wav|ogg)$/i.test(url);

    return (
        <div className="scores-view-wrapper">
            <div className="scores-toolbar glass-panel">
                <select value={voiceFilter} onChange={(e) => setVoiceFilter(e.target.value)}>
                    {voices.map((voice) => <option key={voice} value={voice}>{voice === 'all' ? 'Tous pupitres' : voice}</option>)}
                </select>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    {categories.map((category) => <option key={category} value={category}>{category === 'all' ? 'Toutes catégories' : category}</option>)}
                </select>
                <select value={composerFilter} onChange={(e) => setComposerFilter(e.target.value)}>
                    {composers.map((composer) => <option key={composer} value={composer}>{composer === 'all' ? 'Tous compositeurs' : composer}</option>)}
                </select>
            </div>

            {!!previewUrl && (
                <div className="score-preview-panel glass-panel">
                    <div className="flex align-center justify-between">
                        <h4>Aperçu de la partition</h4>
                        <button type="button" className="btn btn-link" onClick={() => setPreviewUrl('')}>Fermer</button>
                    </div>
                    {/\.(mp3|wav|ogg)$/i.test(previewUrl) ? (
                        <audio controls src={previewUrl} className="score-audio-player" />
                    ) : (
                        <iframe title="Aperçu partition" src={previewUrl} className="score-preview-frame" />
                    )}
                </div>
            )}

            <div className="scores-grid">
            {filteredScores.map(score => (
                <div key={score.id} className="score-card glass-panel">
                    <div className="score-icon">
                        <Music size={24} />
                    </div>
                    <div className="score-details">
                        <h4>{score.title}</h4>
                        <span className="score-cat">{score.category || score.composer}</span>
                        <span className="score-date">Ajouté le {new Date(score.created_at).toLocaleDateString('fr-FR')}</span>
                        <button type="button" className="btn btn-link btn-sm" onClick={() => toggleFavorite(score.id)}>
                            {favorites.includes(score.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        </button>
                        {lastOpenedScore?.id === score.id && (
                            <span className="score-resume-tag">Reprendre (ouvert récemment)</span>
                        )}
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
                        <button
                            className="icon-btn"
                            title="Aperçu"
                            onClick={() => isPreviewable(score.attachment_url) ? setPreviewUrl(score.attachment_url) : toast('Aperçu non disponible pour ce lien.')}
                        >
                            <Music size={16} />
                        </button>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
};

export default DashboardScores;
