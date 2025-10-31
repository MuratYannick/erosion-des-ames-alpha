# Avancement de la Branche - Développement Forum

## Informations de Branche

**Branche actuelle**: feature/forum
**Branche parent**: main
**Créée le**: 2025-10-30
**Objectif**: Implémentation complète du système de forum pour le jeu "Érosion des Âmes"

---

## Contexte

Cette branche principale gère le développement complet du système de forum pour le jeu post-apocalyptique "Érosion des Âmes". Elle coordonne plusieurs sous-branches pour implémenter progressivement toutes les fonctionnalités nécessaires.

---

## Architecture du Système Forum

### Entités du Jeu
- **Ethnies**: Les Éveillés (mutants), Les Inaltérés (humains purs)
- **Factions**: 2 factions principales en guerre
  - Les Éclaireurs de l'Aube Nouvelle (avant-poste: L'Oasis des Transformés)
  - Les Veilleurs de l'Ancien Monde (avant-poste: La Citadelle du Renouveau)
- **Clans**: 22 clans (2 leaders, 10 jouables, 10 neutres)
- **Personnages**: Personnages joueurs et PNJ

### Structure Forum
- **Catégories**: Regroupements principaux (Général, HRP, RP)
- **Sections**: Sections thématiques avec permissions faction/clan
- **Topics**: Sujets de discussion
- **Posts**: Messages dans les topics
- **Double auteur**: User (HRP) OU Character (RP)

---

## Sous-Branches

### 1. ✅ feature/forum-users-update (MERGÉE)
**Objectif**: Préparer la table users pour le forum
**Commits**:
- d82f9bb: feat(backend): mise à jour table users pour le forum
- 5850bc3: docs(forum): ajout documentation sécurité et progression branche users
**Mergée le**: 2025-10-30

### 2. ✅ feature/forum-tables (MERGÉE)
**Objectif**: Création des tables de base de données
**Commits**:
- e78de58: feat(forum): création tables de base de données forum complet
- b757b9e: refactor(docs): réorganisation complète de la documentation
- 0d6197c: refactor(docs): consolidation documentation dans BRANCH_PROGRESS.md
**Contenu**:
- 9 migrations (ethnies, factions, clans, characters, categories, sections, topics, posts, FK constraints)
- 9 modèles Sequelize avec associations
- 8 seeders de développement avec données de test
**Mergée le**: 2025-10-30

### 3. 🔄 feature/seeders-review (EN COURS)
**Objectif**: Révision complète des seeders avec données de production
**Branche de**: feature/forum
**Commits**:
- c47d6b0: docs(seeders): initialisation branche feature/seeders-review
- d855341: docs(seeders): mise à jour structure avec sous-répertoires
- 88bbf36: refactor(seeders): restructuration complète avec séparation prod/dev
- 72189c9: feat(seeders): ajout scripts npm et mise à jour documentation
- 7a0ef9a: feat(seeders): ajout données production complètes Érosion des Âmes

**Contenu**:
- Restructuration: seeders/dev/ et seeders/prod/
- 9 seeders production avec vraies données du jeu
- 132 personnages PNJ détaillés
- 22 clans avec descriptions complètes
- Structure forum (3 catégories, 9 sections, 4 topics)
- Scripts npm: db:seed:prod et db:seed:dev

**État**: ✅ Complétée, prête à merger dans feature/forum

---

## Tâches Globales de la Branche feature/forum

### Phase 1: Base de données ✅ COMPLÉTÉE
- [x] Mise à jour table users (feature/forum-users-update)
- [x] Création migrations (feature/forum-tables)
- [x] Création modèles Sequelize (feature/forum-tables)
- [x] Seeders de développement (feature/forum-tables)
- [x] Seeders de production (feature/seeders-review)

