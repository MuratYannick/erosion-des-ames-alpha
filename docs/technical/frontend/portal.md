# Module Portal

Le module Portal est le point d'entree public du site Erosion des Ames.

---

## Vue d'ensemble

Le portail presente le projet aux visiteurs et offre un acces aux fonctionnalites principales.

| Aspect | Description |
|--------|-------------|
| Objectif | Site vitrine et accueil des utilisateurs |
| Public | Visiteurs et utilisateurs connectes |
| Status | Actif (Phase 1) |

---

## Pages

### Home (`/`)

Page d'accueil principale avec presentation du projet.

**Fichier** : `frontend/src/portal/pages/Home.jsx`

#### Sections

| Section | Description |
|---------|-------------|
| Hero | Titre, description et boutons d'action principaux |
| Features | Grille de 4 caracteristiques du jeu |
| CTA | Appel a l'action pour inscription |
| Stats | Statistiques de la communaute |

#### Hero Section

- Titre anime avec gradient
- Description du projet
- Boutons contextuels :
  - Non connecte : "Commencer l'aventure" (inscription) + "Se connecter"
  - Connecte : "Commencer l'aventure" (jeu)
- Indicateur de scroll anime

#### Features

4 cartes presentant les aspects du jeu :

| Feature | Description |
|---------|-------------|
| Un monde en perdition | Univers sombre, choix consequents |
| Communaute vivante | Forum actif, echanges entre joueurs |
| Systeme de jeu unique | Regles innovantes, narration |
| Progression persistante | Evolution des personnages |

Chaque feature utilise :
- Icone SVG personnalisee
- Composant `Card` avec hover effect
- Titre et description

#### CTA Section

Appel a l'action final avec :
- Message d'invitation
- Boutons adaptes selon l'etat de connexion
- Fond avec gradient decoratif

#### Stats Section

Statistiques affichees en grille :
- 100+ Joueurs actifs
- 50+ Parties en cours
- 1000+ Messages forum
- 24/7 Communaute active

#### Dependances

```jsx
import { useAuth } from '../../core/hooks/useAuth';
import { Button, Card } from '../../components/ui';
```

---

### About (`/about`)

Page de presentation detaillee du projet.

**Fichier** : `frontend/src/portal/pages/About.jsx`

#### Sections

| Section | Description |
|---------|-------------|
| Hero | Titre et introduction |
| Description | Le projet et notre vision |
| Timeline | Feuille de route du developpement |
| Technologies | Stack technique utilisee |
| Contact | Liens vers GitHub et email |

#### Description Cards

Deux cartes cote a cote (responsive) :

**Le Projet**
- Presentation de la plateforme
- Description des 3 modules (portail, forum, jeu)
- Themes explores (sombre, dilemmes moraux)

**Notre Vision**
- Philosophie du jeu de role narratif
- Accessibilite et profondeur
- Outils pour maitres de jeu et joueurs

#### Timeline (Feuille de route)

| Phase | Titre | Status |
|-------|-------|--------|
| Phase 1 | Fondations | Termine |
| Phase 2 | Forum communautaire | En cours |
| Phase 3 | Systeme de jeu | Planifie |
| Phase 4 | Fonctionnalites avancees | Planifie |

Badges de status avec couleurs :
- `completed` : Vert
- `in-progress` : Ambre
- `planned` : Gris

#### Technologies

Grille de 8 technologies utilisees :

| Technologie | Categorie | Couleur |
|-------------|-----------|---------|
| React | Frontend | Cyan |
| Vite | Build Tool | Violet |
| TailwindCSS | Styling | Teal |
| Node.js | Backend | Vert |
| Express | API | Gris |
| MySQL | Database | Bleu |
| Sequelize | ORM | Ambre |
| JWT | Auth | Rouge |

#### Contact

Liens externes :
- GitHub : `https://github.com/MuratYannick/erosion-des-ames`
- Email : `contact@erosion-des-ames.fr`

#### Dependances

```jsx
import { Card } from '../../components/ui';
```

---

## Structure des fichiers

```
portal/
└── pages/
    ├── Home.jsx     # Page d'accueil
    ├── About.jsx    # Page a propos
    └── index.js     # Exports
```

### Exports

```javascript
// portal/pages/index.js
export { default as Home } from './Home';
export { default as About } from './About';
```

---

## Routes

| Route | Composant | Protection |
|-------|-----------|------------|
| `/` | Home | Publique |
| `/about` | About | Publique |

---

## Design

### Couleurs utilisees

| Element | Classes Tailwind |
|---------|------------------|
| Fond principal | `bg-gray-900` |
| Fond sections | `bg-gray-900/50`, `bg-gray-800/30` |
| Texte principal | `text-white` |
| Texte secondaire | `text-gray-300`, `text-gray-400` |
| Accent primaire | `text-purple-400` |
| Accent secondaire | `text-amber-400` |

### Patterns visuels

- Gradients decoratifs en arriere-plan
- Effet blur sur les elements decoratifs
- Hover effects sur les cartes
- Transitions douces (0.2s - 0.5s)

### Responsive

- Mobile-first avec breakpoints Tailwind
- Hero : `text-5xl` -> `md:text-7xl`
- Grilles : `grid-cols-1` -> `md:grid-cols-2` -> `md:grid-cols-4`
- Navigation : Menu hamburger sur mobile

---

## Integration avec Core

Le module Portal utilise les fonctionnalites du module Core :

```jsx
// Verification de l'authentification
const { isAuthenticated, user } = useAuth();

// Affichage conditionnel
{isAuthenticated ? (
  <Link to="/game">...</Link>
) : (
  <Link to="/register">...</Link>
)}
```
