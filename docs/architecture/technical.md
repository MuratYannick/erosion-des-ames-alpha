# Documentation Technique - Érosion des Âmes

## Vue d'ensemble

Ce document décrit l'architecture technique complète du projet "Érosion des Âmes - Alpha".

---

## Architecture Globale

Le projet suit une architecture client-serveur avec une séparation claire entre le frontend et le backend.

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   Frontend      │ ◄─────► │    Backend      │ ◄─────► │     MySQL       │
│  (React/Vite)   │  HTTP   │   (Express)     │         │   (Database)    │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

---

## Frontend

### Stack Technique
- **Vite**: Build tool et dev server
- **React**: Bibliothèque UI
- **TailwindCSS v3**: Framework CSS utility-first
- **React Router**: Gestion de la navigation

### Structure des Dossiers
```
frontend/
├── src/
│   ├── components/      # Composants React réutilisables
│   ├── pages/           # Pages/vues de l'application
│   ├── hooks/           # Custom React hooks
│   ├── services/        # Services API et logique métier
│   ├── utils/           # Fonctions utilitaires
│   ├── assets/          # Images, fonts, etc.
│   ├── styles/          # Fichiers CSS globaux
│   ├── App.jsx          # Composant racine
│   └── main.jsx         # Point d'entrée
├── public/              # Fichiers statiques
├── index.html           # Template HTML
├── vite.config.js       # Configuration Vite
├── tailwind.config.js   # Configuration TailwindCSS
└── package.json
```

### Configuration Vite
- Port de développement: 5173 (par défaut)
- Hot Module Replacement (HMR) activé
- Optimisation des assets en production

### Configuration TailwindCSS
- Mode JIT (Just-In-Time) activé
- Configuration responsive
- Thème personnalisé (à définir selon les besoins du jeu)

---

## Backend

### Stack Technique
- **Node.js 22.17.0**: Runtime JavaScript
- **Express**: Framework web minimaliste
- **Sequelize**: ORM pour MySQL
- **dotenv**: Gestion des variables d'environnement

### Structure des Dossiers
```
backend/
├── src/
│   ├── config/          # Configuration (DB, etc.)
│   ├── models/          # Modèles Sequelize
│   ├── controllers/     # Contrôleurs (logique métier)
│   ├── routes/          # Définition des routes API
│   ├── middlewares/     # Middlewares Express
│   ├── services/        # Services métier
│   ├── utils/           # Fonctions utilitaires
│   └── server.js        # Point d'entrée du serveur
├── .env.example         # Template des variables d'environnement
└── package.json
```

### API REST
- Format de réponse: JSON
- Gestion des erreurs centralisée
- Validation des données entrantes
- CORS configuré pour le frontend

### Middlewares Principaux
- **express.json()**: Parser JSON
- **cors**: Gestion CORS
- **morgan**: Logger HTTP (développement)
- **helmet**: Sécurité HTTP headers (production)

---

## Base de Données

### MySQL avec Sequelize
- **Version MySQL**: Compatible avec O2Switch
- **ORM**: Sequelize pour la gestion des modèles
- **Migrations**: Gestion du schéma de base de données
- **Seeders**: Données de test/initialisation

Voir [database.md](database.md) pour le schéma détaillé.

---

## Déploiement

### Environnement de Production (O2Switch)

#### Backend
- Node.js 22.17.0
- Variables d'environnement configurées via .env
- PM2 ou équivalent pour la gestion du processus

#### Frontend
- Build de production: `npm run build`
- Fichiers statiques servis via serveur web

#### Base de Données
- MySQL hébergé sur O2Switch
- Sauvegardes régulières recommandées

---

## Sécurité

### Pratiques Implémentées
- Validation des entrées utilisateur
- Protection CSRF (à implémenter)
- Gestion sécurisée des sessions (à implémenter)
- HTTPS en production
- Variables sensibles dans .env (non versionnées)

---

## Performance

### Frontend
- Code splitting avec React Router
- Lazy loading des composants
- Optimisation des images
- Minification et compression en production

### Backend
- Connexion pooling pour MySQL
- Cache des requêtes fréquentes (à implémenter)
- Compression gzip des réponses

---

## Tests

### Frontend
- Framework: Vitest (recommandé avec Vite)
- Tests unitaires des composants
- Tests d'intégration

### Backend
- Framework: Jest ou Mocha
- Tests unitaires des services
- Tests d'intégration des routes API

---

## Workflow de Développement

### Branches
- `main`: Branche de production
- `feature/*`: Branches de fonctionnalités
- `fix/*`: Branches de corrections

### Commits
- Messages en français
- Descriptifs et concis
- Convention: type(scope): description

### Documentation
- Mise à jour de `docs/progress/branch-progress.md` pour chaque commit sur branche
- Mise à jour complète de toutes les docs lors du merge vers `main`

---

## Variables d'Environnement

### Backend (.env)
```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=erosion_des_ames
DB_USER=root
DB_PASSWORD=

JWT_SECRET=
```

---

## Scripts NPM

### Frontend
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint src"
}
```

### Backend
```json
{
  "dev": "nodemon src/server.js",
  "start": "node src/server.js",
  "migrate": "sequelize-cli db:migrate",
  "seed": "sequelize-cli db:seed:all"
}
```

---

## Ressources et Références

- [Documentation Vite](https://vitejs.dev/)
- [Documentation React](https://react.dev/)
- [Documentation TailwindCSS](https://tailwindcss.com/)
- [Documentation Express](https://expressjs.com/)
- [Documentation Sequelize](https://sequelize.org/)

---

**Dernière mise à jour**: 2025-10-22