### Phase 2: Backend API 📋 À FAIRE
- [ ] Routes CRUD pour ethnies
- [ ] Routes CRUD pour factions
- [ ] Routes CRUD pour clans
- [ ] Routes CRUD pour personnages
- [ ] Routes CRUD pour catégories
- [ ] Routes CRUD pour sections
- [ ] Routes CRUD pour topics
- [ ] Routes CRUD pour posts
- [ ] Middleware de permissions (faction/clan)
- [ ] Middleware de sélection character pour RP

### Phase 3: Frontend Forum 📋 À FAIRE
- [ ] Page liste catégories
- [ ] Page sections d'une catégorie
- [ ] Page topics d'une section
- [ ] Page posts d'un topic
- [ ] Formulaire nouveau topic
- [ ] Formulaire nouveau post
- [ ] Éditeur markdown pour posts
- [ ] Sélecteur de character pour posts RP
- [ ] Gestion permissions d'affichage

### Phase 4: Fonctionnalités avancées 📋 À FAIRE
- [ ] Système de modération
- [ ] Épinglage/verrouillage de topics
- [ ] Notifications de nouveaux posts
- [ ] Recherche dans le forum
- [ ] Pagination des topics/posts
- [ ] Statistiques du forum

---

## Fichiers Créés/Modifiés (Toutes sous-branches)

### Migrations (feature/forum-tables)
- backend/migrations/003-create-ethnies.js
- backend/migrations/004-create-factions.js (+ outpost_name dans seeders-review)
- backend/migrations/005-create-clans.js
- backend/migrations/006-create-characters.js
- backend/migrations/007-create-categories.js
- backend/migrations/008-create-sections.js
- backend/migrations/009-create-topics.js
- backend/migrations/010-create-posts.js
- backend/migrations/011-add-foreign-keys-constraints.js

### Modèles (feature/forum-tables)
- backend/src/models/Ethnie.js
- backend/src/models/Faction.js (+ outpost_name dans seeders-review)
- backend/src/models/Clan.js
- backend/src/models/Character.js
- backend/src/models/Category.js
- backend/src/models/Section.js
- backend/src/models/Topic.js
- backend/src/models/Post.js
- backend/src/models/index.js (associations)

### Seeders Dev (feature/forum-tables → déplacés dans seeders-review)
- backend/seeders/dev/001-demo-users.js
- backend/seeders/dev/002-demo-ethnies.js
- backend/seeders/dev/003-demo-factions.js
- backend/seeders/dev/004-demo-clans.js
- backend/seeders/dev/005-demo-characters.js
- backend/seeders/dev/006-demo-categories.js
- backend/seeders/dev/007-demo-sections.js
- backend/seeders/dev/008-demo-topics.js
- backend/seeders/dev/009-demo-posts.js

### Seeders Prod (feature/seeders-review)
- backend/seeders/prod/001-prod-users.js
- backend/seeders/prod/002-prod-ethnies.js
- backend/seeders/prod/003-prod-factions.js
- backend/seeders/prod/004-prod-clans.js
- backend/seeders/prod/005-prod-characters.js
- backend/seeders/prod/006-prod-categories.js
- backend/seeders/prod/007-prod-sections.js
- backend/seeders/prod/008-prod-topics.js
- backend/seeders/prod/009-prod-posts.js

### Scripts
- backend/src/scripts/clearTable.js (feature/forum-tables)

### Documentation
- docs/architecture/database.md (mis à jour dans forum-tables)
- docs/progress/branch-progress.md (ce fichier)
- docs/progress/branch-seeders-review.md (feature/seeders-review)

### Configuration
- backend/package.json (scripts npm ajoutés dans les deux sous-branches)
- backend/seeders/README.md (feature/seeders-review)

---

## Données de Production (feature/seeders-review)

### Ethnies (2)
1. **Les Éveillés**: Mutants avec peau grisâtre
2. **Les Inaltérés**: Humains non mutés préservant la pureté

