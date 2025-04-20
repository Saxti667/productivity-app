 /**
 * Gestion du graphique circulaire
 * Ce module gère la création et l'affichage du graphique circulaire 24h
 */

// Éléments DOM
let chartContainer;
let dateInput;

// Configuration du graphique
const chartConfig = {
    radius: 200,           // Rayon du cercle extérieur
    innerRadius: 100,      // Rayon du cercle intérieur
    width: 500,            // Largeur totale du SVG
    height: 500,           // Hauteur totale du SVG
    hourLabelRadius: 220,  // Rayon des étiquettes d'heures
    segmentLabelRadius: 150 // Rayon des étiquettes de segments
};

/**
 * Initialise le graphique
 */
function initChart() {
    // Récupération des éléments DOM
    chartContainer = document.getElementById('chart-container');
    dateInput = document.getElementById('date-input');
    
    if (!chartContainer || !dateInput) {
        console.error('Éléments DOM manquants pour le graphique');
        return;
    }
    
    // Initialiser la date à aujourd'hui
    const today = new Date();
    dateInput.value = formatDateKey(today);
    
    // Événement de changement de date
    dateInput.addEventListener('change', () => {
        renderCircularChart(dateInput.value);
    });
    
    // Rendu initial du graphique
    renderCircularChart(dateInput.value);
}

/**
 * Crée et affiche le graphique circulaire
 * @param {Date|string} date - Date des sessions à afficher
 */
