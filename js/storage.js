/**
 * Gestion du stockage local des données
 * Ce module gère la persistance des données via localStorage
 */

// Clés de stockage
const STORAGE_KEYS = {
    CATEGORIES: 'productivity_app_categories',
    SESSIONS_PREFIX: 'productivity_app_sessions_',
    STATS_PREFIX: 'productivity_app_stats_'
};

/**
 * Vérifie si le stockage local est disponible
 * @returns {boolean} Vrai si le stockage est disponible
 */
function isStorageAvailable() {
    try {
        const testKey = 'storage_test';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        console.error('Erreur de stockage local:', error);
        return false;
    }
}

/**
 * Formate une date en chaîne YYYY-MM-DD pour les clés de stockage
 * @param {Date|string} date - Date à formater ou chaîne au format ISO
 * @returns {string} Date formatée YYYY-MM-DD
 */
function formatDateKey(date) {
    if (typeof date === 'string') {
        // Si c'est déjà une chaîne, essayons de la convertir
        try {
            return new Date(date).toISOString().split('T')[0];
        } catch (e) {
            return date; // Retourner la chaîne telle quelle si la conversion échoue
        }
    }
    return date.toISOString().split('T')[0];
}

/**
 * Récupère les catégories stockées
 * @returns {Array} Tableau des catégories
 */
function getCategories() {
    if (!isStorageAvailable()) {
        showErrorMessage('Le stockage local n\'est pas disponible');
        return [];
    }
    
    const categoriesJSON = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return categoriesJSON ? JSON.parse(categoriesJSON) : [];
}

/**
 * Sauvegarde les catégories
 * @param {Array} categories - Tableau des catégories à sauvegarder
 */
function saveCategories(categories) {
    if (!isStorageAvailable()) {
        showErrorMessage('Impossible de sauvegarder les catégories. Stockage non disponible.');
        return;
    }
    
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
}

/**
 * Récupère une catégorie par son ID
 * @param {string} id - ID de la catégorie
 * @returns {Object|null} La catégorie trouvée ou null
 */
function getCategoryById(id) {
    const categories = getCategories();
    return categories.find(category => category.id === id) || null;
}

/**
 * Crée la clé de stockage pour les sessions d'une date donnée
 * @param {Date|string} date - Date des sessions
 * @returns {string} Clé de stockage
 */
function getSessionsKey(date) {
    return STORAGE_KEYS.SESSIONS_PREFIX + formatDateKey(date);
}

/**
 * Récupère les sessions pour une date donnée
 * @param {Date|string} date - Date des sessions à récupérer
 * @returns {Array} Tableau des sessions
 */
function getSessions(date) {
    if (!isStorageAvailable()) {
        showErrorMessage('Le stockage local n\'est pas disponible');
        return [];
    }
    
    const key = getSessionsKey(date);
    const sessionsJSON = localStorage.getItem(key);
    return sessionsJSON ? JSON.parse(sessionsJSON) : [];
}

/**
 * Sauvegarde une session
 * @param {Object} session - Session à sauvegarder
 */
function saveSession(session) {
    if (!isStorageAvailable()) {
        showErrorMessage('Impossible de sauvegarder la session. Stockage non disponible.');
        return;
    }
    
    const date = new Date(session.startTime).toISOString().split('T')[0];
    const key = getSessionsKey(date);
    const sessions = getSessions(date);
    
    // Vérifier si la session existe déjà (mise à jour)
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    if (existingIndex >= 0) {
        sessions[existingIndex] = session;
    } else {
        sessions.push(session);
    }
    
    localStorage.setItem(key, JSON.stringify(sessions));
    
    // Mettre à jour les statistiques
    updateStats(date);
}

/**
 * Crée la clé de stockage pour les statistiques d'une date donnée
 * @param {Date|string} date - Date des statistiques
 * @returns {string} Clé de stockage
 */
function getStatsKey(date) {
    return STORAGE_KEYS.STATS_PREFIX + formatDateKey(date);
}

/**
 * Récupère les statistiques pour une date donnée
 * @param {Date|string} date - Date des statistiques à récupérer
 * @returns {Object|null} Statistiques ou null si inexistantes
 */
function getStats(date) {
    if (!isStorageAvailable()) {
        showErrorMessage('Le stockage local n\'est pas disponible');
        return null;
    }
    
    const key = getStatsKey(date);
    const statsJSON = localStorage.getItem(key);
    return statsJSON ? JSON.parse(statsJSON) : null;
}

/**
 * Met à jour les statistiques pour une date donnée
 * @param {Date|string} date - Date des statistiques à mettre à jour
 * @returns {Object} Statistiques mises à jour
 */
function updateStats(date) {
    if (!isStorageAvailable()) {
        showErrorMessage('Impossible de mettre à jour les statistiques. Stockage non disponible.');
        return null;
    }
    
    const stats = calculateDailyStats(date);
    const key = getStatsKey(date);
    localStorage.setItem(key, JSON.stringify(stats));
    return stats;
}

/**
 * Affiche un message d'erreur à l'utilisateur
 * @param {string} message - Message d'erreur à afficher
 * @param {number} duration - Durée d'affichage en ms (par défaut 5000ms)
 */
function showErrorMessage(message, duration = 5000) {
    let errorContainer = document.getElementById('error-container');
    
    if (!errorContainer) {
        // Créer le conteneur s'il n'existe pas
        errorContainer = document.createElement('div');
        errorContainer.id = 'error-container';
        document.body.appendChild(errorContainer);
    }
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    errorContainer.appendChild(errorElement);
    
    // Disparition automatique après la durée spécifiée
    setTimeout(() => {
        errorElement.classList.add('fade-out');
        setTimeout(() => {
            if (errorElement.parentNode === errorContainer) {
                errorContainer.removeChild(errorElement);
            }
        }, 500);
    }, duration);
}