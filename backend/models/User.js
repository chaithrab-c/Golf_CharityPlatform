const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  subscriptionStatus: { type: String, enum: ['active', 'inactive', 'cancelled', 'lapsed'], default: 'inactive' },
  subscriptionPlan: { type: String, enum: ['monthly', 'yearly', null], default: null },
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  selectedCharity: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity' },
  charityPercentage: { type: Number, default: 10, min: 10, max: 100 },
  avatar: String,
  country: String,
  handicap: Number,
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function(entered) {
  return await bcrypt.compare(entered, this.password);
};

userSchema.methods.getSignedToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: process.env.JWT_EXPIRE || '30d' });
};

module.exports = mongoose.model('User', userSchema);
