const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { name, email, password, country, handicap } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: 'Email already registered' });

    user = await User.create({ name, email, password, country, handicap });
    const token = user.getSignedToken();
    const userData = user.toObject();
    delete userData.password;
    res.status(201).json({ success: true, token, user: userData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = user.getSignedToken();
    const userData = user.toObject();
    delete userData.password;
    res.json({ success: true, token, user: userData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('selectedCharity');
  res.json({ success: true, user });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, country, handicap, selectedCharity, charityPercentage } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id,
      { name, country, handicap, selectedCharity, charityPercentage },
      { new: true, runValidators: true }
    ).populate('selectedCharity');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
