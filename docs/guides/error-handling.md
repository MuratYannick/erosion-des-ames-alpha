# Guide de gestion des erreurs - Frontend

## 📋 Vue d'ensemble

Le système de gestion des erreurs distingue deux types d'erreurs pour offrir la meilleure expérience utilisateur :

- **Erreurs utilisateur** (validation, authentification) → Message dans le formulaire
- **Erreurs système** (serveur, réseau) → Redirection vers page d'erreur dédiée

---

## 🎯 Comportement par type d'erreur

### Dans les formulaires (Login & Register)

| Code | Type | Comportement | Exemples concrets |
|------|------|--------------|-------------------|
| **400** | Validation | 📝 Message inline | Format email invalide, champs manquants |
| **401** | Authentification | 📝 Message inline | Email inexistant, mot de passe incorrect |
| **409** | Conflit | 📝 Message inline | Email/username déjà utilisé |

### Partout ailleurs dans l'application

| Code | Comportement | Exemples |
|------|--------------|----------|
| **401** | 🔀 Redirect `/error/401` | Token expiré, session invalide |
| **403** | 🔀 Redirect `/error/403` | Accès refusé, permissions insuffisantes |
| **404** | 🔀 Redirect `/error/404` | Ressource introuvable, route inexistante |
| **500** | 🔀 Redirect `/error/500` | Bug serveur, erreur SQL |
| **503** | 🔀 Redirect `/error/503` | Service en maintenance, DB indisponible |
| **Network** | 🔀 Redirect `/error/network` | Backend arrêté, perte de connexion |
| **React Error** | ErrorBoundary affiche page 500 | Erreur JavaScript non gérée |

---

## 💻 Utilisation dans le code

### Pour les formulaires (Login, Register)

```javascript
import { handleError } from '../utils/errorHandler';

try {
  const response = await authService.login(email, password);
  // Traitement du succès...
} catch (err) {
  // Option skipValidationErrors: true pour les formulaires
  const wasRedirected = handleError(err, navigate, { skipValidationErrors: true });

  // Si pas redirigé (erreur 400/401/409), afficher dans le formulaire
  if (!wasRedirected) {
    setError(err.message || 'Une erreur est survenue');
  }
}
```

### Pour le reste de l'application

```javascript
import { handleError } from '../utils/errorHandler';

try {
  const response = await apiCall();
  // Traitement...
} catch (err) {
  // Sans option : toutes les erreurs redirigent vers page d'erreur
  handleError(err, navigate);
}
```

### Affichage du message dans le formulaire

```jsx
{error && (
  <div className="bg-blood-900 border-2 border-blood-700 text-blood-300 px-4 py-3 rounded font-texte-corps text-sm">
    {error}
  </div>
)}
```

---

## 🧪 Tests

### Tests avec curl (Backend)

#### Test 1 : Erreur 401 - Mauvais identifiants
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@erosion-des-ames.com","password":"wrongpass"}'
```
**Résultat attendu :**
- Backend : HTTP 401 + `{"error":"Email ou mot de passe incorrect"}`
- Frontend : Message dans le formulaire

#### Test 2 : Erreur 409 - Username existant
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"new@email.com","password":"123456"}'
```
**Résultat attendu :**
- Backend : HTTP 409 + `{"error":"Ce nom d'utilisateur est déjà pris"}`
- Frontend : Message dans le formulaire

#### Test 3 : Erreur 404 - Route inexistante
```bash
curl http://localhost:3000/api/nonexistent
```
**Résultat attendu :**
- Backend : HTTP 404 + `{"error":"Route non trouvée"}`
- Frontend : Redirection vers `/error/404`

### Tests manuels dans le navigateur

1. **Test erreur 401 (mauvais identifiants)**
   - Aller sur http://localhost:5173/login
   - Entrer : `admin@erosion-des-ames.com` / `mauvais_mot_de_passe`
   - ✅ Résultat : Message "Email ou mot de passe incorrect" dans le formulaire

2. **Test erreur 409 (email existant)**
   - Aller sur http://localhost:5173/register
   - Essayer de créer un compte avec `admin@erosion-des-ames.com`
   - ✅ Résultat : Message "Cet email est déjà utilisé" dans le formulaire

3. **Test erreur Network (backend arrêté)**
   - Arrêter le backend : Ctrl+C dans le terminal backend
   - Essayer de se connecter
   - ✅ Résultat : Redirection vers `/error/network`

