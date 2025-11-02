const { Clan, Faction, Ethnie } = require('../../models');

/**
 * Récupérer tous les clans
 */
exports.getAllClans = async (req, res) => {
  try {
    const { faction_id, is_playable } = req.query;

    const where = { deleted_at: null };
    if (faction_id) where.faction_id = faction_id;
    if (is_playable !== undefined) where.is_playable = is_playable === 'true';

    const clans = await Clan.findAll({
      where,
      include: [
        {
          model: Faction,
          as: 'faction',
          attributes: ['id', 'name'],
          include: [
            {
              model: Ethnie,
              as: 'ethnie',
              attributes: ['id', 'name']
            }
          ]
        },
        {
          model: Ethnie,
          as: 'ethnie',
          attributes: ['id', 'name']
        }
      ],
      order: [['id', 'ASC']]
    });

    res.json({
      success: true,
      data: clans
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des clans:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des clans',
      error: error.message
    });
  }
};

/**
 * Récupérer un clan par ID
 */
exports.getClanById = async (req, res) => {
  try {
    const { id } = req.params;

    const clan = await Clan.findOne({
      where: { id, deleted_at: null },
      include: [
        {
          model: Faction,
          as: 'faction',
          attributes: ['id', 'name', 'description', 'outpost_name'],
          include: [
            {
              model: Ethnie,
              as: 'ethnie',
              attributes: ['id', 'name']
            }
          ]
        },
        {
          model: Ethnie,
          as: 'ethnie',
          attributes: ['id', 'name', 'description']
        }
      ]
    });

    if (!clan) {
      return res.status(404).json({
        success: false,
        message: 'Clan non trouvé'
      });
    }

    res.json({
      success: true,
      data: clan
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du clan:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du clan',
      error: error.message
    });
  }
};

/**
 * Créer un nouveau clan (admin seulement)
 */
exports.createClan = async (req, res) => {
  try {
    const { name, description, faction_id, ethnie_id, is_playable, is_leader, leader_name } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Le nom du clan est requis'
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

    // Vérifier que l'ethnie existe si spécifiée
    if (ethnie_id) {
      const ethnie = await Ethnie.findByPk(ethnie_id);
      if (!ethnie) {
        return res.status(400).json({
          success: false,
          message: 'L\'ethnie spécifiée n\'existe pas'
        });
      }
    }

    const clan = await Clan.create({
      name,
      description,
      faction_id,
      ethnie_id,
      is_playable: is_playable !== undefined ? is_playable : true,
      is_leader: is_leader || false,
      leader_name
    });

    // Recharger avec les associations
    await clan.reload({
      include: [
        {
          model: Faction,
          as: 'faction',
          attributes: ['id', 'name'],
          include: [
            {
              model: Ethnie,
              as: 'ethnie',
              attributes: ['id', 'name']
            }
          ]
        },
        {
          model: Ethnie,
          as: 'ethnie',
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Clan créé avec succès',
      data: clan
    });
  } catch (error) {
    console.error('Erreur lors de la création du clan:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Un clan avec ce nom existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du clan',
      error: error.message
    });
  }
};

/**
 * Mettre à jour un clan (admin seulement)
 */
exports.updateClan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, faction_id, ethnie_id, is_playable, is_leader, leader_name } = req.body;

    const clan = await Clan.findOne({
      where: { id, deleted_at: null }
    });

    if (!clan) {
      return res.status(404).json({
        success: false,
        message: 'Clan non trouvé'
      });
    }

    // Vérifier que la faction existe si modifiée
    if (faction_id !== undefined && faction_id !== clan.faction_id) {
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

    // Vérifier que l'ethnie existe si modifiée
    if (ethnie_id !== undefined && ethnie_id !== clan.ethnie_id) {
      const ethnie = await Ethnie.findByPk(ethnie_id);
      if (!ethnie) {
        return res.status(400).json({
          success: false,
          message: 'L\'ethnie spécifiée n\'existe pas'
        });
      }
    }

    await clan.update({
      name: name || clan.name,
      description: description !== undefined ? description : clan.description,
      faction_id: faction_id !== undefined ? faction_id : clan.faction_id,
      ethnie_id: ethnie_id !== undefined ? ethnie_id : clan.ethnie_id,
      is_playable: is_playable !== undefined ? is_playable : clan.is_playable,
      is_leader: is_leader !== undefined ? is_leader : clan.is_leader,
      leader_name: leader_name !== undefined ? leader_name : clan.leader_name
    });

    // Recharger avec les associations
    await clan.reload({
      include: [
        {
          model: Faction,
          as: 'faction',
          attributes: ['id', 'name'],
          include: [
            {
              model: Ethnie,
              as: 'ethnie',
              attributes: ['id', 'name']
            }
          ]
        },
        {
          model: Ethnie,
          as: 'ethnie',
          attributes: ['id', 'name']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Clan mis à jour avec succès',
      data: clan
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du clan:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Un clan avec ce nom existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du clan',
      error: error.message
    });
  }
};

/**
 * Supprimer un clan (soft delete, admin seulement)
 */
exports.deleteClan = async (req, res) => {
  try {
    const { id } = req.params;

    const clan = await Clan.findOne({
      where: { id, deleted_at: null }
    });

    if (!clan) {
      return res.status(404).json({
        success: false,
        message: 'Clan non trouvé'
      });
    }

    await clan.update({
      deleted_at: new Date()
    });

    res.json({
      success: true,
      message: 'Clan supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du clan:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du clan',
      error: error.message
    });
  }
};
