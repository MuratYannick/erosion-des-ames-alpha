# Avancement de la Branche - Développement Forum

## Informations de Branche

**Branche actuelle**: feature/forum-tables
**Branche parent**: feature/forum
**Créée le**: 2025-10-30
**Objectif**: Création des tables de base de données pour le système de forum complet (ethnies, factions, clans, characters, categories, sections, topics, posts)

---

## Contexte

Suite à la préparation de la table `users` pour le forum (branche feature/forum-users-update), cette branche implémente l'intégralité du système de forum avec:
- Tables de jeu: ethnies, factions, clans, characters
- Tables de forum: categories, sections, topics, posts
- Relations complexes entre toutes ces entités
- Système de soft-delete (paranoid mode)
- Hiérarchie de sections
- Double système d'auteurs (user OU character) pour topics et posts
- Gestion des permissions par faction/clan
- Données de test complètes (seeders)

---

## Tâches de la Branche

### Migrations (9 nouvelles migrations)
- [x] 003-create-ethnies.js: Table de référence des ethnies
- [x] 004-create-factions.js: Table des factions avec soft-delete
- [x] 005-create-clans.js: Table des clans avec soft-delete
- [x] 006-create-characters.js: Table des personnages avec soft-delete
- [x] 007-create-categories.js: Table des catégories de forum
- [x] 008-create-sections.js: Table des sections avec hiérarchie
- [x] 009-create-topics.js: Table des topics avec double auteur
- [x] 010-create-posts.js: Table des posts avec double auteur
- [x] 011-add-foreign-keys-constraints.js: Résolution des références circulaires

### Modèles Sequelize (9 modèles)
- [x] Ethnie.js: Modèle sans timestamps
- [x] Faction.js: Modèle avec paranoid mode
- [x] Clan.js: Modèle avec paranoid mode
- [x] Character.js: Modèle avec paranoid mode
- [x] Category.js: Modèle avec paranoid mode
- [x] Section.js: Modèle avec paranoid mode et auto-référence
- [x] Topic.js: Modèle avec paranoid mode et validation XOR auteur
- [x] Post.js: Modèle avec paranoid mode et validation XOR auteur
- [x] index.js: Fichier central définissant toutes les associations

### Seeders (8 nouveaux seeders)
- [x] 001-demo-users.js: Modification pour IDs explicites
- [x] 002-demo-ethnies.js: 5 ethnies
- [x] 003-demo-factions.js: 5 factions
- [x] 004-demo-clans.js: 6 clans
- [x] 005-demo-characters.js: 9 characters (4 PCs, 5 NPCs)
- [x] 006-demo-categories.js: 5 catégories
- [x] 007-demo-sections.js: 10 sections (avec hiérarchie)
- [x] 008-demo-topics.js: 7 topics
- [x] 009-demo-posts.js: 10 posts avec dialogues RP

### Scripts et Commandes
- [x] clearTable.js: Script pour vider une table spécifique
- [x] db:clear: Commande npm pour vider des tables
- [x] db:seed:undo: Modifié pour annuler tous les seeders
- [x] Suppression de db:seed:undo:all (redondant)

### Documentation
- [x] database.md: Documentation complète des tables et relations
- [x] database.md: Documentation des commandes seeders et limitations
- [x] branch-progress.md: Mise à jour avec progression branche forum-tables

---

## Commits

### Historique précédent (branche feature/forum)
- Commit 1: feat(backend): mise à jour table users pour le forum
- Commit 2: docs(forum): ajout documentation sécurité et progression branche users
- Commit 3: Merge branch 'feature/forum-users-update' into feature/forum

### Branche feature/forum-tables (en cours)

#### Commit à venir: Création complète des tables forum
**Message prévu**:
```
feat(forum): création tables de base de données forum complet

- 9 migrations: ethnies, factions, clans, characters, categories, sections, topics, posts + contraintes FK
- 9 modèles Sequelize avec associations complètes
- 8 seeders avec données de test complètes
- Script clearTable.js pour vider tables individuelles
- Commande db:clear pour gestion granulaire
- Documentation complète dans database.md et branch-progress.md

Résolution références circulaires via migration 011
Validation XOR pour auteurs (user OU character) dans models
Soft-delete (paranoid) sur toutes tables sauf ethnies
```

