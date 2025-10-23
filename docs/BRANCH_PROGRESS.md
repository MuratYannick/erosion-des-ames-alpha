# Avancement de la Branche - Érosion des Âmes

## Informations de Branche

**Branche actuelle**: feature/portail-interface
**Branche source**: main
**Créée le**: 2025-10-23
**Objectif**: Mise en place de l'interface du portail avec le thème post-apocalyptique et navigation améliorée

---

## Contexte

Le site sera composé de 3 grandes parties distinctes:
1. **Le Portail** - Page d'accueil et présentation
2. **Le Forum** - Communication entre joueurs
3. **Le Jeu** - Interface de jeu

Cette branche se concentre sur la mise en place de l'interface du portail avec le thème visuel post-apocalyptique de l'ancien projet, ainsi que l'amélioration de la navigation avec un menu latéral coulissant.

---

## Tâches de la Branche

### Configuration du Thème
- [x] Récupérer le thème de l'ancien projet (tailwind.config.js)
- [x] Appliquer les couleurs personnalisées au nouveau projet
- [x] Configurer les polices Google Fonts (Metal Mania, Permanent Marker, Bangers, Creepster)
- [x] Mettre à jour index.html avec les liens Google Fonts

### Architecture du Portail
- [x] Planifier la structure des composants
- [x] Créer le layout principal du portail
- [x] Créer le composant Header/Navigation
- [x] Créer le composant Hero/Bannière principale
- [x] Créer les sections de présentation (About, Factions, Features)
- [x] Créer le composant Footer

### Navigation Améliorée
- [x] Rendre le Header fixe en haut lors du scroll
- [x] Renommer "Accueil" en "Portail" dans la navigation principale
- [x] Créer un menu sidebar coulissant pour la navigation secondaire
- [x] Ajouter les pages: Intro, Univers, Règlement & CGU
- [x] Intégrer le sidebar dans le PortalLayout

### Intégration
- [x] Intégrer le portail dans le routing
- [x] Tester le responsive design
- [x] Valider le thème et la navigation

---

## Commits

### Commit 1
**Message**: feat(frontend): interface complète du portail avec thème post-apocalyptique

**Fichiers créés**:
- frontend/src/components/portal/layout/Footer.jsx
- frontend/src/components/portal/layout/PortalLayout.jsx
- frontend/src/components/portal/navigation/Header.jsx
- frontend/src/components/portal/navigation/Navigation.jsx
- frontend/src/components/portal/navigation/UserMenu.jsx
- frontend/src/components/portal/sections/About.jsx
- frontend/src/components/portal/sections/Factions.jsx
- frontend/src/components/portal/sections/Features.jsx
- frontend/src/components/portal/sections/Hero.jsx
- frontend/src/pages/portal/Portal.jsx

**Fichiers modifiés**:
- frontend/tailwind.config.js (ajout du thème complet)
- frontend/index.html (Google Fonts + titre)
- frontend/src/App.jsx (routing mis à jour)
- frontend/src/pages/Login.jsx (thème appliqué)
- frontend/src/pages/Register.jsx (thème appliqué)

### Commit 2
**Message**: feat(frontend): navigation améliorée avec header fixe et sidebar coulissant

**Fichiers créés**:
- frontend/src/components/portal/navigation/PortalSidebar.jsx
- frontend/src/pages/portal/Intro.jsx
- frontend/src/pages/portal/Univers.jsx
- frontend/src/pages/portal/Reglement.jsx

**Fichiers modifiés**:
- frontend/src/components/portal/navigation/Header.jsx (header fixe)
- frontend/src/components/portal/navigation/Navigation.jsx (Accueil → Portail)
- frontend/src/components/portal/layout/PortalLayout.jsx (sidebar + padding)
- frontend/src/App.jsx (nouvelles routes)

### Commit 3
**Message**: feat(frontend): ajout banner.png aux sections Hero et pages avec overlay

