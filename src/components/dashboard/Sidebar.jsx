import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Music, 
  Bell, 
  User, 
  CircleUser,
  LogOut, 
  Calendar,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardSidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { id: 'overview', icon: <Home size={20} transition={{ duration: 0.2 }} />, label: 'Tableau de bord', path: '/dashboard' },
    { id: 'partitions', icon: <Music size={20} />, label: 'Mes Partitions', path: '/dashboard/scores' },
    { id: 'calendar', icon: <Calendar size={20} />, label: 'Agenda Chorale', path: '/dashboard/calendar' },
    { id: 'announcements', icon: <Bell size={20} />, label: 'Actualités', path: '/dashboard/announcements' },
    { id: 'profile', icon: <User size={20} />, label: 'Mon Profil', path: '/dashboard/profile' },
  ];

  const adminItems = [
    { id: 'admin_members', icon: <User size={20} />, label: 'Membres', path: '/dashboard/admin/members' },
    { id: 'admin_scores', icon: <Music size={20} />, label: 'Gérer les Partitions', path: '/dashboard/admin/scores' },
    { id: 'admin_events', icon: <Calendar size={20} />, label: 'Gérer l\'Agenda', path: '/dashboard/admin/events' },
    { id: 'admin_announcements', icon: <Bell size={20} />, label: 'Flash Infos', path: '/dashboard/admin/announcements' },
  ];

  const canAccessAdmin = user?.role === 'Admin' || user?.role === 'Choir_Master';

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      
      <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-wrapper">
              <img src="/src/assets/images/icon.png" alt="Logo SMA" className="sidebar-logo-img" />
            </div>
            <div className="logo-label">
                <span className="sma-text">SMA</span>
                <span className="espace-text">Espace Choriste</span>
            </div>
          </div>
          <button className="close-sidebar-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink 
              key={item.id}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}

          {canAccessAdmin && (
            <div className="admin-nav-section">
                <div className="nav-divider"><span>ADMINISTRATION</span></div>
                {adminItems.map((item) => (
                    <NavLink 
                      key={item.id}
                      to={item.path}
                      className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                      onClick={onClose}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-mini-card">
            <div className="user-avatar">
               <CircleUser size={24} />
            </div>
            <div className="user-info">
              <span className="user-name">{user?.full_name || 'Utilisateur'}</span>
              <span className="user-role">{user?.voice_type || 'Membre'}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
