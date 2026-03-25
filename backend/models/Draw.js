const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  drawDate: { type: Date, required: true },
  winningNumbers: [{ type: Number, min: 1, max: 45 }],
  drawType: { type: String, enum: ['random', 'algorithmic'], default: 'random' },
  status: { type: String, enum: ['pending', 'simulated', 'published'], default: 'pending' },
  prizePool: {
    total: { type: Number, default: 0 },
    fiveMatch: { type: Number, default: 0 },
    fourMatch: { type: Number, default: 0 },
    threeMatch: { type: Number, default: 0 }
  },
  jackpotRollover: { type: Number, default: 0 },
  winners: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    matchType: { type: String, enum: ['5-match', '4-match', '3-match'] },
    matchedNumbers: [Number],
    prizeAmount: Number,
    verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    proofImage: String,
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' }
  }],
  participantCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

drawSchema.index({ month: 1, year: 1 }, { unique: true });
module.exports = mongoose.model('Draw', drawSchema);
