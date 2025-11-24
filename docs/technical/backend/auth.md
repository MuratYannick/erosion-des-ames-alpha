# Systeme d'Authentification

Documentation detaillee du systeme d'authentification du backend Erosion des Ames.

---

## Vue d'ensemble

Le systeme d'authentification utilise JWT (JSON Web Tokens) avec une strategie de tokens doubles :
- **Access Token** : Token de courte duree pour les requetes API
- **Refresh Token** : Token de longue duree pour renouveler l'access token

---

## Modele User

Le modele User est le coeur du systeme d'authentification.

### Champs

| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique (auto-genere) |
| username | VARCHAR(50) | Nom d'utilisateur unique |
| email | VARCHAR(255) | Email unique |
| emailVerified | BOOLEAN | Email verifie (defaut: false) |
| password | VARCHAR(255) | Mot de passe hashe (bcrypt) |
| role | ENUM | ADMIN, MODERATOR, GAME_MASTER, PLAYER |
| cguAccepted | BOOLEAN | CGU acceptees |
| cguAcceptedAt | DATETIME | Date d'acceptation CGU |
| forumRulesAccepted | BOOLEAN | Regles forum acceptees |
| forumRulesAcceptedAt | DATETIME | Date d'acceptation regles |
| isBlocked | BOOLEAN | Compte bloque |
| blockedAt | DATETIME | Date de blocage |
| createdAt | DATETIME | Date de creation |
| updatedAt | DATETIME | Date de mise a jour |
| deletedAt | DATETIME | Date de suppression (soft delete) |

### Hooks bcrypt

```javascript
// Hash automatique du mot de passe avant creation
beforeCreate: async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
}

// Re-hash si le mot de passe est modifie
beforeUpdate: async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
}
```

### Options Sequelize

- `paranoid: true` : Active le soft delete (deletedAt au lieu de suppression)
- `timestamps: true` : Gere automatiquement createdAt et updatedAt

---

## Utilitaires JWT

Fichier : `backend/src/core/utils/jwt.js`

### Fonctions

| Fonction | Description |
|----------|-------------|
| `generateTokens(payload)` | Genere une paire access/refresh tokens |
| `verifyAccessToken(token)` | Verifie et decode un access token |
| `verifyRefreshToken(token)` | Verifie et decode un refresh token |

### Configuration

| Variable | Description | Valeur par defaut |
|----------|-------------|-------------------|
| JWT_SECRET | Secret de signature | (requis) |
| JWT_EXPIRES_IN | Duree access token | 1d |
| JWT_REFRESH_EXPIRES_IN | Duree refresh token | 7d |

### Payload du token

```javascript
{
  userId: "uuid-de-l-utilisateur",
  role: "PLAYER",
  type: "access" // ou "refresh"
}
```

---

## Service d'authentification

Fichier : `backend/src/core/services/auth.service.js`

### Methodes

| Methode | Parametres | Retour | Description |
|---------|------------|--------|-------------|
| `register(userData)` | `{ username, email, password, cguAccepted }` | `{ user, accessToken, refreshToken }` | Inscription d'un nouvel utilisateur |
| `login(email, password)` | email, password | `{ user, accessToken, refreshToken }` | Connexion utilisateur |
| `refreshToken(token)` | refreshToken | `{ accessToken, refreshToken }` | Renouvellement des tokens |
| `getProfile(userId)` | userId (UUID) | `{ user }` | Recuperation du profil |

### Flux d'inscription

1. Validation des donnees (username, email, password, cguAccepted)
2. Verification unicite email et username
3. Creation de l'utilisateur (password hashe automatiquement)
4. Generation des tokens JWT
5. Retour des informations utilisateur et tokens

### Flux de connexion

1. Recherche de l'utilisateur par email
2. Verification que le compte n'est pas bloque
3. Comparaison du mot de passe avec bcrypt
4. Generation des tokens JWT
5. Retour des informations utilisateur et tokens

---

## Controller d'authentification

Fichier : `backend/src/core/controllers/auth.controller.js`

### Endpoints

| Methode | Route | Handler | Description |
|---------|-------|---------|-------------|
| POST | /register | `register()` | Inscription |
| POST | /login | `login()` | Connexion |
| POST | /logout | `logout()` | Deconnexion |
| POST | /refresh-token | `refreshToken()` | Renouvellement |
| GET | /me | `getProfile()` | Profil utilisateur |

---

## Routes d'authentification

Fichier : `backend/src/core/routes/auth.routes.js`

### Configuration

```javascript
const router = express.Router();

// Routes publiques
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.post('/refresh-token', refreshTokenValidation, validate, authController.refreshToken);

// Routes protegees
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getProfile);
```

---

## Validateurs

Fichier : `backend/src/core/validators/userValidators.js`

### validateUsername

Regles :
- 8 caracteres minimum
- Caracteres autorises : lettres (a-z, A-Z), tiret (-), espace ( ), apostrophe (')
- Caracteres speciaux interdits en debut/fin
- Pas de caracteres speciaux consecutifs

### validatePassword

Regles :
- 8 caracteres minimum
- Au moins 1 minuscule
- Au moins 1 majuscule
- Au moins 1 chiffre
- Au moins 1 caractere special
- Espace interdit

### validateEmail

Regles :
- Format email valide (via express-validator)
- Maximum 255 caracteres

---

## Securite

### Bonnes pratiques implementees

- Hash des mots de passe avec bcrypt (salt rounds: 10)
- Tokens JWT signes avec secret
- Soft delete pour conserver l'historique
- Validation stricte des entrees
- Unicite email/username (hors comptes supprimes)
- Middleware d'autorisation par role

### Points d'attention

- Ne jamais exposer le mot de passe dans les reponses
- Utiliser HTTPS en production
- Stocker les secrets en variables d'environnement
- Implementer rate limiting (a venir)
- Ajouter CORS en production (a configurer)

---

## Tests

Fichier : `backend/src/core/tests/auth.test.js`

### Tests couverts

- Inscription avec donnees valides
- Inscription avec donnees invalides
- Email/username deja utilise
- Connexion reussie
- Connexion avec identifiants incorrects
- Connexion compte bloque
- Rafraichissement de token
- Recuperation du profil
- Acces sans authentification

### Execution

```bash
npm test -- auth.test.js
```

---

## Liens

- [Documentation API Auth](../../api/auth.md)
- [Modeles Sequelize](./models.md)
- [Middlewares](./middlewares.md)
- [Architecture Backend](./BACK_ARCHITECTURE.md)
