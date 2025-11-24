# Architecture Backend

Index de la documentation technique du backend Erosion des Ames.

---

## Stack Technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| Node.js | 18+ | Runtime JavaScript |
| Express.js | 4.x | Framework web |
| Sequelize | 6.x | ORM pour MySQL |
| MySQL | 8.x | Base de donnees |
| JWT | - | Authentification |
| bcrypt | - | Hash des mots de passe |
| express-validator | - | Validation des donnees |

---

## Structure des dossiers

```
backend/
├── src/
│   ├── core/                    # Module principal
│   │   ├── config/              # Configuration (DB, etc.)
│   │   ├── controllers/         # Controllers REST
│   │   │   └── auth.controller.js
│   │   ├── middlewares/         # Middlewares Express
│   │   │   ├── auth.middleware.js
│   │   │   └── validation.middleware.js
│   │   ├── migrations/          # Migrations Sequelize
│   │   │   ├── 20250123000001-create-users-table.js
│   │   │   └── 20250124000001-add-email-verification-fields.js
│   │   ├── models/              # Modeles Sequelize
│   │   │   ├── index.js
│   │   │   └── User.js
│   │   ├── routes/              # Definition des routes
│   │   │   ├── auth.routes.js
│   │   │   └── index.js
│   │   ├── services/            # Logique metier
│   │   │   ├── auth.service.js
│   │   │   └── email.service.js
│   │   ├── templates/           # Templates email HTML
│   │   │   ├── verifyEmail.js
│   │   │   └── resetPassword.js
│   │   ├── tests/               # Tests Jest
│   │   │   ├── setup.js
│   │   │   ├── validators.test.js
│   │   │   ├── auth.test.js
│   │   │   └── email-verification.test.js
│   │   ├── utils/               # Utilitaires
│   │   │   └── jwt.js
│   │   └── validators/          # Validateurs personnalises
│   │       └── userValidators.js
│   ├── forum/                   # Module forum (a venir)
│   ├── game/                    # Module jeu (a venir)
│   ├── portal/                  # Module portail (a venir)
│   └── index.js                 # Point d'entree
├── .env                         # Variables d'environnement
├── .env.example                 # Template des variables
├── package.json
└── jest.config.js               # Configuration Jest
```

---

## Modules

### Core

Module principal contenant l'authentification et les fonctionnalites partagees.

| Composant | Description | Documentation |
|-----------|-------------|---------------|
| Authentification | Systeme JWT avec tokens doubles | [auth.md](./auth.md) |
| Verification Email | Service d'envoi d'emails (verification, reset) | [auth.md](./auth.md#service-email) |
| Modeles | Definition des modeles Sequelize | [models.md](./models.md) |
| Middlewares | Middlewares Express (auth, validation, emailVerified) | [middlewares.md](./middlewares.md) |

### Forum (a venir)

Module de forum de discussion pour la communaute.

### Game (a venir)

Module de gestion des parties de jeu de role.

### Portal (a venir)

Module portail avec contenu statique et articles.

---

## Routes API

### Authentification

Base URL : `/api/v1/auth`

| Methode | Route | Description | Acces |
|---------|-------|-------------|-------|
| POST | /register | Inscription | Public |
| POST | /login | Connexion | Public |
| POST | /logout | Deconnexion | Prive |
| POST | /refresh-token | Rafraichir le token | Public |
| GET | /me | Profil utilisateur | Prive |

### Verification Email

| Methode | Route | Description | Acces |
|---------|-------|-------------|-------|
| POST | /send-verification-email | Renvoyer email de verification | Prive |
| GET | /verify-email/:token | Verifier email via token | Public |

### Reinitialisation Mot de Passe

| Methode | Route | Description | Acces |
|---------|-------|-------------|-------|
| POST | /forgot-password | Demander reset password | Public |
| POST | /reset-password/:token | Reset password avec token | Public |

> Documentation complete : [API Auth](../../api/auth.md)

---

## Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| NODE_ENV | Environnement | development |
| PORT | Port du serveur | 3000 |
| DB_HOST | Hote MySQL | localhost |
| DB_PORT | Port MySQL | 3306 |
| DB_NAME | Nom de la base | erosion_des_ames |
| DB_USER | Utilisateur MySQL | root |
| DB_PASSWORD | Mot de passe MySQL | password |
| JWT_SECRET | Secret pour les JWT | secret-key |
| JWT_EXPIRES_IN | Duree access token | 1d |
| JWT_REFRESH_EXPIRES_IN | Duree refresh token | 7d |
| SMTP_HOST | Serveur SMTP | smtp.example.com |
| SMTP_PORT | Port SMTP | 587 |
| SMTP_USER | Utilisateur SMTP | user@example.com |
| SMTP_PASS | Mot de passe SMTP | password |
| SMTP_FROM | Email expediteur | noreply@erosion-des-ames.com |
| EMAIL_VERIFY_URL | URL verification email | http://localhost:5173/verify-email |
| PASSWORD_RESET_URL | URL reset password | http://localhost:5173/reset-password |

---

## Tests

| Framework | Usage |
|-----------|-------|
| Jest | Tests unitaires et integration |
| Supertest | Tests API HTTP |
| SQLite | Base de donnees en memoire pour tests |

### Execution

```bash
# Lancer tous les tests
npm test

# Lancer avec couverture
npm run test:coverage
```

---

## Documentation detaillee

| Document | Contenu |
|----------|---------|
| [auth.md](./auth.md) | Systeme d'authentification complet (User, JWT, services) |
| [models.md](./models.md) | Modeles Sequelize et migrations |
| [middlewares.md](./middlewares.md) | Middlewares Express et validateurs |
| [API Auth](../../api/auth.md) | Documentation des endpoints API |
