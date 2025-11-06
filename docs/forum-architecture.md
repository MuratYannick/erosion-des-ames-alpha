# Module Forum - Érosion des Âmes

Architecture complète et indépendante du forum, avec design post-apocalyptique responsive mobile-first.

## Structure

```
forum/
├── components/
│   ├── layout/          # Layouts du forum
│   │   └── ForumLayout.jsx
│   ├── navigation/      # Navigation (Navbar, Breadcrumb)
│   │   ├── ForumNavbar.jsx
│   │   └── Breadcrumb.jsx
│   ├── cards/           # Cards d'affichage
│   │   ├── CategoryCard.jsx
│   │   ├── SectionCard.jsx
│   │   ├── TopicCard.jsx
│   │   └── PostCard.jsx
│   └── ui/              # Composants UI réutilisables
├── pages/               # Pages du forum
│   └── CategoriesPage.jsx
├── services/            # Services API
│   ├── api.js
│   ├── categoriesService.js
│   ├── sectionsService.js
│   ├── topicsService.js
│   └── postsService.js
├── hooks/               # Custom hooks
│   └── useBreakpoint.js
├── styles/              # Configuration design system
│   ├── breakpoints.js
│   └── theme.js
├── utils/               # Utilitaires
└── index.js             # Export centralisé
```

## Design System

### Breakpoints (Mobile-First)

- **mobile**: 0px (par défaut)
- **sm**: 640px (petite tablette / grand mobile)
- **md**: 768px (tablette)
- **lg**: 1024px (desktop)
- **xl**: 1280px (grand desktop)

### Palette de Couleurs Post-Apocalyptique

- **city**: Gris urbain délavé
- **ochre**: Orange rouillé (couleur principale)
- **nature**: Vert délavé
- **mutant**: Vert mutation
- **pure**: Bleu pur
- **blood**: Rouge sang
- **neutral**: Gris neutre

### Typographie

- **Titre du jeu**: 'Metal Mania' (font Google)
- **Titres sections**: 'Permanent Marker' (font Google)
- **Corps de texte**: system-ui
- **Code/dates**: Courier New

## Architecture Navbar

### Layout Navbar (hauteur 64px)

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo + Titre]  [Nav: Portail │ Cat1 │ Cat2 │ Cat3]  [User] │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumb: Home > Category > Section                       │
└─────────────────────────────────────────────────────────────┘
```

### Responsive

- **Desktop (≥ lg)**: Menu complet visible
- **Tablet/Mobile (< lg)**: Menu hamburger

## Composants

### ForumLayout

Layout principal avec navbar fixe, breadcrumb et zone de contenu.

```jsx
<ForumLayout breadcrumbItems={[
  { label: 'Catégorie', path: '/forum/category/slug' },
  { label: 'Section' }
]}>
  {/* Contenu */}
</ForumLayout>
```

### ForumNavbar

Navbar fixe avec:
- Logo + titre du jeu
- Navigation catégories (menu hamburger sur mobile)
- User menu avec dropdown

### Breadcrumb

Fil d'Ariane sous la navbar avec icône Home et navigation.

### Cards

#### CategoryCard
Affiche une catégorie avec stats (sections, topics)

#### SectionCard
Affiche une section avec icône, badges (privée, verrouillée), stats et dernier topic

#### TopicCard
Affiche un topic avec badges (épinglé, verrouillé), auteur, stats (réponses, vues)

#### PostCard
Affiche un post avec avatar, contenu markdown, actions (éditer, supprimer)

## Services API

Tous les services communiquent avec le backend Express via fetch.

### Authentification

Le token JWT est automatiquement ajouté dans les headers:
```js
Authorization: Bearer <token>
```

### Exemples

```js
import { getAllCategories, getCategoryBySlug } from '@/features/forum/services';

// Récupérer toutes les catégories
const categories = await getAllCategories();

// Récupérer une catégorie par slug
const category = await getCategoryBySlug('hors-roleplay');
```

## Hooks

### useBreakpoint

Hook pour détecter le breakpoint actuel et adapter l'UI.

```js
import { useBreakpoint, useIsMobile } from '@/features/forum/hooks/useBreakpoint';

const MyComponent = () => {
  const breakpoint = useBreakpoint(); // 'mobile' | 'sm' | 'md' | 'lg' | 'xl'
  const isMobile = useIsMobile(); // boolean

  return <div>Breakpoint: {breakpoint}</div>;
};
```

## Installation

### Dépendances

```bash
npm install lucide-react date-fns
```

- **lucide-react**: Icônes
- **date-fns**: Gestion des dates (format relatif)

### Variables d'environnement

Créer un fichier `.env` dans `frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Utilisation

### Importer le module

```js
// Import complet
import {
  ForumLayout,
  ForumNavbar,
  CategoryCard,
  CategoriesPage
} from '@/features/forum';

// Import spécifique
import { getAllCategories } from '@/features/forum/services';
```

### Ajouter les routes

Dans `App.jsx`:

```jsx
import { CategoriesPage } from '@/features/forum';

<Route path="/forum" element={<CategoriesPage />} />
```

## Prochaines Étapes

- [ ] Page SectionsPage (liste des sections d'une catégorie)
- [ ] Page TopicsPage (liste des topics d'une section)
- [ ] Page TopicDetailPage (affichage d'un topic avec ses posts)
- [ ] Formulaire création topic
- [ ] Formulaire création post
- [ ] Éditeur markdown
- [ ] Sélecteur de personnage (RP vs HRP)
- [ ] Gestion permissions côté frontend
- [ ] Pagination
- [ ] Recherche
- [ ] Notifications

## Notes

- **Indépendance**: Le forum a sa propre architecture, distincte du portail
- **Responsive**: Design mobile-first avec 5 breakpoints
- **PSA**: Thème post-apocalyptique cohérent avec le jeu
- **Accessibilité**: Attributs ARIA, navigation au clavier
- **Performance**: Code splitting, lazy loading des composants
