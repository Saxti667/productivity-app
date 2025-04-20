# Prompts d'Implémentation - Développement Guidé par les Tests

## Phase 1: Configuration et Structure de Base

### Prompt 1: Configuration initiale du projet et structure HTML

```
Je développe une application web de productivité avec timer Pomodoro et visualisation des activités. Commençons par créer la structure de base du projet. Veuillez générer:

1. Une structure de répertoires (index.html à la racine, dossiers css, js, assets)
2. Un squelette HTML pour index.html (page timer) avec:
   - Structure HTML5 de base
   - Intégration des fichiers CSS et JS
   - Un conteneur principal pour le timer
   - Un emplacement pour le formulaire de création de tâche
   - Un placeholder pour le menu de navigation

3. Un squelette HTML pour visualization.html avec:
   - Structure similaire
   - Conteneur pour le graphique circulaire
   - Emplacement pour les statistiques

Utilisez des commentaires explicatifs pour indiquer où le contenu dynamique sera ajouté ultérieurement. Concentrez-vous sur une structure sémantique et accessible.
```

### Prompt 2: Mise en place des feuilles de style CSS fondamentales

```
Maintenant, créons les feuilles de style CSS de base pour notre application de productivité. En vous basant sur la structure HTML précédente, veuillez générer:

1. Un fichier reset.css avec les normalisations de base pour assurer la cohérence entre navigateurs
2. Un fichier main.css avec:
   - Variables CSS pour les couleurs principales (utilisez un design minimaliste)
   - Styles de base pour le layout (police, espacement, etc.)
   - Styles du menu de navigation commun aux deux pages
   - Classes d'utilitaires réutilisables

3. Un fichier timer.css pour la page index.html avec:
   - Styles pour le conteneur du timer
   - Design pour l'affichage numérique du timer
   - Styles de base pour les boutons de contrôle
   - Layout pour le formulaire de sélection de catégorie

4. Un fichier visualization.css pour la page de visualisation avec:
   - Styles pour le conteneur du graphique circulaire
   - Design de base pour la section des statistiques

Utilisez un design responsive et minimaliste. N'implémentez pas encore les styles pour les fonctionnalités qui n'ont pas été créées.
```

### Prompt 3: Système de navigation et initialisation JavaScript

```
Créons le système de navigation entre les pages et initialisons la structure JavaScript de notre application. Veuillez générer:

1. Le code HTML pour le menu de navigation à intégrer dans les deux pages:
   - Liens vers index.html (Timer) et visualization.html (Visualisation)
   - Indicateur visuel pour la page active

2. Un fichier app.js pour l'initialisation globale:
   - Fonction pour détecter la page actuelle
   - Vérification de la disponibilité du stockage local
   - Structure modulaire pour charger les scripts spécifiques à chaque page

3. Des tests simples pour vérifier:
   - Que la navigation fonctionne correctement
   - Que les pages se chargent sans erreur
   - Que localStorage est disponible

Assurez-vous que les scripts sont chargés correctement et que la navigation est fonctionnelle. Utilisez des commentaires pour expliquer l'architecture JavaScript que nous allons suivre.
```

## Phase 2: Gestion des Données et Persistence

### Prompt 4: Modèle de données et fonctions de stockage de base

```
Implémentons le modèle de données et les fonctions de stockage local pour notre application. Veuillez créer:

1. Un module storage.js avec:
   - Constantes pour les clés de stockage (catégories, sessions, statistiques)
   - Fonction de test de disponibilité du localStorage
   - Fonctions CRUD de base pour les catégories (get, save, findById)
   - Fonctions pour formater les clés de date

2. Des structures JSON pour:
   - Une catégorie (id, nom, couleur)
   - Une session (id, catégorie, début, fin, durée, distractions)
   - Des statistiques de base (temps total, temps par catégorie)

3. Tests unitaires pour ces fonctions:
   - Test de création et récupération d'une catégorie
   - Test de persistence entre les rechargements
   - Test de gestion des erreurs (stockage plein/indisponible)

Assurez-vous que les fonctions manipulent correctement JSON pour le stockage/récupération et qu'elles gèrent les cas où aucune donnée n'existe encore.
```

### Prompt 5: Interface de gestion des catégories

```
Implémentons l'interface utilisateur pour gérer les catégories dans notre application. Veuillez créer:

1. Un module categories.js avec:
   - Fonction pour créer une nouvelle catégorie
   - Fonction pour afficher la liste des catégories
   - Fonction pour sélectionner une catégorie existante

2. Mise à jour du HTML de la page timer pour ajouter:
   - Un formulaire de création de catégorie (nom et sélecteur de couleur)
   - Une liste pour afficher les catégories existantes
   - Styles CSS associés

3. Tests pour ces fonctionnalités:
   - Test de création d'une nouvelle catégorie
   - Test d'affichage correct des catégories existantes
   - Test de sélection d'une catégorie

Assurez-vous que l'interface est conviviale et que les catégories sont représentées visuellement avec leur couleur. Intégrez la validation des entrées pour éviter les catégories en double ou invalides.
```

