# Érosion des Âmes - Alpha

Projet de refonte complète du jeu "Érosion des Âmes".

## Technologies Utilisées

### Frontend
- **Framework**: Vite + React
- **Styling**: TailwindCSS v3
- **Routing**: React Router
- **Tests**: Vitest + React Testing Library

### Backend
- **Runtime**: Node.js 22.17.0
- **Framework**: Express
- **ORM**: Sequelize

### Base de Données
- **SGBD**: MySQL

### Hébergement
- **Provider**: O2Switch

### Versioning
- **Git**: GitHub

## Structure du Projet

```
erosion-des-ames-alpha/
├── frontend/          # Application React
├── backend/           # API Express
├── docs/              # Documentation technique
└── README.md          # Ce fichier
```

## Installation

### Prérequis
- Node.js 22.17.0
- MySQL
- Git

### Frontend
```bash
cd frontend
npm install
npm run dev      # Démarrer le serveur de développement
npm test         # Lancer les tests en mode watch
npm run test:run # Lancer les tests une fois
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Documentation

### Documentation Générale
- [Documentation Technique](docs/TECHNICAL.md)
- [Documentation Base de Données](docs/DATABASE.md)
- [Avancement Général](docs/PROJECT_PROGRESS.md)
- [Avancement de la Branche](docs/BRANCH_PROGRESS.md)

### Gestion des Erreurs
- [Guide de Gestion des Erreurs](GUIDE_GESTION_ERREURS.md) - Utilisation et tests
- [Démonstration Visuelle](DEMO_ERREURS.html) - Ouvrir dans un navigateur

### Tests
- [Documentation Tests Frontend](frontend/TESTS.md) - Tests unitaires (43 tests)

## Workflow Git

- **Branche principale**: `main`
- **Branches de développement**: Créées pour chaque nouvelle fonctionnalité
- **Commits**: Messages descriptifs en français

## Contributeurs

Projet en développement alpha.

## Licence

À définir
