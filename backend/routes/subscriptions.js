const router = require('express').Router();
const { getPlans, subscribe, cancelSubscription, getMySubscription } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

router.get('/plans', getPlans);
router.get('/my', protect, getMySubscription);
router.post('/subscribe', protect, subscribe);
router.post('/cancel', protect, cancelSubscription);

module.exports = router;
