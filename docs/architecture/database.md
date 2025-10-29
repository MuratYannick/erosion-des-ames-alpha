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
Table pour la gestion des comptes utilisateurs.

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT true,
  INDEX idx_username (username),
  INDEX idx_email (email)
);
```

**Modèle Sequelize**: [backend/src/models/User.js](../backend/src/models/User.js)

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
┌──────────────┐
│    Users     │
└──────────────┘
       │
       │ (À définir selon les besoins du jeu)
       │
       ▼
  (Autres tables)
```

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
- **20251022000000-create-users.js**: Création de la table users avec index

---

## Seeders (Données de Test)

Les seeders permettent d'insérer des données de test dans la base de données.

### Exécuter tous les seeders
```bash
cd backend
npm run db:seed
```

### Annuler tous les seeders
```bash
npm run db:seed:undo
```

### Reset complet de la base de données
**ATTENTION**: Cette commande supprime toutes les données et recrée les tables !
```bash
npm run db:reset
```

### Créer un nouveau seeder
```bash
npx sequelize-cli seed:generate --name nom-du-seeder
```

### Seeders disponibles
- **20251022000000-demo-users.js**: 3 utilisateurs de test
  - admin / admin@erosion-des-ames.com / password123
  - testuser / test@example.com / password456
  - player1 / player1@example.com / password789

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
- [ ] Définir le schéma complet selon les besoins du jeu (personnages, items, etc.)
- [ ] Implémenter les relations entre tables
- [ ] Optimiser les index selon les performances en production
- [ ] Mettre en place une stratégie de backup automatisée

---

**Dernière mise à jour**: 2025-10-22
