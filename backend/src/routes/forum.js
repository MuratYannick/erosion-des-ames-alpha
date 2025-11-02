const express = require('express');
const router = express.Router();

// Controllers
const ethniesController = require('../controllers/forum/ethniesController');
const factionsController = require('../controllers/forum/factionsController');
const clansController = require('../controllers/forum/clansController');
const charactersController = require('../controllers/forum/charactersController');
const categoriesController = require('../controllers/forum/categoriesController');
const sectionsController = require('../controllers/forum/sectionsController');
const topicsController = require('../controllers/forum/topicsController');
const postsController = require('../controllers/forum/postsController');

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

// ==========================================
// Routes Personnages
// ==========================================
router.get('/characters', charactersController.getAllCharacters);
router.get('/characters/:id', charactersController.getCharacterById);
router.post('/characters', charactersController.createCharacter);
router.put('/characters/:id', charactersController.updateCharacter);
router.delete('/characters/:id', charactersController.deleteCharacter);

// ==========================================
// Routes Catégories
// ==========================================
router.get('/categories', categoriesController.getAllCategories);
router.get('/categories/:id', categoriesController.getCategoryById);
router.get('/categories/slug/:slug', categoriesController.getCategoryBySlug);
router.post('/categories', categoriesController.createCategory);
router.put('/categories/:id', categoriesController.updateCategory);
router.delete('/categories/:id', categoriesController.deleteCategory);

// ==========================================
// Routes Sections
// ==========================================
router.get('/sections', sectionsController.getAllSections);
router.get('/sections/:id', sectionsController.getSectionById);
router.get('/sections/slug/:slug', sectionsController.getSectionBySlug);
router.post('/sections', sectionsController.createSection);
router.put('/sections/:id', sectionsController.updateSection);
router.delete('/sections/:id', sectionsController.deleteSection);

// ==========================================
// Routes Topics
// ==========================================
router.get('/topics', topicsController.getAllTopics);
router.get('/topics/:id', topicsController.getTopicById);
router.get('/topics/slug/:slug', topicsController.getTopicBySlug);
router.post('/topics', topicsController.createTopic);
router.put('/topics/:id', topicsController.updateTopic);
router.delete('/topics/:id', topicsController.deleteTopic);

// ==========================================
// Routes Posts
// ==========================================
router.get('/posts', postsController.getAllPosts);
router.get('/posts/:id', postsController.getPostById);
router.post('/posts', postsController.createPost);
router.put('/posts/:id', postsController.updatePost);
router.delete('/posts/:id', postsController.deletePost);

module.exports = router;
