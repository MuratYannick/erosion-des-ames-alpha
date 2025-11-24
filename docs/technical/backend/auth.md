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
| verificationToken | VARCHAR(255) | Token de verification email (nullable) |
| verificationTokenExpires | DATETIME | Expiration du token (nullable) |
| resetPasswordToken | VARCHAR(255) | Token de reset password (nullable) |
| resetPasswordExpires | DATETIME | Expiration du token reset (nullable) |
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

### Methodes de classe

| Methode | Description |
|---------|-------------|
| `findByEmail(email)` | Recherche par email |
| `findByUsername(username)` | Recherche par nom d'utilisateur |
| `findByVerificationToken(token)` | Recherche par token de verification |
| `findByResetPasswordToken(token)` | Recherche par token de reset password |

### Methodes d'instance

| Methode | Description |
|---------|-------------|
| `verifyPassword(password)` | Compare le mot de passe avec le hash |
| `toJSON()` | Retourne l'utilisateur sans les champs sensibles |

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
| `verifyEmail(token)` | token (string) | `{ user }` | Verification de l'email via token |
| `sendVerificationEmail(userId)` | userId (UUID) | `{ message }` | Renvoie un email de verification |
| `forgotPassword(email)` | email (string) | `{ message }` | Demande de reset password |
| `resetPassword(token, password)` | token, newPassword | `{ message }` | Reinitialisation du mot de passe |
| `changePassword(userId, currentPassword, newPassword)` | userId, currentPassword, newPassword | `{ message }` | Changement du mot de passe utilisateur connecte |

### Flux d'inscription

1. Validation des donnees (username, email, password, cguAccepted)
2. Verification unicite email et username
3. Generation du token de verification email
4. Creation de l'utilisateur (password hashe automatiquement)
5. Envoi de l'email de verification
6. Generation des tokens JWT
7. Retour des informations utilisateur et tokens

### Flux de connexion

1. Recherche de l'utilisateur par email
2. Verification que le compte n'est pas bloque
3. Comparaison du mot de passe avec bcrypt
4. Generation des tokens JWT
5. Retour des informations utilisateur et tokens

### Flux de verification d'email

1. Recherche de l'utilisateur par token de verification
2. Verification que le token n'a pas expire (24h)
3. Mise a jour de `emailVerified` a `true`
4. Suppression du token de verification
5. Retour de l'utilisateur mis a jour

### Flux de reinitialisation de mot de passe

1. Recherche de l'utilisateur par email (forgot-password)
2. Generation d'un token de reset (valide 1h)
3. Envoi de l'email avec le lien de reset
4. L'utilisateur clique sur le lien et soumet le nouveau mot de passe
5. Verification du token et mise a jour du mot de passe

### Flux de changement de mot de passe

1. L'utilisateur connecte soumet son mot de passe actuel et le nouveau
2. Verification de l'identite via le mot de passe actuel (bcrypt.compare)
3. Validation du nouveau mot de passe (memes regles que l'inscription)
4. Mise a jour du mot de passe (hash automatique via hook beforeUpdate)

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
| POST | /send-verification-email | `sendVerificationEmail()` | Renvoyer email verification |
| GET | /verify-email/:token | `verifyEmail()` | Verifier email |
| POST | /forgot-password | `forgotPassword()` | Demander reset password |
| POST | /reset-password/:token | `resetPassword()` | Reinitialiser mot de passe |
| PUT | /change-password | `changePassword()` | Changer mot de passe (authentifie) |

---

## Routes d'authentification

Fichier : `backend/src/core/routes/auth.routes.js`

### Configuration

```javascript
const router = express.Router();

// Routes publiques
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/refresh-token', refreshTokenValidation, authController.refreshToken);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword);
router.post('/reset-password/:token', resetPasswordValidation, authController.resetPassword);

// Routes protegees
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getProfile);
router.post('/send-verification-email', authenticate, authController.sendVerificationEmail);
router.put('/change-password', authenticate, changePasswordValidation, authController.changePassword);
```

---

## Service Email

Fichier : `backend/src/core/services/email.service.js`

Service d'envoi d'emails utilisant Nodemailer.

### Configuration SMTP

| Variable | Description | Valeur par defaut |
|----------|-------------|-------------------|
| SMTP_HOST | Serveur SMTP | (requis en production) |
| SMTP_PORT | Port SMTP | 587 |
| SMTP_USER | Utilisateur SMTP | (requis) |
| SMTP_PASS | Mot de passe SMTP | (requis) |
| SMTP_FROM | Adresse expediteur | noreply@erosion-des-ames.com |

### Mode developpement

En mode developpement sans configuration SMTP, les emails sont logges en console au lieu d'etre envoyes.

### Methodes

| Methode | Parametres | Description |
|---------|------------|-------------|
| `sendEmail({ to, subject, html, text })` | Options email | Envoie un email generique |
| `sendVerificationEmail(user, token)` | User, token | Envoie l'email de verification |
| `sendPasswordResetEmail(user, token)` | User, token | Envoie l'email de reset password |
| `verifyConnection()` | - | Teste la connexion SMTP |

### Templates email

Fichiers : `backend/src/core/templates/`

| Template | Fichier | Description |
|----------|---------|-------------|
| Verification email | `verifyEmail.js` | Email de confirmation d'inscription |
| Reset password | `resetPassword.js` | Email de reinitialisation de mot de passe |

Chaque template retourne un objet :
```javascript
{
  subject: "Sujet de l'email",
  html: "<html>Corps HTML</html>",
  text: "Corps texte brut"
}
```

### Durees d'expiration des tokens

| Token | Duree | Constante |
|-------|-------|-----------|
| Verification email | 24 heures | VERIFICATION_TOKEN_EXPIRY |
| Reset password | 1 heure | RESET_PASSWORD_TOKEN_EXPIRY |

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