**Fichiers créés**:
- backend/migrations/003-create-ethnies.js
- backend/migrations/004-create-factions.js
- backend/migrations/005-create-clans.js
- backend/migrations/006-create-characters.js
- backend/migrations/007-create-categories.js
- backend/migrations/008-create-sections.js
- backend/migrations/009-create-topics.js
- backend/migrations/010-create-posts.js
- backend/migrations/011-add-foreign-keys-constraints.js
- backend/src/models/Ethnie.js
- backend/src/models/Faction.js
- backend/src/models/Clan.js
- backend/src/models/Character.js
- backend/src/models/Category.js
- backend/src/models/Section.js
- backend/src/models/Topic.js
- backend/src/models/Post.js
- backend/src/models/index.js
- backend/seeders/002-demo-ethnies.js
- backend/seeders/003-demo-factions.js
- backend/seeders/004-demo-clans.js
- backend/seeders/005-demo-characters.js
- backend/seeders/006-demo-categories.js
- backend/seeders/007-demo-sections.js
- backend/seeders/008-demo-topics.js
- backend/seeders/009-demo-posts.js
- backend/src/scripts/clearTable.js

**Fichiers modifiés**:
- backend/package.json (commandes db:clear, db:seed:undo)
- backend/seeders/001-demo-users.js (IDs explicites)
- docs/architecture/database.md (documentation complète)
- docs/progress/branch-progress.md (mise à jour progression)

---

## Architecture des Données

### Tables créées (8 tables)

1. **ethnies**: Table de référence statique (pas de soft-delete)
2. **factions**: Organisations majeures avec ethnie optionnelle
3. **clans**: Sous-groupes des factions avec leader
4. **characters**: Personnages joueurs et NPCs
5. **categories**: Catégories principales du forum
6. **sections**: Sections hiérarchiques avec permissions faction/clan
7. **topics**: Sujets de discussion avec auteur user OU character
8. **posts**: Messages avec auteur user OU character

### Relations Clés

- **Références circulaires** (résolues dans migration 011):
  - factions.main_clan_id → clans.id
  - clans.leader_character_id → characters.id

- **Hiérarchie**:
  - sections.parent_section_id → sections.id (auto-référence)

- **Double auteur (XOR)**:
  - topics: author_user_id XOR author_character_id
  - posts: author_user_id XOR author_character_id

- **Permissions**:
  - sections peuvent être privées (faction/clan)
  - topics héritent des permissions de la section

---

## Problèmes Résolus

### 1. Références Circulaires FK
**Problème**: Migration 004 (factions) référençait clans.id avant création, et migration 005 (clans) référençait characters.id avant création.

**Solution**:
- Migrations 004 et 005 créent les colonnes sans FK constraints
- Migration 011 ajoute les FK constraints après création de toutes les tables
- Rollback corrigé: supprimer FK AVANT indexes

### 2. CHECK Constraints MySQL sur colonnes FK
**Problème**: MySQL n'autorise pas les CHECK constraints sur colonnes avec FK.
```
ERROR: Column 'author_user_id' cannot be used in a check constraint 'chk_topics_author'
```

**Solution**:
- Suppression des CHECK constraints des migrations
- Validation XOR implémentée dans les modèles Sequelize
```javascript
validate: {
  authorXor() {
    const hasUser = this.author_user_id !== null;
    const hasCharacter = this.author_character_id !== null;
    if (hasUser && hasCharacter) throw new Error('Un seul type d\'auteur');
    if (!hasUser && !hasCharacter) throw new Error('Un auteur requis');
  }
}
```

### 3. Seeders - Contraintes FK avec auto-increment
**Problème**: Users créés avec auto-increment (7, 8, 9) mais characters attendaient IDs 1, 2, 3.

**Solution**: Ajout d'IDs explicites dans seeder 001-demo-users.js
```javascript
{ id: 1, username: 'admin', ... }
```

### 4. Sequelize CLI ne track pas les seeders individuels
**Problème**: Impossible d'annuler uniquement le dernier seeder.

