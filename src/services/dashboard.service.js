const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Récupère les données globales du dashboard
 */
export const getDashboardOverview = async () => {
    try {
        const token = localStorage.getItem('sma_token');
        const response = await fetch(`${API_URL}/dashboard/overview`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors du chargement des données');
        }

        return await response.json();
    } catch (error) {
        console.error("Dashboard Service Error:", error);
        throw error;
    }
};

/**
 * Récupère toutes les partitions (scores)
 */
export const getPartitions = async () => {
    try {
        const token = localStorage.getItem('sma_token');
        const response = await fetch(`${API_URL}/dashboard/partitions`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors du chargement des partitions');
        }

        return await response.json();
    } catch (error) {
        console.error("Partitions Service Error:", error);
        throw error;
    }
};

/**
 * Récupère toutes les annonces
 */
export const getAnnouncements = async () => {
    try {
        const token = localStorage.getItem('sma_token');
        const response = await fetch(`${API_URL}/dashboard/announcements`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors du chargement des annonces');
        }

        return await response.json();
    } catch (error) {
        console.error("Announcements Service Error:", error);
        throw error;
    }
};

/**
 * Récupère tous les événements futurs
 */
export const getEvents = async () => {
    try {
        const token = localStorage.getItem('sma_token');
        const response = await fetch(`${API_URL}/dashboard/events`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors du chargement de l\'agenda');
        }

        return await response.json();
    } catch (error) {
        console.error("Events Service Error:", error);
        throw error;
    }
};

/**
 * Récupère les préférences dashboard de l'utilisateur
 */
export const getDashboardPreferences = async () => {
    try {
        const token = localStorage.getItem('sma_token');
        const response = await fetch(`${API_URL}/dashboard/preferences`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors du chargement des préférences dashboard');
        }

        return await response.json();
    } catch (error) {
        console.error("Dashboard Preferences Service Error:", error);
        throw error;
    }
};

/**
 * Met à jour les préférences dashboard de l'utilisateur
 */
export const updateDashboardPreferences = async (payload) => {
    try {
        const token = localStorage.getItem('sma_token');
        const response = await fetch(`${API_URL}/dashboard/preferences`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors de la mise à jour des préférences dashboard');
        }

        return await response.json();
    } catch (error) {
        console.error("Dashboard Preferences Update Error:", error);
        throw error;
    }
};
