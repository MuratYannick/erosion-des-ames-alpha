# Branch Progress: feature/authentication

## Objectif de la branche
Mise en place du système d'authentification complet pour le projet Erosion des Ames.

## Stack technique utilisée
- **Backend** : Node.js + Express + Sequelize + MySQL
- **Authentification** : JWT (JSON Web Tokens)
- **Sécurité** : bcrypt pour le hash des mots de passe
- **Validation** : express-validator

---

## Spécifications du modèle User

### Champs

| Champ | Type | Contraintes | Défaut |
|-------|------|-------------|--------|
| id | UUID | PK, auto-généré | UUIDV4 |
| username | VARCHAR(50) | Unique*, 8 car. min, règles spéciales | - |
| email | VARCHAR(255) | Unique*, format email valide | - |
| emailVerified | BOOLEAN | - | false |
| password | VARCHAR(255) | Hashé, 8 car. min, règles spéciales | - |
| role | ENUM | 'ADMIN', 'MODERATOR', 'GAME_MASTER', 'PLAYER' | 'PLAYER' |
| cguAccepted | BOOLEAN | - | false |
| cguAcceptedAt | DATETIME | Nullable | NULL |
| forumRulesAccepted | BOOLEAN | - | false |
| forumRulesAcceptedAt | DATETIME | Nullable | NULL |
| isBlocked | BOOLEAN | Nullable | false |
| blockedAt | DATETIME | Nullable | NULL |
| createdAt | DATETIME | Auto | CURRENT_TIMESTAMP |
| updatedAt | DATETIME | Auto on update | CURRENT_TIMESTAMP |
| deletedAt | DATETIME | Nullable, soft delete | NULL |

*Unique en dehors des comptes supprimés (soft delete)

### Règles de validation

