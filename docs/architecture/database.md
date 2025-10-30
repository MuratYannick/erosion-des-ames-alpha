# Documentation Base de Données - Érosion des Âmes

## Vue d'ensemble

Base de données MySQL pour le projet "Érosion des Âmes - Alpha".

---

## Configuration

### Connexion
- **SGBD**: MySQL
- **Hébergeur**: O2Switch
- **ORM**: Sequelize
- **Encodage**: UTF-8 (utf8mb4)
- **Collation**: utf8mb4_unicode_ci

### Credentials (variables d'environnement)
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=erosion_des_ames
DB_USER=root
DB_PASSWORD=
```

---

## Schéma de Base de Données

### Tables Principales

#### Users (Utilisateurs)
Table pour la gestion des comptes utilisateurs du forum.

**Colonnes principales**:
- `id`: Identifiant unique
- `username`: Nom d'utilisateur unique
- `email`: Email (non unique pour permettre plusieurs comptes)
- `password_hash`: Mot de passe hashé
- `email_verified`: Email vérifié ou non
- `role`: Rôle (admin, moderator, game-master, player)
- `forum_rules_accepted`: Règlement du forum accepté
- `terms_accepted`: Conditions d'utilisation acceptées
- `is_active`: Compte actif ou non
- `last_login`: Dernière connexion
- `created_at`, `updated_at`: Timestamps de gestion

**Modèle Sequelize**: [backend/src/models/User.js](../backend/src/models/User.js)

---

#### Ethnies
Table de référence pour les ethnies du jeu (table statique sans soft-delete).

**Colonnes**:
- `id`: Identifiant unique
- `name`: Nom de l'ethnie (unique)
- `description`: Description de l'ethnie

---

#### Factions
Table pour les factions du jeu (organisations majeures).

**Colonnes**:
- `id`: Identifiant unique
- `name`: Nom de la faction (unique)
- `description`: Description
- `ethnie_id`: Ethnie exclusive (NULL = faction mixte)
- `is_playable`: Faction jouable par les players
- `main_clan_id`: Clan principal à la tête de la faction
- `leader_name`: Nom du leader (conservé après suppression du clan)
- `created_at`, `updated_at`, `deleted_at`: Timestamps avec soft-delete

**Relations**:
- Une faction peut appartenir à une ethnie (ou aucune si mixte)
- Une faction peut avoir un clan principal
- Une faction peut avoir plusieurs clans
- Une faction peut avoir plusieurs characters membres

---

#### Clans
Table pour les clans du jeu (sous-groupes des factions).

**Colonnes**:
- `id`: Identifiant unique
- `name`: Nom du clan (unique)
- `description`: Description
- `faction_id`: Faction d'appartenance (NULL = clan neutre)
- `ethnie_id`: Ethnie exclusive (NULL = clan mixte)
- `is_playable`: Clan jouable par les players
- `leader_character_id`: Personnage leader du clan
- `leader_name`: Nom du leader (conservé après suppression du character)
- `created_at`, `updated_at`, `deleted_at`: Timestamps avec soft-delete

**Relations**:
- Un clan peut appartenir à une faction (ou aucune si neutre)
- Un clan peut appartenir à une ethnie (ou aucune si mixte)
- Un clan peut avoir un character comme leader
- Un clan peut avoir plusieurs characters membres

---

#### Characters (Personnages)
Table pour les personnages joueurs (PJ) et non-joueurs (PNJ).

**Colonnes**:
- `id`: Identifiant unique
- `name`: Nom du personnage
- `user_id`: Propriétaire du personnage (NULL = PNJ)
- `ethnie_id`: Ethnie du personnage (obligatoire)
- `faction_id`: Faction d'appartenance (optionnel)
- `clan_id`: Clan d'appartenance (optionnel)
- `is_dead`: Personnage mort ou vivant
- `description`: Description du personnage
- `created_at`, `updated_at`, `deleted_at`: Timestamps avec soft-delete

**Relations**:
- Un character peut appartenir à un user (PJ) ou aucun (PNJ)
- Un character appartient obligatoirement à une ethnie
- Un character peut appartenir à une faction
- Un character peut appartenir à un clan
- Un character peut être auteur de topics et posts

---

#### Categories (Catégories de Forum)
Table pour les catégories principales du forum.

**Colonnes**:
- `id`: Identifiant unique
- `name`: Nom de la catégorie
- `description`: Description
- `display_order`: Ordre d'affichage
- `created_at`, `updated_at`, `deleted_at`: Timestamps avec soft-delete

**Relations**:
- Une catégorie peut avoir plusieurs sections

---

#### Sections (Sections de Forum)
Table pour les sections du forum avec structure hiérarchique.

**Colonnes**:
- `id`: Identifiant unique
- `name`: Nom de la section
- `description`: Description
- `category_id`: Catégorie parente (obligatoire)
- `parent_section_id`: Section parente (NULL = section de premier niveau)
- `faction_id`: Affiliation à une faction (optionnel)
- `clan_id`: Affiliation à un clan (optionnel)
- `is_public`: Section publique ou restreinte au clan/faction
- `display_order`: Ordre d'importance
- `is_pinned`: Section épinglée
- `is_locked`: Section verrouillée
- `created_at`, `updated_at`, `deleted_at`: Timestamps avec soft-delete

**Relations**:
- Une section appartient à une catégorie
- Une section peut avoir une section parente (structure hiérarchique)
- Une section peut avoir plusieurs sections enfants
- Une section peut être affiliée à une faction
- Une section peut être affiliée à un clan
- Une section peut avoir plusieurs topics

---

#### Topics (Sujets de Discussion)
Table pour les topics/sujets du forum.

**Colonnes**:
- `id`: Identifiant unique
- `title`: Titre du topic
- `section_id`: Section parente (obligatoire)
- `author_user_id`: Auteur user (exclusif avec author_character_id)
- `author_character_id`: Auteur character (exclusif avec author_user_id)
- `author_name`: Nom de l'auteur (conservé après suppression)
- `faction_id`: Affiliation à une faction (optionnel)
- `clan_id`: Affiliation à un clan (optionnel)
- `is_public`: Topic public ou restreint
- `display_order`: Ordre d'importance
- `is_pinned`: Topic épinglé
- `is_locked`: Topic verrouillé
- `views_count`: Nombre de vues
- `created_at`, `updated_at`, `deleted_at`: Timestamps avec soft-delete

**Relations**:
- Un topic appartient à une section
- Un topic a un seul auteur (user OU character)
- Un topic peut être affilié à une faction
- Un topic peut être affilié à un clan
- Un topic peut avoir plusieurs posts

**Contrainte**: Un topic doit avoir soit `author_user_id` soit `author_character_id` (pas les deux, pas aucun)

---

#### Posts (Messages)
Table pour les messages/posts du forum.

**Colonnes**:
- `id`: Identifiant unique
- `content`: Contenu du message
- `topic_id`: Topic parent (obligatoire)
- `author_user_id`: Auteur user (exclusif avec author_character_id)
- `author_character_id`: Auteur character (exclusif avec author_user_id)
- `author_name`: Nom de l'auteur (conservé après suppression)
- `is_locked`: Post verrouillé
- `created_at`, `updated_at`, `deleted_at`: Timestamps avec soft-delete

**Relations**:
- Un post appartient à un topic
- Un post a un seul auteur (user OU character)

**Contrainte**: Un post doit avoir soit `author_user_id` soit `author_character_id` (pas les deux, pas aucun)

---

## Conventions de Nommage

### Tables
- Noms en **snake_case**
- Pluriel pour les tables (users, characters, items)

### Colonnes
- Noms en **snake_case**
- Suffixes standards:
  - `_id`: Clés étrangères
  - `_at`: Timestamps
  - `_hash`: Données hashées
  - `is_`: Booléens

### Index
- Préfixe `idx_` pour les index standards
- Préfixe `fk_` pour les clés étrangères
- Préfixe `unq_` pour les contraintes d'unicité

---

## Relations

### Diagramme ER (Entity-Relationship)

```
┌─────────────┐
│   Ethnies   │ (Table de référence)
└─────────────┘
       │
       ├──────────────────────────────┐
       │                              │
       ▼                              ▼
