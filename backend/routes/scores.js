const router = require('express').Router();
const { addScore, getMyScores, updateScore, deleteScore } = require('../controllers/scoreController');
const { protect, subscriberOnly } = require('../middleware/auth');

router.route('/').get(protect, getMyScores).post(protect, subscriberOnly, addScore);
router.route('/:id').put(protect, updateScore).delete(protect, deleteScore);

module.exports = router;
