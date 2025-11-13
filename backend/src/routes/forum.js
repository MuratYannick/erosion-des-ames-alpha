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

// Middleware
const { authenticateToken, optionalAuth, requireAdmin } = require('../middleware/authenticate');
const {
  canViewCategory,
  canViewSection,
  canViewTopic,
  canCreateSection,
  canCreateTopic,
  canCreatePost,
  canEditCategory,
  canEditSection,
  canEditTopic,
  canEditPost,
  canMoveSection,
  canMoveTopic,
  canMovePost,
  canPinSection,
  canPinTopic,
  canLockSection,
  canLockTopic
} = require('../middleware/forumPermissions');

// ==========================================
// Routes Ethnies
// ==========================================
router.get('/ethnies', ethniesController.getAllEthnies);
router.get('/ethnies/:id', ethniesController.getEthnieById);
router.post('/ethnies', authenticateToken, requireAdmin, ethniesController.createEthnie);
router.put('/ethnies/:id', authenticateToken, requireAdmin, ethniesController.updateEthnie);
router.delete('/ethnies/:id', authenticateToken, requireAdmin, ethniesController.deleteEthnie);

// ==========================================
// Routes Factions
// ==========================================
router.get('/factions', factionsController.getAllFactions);
router.get('/factions/:id', factionsController.getFactionById);
router.post('/factions', authenticateToken, requireAdmin, factionsController.createFaction);
router.put('/factions/:id', authenticateToken, requireAdmin, factionsController.updateFaction);
router.delete('/factions/:id', authenticateToken, requireAdmin, factionsController.deleteFaction);

// ==========================================
// Routes Clans
// ==========================================
router.get('/clans', clansController.getAllClans);
router.get('/clans/:id', clansController.getClanById);
router.post('/clans', authenticateToken, requireAdmin, clansController.createClan);
router.put('/clans/:id', authenticateToken, requireAdmin, clansController.updateClan);
router.delete('/clans/:id', authenticateToken, requireAdmin, clansController.deleteClan);

// ==========================================
// Routes Personnages
// ==========================================
router.get('/characters', charactersController.getAllCharacters);
router.get('/characters/me', optionalAuth, charactersController.getMyCharacters);
router.get('/characters/:id', charactersController.getCharacterById);
router.post('/characters', charactersController.createCharacter);
router.put('/characters/:id', charactersController.updateCharacter);
router.delete('/characters/:id', charactersController.deleteCharacter);

// ==========================================
// Routes Catégories
// ==========================================
router.get('/categories', categoriesController.getAllCategories);
router.get('/categories/:id', canViewCategory(), categoriesController.getCategoryById);
// Route slug publique pour navigation (permissions vérifiées dans le controller)
router.get('/categories/slug/:slug', categoriesController.getCategoryBySlug);
// Route pour récupérer les sections d'une catégorie
router.get('/categories/:id/sections', optionalAuth, categoriesController.getSectionsByCategory);
router.post('/categories', authenticateToken, requireAdmin, categoriesController.createCategory);
router.put('/categories/:id', canEditCategory(), categoriesController.updateCategory);
router.delete('/categories/:id', canEditCategory(), categoriesController.deleteCategory);

// ==========================================
// Routes Sections
// ==========================================
router.get('/sections', optionalAuth, sectionsController.getAllSections);
router.get('/sections/:id', optionalAuth, canViewSection(), sectionsController.getSectionById);
// Route slug publique pour navigation (permissions vérifiées dans le controller)
router.get('/sections/slug/:slug', optionalAuth, sectionsController.getSectionBySlug);
// Route pour récupérer les topics d'une section
router.get('/sections/:id/topics', optionalAuth, sectionsController.getTopicsBySection);
router.post('/sections', optionalAuth, canCreateSection(), sectionsController.createSection);
router.put('/sections/:id', optionalAuth, canEditSection(), sectionsController.updateSection);
router.delete('/sections/:id', optionalAuth, canEditSection(), sectionsController.deleteSection);
// Toggle actions
router.patch('/sections/:id/pin', optionalAuth, canPinSection(), sectionsController.togglePin);
router.patch('/sections/:id/lock', optionalAuth, canLockSection(), sectionsController.toggleLock);
// Move action
router.patch('/sections/:id/move', optionalAuth, canMoveSection(), sectionsController.moveSection);

// ==========================================
// Routes Topics
// ==========================================
router.get('/topics', topicsController.getAllTopics);
router.get('/topics/:id', canViewTopic(), topicsController.getTopicById);
// Route slug publique pour navigation (permissions vérifiées dans le controller)
router.get('/topics/slug/:slug', topicsController.getTopicBySlug);
// Route pour récupérer les posts d'un topic
router.get('/topics/:id/posts', topicsController.getPostsByTopic);
router.post('/topics', canCreateTopic(), topicsController.createTopic);
router.put('/topics/:id', canEditTopic(), topicsController.updateTopic);
router.delete('/topics/:id', canEditTopic(), topicsController.deleteTopic);
router.patch('/topics/:id/move', canMoveTopic(), topicsController.moveTopic);

// ==========================================
// Routes Posts
// ==========================================
// Posts inherit permissions from their topic
router.get('/posts', postsController.getAllPosts);
router.get('/posts/:id', postsController.getPostById);
router.post('/posts', optionalAuth, canCreatePost(), postsController.createPost);
router.put('/posts/:id', optionalAuth, canEditPost(), postsController.updatePost);
router.delete('/posts/:id', optionalAuth, canEditPost(), postsController.deletePost);
router.patch('/posts/:id/move', optionalAuth, canMovePost(), postsController.movePost);

module.exports = router;
