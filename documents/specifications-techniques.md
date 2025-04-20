# Spécifications Techniques Détaillées
## Application de Productivité & Suivi du Temps

### 1. Architecture Technique

#### 1.1 Structure des Fichiers
```
/
├── index.html           # Page principale (Timer)
├── visualization.html   # Page de visualisation
├── css/
│   ├── main.css         # Styles communs
│   ├── timer.css        # Styles spécifiques au timer
│   └── chart.css        # Styles spécifiques à la visualisation
├── js/
│   ├── app.js           # Initialisation et routage
│   ├── timer.js         # Logique du timer
│   ├── categories.js    # Gestion des catégories
│   ├── storage.js       # Gestion du stockage local
│   ├── chart.js         # Gestion du graphique circulaire
│   └── stats.js         # Calcul et affichage des statistiques
└── assets/
    └── icons/           # Icônes et ressources graphiques
```

#### 1.2 Choix Technologiques
- **HTML5** pour la structure
- **CSS3** pour le stylage (avec variables CSS pour la gestion des thèmes)
- **JavaScript ES6+** pour la logique applicative
- **localStorage** pour le stockage persistant des données
- Bibliothèques légères recommandées (optionnelles):
  - **D3.js** pour la visualisation du graphique circulaire
  - **Moment.js** pour la gestion du temps et des dates

### 2. Modèle de Données

#### 2.1 Structure des Données JSON

##### 2.1.1 Catégories
```json
{
  "categories": [
    {
      "id": "cat_1649786523",
      "name": "Programmation",
      "color": "#4287f5"
    },
    {
      "id": "cat_1649786545",
      "name": "Lecture",
      "color": "#42f5a7"
    }
  ]
}
```

##### 2.1.2 Sessions journalières
```json
{
  "date": "2025-04-06",
  "sessions": [
    {
      "id": "sess_1649786892",
      "categoryId": "cat_1649786523",
      "description": "Développement App Web",
      "startTime": "2025-04-06T09:30:00",
      "endTime": "2025-04-06T10:45:00",
      "duration": 4500,
      "distractions": [
        {
          "startTime": "2025-04-06T09:45:00",
          "endTime": "2025-04-06T09:48:00",
          "duration": 180
        }
      ],
      "effectiveTime": 4320
    }
  ]
}
```

##### 2.1.3 Statistiques
```json
{
  "date": "2025-04-06",
  "totalTime": 28800,
  "categoryStats": [
    {
      "categoryId": "cat_1649786523",
      "totalTime": 18000,
      "effectiveTime": 17280,
      "distractionTime": 720,
      "percentage": 62.5
    }
  ]
}
```

### 3. Implémentation des Fonctionnalités Clés

#### 3.1 Gestion des Catégories
```javascript
// Exemple de création d'une catégorie
function createCategory(name, color) {
  const id = 'cat_' + Date.now();
  const category = { id, name, color };
  const categories = getCategories();
  categories.push(category);
  saveCategories(categories);
  return category;
}
```

#### 3.2 Timer Fonctionnel
```javascript
class TaskTimer {
  constructor(duration, categoryId, description) {
    this.duration = duration * 60; // Conversion en secondes
    this.categoryId = categoryId;
    this.description = description;
    this.remaining = this.duration;
    this.startTime = null;
    this.endTime = null;
    this.distractions = [];
    this.currentDistraction = null;
    this.interval = null;
    this.status = 'idle'; // idle, running, paused, distracted
  }

  start() {
    if (this.status !== 'idle' && this.status !== 'paused') return;
    
    if (this.status === 'idle') {
      this.startTime = new Date();
    }
    
    this.status = 'running';
    const startTime = Date.now();
    const elapsedPause = this.status === 'paused' ? 
      Date.now() - this.pauseStartTime : 0;
    
    this.interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000) + 
        (this.duration - this.remaining);
      this.remaining = this.duration - elapsed;
      
      if (this.remaining <= 0) {
        this.finish();
      } else {
        this.updateDisplay();
      }
    }, 1000);
  }

  markDistraction() {
    if (this.status === 'running') {
      this.status = 'distracted';
      this.currentDistraction = {
        startTime: new Date(),
        endTime: null,
        duration: 0
      };
    } else if (this.status === 'distracted') {
      this.currentDistraction.endTime = new Date();
      this.currentDistraction.duration = 
        (this.currentDistraction.endTime - this.currentDistraction.startTime) / 1000;
      this.distractions.push({...this.currentDistraction});
      this.currentDistraction = null;
      this.status = 'running';
    }
  }

  finish() {
    clearInterval(this.interval);
    this.endTime = new Date();
    this.status = 'completed';
    
    // Finaliser les distractions en cours
    if (this.currentDistraction) {
      this.markDistraction();
    }
    
    // Sauvegarder la session
    this.saveSession();
    
    // Afficher une notification
    this.showCompletionNotification();
  }

  saveSession() {
    const session = {
      id: 'sess_' + Date.now(),
      categoryId: this.categoryId,
      description: this.description,
      startTime: this.startTime.toISOString(),
      endTime: this.endTime.toISOString(),
      duration: (this.endTime - this.startTime) / 1000,
      distractions: this.distractions.map(d => ({
        startTime: d.startTime.toISOString(),
        endTime: d.endTime.toISOString(),
        duration: d.duration
      })),
      effectiveTime: (this.endTime - this.startTime) / 1000 - 
        this.distractions.reduce((total, d) => total + d.duration, 0)
    };
    
    // Appel à la fonction de stockage
    saveSession(session);
  }
}
```

