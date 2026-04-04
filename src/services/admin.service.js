const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fonctions d'administration pour la Chorale SMA
 */

// PARTITIONS
export const addPartition = async (partitionData) => {
    return callAdminAPI('/admin/partitions', 'POST', partitionData);
};

export const deletePartition = async (id) => {
    return callAdminAPI(`/admin/partitions/${id}`, 'DELETE');
};

// ÉVÉNEMENTS
export const addEvent = async (eventData) => {
    return callAdminAPI('/admin/events', 'POST', eventData);
};

export const deleteEvent = async (id) => {
    return callAdminAPI(`/admin/events/${id}`, 'DELETE');
};

// ANNONCES
export const addAnnouncement = async (annData) => {
    return callAdminAPI('/admin/announcements', 'POST', annData);
};

export const deleteAnnouncement = async (id) => {
    return callAdminAPI(`/admin/announcements/${id}`, 'DELETE');
};

// MEMBRES
export const getAllMembers = async () => {
    return callAdminAPI('/admin/members', 'GET');
};

export const updateMemberRole = async (id, role) => {
    return callAdminAPI(`/admin/members/${id}/role`, 'PUT', { role });
};

/**
 * Fonction utilitaire pour les appels API Admin protégés
 */
async function callAdminAPI(endpoint, method = 'GET', body = null) {
    try {
        const token = localStorage.getItem('sma_token');
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        if (body) options.body = JSON.stringify(body);

        const response = await fetch(`${API_URL}${endpoint}`, options);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur d\'administration');
        }

        return await response.json();
    } catch (error) {
        console.error(`Admin Service Error (${endpoint}):`, error);
        throw error;
    }
}
