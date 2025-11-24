const express = require('express');
const authRoutes = require('./auth.routes');

const router = express.Router();

// Routes d'authentification
router.use('/auth', authRoutes);

module.exports = router;
