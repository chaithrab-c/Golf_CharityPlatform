const router = require('express').Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate('selectedCharity');
  res.json({ success: true, user });
});

module.exports = router;
