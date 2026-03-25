const router = require('express').Router();
const { uploadProof, verifyWinner, markPaid, getMyWinnings } = require('../controllers/winnerController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/my', protect, getMyWinnings);
router.post('/:drawId/proof', protect, upload.single('proof'), uploadProof);
router.put('/:drawId/:winnerId/verify', protect, adminOnly, verifyWinner);
router.put('/:drawId/:winnerId/pay', protect, adminOnly, markPaid);

module.exports = router;
