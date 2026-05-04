import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Bell, Calendar, Music, CircleUser, MapPin, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardScores from '../components/dashboard/DashboardScores';
import DashboardAnnouncements from '../components/dashboard/DashboardAnnouncements';
import DashboardCalendar from '../components/dashboard/DashboardCalendar';
import ProfileView from '../components/dashboard/ProfileView';
import AdminMembers from './admin/AdminMembers';
import AdminPartitions from './admin/AdminPartitions';
import AdminEvents from './admin/AdminEvents';
import AdminAnnouncements from './admin/AdminAnnouncements';
import SEO from '../components/ui/SEO';
import { getDashboardOverview, getDashboardPreferences, updateDashboardPreferences } from '../services/dashboard.service';
import '../styles/Dashboard.css';

// Layout global pour les sous-vues du dashboard
const SubViewLayout = ({ title, children, subtitle }) => (
  <Motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="subview-container"
  >
    <div className="subview-header">
      <div className="title-stack">
        <h1>{title}</h1>
        {subtitle && <p className="subview-subtitle">{subtitle}</p>}
      </div>
    </div>
    <div className="subview-content">
      {children}
    </div>
  </Motion.div>
);

const Overview = ({ data, loading, error, onRetry }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });
    
    // Formatter la date de la prochaine répétition
    const formatDate = (dateStr) => {
        if (!dateStr) return "À définir";
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return "Date invalide";
            const options = { weekday: 'long', day: 'numeric', month: 'long' };
            return new Intl.DateTimeFormat('fr-FR', options).format(date);
        } catch {
            return "À définir";
        }
    };

    useEffect(() => {
        if (!data?.nextEvent?.event_date) return;
        
        const timer = setInterval(() => {
            const target = new Date(data.nextEvent.event_date);
            const diff = target - new Date();
            
            if (diff > 0) {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    mins: Math.floor((diff / 1000 / 60) % 60),
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [data?.nextEvent]);

    if (loading) {
        return (
            <SubViewLayout title="Chargement..." subtitle="Nous préparons vos ressources.">
                <div className="loading-container"><div className="spinner"></div></div>
            </SubViewLayout>
        );
    }

    if (error) {
        return (
            <SubViewLayout title="Impossible de charger le tableau de bord" subtitle="Vérifiez votre connexion puis réessayez.">
                <div className="status-card glass-panel">
                    <p className="status-text">{error}</p>
                    <button type="button" className="btn btn-primary" onClick={onRetry}>
                        Réessayer
                    </button>
                </div>
            </SubViewLayout>
        );
    }

    const isAdminView = user?.role === 'Admin' || user?.role === 'Choir_Master';
    const assignedPartitions = (data?.recentPartitions || []).filter((item) => {
      if (!item.voice_type || item.voice_type === 'Tous') return true;
      return item.voice_type === user?.voice_type;
    });

    return (
        <SubViewLayout 
            title={`Heureux de vous revoir, ${user?.full_name?.split(' ')[0] || 'Choriste'} ! 👋`}
            subtitle="Explorez vos ressources et l'actualité de la chorale."
        >
            <div className="dashboard-grid-elite">
                {/* HERO: Prochaine Répétition */}
                <div className="hero-banner-card glass-panel" onClick={() => navigate('/dashboard/calendar')}>
                    <div className="hero-banner-content">
                        <div className="hero-tag-badge">ÉVÉNEMENT À VENIR</div>
                        <h2>{data?.nextEvent?.title || "Répétition Générale"}</h2>
                        <div className="hero-meta">
                           <div className="meta-info">
                              <Calendar size={18} />
                              <span>{formatDate(data?.nextEvent?.event_date)}</span>
                           </div>
                           <div className="meta-info">
                              <MapPin size={18} />
                              <span>{data?.nextEvent?.location || "Sainte Marie Auxiliatrice"}</span>
                           </div>
                        </div>
                    </div>
                    <div className="hero-countdown-box">
                        <div className="countdown-ring">
                           <div className="countdown-value">
                              <strong>{String(timeLeft.days).padStart(2, '0')}</strong>
                              <small>JOURS</small>
                           </div>
                        </div>
                        <div className="countdown-time-mini">
                           <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                           <span>{String(timeLeft.mins).padStart(2, '0')}m</span>
                        </div>
                    </div>
                </div>

                {/* STATS ROW */}
                <div className="stats-row">
                    <div className="stat-card glass-panel">
                        <div className="stat-icon-circ blue"><Music size={18} /></div>
                        <div className="stat-val-stack">
                           <span className="stat-v">{data?.stats?.totalPartitions || 42}</span>
                           <span className="stat-l">Partitions</span>
                        </div>
                    </div>
                    <div className="stat-card glass-panel">
                        <div className="stat-icon-circ indigo"><Users size={18} /></div>
                        <div className="stat-val-stack">
                           <span className="stat-v">{data?.stats?.totalMembers || 85}</span>
                           <span className="stat-l">Choristes</span>
                        </div>
                    </div>
                </div>

                <div className="role-panel-row">
                    {isAdminView ? (
                        <>
                            <div className="role-panel-card glass-panel">
                                <h3>Vue administration</h3>
                                <p>Accès rapide aux actions de gestion.</p>
                                <div className="role-actions">
                                    <button type="button" className="btn btn-primary" onClick={() => navigate('/dashboard/admin/events')}>Programmer un événement</button>
                                    <button type="button" className="btn btn-ghost" onClick={() => navigate('/dashboard/admin/announcements')}>Modérer les annonces</button>
                                </div>
                            </div>
                            <div className="role-panel-card glass-panel">
                                <h3>Métriques rapides</h3>
                                <p>{data?.stats?.totalMembers || 0} membres, {data?.stats?.totalPartitions || 0} partitions.</p>
                                <button type="button" className="btn btn-link" onClick={() => navigate('/dashboard/admin/members')}>Voir la gestion des membres</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="role-panel-card glass-panel">
                                <h3>Prochaines répétitions</h3>
                                <p>Consultez et préparez votre semaine chorale.</p>
                                <button type="button" className="btn btn-primary" onClick={() => navigate('/dashboard/calendar')}>Ouvrir l'agenda</button>
                            </div>
                            <div className="role-panel-card glass-panel">
                                <h3>Partitions assignées ({user?.voice_type || 'Tous'})</h3>
                                <p>{assignedPartitions.length} partition(s) correspondant à votre pupitre.</p>
                                <button type="button" className="btn btn-link" onClick={() => navigate('/dashboard/scores')}>Voir mes partitions</button>
                            </div>
                        </>
                    )}
                </div>

                {/* TWO COLUMN CONTENT */}
                <div className="main-content-split">
                    {/* Partitions */}
                    <div className="split-widget glass-panel">
                        <div className="widget-header">
                            <h3>Bibliothèque de partitions</h3>
                            <button className="btn-link" onClick={() => navigate('/dashboard/scores')}>Voir tout</button>
                        </div>
                        <div className="mini-score-list">
                            {(data?.recentPartitions || []).map(p => (
                                <div key={p.id} className="score-row-item" onClick={() => navigate('/dashboard/scores')}>
                                    <div className="score-icon-mini"><Music size={14} /></div>
                                    <div className="score-txt">
                                        <strong>{p.title}</strong>
                                        <small>{p.composer} • {p.category}</small>
                                    </div>
                                </div>
                            ))}
                            {(!data?.recentPartitions || data?.recentPartitions.length === 0) && (
                                <div className="empty-state-mini">Aucune partition récente.</div>
                            )}
                        </div>
                    </div>

                    {/* Dernières Nouvelles */}
                    <div className="split-widget glass-panel">
                        <div className="widget-header">
                            <h3>Flash Infos</h3>
                            <button className="btn-link" onClick={() => navigate('/dashboard/announcements')}>Historique</button>
                        </div>
                        <div className="announcement-mini-container">
                            {(data?.announcements || []).map(ann => (
                                <div key={ann.id} className={`ann-mini-item type-${ann.type || 'info'}`} onClick={() => navigate('/dashboard/announcements')}>
                                    <div className="ann-title">{ann.title}</div>
                                    <div className="ann-excerpt">{(ann.content || '').substring(0, 70)}...</div>
                                    <div className="ann-date">{new Date(ann.created_at).toLocaleDateString()}</div>
                                </div>
                            ))}
                            {(!data?.announcements || data?.announcements.length === 0) && (
                                <div className="empty-state-mini">Aucune annonce récente.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SubViewLayout>
    );
};

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchScope, setSearchScope] = useState('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [readAnnouncementIds, setReadAnnouncementIds] = useState([]);
  const [favoriteScoreIds, setFavoriteScoreIds] = useState([]);
  const [lastOpenedScore, setLastOpenedScore] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const canAccessAdmin = user?.role === 'Admin' || user?.role === 'Choir_Master';
  const unreadCount = useMemo(() => {
    const ids = new Set(readAnnouncementIds);
    return (dashboardData?.announcements || []).filter((ann) => !ids.has(ann.id)).length;
  }, [dashboardData?.announcements, readAnnouncementIds]);

  const fetchDashboardData = useCallback(async () => {
    try {
        setIsLoading(true);
        setLoadError('');
        const data = await getDashboardOverview();
        setDashboardData(data);
    } catch (error) {
        console.error("Failed to load dashboard data", error);
        setLoadError("Le serveur dashboard est temporairement indisponible.");
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const prefs = await getDashboardPreferences();
        setReadAnnouncementIds(prefs.readAnnouncementIds || []);
        setFavoriteScoreIds(prefs.favoriteScoreIds || []);
        setLastOpenedScore(prefs.lastOpenedScore || null);
      } catch {
        // Fallback localStorage for compatibility
        try {
          const readRaw = localStorage.getItem('sma_read_announcements');
          const favRaw = localStorage.getItem('sma_favorite_scores');
          const lastRaw = localStorage.getItem('sma_last_opened_score');
          setReadAnnouncementIds(readRaw ? JSON.parse(readRaw) : []);
          setFavoriteScoreIds(favRaw ? JSON.parse(favRaw) : []);
          setLastOpenedScore(lastRaw ? JSON.parse(lastRaw) : null);
        } catch {
          setReadAnnouncementIds([]);
          setFavoriteScoreIds([]);
          setLastOpenedScore(null);
        }
      }
    };
    fetchPreferences();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      updateDashboardPreferences({ readAnnouncementIds, favoriteScoreIds, lastOpenedScore }).catch(() => {
        localStorage.setItem('sma_read_announcements', JSON.stringify(readAnnouncementIds));
        localStorage.setItem('sma_favorite_scores', JSON.stringify(favoriteScoreIds));
        localStorage.setItem('sma_last_opened_score', JSON.stringify(lastOpenedScore));
      });
    }, 400);
    return () => clearTimeout(t);
  }, [readAnnouncementIds, favoriteScoreIds, lastOpenedScore]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const searchableEntries = useMemo(() => {
    if (!dashboardData) return [];

    const entries = [
      { label: 'Tableau de bord', route: '/dashboard', kind: 'pages', keywords: ['accueil', 'overview', 'dashboard'] },
      { label: 'Agenda chorale', route: '/dashboard/calendar', kind: 'pages', keywords: ['agenda', 'calendrier', 'event', 'repetition'] },
      { label: 'Annonces', route: '/dashboard/announcements', kind: 'pages', keywords: ['annonce', 'news', 'actualite', 'notification'] },
      { label: 'Profil', route: '/dashboard/profile', kind: 'pages', keywords: ['profil', 'compte', 'utilisateur'] },
      { label: 'Partitions', route: '/dashboard/scores', kind: 'pages', keywords: ['partition', 'score', 'musique', 'bibliotheque'] },
    ];

    (dashboardData.recentPartitions || []).forEach((partition) => {
      entries.push({
        label: partition.title,
        route: '/dashboard/scores',
        kind: 'partitions',
        keywords: [partition.title, partition.composer, partition.category].filter(Boolean),
      });
    });

    (dashboardData.announcements || []).forEach((announcement) => {
      entries.push({
        label: announcement.title,
        route: '/dashboard/announcements',
        kind: 'annonces',
        keywords: [announcement.title, announcement.content, announcement.type].filter(Boolean),
      });
    });

    if (dashboardData.nextEvent) {
      entries.push({
        label: dashboardData.nextEvent.title || 'Prochain événement',
        route: '/dashboard/calendar',
        kind: 'events',
        keywords: [
          dashboardData.nextEvent.title,
          dashboardData.nextEvent.location,
          dashboardData.nextEvent.description,
        ].filter(Boolean),
      });
    }

    return entries;
  }, [dashboardData]);

  const filteredSearchEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const scoped = searchScope === 'all' ? searchableEntries : searchableEntries.filter((entry) => entry.kind === searchScope);

    if (!query) return scoped.slice(0, 8);

    return scoped
      .filter((entry) => {
        const inLabel = entry.label?.toLowerCase().includes(query);
        const inKeywords = (entry.keywords || []).some((k) => String(k).toLowerCase().includes(query));
        return inLabel || inKeywords;
      })
      .slice(0, 10);
  }, [searchableEntries, searchQuery, searchScope]);

  const groupedResults = useMemo(() => {
    return filteredSearchEntries.reduce((acc, item) => {
      const key = item.kind || 'pages';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [filteredSearchEntries]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      toast('Entrez un mot-clé pour lancer la recherche.');
      return;
    }

    const match = filteredSearchEntries[0];

    if (!match) {
      toast.error(`Aucun résultat pour "${searchQuery}".`);
      return;
    }

    navigate(match.route);
    setIsSearchOpen(false);
    toast.success(`Ouverture : ${match.label}`);
  };

  const handleResultClick = (item) => {
    navigate(item.route);
    setSearchQuery(item.label);
    setIsSearchOpen(false);
  };

  const markAllAnnouncementsAsRead = useCallback(() => {
    const allIds = (dashboardData?.announcements || []).map((ann) => ann.id);
    setReadAnnouncementIds(allIds);
    toast.success('Toutes les notifications sont marquées comme lues.');
  }, [dashboardData?.announcements]);

  const toggleAnnouncementRead = useCallback((id) => {
    setReadAnnouncementIds((prev) => (
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    ));
  }, []);

  const groupLabel = {
    partitions: 'Partitions',
    events: 'Événements',
    annonces: 'Annonces',
    pages: 'Pages',
  };

  return (
    <div className="dashboard-root">
      <SEO title="Espace Choriste" description="Accédez à votre espace privé Chorale Sainte Marie Auxiliatrice." />
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="dashboard-main">
        {/* Top Navbar */}
        <header className="dashboard-navbar glass-panel">
          <div className="nav-left">
            <button className="menu-toggle-btn" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <form
              className="search-bar-mini"
              onSubmit={handleSearchSubmit}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setIsSearchOpen(false);
                }
              }}
            >
              <Search size={18} />
              <input
                type="text"
                placeholder="Rechercher une partition, un événement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
              />
              <button type="submit" className="search-submit-btn" aria-label="Lancer la recherche">
                Aller
              </button>
              {isSearchOpen && (
                <div className="search-results-popover">
                  <div className="search-filter-row">
                    {[
                      { id: 'all', label: 'Tout' },
                      { id: 'partitions', label: 'Partitions' },
                      { id: 'events', label: 'Événements' },
                      { id: 'annonces', label: 'Annonces' },
                      { id: 'pages', label: 'Pages' },
                    ].map((scope) => (
                      <button
                        key={scope.id}
                        type="button"
                        className={`search-scope-chip ${searchScope === scope.id ? 'active' : ''}`}
                        onClick={() => setSearchScope(scope.id)}
                      >
                        {scope.label}
                      </button>
                    ))}
                  </div>

                  {Object.keys(groupedResults).length === 0 ? (
                    <div className="search-empty">Aucun résultat.</div>
                  ) : (
                    <div className="search-results-list">
                      {Object.entries(groupedResults).map(([group, items]) => (
                        <div key={group}>
                          <div className="search-group-title">{groupLabel[group] || group}</div>
                          {items.map((item) => (
                            <button
                              key={`${group}-${item.label}`}
                              type="button"
                              className="search-result-item"
                              onClick={() => handleResultClick(item)}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          <div className="nav-right">
            <button className="nav-action-btn" title="Notifications" onClick={() => navigate('/dashboard/announcements')}>
              <Bell size={20} />
              {unreadCount > 0 && (
                <>
                  <span className="notification-dot" />
                  <span className="notification-count">{unreadCount > 9 ? '9+' : unreadCount}</span>
                </>
              )}
            </button>
            <div className="nav-user-profile" onClick={() => navigate('/dashboard/profile')}>
              <div className="user-avatar-mini">
                 <CircleUser size={20} />
              </div>
              <div className="user-details-mini">
                <span className="user-name-mini">{user?.full_name?.split(' ')[0]}</span>
                <span className="user-pupitre-mini">{user?.voice_type}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <section className="dashboard-viewport">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Overview data={dashboardData} loading={isLoading} error={loadError} onRetry={fetchDashboardData} />} />
              <Route
                path="/scores"
                element={
                  <SubViewLayout title="Ma Bibliothèque" subtitle="Accédez à toutes vos partitions et ressources audio.">
                    <DashboardScores
                      favorites={favoriteScoreIds}
                      onFavoritesChange={setFavoriteScoreIds}
                      lastOpenedScore={lastOpenedScore}
                      onLastOpenedChange={setLastOpenedScore}
                    />
                  </SubViewLayout>
                }
              />
              <Route path="/calendar" element={<SubViewLayout title="Agenda" subtitle="Ne manquez aucune répétition ou célébration."><DashboardCalendar /></SubViewLayout>} />
              <Route
                path="/announcements"
                element={
                  <SubViewLayout title="Tableau d'affichage" subtitle="Les dernières communications de la direction chorale.">
                    <DashboardAnnouncements
                      readIds={readAnnouncementIds}
                      onToggleRead={toggleAnnouncementRead}
                      onMarkAllRead={markAllAnnouncementsAsRead}
                    />
                  </SubViewLayout>
                }
              />
              <Route path="/profile" element={
                <SubViewLayout title="Mon Profil" subtitle="Gérez vos informations personnelles et préférences.">
                  <ProfileView />
                </SubViewLayout>
              } />
              
              {/* ADMIN ROUTES */}
              {canAccessAdmin && (
                <>
                    <Route path="/admin/members" element={<SubViewLayout title="Gestion des Membres" subtitle="Gérez les accès et les rôles de la chorale."><AdminMembers /></SubViewLayout>} />
                    <Route path="/admin/scores" element={<SubViewLayout title="Gestion de la Bibliothèque" subtitle="Ajoutez ou supprimez des partitions pour les choristes."><AdminPartitions /></SubViewLayout>} />
                    <Route path="/admin/events" element={<SubViewLayout title="Gestion de l'Agenda" subtitle="Planifiez les prochaines répétitions et concerts."><AdminEvents /></SubViewLayout>} />
                    <Route path="/admin/announcements" element={<SubViewLayout title="Flash Infos" subtitle="Publiez des communications instantanées pour toute la chorale."><AdminAnnouncements /></SubViewLayout>} />
                </>
              )}
            </Routes>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
