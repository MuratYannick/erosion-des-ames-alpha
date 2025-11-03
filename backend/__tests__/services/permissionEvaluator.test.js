const {
  checkPermission,
  evaluateRule,
  getInheritanceChain,
  DEFAULT_POLICIES
} = require('../../src/services/permissionEvaluator');

// Mock models before requiring
jest.mock('../../src/models', () => ({
  ForumPermissionView: {
    findAll: jest.fn()
  },
  Category: {
    findByPk: jest.fn()
  },
  Section: {
    findByPk: jest.fn()
  },
  Topic: {
    findByPk: jest.fn()
  }
}));

const {
  ForumPermissionView,
  Category,
  Section,
  Topic
} = require('../../src/models');

describe('Permission Evaluator Service', () => {
  // Helper pour créer une règle avec valeurs par défaut
  const createRule = (overrides = {}) => ({
    allowed_roles: null,
    require_terms_accepted: false,
    require_forum_rules_accepted: false,
    require_email_verified: false,
    require_character: false,
    require_character_alive: true,
    require_character_is_leader: false,
    required_faction_ids: null,
    required_clan_ids: null,
    author_override: 'none',
    is_deny: false,
    ...overrides
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('evaluateRule', () => {
    it('devrait autoriser si allowed_roles est null (tout le monde)', () => {
      const rule = {
        allowed_roles: null,
        require_terms_accepted: false,
        require_forum_rules_accepted: false,
        require_email_verified: false,
        require_character: false,
        is_deny: false,
        author_override: 'none'
      };

      const result = evaluateRule(rule, null, null);
      expect(result).toBe(true);
    });

    it('devrait refuser si rôle non autorisé', () => {
      const rule = {
        allowed_roles: ['admin', 'moderator'],
        require_terms_accepted: false,
        require_forum_rules_accepted: false,
        require_email_verified: false,
        require_character: false,
        is_deny: false,
        author_override: 'none'
      };

      const user = { role: 'player' };
      const result = evaluateRule(rule, user, null);
      expect(result).toBe(null); // Règle non applicable
    });

    it('devrait autoriser admin même sans conditions remplies', () => {
      const rule = {
        allowed_roles: ['admin', 'moderator'],
        require_terms_accepted: true,
        require_forum_rules_accepted: true,
        require_email_verified: true,
        require_character: false,
        is_deny: false,
        author_override: 'none'
      };

      const adminUser = {
        role: 'admin',
        terms_accepted: false,
        forum_rules_accepted: false,
        email_verified: false
      };

      const result = evaluateRule(rule, adminUser, null);
      expect(result).toBe(true); // Admin bypass conditions
    });

    it('devrait refuser moderator sans conditions remplies', () => {
      const rule = {
        allowed_roles: ['admin', 'moderator'],
        require_terms_accepted: true,
        require_forum_rules_accepted: true,
        require_email_verified: true,
        require_character: false,
        is_deny: false,
        author_override: 'none'
      };

      const modUser = {
        role: 'moderator',
        terms_accepted: false,
        forum_rules_accepted: false,
        email_verified: false
      };

      const result = evaluateRule(rule, modUser, null);
      expect(result).toBe(null); // Conditions non remplies
    });

    it('devrait autoriser moderator avec toutes conditions remplies', () => {
      const rule = {
        allowed_roles: ['admin', 'moderator'],
        require_terms_accepted: true,
        require_forum_rules_accepted: true,
        require_email_verified: true,
        require_character: false,
        is_deny: false,
        author_override: 'none'
      };

      const modUser = {
        role: 'moderator',
        terms_accepted: true,
        forum_rules_accepted: true,
        email_verified: true
      };

      const result = evaluateRule(rule, modUser, null);
      expect(result).toBe(true);
    });

    it('devrait gérer author_override=or correctement', () => {
      const rule = {
        allowed_roles: ['admin'],
        require_terms_accepted: true,
        require_forum_rules_accepted: true,
        require_email_verified: true,
        require_character: false,
        is_deny: false,
        author_override: 'or'
      };

      const regularUser = {
        id: 1,
        role: 'player',
        terms_accepted: false
      };

      const resource = {
        author_user_id: 1 // L'utilisateur est l'auteur
      };

      const result = evaluateRule(rule, regularUser, null, resource);
      expect(result).toBe(true); // Autorisé car auteur (malgré conditions non remplies)
    });

    it('devrait gérer author_override=and correctement', () => {
      const rule = {
        allowed_roles: ['player'],
        require_terms_accepted: true,
        require_character: false,
        is_deny: false,
        author_override: 'and'
      };

      const user = {
        id: 1,
        role: 'player',
        terms_accepted: true
      };

      const resource = {
        author_user_id: 2 // Pas l'auteur
      };

      const result = evaluateRule(rule, user, null, resource);
      expect(result).toBe(null); // Refusé car pas l'auteur (malgré conditions remplies)
    });

    it('devrait vérifier personnage vivant', () => {
      const rule = {
        allowed_roles: ['player'],
        require_character: true,
        require_character_alive: true,
        is_deny: false,
        author_override: 'none'
      };

      const user = { id: 1, role: 'player' };
      const deadCharacter = {
        id: 1,
        user_id: 1,
        is_dead: true
      };

      const result = evaluateRule(rule, user, deadCharacter);
      expect(result).toBe(null); // Personnage mort
    });

    it('devrait vérifier personnage leader', () => {
      const rule = {
        allowed_roles: ['player'],
        require_character: true,
        require_character_is_leader: true,
        is_deny: false,
        author_override: 'none'
      };

      const user = { id: 1, role: 'player' };
      const normalCharacter = {
        id: 1,
        user_id: 1,
        is_dead: false,
        is_leader: false
      };

      const result = evaluateRule(rule, user, normalCharacter);
      expect(result).toBe(null); // Pas leader
    });

    it('devrait vérifier faction requise', () => {
      const rule = {
        allowed_roles: ['player'],
        require_character: true,
        required_faction_ids: [1, 2],
        is_deny: false,
        author_override: 'none'
      };

      const user = { id: 1, role: 'player' };
      const character = {
        id: 1,
        user_id: 1,
        is_dead: false,
        faction_id: 3 // Faction non autorisée
      };

      const result = evaluateRule(rule, user, character);
      expect(result).toBe(null); // Mauvaise faction
    });

    it('devrait vérifier clan requis', () => {
      const rule = {
        allowed_roles: ['player'],
        require_terms_accepted: false,
        require_forum_rules_accepted: false,
        require_email_verified: false,
        require_character: true,
        require_character_alive: true,
        require_character_is_leader: false,
        required_faction_ids: null,
        required_clan_ids: [5],
        is_deny: false,
        author_override: 'none'
      };

      const user = { id: 1, role: 'player' };
      const character = {
        id: 1,
        user_id: 1,
        is_dead: false,
        clan_id: 5 // Bon clan
      };

      const result = evaluateRule(rule, user, character);
      expect(result).toBe(true); // Autorisé
    });

    it('devrait gérer is_deny correctement', () => {
      const rule = {
        allowed_roles: ['player'],
        require_terms_accepted: false,
        is_deny: true, // Règle de refus
        author_override: 'none'
      };

      const user = { role: 'player' };
      const result = evaluateRule(rule, user, null);
      expect(result).toBe(false); // Refus explicite
    });

    it('devrait autoriser GM à utiliser PNJ', () => {
      const rule = createRule({
        allowed_roles: ['game_master'],
        require_character: true
      });

      const gmUser = { id: 5, role: 'game_master' };
      const npcCharacter = {
        id: 10,
        user_id: null, // PNJ (pas de propriétaire)
        is_dead: false
      };

      const result = evaluateRule(rule, gmUser, npcCharacter);
      expect(result).toBe(true);
    });

    it('devrait refuser GM à utiliser personnage de joueur', () => {
      const rule = createRule({
        allowed_roles: ['game_master'],
        require_character: true
      });

      const gmUser = { id: 5, role: 'game_master' };
      const playerCharacter = {
        id: 10,
        user_id: 1, // Appartient au joueur 1
        is_dead: false
      };

      const result = evaluateRule(rule, gmUser, playerCharacter);
      expect(result).toBe(null); // GM ne peut pas utiliser perso de joueur
    });

    it('devrait autoriser admin/moderator à utiliser n\'importe quel personnage', () => {
      const rule = createRule({
        allowed_roles: ['admin', 'moderator'],
        require_character: true
      });

      const adminUser = { id: 1, role: 'admin' };
      const anyCharacter = {
        id: 50,
        user_id: 999, // Appartient à quelqu'un d'autre
        is_dead: false
      };

      const result = evaluateRule(rule, adminUser, anyCharacter);
      expect(result).toBe(true); // Admin peut tout
    });
  });

  describe('getInheritanceChain', () => {
    it('devrait retourner uniquement la catégorie pour une catégorie', async () => {
      const chain = await getInheritanceChain('category', 1);
      expect(chain).toEqual([{ type: 'category', id: 1 }]);
    });

    it('devrait remonter section → category', async () => {
      const mockSection = {
        id: 5,
        category_id: 2,
        parent_section_id: null
      };

      Section.findByPk = jest.fn().mockResolvedValue(mockSection);

      const chain = await getInheritanceChain('section', 5);

      expect(chain).toEqual([
        { type: 'section', id: 5 },
        { type: 'category', id: 2 }
      ]);
    });

    it('devrait remonter topic → section → category', async () => {
      const mockTopic = {
        id: 10,
        section: {
          id: 5,
          category_id: 2,
          parent_section_id: null
        }
      };

      Topic.findByPk = jest.fn().mockResolvedValue(mockTopic);

      const chain = await getInheritanceChain('topic', 10);

      expect(chain).toEqual([
        { type: 'topic', id: 10 },
        { type: 'section', id: 5 },
        { type: 'category', id: 2 }
      ]);
    });
  });

  describe('checkPermission', () => {
    it('devrait retourner la politique par défaut si aucune règle', async () => {
      ForumPermissionView.findAll = jest.fn().mockResolvedValue([]);
      Topic.findByPk = jest.fn().mockResolvedValue({
        id: 1,
        section: { id: 1, category_id: 1, parent_section_id: null }
      });

      const result = await checkPermission(null, null, 'topic', 1, 'view');

      expect(result).toBe(DEFAULT_POLICIES.view); // true
    });

    it('devrait appliquer la règle de plus haute priorité', async () => {
      const mockRules = [
        {
          priority: 5,
          allowed_roles: ['admin'],
          require_terms_accepted: false,
          require_forum_rules_accepted: false,
          require_email_verified: false,
          require_character: false,
          is_deny: false,
          author_override: 'none',
          toJSON: function() { return this; }
        },
        {
          priority: 10, // Plus haute priorité
          allowed_roles: null,
          require_terms_accepted: false,
          require_forum_rules_accepted: false,
          require_email_verified: false,
          require_character: false,
          is_deny: true, // Refus
          author_override: 'none',
          toJSON: function() { return this; }
        }
      ];

      ForumPermissionView.findAll = jest.fn().mockResolvedValue(mockRules);
      Topic.findByPk = jest.fn().mockResolvedValue({
        id: 1,
        section: { id: 1, category_id: 1, parent_section_id: null }
      });

      const result = await checkPermission(null, null, 'topic', 1, 'view');

      expect(result).toBe(false); // Règle de refus prioritaire
    });
  });
});