#### 3.3 Visualisation Circulaire
```javascript
function renderCircularChart(date) {
  const sessions = getSessions(date);
  const container = document.getElementById('chart-container');
  
  // Configuration du graphique
  const config = {
    radius: 200,
    innerRadius: 100,
    width: 600,
    height: 600
  };
  
  // Création du SVG avec D3.js
  const svg = d3.select(container)
    .append('svg')
    .attr('width', config.width)
    .attr('height', config.height)
    .append('g')
    .attr('transform', `translate(${config.width/2}, ${config.height/2})`);
  
  // Échelle pour les heures
  const timeScale = d3.scaleLinear()
    .domain([0, 24])
    .range([0, 2 * Math.PI]);
  
  // Cercle extérieur
  svg.append('circle')
    .attr('r', config.radius)
    .attr('fill', 'none')
    .attr('stroke', '#ccc');
  
  // Cercle intérieur
  svg.append('circle')
    .attr('r', config.innerRadius)
    .attr('fill', 'none')
    .attr('stroke', '#ccc');
  
  // Lignes des heures
  for (let hour = 0; hour < 24; hour++) {
    const angle = timeScale(hour);
    const x1 = Math.sin(angle) * config.innerRadius;
    const y1 = -Math.cos(angle) * config.innerRadius;
    const x2 = Math.sin(angle) * config.radius;
    const y2 = -Math.cos(angle) * config.radius;
    
    svg.append('line')
      .attr('x1', x1)
      .attr('y1', y1)
      .attr('x2', x2)
      .attr('y2', y2)
      .attr('stroke', '#eee')
      .attr('stroke-width', 1);
    
    // Numéros des heures
    const labelRadius = config.radius + 15;
    svg.append('text')
      .attr('x', Math.sin(angle) * labelRadius)
      .attr('y', -Math.cos(angle) * labelRadius)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(hour);
  }
  
  // Rendu des sessions
  sessions.forEach(session => {
    const startHour = new Date(session.startTime).getHours() + 
      new Date(session.startTime).getMinutes() / 60;
    const endHour = new Date(session.endTime).getHours() + 
      new Date(session.endTime).getMinutes() / 60;
    
    const category = getCategoryById(session.categoryId);
    
    // Arc principal pour la session
    const arc = d3.arc()
      .innerRadius(config.innerRadius)
      .outerRadius(config.radius)
      .startAngle(timeScale(startHour))
      .endAngle(timeScale(endHour));
    
    svg.append('path')
      .attr('d', arc)
      .attr('fill', category.color);
    
    // Rendu des distractions avec motif hachuré
    session.distractions.forEach(distraction => {
      const distStartHour = new Date(distraction.startTime).getHours() + 
        new Date(distraction.startTime).getMinutes() / 60;
      const distEndHour = new Date(distraction.endTime).getHours() + 
        new Date(distraction.endTime).getMinutes() / 60;
      
      const distArc = d3.arc()
        .innerRadius(config.innerRadius)
        .outerRadius(config.radius)
        .startAngle(timeScale(distStartHour))
        .endAngle(timeScale(distEndHour));
      
      // Définition du motif hachuré
      const patternId = `distraction-${session.id}-${distraction.startTime}`;
      
      svg.append('defs')
        .append('pattern')
        .attr('id', patternId)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 10)
        .attr('height', 10)
        .append('path')
        .attr('d', 'M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2')
        .attr('stroke', '#000')
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.5);
      
      svg.append('path')
        .attr('d', distArc)
        .attr('fill', `url(#${patternId})`);
    });
    
    // Étiquette avec la durée
    const midAngle = timeScale((startHour + endHour) / 2);
    const midRadius = (config.innerRadius + config.radius) / 2;
    const hours = Math.floor(session.effectiveTime / 3600);
    const minutes = Math.floor((session.effectiveTime % 3600) / 60);
    const timeLabel = hours > 0 ? `${hours}h${minutes}m` : `${minutes}m`;
    
    svg.append('text')
      .attr('x', Math.sin(midAngle) * midRadius)
      .attr('y', -Math.cos(midAngle) * midRadius)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', 'white')
      .text(timeLabel);
  });
}
```

#### 3.4 Statistiques
```javascript
function calculateDailyStats(date) {
  const sessions = getSessions(date);
  const categories = getCategories();
  
  // Statistiques par catégorie
  const categoryStats = categories.map(category => {
    const categorySessions = sessions.filter(
      session => session.categoryId === category.id
    );
    
    const totalTime = categorySessions.reduce(
      (sum, session) => sum + session.duration, 0
    );
    
    const effectiveTime = categorySessions.reduce(
      (sum, session) => sum + session.effectiveTime, 0
    );
    
    const distractionTime = totalTime - effectiveTime;
    
    const totalTimeAllCategories = sessions.reduce(
      (sum, session) => sum + session.duration, 0
    );
    
    const percentage = totalTimeAllCategories > 0 ? 
      (totalTime / totalTimeAllCategories) * 100 : 0;
    
    return {
      categoryId: category.id,
      name: category.name,
      color: category.color,
      totalTime,
      effectiveTime,
      distractionTime,
      percentage: Math.round(percentage * 10) / 10
    };
  }).filter(stat => stat.totalTime > 0);
  
  return {
    date,
    totalTime: sessions.reduce((sum, session) => sum + session.duration, 0),
    effectiveTime: sessions.reduce(
      (sum, session) => sum + session.effectiveTime, 0
    ),
    categoryStats
  };
}

