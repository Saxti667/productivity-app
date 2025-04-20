# Application de Productivité & Suivi du Temps

Une application web personnelle permettant de suivre et visualiser la répartition du temps quotidien via un timer flexible et un graphique circulaire sur 24h.

## Fonctionnalités

- Timer Pomodoro flexible (1 à 120 minutes)
- Suivi des périodes de distraction pendant une session
- Visualisation des activités sur un graphique circulaire 24h
- Création et personnalisation de catégories de tâches
- Statistiques sur le temps passé par catégorie

## Installation

L'application est entièrement en HTML, CSS et JavaScript, sans dépendance à un backend.

1. Clonez ce dépôt ou téléchargez les fichiers
2. Ouvrez `index.html` dans un navigateur web moderne
3. C'est tout ! L'application est prête à être utilisée

## Utilisation

### Page Timer

1. **Créez des catégories** : Donnez un nom et choisissez une couleur pour chaque type d'activité
2. **Sélectionnez une catégorie** : Cliquez sur une catégorie dans la liste
3. **Configurez le timer** : Définissez la durée souhaitée (entre 1 et 120 minutes)
4. **Ajoutez une description** : Décrivez brièvement la tâche que vous allez effectuer
5. **Démarrez le timer** : Cliquez sur "Démarrer"
6. **Gérez les distractions** : Si vous êtes distrait, cliquez sur le bouton "Distraction", puis cliquez à nouveau pour reprendre
7. **Terminez la session** : Le timer s'arrête automatiquement et la session est enregistrée

### Page Visualisation

1. **Sélectionnez une date** : Par défaut, la date actuelle est sélectionnée
2. **Visualisez votre journée** : Le graphique circulaire affiche toutes vos sessions
3. **Consultez les statistiques** : Voyez le temps total et la répartition par catégorie

## Structure des fichiers

```
/
├── index.html              # Page principale (Timer)
├── visualization.html      # Page de visualisation
├── css/
│   ├── main.css            # Styles communs
│   ├── timer.css           # Styles spécifiques au timer
│   └── chart.css           # Styles spécifiques à la visualisation
├── js/
│   ├── app.js              # Initialisation et routage
│   ├── timer.js            # Logique du timer
│   ├── categories.js       # Gestion des catégories
│   ├── storage.js          # Gestion du stockage local
│   ├── chart.js            # Gestion du graphique circulaire
│   └── stats.js            # Calcul et affichage des statistiques
└── README.md               # Documentation
```

## Stockage des données

Toutes les données sont stockées localement dans votre navigateur via `localStorage`. Aucune donnée n'est envoyée à un serveur externe.

- Les catégories sont persistantes entre les sessions
- Les données de temps sont organisées par jour
- L'application conserve l'historique tant que le stockage local n'est pas effacé

## Limitations

- Les données sont stockées uniquement dans le navigateur utilisé (pas de synchronisation entre appareils)
- La capacité de stockage est limitée par `localStorage` (environ 5-10 Mo selon le navigateur)
- L'application nécessite un navigateur moderne supportant les technologies web récentes

## Développement

### Technologies utilisées

- HTML5 pour la structure
- CSS3 pour le style
- JavaScript ES6+ pour la logique
- localStorage pour la persistance des données

### Fonctionnalités futures envisagées

- Ajout d'un mode sombre
- Export et import des données
- Visualisation sur plusieurs jours
- Statistiques hebdomadaires et mensuelles
- Notifications sonores personnalisables