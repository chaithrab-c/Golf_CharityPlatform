const router = require('express').Router();
const { getDashboardStats, getAllUsers, updateUser, getUserScores, updateUserScore } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.get('/users/:userId/scores', getUserScores);
router.put('/scores/:scoreId', updateUserScore);

module.exports = router;