function renderStatistics(stats) {
  const container = document.getElementById('stats-container');
  container.innerHTML = '';
  
  const totalHours = Math.floor(stats.totalTime / 3600);
  const totalMinutes = Math.floor((stats.totalTime % 3600) / 60);
  
  const header = document.createElement('h2');
  header.textContent = `Temps total: ${totalHours}h ${totalMinutes}m`;
  container.appendChild(header);
  
  // Tri des catégories par temps total (décroissant)
  const sortedStats = [...stats.categoryStats].sort(
    (a, b) => b.totalTime - a.totalTime
  );
  
  sortedStats.forEach(stat => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category-stat';
    
    const colorIndicator = document.createElement('div');
    colorIndicator.className = 'color-indicator';
    colorIndicator.style.backgroundColor = stat.color;
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = stat.name;
    
    const hours = Math.floor(stat.totalTime / 3600);
    const minutes = Math.floor((stat.totalTime % 3600) / 60);
    const timeSpan = document.createElement('span');
    timeSpan.textContent = `${hours}h ${minutes}m (${stat.percentage}%)`;
    
    // Information sur les distractions
    const distractHours = Math.floor(stat.distractionTime / 3600);
    const distractMinutes = Math.floor((stat.distractionTime % 3600) / 60);
    const distractSpan = document.createElement('span');
    distractSpan.className = 'distraction-info';
    distractSpan.textContent = 
      `Distractions: ${distractHours}h ${distractMinutes}m`;
    
    categoryDiv.appendChild(colorIndicator);
    categoryDiv.appendChild(nameSpan);
    categoryDiv.appendChild(timeSpan);
    categoryDiv.appendChild(distractSpan);
    container.appendChild(categoryDiv);
  });
}
```

### 4. Stockage Local

```javascript
// Gestion du stockage local des données
const STORAGE_KEYS = {
  CATEGORIES: 'productivity_app_categories',
  SESSIONS_PREFIX: 'productivity_app_sessions_',
  STATS_PREFIX: 'productivity_app_stats_'
};

// Formatage de la date pour les clés de stockage
function formatDateKey(date) {
  if (typeof date === 'string') {
    return date;
  }
  return date.toISOString().split('T')[0];
}

// Gestion des catégories
function getCategories() {
  const categoriesJSON = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return categoriesJSON ? JSON.parse(categoriesJSON) : [];
}

function saveCategories(categories) {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
}

