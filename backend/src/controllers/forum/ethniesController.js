const { Ethnie } = require('../../models');

/**
 * Récupérer toutes les ethnies
 */
exports.getAllEthnies = async (req, res) => {
  try {
    const ethnies = await Ethnie.findAll({
      where: { deleted_at: null },
      order: [['id', 'ASC']]
    });

    res.json({
      success: true,
      data: ethnies
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des ethnies:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des ethnies',
      error: error.message
    });
  }
};

/**
 * Récupérer une ethnie par ID
 */
exports.getEthnieById = async (req, res) => {
  try {
    const { id } = req.params;

    const ethnie = await Ethnie.findOne({
      where: { id, deleted_at: null }
    });

    if (!ethnie) {
      return res.status(404).json({
        success: false,
        message: 'Ethnie non trouvée'
      });
    }

    res.json({
      success: true,
      data: ethnie
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'ethnie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'ethnie',
      error: error.message
    });
  }
};

/**
 * Créer une nouvelle ethnie (admin seulement)
 */
exports.createEthnie = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Le nom de l\'ethnie est requis'
      });
    }

    const ethnie = await Ethnie.create({
      name,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Ethnie créée avec succès',
      data: ethnie
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'ethnie:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Une ethnie avec ce nom existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'ethnie',
      error: error.message
    });
  }
};

/**
 * Mettre à jour une ethnie (admin seulement)
 */
exports.updateEthnie = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const ethnie = await Ethnie.findOne({
      where: { id, deleted_at: null }
    });

    if (!ethnie) {
      return res.status(404).json({
        success: false,
        message: 'Ethnie non trouvée'
      });
    }

    await ethnie.update({
      name: name || ethnie.name,
      description: description !== undefined ? description : ethnie.description
    });

    res.json({
      success: true,
      message: 'Ethnie mise à jour avec succès',
      data: ethnie
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'ethnie:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Une ethnie avec ce nom existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'ethnie',
      error: error.message
    });
  }
};

/**
 * Supprimer une ethnie (soft delete, admin seulement)
 */
exports.deleteEthnie = async (req, res) => {
  try {
    const { id } = req.params;

    const ethnie = await Ethnie.findOne({
      where: { id, deleted_at: null }
    });

    if (!ethnie) {
      return res.status(404).json({
        success: false,
        message: 'Ethnie non trouvée'
      });
    }

    await ethnie.update({
      deleted_at: new Date()
    });

    res.json({
      success: true,
      message: 'Ethnie supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'ethnie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'ethnie',
      error: error.message
    });
  }
};
