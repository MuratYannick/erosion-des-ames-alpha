# Système de Permissions du Forum

## Vue d'ensemble

Le système de permissions du forum "Érosion des Âmes" offre un contrôle granulaire et modulaire des accès aux différentes ressources (catégories, sections, topics, posts). Il permet de définir des règles précises basées sur :

- **Le rôle de l'utilisateur** (admin, moderator, game_master, player)
- **L'état du compte** (CGU acceptées, règlement accepté, email vérifié)
- **Les caractéristiques du personnage** (vivant/mort, leader, faction, clan)
- **La relation auteur** (permissions spéciales pour l'auteur d'une ressource)

## Architecture

### Tables de permissions

Le système utilise **9 tables distinctes**, une par type de permission :

1. `forum_permissions_view` - Voir l'élément
2. `forum_permissions_create_section` - Créer une section enfant
3. `forum_permissions_create_topic` - Créer un topic enfant
4. `forum_permissions_edit` - Modifier/supprimer l'élément
5. `forum_permissions_move_section` - Déplacer une section
6. `forum_permissions_move_topic` - Déplacer un topic
7. `forum_permissions_move_post` - Déplacer un post
8. `forum_permissions_pin` - Épingler/désépingler
9. `forum_permissions_lock` - Verrouiller/déverrouiller

### Structure d'une règle de permission

Chaque table de permission contient les champs suivants :

```javascript
{
  id: INTEGER,
  resource_type: ENUM('category', 'section', 'topic'), // Selon le type de permission
  resource_id: INTEGER, // 0 = règle globale

  // Conditions de rôle
  allowed_roles: JSON, // ['admin', 'moderator', ...] ou null (tout le monde)

  // Conditions utilisateur
  require_terms_accepted: BOOLEAN,
  require_forum_rules_accepted: BOOLEAN,
  require_email_verified: BOOLEAN,

  // Conditions personnage
  require_character: BOOLEAN,
  require_character_alive: BOOLEAN,
  require_character_is_leader: BOOLEAN,
  required_faction_ids: JSON, // [1, 2, 3] ou null
  required_clan_ids: JSON, // [5, 6] ou null

  // Gestion de l'auteur
  author_override: ENUM('none', 'and', 'or'),

  // Système de priorité
  priority: INTEGER, // Plus haute priorité = évaluée en premier

  // Règle de refus explicite
  is_deny: BOOLEAN
}
```

## Héritage des permissions

Le système implémente une **hiérarchie d'héritage** :

```
Post → Topic → Section → Section Parent(s) → Catégorie
```

### Fonctionnement

1. Lorsqu'on vérifie une permission sur un topic (ID=10), le système :
   - Récupère les règles du topic 10
   - Remonte vers la section parente
   - Remonte vers les sections parentes (si imbriquées)
   - Remonte vers la catégorie
   - Ajoute les règles globales (resource_id=0)

2. Les règles sont triées par **priorité décroissante**

3. La **première règle applicable** détermine le résultat

## Évaluation des règles

### Ordre d'évaluation

Pour chaque règle, l'évaluation suit cet ordre :

```
1. Vérifier author_override='or' (AVANT le rôle)
   ├─ Si auteur → AUTORISER (sauf si is_deny)
   └─ Sinon → continuer

2. Vérifier le rôle (allowed_roles)
   ├─ null → tout le monde
   ├─ Rôle match → continuer
   └─ Rôle ne match pas → SKIP cette règle

3. Vérifier author_override='and'
   ├─ Auteur → continuer
   └─ Pas auteur → SKIP cette règle

4. Vérifier conditions utilisateur
   ├─ Admin → BYPASS ces conditions
   ├─ terms_accepted (si requis)
   ├─ forum_rules_accepted (si requis)
   └─ email_verified (si requis)

5. Vérifier conditions personnage
   ├─ Personnage requis ?
   ├─ Vivant (si requis)
   ├─ Leader (si requis)
   ├─ Faction (si requise)
   └─ Clan (si requis)

6. Toutes conditions remplies
   ├─ is_deny = true → REFUSER
   └─ is_deny = false → AUTORISER
```

### Résultats possibles

- `true` : Permission **accordée**
- `false` : Permission **refusée explicitement** (is_deny)
- `null` : Règle **non applicable**, passer à la suivante

## Politiques par défaut

Si **aucune règle ne s'applique**, le système utilise ces valeurs par défaut :

```javascript
{
  view: true,                // Lecture publique par défaut
  create_section: false,
  create_topic: false,
  edit: false,
  move_section: false,
  move_topic: false,
  move_post: false,
  pin: false,
  lock: false
}
```