┌─────────────┐                ┌─────────────┐
│  Factions   │◄───────────────┤    Clans    │
│             │ main_clan_id   │             │
│             ├───────────────►│             │
└─────────────┘ faction_id     └─────────────┘
       │                              │
       │                              │ leader_character_id
       │                              │
       ▼                              ▼
┌─────────────┐                ┌─────────────┐
│    Users    │───────────────►│ Characters  │
│             │ user_id        │             │
└─────────────┘                └─────────────┘
       │                              │
       │                              │
       ├──────────────┬───────────────┤
       │              │               │
       ▼              ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Categories  │ │   Topics    │ │    Posts    │
│             │ │             │ │             │
└─────────────┘ └─────────────┘ └─────────────┘
       │              │               │
       │              └───────────────┘
       ▼
┌─────────────┐
│  Sections   │◄─────────────┐
│             │ parent_id    │
│             ├──────────────┘
└─────────────┘
       │
       ▼
┌─────────────┐
│   Topics    │
│             │
└─────────────┘
       │
       ▼
┌─────────────┐
│    Posts    │
└─────────────┘
```

### Relations Détaillées

**Ethnies** (table de référence):
- → Factions (1:N) - Une ethnie peut avoir plusieurs factions exclusives
- → Clans (1:N) - Une ethnie peut avoir plusieurs clans exclusifs
- → Characters (1:N obligatoire) - Une ethnie a plusieurs characters

**Factions**:
- ← Ethnies (N:1 optionnel) - Une faction peut être liée à une ethnie
- → Clans (1:N) - Une faction peut avoir plusieurs clans
- ← Clans (N:1 optionnel via main_clan_id) - Une faction peut avoir un clan principal
- → Characters (1:N) - Une faction peut avoir plusieurs characters membres
- → Sections (1:N) - Une faction peut avoir plusieurs sections affiliées
- → Topics (1:N) - Une faction peut avoir plusieurs topics affiliés

**Clans**:
- ← Factions (N:1 optionnel) - Un clan peut appartenir à une faction
- ← Ethnies (N:1 optionnel) - Un clan peut être lié à une ethnie
- ← Characters (N:1 optionnel via leader_character_id) - Un clan peut avoir un character leader
- → Characters (1:N) - Un clan peut avoir plusieurs characters membres
- → Sections (1:N) - Un clan peut avoir plusieurs sections affiliées
- → Topics (1:N) - Un clan peut avoir plusieurs topics affiliés

**Characters**:
- ← Users (N:1 optionnel) - Un character peut appartenir à un user (ou aucun si PNJ)
- ← Ethnies (N:1 obligatoire) - Un character appartient à une ethnie
- ← Factions (N:1 optionnel) - Un character peut appartenir à une faction
- ← Clans (N:1 optionnel) - Un character peut appartenir à un clan
- → Topics (1:N via author_character_id) - Un character peut être auteur de plusieurs topics
- → Posts (1:N via author_character_id) - Un character peut être auteur de plusieurs posts

**Users**:
- → Characters (1:N) - Un user peut avoir plusieurs characters
- → Topics (1:N via author_user_id) - Un user peut être auteur de plusieurs topics
- → Posts (1:N via author_user_id) - Un user peut être auteur de plusieurs posts

**Categories**:
- → Sections (1:N obligatoire) - Une catégorie a plusieurs sections

**Sections** (structure hiérarchique):
- ← Categories (N:1 obligatoire) - Une section appartient à une catégorie
- ← Sections (N:1 optionnel via parent_section_id) - Une section peut avoir une section parente
- → Sections (1:N) - Une section peut avoir plusieurs sous-sections
- ← Factions (N:1 optionnel) - Une section peut être affiliée à une faction
- ← Clans (N:1 optionnel) - Une section peut être affiliée à un clan
- → Topics (1:N) - Une section a plusieurs topics

**Topics**:
- ← Sections (N:1 obligatoire) - Un topic appartient à une section
- ← Users XOR Characters (N:1 obligatoire) - Un topic a un auteur (user OU character)
- ← Factions (N:1 optionnel) - Un topic peut être affilié à une faction
- ← Clans (N:1 optionnel) - Un topic peut être affilié à un clan
- → Posts (1:N) - Un topic a plusieurs posts

**Posts**:
- ← Topics (N:1 obligatoire) - Un post appartient à un topic
- ← Users XOR Characters (N:1 obligatoire) - Un post a un auteur (user OU character)

---

## Migrations

### Configuration Sequelize CLI

Le projet utilise Sequelize CLI pour gérer les migrations. La configuration se trouve dans:
- **`.sequelizerc`**: Configuration des chemins
- **`src/config/config.js`**: Configuration de la connexion par environnement

### Prérequis

1. **Créer la base de données manuellement** (à faire une seule fois):
```bash
mysql -u root -p
CREATE DATABASE erosion_des_ames;
EXIT;
```

2. **Configurer les variables d'environnement** dans `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=erosion_des_ames
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
```

### Commandes de Migration

#### Exécuter toutes les migrations
```bash
cd backend
npm run db:migrate
```

#### Annuler la dernière migration
```bash
npm run db:migrate:undo
```

#### Annuler toutes les migrations
```bash
npm run db:migrate:undo:all
```

#### Créer une nouvelle migration
```bash
npx sequelize-cli migration:generate --name nom-de-la-migration
```

### Historique des Migrations
- **001-create-users.js**: Création de la table users avec index
- **002-update-users-for-forum.js**: Ajout des colonnes forum (role, email_verified, etc.)
- **003-create-ethnies.js**: Création de la table ethnies (table de référence)
- **004-create-factions.js**: Création de la table factions
- **005-create-clans.js**: Création de la table clans
- **006-create-characters.js**: Création de la table characters
- **007-create-categories.js**: Création de la table categories
- **008-create-sections.js**: Création de la table sections (avec hiérarchie)
- **009-create-topics.js**: Création de la table topics
- **010-create-posts.js**: Création de la table posts

---

## Seeders (Données de Test)

Les seeders permettent d'insérer des données de test dans la base de données.

### Commandes de Seeders

#### Exécuter tous les seeders
```bash
cd backend
npm run db:seed
```

#### Annuler tous les seeders
```bash
npm run db:seed:undo
```

**Note importante**: Contrairement aux migrations, Sequelize CLI ne suit pas l'historique des seeders individuels dans une table de métadonnées. Il n'est donc pas possible d'annuler uniquement le dernier seeder exécuté. La commande `db:seed:undo` annule TOUS les seeders en exécutant leur méthode `down()` pour chaque fichier.

#### Reset complet de la base de données
**ATTENTION**: Cette commande supprime toutes les données et recrée les tables !
```bash
npm run db:reset
```
Cette commande exécute dans l'ordre: `db:migrate:undo:all` → `db:migrate` → `db:seed`

#### Vider une table spécifique
Pour vider une table sans affecter les autres:
```bash
npm run db:clear -- nom_de_la_table
```
Exemples:
```bash
npm run db:clear -- posts     # Vide uniquement la table posts
npm run db:clear -- users     # Vide uniquement la table users
```

Cette commande utilise `TRUNCATE TABLE` avec désactivation temporaire des contraintes de clés étrangères.

#### Créer un nouveau seeder
```bash
npx sequelize-cli seed:generate --name nom-du-seeder
```

### Seeders disponibles
- **001-demo-users.js**: 3 utilisateurs de test
  - admin / admin@erosion-des-ames.com / password123
  - testuser / test@example.com / password456
  - player1 / player1@example.com / password789
- **002-demo-ethnies.js**: 5 ethnies (Humains, Elfes, Nains, Orcs, Démons)
- **003-demo-factions.js**: 5 factions avec affiliations ethniques
- **004-demo-clans.js**: 6 clans avec diverses affiliations
- **005-demo-characters.js**: 9 personnages (4 PCs liés à des users, 5 NPCs)
- **006-demo-categories.js**: 5 catégories de forum
- **007-demo-sections.js**: 10 sections incluant sections hiérarchiques et privées
- **008-demo-topics.js**: 7 topics (mix d'auteurs users et characters)
- **009-demo-posts.js**: 10 posts avec dialogues RP

---

## Sauvegardes

### Stratégie de Backup
- Sauvegardes automatiques via O2Switch
- Sauvegardes manuelles recommandées avant déploiement
- Rétention: 30 jours minimum

### Commande de backup manuel
```bash
mysqldump -u [user] -p[password] erosion_des_ames > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restauration
```bash
mysql -u [user] -p[password] erosion_des_ames < backup_file.sql
```

