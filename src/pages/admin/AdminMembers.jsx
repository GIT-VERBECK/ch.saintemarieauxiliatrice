import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { User, Shield, Mail, Phone, Search } from 'lucide-react';
import { getAllMembers, updateMemberRole } from '../../services/admin.service';

const AdminMembers = () => {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const data = await getAllMembers();
            setMembers(data);
        } catch (error) {
            console.error("Failed to fetch members", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMembers = members.filter(m => 
        m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRoleChange = async (memberId, newRole) => {
        if (!window.confirm(`Changer le rôle en ${newRole} ?`)) return;
        try {
            await updateMemberRole(memberId, newRole);
            fetchMembers();
        } catch {
            toast.error("Erreur lors du changement de rôle");
        }
    };

    if (loading) return <div className="loading-simple">Chargement des membres...</div>;

    const roleStats = members.reduce((acc, curr) => {
        acc[curr.role] = (acc[curr.role] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="admin-members-view">
            <div className="admin-stats-row">
                <div className="admin-stat-card glass-panel">
                    <span className="stat-label">Total Membres</span>
                    <span className="stat-value">{members.length}</span>
                </div>
                <div className="admin-stat-card glass-panel">
                    <span className="stat-label">Chef de Chœurs</span>
                    <span className="stat-value">{roleStats['Choir_Master'] || 0}</span>
                </div>
                <div className="admin-stat-card glass-panel">
                    <span className="stat-label">Administrateurs</span>
                    <span className="stat-value">{roleStats['Admin'] || 0}</span>
                </div>
            </div>

            <div className="admin-actions-bar">
                <div className="search-box glass-panel">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Rechercher un membre par nom ou email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="members-table-container glass-panel">
                <table className="members-table">
                    <thead>
                        <tr>
                            <th>Membre</th>
                            <th>Contact</th>
                            <th>Pupitre</th>
                            <th>Rôle</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.map(member => (
                            <tr key={member.id}>
                                <td>
                                    <div className="member-cell">
                                        <div className="member-avatar-small">{member.full_name.charAt(0)}</div>
                                        <div className="member-name-stack">
                                            <strong>{member.full_name}</strong>
                                            <span className="member-id">ID: {member.id.substring(0, 8)}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="contact-stack">
                                        <span className="contact-item"><Mail size={12} /> {member.email || 'N/A'}</span>
                                        <span className="contact-item"><Phone size={12} /> {member.phone || 'N/A'}</span>
                                    </div>
                                </td>
                                <td><span className="pupitre-badge">{member.voice_type}</span></td>
                                <td>
                                    <span className={`role-tag role-${member.role.toLowerCase()}`}>
                                        {member.role === 'Admin' ? <Shield size={12} /> : <User size={12} />}
                                        {member.role}
                                    </span>
                                </td>
                                <td>
                                    <div className="admin-actions">
                                        <select 
                                            value={member.role} 
                                            onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                            className="role-select"
                                        >
                                            <option value="Member">Membre</option>
                                            <option value="Choir_Master">Chef de Chœur</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminMembers;