## Rôles et privilèges

### Hiérarchie des rôles

1. **admin** : Contourne toutes les conditions utilisateur, peut utiliser n'importe quel personnage
2. **moderator** : Peut utiliser n'importe quel personnage
3. **game_master** : Peut utiliser les PNJ (user_id=null) ou ses propres personnages
4. **player** : Ne peut utiliser que ses propres personnages

### Permissions par rôle (règles globales par défaut)

#### Catégories

- **Voir** : Tout le monde
- **Créer section** : admin uniquement
- **Modifier/supprimer** : Jamais (ressource statique)
- **Déplacer section** : admin uniquement

#### Sections

- **Voir** : Tout le monde
- **Toutes autres actions** : admin + (moderator avec CGU + règlement + email vérifié)

#### Topics

- **Voir** : Tout le monde
- **Modifier/supprimer** : admin + (moderator avec CGU + règlement + email vérifié) **OU** auteur
- **Autres actions** : admin + (moderator avec CGU + règlement + email vérifié)

## Mode author_override

Le champ `author_override` définit comment l'auteur d'une ressource bénéficie de permissions spéciales :

### `none` (défaut)

Aucun privilège spécial pour l'auteur. Les conditions normales s'appliquent.

```javascript
{
  allowed_roles: ['admin', 'moderator'],
  author_override: 'none'
}
// Seuls admin et moderator peuvent agir
```

### `or` (OU logique)

L'auteur peut agir **même sans remplir les conditions**.

```javascript
{
  allowed_roles: ['admin', 'moderator'],
  require_terms_accepted: true,
  author_override: 'or'
}
// admin OU moderator OU auteur (même sans CGU acceptées)
```

**Cas d'usage** : Permettre aux utilisateurs de modifier leurs propres topics/posts même sans être moderator.

### `and` (ET logique)

L'utilisateur doit être l'auteur **ET** remplir les conditions.

```javascript
{
  allowed_roles: ['player'],
  require_terms_accepted: true,
  author_override: 'and'
}
// player avec CGU acceptées ET est l'auteur
```

**Cas d'usage** : Restreindre une action uniquement à l'auteur (pas même aux moderators).

## Utilisation dans le code

### Service permissionEvaluator

```javascript
const { checkPermission } = require('../services/permissionEvaluator');

// Vérifier une permission
const canView = await checkPermission(
  user,           // Objet utilisateur (ou null si non connecté)
  character,      // Objet personnage (ou null)
  'topic',        // Type de ressource
  topicId,        // ID de la ressource
  'view',         // Type de permission
  topicObject     // Objet complet (optionnel, pour author_override)
);

if (canView) {
  // Autoriser l'accès
} else {
  // Refuser l'accès
}
```

### Middleware Express

Le fichier `middleware/forumPermissions.js` fournit des middlewares préconfigurés :

```javascript
const {
  canViewCategory,
  canViewSection,
  canViewTopic,
  canCreateSection,
  canCreateTopic,
  canEditTopic,
  canPinTopic,
  canLockTopic
} = require('../middleware/forumPermissions');

// Dans les routes
router.get('/topics/:id', canViewTopic(), topicsController.getTopicById);
router.post('/topics', canCreateTopic(), topicsController.createTopic);
router.put('/topics/:id', canEditTopic(), topicsController.updateTopic);
```

### Middleware personnalisé

Pour des cas spécifiques, utiliser la factory :

```javascript
const { requireForumPermission } = require('../middleware/forumPermissions');

// Créer un middleware custom
const canEditTopicInSection = () => requireForumPermission('edit', {
  resourceType: 'topic'
});

router.put('/sections/:section_id/topics/:id',
  canEditTopicInSection(),
  topicsController.updateTopic
);
```

## Détermination automatique de la ressource

Le middleware tente automatiquement de déterminer la ressource à vérifier :

1. **resourceType fourni dans options** → Utilise ce type
2. **Paramètres de route** :
   - `req.params.category_id` → category
   - `req.params.section_id` → section
   - `req.params.topic_id` → topic
3. **Analyse du path** :
   - `/categories/*` → category
   - `/sections/*` → section
   - `/topics/*` → topic
4. **Extraction de l'ID** :
   - `req.params.id`
   - `req.body.{resource_type}_id`

## Gestion des personnages

### Validation de propriété

Selon le rôle, différentes règles s'appliquent :

