import React, { useState, useEffect, useMemo } from 'react';
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
import { getDashboardOverview } from '../services/dashboard.service';
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

const Overview = ({ data, loading }) => {
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
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const canAccessAdmin = user?.role === 'Admin' || user?.role === 'Choir_Master';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
          setIsLoading(true);
          const data = await getDashboardOverview();
          setDashboardData(data);
      } catch (error) {
          console.error("Failed to load dashboard data", error);
      } finally {
          setIsLoading(false);
      }
    };

    window.scrollTo(0, 0);
    fetchDashboardData();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const searchableEntries = useMemo(() => {
    if (!dashboardData) return [];

    const entries = [
      { label: 'tableau de bord', route: '/dashboard', keywords: ['accueil', 'overview', 'dashboard'] },
      { label: 'agenda chorale', route: '/dashboard/calendar', keywords: ['agenda', 'calendrier', 'event', 'repetition'] },
      { label: 'annonces', route: '/dashboard/announcements', keywords: ['annonce', 'news', 'actualite', 'notification'] },
      { label: 'profil', route: '/dashboard/profile', keywords: ['profil', 'compte', 'utilisateur'] },
      { label: 'partitions', route: '/dashboard/scores', keywords: ['partition', 'score', 'musique', 'bibliotheque'] },
    ];

    (dashboardData.recentPartitions || []).forEach((partition) => {
      entries.push({
        label: partition.title,
        route: '/dashboard/scores',
        keywords: [partition.title, partition.composer, partition.category].filter(Boolean),
      });
    });

    (dashboardData.announcements || []).forEach((announcement) => {
      entries.push({
        label: announcement.title,
        route: '/dashboard/announcements',
        keywords: [announcement.title, announcement.content, announcement.type].filter(Boolean),
      });
    });

    if (dashboardData.nextEvent) {
      entries.push({
        label: dashboardData.nextEvent.title || 'Prochain événement',
        route: '/dashboard/calendar',
        keywords: [
          dashboardData.nextEvent.title,
          dashboardData.nextEvent.location,
          dashboardData.nextEvent.description,
        ].filter(Boolean),
      });
    }

    return entries;
  }, [dashboardData]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      toast('Entrez un mot-clé pour lancer la recherche.');
      return;
    }

    const match = searchableEntries.find((entry) => {
      const inLabel = entry.label?.toLowerCase().includes(query);
      const inKeywords = (entry.keywords || []).some((k) => String(k).toLowerCase().includes(query));
      return inLabel || inKeywords;
    });

    if (!match) {
      toast.error(`Aucun résultat pour "${searchQuery}".`);
      return;
    }

    navigate(match.route);
    toast.success(`Ouverture : ${match.label}`);
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
            <form className="search-bar-mini" onSubmit={handleSearchSubmit}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Rechercher une partition, un événement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-submit-btn" aria-label="Lancer la recherche">
                Aller
              </button>
            </form>
          </div>

          <div className="nav-right">
            <button className="nav-action-btn" title="Notifications" onClick={() => navigate('/dashboard/announcements')}>
              <Bell size={20} />
              <span className="notification-dot" />
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
              <Route path="/" element={<Overview data={dashboardData} loading={isLoading} />} />
              <Route path="/scores" element={<SubViewLayout title="Ma Bibliothèque" subtitle="Accédez à toutes vos partitions et ressources audio."><DashboardScores /></SubViewLayout>} />
              <Route path="/calendar" element={<SubViewLayout title="Agenda" subtitle="Ne manquez aucune répétition ou célébration."><DashboardCalendar /></SubViewLayout>} />
              <Route path="/announcements" element={<SubViewLayout title="Tableau d'affichage" subtitle="Les dernières communications de la direction chorale."><DashboardAnnouncements /></SubViewLayout>} />
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