---

## Performance et Optimisation

### Index
- Index sur les colonnes fréquemment recherchées
- Index composites pour les requêtes multi-colonnes
- Éviter les index sur les colonnes avec peu de variabilité

### Requêtes
- Utiliser les includes de Sequelize pour les jointures
- Limiter les SELECT * (spécifier les colonnes nécessaires)
- Pagination pour les grandes listes

### Monitoring
- Surveiller les requêtes lentes (slow query log)
- Analyser les plans d'exécution avec EXPLAIN

---

## Sécurité

### Bonnes Pratiques
- Utilisateur MySQL dédié avec privilèges limités
- Mot de passe fort stocké dans .env
- Pas d'accès direct depuis l'extérieur (uniquement via backend)
- Validation des entrées avant insertion
- Utilisation de prepared statements (Sequelize le fait automatiquement)

### Protection des Données Sensibles
- Mots de passe: Hashés avec bcrypt
- Données personnelles: Conformité RGPD à implémenter si nécessaire

---

## Exemples de Requêtes

### Créer un utilisateur
```javascript
const user = await User.create({
  username: 'joueur1',
  email: 'joueur1@example.com',
  password_hash: hashedPassword
});
```

### Trouver un utilisateur
```javascript
const user = await User.findOne({
  where: { username: 'joueur1' }
});
```