```javascript
if (user.role === 'admin' || user.role === 'moderator') {
  // Peut utiliser n'importe quel personnage
} else if (user.role === 'game_master') {
  // Peut utiliser PNJ (user_id=null) ou ses propres personnages
  if (character.user_id !== null && character.user_id !== user.id) {
    return null; // Refusé
  }
} else { // player
  // Uniquement ses propres personnages
  if (character.user_id !== user.id) {
    return null; // Refusé
  }
}
```

### Conditions personnage

```javascript
// Personnage vivant
if (rule.require_character_alive && character.is_dead) {
  return null; // Personnage mort
}

// Personnage leader
if (rule.require_character_is_leader && !character.is_leader) {
  return null; // Pas leader
}

// Faction requise
if (rule.required_faction_ids && !rule.required_faction_ids.includes(character.faction_id)) {
  return null; // Mauvaise faction
}

// Clan requis
if (rule.required_clan_ids && !rule.required_clan_ids.includes(character.clan_id)) {
  return null; // Mauvais clan
}
```

## Exemples pratiques

### Exemple 1 : Section RP réservée à une faction

```javascript
// Insertion dans forum_permissions_view
{
  resource_type: 'section',
  resource_id: 5, // Section "Quartier Purificateurs"
  allowed_roles: ['player', 'game_master'],
  require_character: true,
  require_character_alive: true,
  required_faction_ids: [1], // Faction Purificateurs uniquement
  priority: 10
}
```

### Exemple 2 : Topic modifiable par auteur ou mods

```javascript
// Insertion dans forum_permissions_edit
{
  resource_type: 'topic',
  resource_id: 0, // Règle globale
  allowed_roles: ['admin', 'moderator'],
  require_terms_accepted: true,
  require_forum_rules_accepted: true,
  author_override: 'or', // OU l'auteur
  priority: 0
}
```

### Exemple 3 : Verrouillage réservé aux leaders de clan

```javascript
// Insertion dans forum_permissions_lock
{
  resource_type: 'topic',
  resource_id: 0,
  allowed_roles: ['player'],
  require_character: true,
  require_character_alive: true,
  require_character_is_leader: true,
  priority: 5
}
```

### Exemple 4 : Refus explicite pour section archive

```javascript
// Insertion dans forum_permissions_create_topic
{
  resource_type: 'section',
  resource_id: 99, // Section "Archives"
  allowed_roles: null, // Tout le monde
  is_deny: true, // Refus explicite
  priority: 100 // Haute priorité pour bypass autres règles
}
```

## Seeders par défaut

Le fichier `seeders/110-default-forum-permissions.js` crée **16 règles globales** (resource_id=0) :

- **3 règles pour les catégories** (view, create_section, move_section)
- **8 règles pour les sections** (toutes les actions de gestion)
- **5 règles pour les topics** (view, edit avec author_override, actions de gestion)

Ces règles peuvent être surchargées en créant des règles spécifiques avec une priorité plus élevée.

## Tests

### Tests unitaires

- `__tests__/services/permissionEvaluator.test.js` : 20 tests
  - Évaluation des règles
  - Chaîne d'héritage
  - Politiques par défaut
  - Gestion des rôles et personnages

- `__tests__/middleware/forumPermissions.test.js` : 11 tests
  - Middleware factory
  - Détermination automatique des ressources
  - Gestion des erreurs

### Lancer les tests

```bash
npm test -- permissionEvaluator
npm test -- forumPermissions
```

## API de gestion des permissions

### Authentification requise

Toutes les routes de l'API de gestion des permissions nécessitent une authentification et des droits **admin** ou **moderator** (avec CGU, règlement et email vérifiés).

### Routes disponibles

#### GET /api/permissions/:permissionType

Récupère toutes les règles pour un type de permission.

**Types valides** : `view`, `create_section`, `create_topic`, `edit`, `move_section`, `move_topic`, `move_post`, `pin`, `lock`

**Exemple** :
```http
GET /api/permissions/view
Authorization: Bearer <token>
```

**Réponse 200 OK** :
```json
{
  "success": true,
  "message": "16 règle(s) de permission view récupérée(s)",
  "data": [
    {
      "id": 1,
      "resource_type": "category",
      "resource_id": 0,
      "allowed_roles": null,
      "priority": 0,
      "is_deny": false,
      ...
    }
  ]
}
```

#### GET /api/permissions/:permissionType/:id

Récupère une règle spécifique par son ID.

**Exemple** :
```http
GET /api/permissions/edit/5
Authorization: Bearer <token>
```

#### GET /api/permissions/:permissionType/resource/:resourceType/:resourceId

Récupère toutes les règles pour une ressource spécifique.

