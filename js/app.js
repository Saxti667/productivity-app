/**
 * Module principal de l'application
 * Initialisation et gestion des routes
 */

// Page actuelle
let currentPage = '';

/**
 * Initialise l'application
 */
function initApp() {
    // Déterminer la page actuelle
    const pathname = window.location.pathname;
    currentPage = pathname.includes('visualization.html') ? 'visualization' : 'timer';
    
    // Vérifier si le stockage local est disponible
    if (!isStorageAvailable()) {
        showErrorMessage('Le stockage local n\'est pas disponible. L\'application pourrait ne pas fonctionner correctement.');
    }
    
    // Initialiser les modules selon la page
    if (currentPage === 'timer') {
        initTimerPage();
    } else {
        initVisualizationPage();
    }
}

/**
 * Initialise la page du timer
 */
function initTimerPage() {
    console.log('Initialisation de la page Timer');
    
    // Initialiser les modules nécessaires
    if (typeof initCategories === 'function') {
        initCategories();
    } else {
        console.error('Module de catégories non disponible');
    }
    
    if (typeof initTimer === 'function') {
        initTimer();
    } else {
        console.error('Module de timer non disponible');
    }
}

/**
 * Initialise la page de visualisation
 */
function initVisualizationPage() {
    console.log('Initialisation de la page Visualisation');
    
    // Initialiser les modules nécessaires
    if (typeof initChart === 'function') {
        initChart();
    } else {
        console.error('Module de graphique non disponible');
    }
    
    if (typeof initStats === 'function') {
        initStats();
        
        // Charger les statistiques du jour
        const today = formatDateKey(new Date());
        let stats = getStats(today);
        
        if (!stats) {
            // Calculer les statistiques si elles n'existent pas
            stats = calculateDailyStats(today);
        }
        
        // Afficher les statistiques
        renderStats(stats);
    } else {
        console.error('Module de statistiques non disponible');
    }
}

// Initialiser l'application au chargement de la page
document.addEventListener('DOMContentLoaded', initApp);