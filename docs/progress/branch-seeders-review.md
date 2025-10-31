# Avancement de la Branche - Révision Seeders Production

## Informations de Branche

**Branche actuelle**: feature/seeders-review
**Branche parent**: main
**Créée le**: 2025-10-31
**Objectif**: Révision complète des seeders de production avec les données définitives du jeu "Érosion des Âmes" et restructuration complète du système de seeding

---

## Contexte

Cette branche restructure complètement les seeders pour séparer les données de développement (dev) des données de production (prod), implémente les vraies données du jeu post-apocalyptique "Érosion des Âmes", et refactore le système de seeding avec des scripts Node.js personnalisés.

---

## Tâches de la Branche

### Restructuration des Seeders ✅
- [x] Créer sous-répertoire `backend/seeders/dev/` pour données de développement
- [x] Créer sous-répertoire `backend/seeders/prod/` pour données de production
- [x] Migrer anciens seeders démo vers dev/
- [x] Ajouter scripts npm pour seeders dev et prod
- [x] Documenter la nouvelle structure dans README

### Migration Forum - Ajout de Slugs ✅
- [x] Ajout champ `slug` dans les tables categories, sections, topics
- [x] Création migrations pour ajout des slugs
- [x] Mise à jour des modèles Category, Section, Topic
- [x] Mise à jour seeders prod avec slugs générés

### Seeders de Production (prod/) ✅

#### Utilisateurs et Ethnies
- [x] 001-prod-users.js: Seeder vide (utilisateurs créés par inscription)
- [x] 002-prod-ethnies.js: 2 ethnies (Les Éveillés, Les Inaltérés)

#### Factions
- [x] 003-prod-factions.js: 2 factions jouables
  - Les Éclaireurs de l'Aube Nouvelle (Éveillés)
  - Les Veilleurs de l'Ancien Monde (Inaltérés)
- [x] Ajout champ `outpost_name` dans migration et modèle Faction

#### Clans
- [x] 004-prod-clans.js: 22 clans au total
  - 2 clans leaders (non jouables)
  - 10 clans jouables (5 par faction)
  - 10 clans neutres (non jouables pour le moment)

#### Personnages
- [x] 005-prod-characters.js: Seeder vide (characters créés par les joueurs)

#### Forum
- [x] 006-prod-categories.js: 3 catégories avec slugs
  - Forum Général
  - Forum HRP (Hors Role-Play)
  - Forum RP (Role-Play)
- [x] 007-prod-sections.js: 79 sections avec slugs
  - 4 sections Forum Général
  - 2 sections Forum HRP
  - 3 sections principales Forum RP
  - 70 sous-sections (factions, clans, neutres)
- [x] 008-prod-topics.js: 4 topics avec slugs
  - Message de bienvenue
  - Règlement du Forum (avec contenu complet)
  - CGU (avec contenu complet)
  - Présentation utilisateurs
- [x] 009-prod-posts.js: 3 posts
  - Message de bienvenue
  - Règlement du Forum complet (7 sections)
  - CGU complètes (8 sections, âge minimum 16 ans)

### Seeders de Développement (dev/) ✅

#### Utilisateurs et Ethnies
- [x] 101-dev-users.js: 13 comptes de test
  - 1 admin, 1 moderator, 1 game-master
  - 9 comptes player avec différents états
  - Tous avec le même mot de passe test

#### Ethnies, Factions, Clans
- [x] 102-dev-ethnies.js: Seeder vide (données en prod)
- [x] 103-dev-factions.js: Seeder vide (données en prod)
- [x] 104-dev-clans.js: Seeder vide (données en prod)

#### Personnages
- [x] 105-dev-characters.js: 7 personnages de test
  - Personnages pour les comptes player
  - Couvrant différentes factions/clans

#### Forum
- [x] 106-dev-categories.js: Seeder vide (données en prod)
- [x] 107-dev-sections.js: Seeder vide (données en prod)
- [x] 108-dev-topics.js: 7 topics de test
  - Topics HRP (annonces, suggestions, présentations)
  - Topics RP (sections privées et publiques)
- [x] 109-dev-posts.js: 15 posts de test
  - Posts HRP et RP
  - Respectant les permissions privé/public

### Refactoring Système de Seeding ✅
- [x] Création scripts Node.js personnalisés
  - seedProd.js: Exécute seeders prod
  - seedDev.js: Exécute seeders dev
  - seedAll.js: Exécute tous les seeders
  - seedUndoAll.js: Vide toutes les tables
  - seedInit.js: Init mode prod (undo → prod)
  - seedAllComplete.js: Init complète (undo → prod → dev)
