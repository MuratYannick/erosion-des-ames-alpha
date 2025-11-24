# Middlewares Express

Documentation detaillee des middlewares du backend Erosion des Ames.

---

## Vue d'ensemble

Les middlewares sont des fonctions qui s'executent entre la requete et la reponse. Ils permettent de :
- Verifier l'authentification (`authenticate`)
- Verifier la confirmation d'email (`requireEmailVerified`)
- Controler les autorisations par role (`authorize`)
- Valider les donnees d'entree (`validate`)
- Logger les requetes
- Gerer les erreurs

---

## Middleware d'authentification

Fichier : `backend/src/core/middlewares/auth.middleware.js`

### authenticate

Verifie la presence et la validite du token JWT dans le header Authorization.

```javascript
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouve'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expire'
    });
  }
};
```

#### Usage

```javascript
// Route protegee
router.get('/me', authenticate, authController.getProfile);

// Plusieurs routes protegees
router.use('/protected', authenticate);
router.get('/protected/data', controller.getData);
```

#### Comportement

1. Extrait le token du header `Authorization: Bearer <token>`
2. Verifie la validite du token avec `verifyAccessToken()`
3. Recupere l'utilisateur en base de donnees
4. Attache l'utilisateur a `req.user`
5. Passe au middleware suivant ou retourne une erreur 401

#### Erreurs possibles

| Code | Message | Cause |
|------|---------|-------|
| 401 | Token manquant | Header Authorization absent ou mal formate |
| 401 | Token invalide ou expire | Token JWT invalide ou expire |
| 401 | Utilisateur non trouve | L'utilisateur du token n'existe plus |

---

### requireEmailVerified

Verifie que l'utilisateur a confirme son adresse email. Doit etre utilise APRES le middleware `authenticate`.

```javascript
const requireEmailVerified = async (req, res, next) => {
  try {
    // Verifier que l'utilisateur est authentifie
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    // Recuperer l'utilisateur depuis la base de donnees
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouve'
      });
    }

    // Verifier que l'email est verifie
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Veuillez verifier votre email avant d'acceder a cette ressource"
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la verification de l'email"
    });
  }
};
```

#### Usage

```javascript
// Route necessitant un email verifie
router.post('/create-post', authenticate, requireEmailVerified, controller.createPost);

// Combinaison avec authorize
router.post('/admin-action',
  authenticate,
  requireEmailVerified,
  authorize('ADMIN'),
  controller.adminAction
);
```

#### Comportement

1. Verifie que `req.user` existe (authenticate appele avant)
2. Recupere l'utilisateur en base pour avoir le statut a jour
3. Verifie que `emailVerified` est `true`
4. Passe au middleware suivant ou retourne une erreur

#### Erreurs possibles

| Code | Message | Cause |
|------|---------|-------|
| 401 | Authentification requise | `req.user` absent (authenticate non appele) |
| 403 | Veuillez verifier votre email | Email non verifie |
| 404 | Utilisateur non trouve | L'utilisateur n'existe plus |

---

### authorize

Verifie que l'utilisateur connecte possede le role requis.

```javascript
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifie'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Acces interdit'
      });
    }

    next();
  };
};
```

#### Usage

```javascript
// Un seul role autorise
router.get('/admin', authenticate, authorize('ADMIN'), controller.admin);

// Plusieurs roles autorises
router.get('/moderate', authenticate, authorize('ADMIN', 'MODERATOR'), controller.moderate);
```

#### Hierarchie des roles

| Role | Acces |
|------|-------|
| ADMIN | Tous les droits |
| MODERATOR | Moderation forum |
| GAME_MASTER | Gestion des parties |
| PLAYER | Fonctionnalites de base |

#### Erreurs possibles

| Code | Message | Cause |
|------|---------|-------|
| 401 | Non authentifie | `req.user` absent (authenticate non appele) |
| 403 | Acces interdit | Role insuffisant |

---

## Middleware de validation

Fichier : `backend/src/core/middlewares/validation.middleware.js`

### validate

Execute les validations express-validator et retourne les erreurs.

```javascript
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  next();
};
```

#### Usage

```javascript
const { body } = require('express-validator');

const registerValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username requis')
    .isLength({ min: 8 }).withMessage('8 caracteres minimum'),
  body('email')
    .trim()
    .isEmail().withMessage('Email invalide'),
  body('password')
    .notEmpty().withMessage('Mot de passe requis')
];

router.post('/register', registerValidation, validate, controller.register);
```

---

## Validations d'authentification

### registerValidation

Valide les donnees d'inscription.

