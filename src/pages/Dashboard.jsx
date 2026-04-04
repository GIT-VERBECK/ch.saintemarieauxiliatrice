import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Bell, LogOut, Calendar, Music } from 'lucide-react';
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
  <motion.div 
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
  </motion.div>
);

const Overview = ({ data, loading }) => {
    const { user } = useAuth();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });
    
    // Formatter la date de la prochaine répétition
    const formatDate = (dateStr) => {
        if (!dateStr) return "À définir";
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateStr));
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
            <div className="dashboard-grid">
                {/* Prochaine Répétition Widget */}
                <div className="dashboard-card widget-event glass-panel">
                    <div className="card-header">
                        <div className="header-with-icon">
                            <Calendar size={18} />
                            <span className="badge-live">Prochaine Répétition</span>
                        </div>
                    </div>
                    <div className="card-body">
                        <h2>{data?.nextEvent?.title || "Mardi 15 Avril"}</h2>
                        <p>{data?.nextEvent ? `${formatDate(data.nextEvent.event_date)} • ${data.nextEvent.location}` : "18h30 • Paroisse Sainte Marie Auxiliatrice"}</p>
                        <div className="countdown">
                            <div className="time-item"><span>{String(timeLeft.days).padStart(2, '0')}</span><small>Jours</small></div>
                            <div className="time-item"><span>{String(timeLeft.hours).padStart(2, '0')}</span><small>Heures</small></div>
                            <div className="time-item"><span>{String(timeLeft.mins).padStart(2, '0')}</span><small>Min</small></div>
                        </div>
                    </div>
                </div>

                {/* Dernières Partitions Widget */}
                <div className="dashboard-card widget-partitions glass-panel">
                    <div className="card-header-flex">
                        <div className="title-with-icon">
                            <Music size={20} className="text-secondary" />
                            <h3>Partitions récentes</h3>
                        </div>
                        <button className="btn-link">Tout voir</button>
                    </div>
                    <div className="mini-list">
                        {data?.recentPartitions?.length > 0 ? (
                            data.recentPartitions.map(p => (
                                <div key={p.id} className="list-item">
                                    <div className="item-icon-wrapper"><Music size={16} /></div>
                                    <div className="item-info">
                                        <strong>{p.title}</strong>
                                        <small>{p.composer} • {p.category}</small>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="list-item">
                                    <div className="item-icon-wrapper"><Music size={16} /></div>
                                    <div className="item-info">
                                        <strong>Laudemus Virginem</strong>
                                        <small>Josquin des Prés • Liturgie</small>
                                    </div>
                                </div>
                                <div className="list-item">
                                    <div className="item-icon-wrapper"><Music size={16} /></div>
                                    <div className="item-info">
                                        <strong>Missa Brevis</strong>
                                        <small>W.A. Mozart • Classique</small>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Annonce Widget */}
                <div className="dashboard-card widget-news glass-panel">
                    <div className="card-header-flex">
                        <div className="title-with-icon">
                            <Bell size={18} className="text-secondary" />
                            <h3>Flash Infos</h3>
                        </div>
                        <span className="news-date">{data?.announcements?.[0] ? 'Nouveau' : 'Hier'}</span>
                    </div>
                    <div className="news-content-mini">
                        <p className="news-excerpt">
                            {data?.announcements?.[0]?.content || "\"N'oubliez pas d'apporter vos chemises blanches pour l'enregistrement de samedi matin...\""}
                        </p>
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
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
        setIsLoading(true);
        const data = await getDashboardOverview();
        setDashboardData(data);
        // Mettre à jour le user en local au cas où des infos ont changé côté serveur
        if (data.profile) {
            updateUser(data.profile);
        }
    } catch (error) {
        console.error("Failed to load dashboard data", error);
    } finally {
        setIsLoading(false);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
            <div className="search-bar-mini">
              <Search size={18} />
              <input type="text" placeholder="Rechercher une partition, un événement..." />
            </div>
          </div>

          <div className="nav-right">
            <button className="nav-action-btn" title="Notifications">
              <Bell size={20} />
              <span className="notification-dot" />
            </button>
            <div className="nav-user-profile" onClick={() => navigate('/dashboard/profile')}>
              <div className="user-avatar-mini">
                 {user?.full_name?.charAt(0) || 'U'}
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
