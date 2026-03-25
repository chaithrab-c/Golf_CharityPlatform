const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  image: String,
  website: String,
  category: String,
  featured: { type: Boolean, default: false },
  totalContributions: { type: Number, default: 0 },
  subscriberCount: { type: Number, default: 0 },
  events: [{
    title: String,
    date: Date,
    description: String,
    location: String
  }],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Charity', charitySchema);