function renderCircularChart(date) {
    // Vider le conteneur
    chartContainer.innerHTML = '';
    
    // Récupérer les sessions pour cette date
    const sessions = getSessions(date);
    
    // Créer l'élément SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', chartConfig.width);
    svg.setAttribute('height', chartConfig.height);
    svg.setAttribute('viewBox', `0 0 ${chartConfig.width} ${chartConfig.height}`);
    svg.classList.add('chart-svg');
    
    // Groupe principal centré
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${chartConfig.width/2}, ${chartConfig.height/2})`);
    svg.appendChild(g);
    
    // Créer les définitions pour les motifs de distraction
    createPatternDefs(svg);
    
    // Ajouter les cercles de base
    drawBaseCircles(g);
    
    // Ajouter les lignes et étiquettes des heures
    drawHourMarkers(g);
    
    // Ajouter les segments de session
    drawSessionSegments(g, sessions);
    
    // Ajouter le graphique au conteneur
    chartContainer.appendChild(svg);
    
    // Créer la légende
    createChartLegend(sessions);
}

/**
 * Crée les définitions de motifs pour les distractions
 * @param {SVGElement} svg - Élément SVG parent
 */
function createPatternDefs(svg) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Motif de distraction (hachures)
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', 'distraction-pattern');
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    pattern.setAttribute('width', '10');
    pattern.setAttribute('height', '10');
    
    // Lignes du motif
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2');
    path.setAttribute('stroke', 'black');
    path.setAttribute('stroke-width', '1');
    path.setAttribute('stroke-opacity', '0.5');
    
    pattern.appendChild(path);
    defs.appendChild(pattern);
    svg.appendChild(defs);
}

/**
 * Dessine les cercles de base du graphique
 * @param {SVGElement} g - Groupe SVG parent
 */
function drawBaseCircles(g) {
    // Cercle extérieur
    const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outerCircle.setAttribute('r', chartConfig.radius);
    outerCircle.setAttribute('fill', 'none');
    outerCircle.setAttribute('stroke', '#ccc');
    outerCircle.setAttribute('stroke-width', '1');
    outerCircle.classList.add('chart-circle');
    g.appendChild(outerCircle);
    
    // Cercle intérieur
    const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    innerCircle.setAttribute('r', chartConfig.innerRadius);
    innerCircle.setAttribute('fill', 'none');
    innerCircle.setAttribute('stroke', '#ccc');
    innerCircle.setAttribute('stroke-width', '1');
    innerCircle.classList.add('chart-circle');
    g.appendChild(innerCircle);
}

/**
 * Dessine les marqueurs d'heures et leurs étiquettes
 * @param {SVGElement} g - Groupe SVG parent
 */
function drawHourMarkers(g) {
    for (let hour = 0; hour < 24; hour++) {
        // Angle pour cette heure (0h en haut, sens horaire)
        const angle = (hour / 24) * 2 * Math.PI - Math.PI/2;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        // Coordonnées des extrémités de la ligne
        const x1 = sin * chartConfig.innerRadius;
        const y1 = cos * chartConfig.innerRadius;
        const x2 = sin * chartConfig.radius;
        const y2 = cos * chartConfig.radius;
        
        // Ligne de l'heure
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#eee');
        line.setAttribute('stroke-width', '1');
        g.appendChild(line);
        
        // Étiquette de l'heure
        const labelX = sin * chartConfig.hourLabelRadius;
        const labelY = cos * chartConfig.hourLabelRadius;
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', labelX);
        text.setAttribute('y', labelY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('font-size', '12');
        text.classList.add('hour-label');
        text.textContent = hour;
        g.appendChild(text);
    }
}

/**
 * Dessine les segments représentant les sessions
 * @param {SVGElement} g - Groupe SVG parent
 * @param {Array} sessions - Tableau des sessions à afficher
 */
function drawSessionSegments(g, sessions) {
    // Pas de segments s'il n'y a pas de sessions
    if (!sessions || sessions.length === 0) {
        return;
    }
    
    sessions.forEach(session => {
        // Récupérer la catégorie
        const category = getCategoryById(session.categoryId);
        if (!category) return;
        
        // Calculer les angles de début et de fin
        const startTime = new Date(session.startTime);
        const endTime = new Date(session.endTime);
        
        const startHour = startTime.getHours() + startTime.getMinutes() / 60 + startTime.getSeconds() / 3600;
        const endHour = endTime.getHours() + endTime.getMinutes() / 60 + endTime.getSeconds() / 3600;
        
        // Convertir les heures en angles (0h en haut, sens horaire)
        const startAngle = (startHour / 24) * 2 * Math.PI - Math.PI/2;
        const endAngle = (endHour / 24) * 2 * Math.PI - Math.PI/2;
        
        // Créer le chemin d'arc
        const arc = createArcPath(chartConfig.innerRadius, chartConfig.radius, startAngle, endAngle);
        
        // Créer l'élément de chemin
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', arc);
        path.setAttribute('fill', category.color);
        path.classList.add('chart-segment');
        
        // Ajouter un tooltip avec les informations de la session
        const startTimeStr = startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const endTimeStr = endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const duration = formatTime(session.duration);
        
        path.setAttribute('data-tooltip', `${category.name}: ${startTimeStr} - ${endTimeStr} (${duration})`);
        
        g.appendChild(path);
        
        // Ajouter les segments de distraction
        drawDistractionSegments(g, session, category.color);
        
        // Ajouter une étiquette au milieu du segment si assez grand
        if (session.duration >= 15 * 60) { // Au moins 15 minutes
            const midAngle = (startAngle + endAngle) / 2;
            const midRadius = (chartConfig.innerRadius + chartConfig.radius) / 2;
            
            const labelX = Math.cos(midAngle) * midRadius;
            const labelY = Math.sin(midAngle) * midRadius;
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', labelX);
            text.setAttribute('y', labelY);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('font-size', '12');
            text.setAttribute('fill', 'white');
            text.classList.add('segment-label');
            text.textContent = formatTime(session.effectiveTime);
            
            // Rotation pour suivre l'arc
            let rotation = (midAngle * 180 / Math.PI) + 90;
            if (rotation > 90 && rotation < 270) {
                rotation += 180; // Éviter le texte à l'envers
            }
            text.setAttribute('transform', `rotate(${rotation}, ${labelX}, ${labelY})`);
            
            g.appendChild(text);
        }
    });
}

/**
 * Dessine les segments de distraction pour une session
 * @param {SVGElement} g - Groupe SVG parent
 * @param {Object} session - Session à traiter
 * @param {string} baseColor - Couleur de base de la session
 */
function drawDistractionSegments(g, session, baseColor) {
    if (!session.distractions || session.distractions.length === 0) {
        return;
    }
    
    session.distractions.forEach((distraction, index) => {
        // Calculer les angles
        const startTime = new Date(distraction.startTime);
        const endTime = new Date(distraction.endTime);
        
        const startHour = startTime.getHours() + startTime.getMinutes() / 60 + startTime.getSeconds() / 3600;
        const endHour = endTime.getHours() + endTime.getMinutes() / 60 + endTime.getSeconds() / 3600;
        
        // Convertir en angles
        const startAngle = (startHour / 24) * 2 * Math.PI - Math.PI/2;
        const endAngle = (endHour / 24) * 2 * Math.PI - Math.PI/2;
        
        // Créer le chemin d'arc
        const arc = createArcPath(chartConfig.innerRadius, chartConfig.radius, startAngle, endAngle);
        
        // Créer un ID unique pour ce motif de distraction
        const patternId = `distraction-${session.id}-${index}`;
        
        // Créer un motif spécifique avec la couleur de base
        const defs = g.closest('svg').querySelector('defs');
        const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        pattern.setAttribute('id', patternId);
        pattern.setAttribute('patternUnits', 'userSpaceOnUse');
        pattern.setAttribute('width', '10');
        pattern.setAttribute('height', '10');
        
        // Fond du motif
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '10');
        rect.setAttribute('height', '10');
        rect.setAttribute('fill', baseColor);
        pattern.appendChild(rect);
        
        // Lignes du motif
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2');
        path.setAttribute('stroke', 'black');
        path.setAttribute('stroke-width', '1');
        path.setAttribute('stroke-opacity', '0.7');
        pattern.appendChild(path);
        
        defs.appendChild(pattern);
        
        // Créer l'élément de chemin
        const segmentPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        segmentPath.setAttribute('d', arc);
        segmentPath.setAttribute('fill', `url(#${patternId})`);
        segmentPath.classList.add('chart-segment', 'distraction-segment');
        
        // Tooltip pour la distraction
        const startTimeStr = startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const endTimeStr = endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const duration = formatTime(distraction.duration);
        
        segmentPath.setAttribute('data-tooltip', `Distraction: ${startTimeStr} - ${endTimeStr} (${duration})`);
        
        g.appendChild(segmentPath);
    });
}

