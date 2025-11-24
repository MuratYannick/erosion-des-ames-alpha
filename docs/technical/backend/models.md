# Modeles Sequelize

Documentation detaillee des modeles de donnees du backend Erosion des Ames.

---

## Configuration Sequelize

Fichier : `backend/src/core/models/index.js`

### Connexion a la base de donnees

```javascript
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false
  }
});
```

### Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| DB_HOST | Hote MySQL | localhost |
| DB_PORT | Port MySQL | 3306 |
| DB_NAME | Nom de la base | erosion_des_ames |
| DB_USER | Utilisateur MySQL | root |
| DB_PASSWORD | Mot de passe MySQL | password |

---

## Modele User

Fichier : `backend/src/core/models/User.js`

### Schema

```javascript
User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'MODERATOR', 'GAME_MASTER', 'PLAYER'),
    defaultValue: 'PLAYER'
  },
  cguAccepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  cguAcceptedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  forumRulesAccepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  forumRulesAcceptedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isBlocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  blockedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  paranoid: true  // Soft delete
});
```

### Champs detailles

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-genere | Identifiant unique |
| username | VARCHAR(50) | NOT NULL, UNIQUE | Nom d'utilisateur |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Adresse email |
| emailVerified | BOOLEAN | DEFAULT false | Statut verification email |
| password | VARCHAR(255) | NOT NULL | Mot de passe hashe |
| role | ENUM | DEFAULT 'PLAYER' | Role utilisateur |
| cguAccepted | BOOLEAN | DEFAULT false | Acceptation CGU |
| cguAcceptedAt | DATETIME | NULL | Date acceptation CGU |
| forumRulesAccepted | BOOLEAN | DEFAULT false | Acceptation regles forum |
| forumRulesAcceptedAt | DATETIME | NULL | Date acceptation regles |
| isBlocked | BOOLEAN | DEFAULT false | Statut blocage |
| blockedAt | DATETIME | NULL | Date de blocage |
| createdAt | DATETIME | AUTO | Date creation |
| updatedAt | DATETIME | AUTO | Date modification |
| deletedAt | DATETIME | NULL | Date suppression (soft) |

### Roles utilisateur

| Role | Valeur | Description |
|------|--------|-------------|
| ADMIN | 'ADMIN' | Administrateur avec tous les droits |
| MODERATOR | 'MODERATOR' | Moderateur du forum |
| GAME_MASTER | 'GAME_MASTER' | Maitre de jeu |
| PLAYER | 'PLAYER' | Joueur standard (defaut) |

### Hooks

```javascript
// Hash du mot de passe avant creation
hooks: {
  beforeCreate: async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  },
  beforeUpdate: async (user) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }
}
```

### Methodes d'instance

```javascript
// Comparaison du mot de passe
User.prototype.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Retourne les donnees sans le mot de passe
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};
```

### Index

| Nom | Colonnes | Type |
|-----|----------|------|
| PRIMARY | id | Primary Key |
| users_username_unique | username | Unique |
| users_email_unique | email | Unique |

---

## Migration

Fichier : `backend/src/core/migrations/20250123000001-create-users-table.js`

### Structure

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      // ... autres champs
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  }
};
```

### Execution des migrations

```bash
# Executer les migrations
npx sequelize-cli db:migrate

# Annuler la derniere migration
npx sequelize-cli db:migrate:undo
```

---

## Soft Delete

Le modele User utilise le soft delete (`paranoid: true`) :

- La suppression ne retire pas l'enregistrement de la base
- Un champ `deletedAt` est rempli avec la date de suppression
- Les requetes normales excluent automatiquement les enregistrements supprimes
- Permet de conserver l'historique et de restaurer si necessaire

### Requetes avec soft delete

```javascript
// Trouve uniquement les utilisateurs non supprimes
const users = await User.findAll();

// Trouve tous les utilisateurs, y compris supprimes
const allUsers = await User.findAll({ paranoid: false });

// Restaurer un utilisateur supprime
await user.restore();
```

---

## Modeles a venir

Les modules suivants auront leurs propres modeles :

### Forum (a venir)

- Category
- Topic
- Post
- Reaction

### Game (a venir)

- Character
- Campaign
- Session
- Roll

### Portal (a venir)

- Article
- Page
- Media

---

## Liens

- [Systeme d'authentification](./auth.md)
- [Middlewares](./middlewares.md)
- [Architecture Backend](./BACK_ARCHITECTURE.md)
