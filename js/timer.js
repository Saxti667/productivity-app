 /**
 * Gestion du timer Pomodoro
 * Ce module gère toute la logique du timer et des sessions de travail
 */

// Éléments DOM
let minutesElement;
let secondsElement;
let durationInput;
let startButton;
let distractionButton;
let resetButton;
let pauseButton;
let taskDescriptionInput;
let timerSection;

// État du timer
let timerState = {
    duration: 25 * 60, // Durée en secondes (par défaut 25 minutes)
    remaining: 25 * 60, // Temps restant en secondes
    interval: null,     // ID de l'intervalle setInterval
    startTime: null,    // Heure de démarrage
    endTime: null,      // Heure de fin
    status: 'idle',     // État : idle, running, distracted, paused, completed
    distractions: [],   // Tableau des périodes de distraction
    currentDistraction: null, // Distraction en cours
    taskCategoryId: null, // ID de la catégorie de tâche
    taskDescription: '' // Description de la tâche
};

/**
 * Initialise le timer
 */
function initTimer() {
    // Récupération des éléments DOM
    minutesElement = document.getElementById('minutes');
    secondsElement = document.getElementById('seconds');
    durationInput = document.getElementById('timer-duration-input');
    startButton = document.getElementById('start-timer');
    distractionButton = document.getElementById('distraction-timer');
    resetButton = document.getElementById('reset-timer');
    pauseButton = document.getElementById('pause-timer');
    taskDescriptionInput = document.getElementById('task-description');
    timerSection = document.getElementById('timer-section');
    
    if (!minutesElement || !secondsElement || !durationInput || !startButton || 
        !distractionButton || !resetButton || !pauseButton || !timerSection) {
        console.error('Éléments DOM manquants pour le timer');
        return;
    }
    
    // Initialisation de la durée
    durationInput.addEventListener('change', () => {
        // Limiter entre 1 et 120 minutes
        const value = parseInt(durationInput.value) || 25;
        durationInput.value = Math.min(Math.max(value, 1), 120);
        
        // Mettre à jour l'affichage uniquement si le timer est inactif
        if (timerState.status === 'idle') {
            timerState.duration = durationInput.value * 60;
            timerState.remaining = timerState.duration;
            updateTimerDisplay();
        }
    });
    
    // Événements des boutons
    startButton.addEventListener('click', handleStartTimer);
    distractionButton.addEventListener('click', handleDistraction);
    resetButton.addEventListener('click', handleResetTimer);
    pauseButton.addEventListener('click', handlePauseTimer);
    
    // Mise à jour initiale de l'affichage
    updateTimerDisplay();
}

/**
 * Gère le démarrage ou la reprise du timer
 */
function handleStartTimer() {
    if (timerState.status !== 'idle' && timerState.status !== 'paused') {
        return;
    }
    
    // Récupérer la catégorie et la description
    const categoryId = window.getSelectedCategoryId ? window.getSelectedCategoryId() : null;
    
    if (!categoryId) {
        showErrorMessage('Veuillez sélectionner une catégorie');
        return;
    }
    
    timerState.taskCategoryId = categoryId;
    timerState.taskDescription = taskDescriptionInput ? taskDescriptionInput.value : '';
    
    // Si c'est un démarrage initial (pas une reprise après pause)
    if (timerState.status === 'idle') {
        timerState.startTime = new Date();
        timerState.duration = parseInt(durationInput.value) * 60;
        timerState.remaining = timerState.duration;
        timerState.distractions = [];
        timerState.currentDistraction = null;
    }
    
    // Mettre à jour l'état et le style
    timerState.status = 'running';
    updateTimerStyle();
    
    // Désactiver les inputs
    durationInput.disabled = true;
    startButton.disabled = true;
    distractionButton.disabled = false;
    resetButton.disabled = false;
    pauseButton.disabled = false;
    
    // Démarrer l'intervalle
    startTimerInterval();
}

/**
 * Démarre l'intervalle du timer
 */
function startTimerInterval() {
    // Arrêter l'intervalle précédent s'il existe
    if (timerState.interval) {
        clearInterval(timerState.interval);
    }
    
    const startTime = Date.now();
    const initialRemaining = timerState.remaining;
    
    timerState.interval = setInterval(() => {
        // Calculer le temps écoulé depuis le début de cet intervalle
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timerState.remaining = initialRemaining - elapsed;
        
        // Mettre à jour l'affichage
        updateTimerDisplay();
        
        // Vérifier si le timer est terminé
        if (timerState.remaining <= 0) {
            completeTimer();
        }
    }, 1000);
}

/**
 * Gère le bouton de distraction
 */
function handleDistraction() {
    if (timerState.status !== 'running' && timerState.status !== 'distracted') {
        return;
    }
    
    if (timerState.status === 'running') {
        // Démarrer une distraction
        timerState.status = 'distracted';
        timerState.currentDistraction = {
            startTime: new Date(),
            endTime: null,
            duration: 0
        };
        
        // Changer le texte du bouton
        distractionButton.textContent = 'Reprendre';
    } else {
        // Terminer la distraction
        timerState.currentDistraction.endTime = new Date();
        timerState.currentDistraction.duration = 
            (timerState.currentDistraction.endTime - timerState.currentDistraction.startTime) / 1000;
        
        // Ajouter à la liste des distractions
        timerState.distractions.push({...timerState.currentDistraction});
        timerState.currentDistraction = null;
        
        // Mettre à jour l'état
        timerState.status = 'running';
        
        // Rétablir le texte du bouton
        distractionButton.textContent = 'Distraction';
    }
    
    updateTimerStyle();
}