- [x] Mise à jour commandes npm
- [x] Optimisation commandes db:reset

---

## Structure des Données Production

### Ethnies (2)
1. **Les Éveillés** - Mutants avec peau grisâtre
2. **Les Inaltérés** - Humains non mutés

### Factions (2)
1. **Les Éclaireurs de l'Aube Nouvelle** (Éveillés)
   - Avant-poste: L'Oasis des Transformés
   - Idéologie: Évolution divine par mutation, éradication des non-mutants

2. **Les Veilleurs de l'Ancien Monde** (Inaltérés)
   - Avant-poste: La Citadelle du Renouveau
   - Idéologie: Technologie ancestrale, pureté humaine, éradication des mutants

### Clans Éclaireurs (6 clans - 1 leader + 5 jouables)
- **Clan Leader**: Les Prophètes de l'Harmonie (non jouable)
- **Jouables**:
  1. La Caste des Symbiotes (Ressources & Adaptation)
  2. La Caste des Sensitifs (Exploration & Perception)
  3. La Caste des Forgerons de Chair (Guérison & Évolution)
  4. La Caste des Sentinelles du Chaos (Défense & Confrontation)
  5. La Caste des Scrutateurs (Connaissance & Mystères)

### Clans Veilleurs (6 clans - 1 leader + 5 jouables)
- **Clan Leader**: Les Élus d'Avant (non jouable)
- **Jouables**:
  1. Le Clan des Sentinelles (Défense & Ordre)
  2. Le Clan des Pourvoyeurs (Ressources & Production)
  3. Le Clan des Archivistes (Savoir & Tradition)
  4. Le Clan des Purificateurs (Santé & Hygiène)
  5. Le Clan des Explorateurs (Reconnaissance & Découverte)

### Clans Neutres (10 clans - tous non jouables pour le moment)
1. Les Veilleurs des Ruines (archéologues impartiaux)
2. Le Peuple des Ombres (mutants furtifs)
3. Les Vagabonds du Vent (marchands nomades)
4. Les Artisans du Réemploi (réparateurs)
5. Les Frères de la Terre Brûlée (mercenaires)
6. Le Sanctuaire du Silence (pacifistes)
7. Les Collecteurs de Chuchotis (espions)
8. Les Semeurs d'Espoir (réconciliation)
9. Les Loups Solitaires (bandits)
10. Les Dévoreurs d'Âmes (cannibales fanatiques)

### Forum
- 3 catégories
- 79 sections (avec sous-sections pour factions et clans)
- 4 topics prod + 7 topics dev
- 3 posts prod + 15 posts dev

---

## Scripts NPM

### Migrations
```bash
npm run db:migrate              # Exécuter migrations
npm run db:migrate:undo         # Annuler dernière migration
npm run db:migrate:undo:all     # Annuler toutes migrations
```

### Seeders
```bash
npm run db:seed                 # Init mode prod (undo → prod)
npm run db:seed:prod            # Exécuter seeders prod uniquement
npm run db:seed:dev             # Exécuter seeders dev uniquement
npm run db:seed:all             # Init complète (undo → prod → dev)
npm run db:seed:undo            # Vider toutes les tables
npm run db:seed:undo:all        # Vider toutes les tables (alias)
```

### Reset
```bash
npm run db:reset                # Reset prod (undo migrations → migrate → seed)
npm run db:reset:dev            # Reset complet (undo migrations → migrate → seed all)
```

### Autres
```bash
npm run db:test                 # Tester connexion DB
npm run db:clear                # Vider une table spécifique
```

---

## Fichiers Modifiés/Créés

### Structure
- backend/seeders/dev/ (nouveau répertoire)
- backend/seeders/prod/ (nouveau répertoire)
- backend/src/scripts/ (scripts de seeding personnalisés)

### Migrations
- backend/migrations/004-create-factions.js (ajout outpost_name)
- backend/migrations/017-add-slug-to-categories.js (nouveau)
- backend/migrations/018-add-slug-to-sections.js (nouveau)
- backend/migrations/019-add-slug-to-topics.js (nouveau)

### Modèles
- backend/src/models/Faction.js (ajout outpost_name)
- backend/src/models/Category.js (ajout slug)
- backend/src/models/Section.js (ajout slug)
- backend/src/models/Topic.js (ajout slug)

### Scripts de Seeding
- backend/src/scripts/seedProd.js (nouveau)
- backend/src/scripts/seedDev.js (nouveau)
- backend/src/scripts/seedAll.js (nouveau)
- backend/src/scripts/seedUndoAll.js (nouveau)
- backend/src/scripts/seedInit.js (nouveau)
- backend/src/scripts/seedAllComplete.js (nouveau)

