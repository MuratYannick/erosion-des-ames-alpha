# Tests unitaires - Frontend

## Vue d'ensemble

Le projet utilise **Vitest** comme framework de test, avec **React Testing Library** pour tester les composants React.

## Configuration

### Dépendances installées

- `vitest` - Framework de test (compatible Vite)
- `@vitest/ui` - Interface utilisateur pour les tests
- `@testing-library/react` - Utilitaires pour tester React
- `@testing-library/jest-dom` - Matchers supplémentaires pour DOM
- `@testing-library/user-event` - Simulation d'interactions utilisateur
- `jsdom` - Environnement DOM pour les tests

### Fichiers de configuration

- `vitest.config.js` - Configuration Vitest
- `src/test/setup.js` - Configuration globale des tests

## Exécution des tests

### Commandes disponibles

```bash
# Exécuter les tests en mode watch (rechargement automatique)
npm test

# Exécuter les tests une seule fois
npm run test:run

# Exécuter les tests avec l'interface UI
npm run test:ui

# Exécuter les tests avec couverture de code
npm run test:coverage
```

## Tests implémentés

### 1. errorHandler.test.js (18 tests)

Teste le gestionnaire d'erreurs principal qui redirige vers les pages d'erreur appropriées.

**Couverture :**
- Erreurs réseau (Failed to fetch, Network Error, offline)
- Codes HTTP (401, 403, 404, 500, 503)
- Option `skipValidationErrors` pour formulaires
- Comportement fallback pour erreurs non gérées
- Logging des erreurs

**Exemple de test :**
```javascript
it('should redirect to /error/network for "Failed to fetch" error', () => {
  const error = new Error('Failed to fetch');
  const result = handleError(error, mockNavigate);

  expect(mockNavigate).toHaveBeenCalledWith('/error/network');
  expect(result).toBe(true);
});
```

### 2. GlobalErrorBoundary.test.jsx (6 tests)

Teste le composant ErrorBoundary qui attrape les erreurs React non gérées.

**Couverture :**
- Rendu normal des enfants sans erreur
- Affichage de la page d'erreur 500 quand une erreur est attrapée
- Présence des boutons retour et accueil
- Logging console des erreurs
- Message thématique

**Exemple de test :**
```javascript
it('should display error page when an error is caught', () => {
  render(
    <BrowserRouter>
      <GlobalErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GlobalErrorBoundary>
    </BrowserRouter>
  );

  expect(screen.getByText('500')).toBeInTheDocument();
  expect(screen.getByText('Erreur Interne')).toBeInTheDocument();
});
```

### 3. Login.test.jsx (8 tests)

Teste le formulaire de connexion et la gestion des erreurs d'authentification.

**Couverture :**
- Rendu du formulaire
- Affichage erreur 401 dans le formulaire
- Redirection pour erreurs 500
- Redirection pour erreurs réseau
- Effacement erreur lors de saisie
- Navigation succès
- État de chargement
- Lien vers inscription

**Exemple de test :**
```javascript
it('should display error message for 401 authentication errors', async () => {
  const user = userEvent.setup();
  const error = {
    response: { status: 401 },
    message: 'Email ou mot de passe incorrect',
  };

  api.authService.login.mockRejectedValue(error);

  render(<BrowserRouter><Login /></BrowserRouter>);

  await user.type(screen.getByLabelText(/email/i), 'test@test.com');
  await user.type(screen.getByLabelText(/mot de passe/i), 'wrongpassword');
  await user.click(screen.getByRole('button', { name: /se connecter/i }));

  await waitFor(() => {
    expect(screen.getByText('Email ou mot de passe incorrect')).toBeInTheDocument();
  });
});
```

### 4. Register.test.jsx (11 tests)

Teste le formulaire d'inscription et sa validation.

**Couverture :**
- Rendu du formulaire
- Validation mots de passe non correspondants
- Validation mot de passe trop court
- Affichage erreur 409 (conflit) dans le formulaire
- Redirection pour erreurs 500
- Redirection pour erreurs réseau
- Effacement erreur lors de saisie
- Navigation succès
- État de chargement
- Lien vers connexion
- Indice exigence mot de passe

## Résultats

```
Test Files  4 passed (4)
Tests      43 passed (43)
Duration   ~11s
```

### Détails par fichier

| Fichier | Tests | Statut |
|---------|-------|--------|
| errorHandler.test.js | 18 | ✅ Tous passés |
| GlobalErrorBoundary.test.jsx | 6 | ✅ Tous passés |
| Login.test.jsx | 8 | ✅ Tous passés |
| Register.test.jsx | 11 | ✅ Tous passés |

## Bonnes pratiques

### 1. Mocking

Les tests utilisent `vi.mock()` pour mocker les dépendances :
```javascript
vi.mock('../services/api');
vi.mock('../utils/localStorage');
```

### 2. Cleanup automatique

Le setup test effectue un cleanup automatique après chaque test :
```javascript
afterEach(() => {
  cleanup();
});
```

### 3. User Event

Utilisation de `@testing-library/user-event` pour simuler les interactions :
```javascript
const user = userEvent.setup();
await user.type(input, 'text');
await user.click(button);
```

### 4. Wait For

Utilisation de `waitFor` pour les opérations asynchrones :
```javascript
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

## Ajout de nouveaux tests

### Structure d'un test

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('MonComposant', () => {
  beforeEach(() => {
    // Nettoyage des mocks
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<MonComposant />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Conventions de nommage

- Fichiers de test : `*.test.js` ou `*.test.jsx`
- Placement : À côté du fichier testé
- Describe : Nom du composant/module
- It : Description comportement attendu ("should...")

## Dépannage

### Tests qui échouent

1. Vérifier que les mocks sont correctement configurés
2. Vérifier que `vi.clearAllMocks()` est appelé dans `beforeEach`
3. Utiliser `screen.debug()` pour voir le DOM rendu
4. Vérifier les erreurs async avec `waitFor`

### Erreurs de timeout

Si les tests prennent trop de temps :
```javascript
it('test name', async () => {
  // code
}, 10000); // timeout de 10 secondes
```

### Console.error dans les tests

Les `console.error` sont mockés dans le setup pour éviter de polluer la sortie des tests.

## Couverture de code

Pour générer un rapport de couverture :
```bash
npm run test:coverage
```

Le rapport sera généré dans `coverage/`.

## CI/CD

Les tests peuvent être intégrés dans un pipeline CI/CD :
```bash
npm run test:run
```

Cette commande exécute les tests une seule fois et retourne un code de sortie non-zéro en cas d'échec.