/**
 * Crée un chemin d'arc SVG entre deux rayons et deux angles
 * @param {number} innerRadius - Rayon intérieur
 * @param {number} outerRadius - Rayon extérieur
 * @param {number} startAngle - Angle de début (en radians)
 * @param {number} endAngle - Angle de fin (en radians)
 * @returns {string} Commande de chemin SVG
 */
function createArcPath(innerRadius, outerRadius, startAngle, endAngle) {
    // Calculer les points
    const innerStartX = Math.cos(startAngle) * innerRadius;
    const innerStartY = Math.sin(startAngle) * innerRadius;
    const outerStartX = Math.cos(startAngle) * outerRadius;
    const outerStartY = Math.sin(startAngle) * outerRadius;
    const innerEndX = Math.cos(endAngle) * innerRadius;
    const innerEndY = Math.sin(endAngle) * innerRadius;
    const outerEndX = Math.cos(endAngle) * outerRadius;
    const outerEndY = Math.sin(endAngle) * outerRadius;
    
    // Déterminer si l'arc est large (plus de 180°)
    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
    
    // Créer le chemin
    return `
        M ${innerStartX} ${innerStartY}
        L ${outerStartX} ${outerStartY}
        A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}
        L ${innerEndX} ${innerEndY}
        A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}
        Z
    `;
}

/**
 * Crée la légende du graphique
 * @param {Array} sessions - Sessions affichées
 */
function createChartLegend(sessions) {
    // Créer un conteneur pour la légende
    const legendContainer = document.createElement('div');
    legendContainer.className = 'chart-legend';
    
    // Extraire les catégories uniques des sessions
    const uniqueCategories = new Map();
    
    sessions.forEach(session => {
        const category = getCategoryById(session.categoryId);
        if (category && !uniqueCategories.has(category.id)) {
            uniqueCategories.set(category.id, category);
        }
    });
    
    // Créer un élément de légende pour chaque catégorie
    uniqueCategories.forEach(category => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = category.color;
        
        const label = document.createElement('span');
        label.textContent = category.name;
        
        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legendContainer.appendChild(legendItem);
    });
    
    // Ajouter un élément pour les distractions si présentes
    const hasDistractions = sessions.some(session => 
        session.distractions && session.distractions.length > 0
    );
    
    if (hasDistractions) {
        const distractionItem = document.createElement('div');
        distractionItem.className = 'legend-item';
        
        const distractionIndicator = document.createElement('div');
        distractionIndicator.className = 'legend-distraction';
        
        const label = document.createElement('span');
        label.textContent = 'Distraction';
        
        distractionItem.appendChild(distractionIndicator);
        distractionItem.appendChild(label);
        legendContainer.appendChild(distractionItem);
    }
    
    // Ajouter la légende au conteneur
    chartContainer.appendChild(legendContainer);
}

// Export des fonctions pour les autres modules
window.initChart = initChart;
window.renderCircularChart = renderCircularChart;