### Seeders Production (9 fichiers)
- backend/seeders/prod/001-prod-users.js (vide)
- backend/seeders/prod/002-prod-ethnies.js
- backend/seeders/prod/003-prod-factions.js
- backend/seeders/prod/004-prod-clans.js
- backend/seeders/prod/005-prod-characters.js (vide)
- backend/seeders/prod/006-prod-categories.js (avec slugs)
- backend/seeders/prod/007-prod-sections.js (79 sections avec slugs)
- backend/seeders/prod/008-prod-topics.js (avec slugs)
- backend/seeders/prod/009-prod-posts.js (contenu CGU et règlement complets)

### Seeders Dev (9 fichiers)
- backend/seeders/dev/101-dev-users.js (13 comptes test)
- backend/seeders/dev/102-dev-ethnies.js (vide)
- backend/seeders/dev/103-dev-factions.js (vide)
- backend/seeders/dev/104-dev-clans.js (vide)
- backend/seeders/dev/105-dev-characters.js (7 personnages test)
- backend/seeders/dev/106-dev-categories.js (vide)
- backend/seeders/dev/107-dev-sections.js (vide)
- backend/seeders/dev/108-dev-topics.js (7 topics test)
- backend/seeders/dev/109-dev-posts.js (15 posts test)

### Configuration
- backend/package.json (refactoring complet des scripts db)

### Documentation
- docs/progress/branch-seeders-review.md (mis à jour)

---

## Tests Effectués

### Test 1: Migrations avec slugs
```bash
npm run db:migrate:undo:all
npm run db:migrate
```
✓ **Résultat**: Toutes les migrations s'exécutent sans erreur

### Test 2: Seeders production
```bash
npm run db:seed
```
✓ **Résultat**: Seeders prod s'exécutent sans erreur
✓ **Données**: 2 ethnies, 2 factions, 22 clans, 3 categories, 79 sections, 4 topics, 3 posts

### Test 3: Seeders développement
```bash
npm run db:seed:dev
```
✓ **Résultat**: Seeders dev s'exécutent sans erreur
✓ **Données**: 13 users, 7 characters, 7 topics, 15 posts

### Test 4: Reset complet
```bash
npm run db:reset:dev
```
✓ **Résultat**: Reset complet fonctionne correctement

---

## État Actuel

### ✅ Complété
- [x] Restructuration répertoires seeders (prod/dev)
- [x] Scripts npm pour seeders séparés
- [x] Ajout champ outpost_name aux factions
- [x] Ajout slugs pour categories, sections, topics
- [x] Seeders prod: ethnies, factions, clans
- [x] Seeders prod: categories, sections (79 avec sous-sections), topics, posts
- [x] Contenu complet CGU et règlement du forum
- [x] Seeders dev: users (13 comptes), characters (7 persos)
- [x] Seeders dev: topics (7) et posts (15) de test
- [x] Refactoring système de seeding avec scripts Node.js
- [x] Optimisation commandes npm
- [x] Documentation complète
- [x] Tests de tous les seeders

### 📋 Prochaine Action
1. **Commit et push** des modifications
2. **Merger** vers feature/forum
3. Tester en environnement complet

---

## Notes Techniques

### Décisions de Conception

**1. Séparation prod/dev**
- Évite la confusion entre données de test et données réelles
- Permet d'exécuter séparément les environnements
- Facilite le déploiement en production

**2. Slugs pour URLs SEO-friendly**
- Ajout de slugs uniques pour categories, sections, topics
- Format kebab-case pour URLs propres
- Améliore le SEO et l'expérience utilisateur

**3. Structure forum étendue**
- 79 sections incluant sous-sections pour factions et clans
- Sections privées/publiques selon affiliations
- Organisation hiérarchique avec parent_section_id

**4. Scripts de seeding personnalisés**
- Remplacement des commandes sequelize-cli par scripts Node.js
- Meilleur contrôle et gestion des erreurs
- Affichage progressif et logs détaillés

**5. Optimisation commandes npm**
- db:reset pour production (seed prod uniquement)
- db:reset:dev pour développement (seed all)
- Commandes plus intuitives et adaptées aux cas d'usage

**6. Seeders dev complets**
- 13 comptes utilisateurs couvrant tous les rôles et états
- 7 personnages de test pour différentes factions/clans
- 7 topics et 15 posts simulant activité réelle

---

**Dernière mise à jour**: 2025-10-31
**Statut**: ✅ Tous les objectifs atteints - Prêt pour commit, push et merge
