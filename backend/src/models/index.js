const User = require('./User');
const Ethnie = require('./Ethnie');
const Faction = require('./Faction');
const Clan = require('./Clan');
const Character = require('./Character');
const Category = require('./Category');
const Section = require('./Section');
const Topic = require('./Topic');
const Post = require('./Post');

// ==========================================
// ASSOCIATIONS / RELATIONS ENTRE MODÈLES
// ==========================================

// ------------------------------------------
// Relations Ethnie
// ------------------------------------------

// Ethnie → Factions (1:N)
Ethnie.hasMany(Faction, {
  foreignKey: 'ethnie_id',
  as: 'factions'
});
Faction.belongsTo(Ethnie, {
  foreignKey: 'ethnie_id',
  as: 'ethnie'
});

// Ethnie → Clans (1:N)
Ethnie.hasMany(Clan, {
  foreignKey: 'ethnie_id',
  as: 'clans'
});
Clan.belongsTo(Ethnie, {
  foreignKey: 'ethnie_id',
  as: 'ethnie'
});

// Ethnie → Characters (1:N obligatoire)
Ethnie.hasMany(Character, {
  foreignKey: 'ethnie_id',
  as: 'characters'
});
Character.belongsTo(Ethnie, {
  foreignKey: 'ethnie_id',
  as: 'ethnie'
});

// ------------------------------------------
// Relations Faction
// ------------------------------------------

// Faction → Clans (1:N)
Faction.hasMany(Clan, {
  foreignKey: 'faction_id',
  as: 'clans'
});
Clan.belongsTo(Faction, {
  foreignKey: 'faction_id',
  as: 'faction'
});

// Faction ← Clan (N:1 via main_clan_id) - Clan principal
Faction.belongsTo(Clan, {
  foreignKey: 'main_clan_id',
  as: 'mainClan'
});
Clan.hasOne(Faction, {
  foreignKey: 'main_clan_id',
  as: 'ledFaction'
});

// Faction → Characters (1:N)
Faction.hasMany(Character, {
  foreignKey: 'faction_id',
  as: 'characters'
});
Character.belongsTo(Faction, {
  foreignKey: 'faction_id',
  as: 'faction'
});

// Faction → Sections (1:N)
Faction.hasMany(Section, {
  foreignKey: 'faction_id',
  as: 'sections'
});
Section.belongsTo(Faction, {
  foreignKey: 'faction_id',
  as: 'faction'
});

// Faction → Topics (1:N)
Faction.hasMany(Topic, {
  foreignKey: 'faction_id',
  as: 'topics'
});
Topic.belongsTo(Faction, {
  foreignKey: 'faction_id',
  as: 'faction'
});

// ------------------------------------------
// Relations Clan
// ------------------------------------------

// Clan ← Character (N:1 via leader_character_id) - Leader du clan
Clan.belongsTo(Character, {
  foreignKey: 'leader_character_id',
  as: 'leader'
});
Character.hasOne(Clan, {
  foreignKey: 'leader_character_id',
  as: 'ledClan'
});

// Clan → Characters (1:N) - Membres du clan
Clan.hasMany(Character, {
  foreignKey: 'clan_id',
  as: 'members'
});
Character.belongsTo(Clan, {
  foreignKey: 'clan_id',
  as: 'clan'
});

// Clan → Sections (1:N)
Clan.hasMany(Section, {
  foreignKey: 'clan_id',
  as: 'sections'
});
Section.belongsTo(Clan, {
  foreignKey: 'clan_id',
  as: 'clan'
});

// Clan → Topics (1:N)
Clan.hasMany(Topic, {
  foreignKey: 'clan_id',
  as: 'topics'
});
Topic.belongsTo(Clan, {
  foreignKey: 'clan_id',
  as: 'clan'
});

// ------------------------------------------
// Relations User
// ------------------------------------------

// User → Characters (1:N)
User.hasMany(Character, {
  foreignKey: 'user_id',
  as: 'characters'
});
Character.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// User → Topics (1:N via author_user_id)
User.hasMany(Topic, {
  foreignKey: 'author_user_id',
  as: 'topics'
});
Topic.belongsTo(User, {
  foreignKey: 'author_user_id',
  as: 'authorUser'
});

// User → Posts (1:N via author_user_id)
User.hasMany(Post, {
  foreignKey: 'author_user_id',
  as: 'posts'
});
Post.belongsTo(User, {
  foreignKey: 'author_user_id',
  as: 'authorUser'
});

// ------------------------------------------
// Relations Character
// ------------------------------------------

// Character → Topics (1:N via author_character_id)
Character.hasMany(Topic, {
  foreignKey: 'author_character_id',
  as: 'topics'
});
Topic.belongsTo(Character, {
  foreignKey: 'author_character_id',
  as: 'authorCharacter'
});

// Character → Posts (1:N via author_character_id)
Character.hasMany(Post, {
  foreignKey: 'author_character_id',
  as: 'posts'
});
Post.belongsTo(Character, {
  foreignKey: 'author_character_id',
  as: 'authorCharacter'
});

// ------------------------------------------
// Relations Category
// ------------------------------------------

// Category → Sections (1:N obligatoire)
Category.hasMany(Section, {
  foreignKey: 'category_id',
  as: 'sections'
});
Section.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category'
});

// ------------------------------------------
// Relations Section (hiérarchie)
// ------------------------------------------

// Section → Sections enfants (1:N auto-référence)
Section.hasMany(Section, {
  foreignKey: 'parent_section_id',
  as: 'childSections'
});
Section.belongsTo(Section, {
  foreignKey: 'parent_section_id',
  as: 'parentSection'
});

// Section → Topics (1:N)
Section.hasMany(Topic, {
  foreignKey: 'section_id',
  as: 'topics'
});
Topic.belongsTo(Section, {
  foreignKey: 'section_id',
  as: 'section'
});

// ------------------------------------------
// Relations Topic
// ------------------------------------------

// Topic → Posts (1:N)
Topic.hasMany(Post, {
  foreignKey: 'topic_id',
  as: 'posts'
});
Post.belongsTo(Topic, {
  foreignKey: 'topic_id',
  as: 'topic'
});

// ==========================================
// EXPORT DE TOUS LES MODÈLES
// ==========================================

module.exports = {
  User,
  Ethnie,
  Faction,
  Clan,
  Character,
  Category,
  Section,
  Topic,
  Post
};
