# Avancement de la Branche - Révision Seeders Production

## Informations de Branche

**Branche actuelle**: feature/seeders-review
**Branche parent**: main
**Créée le**: 2025-10-31
**Objectif**: Révision complète des seeders de production avec les données définitives du jeu "Érosion des Âmes"

---

## Contexte

Cette branche restructure complètement les seeders pour séparer les données de développement (dev) des données de production (prod), et implémente les vraies données du jeu post-apocalyptique "Érosion des Âmes".

---

## Tâches de la Branche

### Restructuration des Seeders
- [x] Créer sous-répertoire `backend/seeders/dev/` pour données de développement
- [x] Créer sous-répertoire `backend/seeders/prod/` pour données de production
- [x] Migrer anciens seeders démo vers dev/
- [x] Ajouter scripts npm pour seeders dev et prod
- [x] Documenter la nouvelle structure dans README

### Seeders de Production (prod/)

#### Ethnies
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
- [x] 005-prod-characters.js: 132 personnages PNJ
  - 22 leaders de clans
  - 30 membres clans jouables (3 par clan)
  - 60 membres clans neutres (5 par clan)
  - 10 membres sans clan dans factions (5 par faction)
  - 10 personnages solitaires (5 Éveillés, 5 Inaltérés)

#### Forum
- [x] 006-prod-categories.js: 3 catégories
  - Forum Général
  - Forum HRP (Hors Role-Play)
  - Forum RP (Role-Play)
- [x] 007-prod-sections.js: 9 sections principales
  - 4 sections Forum Général
  - 2 sections Forum HRP
  - 3 sections Forum RP (par faction)
- [x] 008-prod-topics.js: 4 topics
  - Message de bienvenue
  - Règlement du Forum
  - CGU
  - Présentation utilisateurs
- [x] 009-prod-posts.js: 1 post (message de bienvenue)

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

### Personnages (132 PNJ)
- 31 personnages faction Éclaireurs (6 + 20 + 5)
- 31 personnages faction Veilleurs (6 + 20 + 5)
- 60 personnages clans neutres (10 clans × 6)
- 10 personnages solitaires

### Forum
- 3 catégories
- 9 sections
- 4 topics (1 avec post de bienvenue, 3 vides)

---

## Commits

### Commit 1: feat(seeders): restructuration complète avec séparation prod/dev
```
feat(seeders): restructuration complète avec séparation prod/dev

- Création sous-répertoires backend/seeders/prod/ et backend/seeders/dev/
- Migration anciens seeders démo vers dev/
- Ajout scripts npm: db:seed:prod et db:seed:dev
- Documentation de la nouvelle structure

📁 Structure:
  - prod/: données de production (vraies données du jeu)
  - dev/: données de développement (données de test)
```

### Commit 2 (à venir): feat(seeders): ajout données production complètes
```
feat(seeders): ajout données production complètes Érosion des Âmes

Ethnies et Factions:
- 2 ethnies: Les Éveillés (mutants), Les Inaltérés (humains purs)
- 2 factions jouables avec avant-postes et idéologies
- Ajout champ outpost_name dans migration/modèle Faction

Clans:
- 22 clans au total (2 leaders, 10 jouables, 10 neutres)
- 6 clans Éclaireurs (ressources, exploration, guérison, défense, archives)
- 6 clans Veilleurs (défense, production, savoir, santé, exploration)
- 10 clans neutres (marchands, mercenaires, pacifistes, bandits, etc.)

Personnages:
- 132 PNJ avec noms et descriptions détaillées
- 1 leader par clan (22 leaders)
- 3 membres par clan jouable (30 personnages)
- 5 membres par clan neutre (60 personnages)
- 5 membres sans clan par faction (10 personnages)
- 10 personnages solitaires (5 par ethnie)

Forum:
- 3 catégories (Général, HRP, RP)
- 9 sections principales (4 Général, 2 HRP, 3 RP par faction)
- 4 topics (bienvenue, règlement, CGU, présentation)
- 1 post de bienvenue avec markdown

🎮 Toutes les données reflètent l'univers post-apocalyptique du jeu
📝 Descriptions détaillées pour chaque entité
```