#### Username (8 caractères minimum)
- Caractères autorisés : lettres (a-z, A-Z), sensible à la casse
- Caractères spéciaux autorisés : tiret (-), espace ( ), apostrophe (')
- Règles caractères spéciaux :
  - Pas en début de chaîne
  - Pas en fin de chaîne
  - Ne peuvent pas se suivre (ex: "Jean--Paul" interdit)
  - Uniquement entre deux lettres

#### Password (8 caractères minimum)
- Sensible à la casse
- Doit contenir au moins :
  - 1 lettre minuscule
  - 1 lettre majuscule
  - 1 chiffre
  - 1 caractère spécial (tous sauf espace)
- Espace interdit

---

## Tâches

### Backend - Modèle et Base de données
- [x] Créer le modèle User (Sequelize) avec validations
- [x] Créer la migration pour la table users
- [x] Exécuter la migration

### Backend - Services et Utilitaires
- [x] Installer les dépendances (bcrypt, jsonwebtoken, express-validator)
- [x] Créer le service d'authentification (auth.service.js)
- [x] Créer les utilitaires JWT (génération, vérification)
- [x] Créer les fonctions de hash/vérification mot de passe
- [x] Créer les validateurs personnalisés (username, password)

### Backend - Routes et Controllers
- [x] Créer le controller d'authentification (auth.controller.js)
- [x] Créer les routes d'authentification :
  - [x] POST /api/v1/auth/register
  - [x] POST /api/v1/auth/login
  - [x] POST /api/v1/auth/logout
  - [x] POST /api/v1/auth/refresh-token
  - [x] GET /api/v1/auth/me (profil utilisateur connecté)

### Backend - Middleware
- [x] Créer le middleware d'authentification JWT
- [x] Créer le middleware de validation des données

### Backend - Tests
- [x] Tester les endpoints d'authentification
- [x] Valider la sécurité (hash, tokens)
- [x] Tester les validations username/password

### Frontend - Pages
- [x] Créer la page de connexion (Login)
- [x] Créer la page d'inscription (Register)
- [x] Créer le composant de formulaire d'authentification

### Frontend - Services et État
- [x] Créer le service d'authentification (API calls)
- [x] Créer le contexte d'authentification (AuthContext)
- [x] Gérer le stockage du token (localStorage/cookies)

### Frontend - Protection des routes
- [x] Créer le composant ProtectedRoute
- [x] Intégrer la vérification d'authentification

### Documentation
- [x] Documenter l'API d'authentification
- [x] Mettre à jour BACK_ARCHITECTURE.md

---

## Progression

| Catégorie | Progression |
|-----------|-------------|
| Backend - Modèle | 3/3 ✅ |
| Backend - Services | 5/5 ✅ |
| Backend - Routes | 6/6 ✅ |
| Backend - Middleware | 2/2 ✅ |
| Backend - Tests | 3/3 ✅ |
| Frontend - Pages | 3/3 ✅ |
| Frontend - Services | 3/3 ✅ |
| Frontend - Protection | 2/2 ✅ |
| Documentation | 2/2 ✅ |
| **Total** | **29/29 ✅** |

---

## Notes techniques
- JWT expiration : 1 jour (configuré dans .env)
- Utiliser UUID pour les IDs utilisateur
- Hash bcrypt avec salt rounds = 10
- Soft delete avec paranoid: true (Sequelize)
- Unicité username/email : exclure les comptes supprimés

---

## Fichiers créés

### Backend - Core

| Fichier | Description |
|---------|-------------|
| `src/core/models/index.js` | Configuration Sequelize et export des modèles |
| `src/core/models/User.js` | Modèle User avec validations et hooks |
| `src/core/validators/userValidators.js` | Validateurs username, password, email |
| `src/core/utils/jwt.js` | Utilitaires JWT (génération, vérification) |
| `src/core/services/auth.service.js` | Service d'authentification |
| `src/core/controllers/auth.controller.js` | Controller des routes auth |
| `src/core/middlewares/auth.middleware.js` | Middleware JWT + autorisation rôles |
| `src/core/middlewares/validation.middleware.js` | Middleware validation express-validator |
| `src/core/routes/auth.routes.js` | Routes d'authentification |
| `src/core/routes/index.js` | Index des routes core |
| `src/core/migrations/20250123000001-create-users-table.js` | Migration table users |
| `src/core/tests/setup.js` | Configuration Jest |
| `src/core/tests/validators.test.js` | Tests des validateurs (31 tests) |
| `src/core/tests/auth.test.js` | Tests API auth (18 tests) |

### Frontend - Core

| Fichier | Description |
|---------|-------------|
| `src/core/services/api.js` | Service API de base avec gestion tokens |
| `src/core/services/auth.service.js` | Service d'authentification |
| `src/core/contexts/AuthContext.jsx` | Provider contexte auth |
| `src/core/hooks/useAuth.js` | Hook useAuth |
| `src/core/pages/Login.jsx` | Page de connexion |
| `src/core/pages/Register.jsx` | Page d'inscription |
| `src/core/components/ProtectedRoute.jsx` | Composant route protégée |

---

## Historique

| Date | Tâche | Statut |
|------|-------|--------|
| 2025-01-23 | Création de la branche | ✅ |
| 2025-01-23 | Spécifications modèle User définies | ✅ |
| 2025-11-23 | Installation dépendances auth | ✅ |
| 2025-11-23 | Création modèle User + migration | ✅ |
| 2025-11-23 | Création services, controllers, routes auth | ✅ |
| 2025-11-23 | Création middlewares (JWT, validation) | ✅ |
| 2025-11-23 | Tests backend (49 tests passent) | ✅ |
| 2025-11-23 | Frontend: services API, AuthContext, hooks | ✅ |
| 2025-11-23 | Frontend: pages Login, Register, Home | ✅ |
| 2025-11-23 | Frontend: ProtectedRoute + build réussi | ✅ |
| 2025-11-24 | Documentation API auth + BACK_ARCHITECTURE.md | ✅ |
