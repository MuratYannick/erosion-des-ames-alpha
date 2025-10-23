# Avancement Général du Projet - Érosion des Âmes

## Statut Global
**Phase**: Développement Interface Portail
**Version**: Alpha 0.2.1
**Dernière mise à jour**: 2025-10-24

---

## Vue d'ensemble

Projet de refonte complète du jeu "Érosion des Âmes". Phase de développement alpha avec mise en place de l'architecture de base.

---

## Jalons (Milestones)

### Phase 1: Initialisation du Projet
**Statut**: Complété
**Date début**: 2025-10-22
**Date fin**: 2025-10-22

#### Tâches
- [x] Initialisation du dépôt Git
- [x] Configuration du .gitignore
- [x] Création de la structure de documentation
- [x] Configuration du frontend (Vite + React + TailwindCSS)
- [x] Configuration du backend (Node.js + Express + Sequelize)
- [x] Configuration de la base de données MySQL
- [x] Premier commit sur la branche main

### Phase 2: Système d'Authentification
**Statut**: Complété
**Date début**: 2025-10-22
**Date fin**: 2025-10-22

#### Tâches
- [x] Installation de bcrypt et jsonwebtoken
- [x] Création des utilitaires de hashage et JWT
- [x] Création du contrôleur d'authentification
- [x] Création des routes d'authentification backend
- [x] Création du middleware d'authentification
- [x] Création des pages frontend (Login, Register)
- [x] Création du service API frontend
- [x] Protection des routes frontend

### Phase 3: Configuration de la Base de Données
**Statut**: Complété
**Date début**: 2025-10-22
**Date fin**: 2025-10-23

#### Tâches
- [x] Installation de Sequelize CLI
- [x] Configuration des migrations
- [x] Création de la migration initiale pour la table users
- [x] Création des seeders de test
- [x] Test de connexion à la base de données
- [x] Scripts npm pour gérer les migrations et seeders
- [x] Test complet du système d'authentification
- [x] Correction syntaxe Sequelize v6 (Op.or) dans l'inscription

### Phase 4: Interface du Portail
**Statut**: Complété
**Date début**: 2025-10-23
**Date fin**: 2025-10-23
**Branche**: feature/portail-interface (✓ mergé vers main)

#### Tâches
- [x] Configuration du thème post-apocalyptique (TailwindCSS)
- [x] Intégration des polices Google Fonts (Metal Mania, Permanent Marker, Bangers, Creepster)
- [x] Création de l'architecture des composants Portal
- [x] Header fixe avec navigation principale
- [x] Sidebar coulissant pour navigation secondaire
- [x] Page Hero avec banner.png en background
- [x] Section Factions adaptée au JdR sur table
- [x] Page Intro avec bannière
- [x] Page Univers avec navigation par sections
- [x] Section "Mise en situation" complète avec texte et image interactive
- [x] Section "Factions et clans" complète (2 factions + 10 clans neutres)
- [x] Page Règlement avec bannière
- [x] Documentation complète

