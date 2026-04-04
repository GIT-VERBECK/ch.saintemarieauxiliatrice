import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Bell, LogOut, Calendar, Music } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardScores from '../components/dashboard/DashboardScores';
import DashboardAnnouncements from '../components/dashboard/DashboardAnnouncements';
import SEO from '../components/ui/SEO';
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

const Overview = () => {
    const { user } = useAuth();
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
                        <h2>Mardi 08 Avril</h2>
                        <p>18h30 • Paroisse Sainte Marie Auxiliatrice</p>
                        <div className="countdown">
                            <div className="time-item"><span>02</span><small>Jours</small></div>
                            <div className="time-item"><span>14</span><small>Heures</small></div>
                            <div className="time-item"><span>45</span><small>Min</small></div>
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
                        <div className="list-item">
                            <div className="item-icon-wrapper">
                                <Music size={16} />
                            </div>
                            <div className="item-info">
                                <strong>Laudemus Virginem</strong>
                                <small>Josquin des Prés • Liturgie</small>
                            </div>
                        </div>
                        <div className="list-item">
                            <div className="item-icon-wrapper">
                                <Music size={16} />
                            </div>
                            <div className="item-info">
                                <strong>Missa Brevis</strong>
                                <small>W.A. Mozart • Classique</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Annonce Widget */}
                <div className="dashboard-card widget-news glass-panel">
                    <div className="card-header-flex">
                        <div className="title-with-icon">
                            <Bell size={18} className="text-secondary" />
                            <h3>Flash Infos</h3>
                        </div>
                        <span className="news-date">Hier</span>
                    </div>
                    <div className="news-content-mini">
                        <p className="news-excerpt">"N'oubliez pas d'apporter vos chemises blanches pour l'enregistrement de samedi matin..."</p>
                    </div>
                </div>
            </div>
        </SubViewLayout>
    );
};

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              <Route path="/" element={<Overview />} />
              <Route path="/scores" element={<SubViewLayout title="Ma Bibliothèque" subtitle="Accédez à toutes vos partitions et ressources audio."><DashboardScores /></SubViewLayout>} />
              <Route path="/calendar" element={<SubViewLayout title="Agenda" subtitle="Ne manquez aucune répétition ou célébration.">Agenda interactif en cours d'intégration...</SubViewLayout>} />
              <Route path="/announcements" element={<SubViewLayout title="Tableau d'affichage" subtitle="Les dernières communications de la direction chorale."><DashboardAnnouncements /></SubViewLayout>} />
              <Route path="/profile" element={
                <SubViewLayout title="Mon Profil" subtitle="Gérez vos informations personnelles et préférences.">
                  <div className="profile-section glass-panel">
                    <div className="profile-header">
                        <div className="profile-avatar-large">
                            {user?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="profile-info">
                            <h2>{user?.full_name}</h2>
                            <p>{user?.email}</p>
                            <span className="pupitre-badge">{user?.voice_type}</span>
                        </div>
                    </div>
                    <div className="profile-details-grid">
                      <div className="detail-item">
                        <label>Téléphone</label>
                        <p>{user?.phone || '+243 ...'}</p>
                      </div>
                      <div className="detail-item">
                        <label>Date d'inscription</label>
                        <p>Avril 2024</p>
                      </div>
                    </div>
                    <div className="profile-actions-footer">
                        <button className="btn btn-ghost danger" onClick={logout}>
                            <LogOut size={18} /> Me déconnecter
                        </button>
                        <button className="btn btn-primary btn-sm">Modifier mes infos</button>
                    </div>
                  </div>
                </SubViewLayout>
              } />
            </Routes>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