### Factions (2)
1. **Les Éclaireurs de l'Aube Nouvelle** (Éveillés)
   - Avant-poste: L'Oasis des Transformés
   - Idéologie: Mutation = évolution divine, purifier la terre des non-mutants

2. **Les Veilleurs de l'Ancien Monde** (Inaltérés)
   - Avant-poste: La Citadelle du Renouveau
   - Idéologie: Technologie ancestrale, préserver la pureté humaine

### Clans (22 total)

**Éclaireurs (6 clans)**:
- Leader: Les Prophètes de l'Harmonie (non jouable)
- Jouables: Symbiotes, Sensitifs, Forgerons de Chair, Sentinelles du Chaos, Scrutateurs

**Veilleurs (6 clans)**:
- Leader: Les Élus d'Avant (non jouable)
- Jouables: Sentinelles, Pourvoyeurs, Archivistes, Purificateurs, Explorateurs

**Neutres (10 clans - non jouables)**:
- Veilleurs des Ruines, Peuple des Ombres, Vagabonds du Vent
- Artisans du Réemploi, Frères de la Terre Brûlée, Sanctuaire du Silence
- Collecteurs de Chuchotis, Semeurs d'Espoir, Loups Solitaires, Dévoreurs d'Âmes

### Personnages (132 PNJ)
- 22 leaders de clans
- 30 membres clans jouables (3 par clan)
- 60 membres clans neutres (5 par clan)
- 10 membres factions sans clan (5 par faction)
- 10 solitaires (5 par ethnie)

### Forum
- 3 catégories (Général, HRP, RP)
- 9 sections principales
- 4 topics (bienvenue, règlement, CGU, présentation)
- 1 post de bienvenue

---

## Prochaines Actions

### 1. Immédiat - Finaliser Phase 1
- [x] Merger feature/seeders-review dans feature/forum
- [ ] Tester l'intégralité de la base de données
- [ ] Merger feature/forum dans main

### 2. Phase 2 - Backend API
- Créer sous-branche feature/forum-api
- Implémenter routes CRUD pour toutes les entités
- Implémenter middleware de permissions
- Tests unitaires et d'intégration

### 3. Phase 3 - Frontend
- Créer sous-branche feature/forum-frontend
- Interfaces de consultation (catégories → sections → topics → posts)
- Interfaces de création (topics, posts)
- Intégration sélection de character pour RP

---

## Notes Techniques

### Décisions d'Architecture

**1. Séparation dev/prod pour seeders**
- Évite confusion entre données de test et données réelles
- Environnements isolés et gérables séparément

**2. Double système d'auteurs (User XOR Character)**
- Permet posts HRP (auteur = user) et posts RP (auteur = character)
- Validation dans modèles Sequelize (MySQL ne supporte pas CHECK sur FK)

**3. Soft-delete sur toutes tables (sauf ethnies)**
- Historique des contenus supprimés préservé
- Facilite modération et récupération

**4. Références circulaires résolues via migration 011**
- Pattern réutilisable pour futures relations complexes
- Rollback sécurisé (FK supprimées avant indexes)

**5. Permissions par faction/clan**
- Sections peuvent être publiques ou restreintes
- Base pour futur système de permissions granulaire

---

## Scripts Utiles

### Réinitialiser la base de données
```bash
cd backend
npm run db:reset
```

### Seeders de production
```bash
npm run db:seed:prod              # Exécuter seeders prod
npm run db:seed:prod:undo         # Annuler seeders prod
```

### Seeders de développement
```bash
npm run db:seed:dev               # Exécuter seeders dev
npm run db:seed:dev:undo          # Annuler seeders dev
```

### Vider une table spécifique
```bash
npm run db:clear -- posts
npm run db:clear -- topics
```

---

**Dernière mise à jour**: 2025-10-31
**Statut**: 🔄 Phase 1 complétée - feature/seeders-review prête à merger
**Prochaine étape**: Merger seeders-review → forum, puis développer API backend
