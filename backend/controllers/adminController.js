const User = require('../models/User');
const Score = require('../models/Score');
const Draw = require('../models/Draw');
const Charity = require('../models/Charity');
const Subscription = require('../models/Subscription');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSubscribers = await User.countDocuments({ subscriptionStatus: 'active' });
    const totalCharities = await Charity.countDocuments({ active: true });
    
    const subscriptions = await Subscription.find({ status: 'active' });
    const totalRevenue = subscriptions.reduce((sum, s) => sum + s.amount, 0);
    const totalCharityContributions = subscriptions.reduce((sum, s) => sum + s.charityAmount, 0);
    const totalPrizePool = subscriptions.reduce((sum, s) => sum + s.prizePoolAmount, 0);

    const totalDraws = await Draw.countDocuments();
    const publishedDraws = await Draw.countDocuments({ status: 'published' });

    res.json({
      success: true,
      stats: {
        totalUsers, activeSubscribers, totalCharities,
        totalRevenue, totalCharityContributions, totalPrizePool,
        totalDraws, publishedDraws
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('selectedCharity', 'name').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserScores = async (req, res) => {
  try {
    const scores = await Score.find({ user: req.params.userId }).sort({ date: -1 });
    res.json({ success: true, scores });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUserScore = async (req, res) => {
  try {
    const score = await Score.findByIdAndUpdate(req.params.scoreId, req.body, { new: true });
    if (!score) return res.status(404).json({ success: false, message: 'Score not found' });
    res.json({ success: true, score });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