---

## Fichiers Modifiés/Créés

### Structure
- backend/seeders/dev/ (nouveau répertoire)
- backend/seeders/prod/ (nouveau répertoire)

### Migrations
- backend/migrations/004-create-factions.js (ajout outpost_name)

### Modèles
- backend/src/models/Faction.js (ajout outpost_name)

### Seeders Production (nouveau)
- backend/seeders/prod/001-prod-users.js
- backend/seeders/prod/002-prod-ethnies.js
- backend/seeders/prod/003-prod-factions.js
- backend/seeders/prod/004-prod-clans.js
- backend/seeders/prod/005-prod-characters.js
- backend/seeders/prod/006-prod-categories.js
- backend/seeders/prod/007-prod-sections.js
- backend/seeders/prod/008-prod-topics.js
- backend/seeders/prod/009-prod-posts.js

### Seeders Dev (déplacés)
- backend/seeders/dev/001-demo-users.js
- backend/seeders/dev/002-demo-ethnies.js
- backend/seeders/dev/003-demo-factions.js
- backend/seeders/dev/004-demo-clans.js
- backend/seeders/dev/005-demo-characters.js
- backend/seeders/dev/006-demo-categories.js
- backend/seeders/dev/007-demo-sections.js
- backend/seeders/dev/008-demo-topics.js
- backend/seeders/dev/009-demo-posts.js

### Configuration
- backend/package.json (ajout scripts db:seed:prod, db:seed:dev)

### Documentation
- docs/progress/branch-seeders-review.md (nouveau)
- backend/seeders/README.md (mise à jour structure)

---

## Scripts NPM Ajoutés

```bash
# Seeders de production
npm run db:seed:prod           # Exécuter tous les seeders prod
npm run db:seed:prod:undo      # Annuler tous les seeders prod

# Seeders de développement
npm run db:seed:dev            # Exécuter tous les seeders dev
npm run db:seed:dev:undo       # Annuler tous les seeders dev
```

---

## Tests Effectués

### Test 1: Migration avec nouveau champ outpost_name
```bash
npm run db:migrate:undo
npm run db:migrate
```
✓ **Résultat**: Migration s'exécute sans erreur, champ ajouté

### Test 2: Seeders production
```bash
npm run db:seed:prod
```
✓ **Résultat**: Tous les seeders prod s'exécutent sans erreur
✓ **Données**: 2 ethnies, 2 factions, 22 clans, 132 characters, 3 categories, 9 sections, 4 topics, 1 post

---

## État Actuel

### ✅ Complété
- [x] Restructuration répertoires seeders (prod/dev)
- [x] Scripts npm pour seeders séparés
- [x] Ajout champ outpost_name aux factions
- [x] Seeders prod: ethnies, factions, clans, characters
- [x] Seeders prod: categories, sections, topics, posts
- [x] Documentation complète
- [x] Tests de tous les seeders prod

### 📋 Prochaine Action
1. **Commit et push** des modifications
2. Tester en environnement complet
3. Merger vers main

---

## Notes Techniques

### Décisions de Conception

**1. Séparation prod/dev**
- Évite la confusion entre données de test et données réelles
- Permet d'exécuter séparément les environnements
- Facilite le déploiement en production

**2. Champ outpost_name dans Faction**
- Stocke le nom de l'avant-poste principal
- Permet l'affichage sans dépendre du clan principal
- Cohérent avec l'univers du jeu

**3. Personnages PNJ détaillés**
- Chaque clan a ses leaders et membres nommés
- Descriptions riches pour le roleplay
- Base solide pour interactions futures

**4. Forum structuré par faction**
- Sections RP séparées par faction
- Permet gestion permissions futures
- Structure évolutive pour sous-sections

---

**Dernière mise à jour**: 2025-10-31
**Statut**: ✅ Seeders production complétés - Prêt pour commit et push
