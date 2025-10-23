# Avancement Général du Projet - Érosion des Âmes

## Statut Global
**Phase**: Développement Interface Portail
**Version**: Alpha 0.2.0
**Dernière mise à jour**: 2025-10-23

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
**Statut**: En cours
**Date début**: 2025-10-23
**Branche**: feature/portail-interface

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
- [x] Page Règlement avec bannière
- [ ] Compléter les sections de la page Univers (Factions et clans, Survivre, Bestiaire)
- [ ] Définir le contenu de la page Règlement
- [ ] Section Features à revoir

### Phase 5: Fonctionnalités Core du Jeu
**Statut**: À venir

### Phase 6: Tests et Optimisation
**Statut**: À venir

### Phase 7: Déploiement Alpha
**Statut**: À venir

---

## Branches Principales

### main
**Commits**: 7
**Dernier commit**: Merge branch 'fix/sequelize-operator-syntax' into main
**Description**: Branche de production stable

### feature/portail-interface (en cours)
**Commits**: 8
**Dernier commit**: refactor(frontend): réduction taille image campFire
**Description**: Développement de l'interface du portail avec thème post-apocalyptique
**Statut**: Prête pour push GitHub et merge vers main

### Branches de fonctionnalités (mergées)
- **feature/auth-system**: Système d'authentification (✓ mergé vers main)
- **setup/database-config**: Configuration de la base de données (✓ mergé vers main)
- **fix/tailwindcss-v3**: Correction compatibilité TailwindCSS v3 avec React 18 (✓ mergé vers main)
- **fix/sequelize-operator-syntax**: Correction syntaxe Sequelize v6 pour opérateur OR (✓ mergé vers main)

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

---

## Métriques du Projet

### Code
- **Lignes de code backend**: ~800 lignes
- **Lignes de code frontend**: ~2500+ lignes
- **Composants React**: 13
- **Pages**: 5 (Login, Register, Portal, Intro, Univers, Règlement)
- **Fichiers**: 40+ fichiers de code
- **Couverture de tests**: 0% (tests à venir)

### Documentation
- **Fichiers de documentation**: 5 (README, TECHNICAL, DATABASE, PROJECT_PROGRESS, BRANCH_PROGRESS)
- **Complétude**: 60% (documentation technique à jour, docs utilisateur à venir)

### Commits & Branches
- **Total commits**: 15 (7 sur main + 8 sur feature/portail-interface)
- **Branches actives**: 1 (feature/portail-interface)
- **Branches mergées**: 4

---

## Problèmes Connus

Aucun pour le moment. Les problèmes suivants ont été résolus:
- ✓ Erreur PostCSS avec TailwindCSS v4 (résolu avec downgrade vers v3)
- ✓ Erreur 500 lors de l'inscription (résolu avec syntaxe Sequelize v6)

---

## Prochaines Étapes

### Court terme (branche feature/portail-interface)
1. Compléter la section "Les factions et ses clans" de la page Univers
2. Compléter la section "Survivre dans ce monde cruel" de la page Univers
3. Compléter la section "Le bestiaire" de la page Univers
4. Définir et implémenter le contenu de la page Règlement
5. Push vers GitHub et merge vers main

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

**Dernière mise à jour**: 2025-10-23