### Mettre à jour un utilisateur
```javascript
await user.update({
  last_login: new Date()
});
```

### Supprimer un utilisateur (soft delete recommandé)
```javascript
await user.update({ is_active: false });
```

---

## Scripts Utiles

### Tester la connexion à la base de données
```bash
cd backend
npm run db:test
```

Ce script affiche:
- Le statut de la connexion
- La version de MySQL
- La liste des tables
- Le nombre d'utilisateurs (si la table existe)

### Workflow complet pour initialiser la base de données

1. **Créer la base de données** (MySQL):
```bash
mysql -u root -p
CREATE DATABASE erosion_des_ames;
EXIT;
```

2. **Configurer .env**:
```bash
cd backend
cp .env.example .env
# Éditer .env avec vos informations
```

3. **Exécuter les migrations**:
```bash
npm run db:migrate
```

4. **Insérer les données de test** (optionnel):
```bash
npm run db:seed
```

5. **Tester la connexion**:
```bash
npm run db:test
```

### Réinitialiser complètement (développement uniquement)
```bash
npm run db:reset
```

---

## TODO / Évolutions Futures

- [x] Configurer Sequelize CLI
- [x] Créer la migration pour la table users
- [x] Créer les seeders pour les utilisateurs de test
- [x] Définir le schéma complet pour le forum et le jeu
- [x] Implémenter les relations entre tables
- [ ] Créer les modèles Sequelize pour toutes les tables
- [ ] Créer les seeders pour les données de test (ethnies, factions, clans, characters)
- [ ] Tester toutes les migrations
- [ ] Optimiser les index selon les performances en production
- [ ] Mettre en place une stratégie de backup automatisée
- [ ] Implémenter les triggers/hooks pour la mise à jour automatique des compteurs
- [ ] Ajouter des validations au niveau base de données (contraintes CHECK supplémentaires)

---

**Dernière mise à jour**: 2025-10-29
