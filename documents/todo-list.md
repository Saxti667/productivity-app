# TODO.md - Liste de contrôle pour l'implémentation de l'application

## Phase 1: Configuration et Structure de Base

### 1.1 Configuration initiale du projet
- [0] Créer la structure de répertoires (racine, css, js, assets)
- [0] Créer le fichier index.html (page timer)
- [0] Créer le fichier visualization.html
- [0] Initialiser les fichiers CSS vides (reset.css, main.css, timer.css, visualization.css)
- [0] Initialiser les fichiers JavaScript vides (app.js)
- [0] Vérifier que la structure est complète et que tous les fichiers sont accessibles

### 1.2 Mise en place du design de base
- [] Implémenter reset.css pour normaliser les styles entre navigateurs
- [ ] Définir les variables CSS pour les couleurs et autres constantes visuelles
- [ ] Créer les styles de base pour le layout (grille, conteneurs, espacements)
- [ ] Implémenter les styles de typographie (polices, tailles, couleurs de texte)
- [ ] Créer les styles de base pour les formulaires et boutons
- [ ] Vérifier la cohérence visuelle entre navigateurs et appareils

### 1.3 Système de navigation
- [ ] Créer le menu de navigation en HTML pour les deux pages
- [ ] Implémenter les styles CSS pour le menu de navigation
- [ ] Ajouter les indicateurs visuels pour la page active
- [ ] Implémenter la logique JavaScript pour détecter la page active
- [ ] Tester la navigation entre les pages
- [ ] Vérifier l'adaptabilité du menu sur différentes tailles d'écran

## Phase 2: Gestion des Données et Persistence

### 2.1 Modèle de données
- [ ] Définir la structure JSON pour les catégories (id, nom, couleur)
- [ ] Définir la structure JSON pour les sessions (id, catégorie, horodatages, distractions)
- [ ] Définir la structure JSON pour les statistiques (temps par catégorie, pourcentages)
- [ ] Créer des données d'exemple pour les tests
- [ ] Documenter la structure des données avec commentaires explicatifs
- [ ] Vérifier la validité des structures JSON

### 2.2 Système de stockage local
- [ ] Créer un module storage.js avec constantes pour les clés de stockage
- [ ] Implémenter une fonction de test de disponibilité du localStorage
- [ ] Créer les fonctions CRUD pour les catégories (getCategories, saveCategory, etc.)
- [ ] Créer les fonctions CRUD pour les sessions (getSessions, saveSession, etc.)
- [ ] Créer les fonctions pour les statistiques (getStats, updateStats, etc.)
- [ ] Implémenter la gestion des erreurs de stockage
- [ ] Tester la persistence des données entre les rechargements de page

### 2.3 Gestion des catégories
- [ ] Créer un module categories.js avec logique de gestion des catégories
- [ ] Créer le formulaire HTML pour ajouter des catégories
- [ ] Implémenter la sélection de couleur pour les catégories
- [ ] Ajouter la logique JavaScript pour créer et sauvegarder les catégories
- [ ] Implémenter l'affichage de la liste des catégories existantes
- [ ] Ajouter la fonctionnalité de sélection d'une catégorie pour le timer
- [ ] Tester le cycle complet de création et sélection de catégories

## Phase 3: Fonctionnalité Timer

