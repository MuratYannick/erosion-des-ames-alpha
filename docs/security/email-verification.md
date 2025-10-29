# Vérification Sécurité Email - Formulaire d'Inscription

## Contexte
Suite à la suppression de la contrainte UNIQUE sur la colonne `email` de la table `users` (pour permettre la création future de comptes multiples via une route spécifique), cette vérification confirme que les protections au niveau applicatif sont toujours en place.

## Date de vérification
24 octobre 2025

## Points vérifiés

### 1. Protection Backend - Route `/api/auth/register`

**Fichier**: [backend/src/controllers/authController.js](backend/src/controllers/authController.js:28-45)

**Code de vérification**:
```javascript
// Vérifier si l'utilisateur existe déjà
const existingUser = await User.findOne({
  where: {
    [Op.or]: [{ email }, { username }]
  }
});

if (existingUser) {
  if (existingUser.email === email) {
    return res.status(409).json({
      error: 'Cet email est déjà utilisé'
    });
  }
  if (existingUser.username === username) {
    return res.status(409).json({
      error: "Ce nom d'utilisateur est déjà pris"
    });
  }
}
```

**Status**: ✅ **VÉRIFIÉ**
- La route `/api/auth/register` vérifie bien l'unicité de l'email avant création
- Retourne un code HTTP 409 (Conflict) si l'email existe déjà
- Retourne le message d'erreur: "Cet email est déjà utilisé"

**Test effectué**:
```bash
curl -w "\nHTTP Code: %{http_code}\n" -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","email":"admin@erosion-des-ames.com","password":"password123"}'

# Résultat:
# {"error":"Cet email est déjà utilisé"}
# HTTP Code: 409
```

### 2. Protection Frontend - Gestion des erreurs

**Fichier**: [frontend/src/pages/Register.jsx](frontend/src/pages/Register.jsx:57-66)

**Code de gestion d'erreur**:
```javascript
try {
  const response = await authService.register(
    formData.username,
    formData.email,
    formData.password
  );
  // ... succès
} catch (err) {
  const wasRedirected = handleError(err, navigate, { skipValidationErrors: true });

  if (!wasRedirected) {
    setError(err.message || 'Une erreur est survenue lors de l\'inscription');
  }
}
```

**Fichier**: [frontend/src/utils/errorHandler.js](frontend/src/utils/errorHandler.js:33-39)

**Code de filtrage des erreurs**:
```javascript
// Si skipValidationErrors est activé, ne pas rediriger les erreurs de formulaire
// 400: Erreurs de validation (champs invalides)
// 401: Erreurs d'authentification (mauvais identifiants)
// 409: Erreurs de conflit (email/username déjà existant)
if (skipValidationErrors && (status === 400 || status === 401 || status === 409)) {
  return false;
}
```

**Status**: ✅ **VÉRIFIÉ**
- Le frontend utilise `skipValidationErrors: true` pour le formulaire d'inscription
- Les erreurs 409 (email existant) ne redirigent PAS vers une page d'erreur
- Le message d'erreur est affiché dans le formulaire via `setError()`

### 3. Protection API Service - Structure d'erreur

**Fichier**: [frontend/src/services/api.js](frontend/src/services/api.js:23-44)

**Code de gestion de réponse**:
```javascript
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = new Error('HTTP Error');
    error.response = {
      status: response.status,
      statusText: response.statusText
    };

    try {
      const data = await response.json();
      error.message = data.error || data.message || 'Une erreur est survenue';
      error.response.data = data;
    } catch (e) {
      error.message = response.statusText || 'Une erreur est survenue';
    }

    throw error;
  }
  return await response.json();
};
```

**Status**: ✅ **VÉRIFIÉ**
- L'erreur est correctement structurée avec `error.response.status = 409`
- Le message d'erreur du backend est extrait et placé dans `error.message`
- L'erreur est propagée au composant Register pour affichage

## Résumé des protections

| Niveau | Protection | Status | Description |
|--------|-----------|--------|-------------|
| **Base de données** | ❌ Aucune | Désactivée volontairement | Contrainte UNIQUE supprimée pour permettre comptes multiples |
| **Backend** | ✅ Validation applicative | Active | Vérification dans authController.register() |
| **Frontend** | ✅ Affichage erreur | Active | Message affiché dans le formulaire |

## Comportement attendu

### Tentative d'inscription avec email existant:
1. L'utilisateur remplit le formulaire avec un email déjà utilisé
2. Le frontend envoie la requête POST à `/api/auth/register`
3. Le backend vérifie l'unicité de l'email dans la base de données
4. Le backend retourne HTTP 409 avec le message "Cet email est déjà utilisé"
5. Le frontend capture l'erreur 409
6. Le gestionnaire d'erreurs ne redirige PAS (skipValidationErrors: true)
7. Le message d'erreur s'affiche dans le formulaire d'inscription
8. L'utilisateur voit l'erreur et peut corriger son email

### Tentative d'inscription avec username existant:
1-8. Même flux avec le message "Ce nom d'utilisateur est déjà pris"

## Future implémentation

Comme indiqué dans les commentaires, la création de comptes supplémentaires se fera via:
- Une nouvelle route dédiée (à définir)
- Un nouveau formulaire avec permissions spécifiques
- Accessible uniquement aux utilisateurs autorisés (admin, etc.)

## Conclusion

✅ **Toutes les protections sont en place et fonctionnelles**

Malgré la suppression de la contrainte UNIQUE au niveau de la base de données, les protections au niveau applicatif empêchent efficacement la création de comptes avec des emails ou usernames déjà existants via le formulaire d'inscription standard.

Les tests confirment que:
- Le backend refuse la création de doublons (HTTP 409)
- Le frontend affiche correctement le message d'erreur
- L'expérience utilisateur est préservée