4. **Test erreur 404 (route inexistante)**
   - Aller sur http://localhost:5173/page-qui-nexiste-pas
   - ✅ Résultat : Redirection vers `/error/404`

5. **Test ErrorBoundary (erreur React)**
   - Provoquer une erreur JavaScript dans un composant
   - ✅ Résultat : Page d'erreur 500 affichée par ErrorBoundary

---

## 📁 Architecture

```
frontend/src/
├── utils/
│   └── errorHandler.js          # Gestionnaire d'erreurs principal
├── components/
│   └── errors/
│       ├── ErrorPage.jsx        # Composant de base pour toutes les pages d'erreur
│       └── GlobalErrorBoundary.jsx  # ErrorBoundary React global
├── pages/
│   ├── Login.jsx                # Utilise skipValidationErrors: true
│   ├── Register.jsx             # Utilise skipValidationErrors: true
│   └── errors/
│       ├── Unauthorized401.jsx
│       ├── Forbidden403.jsx
│       ├── NotFound404.jsx
│       ├── ServerError500.jsx
│       ├── ServiceUnavailable503.jsx
│       └── NetworkError.jsx
└── App.jsx                      # Intègre GlobalErrorBoundary
```

---

## 🎨 Pages d'erreur personnalisées

Toutes les pages d'erreur utilisent le composant `ErrorPage.jsx` avec :
- Images de fond thématiques (`/errorIllustrations/`)
- Couleurs selon le type (client=ochre, server=blood, network=neutral)
- Messages personnalisés et immersifs
- Boutons retour et accueil

| Page | Route | Image | Couleur |
|------|-------|-------|---------|
| 401 | `/error/401` | `error4xx.png` | Ochre |
| 403 | `/error/403` | `error4xx.png` | Ochre |
| 404 | `/error/404` | `error4xx.png` | Ochre |
| 500 | `/error/500` | `error5xx.png` | Blood |
| 503 | `/error/503` | `error5xx.png` | Blood |
| Network | `/error/network` | `errorNetwork.png` | Neutral |

---

## 🔧 Configuration du gestionnaire d'erreurs

Le fichier `errorHandler.js` expose :

### `handleError(error, navigate, options)`

**Paramètres :**
- `error` : L'erreur capturée
- `navigate` : Fonction de navigation React Router
- `options.skipValidationErrors` : Si `true`, ne redirige pas les erreurs 400/401/409

**Retour :**
- `true` : L'erreur a été redirigée vers une page d'erreur
- `false` : L'erreur doit être affichée localement (formulaire)

**Comportement :**
```javascript
// Détecte automatiquement :
// - Erreurs réseau (Failed to fetch, Network Error, !navigator.onLine)
// - Erreurs HTTP (4xx, 5xx)
// - Map vers la page d'erreur appropriée
```

---

## 📊 Matrice de décision complète

| Code HTTP | Context Formulaire | Context Autre | Raison |
|-----------|-------------------|---------------|--------|
| 400 | 📝 Message inline | 🔀 `/error/404` | Erreur saisie vs système |
| 401 | 📝 Message inline | 🔀 `/error/401` | Mauvais identifiants vs token |
| 403 | 🔀 `/error/403` | 🔀 `/error/403` | Toujours système |
| 404 | 🔀 `/error/404` | 🔀 `/error/404` | Toujours système |
| 409 | 📝 Message inline | 🔀 `/error/404` | Conflit utilisateur vs système |
| 500 | 🔀 `/error/500` | 🔀 `/error/500` | Toujours système |
| 503 | 🔀 `/error/503` | 🔀 `/error/503` | Toujours système |
| 4xx autres | 🔀 `/error/404` | 🔀 `/error/404` | Fallback |
| 5xx autres | 🔀 `/error/500` | 🔀 `/error/500` | Fallback |
| Network | 🔀 `/error/network` | 🔀 `/error/network` | Toujours système |

---

## 💡 Règle simple à retenir

```
┌──────────────────────────────────────┐
│  ERREUR DE L'UTILISATEUR             │
│  (mauvaise saisie, identifiants)     │
│  → Message dans le formulaire        │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  ERREUR DU SYSTÈME                   │
│  (serveur, réseau, accès)            │
│  → Page d'erreur dédiée              │
└──────────────────────────────────────┘
```

---

## 🎬 Démonstration visuelle

Ouvrez [error-demo.html](../demos/error-demo.html) dans votre navigateur pour voir une présentation visuelle interactive de la gestion des erreurs.
