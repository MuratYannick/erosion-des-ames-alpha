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

## Documentation & Mémoire

### Architecture (à consulter pour les décisions techniques)
- Backend : `@docs/technical/backend/BACK_ARCHITECTURE.md`
- Frontend : `@docs/technical/frontend/FRONT_ARCHITECTURE.md`
- Vue d'ensemble docs : `@docs/technical/DOCS_ARCHITECTURE.md`

### Documentation technique
Le répertoire `docs/` contient la documentation modulaire complète. Consulter les fichiers pertinents selon le contexte de travail.

### Suivi de progression
- `PROGRESS.md` - État d'avancement du projet

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
