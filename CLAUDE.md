# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Erosion des Ames** is a multi-module web application with forum, game, and portal features.

## Tech Stack

### Frontend
- **Vite** + **React** avec React Router
- **TailwindCSS v3** (pas v4 - incompatibilité avec React récent)

### Backend
- **Node.js** avec Express
- **Sequelize** ORM
- **MySQL** base de données

## Architecture

Architecture modulaire avec séparation backend/frontend :

- **backend/** - Services backend (core, forum, game, portal)
- **frontend/** - Applications frontend (core, forum, game, portal)
- **docs/** - Documentation technique et utilisateur

Chaque feature (forum, game, portal) a son propre module backend et frontend, avec le code partagé dans les modules `core`.

## Commandes de développement

### Depuis la racine (recommandé)
```bash
npm run dev           # Lance backend + frontend en parallèle
npm run dev:backend   # Lance uniquement le backend
npm run dev:frontend  # Lance uniquement le frontend
npm run build         # Build de production du frontend
npm run lint          # Lint backend + frontend
npm run lint:fix      # Fix lint backend + frontend
npm run format        # Format backend + frontend
npm run test          # Tests backend
npm run db:test       # Tester la connexion MySQL
```

### Backend (depuis `backend/`)
```bash
npm run dev       # Démarrer en mode développement (nodemon)
npm start         # Démarrer en production
npm test          # Lancer les tests (Jest)
npm run lint      # Vérifier le code avec ESLint
npm run lint:fix  # Corriger automatiquement les erreurs ESLint
npm run format    # Formater le code avec Prettier
```

### Frontend (depuis `frontend/`)
```bash
npm run dev       # Serveur de développement (port 5173)
npm run build     # Build de production
npm run preview   # Preview du build
npm run lint      # Vérifier le code avec ESLint
npm run lint:fix  # Corriger automatiquement les erreurs ESLint
npm run format    # Formater le code avec Prettier
```

### Base de données (depuis `backend/`)
```bash
npm run db:test                      # Tester la connexion à MySQL
npx sequelize-cli db:migrate         # Exécuter les migrations
npx sequelize-cli db:migrate:undo    # Annuler la dernière migration
npx sequelize-cli migration:generate --name nom-migration  # Créer une migration
```

## Documentation & Mémoire

### Architecture (à consulter pour les décisions techniques)
- Backend : `@docs/technical/backend/BACK_ARCHITECTURE.md`
- Frontend : `@docs/technical/frontend/FRONT_ARCHITECTURE.md`
- Vue d'ensemble docs : `@docs/technical/DOCS_ARCHITECTURE.md`

### Documentation technique
Le répertoire `docs/` contient la documentation modulaire complète. Consulter les fichiers pertinents selon le contexte de travail.

### Suivi de progression
- `PROGRESS.md` - État d'avancement du projet
- `BRANCH_PROGRESS.md` - Progression de la branche courante

## Code Style

- Conventions standard JavaScript/TypeScript
- ESLint + Prettier pour le formatage
- Composants React fonctionnels avec hooks
- Nommage : camelCase (variables/fonctions), PascalCase (composants/classes)

## Agents Spécialisés

Des agents spécialisés sont disponibles dans `.claude/agents/` :
- `backend.md` - Développement backend Node.js/Sequelize
- `frontend.md` - Développement frontend React/Vite/Tailwind
- `game-design.md` - Conception et logique de jeu
- `documentation.md` - Rédaction de documentation
- `tests.md` - Tests et assurance qualité
- `security.md` - Audit et sécurité
- `database.md` - Modélisation et requêtes SQL
