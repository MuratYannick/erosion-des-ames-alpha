# API d'Authentification

Documentation de l'API d'authentification pour Erosion des Ames.

## Base URL

```
/api/v1/auth
```

## Endpoints

### POST /register

Inscription d'un nouvel utilisateur.

**Acces** : Public

**Body (JSON)**

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| username | string | Oui | 8 caracteres min. Lettres, tirets, espaces, apostrophes. Pas de caractere special en debut/fin ni consecutifs. |
| email | string | Oui | Email valide et unique |
| password | string | Oui | 8 caracteres min. 1 majuscule, 1 minuscule, 1 chiffre, 1 caractere special. Pas d'espace. |
| cguAccepted | boolean | Oui | Doit etre `true` |

**Exemple de requete**

```json
{
  "username": "JeanDupont",
  "email": "jean@example.com",
  "password": "Password1!",
  "cguAccepted": true
}
```

**Reponse succes (201 Created)**

```json
{
  "success": true,
  "message": "Inscription reussie",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "JeanDupont",
      "email": "jean@example.com",
      "role": "PLAYER",
      "emailVerified": false,
      "cguAccepted": true,
      "cguAcceptedAt": "2025-01-23T10:30:00.000Z",
      "forumRulesAccepted": false,
      "createdAt": "2025-01-23T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erreurs possibles**

| Code | Message | Description |
|------|---------|-------------|
| 400 | Email deja utilise | Un compte existe deja avec cet email |
| 400 | Nom d'utilisateur deja utilise | Un compte existe deja avec ce username |
| 400 | Validation errors | Donnees invalides (voir details dans `errors`) |

---

### POST /login

Connexion d'un utilisateur existant.

**Acces** : Public

**Body (JSON)**

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| email | string | Oui | Email de l'utilisateur |
| password | string | Oui | Mot de passe |

**Exemple de requete**

```json
{
  "email": "jean@example.com",
  "password": "Password1!"
}
```

**Reponse succes (200 OK)**

```json
{
  "success": true,
  "message": "Connexion reussie",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "JeanDupont",
      "email": "jean@example.com",
      "role": "PLAYER",
      "emailVerified": false,
      "cguAccepted": true,
      "forumRulesAccepted": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erreurs possibles**

| Code | Message | Description |
|------|---------|-------------|
| 401 | Identifiants incorrects | Email ou mot de passe invalide |
| 401 | Compte bloque | L'utilisateur a ete bloque par un admin |

---

### POST /logout

Deconnexion de l'utilisateur.

**Acces** : Prive (authentifie)

**Headers**

```
Authorization: Bearer <accessToken>
```

**Reponse succes (200 OK)**

```json
{
  "success": true,
  "message": "Deconnexion reussie"
}
```

> **Note** : Cote serveur, aucune action n'est effectuee car JWT est stateless. Le client doit supprimer les tokens stockes localement.

---

### POST /refresh-token

Rafraichir le token d'acces avec un refresh token valide.

**Acces** : Public

**Body (JSON)**

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| refreshToken | string | Oui | Le refresh token obtenu lors du login/register |

**Exemple de requete**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Reponse succes (200 OK)**

```json
{
  "success": true,
  "message": "Token rafraichi avec succes",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erreurs possibles**

| Code | Message | Description |
|------|---------|-------------|
| 400 | Token de rafraichissement requis | Le refreshToken n'a pas ete fourni |
| 401 | Token invalide ou expire | Le refresh token est invalide ou a expire |

---

### GET /me

Recuperer le profil de l'utilisateur actuellement connecte.

**Acces** : Prive (authentifie)

**Headers**

```
Authorization: Bearer <accessToken>
```

**Reponse succes (200 OK)**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "JeanDupont",
      "email": "jean@example.com",
      "role": "PLAYER",
      "emailVerified": false,
      "cguAccepted": true,
      "cguAcceptedAt": "2025-01-23T10:30:00.000Z",
      "forumRulesAccepted": false,
      "forumRulesAcceptedAt": null,
      "createdAt": "2025-01-23T10:30:00.000Z"
    }
  }
}
```

**Erreurs possibles**

| Code | Message | Description |
|------|---------|-------------|
| 401 | Token manquant | Aucun token fourni dans les headers |
| 401 | Token invalide | Le token est invalide ou mal formate |
| 401 | Token expire | Le token a expire |
| 404 | Utilisateur non trouve | L'utilisateur associe au token n'existe plus |

---

## Authentification

### Format du Header

Pour les endpoints proteges, inclure le token dans le header Authorization :

```
Authorization: Bearer <accessToken>
```

### Duree de vie des tokens

| Token | Duree | Variable d'environnement |
|-------|-------|--------------------------|
| Access Token | 1 jour | JWT_EXPIRES_IN |
| Refresh Token | 7 jours | JWT_REFRESH_EXPIRES_IN |

### Flux d'authentification

1. **Inscription/Connexion** : L'utilisateur obtient un `accessToken` et un `refreshToken`
2. **Requetes authentifiees** : Utiliser l'`accessToken` dans le header Authorization
3. **Token expire** : Utiliser le `refreshToken` pour obtenir de nouveaux tokens via `/refresh-token`
4. **Deconnexion** : Appeler `/logout` et supprimer les tokens cote client

---

## Roles utilisateur

| Role | Description |
|------|-------------|
| PLAYER | Utilisateur standard (par defaut) |
| GAME_MASTER | Maitre de jeu avec droits etendus sur le jeu |
| MODERATOR | Moderateur avec droits sur le forum |
| ADMIN | Administrateur avec tous les droits |

---

## Codes d'erreur HTTP

| Code | Signification |
|------|---------------|
| 200 | Succes |
| 201 | Creation reussie |
| 400 | Requete invalide (donnees manquantes ou invalides) |
| 401 | Non authentifie ou token invalide |
| 403 | Acces interdit (role insuffisant) |
| 404 | Ressource non trouvee |
| 500 | Erreur serveur |

---

## Format des reponses

### Reponse succes

```json
{
  "success": true,
  "message": "Description du succes",
  "data": { ... }
}
```

### Reponse erreur

```json
{
  "success": false,
  "message": "Description de l'erreur",
  "errors": [
    {
      "field": "email",
      "message": "Email invalide"
    }
  ]
}
```