#### Notes
- Sections "Survivre" et "Bestiaire" reportées (en cours d'élaboration)
- Règlement détaillé sera sur le forum avec validation CGU
- Section Features à revoir ultérieurement

### Phase 5: Pages d'Erreurs Personnalisées
**Statut**: Complété
**Date début**: 2025-10-24
**Date fin**: 2025-10-24
**Branche**: feature/error-pages (✓ mergé vers main)

#### Tâches
- [x] Création du composant ErrorPage générique réutilisable
- [x] Intégration des images de fond (error4xx.png, error5xx.png, errorNetwork.png)
- [x] Création des 6 pages d'erreur (401, 403, 404, 500, 503, Network)
- [x] Configuration des routes d'erreur dans App.jsx
- [x] Création du gestionnaire d'erreurs global (errorHandler.js)
- [x] Intégration de la gestion d'erreurs dans api.js
- [x] Ajout de try/catch dans Login.jsx et Register.jsx
- [x] Correction orthographe: portalIlustrations → portalIllustrations
- [x] Mise à jour de tous les chemins d'images

#### Notes
- Codes couleurs thématiques: ochre (4xx), blood (5xx), neutral (network)
- Messages contextualisés style "Terres Désolées"
- Séparation des erreurs majeures (5xx, network) et erreurs de validation (4xx)
- Route catch-all (*) pour rediriger vers 404

### Phase 6: Fonctionnalités Core du Jeu
**Statut**: À venir

### Phase 7: Tests et Optimisation
**Statut**: À venir

### Phase 8: Déploiement Alpha
**Statut**: À venir

---

## Branches Principales

### main
**Commits**: 26 (21 précédents + 4 de feature/error-pages + 1 merge)
**Dernier commit**: Merge branch 'feature/error-pages' into main
**Description**: Branche de production stable

### Branches de fonctionnalités (mergées)
- **feature/auth-system**: Système d'authentification (✓ mergé vers main)
- **setup/database-config**: Configuration de la base de données (✓ mergé vers main)
- **fix/tailwindcss-v3**: Correction compatibilité TailwindCSS v3 avec React 18 (✓ mergé vers main)
- **fix/sequelize-operator-syntax**: Correction syntaxe Sequelize v6 pour opérateur OR (✓ mergé vers main)
- **feature/portail-interface**: Interface complète du portail (✓ mergé vers main le 2025-10-23)
- **feature/error-pages**: Pages d'erreurs personnalisées (✓ mergé vers main le 2025-10-24)

---

## Décisions Techniques

### 2025-10-22: Stack Technique
- **Frontend**: Vite + React + TailwindCSS v3 + React Router
- **Backend**: Node.js 22.17.0 + Express + Sequelize
- **Base de données**: MySQL
- **Hébergement**: O2Switch
- **Versioning**: GitHub

### 2025-10-22: Structure de Documentation
- README.md: Vue d'ensemble du projet
- TECHNICAL.md: Documentation technique détaillée
- DATABASE.md: Documentation de la base de données
- PROJECT_PROGRESS.md: Avancement général
- BRANCH_PROGRESS.md: Avancement de la branche courante

### 2025-10-22: Système d'Authentification
- Authentification JWT avec expiration de 24h
- Hashage bcrypt des mots de passe (SALT_ROUNDS = 10)
- Middleware de protection des routes
- Pages frontend Login et Register
- Gestion des sessions avec localStorage

### 2025-10-22: Configuration Base de Données
- Sequelize CLI configuré avec migrations et seeders
- Migration pour la table users avec index
- 3 utilisateurs de test (admin, testuser, player1)
- Scripts npm pour gérer la base de données
- Script de test de connexion
- Système d'authentification testé et fonctionnel

### 2025-10-23: Corrections et Optimisations
- Correction compatibilité TailwindCSS: downgrade de v4 vers v3 pour React 18
- Correction syntaxe Sequelize v6: remplacement de $or par Op.or
- Système d'inscription entièrement fonctionnel
- Tests validés pour login et register

### 2025-10-23: Interface du Portail (feature/portail-interface)
- **Thème post-apocalyptique**: Palette complète (city, ochre, nature, mutant, pure, blood, neutral)
- **Polices personnalisées**: Metal Mania (titre jeu), Permanent Marker (alternative), Bangers, Creepster
- **Architecture composants**: Layout modulaire avec Header, Sidebar, Footer, Sections
- **Navigation améliorée**: Header fixe + Sidebar coulissant avec bouton de fermeture
- **Pages créées**: Portal (Hero + About + Factions + Features), Intro, Univers, Règlement
- **JdR sur table**: Adaptation complète du lore (suppression pouvoirs surnaturels, mutations légères)
- **Visuels**: Bannière banner.png, image campFire.png avec filtre sepia interactif
- **Navigation par sections**: Page Univers avec 4 sections (Mise en situation complète + 3 placeholders)

### 2025-10-24: Pages d'Erreurs Personnalisées (feature/error-pages)
- **Composant générique ErrorPage**: Props pour code, titre, message, type, boutons
- **6 pages d'erreur**: 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error), 503 (Service Unavailable), Network Error
- **Images de fond**: error4xx.png, error5xx.png, errorNetwork.png avec overlay 60% pour meilleure lisibilité
- **Codes couleurs**: ochre (erreurs client 4xx), blood (erreurs serveur 5xx), neutral (erreurs réseau)
- **Gestionnaire global**: errorHandler.js avec fonction handleError() pour redirection automatique
- **Intégration API**: Modification de api.js pour inclure HTTP status dans les erreurs
- **Try/catch**: Ajout gestion erreurs dans Login.jsx et Register.jsx avec séparation erreurs majeures/validation
- **Correction orthographe**: portalIlustrations → portalIllustrations + mise à jour chemins

---

## Métriques du Projet

### Code
- **Lignes de code backend**: ~800 lignes
- **Lignes de code frontend**: ~2750+ lignes
- **Composants React**: 14
- **Pages**: 11 (Login, Register, Portal, Intro, Univers, Règlement + 6 pages d'erreur)
- **Fichiers**: 48+ fichiers de code
- **Couverture de tests**: 0% (tests à venir)

### Documentation
- **Fichiers de documentation**: 5 (README, TECHNICAL, DATABASE, PROJECT_PROGRESS, BRANCH_PROGRESS)
- **Complétude**: 60% (documentation technique à jour, docs utilisateur à venir)

### Commits & Branches
- **Total commits sur main**: 26
- **Branches actives**: 0
- **Branches mergées**: 6 (auth-system, database-config, tailwindcss-v3, sequelize-operator-syntax, portail-interface, error-pages)

---

## Problèmes Connus

Aucun pour le moment. Les problèmes suivants ont été résolus:
- ✓ Erreur PostCSS avec TailwindCSS v4 (résolu avec downgrade vers v3)
- ✓ Erreur 500 lors de l'inscription (résolu avec syntaxe Sequelize v6)

---

## Prochaines Étapes

### Court terme
1. Compléter la section "Survivre dans ce monde cruel" de la page Univers
2. Compléter la section "Le bestiaire" de la page Univers
3. Étendre la gestion d'erreurs à tous les appels API du projet

### Moyen terme (prochaines branches)
1. Développer l'interface du Forum
2. Développer l'interface du Jeu
3. Créer le système de personnages (modèles, création, gestion)
4. Définir le schéma complet de la base de données (personnages, items, clans, etc.)
5. Implémenter les fonctionnalités de jeu de rôle

### Long terme
1. Système de messagerie entre joueurs
2. Système de campagnes et sessions de jeu
3. Tests et optimisation
4. Déploiement Alpha sur O2Switch

---

## Contributeurs

- Projet personnel en développement

---

## Notes

Ce document est mis à jour uniquement lors des merges vers la branche `main`. Pour suivre l'avancement des branches de développement, consulter [BRANCH_PROGRESS.md](BRANCH_PROGRESS.md).

---

**Dernière mise à jour**: 2025-10-24
