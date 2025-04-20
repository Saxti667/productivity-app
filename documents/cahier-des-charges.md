# Cahier des Charges - Application de Productivité & Suivi du Temps

## 1. Présentation du Projet

### 1.1 Objectif
Développer une application web personnelle de productivité permettant de suivre et visualiser la répartition du temps quotidien via un timer flexible et un graphique circulaire de type horloge sur 24h.

### 1.2 Fonctionnalités Principales
- Timer Pomodoro flexible (jusqu'à 120 minutes)
- Suivi des périodes de distraction pendant une session
- Visualisation des activités sur un graphique circulaire 24h
- Création et personnalisation de catégories de tâches
- Statistiques sur le temps passé par catégorie

## 2. Structure de l'Application

### 2.1 Architecture Générale
L'application sera développée en HTML, CSS et JavaScript, sans dépendance à un backend. Elle sera composée de deux pages principales accessibles via un menu de navigation en haut de page.

### 2.2 Pages de l'Application
1. **Page Timer**
   - Interface de création/sélection de catégories
   - Timer avec contrôles (démarrer, pauses/distractions, réinitialiser)
   - Formulaire de saisie des informations de la tâche

2. **Page Visualisation**
   - Graphique circulaire 24h des activités
   - Statistiques des temps par catégorie
   - Vue pour un jour à la fois

## 3. Spécifications Fonctionnelles

### 3.1 Gestion des Catégories
- Création libre des catégories par l'utilisateur
- Définition par nom et couleur associée
- Pas de catégories prédéfinies

### 3.2 Fonctionnement du Timer
- Timer flexible avec limite maximale de 120 minutes
- Bouton "Lancer" pour démarrer le timer
- Bouton spécial "Pause" qui ne stoppe pas le timer mais marque les moments de distraction
- Bouton pour reprendre après une distraction
- Boutons de réinitialisation et pause réelle (pour tests)
- Enregistrement automatique dans le graphique à la fin d'une session

### 3.3 Visualisation
- Graphique circulaire style napchart.com (référence)
- Représentation sur 24h avec segments colorés selon les catégories
- Segments hachurés ou à motifs pour indiquer les périodes de distraction
- Affichage du temps passé sur chaque activité
- Statistiques additionnelles montrant le temps total par catégorie

### 3.4 Stockage des Données
- Stockage local (localStorage ou IndexedDB)
- Organisation des données par jour
- Enregistrement d'un seul jour pour la première version

## 4. Spécifications Techniques

### 4.1 Technologies
- HTML5, CSS3, JavaScript (ES6+)
- Pas de framework obligatoire, mais possibilité d'utiliser des bibliothèques légères pour:
  - La visualisation du graphique circulaire
  - La gestion du timer
  - Le stockage local des données

### 4.2 Stockage de Données
- Structure de données JSON pour stocker:
  - Les catégories (nom, couleur)
  - Les sessions (horodatage début/fin, catégorie, description, périodes de distraction)
  - Les statistiques journalières

### 4.3 Interface Utilisateur
- Design minimaliste avec couleurs simples
- Interface responsive sans exigences particulières de compatibilité
- Navigation intuitive entre les différentes pages

## 5. Exigences Non-Fonctionnelles

### 5.1 Performance
- Temps de réponse rapide pour les interactions utilisateur
- Chargement efficace du graphique même avec de nombreuses sessions

### 5.2 Fiabilité
- Persistance fiable des données dans le stockage local
- Gestion appropriée des erreurs et des états exceptionnels

### 5.3 Utilisabilité
- Interface intuitive et facile à utiliser
- Feedback visuel clair pour les actions de l'utilisateur

## 6. Gestion d'Erreurs

### 6.1 Stratégies de Gestion
- Validation des entrées utilisateur
- Messages d'erreur clairs et informatifs
- Récupération gracieuse en cas d'erreur
- Journalisation des erreurs en console pour le débogage

### 6.2 Scénarios d'Erreur à Gérer
- Échec de stockage local (stockage plein ou non disponible)
- Saisie de données invalides
- Problèmes de rendu du graphique
- Actions utilisateur conflictuelles

## 7. Plan de Test

### 7.1 Tests Fonctionnels
- Création et gestion des catégories
- Fonctionnement du timer (démarrage, arrêt, distractions, réinitialisation)
- Enregistrement des sessions dans le graphique
- Navigation entre les pages
- Affichage correct des statistiques

### 7.2 Tests de Stockage
- Persistance des données entre les sessions
- Chargement correct des données enregistrées
- Gestion de la capacité de stockage

### 7.3 Tests d'Interface
- Rendu correct sur différentes tailles d'écran
- Cohérence visuelle des éléments
- Accessibilité basique

### 7.4 Tests de Performance
- Réactivité de l'interface pendant l'utilisation du timer
- Temps de chargement du graphique avec plusieurs entrées

## 8. Livrables Attendus

- Code source complet et commenté
- Documentation d'utilisation basique
- Guide d'installation/déploiement simple