**Solution**:
- db:seed:undo modifié pour annuler TOUS les seeders
- db:seed:undo:all supprimé (redondant)
- Ajout commande db:clear pour vider tables individuelles
- Documentation de la limitation

---

## Tests Effectués

### Test 1: Migrations complètes
```bash
npm run db:migrate:undo:all
npm run db:migrate
```
✓ **Résultat**: Toutes les migrations (001-011) s'exécutent sans erreur
✓ **Rollback**: Toutes les migrations se rollback correctement

### Test 2: Seeders complets
```bash
npm run db:seed
```
✓ **Résultat**: Tous les seeders (001-009) s'exécutent sans erreur
✓ **Données**: 3 users, 5 ethnies, 5 factions, 6 clans, 9 characters, 5 categories, 10 sections, 7 topics, 10 posts

### Test 3: Commande db:seed:undo
```bash
npm run db:seed:undo
```
✓ **Résultat**: Tous les seeders sont annulés (toutes les tables vidées)

### Test 4: Commande db:clear
```bash
npm run db:clear -- posts
```
✓ **Résultat**: Table posts vidée sans affecter les autres tables
✓ **FK**: Désactivation temporaire des contraintes FK fonctionne

### Test 5: Validation XOR dans modèles
✓ **Résultat**: Sequelize valide correctement l'exclusivité des auteurs (user OU character)

---

## État Actuel de la Branche

### ✅ Complété (branche feature/forum-tables)
- [x] 9 migrations créées et testées (003-011)
- [x] 9 modèles Sequelize avec associations
- [x] 8 seeders créés avec données de test complètes
- [x] Script clearTable.js créé
- [x] Commandes db:clear et db:seed:undo mises à jour
- [x] Résolution références circulaires (migration 011)
- [x] Validation XOR auteurs implémentée
- [x] Soft-delete sur toutes tables (sauf ethnies)
- [x] Documentation complète mise à jour
- [x] Tests complets effectués

### 📋 Prochaines Actions
1. **Immédiat**: Commit, push et merge avec feature/forum
2. **Backend API**: Créer routes CRUD pour toutes les tables
3. **Permissions**: Implémenter système de permissions basé sur rôles/factions/clans
4. **Frontend**: Créer interfaces pour catégories, sections, topics, posts
5. **RP**: Implémenter système de roleplay avec sélection de character

---

## Notes de Développement

### Décisions Techniques

**1. Migration 011 pour références circulaires**
- Permet de créer toutes les tables avant d'ajouter les FK constraints complexes
- Pattern réutilisable pour futures relations circulaires
- Rollback sécurisé: FK supprimées avant indexes

**2. Validation XOR dans modèles plutôt que CHECK constraints**
- MySQL ne supporte pas CHECK sur colonnes avec FK
- Validation Sequelize plus flexible et maintenable
- Messages d'erreur personnalisables en français

**3. Soft-delete (paranoid) sur toutes tables sauf ethnies**
- Permet de conserver l'historique des posts/topics supprimés
- Ethnie = table de référence statique, pas de soft-delete nécessaire
- Facilite la modération et la récupération de contenu

**4. Double système d'auteurs (user OU character)**
- Permet le roleplay in-game (auteur = character)
- Permet les posts hors-jeu (auteur = user)
- Champ author_name conserve le nom après suppression

**5. Script clearTable.js vs seeders**
- Sequelize CLI ne track pas les seeders individuellement
- clearTable permet un vidage granulaire table par table
- Plus efficace pour le développement et les tests

---

## Scripts Utiles

### Réinitialiser complètement la base de données
```bash
cd backend
npm run db:reset
```
Cette commande: undo all migrations → migrate → seed

### Vider une table spécifique
```bash
npm run db:clear -- posts
npm run db:clear -- topics
npm run db:clear -- characters
```

### Migrations uniquement
```bash
npm run db:migrate              # Exécuter toutes les migrations
npm run db:migrate:undo         # Annuler la dernière
npm run db:migrate:undo:all     # Tout annuler
```

### Seeders uniquement
```bash
npm run db:seed                 # Exécuter tous les seeders
npm run db:seed:undo            # Annuler TOUS les seeders
```

---

**Dernière mise à jour**: 2025-10-30
**Statut**: ✅ Tables forum créées - Prêt pour développement API backend