```javascript
const registerValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Nom d\'utilisateur requis')
    .isLength({ min: 8 }).withMessage('8 caracteres minimum')
    .custom(validateUsername),
  body('email')
    .trim()
    .notEmpty().withMessage('Email requis')
    .isEmail().withMessage('Email invalide')
    .isLength({ max: 255 }).withMessage('255 caracteres maximum'),
  body('password')
    .notEmpty().withMessage('Mot de passe requis')
    .custom(validatePassword),
  body('cguAccepted')
    .isBoolean().withMessage('cguAccepted doit etre un booleen')
    .equals('true').withMessage('Les CGU doivent etre acceptees')
];
```

### loginValidation

Valide les donnees de connexion.

```javascript
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email requis')
    .isEmail().withMessage('Email invalide'),
  body('password')
    .notEmpty().withMessage('Mot de passe requis')
];
```

### refreshTokenValidation

Valide le refresh token.

```javascript
const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty().withMessage('Token de rafraichissement requis')
];
```

### forgotPasswordValidation

Valide la demande de reinitialisation de mot de passe.

```javascript
const forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email requis')
    .isEmail().withMessage('Email invalide')
];
```

### resetPasswordValidation

Valide le nouveau mot de passe lors de la reinitialisation.

```javascript
const resetPasswordValidation = [
  body('password')
    .notEmpty().withMessage('Mot de passe requis')
    .custom(validatePasswordCustom)
];
```

---

## Validateurs personnalises

Fichier : `backend/src/core/validators/userValidators.js`

### validateUsername

```javascript
const validateUsername = (username) => {
  // 8 caracteres minimum
  if (username.length < 8) {
    throw new Error('8 caracteres minimum');
  }

  // Caracteres autorises : lettres, tiret, espace, apostrophe
  const validChars = /^[a-zA-Z\- ']+$/;
  if (!validChars.test(username)) {
    throw new Error('Caracteres non autorises');
  }

  // Pas de caractere special en debut/fin
  const specialChars = /^[\- ']|[\- ']$/;
  if (specialChars.test(username)) {
    throw new Error('Caractere special en debut/fin interdit');
  }

  // Pas de caracteres speciaux consecutifs
  const consecutiveSpecial = /[\- ']{2,}/;
  if (consecutiveSpecial.test(username)) {
    throw new Error('Caracteres speciaux consecutifs interdits');
  }

  return true;
};
```

### validatePassword

```javascript
const validatePassword = (password) => {
  // 8 caracteres minimum
  if (password.length < 8) {
    throw new Error('8 caracteres minimum');
  }

  // Au moins 1 minuscule
  if (!/[a-z]/.test(password)) {
    throw new Error('Au moins 1 minuscule requise');
  }

  // Au moins 1 majuscule
  if (!/[A-Z]/.test(password)) {
    throw new Error('Au moins 1 majuscule requise');
  }

  // Au moins 1 chiffre
  if (!/[0-9]/.test(password)) {
    throw new Error('Au moins 1 chiffre requis');
  }

  // Au moins 1 caractere special
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new Error('Au moins 1 caractere special requis');
  }

  // Pas d'espace
  if (/\s/.test(password)) {
    throw new Error('Espace interdit');
  }

  return true;
};
```

### validateEmail

```javascript
const validateEmail = (email) => {
  // Utilise le validateur email d'express-validator
  // Verification supplementaire si necessaire
  if (email.length > 255) {
    throw new Error('255 caracteres maximum');
  }

  return true;
};
```

---

## Ordre des middlewares

L'ordre d'execution des middlewares est important :

```javascript
router.post('/endpoint',
  validation,            // 1. Valide les donnees d'entree
  validate,              // 2. Retourne les erreurs de validation
  authenticate,          // 3. Verifie l'authentification
  requireEmailVerified,  // 4. Verifie que l'email est confirme
  authorize('ADMIN'),    // 5. Verifie les autorisations (role)
  controller.method      // 6. Execute le controller
);
```

> **Note** : `requireEmailVerified` est optionnel selon les routes. Certaines fonctionnalites peuvent etre accessibles meme sans email verifie.

---

## Middlewares a venir

| Middleware | Description | Statut |
|------------|-------------|--------|
| rateLimiter | Limite le nombre de requetes | A faire |
| logger | Log les requetes HTTP | A faire |
| errorHandler | Gestion centralisee des erreurs | A faire |
| cors | Configuration CORS | A configurer |

---

## Tests

Fichier : `backend/src/core/tests/validators.test.js`

### Tests couverts

- Validation username valide/invalide
- Validation password valide/invalide
- Validation email valide/invalide
- Caracteres speciaux interdits
- Longueur minimale/maximale

### Execution

```bash
npm test -- validators.test.js
```

---

## Liens

- [Systeme d'authentification](./auth.md)
- [Modeles Sequelize](./models.md)
- [Architecture Backend](./BACK_ARCHITECTURE.md)
