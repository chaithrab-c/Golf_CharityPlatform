const Score = require('../models/Score');

exports.addScore = async (req, res) => {
  try {
    const { score, date } = req.body;
    if (score < 1 || score > 45) {
      return res.status(400).json({ success: false, message: 'Score must be between 1 and 45 (Stableford)' });
    }

    const existingScores = await Score.find({ user: req.user._id }).sort({ date: -1 });
    
    // Keep only latest 5 scores - remove oldest if already 5
    if (existingScores.length >= 5) {
      const oldest = existingScores[existingScores.length - 1];
      await Score.findByIdAndDelete(oldest._id);
    }

    const newScore = await Score.create({ user: req.user._id, score, date });
    res.status(201).json({ success: true, score: newScore });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyScores = async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user._id }).sort({ date: -1 }).limit(5);
    res.json({ success: true, scores });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateScore = async (req, res) => {
  try {
    const { score, date } = req.body;
    const updated = await Score.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { score, date },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Score not found' });
    res.json({ success: true, score: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteScore = async (req, res) => {
  try {
    const deleted = await Score.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ success: false, message: 'Score not found' });
    res.json({ success: true, message: 'Score deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
