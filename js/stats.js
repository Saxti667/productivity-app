/**
 * Gestion des statistiques
 * Ce module gère le calcul et l'affichage des statistiques
 */

// Éléments DOM
let statsContainer;

/**
 * Initialise le module de statistiques
 */
function initStats() {
    // Récupération des éléments DOM
    statsContainer = document.getElementById('stats-container');
    
    if (!statsContainer) {
        console.error('Élément DOM manquant pour les statistiques');
        return;
    }
}

/**
 * Calcule les statistiques quotidiennes à partir des sessions
 * @param {Date|string} date - Date des statistiques à calculer
 * @returns {Object} Objet contenant les statistiques
 */
function calculateDailyStats(date) {
    const sessions = getSessions(date);
    const categories = getCategories();
    
    // Calculer le temps total de toutes les sessions
    const totalTime = sessions.reduce((sum, session) => sum + session.duration, 0);
    const effectiveTime = sessions.reduce((sum, session) => sum + session.effectiveTime, 0);
    const distractionTime = totalTime - effectiveTime;
    
    // Statistiques par catégorie
    const categoryStats = categories.map(category => {
        // Filtrer les sessions pour cette catégorie
        const categorySessions = sessions.filter(session => session.categoryId === category.id);
        
        // Calculer les temps pour cette catégorie
        const catTotalTime = categorySessions.reduce((sum, session) => sum + session.duration, 0);
        const catEffectiveTime = categorySessions.reduce((sum, session) => sum + session.effectiveTime, 0);
        const catDistractionTime = catTotalTime - catEffectiveTime;
        
        // Calculer le pourcentage par rapport au temps total
        const percentage = totalTime > 0 ? (catTotalTime / totalTime) * 100 : 0;
        
        return {
            categoryId: category.id,
            name: category.name,
            color: category.color,
            totalTime: catTotalTime,
            effectiveTime: catEffectiveTime,
            distractionTime: catDistractionTime,
            percentage: Math.round(percentage * 10) / 10 // Arrondi à 1 décimale
        };
    }).filter(stat => stat.totalTime > 0); // Ne garder que les catégories avec du temps
    
    // Trier par temps total décroissant
    categoryStats.sort((a, b) => b.totalTime - a.totalTime);
    
    return {
        date: formatDateKey(date),
        totalTime,
        effectiveTime,
        distractionTime,
        categoryStats
    };
}

/**
 * Affiche les statistiques dans le conteneur
 * @param {Object} stats - Statistiques à afficher
 */
function renderStats(stats) {
    if (!statsContainer) return;
    
    // Vider le conteneur
    statsContainer.innerHTML = '';
    
    // Si pas de statistiques
    if (!stats || !stats.totalTime) {
        statsContainer.innerHTML = '<p class="no-data">Aucune donnée disponible pour cette journée</p>';
        return;
    }
    
    // Afficher le temps total
    const totalHours = Math.floor(stats.totalTime / 3600);
    const totalMinutes = Math.floor((stats.totalTime % 3600) / 60);
    
    const header = document.createElement('div');
    header.className = 'total-time';
    header.textContent = `Temps total: ${totalHours}h ${totalMinutes}m`;
    statsContainer.appendChild(header);
    
    // Afficher les en-têtes
    const statHeader = document.createElement('div');
    statHeader.className = 'stats-header';
    statHeader.innerHTML = `
        <span>Catégorie</span>
        <span>Temps</span>
        <span>Distractions</span>
    `;
    statsContainer.appendChild(statHeader);
    
    // Afficher chaque catégorie
    stats.categoryStats.forEach(stat => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-stat';
        
        // Indicateur de couleur
        const colorIndicator = document.createElement('div');
        colorIndicator.className = 'color-indicator';
        colorIndicator.style.backgroundColor = stat.color;
        
        // Nom de la catégorie
        const nameSpan = document.createElement('span');
        nameSpan.textContent = stat.name;
        
        // Temps et pourcentage
        const hours = Math.floor(stat.totalTime / 3600);
        const minutes = Math.floor((stat.totalTime % 3600) / 60);
        const timeSpan = document.createElement('span');
        timeSpan.textContent = `${hours}h ${minutes}m (${stat.percentage}%)`;
        
        // Informations sur les distractions
        const distractHours = Math.floor(stat.distractionTime / 3600);
        const distractMinutes = Math.floor((stat.distractionTime % 3600) / 60);
        const distractSpan = document.createElement('span');
        distractSpan.className = 'distraction-info';
        distractSpan.textContent = 
            distractHours > 0 || distractMinutes > 0 
                ? `${distractHours}h ${distractMinutes}m`
                : 'Aucune';
        
        // Assembler et ajouter au conteneur
        categoryDiv.appendChild(colorIndicator);
        categoryDiv.appendChild(nameSpan);
        categoryDiv.appendChild(timeSpan);
        categoryDiv.appendChild(distractSpan);
        statsContainer.appendChild(categoryDiv);
    });
}

/**
 * Formate un temps en secondes en une chaîne lisible
 * @param {number} seconds - Temps en secondes
 * @returns {string} Temps formaté (ex: "2h 15m")
 */
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

// Export des fonctions pour les autres modules
window.initStats = initStats;
window.calculateDailyStats = calculateDailyStats;
window.renderStats = renderStats;
window.formatTime = formatTime;