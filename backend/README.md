# Backend - Érosion des Âmes

API Backend pour le jeu "Érosion des Âmes - Alpha".

## Prérequis

- Node.js 22.17.0
- MySQL
- npm

## Installation

```bash
npm install
```

## Configuration

1. Copier le fichier d'exemple des variables d'environnement:
```bash
cp .env.example .env
```

2. Éditer `.env` avec vos informations:
```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=erosion_des_ames
DB_USER=root
DB_PASSWORD=votre_mot_de_passe

JWT_SECRET=votre_secret_jwt_ici
CORS_ORIGIN=http://localhost:5173
```

## Base de Données

### Créer la base de données

```bash
mysql -u root -p
CREATE DATABASE erosion_des_ames;
EXIT;
```

### Exécuter les migrations

```bash
npm run db:migrate
```

### Insérer les données de test (optionnel)

```bash
npm run db:seed
```

Les utilisateurs de test sont:
- **admin** / admin@erosion-des-ames.com / password123
- **testuser** / test@example.com / password456
- **player1** / player1@example.com / password789

### Tester la connexion

```bash
npm run db:test
```

## Démarrage

### Mode développement (avec nodemon)

```bash
npm run dev
```

### Mode production

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

## Scripts NPM

- `npm start` - Démarrer le serveur en production
- `npm run dev` - Démarrer le serveur en mode développement avec hot reload
- `npm run db:migrate` - Exécuter les migrations
- `npm run db:migrate:undo` - Annuler la dernière migration
- `npm run db:migrate:undo:all` - Annuler toutes les migrations
- `npm run db:seed` - Exécuter les seeders
- `npm run db:seed:undo` - Annuler les seeders
- `npm run db:reset` - Reset complet de la DB (undo + migrate + seed)
- `npm run db:test` - Tester la connexion à la base de données

## Endpoints API

### Santé
- `GET /api/health` - Vérifier l'état de l'API

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur (protégé)

## Structure des Dossiers

```
backend/
├── migrations/           # Migrations Sequelize
├── seeders/             # Seeders de données de test
├── src/
│   ├── config/          # Configuration (DB, etc.)
│   ├── controllers/     # Contrôleurs
│   ├── middlewares/     # Middlewares Express
│   ├── models/          # Modèles Sequelize
│   ├── routes/          # Routes API
│   ├── scripts/         # Scripts utilitaires
│   ├── services/        # Services métier
│   ├── utils/           # Utilitaires
│   └── server.js        # Point d'entrée
├── .env.example         # Template des variables d'environnement
├── .sequelizerc         # Configuration Sequelize CLI
└── package.json
```

## Documentation

Voir [../docs/architecture/database.md](../docs/architecture/database.md) pour plus d'informations sur la base de données.