**Changements**:
- Hero.jsx: Restructuration avec banner.png en background
- Titre/sous-titre sur l'image avec overlay sombre
- Description, boutons CTA et badge Alpha déplacés sous la bannière
- Factions.jsx: Refonte complète pour jeu de rôle sur table
- Suppression des références MMORPG et pouvoirs surnaturels
- Factions renommées avec philosophies détaillées
- Clans Neutres ajoutés (non jouables en Alpha)

### Commit 4
**Message**: refactor(frontend): ajustements visuels section Factions

**Changements**:
- Suppression de la section "atouts" (factions équivalentes)
- Bordures assombries (nature-800/900, blue-900/950)
- Amélioration lisibilité philosophie (text-city-200)
- Letter spacing ajouté (tracking-wide/wider)
- Footer mis à jour (Portail au lieu d'Accueil)

### Commit 5
**Message**: feat(frontend): ajout des bannières aux pages Intro, Univers et Règlement

**Changements**:
- Intro.jsx: Bannière avec sous-titre "Bienvenue dans l'univers dévasté d'Érosion des Âmes"
- Univers.jsx: Bannière avec sous-titre "Le lore d'un monde post-apocalyptique"
- Reglement.jsx: Bannière avec sous-titre "Les règles pour jouer ensemble"
- Structure cohérente avec overlay et drop-shadows
- Contenu adapté au contexte JdR (suppression éléments surnaturels)

### Commit 6
**Message**: feat(frontend): restructuration page Univers avec navigation par sections

**Changements**:
- Navigation interactive avec 4 sections: Mise en situation, Factions et clans, Survivre, Bestiaire
- Section "Mise en situation" complète avec texte original
- Image campFire.png positionnée entre les deux parties du texte
- Sections placeholder pour complétion ultérieure
- Utilisation de useState pour gestion de l'affichage

### Commit 7
**Message**: feat(frontend): ajout texte original "Mise en situation" avec effets image

**Changements**:
- Titre: "Quelque part, au milieu d'un petit village en ruine..."
- Texte complet récupéré de l'ancien projet (récit des anciens)
- Image campFire.png avec filtre sepia(65%)
- Animation hover: sepia(0%) sur transition de 2.5s
- Structure: Partie 1 → Image → Partie 2

### Commit 8
**Message**: refactor(frontend): réduction taille image campFire

**Changements**:
- Mobile: w-2/3 (au lieu de w-3/4)
- Desktop: w-1/2 (au lieu de w-2/3)
- Conservation des effets sepia avec transition

---

## Changements Techniques Détaillés

### Commit 2 - Navigation Améliorée

### Header Fixe
**Fichier**: frontend/src/components/portal/navigation/Header.jsx
- Ajout des classes `fixed top-0 left-0 right-0 z-50`
- Le header reste visible en haut de l'écran lors du scroll

### PortalLayout
**Fichier**: frontend/src/components/portal/layout/PortalLayout.jsx
- Ajout d'un `pt-24` sur le main pour compenser le header fixe
- Intégration du composant PortalSidebar

### PortalSidebar (Nouveau)
**Fichier**: frontend/src/components/portal/navigation/PortalSidebar.jsx
- Menu coulissant sur le côté gauche
- Bouton toggle fixe à gauche sous le header
- Overlay pour mobile (fermeture au clic)
- 4 liens de navigation: Accueil, Intro, Univers, Règlement & CGU
- Icônes pour chaque item
- Animation de transition smooth
- Active state pour le lien courant

### Pages Secondaires du Portail

**Intro.jsx** - Page d'introduction
- Mise en situation narrative
- Présentation de l'Érosion
- Introduction aux deux factions
- Citation des Archives des Survivants

**Univers.jsx** - Page de lore
- Navigation par sections (Mise en situation, Factions et clans, Survivre, Bestiaire)
- Section "Mise en situation" complète avec récit des anciens
- Image campFire.png interactive avec filtre sepia
- Sections placeholder pour complétion future
- Gestion d'état avec useState pour navigation

**Reglement.jsx** - Règlement et CGU
- 4 sections de règles (Respect, Communication, Gameplay, Sanctions)
- Conditions Générales d'Utilisation détaillées (6 articles)
- Avertissement de version Alpha
- Section contact

### Routing
**Fichier**: frontend/src/App.jsx
- Routes ajoutées:
  - `/intro` → Intro
  - `/univers` → Univers
  - `/reglement` → Reglement

---

## Architecture des Composants

```
PortalLayout
├── Header (fixe en haut)
│   ├── Logo & Titre
│   ├── Navigation (Portail/Forum/Jeu)
│   └── UserMenu
├── PortalSidebar (coulissant à gauche)
│   └── Navigation secondaire (Accueil/Intro/Univers/Règlement)
├── Main Content (pt-24)
│   └── Pages: Portal, Intro, Univers, Reglement
└── Footer
```

---

## Design & UX

### Header Fixe
- Toujours visible lors du scroll
- Facilite la navigation sur les pages longues
- Z-index 50 pour rester au-dessus du contenu

### Sidebar Coulissant
- Bouton toggle visible à gauche (z-index 40)
- Animation smooth (transform translate)
- Fermeture automatique au clic sur un lien
- Overlay semi-transparent sur mobile
- Indicateur visuel du lien actif (bg-ochre-600)

### Pages de Contenu
- Structure cohérente avec sections bien définies
- Utilisation du thème post-apocalyptique
- Navigation entre les pages avec liens en bas
- Contenu riche et immersif

---

## Tests Effectués

✓ Header reste fixe lors du scroll
✓ Sidebar s'ouvre et se ferme correctement
✓ Navigation principale affiche "Portail" au lieu de "Accueil"
✓ Toutes les pages du portail sont accessibles
✓ Le responsive fonctionne sur mobile/tablette/desktop
✓ Les liens actifs sont bien mis en évidence
✓ Le thème est cohérent sur toutes les pages

---

## État Actuel de la Branche

### ✅ Complété
- [x] Thème post-apocalyptique intégré
- [x] Navigation principale avec Header fixe
- [x] Sidebar de navigation secondaire avec bouton de fermeture
- [x] Page Hero avec banner.png en background
- [x] Section Factions adaptée au JdR sur table (sans pouvoirs surnaturels)
- [x] Page Intro avec bannière
- [x] Page Univers restructurée avec navigation par sections
- [x] Section "Mise en situation" complète avec texte original et image interactive
- [x] Page Règlement avec bannière
- [x] Footer mis à jour

### 🔄 En cours / À compléter
- [ ] Page Univers - Section "Les factions et ses clans" (placeholder)
- [ ] Page Univers - Section "Survivre dans ce monde cruel" (placeholder)
- [ ] Page Univers - Section "Le bestiaire" (placeholder)
- [ ] Page Règlement - Contenu à définir
- [ ] Section Features de la page Portal (à revoir plus tard)

### 📋 Prochaines Actions
1. ✅ Tous les commits effectués (8 commits au total)
2. Compléter les sections manquantes de la page Univers
3. Définir le contenu de la page Règlement
4. Pousser vers GitHub
5. Merger dans main après validation

---

## Notes de Développement

### Décisions de Design
- Le sidebar utilise la même palette de couleurs que le reste du portail
- Les icônes emoji rendent le menu plus visuel et engageant
- Le header fixe améliore l'UX sur les pages avec beaucoup de contenu
- L'overlay mobile évite les problèmes de scroll avec le sidebar ouvert

### Performance
- Le sidebar n'est rendu qu'une seule fois par le PortalLayout
- L'état d'ouverture/fermeture est géré localement dans le composant
- Les transitions CSS sont optimisées pour la performance

### Points d'Attention
- La page Règlement garde sa structure actuelle et n'a pas été modifiée
- Les sections placeholder de la page Univers sont prêtes à recevoir du contenu
- L'image campFire.png utilise des filtres CSS modernes (sepia) compatibles avec tous les navigateurs récents
- Le state management de la navigation par sections est local au composant Univers

---

## Statistiques de la Branche

**Total de commits**: 8
**Fichiers créés**: 13
**Fichiers modifiés**: 15+
**Lignes de code ajoutées**: ~2000+
**Durée de développement**: Session continue

---

**Dernière mise à jour**: 2025-10-23
**Statut**: Interface portail complète - 8 commits effectués - Prêt pour push GitHub