/**
 * Gère la réinitialisation du timer
 */
function handleResetTimer() {
    // Arrêter l'intervalle
    if (timerState.interval) {
        clearInterval(timerState.interval);
        timerState.interval = null;
    }
    
    // Réinitialiser l'état
    timerState.status = 'idle';
    timerState.remaining = timerState.duration;
    timerState.startTime = null;
    timerState.endTime = null;
    timerState.distractions = [];
    timerState.currentDistraction = null;
    
    // Réactiver les contrôles
    durationInput.disabled = false;
    startButton.disabled = false;
    distractionButton.disabled = true;
    resetButton.disabled = true;
    pauseButton.disabled = true;
    distractionButton.textContent = 'Distraction';
    
    // Mettre à jour l'affichage
    updateTimerDisplay();
    updateTimerStyle();
}

/**
 * Gère la mise en pause du timer
 */
function handlePauseTimer() {
    if (timerState.status !== 'running' && timerState.status !== 'paused') {
        return;
    }
    
    if (timerState.status === 'running') {
        // Mettre en pause
        timerState.status = 'paused';
        
        // Arrêter l'intervalle
        if (timerState.interval) {
            clearInterval(timerState.interval);
            timerState.interval = null;
        }
        
        // Changer le texte du bouton
        pauseButton.textContent = 'Reprendre';
        distractionButton.disabled = true;
    } else {
        // Reprendre
        timerState.status = 'running';
        
        // Redémarrer l'intervalle
        startTimerInterval();
        
        // Rétablir le texte du bouton
        pauseButton.textContent = 'Pause';
        distractionButton.disabled = false;
    }
    
    updateTimerStyle();
}

/**
 * Termine le timer et sauvegarde la session
 */
function completeTimer() {
    // Arrêter l'intervalle
    if (timerState.interval) {
        clearInterval(timerState.interval);
        timerState.interval = null;
    }
    
    // Enregistrer l'heure de fin
    timerState.endTime = new Date();
    timerState.status = 'completed';
    timerState.remaining = 0;
    
    // Finaliser les distractions en cours si nécessaire
    if (timerState.currentDistraction) {
        handleDistraction();
    }
    
    // Réactiver les contrôles
    durationInput.disabled = false;
    startButton.disabled = false;
    distractionButton.disabled = true;
    resetButton.disabled = true;
    pauseButton.disabled = true;
    
    // Mettre à jour l'affichage
    updateTimerDisplay();
    updateTimerStyle();
    
    // Enregistrer la session
    saveTimerSession();
    
    // Notifier l'utilisateur
    showCompletionNotification();
}

/**
 * Sauvegarde la session de timer terminée
 */
function saveTimerSession() {
    // Calculer le temps effectif (sans les distractions)
    const totalTime = (timerState.endTime - timerState.startTime) / 1000;
    const distractionTime = timerState.distractions.reduce((total, d) => total + d.duration, 0);
    const effectiveTime = totalTime - distractionTime;
    
    // Créer l'objet session
    const session = {
        id: 'sess_' + Date.now(),
        categoryId: timerState.taskCategoryId,
        description: timerState.taskDescription,
        startTime: timerState.startTime.toISOString(),
        endTime: timerState.endTime.toISOString(),
        duration: totalTime,
        distractions: timerState.distractions.map(d => ({
            startTime: d.startTime.toISOString(),
            endTime: d.endTime.toISOString(),
            duration: d.duration
        })),
        effectiveTime: effectiveTime
    };
    
    // Enregistrer la session via le module de stockage
    if (typeof saveSession === 'function') {
        saveSession(session);
    } else {
        console.error('Fonction saveSession non disponible');
    }
}

/**
 * Met à jour l'affichage du timer
 */
function updateTimerDisplay() {
    const minutes = Math.floor(timerState.remaining / 60);
    const seconds = timerState.remaining % 60;
    
    // Mettre à jour les éléments d'affichage
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
}

/**
 * Met à jour les styles du timer selon l'état
 */
function updateTimerStyle() {
    // Supprimer toutes les classes d'état
    timerSection.classList.remove('timer-running', 'timer-distracted', 'timer-paused');
    
    // Ajouter la classe correspondante
    switch (timerState.status) {
        case 'running':
            timerSection.classList.add('timer-running');
            break;
        case 'distracted':
            timerSection.classList.add('timer-distracted');
            break;
        case 'paused':
            timerSection.classList.add('timer-paused');
            break;
    }
}

/**
 * Affiche une notification de fin de session
 */
function showCompletionNotification() {
    // Si l'API Notification est disponible
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification('Session terminée', {
                body: 'Votre session de travail est terminée.',
                icon: 'assets/icons/timer-icon.png' // À remplacer par une icône réelle
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Session terminée', {
                        body: 'Votre session de travail est terminée.',
                        icon: 'assets/icons/timer-icon.png'
                    });
                }
            });
        }
    }
    
    // Afficher également un message visuel
    showSuccessMessage('Session terminée !');
}

/**
 * Affiche un message de succès
 * @param {string} message - Message à afficher
 */
function showSuccessMessage(message) {
    // Créer un élément de message
    const messageElement = document.createElement('div');
    messageElement.className = 'success-message';
    messageElement.textContent = message;
    
    // Ajouter au début de la section timer
    timerSection.insertBefore(messageElement, timerSection.firstChild);
    
    // Retirer après 5 secondes
    setTimeout(() => {
        if (messageElement.parentNode === timerSection) {
            timerSection.removeChild(messageElement);
        }
    }, 5000);
}

// Export des fonctions pour les autres modules
window.initTimer = initTimer;