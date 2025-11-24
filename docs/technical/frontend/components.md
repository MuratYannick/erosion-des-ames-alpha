# Documentation des Composants UI

Ce document detaille les composants reutilisables du projet Erosion des Ames.

---

## Composants UI (`components/ui/`)

### Button

Bouton configurable avec plusieurs variants visuels et tailles.

**Fichier** : `frontend/src/components/ui/Button.jsx`

#### Props

| Prop | Type | Defaut | Description |
|------|------|--------|-------------|
| `variant` | `string` | `'primary'` | Style visuel du bouton |
| `size` | `string` | `'md'` | Taille du bouton |
| `disabled` | `boolean` | `false` | Desactive le bouton |
| `className` | `string` | `''` | Classes CSS additionnelles |
| `children` | `node` | - | Contenu du bouton |
| `...props` | `any` | - | Props HTML standard (onClick, type, etc.) |

#### Variants

| Variant | Apparence |
|---------|-----------|
| `primary` | Gradient violet, shadow violet, texte blanc |
| `secondary` | Gradient ambre, shadow ambre, texte blanc |
| `outline` | Bordure violette, fond transparent, texte violet |
| `ghost` | Fond transparent, texte gris, hover blanc |
| `danger` | Gradient rouge, shadow rouge, texte blanc |

#### Tailles

| Size | Padding | Font size |
|------|---------|-----------|
| `sm` | `px-3 py-1.5` | `text-sm` |
| `md` | `px-5 py-2.5` | `text-base` |
| `lg` | `px-8 py-3.5` | `text-lg` |

#### Utilisation

```jsx
import { Button } from '../../components/ui';

// Bouton primaire (defaut)
<Button onClick={handleClick}>Valider</Button>

// Bouton secondaire large
<Button variant="secondary" size="lg">Commencer</Button>

// Bouton outline
<Button variant="outline" size="sm">Annuler</Button>

// Bouton ghost dans navigation
<Button variant="ghost" onClick={handleLogout}>Deconnexion</Button>

// Bouton danger desactive
<Button variant="danger" disabled>Supprimer</Button>

// Avec classes additionnelles
<Button className="w-full mt-4">Pleine largeur</Button>
```

---

### Card

Container avec fond semi-transparent, bordure et effet blur.

**Fichier** : `frontend/src/components/ui/Card.jsx`

#### Props

| Prop | Type | Defaut | Description |
|------|------|--------|-------------|
| `title` | `string` | `undefined` | Titre optionnel dans le header |
| `children` | `node` | - | Contenu de la carte |
| `className` | `string` | `''` | Classes CSS additionnelles pour le container |
| `headerClassName` | `string` | `''` | Classes CSS additionnelles pour le header |

#### Structure

La carte a deux modes :
1. **Sans titre** : Container simple avec padding `p-6`
2. **Avec titre** : Header avec titre + contenu avec padding `p-6`

#### Styles par defaut

- Fond : `bg-gray-800/50` (gris semi-transparent)
- Effet : `backdrop-blur-sm` (flou leger)
- Bordure : `border border-gray-700/50`
- Coins : `rounded-xl`
- Ombre : `shadow-xl`

#### Utilisation

```jsx
import { Card } from '../../components/ui';

// Carte simple
<Card>
  <p>Contenu de la carte</p>
</Card>

// Carte avec titre
<Card title="Mon titre">
  <p>Contenu avec header</p>
</Card>

// Carte avec hover effect
<Card className="hover:border-purple-500/50 transition-colors">
  <p>Carte interactive</p>
</Card>

// Carte avec classes personnalisees
<Card
  title="Statistiques"
  className="h-full"
  headerClassName="bg-purple-900/20"
>
  <p>Contenu avec style personnalise</p>
</Card>
```

---

## Composants Layout (`components/layout/`)

### Layout

Wrapper principal qui structure toutes les pages avec Header et Footer.

**Fichier** : `frontend/src/components/layout/Layout.jsx`

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `node` | Contenu de la page |

#### Structure

```
div (min-h-screen flex flex-col)
├── Header
├── main (flex-grow)
│   └── {children}
└── Footer
```

#### Utilisation

```jsx
import { Layout } from '../../components/layout';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Layout>
  );
}
```

---

### Header

En-tete responsive avec logo, navigation et menu utilisateur.

**Fichier** : `frontend/src/components/layout/Header.jsx`

#### Fonctionnalites

- Logo avec lien vers accueil
- Navigation desktop avec liens
- Menu utilisateur (connexion/inscription ou profil/deconnexion)
- Menu mobile hamburger
- Liens desactives pour modules a venir (Forum, Jeu)

#### Navigation

| Label | Route | Status |
|-------|-------|--------|
| Accueil | `/` | Actif |
| A propos | `/about` | Actif |
| Forum | `/forum` | Desactive (bientot) |
| Jeu | `/game` | Desactive (bientot) |

#### Dependances

- `useAuth` : Pour l'etat d'authentification
- `Button` : Pour les boutons d'action
- `react-router-dom` : Pour la navigation

---

### Footer

Pied de page simple avec copyright et liens.

**Fichier** : `frontend/src/components/layout/Footer.jsx`

#### Contenu

- Copyright avec annee dynamique
- Lien "Mentions legales" (`/mentions-legales`)
- Lien "Contact" (`/contact`)

---

## Imports

### Import des composants UI

```jsx
// Import nomme depuis l'index
import { Button, Card } from '../../components/ui';

// Ou import direct (moins recommande)
import Button from '../../components/ui/Button';
```

### Import des composants Layout

```jsx
// Import nomme depuis l'index
import { Header, Footer, Layout } from '../../components/layout';

// Ou import direct
import Layout from '../../components/layout/Layout';
```

---

## Bonnes pratiques

### Extension des composants

Pour ajouter des fonctionnalites sans modifier le composant de base :

```jsx
// Composant wrapper specifique
const PrimaryButton = ({ children, ...props }) => (
  <Button variant="primary" {...props}>
    {children}
  </Button>
);

// Composant compose
const FeatureCard = ({ icon, title, description }) => (
  <Card className="hover:border-purple-500/50 transition-colors">
    <div className="flex items-start space-x-4">
      <div className="text-purple-400">{icon}</div>
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  </Card>
);
```

### Classes conditionnelles

Utiliser des template literals pour les classes dynamiques :

```jsx
<Button
  variant={isActive ? 'primary' : 'outline'}
  className={`${isFullWidth ? 'w-full' : ''} ${extraClass}`}
>
  {label}
</Button>
```
