# Architecture de la Documentation

Index general de la documentation technique du projet Erosion des Ames.

---

## Structure de la documentation

```
docs/
├── technical/                       # Documentation technique
│   ├── DOCS_ARCHITECTURE.md         # Ce fichier (index general)
│   ├── backend/                     # Documentation backend
│   │   ├── BACK_ARCHITECTURE.md     # Index backend
│   │   ├── auth.md                  # Systeme d'authentification
│   │   ├── models.md                # Modeles Sequelize
│   │   └── middlewares.md           # Middlewares Express
│   └── frontend/                    # Documentation frontend
│       ├── FRONT_ARCHITECTURE.md    # Index frontend
│       ├── components.md            # Composants UI et Layout
│       └── portal.md                # Module Portal
└── api/                             # Documentation API
    └── auth.md                      # API d'authentification
```

---

## Documentation Backend

| Document | Description |
|----------|-------------|
| [BACK_ARCHITECTURE.md](./backend/BACK_ARCHITECTURE.md) | Index de l'architecture backend |
| [auth.md](./backend/auth.md) | Systeme d'authentification (User, JWT, services) |
| [models.md](./backend/models.md) | Modeles Sequelize et migrations |
| [middlewares.md](./backend/middlewares.md) | Middlewares Express et validateurs |

### Contenu de la documentation backend

#### BACK_ARCHITECTURE.md (Index)
- Stack technique
- Arborescence du projet
- Resume des modules
- Routes API (resume)
- Variables d'environnement
- Configuration des tests

#### auth.md
- Vue d'ensemble du systeme d'authentification
- Modele User (champs, hooks, options)
- Utilitaires JWT
- Service d'authentification
- Controller et routes
- Validateurs
- Securite
- Tests

#### models.md
- Configuration Sequelize
- Schema du modele User
- Roles utilisateur
- Hooks bcrypt
- Migrations
- Soft delete
- Modeles a venir (forum, game, portal)

#### middlewares.md
- Middleware authenticate
- Middleware authorize
- Middleware de validation
- Validations d'authentification
- Validateurs personnalises
- Ordre des middlewares
- Tests

---

## Documentation Frontend

| Document | Description |
|----------|-------------|
| [FRONT_ARCHITECTURE.md](./frontend/FRONT_ARCHITECTURE.md) | Index de l'architecture frontend |
| [components.md](./frontend/components.md) | Documentation des composants UI et Layout |
| [portal.md](./frontend/portal.md) | Documentation du module Portal |

### Contenu de la documentation frontend

#### FRONT_ARCHITECTURE.md (Index)
- Stack technique
- Arborescence du projet
- Modules (Core, Portal, Forum, Game)
- Composants partages (UI, Layout)
- Systeme de theme TailwindCSS
- Routage
- Services API
- Conventions

#### components.md
- Composant Button (props, variants, tailles, exemples)
- Composant Card (props, structure, exemples)
- Composants Layout (Layout, Header, Footer)
- Imports et bonnes pratiques

#### portal.md
- Vue d'ensemble du module
- Page Home (sections, features, CTA)
- Page About (timeline, technologies)
- Design et responsive
- Integration avec Core

---

## Documentation API

| Document | Description |
|----------|-------------|
| [auth.md](../api/auth.md) | Documentation complete de l'API d'authentification |

### Contenu de la documentation API

#### auth.md
- Base URL
- Endpoints (register, login, logout, refresh-token, me)
- Exemples de requetes et reponses
- Authentification (headers, tokens)
- Roles utilisateur
- Codes d'erreur HTTP
- Format des reponses

---

## Stack technique

### Backend

| Technologie | Version | Usage |
|-------------|---------|-------|
| Node.js | 18+ | Runtime JavaScript |
| Express.js | 4.x | Framework web |
| Sequelize | 6.x | ORM pour MySQL |
| MySQL | 8.x | Base de donnees |
| JWT | - | Authentification |
| bcrypt | - | Hash des mots de passe |
| express-validator | - | Validation des donnees |
| Jest | - | Tests unitaires |

### Frontend

| Technologie | Version | Usage |
|-------------|---------|-------|
| React | 18+ | Framework UI |
| Vite | 5.x | Build tool |
| TailwindCSS | 3.x | Framework CSS |
| React Router | 6.x | Routing |

---

## Conventions de documentation

### Fichiers markdown

- Pas d'accents dans les fichiers (probleme encodage Windows)
- Extension `.md`
- Caracteres ASCII uniquement

### Structure des documents

- Titre H1 en debut de fichier
- Separateurs `---` entre sections principales
- Tables pour les donnees structurees
- Blocs de code avec langage specifie

### Liens

- Liens relatifs entre documents
- Format : `[Texte](./chemin/fichier.md)`

---

## Documents a creer

| Document | Module | Statut |
|----------|--------|--------|
| frontend/FRONT_ARCHITECTURE.md | Frontend | Fait |
| frontend/components.md | Frontend | Fait |
| frontend/portal.md | Frontend | Fait |
| frontend/core.md | Frontend | A faire |
| frontend/state.md | Frontend | A faire |
| api/forum.md | Forum | A faire |
| api/game.md | Game | A faire |
| backend/forum.md | Forum | A faire |
| backend/game.md | Game | A faire |