## Phase 3: Fonctionnalité Timer

### Prompt 6: Implémentation du timer de base

```
Implémentons maintenant le timer Pomodoro flexible pour notre application. Veuillez créer:

1. Un module timer.js avec:
   - Une classe TaskTimer pour gérer l'état et le comportement du timer
   - Méthodes pour démarrer, mettre en pause et réinitialiser le timer
   - Logique de compte à rebours avec format mm:ss
   - Événements pour la fin du timer

2. Mise à jour du HTML pour ajouter:
   - Affichage numérique du timer
   - Contrôles (démarrer, réinitialiser)
   - Sélecteur de durée (jusqu'à 120 minutes)
   - Champ pour la description de la tâche

3. Tests pour ces fonctionnalités:
   - Test du démarrage et du compte à rebours
   - Test de la réinitialisation
   - Test de la fin du timer

Utilisez un design clair pour l'affichage du timer et assurez-vous que le compte à rebours est précis. Le timer doit fonctionner même si l'utilisateur passe à l'autre page.
```

### Prompt 7: Fonctionnalité de suivi des distractions

```
Ajoutons maintenant la fonctionnalité de suivi des distractions au timer. Veuillez modifier le code existant pour:

1. Mettre à jour le module timer.js avec:
   - Méthode pour marquer/terminer une distraction
   - Suivi du temps effectif vs temps total
   - Stockage des périodes de distraction

2. Modifier l'interface utilisateur pour ajouter:
   - Un bouton "Distraction" qui change d'état visuellement quand activé
   - Indicateurs visuels de l'état actuel (travail/distraction)
   - Compteur du temps de distraction cumulé

3. Tests pour ces fonctionnalités:
   - Test du marquage d'une distraction
   - Test du calcul correct du temps de distraction
   - Test de la représentation visuelle des états

Assurez-vous que la transition entre les états est claire pour l'utilisateur et que les distractions sont correctement enregistrées pour l'analyse ultérieure.
```

### Prompt 8: Finalisation et sauvegarde des sessions

```
Finalisons le timer en implémentant l'enregistrement des sessions terminées. Veuillez améliorer le code existant pour:

1. Mettre à jour le module timer.js avec:
   - Méthode pour terminer une session et l'enregistrer
   - Organisation des données de session à sauvegarder
   - Notification de fin de session

2. Créer un module sessions.js avec:
   - Fonctions pour sauvegarder une session complétée
   - Calcul des statistiques de base (temps effectif, pourcentage de distraction)
   - Préparation des données pour la visualisation

3. Tests pour ces fonctionnalités:
   - Test de l'enregistrement correct d'une session complète
   - Test de la gestion des données de session entre les pages
   - Test des scénarios d'erreur (interruption, données invalides)

Assurez-vous que la transition entre la fin d'une session et le début d'une nouvelle est fluide et que les données sont correctement sauvegardées.
```

## Phase 4: Visualisation des Données

### Prompt 9: Structure de base du graphique circulaire

```
Implémentons la base du graphique circulaire pour visualiser les activités. Veuillez créer:

1. Un module chart.js avec:
   - Fonction pour initialiser le graphique SVG
   - Création des cercles concentriques et des marqueurs d'heures
   - Échelle pour convertir les heures en angles
   - Préparation pour l'ajout de segments

2. Mise à jour de la page visualization.html:
   - Conteneur SVG pour le graphique
   - Légende explicative
   - Contrôles de base (zoom, réinitialisation)

3. Tests pour ces fonctionnalités:
   - Test du rendu correct du graphique vide
   - Test de la conversion heures/angles
   - Test du placement des marqueurs d'heures

Utilisez une approche modulaire qui facilitera l'ajout des segments de session plus tard. Le graphique doit ressembler à une horloge 24h avec des marqueurs clairs.
```

### Prompt 10: Affichage des sessions dans le graphique

```
Ajoutons maintenant les sessions enregistrées au graphique circulaire. Veuillez améliorer le code existant pour:

1. Mettre à jour le module chart.js avec:
   - Fonction pour charger les sessions du jour
   - Conversion des sessions en segments d'arc sur le graphique
   - Application des couleurs de catégorie aux segments
   - Affichage des étiquettes de durée sur les segments

2. Créer une fonction de rendu qui:
   - Nettoie le graphique existant
   - Dessine tous les segments de session
   - Ajoute les informations de temps aux segments

3. Tests pour ces fonctionnalités:
   - Test du rendu correct des sessions
   - Test des conversions de temps en position graphique
   - Test de l'affichage avec plusieurs sessions

Assurez-vous que les segments sont clairement distinguables et que les informations de durée sont lisibles. Le graphique doit donner une vision claire de la répartition des activités dans la journée.
```

