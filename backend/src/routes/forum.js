const express = require('express');
const router = express.Router();

// Controllers
const ethniesController = require('../controllers/forum/ethniesController');
const factionsController = require('../controllers/forum/factionsController');
const clansController = require('../controllers/forum/clansController');

// Middleware (à implémenter)
// const { authenticateToken, requireAdmin } = require('../middleware/auth');

// ==========================================
// Routes Ethnies
// ==========================================
router.get('/ethnies', ethniesController.getAllEthnies);
router.get('/ethnies/:id', ethniesController.getEthnieById);
// router.post('/ethnies', authenticateToken, requireAdmin, ethniesController.createEthnie);
// router.put('/ethnies/:id', authenticateToken, requireAdmin, ethniesController.updateEthnie);
// router.delete('/ethnies/:id', authenticateToken, requireAdmin, ethniesController.deleteEthnie);

// Routes temporaires sans auth pour les tests
router.post('/ethnies', ethniesController.createEthnie);
router.put('/ethnies/:id', ethniesController.updateEthnie);
router.delete('/ethnies/:id', ethniesController.deleteEthnie);

// ==========================================
// Routes Factions
// ==========================================
router.get('/factions', factionsController.getAllFactions);
router.get('/factions/:id', factionsController.getFactionById);
// router.post('/factions', authenticateToken, requireAdmin, factionsController.createFaction);
// router.put('/factions/:id', authenticateToken, requireAdmin, factionsController.updateFaction);
// router.delete('/factions/:id', authenticateToken, requireAdmin, factionsController.deleteFaction);

// Routes temporaires sans auth pour les tests
router.post('/factions', factionsController.createFaction);
router.put('/factions/:id', factionsController.updateFaction);
router.delete('/factions/:id', factionsController.deleteFaction);

// ==========================================
// Routes Clans
// ==========================================
router.get('/clans', clansController.getAllClans);
router.get('/clans/:id', clansController.getClanById);
// router.post('/clans', authenticateToken, requireAdmin, clansController.createClan);
// router.put('/clans/:id', authenticateToken, requireAdmin, clansController.updateClan);
// router.delete('/clans/:id', authenticateToken, requireAdmin, clansController.deleteClan);

// Routes temporaires sans auth pour les tests
router.post('/clans', clansController.createClan);
router.put('/clans/:id', clansController.updateClan);
router.delete('/clans/:id', clansController.deleteClan);

module.exports = router;