function getCategoryById(id) {
  return getCategories().find(category => category.id === id);
}

// Gestion des sessions
function getSessionsKey(date) {
  return STORAGE_KEYS.SESSIONS_PREFIX + formatDateKey(date);
}

function getSessions(date) {
  const key = getSessionsKey(date);
  const sessionsJSON = localStorage.getItem(key);
  return sessionsJSON ? JSON.parse(sessionsJSON) : [];
}

function saveSession(session) {
  const date = new Date(session.startTime).toISOString().split('T')[0];
  const key = getSessionsKey(date);
  const sessions = getSessions(date);
  sessions.push(session);
  localStorage.setItem(key, JSON.stringify(sessions));
  
  // Mettre à jour les statistiques
  updateStats(date);
}

// Gestion des statistiques
function getStatsKey(date) {
  return STORAGE_KEYS.STATS_PREFIX + formatDateKey(date);
}

function getStats(date) {
  const key = getStatsKey(date);
  const statsJSON = localStorage.getItem(key);
  return statsJSON ? JSON.parse(statsJSON) : null;
}

function updateStats(date) {
  const stats = calculateDailyStats(date);
  const key = getStatsKey(date);
  localStorage.setItem(key, JSON.stringify(stats));
  return stats;
}
```

### 5. Gestion des Erreurs

```javascript
// Gestionnaire global d'erreurs
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Erreur globale:', message, 'Source:', source, 
    'Ligne:', lineno, 'Colonne:', colno, 'Détails:', error);
  
  showErrorMessage('Une erreur est survenue. Veuillez réessayer.');
  return true;
};

// Affichage des messages d'erreur à l'utilisateur
function showErrorMessage(message, duration = 5000) {
  const errorContainer = document.getElementById('error-container');
  if (!errorContainer) {
    // Créer le conteneur s'il n'existe pas
    const container = document.createElement('div');
    container.id = 'error-container';
    container.className = 'error-container';
    document.body.appendChild(container);
  }
  
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  
  document.getElementById('error-container').appendChild(errorElement);
  
  // Disparition automatique après la durée spécifiée
  setTimeout(() => {
    errorElement.classList.add('fade-out');
    setTimeout(() => {
      errorElement.remove();
    }, 500);
  }, duration);
}

// Fonction de validation des entrées utilisateur
function validateTimerInput(duration, categoryId, description) {
  const errors = [];
  
  if (!duration || duration <= 0 || duration > 120) {
    errors.push('La durée doit être comprise entre 1 et 120 minutes.');
  }
  
  if (!categoryId) {
    errors.push('Veuillez sélectionner une catégorie.');
  } else if (!getCategoryById(categoryId)) {
    errors.push('La catégorie sélectionnée n\'existe pas.');
  }
  
  return errors;
}

// Vérification de la disponibilité du stockage
function checkStorageAvailability() {
  try {
    const testKey = 'storage_test';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    showErrorMessage('Le stockage local n\'est pas disponible. ' + 
      'Certaines fonctionnalités peuvent ne pas fonctionner correctement.');
    return false;
  }
}
```

### 6. Plan de Test Détaillé

#### 6.1 Tests Unitaires
- Test des fonctions de gestion des catégories
- Test des fonctions de stockage local
- Test des fonctions de calcul des statistiques
- Test des validations d'entrée utilisateur

#### 6.2 Tests d'Intégration
- Workflow complet de création d'une session
- Interaction entre le timer et la sauvegarde des données
- Mise à jour du graphique après ajout de nouvelles sessions

#### 6.3 Tests Utilisateur
- Scénarios clés à tester:
  1. Création d'une catégorie et démarrage d'une session
  2. Marquage des distractions pendant une session
  3. Visualisation du graphique après plusieurs sessions
  4. Navigation entre les pages et persistance des données

#### 6.4 Tests de Performance
- Vérification des performances avec un grand nombre de sessions
- Mesure du temps de chargement et de rendu du graphique
- Tests de limite de stockage local

### 7. Guide d'Installation

```
1. Cloner ou télécharger le code source
2. Ouvrir index.html dans un navigateur web moderne
3. Aucune installation supplémentaire n'est requise
4. Pour le développement, ouvrir le projet dans un éditeur de code
5. Tester avec un serveur local pour éviter les restrictions CORS
```

### 8. Récapitulatif des Livrables

1. Code source complet et fonctionnel
2. Documentation technique
3. Guide utilisateur simple
4. Plan de test avec scénarios de test
5. Optimisations futures recommandées
