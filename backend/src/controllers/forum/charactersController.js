const { Character, User, Ethnie, Faction, Clan } = require('../../models');

/**
 * Récupérer tous les personnages
 */
exports.getAllCharacters = async (req, res) => {
  try {
    const { user_id, faction_id, clan_id, is_dead } = req.query;

    const where = { deleted_at: null };
    if (user_id) where.user_id = user_id;
    if (faction_id) where.faction_id = faction_id;
    if (clan_id) where.clan_id = clan_id;
    if (is_dead !== undefined) where.is_dead = is_dead === 'true';

    const characters = await Character.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'user_name', 'role']
        },
        {
          model: Ethnie,
          as: 'ethnie',
          attributes: ['id', 'name']
        },
        {
          model: Faction,
          as: 'faction',
          attributes: ['id', 'name']
        },
        {
          model: Clan,
          as: 'clan',
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: characters
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des personnages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des personnages',
      error: error.message
    });
  }
};

/**
 * Récupérer les personnages de l'utilisateur connecté
 */
exports.getMyCharacters = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est connecté
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    const characters = await Character.findAll({
      where: {
        user_id: req.user.id,
        deleted_at: null
      },
      include: [
        {
          model: Ethnie,
          as: 'ethnie',
          attributes: ['id', 'name']
        },
        {
          model: Faction,
          as: 'faction',
          attributes: ['id', 'name']
        },
        {
          model: Clan,
          as: 'clan',
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: characters
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des personnages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des personnages',
      error: error.message
    });
  }
};

/**
 * Récupérer un personnage par ID
 */
exports.getCharacterById = async (req, res) => {
  try {
    const { id } = req.params;

    const character = await Character.findOne({
      where: { id, deleted_at: null },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'user_name', 'email', 'role']
        },
        {
          model: Ethnie,
          as: 'ethnie',
          attributes: ['id', 'name', 'description']
        },
        {
          model: Faction,
          as: 'faction',
          attributes: ['id', 'name', 'description', 'outpost_name']
        },
        {
          model: Clan,
          as: 'clan',
          attributes: ['id', 'name', 'description', 'leader_name']
        }
      ]
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Personnage non trouvé'
      });
    }

    res.json({
      success: true,
      data: character
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du personnage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du personnage',
      error: error.message
    });
  }
};

/**
 * Créer un nouveau personnage
 */
exports.createCharacter = async (req, res) => {
  try {
    const { name, user_id, ethnie_id, faction_id, clan_id, is_leader, description } = req.body;

    // Validation
    if (!name || !ethnie_id) {
      return res.status(400).json({
        success: false,
        message: 'Le nom et l\'ethnie sont requis'
      });
    }

    // Vérifier que l'utilisateur existe
    if (user_id) {
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'L\'utilisateur spécifié n\'existe pas'
        });
      }
    }

    // Vérifier que l'ethnie existe
    const ethnie = await Ethnie.findByPk(ethnie_id);
    if (!ethnie) {
      return res.status(400).json({
        success: false,
        message: 'L\'ethnie spécifiée n\'existe pas'
      });
    }

    // Vérifier que la faction existe si spécifiée
    if (faction_id) {
      const faction = await Faction.findByPk(faction_id);
      if (!faction) {
        return res.status(400).json({
          success: false,
          message: 'La faction spécifiée n\'existe pas'
        });
      }
    }

    // Vérifier que le clan existe si spécifié
    if (clan_id) {
      const clan = await Clan.findByPk(clan_id);
      if (!clan) {
        return res.status(400).json({
          success: false,
          message: 'Le clan spécifié n\'existe pas'
        });
      }
    }

    const character = await Character.create({
      name,
      user_id,
      ethnie_id,
      faction_id,
      clan_id,
      is_leader: is_leader || false,
      is_dead: false,
      description
    });

    // Recharger avec les associations
    await character.reload({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'user_name']
        },
        {
          model: Ethnie,
          as: 'ethnie',
          attributes: ['id', 'name']
        },
        {
          model: Faction,
          as: 'faction',
          attributes: ['id', 'name']
        },
        {
          model: Clan,
          as: 'clan',
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Personnage créé avec succès',
      data: character
    });
  } catch (error) {
    console.error('Erreur lors de la création du personnage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du personnage',
      error: error.message
    });
  }
};

/**
 * Mettre à jour un personnage
 */
exports.updateCharacter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, user_id, ethnie_id, faction_id, clan_id, is_leader, is_dead, description } = req.body;

    const character = await Character.findOne({
      where: { id, deleted_at: null }
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Personnage non trouvé'
      });
    }

    // Vérifier que l'utilisateur existe si modifié
    if (user_id !== undefined && user_id !== character.user_id) {
      if (user_id !== null) {
        const user = await User.findByPk(user_id);
        if (!user) {
          return res.status(400).json({
            success: false,
            message: 'L\'utilisateur spécifié n\'existe pas'
          });
        }
      }
    }

    // Vérifier que l'ethnie existe si modifiée
    if (ethnie_id && ethnie_id !== character.ethnie_id) {
      const ethnie = await Ethnie.findByPk(ethnie_id);
      if (!ethnie) {
        return res.status(400).json({
          success: false,
          message: 'L\'ethnie spécifiée n\'existe pas'
        });
      }
    }

    // Vérifier que la faction existe si modifiée
    if (faction_id !== undefined && faction_id !== character.faction_id) {
      if (faction_id !== null) {
        const faction = await Faction.findByPk(faction_id);
        if (!faction) {
          return res.status(400).json({
            success: false,
            message: 'La faction spécifiée n\'existe pas'
          });
        }
      }
    }

    // Vérifier que le clan existe si modifié
    if (clan_id !== undefined && clan_id !== character.clan_id) {
      if (clan_id !== null) {
        const clan = await Clan.findByPk(clan_id);
        if (!clan) {
          return res.status(400).json({
            success: false,
            message: 'Le clan spécifié n\'existe pas'
          });
        }
      }
    }

    await character.update({
      name: name || character.name,
      user_id: user_id !== undefined ? user_id : character.user_id,
      ethnie_id: ethnie_id || character.ethnie_id,
      faction_id: faction_id !== undefined ? faction_id : character.faction_id,
      clan_id: clan_id !== undefined ? clan_id : character.clan_id,
      is_leader: is_leader !== undefined ? is_leader : character.is_leader,
      is_dead: is_dead !== undefined ? is_dead : character.is_dead,
      description: description !== undefined ? description : character.description
    });

    // Recharger avec les associations
    await character.reload({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'user_name']
        },
        {
          model: Ethnie,
          as: 'ethnie',
          attributes: ['id', 'name']
        },
        {
          model: Faction,
          as: 'faction',
          attributes: ['id', 'name']
        },
        {
          model: Clan,
          as: 'clan',
          attributes: ['id', 'name']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Personnage mis à jour avec succès',
      data: character
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du personnage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du personnage',
      error: error.message
    });
  }
};

/**
 * Supprimer un personnage (soft delete)
 */
exports.deleteCharacter = async (req, res) => {
  try {
    const { id } = req.params;

    const character = await Character.findOne({
      where: { id, deleted_at: null }
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Personnage non trouvé'
      });
    }

    await character.update({
      deleted_at: new Date()
    });

    res.json({
      success: true,
      message: 'Personnage supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du personnage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du personnage',
      error: error.message
    });
  }
};
