const { Faction, Ethnie } = require('../../models');

/**
 * Récupérer toutes les factions
 */
exports.getAllFactions = async (req, res) => {
  try {
    const factions = await Faction.findAll({
      where: { deleted_at: null },
      include: [
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
      data: factions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des factions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des factions',
      error: error.message
    });
  }
};

/**
 * Récupérer une faction par ID
 */
exports.getFactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const faction = await Faction.findOne({
      where: { id, deleted_at: null },
      include: [
        {
          model: Ethnie,
          as: 'ethnie',
          attributes: ['id', 'name', 'description']
        }
      ]
    });

    if (!faction) {
      return res.status(404).json({
        success: false,
        message: 'Faction non trouvée'
      });
    }

    res.json({
      success: true,
      data: faction
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la faction:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la faction',
      error: error.message
    });
  }
};

/**
 * Créer une nouvelle faction (admin seulement)
 */
exports.createFaction = async (req, res) => {
  try {
    const { name, description, ethnie_id, is_playable, leader_name, outpost_name } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Le nom de la faction est requis'
      });
    }

    // Vérifier que l'ethnie existe
    if (ethnie_id) {
      const ethnie = await Ethnie.findByPk(ethnie_id);
      if (!ethnie) {
        return res.status(400).json({
          success: false,
          message: 'L\'ethnie spécifiée n\'existe pas'
        });
      }
    }

    const faction = await Faction.create({
      name,
      description,
      ethnie_id,
      is_playable: is_playable !== undefined ? is_playable : true,
      leader_name,
      outpost_name
    });

    // Recharger avec les associations
    await faction.reload({
      include: [
        {
          model: Ethnie,
          as: 'ethnie',
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Faction créée avec succès',
      data: faction
    });
  } catch (error) {
    console.error('Erreur lors de la création de la faction:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Une faction avec ce nom existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la faction',
      error: error.message
    });
  }
};

/**
 * Mettre à jour une faction (admin seulement)
 */
exports.updateFaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, ethnie_id, is_playable, leader_name, outpost_name } = req.body;

    const faction = await Faction.findOne({
      where: { id, deleted_at: null }
    });

    if (!faction) {
      return res.status(404).json({
        success: false,
        message: 'Faction non trouvée'
      });
    }

    // Vérifier que l'ethnie existe si modifiée
    if (ethnie_id && ethnie_id !== faction.ethnie_id) {
      const ethnie = await Ethnie.findByPk(ethnie_id);
      if (!ethnie) {
        return res.status(400).json({
          success: false,
          message: 'L\'ethnie spécifiée n\'existe pas'
        });
      }
    }

    await faction.update({
      name: name || faction.name,
      description: description !== undefined ? description : faction.description,
      ethnie_id: ethnie_id !== undefined ? ethnie_id : faction.ethnie_id,
      is_playable: is_playable !== undefined ? is_playable : faction.is_playable,
      leader_name: leader_name !== undefined ? leader_name : faction.leader_name,
      outpost_name: outpost_name !== undefined ? outpost_name : faction.outpost_name
    });

    // Recharger avec les associations
    await faction.reload({
      include: [
        {
          model: Ethnie,
          as: 'ethnie',
          attributes: ['id', 'name']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Faction mise à jour avec succès',
      data: faction
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la faction:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Une faction avec ce nom existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la faction',
      error: error.message
    });
  }
};

/**
 * Supprimer une faction (soft delete, admin seulement)
 */
exports.deleteFaction = async (req, res) => {
  try {
    const { id } = req.params;

    const faction = await Faction.findOne({
      where: { id, deleted_at: null }
    });

    if (!faction) {
      return res.status(404).json({
        success: false,
        message: 'Faction non trouvée'
      });
    }

    await faction.update({
      deleted_at: new Date()
    });

    res.json({
      success: true,
      message: 'Faction supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la faction:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la faction',
      error: error.message
    });
  }
};
