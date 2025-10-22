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

### Gestion avec Sequelize CLI

#### Créer une migration
```bash
npx sequelize-cli migration:generate --name nom-de-la-migration
```

#### Exécuter les migrations
```bash
npm run migrate
```

#### Annuler la dernière migration
```bash
npx sequelize-cli db:migrate:undo
```

### Historique des Migrations
- **Migration initiale**: Création des tables de base (à venir)

---

## Seeders (Données de Test)

### Créer un seeder
```bash
npx sequelize-cli seed:generate --name nom-du-seeder
```

### Exécuter les seeders
```bash
npm run seed
```

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

### Réinitialiser la base de données (ATTENTION: Perte de données)
```bash
npx sequelize-cli db:drop
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

---

## TODO / Évolutions Futures

- [ ] Définir le schéma complet selon les besoins du jeu
- [ ] Implémenter les relations entre tables
- [ ] Créer les migrations initiales
- [ ] Créer les seeders pour les données de test
- [ ] Optimiser les index selon les performances
- [ ] Mettre en place une stratégie de backup automatisée

---

**Dernière mise à jour**: 2025-10-22
