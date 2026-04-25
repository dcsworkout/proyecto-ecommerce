const express = require('express');
const router = express.Router();
const { getWeekStats, getCosts, upsertCost } = require('../controllers/analytics.controller');
const { authMiddleware } = require('../middleware/auth');
router.use(authMiddleware);
router.get('/week', getWeekStats);
router.get('/costs', getCosts);
router.post('/costs', upsertCost);
module.exports = router;