**Exemple** :
```http
GET /api/permissions/view/resource/section/10
Authorization: Bearer <token>
```

#### POST /api/permissions/:permissionType

Crée une nouvelle règle de permission.

**Exemple** :
```http
POST /api/permissions/view
Authorization: Bearer <token>
Content-Type: application/json

{
  "resource_type": "section",
  "resource_id": 15,
  "allowed_roles": ["player"],
  "require_terms_accepted": true,
  "require_forum_rules_accepted": true,
  "require_email_verified": true,
  "require_character": true,
  "require_character_alive": true,
  "required_faction_ids": [1, 2],
  "priority": 10,
  "is_deny": false
}
```

**Réponse 201 Created** :
```json
{
  "success": true,
  "message": "Règle de permission view créée avec succès",
  "data": {
    "id": 17,
    "resource_type": "section",
    "resource_id": 15,
    ...
  }
}
```

#### PUT /api/permissions/:permissionType/:id

Met à jour une règle existante.

**Exemple** :
```http
PUT /api/permissions/view/17
Authorization: Bearer <token>
Content-Type: application/json

{
  "priority": 20,
  "is_deny": true
}
```

**Réponse 200 OK** :
```json
{
  "success": true,
  "message": "Règle de permission view mise à jour avec succès",
  "data": { ... }
}
```

#### DELETE /api/permissions/:permissionType/:id

Supprime une règle de permission.

**Exemple** :
```http
DELETE /api/permissions/view/17
Authorization: Bearer <token>
```

**Réponse 200 OK** :
```json
{
  "success": true,
  "message": "Règle de permission view supprimée avec succès"
}
```

### Codes d'erreur

- **400 Bad Request** : Type de permission invalide, champs requis manquants, ou erreur de validation
- **401 Unauthorized** : Authentification requise
- **403 Forbidden** : Droits insuffisants (réservé aux admin/moderator)
- **404 Not Found** : Règle de permission non trouvée
- **500 Internal Server Error** : Erreur serveur

### Validation des champs

Lors de la création/modification d'une règle :

- `resource_type` : **Requis**. Valeurs possibles dépendent du type de permission
- `resource_id` : **Requis**. Utiliser `0` pour une règle globale
- `allowed_roles` : JSON array ou `null`. Ex: `["admin", "moderator"]` ou `null` (tout le monde)
- `required_faction_ids` : JSON array ou `null`. Ex: `[1, 2, 3]`
- `required_clan_ids` : JSON array ou `null`. Ex: `[5]`
- `author_override` : `"none"`, `"and"`, ou `"or"` (défaut: `"none"`)
- `priority` : Integer (défaut: 0)
- `is_deny` : Boolean (défaut: false)

## Limitations et notes

### Limitations actuelles

1. **Authentification non implémentée** : Les middlewares de permissions sont actuellement commentés dans les routes en attendant l'implémentation du middleware d'authentification.

2. **Posts** : Les posts héritent des permissions de leur topic. Il n'y a pas de table de permissions spécifique pour les posts.

3. **Modification des catégories** : Par défaut, les catégories ne peuvent pas être modifiées (ressource statique gérée via admin).

### Notes importantes

- **resource_id=0** : Indique une règle globale qui s'applique à toutes les ressources de ce type
- **allowed_roles=null** : Signifie "tout le monde", y compris les utilisateurs non connectés
- **Priority** : Plus la valeur est élevée, plus la règle est évaluée en priorité
- **is_deny** : Permet de créer des règles de refus explicites qui bypassen les règles d'autorisation

## Roadmap

### Phase actuelle (Complétée)

- ✅ Migrations des 9 tables de permissions
- ✅ Modèles Sequelize
- ✅ Service d'évaluation des permissions
- ✅ Middleware Express
- ✅ Permissions par défaut (seeder)
- ✅ Tests unitaires et d'intégration
- ✅ Documentation
- ✅ API de gestion des permissions (CRUD)
- ✅ Middleware d'authentification pour l'API de gestion
- ✅ Tests pour l'API de gestion (54 tests)

### Prochaines étapes

- ⏳ Implémentation du middleware d'authentification JWT complet
- ⏳ Activation des middlewares de permissions dans les routes forum
- ⏳ Interface d'administration pour gérer les permissions
- ⏳ Permissions temps réel (WebSocket)
- ⏳ Cache des permissions pour optimisation

## Support et contribution

Pour toute question ou suggestion concernant le système de permissions :

1. Consulter cette documentation
2. Consulter les tests unitaires pour des exemples concrets
3. Ouvrir une issue sur le repository du projet
