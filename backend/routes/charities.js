const router = require('express').Router();
const { getCharities, getCharity, createCharity, updateCharity, deleteCharity } = require('../controllers/charityController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/').get(getCharities).post(protect, adminOnly, createCharity);
router.route('/:id').get(getCharity).put(protect, adminOnly, updateCharity).delete(protect, adminOnly, deleteCharity);

module.exports = router;
