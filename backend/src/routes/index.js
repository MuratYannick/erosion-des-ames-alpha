const express = require('express');
const router = express.Router();

// Route de santé
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API Érosion des Âmes - Alpha',
    timestamp: new Date().toISOString()
  });
});

// Routes API
router.use('/auth', require('./auth'));

module.exports = router;
