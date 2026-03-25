const router = require('express').Router();
const { createDraw, simulateDraw, publishDraw, getDraws, getDraw, getPublishedDraws } = require('../controllers/drawController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/published', getPublishedDraws);
router.route('/').get(protect, adminOnly, getDraws).post(protect, adminOnly, createDraw);
router.get('/:id', protect, getDraw);
router.post('/:id/simulate', protect, adminOnly, simulateDraw);
router.post('/:id/publish', protect, adminOnly, publishDraw);

module.exports = router;