### Prompt 11: Représentation des distractions dans le graphique

```
Implémentons maintenant la représentation visuelle des distractions dans le graphique. Veuillez améliorer le code existant pour:

1. Mettre à jour le module chart.js avec:
   - Création de motifs hachurés pour représenter les distractions
   - Fonction pour convertir les périodes de distraction en segments visuels
   - Application de ces motifs aux segments appropriés

2. Améliorer la légende du graphique pour:
   - Expliquer la signification des motifs hachurés
   - Montrer un exemple visuel de segment avec/sans distraction
   - Indiquer le temps total vs temps effectif

3. Tests pour ces fonctionnalités:
   - Test du rendu correct des segments avec distractions
   - Test de la distinction visuelle entre travail effectif et distractions
   - Test avec différents pourcentages de distraction

Assurez-vous que les distractions sont clairement visibles sans surcharger visuellement le graphique. L'utilisateur doit pouvoir identifier facilement les périodes de forte distraction.
```

## Phase 5: Statistiques et Finalisation

### Prompt 12: Calcul et affichage des statistiques

```
Implémentons le calcul et l'affichage des statistiques par catégorie. Veuillez créer:

1. Un module stats.js avec:
   - Fonction pour calculer les statistiques à partir des sessions
   - Calcul du temps total par catégorie
   - Calcul des pourcentages et du temps de distraction

2. Mise à jour de la page visualization.html pour:
   - Créer une section d'affichage des statistiques
   - Afficher le temps total par catégorie
   - Montrer le pourcentage de temps par catégorie
   - Indiquer le temps de distraction par catégorie

3. Tests pour ces fonctionnalités:
   - Test du calcul correct des statistiques
   - Test de l'affichage avec plusieurs catégories
   - Test de la précision des pourcentages

Utilisez une représentation visuelle claire avec les couleurs de catégorie. Les statistiques doivent être faciles à interpréter et donner une vue d'ensemble rapide de la productivité.
```

### Prompt 13: Intégration complète et synchronisation

```
Finalisons l'intégration entre les différentes parties de l'application. Veuillez améliorer le code existant pour:

1. Créer un système d'événements qui:
   - Notifie la visualisation quand une nouvelle session est ajoutée
   - Met à jour les statistiques automatiquement
   - Synchronise l'état entre les pages

2. Améliorer la navigation pour:
   - Conserver l'état du timer lors du changement de page
   - Permettre un retour facile à la session en cours
   - Afficher une notification si un timer est actif

3. Réaliser des tests d'intégration pour:
   - Le workflow complet (création de catégorie → timer → visualisation)
   - La cohérence des données entre les pages
   - La gestion des situations exceptionnelles

Assurez-vous que l'expérience utilisateur est fluide lors des transitions entre les fonctionnalités et que les données restent cohérentes.
```

### Prompt 14: Optimisations, gestion d'erreurs et finitions

```
Finalisons l'application avec des optimisations, une meilleure gestion d'erreurs et des finitions UI. Veuillez améliorer le code existant pour:

1. Optimiser les performances:
   - Minimiser les manipulations DOM
   - Optimiser les opérations de rendu du graphique
   - Améliorer la gestion des données pour réduire les accès au localStorage

2. Améliorer la gestion des erreurs:
   - Ajouter un système de notification pour les erreurs
   - Gérer les cas de stockage plein ou corrompu
   - Ajouter des validations supplémentaires pour les entrées utilisateur

3. Finaliser l'interface utilisateur:
   - Ajouter des animations subtiles pour les transitions
   - Améliorer les indicateurs visuels d'état
   - Optimiser l'interface pour différentes tailles d'écran

4. Tests finaux:
   - Tests de performance
   - Tests d'accessibilité de base
   - Vérification de compatibilité avec les navigateurs principaux

Concentrez-vous sur une expérience utilisateur fluide et sur la robustesse de l'application dans différentes conditions d'utilisation.
```

## Résumé des Prompts

Ces 14 prompts guident l'implémentation progressive de l'application de productivité, en suivant une approche de développement basée sur les tests. Chaque prompt s'appuie sur les précédents pour construire l'application étape par étape, avec des tests appropriés à chaque niveau pour assurer la qualité et la fiabilité du code.

La décomposition a été faite de manière à maintenir un équilibre entre des étapes suffisamment petites pour être testées efficacement, tout en assurant un progrès continu et visible. Chaque prompt aboutit à un ensemble cohérent de fonctionnalités qui peut être testé de manière autonome, tout en s'intégrant harmonieusement avec les composants précédemment développés.