### 3.1 Timer de base
- [ ] Créer un module timer.js avec la classe TaskTimer
- [ ] Implémenter l'interface HTML pour le timer (affichage, contrôles)
- [ ] Ajouter la logique du compte à rebours
- [ ] Implémenter le sélecteur de durée (jusqu'à 120 minutes)
- [ ] Créer les fonctions pour démarrer, réinitialiser le timer
- [ ] Implémenter l'affichage en temps réel du timer (format mm:ss)
- [ ] Tester le fonctionnement de base du timer

### 3.2 Suivi des distractions
- [ ] Ajouter le bouton de marquage des distractions à l'interface
- [ ] Modifier la classe TaskTimer pour suivre les périodes de distraction
- [ ] Implémenter les indicateurs visuels pour l'état de distraction
- [ ] Créer la logique pour calculer le temps effectif vs temps total
- [ ] Stocker les données de distraction pour chaque session
- [ ] Tester le marquage des distractions et les calculs de temps

### 3.3 Finalisation et sauvegarde des sessions
- [ ] Implémenter la logique de fin de session du timer
- [ ] Créer un module sessions.js pour gérer les sessions terminées
- [ ] Ajouter des notifications visuelles et/ou sonores en fin de session
- [ ] Implémenter l'enregistrement automatique des sessions dans le localStorage
- [ ] Programmer la réinitialisation du timer pour une nouvelle session
- [ ] Tester le cycle complet d'une session jusqu'à l'enregistrement

## Phase 4: Visualisation des Données

### 4.1 Graphique circulaire de base
- [ ] Créer un module chart.js pour la visualisation
- [ ] Initialiser le conteneur SVG dans la page visualization.html
- [ ] Implémenter le dessin des cercles concentriques (intérieur/extérieur)
- [ ] Ajouter les marqueurs et étiquettes des 24 heures
- [ ] Créer les fonctions pour convertir les heures en angles
- [ ] Tester le rendu du graphique circulaire vide

### 4.2 Affichage des sessions dans le graphique
- [ ] Implémenter la récupération des sessions du jour actif
- [ ] Créer la fonction pour convertir les sessions en segments d'arc
- [ ] Ajouter la coloration des segments selon la catégorie
- [ ] Implémenter l'affichage des durées sur les segments
- [ ] Créer une légende pour les catégories affichées
- [ ] Tester le rendu correct des sessions dans le graphique

### 4.3 Représentation des distractions
- [ ] Créer les définitions de motifs hachurés pour les distractions
- [ ] Implémenter la logique pour superposer les motifs aux segments appropriés
- [ ] Ajouter une explication visuelle dans la légende
- [ ] Améliorer l'interface pour afficher le rapport distraction/temps effectif
- [ ] Vérifier la lisibilité et la clarté des indicateurs de distraction
- [ ] Tester l'affichage correct des distractions dans diverses configurations

## Phase 5: Statistiques et Finalisation

### 5.1 Statistiques par catégorie
- [ ] Créer un module stats.js pour les calculs statistiques
- [ ] Implémenter l'interface HTML pour afficher les statistiques
- [ ] Ajouter les styles CSS pour la section des statistiques
- [ ] Créer les fonctions pour calculer:
  - [ ] Temps total par catégorie
  - [ ] Pourcentage du temps total par catégorie
  - [ ] Temps de distraction par catégorie
  - [ ] Efficacité par catégorie (temps effectif/temps total)
- [ ] Tester l'exactitude des statistiques affichées

### 5.2 Intégration complète
- [ ] Implémenter un système d'événements pour synchroniser timer et visualisation
- [ ] Créer des mises à jour automatiques du graphique quand une session est ajoutée
- [ ] Assurer la cohérence des données entre timer et visualisation
- [ ] Vérifier la navigation fluide entre les différentes fonctionnalités
- [ ] Tester l'application avec un workflow complet (création → timer → visualisation)
- [ ] Vérifier la cohérence des données sur plusieurs sessions

### 5.3 Optimisations et finitions
- [ ] Optimiser les performances du rendu graphique
- [ ] Améliorer les animations et transitions UI
- [ ] Renforcer la validation des entrées utilisateur
- [ ] Implémenter une meilleure gestion des erreurs avec messages utilisateur
- [ ] Vérifier la compatibilité avec les principaux navigateurs
- [ ] Tester l'application sur différents appareils et tailles d'écran
- [ ] Corriger les derniers bugs et problèmes d'interface

## Tests transversaux

### Tests de fonctionnalités
- [ ] Tester la création et gestion des catégories
- [ ] Vérifier le fonctionnement complet du timer (démarrage, pauses, distractions)
- [ ] Tester l'enregistrement et la visualisation des sessions
- [ ] Vérifier l'exactitude des statistiques générées

### Tests de persistance
- [ ] Vérifier la sauvegarde correcte des données dans localStorage
- [ ] Tester le chargement des données après fermeture/réouverture du navigateur
- [ ] Vérifier la gestion des erreurs de stockage (plein, indisponible)

### Tests d'interface
- [ ] Vérifier l'adaptabilité sur différentes tailles d'écran
- [ ] Tester la cohérence visuelle entre navigateurs
- [ ] Vérifier l'accessibilité de base (contraste, navigation au clavier)

### Tests de performance
- [ ] Mesurer le temps de chargement initial
- [ ] Vérifier la réactivité de l'interface pendant l'utilisation du timer
- [ ] Tester les performances avec un grand nombre de sessions

## Documentation

### Documentation utilisateur
- [ ] Créer un guide d'utilisation simple
- [ ] Documenter les fonctionnalités principales
- [ ] Fournir des exemples d'utilisation

### Documentation technique
- [ ] Documenter l'architecture de l'application
- [ ] Annoter le code avec des commentaires explicatifs
- [ ] Créer une documentation des fonctions et modules principaux
