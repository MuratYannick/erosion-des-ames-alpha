# Avancement de la Branche - Érosion des Âmes

## Informations de Branche

**Branche actuelle**: feature/portail-interface
**Branche source**: main
**Créée le**: 2025-10-23
**Objectif**: Mise en place de l'interface du portail avec le thème post-apocalyptique

---

## Contexte

Le site sera composé de 3 grandes parties distinctes:
1. **Le Portail** - Page d'accueil et présentation
2. **Le Forum** - Communication entre joueurs
3. **Le Jeu** - Interface de jeu

Cette branche se concentre sur la mise en place de l'interface du portail avec le thème visuel post-apocalyptique de l'ancien projet.

---

## Tâches de la Branche

### Configuration du Thème
- [x] Récupérer le thème de l'ancien projet (tailwind.config.js)
- [x] Appliquer les couleurs personnalisées au nouveau projet
- [x] Configurer les polices Google Fonts (Metal Mania, Permanent Marker, Bangers, Creepster)
- [x] Mettre à jour index.html avec les liens Google Fonts

### Architecture du Portail
- [ ] Planifier la structure des composants
- [ ] Créer le layout principal du portail
- [ ] Créer le composant Header/Navigation
- [ ] Créer le composant Hero/Bannière principale
- [ ] Créer les sections de présentation
- [ ] Créer le composant Footer

### Intégration
- [ ] Intégrer le portail dans le routing
- [ ] Tester le responsive design
- [ ] Valider l'accessibilité

---

## Commits

### Commit 1 (à venir)
**Message**: feat(frontend): configuration du thème post-apocalyptique

**Fichiers modifiés**:
- frontend/tailwind.config.js
- frontend/index.html
- docs/BRANCH_PROGRESS.md

**Description**: Configuration complète du thème visuel post-apocalyptique
- Ajout des palettes de couleurs (city, ochre, nature, mutant, pure, blood, neutral)
- Configuration des polices Google Fonts (Metal Mania, Permanent Marker, Bangers, Creepster)
- Mise à jour du titre et de la langue du document HTML

---

## Thème Post-Apocalyptique

### Palettes de Couleurs

**city** (Gris urbains)
- Usage: Arrière-plans, éléments neutres, interface sombre
- Nuances: Du gris très clair (#f8f9fa) au noir profond (#010409)

**ochre** (Ocre/Rouille)
- Usage: Éléments d'accentuation, boutons, alertes
- Nuances: Sable pâle (#fffbeb) à rouille profonde (#431405)

**nature** (Verts)
- Usage: Éléments positifs, nature, végétation
- Nuances: Vert clair (#f0fdf4) à vert très foncé (#021208)

**mutant** (Faction Éveillés)
- light: #4ade80
- default: #22c55e
- dark: #16a34a

**pure** (Faction Purs)
- light: #60a5fa
- default: #3b82f6
- dark: #2563eb

**blood** (Rouge sang)
- Usage: Dangers, erreurs, éléments critiques
- Nuances: Rose pâle (#fef2f2) à rouge très foncé (#1a0000)

**neutral** (Neutres)
- light: #a8a29e
- default: #78716c
- dark: #57534e

### Polices

**Metal Mania** (font-titre-Jeu)
- Usage: Titres principaux, logo, éléments majeurs

**Permanent Marker** (font-texte-corps)
- Usage: Texte de contenu, paragraphes

**Bangers** (font-alternative-1)
- Usage: Titres secondaires, emphase

**Creepster** (font-alternative-2)
- Usage: Éléments spéciaux, ambiance horror

---

## Architecture Prévue du Portail

### Structure des Pages
```
/                   -> Page d'accueil du portail
/login              -> Page de connexion (existante)
/register           -> Page d'inscription (existante)
/forum              -> Section forum (à venir)
/game               -> Interface de jeu (à venir)
```

### Composants du Portail

**Layout**
- `PortalLayout.jsx` - Layout principal avec header et footer

**Navigation**
- `Header.jsx` - En-tête avec logo et navigation
- `Navigation.jsx` - Menu de navigation
- `UserMenu.jsx` - Menu utilisateur (connecté/déconnecté)

**Sections**
- `Hero.jsx` - Bannière principale avec titre et accroche
- `About.jsx` - Présentation du jeu
- `Factions.jsx` - Présentation des factions (Éveillés vs Purs)
- `Features.jsx` - Fonctionnalités du jeu
- `CallToAction.jsx` - Appel à l'action (inscription/connexion)

**Footer**
- `Footer.jsx` - Pied de page avec liens et informations

---

## Changements Techniques

### Fichiers modifiés

**frontend/tailwind.config.js**
- Ajout de 7 palettes de couleurs personnalisées
- Configuration de 4 polices Google Fonts
- Conservation des polices système par défaut

**frontend/index.html**
- Changement de langue: `en` -> `fr`
- Ajout des liens Google Fonts avec preconnect
- Mise à jour du titre: "frontend" -> "Érosion des Âmes - Alpha"

---

## Notes de Développement

### Décisions de Design
- Privilégier les tons sombres (city-900, city-950) pour l'arrière-plan
- Utiliser ochre pour les accents et éléments interactifs
- Réserver blood pour les alertes et dangers
- Les polices alternatives (Bangers, Creepster) doivent être utilisées avec parcimonie

### Responsive Design
- Mobile-first approach
- Breakpoints Tailwind standard (sm, md, lg, xl, 2xl)
- Navigation adaptative (hamburger menu sur mobile)

### Performance
- Polices chargées avec `display=swap` pour éviter FOIT (Flash Of Invisible Text)
- Utilisation de `preconnect` pour optimiser le chargement des fonts

---

## Prochaines Actions

1. Créer la structure de dossiers pour les composants du portail
2. Implémenter le PortalLayout avec Header et Footer
3. Créer la section Hero avec le titre du jeu
4. Ajouter les sections About, Factions, Features
5. Intégrer le routing pour le portail
6. Tester et valider le responsive

---

## Checklist avant Commit

- [x] Thème Tailwind configuré
- [x] Google Fonts ajoutées
- [x] Documentation mise à jour
- [ ] Composants du portail créés
- [ ] Tests visuels validés

---

## Checklist avant Merge vers Main

- [ ] Tous les composants du portail implémentés
- [ ] Responsive design validé sur mobile/tablette/desktop
- [ ] Navigation fonctionnelle
- [ ] Integration avec l'authentification testée
- [ ] Code commité sur la branche
- [ ] Branche poussée vers GitHub
- [ ] PROJECT_PROGRESS.md prêt pour mise à jour

---

**Dernière mise à jour**: 2025-10-23
**Statut**: Configuration du thème terminée - Prêt pour développement des composants
