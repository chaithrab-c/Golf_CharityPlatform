const Draw = require('../models/Draw');
const Score = require('../models/Score');
const User = require('../models/User');

const generateRandomNumbers = (count = 5) => {
  const nums = new Set();
  while (nums.size < count) nums.add(Math.floor(Math.random() * 45) + 1);
  return Array.from(nums).sort((a, b) => a - b);
};

const generateAlgorithmicNumbers = async (count = 5) => {
  const scores = await Score.aggregate([
    { $group: { _id: '$score', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  if (scores.length < count) return generateRandomNumbers(count);
  
  const weighted = [];
  scores.forEach(s => {
    for (let i = 0; i < s.count; i++) weighted.push(s._id);
  });
  
  const nums = new Set();
  while (nums.size < count) {
    nums.add(weighted[Math.floor(Math.random() * weighted.length)]);
  }
  return Array.from(nums).sort((a, b) => a - b);
};

const matchScores = (userScores, winningNumbers) => {
  const matched = userScores.filter(s => winningNumbers.includes(s));
  return matched;
};

exports.createDraw = async (req, res) => {
  try {
    const { month, year, drawType } = req.body;
    const existing = await Draw.findOne({ month, year });
    if (existing) return res.status(400).json({ success: false, message: 'Draw already exists for this month' });

    const activeSubscribers = await User.countDocuments({ subscriptionStatus: 'active' });
    const monthlyRate = 9.99;
    const prizePoolPercentage = 0.5;
    const totalPool = activeSubscribers * monthlyRate * prizePoolPercentage;

    const prevDraw = await Draw.findOne({ status: 'published' }).sort({ drawDate: -1 });
    const rollover = prevDraw?.jackpotRollover || 0;

    const draw = await Draw.create({
      month, year,
      drawDate: new Date(year, month - 1, 28),
      drawType: drawType || 'random',
      participantCount: activeSubscribers,
      prizePool: {
        total: totalPool + rollover,
        fiveMatch: (totalPool * 0.4) + rollover,
        fourMatch: totalPool * 0.35,
        threeMatch: totalPool * 0.25
      }
    });

    res.status(201).json({ success: true, draw });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.simulateDraw = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) return res.status(404).json({ success: false, message: 'Draw not found' });

    const winningNumbers = draw.drawType === 'algorithmic'
      ? await generateAlgorithmicNumbers()
      : generateRandomNumbers();

    // Find winners
    const activeUsers = await User.find({ subscriptionStatus: 'active' });
    const winners = [];

    for (const user of activeUsers) {
      const scores = await Score.find({ user: user._id }).sort({ date: -1 }).limit(5);
      const userNums = scores.map(s => s.score);
      const matched = matchScores(userNums, winningNumbers);

      if (matched.length >= 3) {
        const matchType = matched.length >= 5 ? '5-match' : matched.length >= 4 ? '4-match' : '3-match';
        winners.push({ user: user._id, matchType, matchedNumbers: matched });
      }
    }

    // Calculate prizes
    const winnersByType = { '5-match': [], '4-match': [], '3-match': [] };
    winners.forEach(w => winnersByType[w.matchType].push(w));

    winners.forEach(w => {
      const pool = w.matchType === '5-match' ? draw.prizePool.fiveMatch
        : w.matchType === '4-match' ? draw.prizePool.fourMatch : draw.prizePool.threeMatch;
      w.prizeAmount = pool / winnersByType[w.matchType].length;
    });

    draw.winningNumbers = winningNumbers;
    draw.winners = winners;
    draw.status = 'simulated';
    draw.jackpotRollover = winnersByType['5-match'].length === 0 ? draw.prizePool.fiveMatch : 0;
    await draw.save();

    res.json({ success: true, draw: await Draw.findById(draw._id).populate('winners.user', 'name email') });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.publishDraw = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) return res.status(404).json({ success: false, message: 'Draw not found' });
    if (draw.status !== 'simulated') return res.status(400).json({ success: false, message: 'Draw must be simulated first' });
    draw.status = 'published';
    await draw.save();
    res.json({ success: true, draw: await Draw.findById(draw._id).populate('winners.user', 'name email') });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDraws = async (req, res) => {
  try {
    const draws = await Draw.find().sort({ year: -1, month: -1 }).populate('winners.user', 'name email');
    res.json({ success: true, draws });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDraw = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id).populate('winners.user', 'name email');
    if (!draw) return res.status(404).json({ success: false, message: 'Draw not found' });
    res.json({ success: true, draw });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPublishedDraws = async (req, res) => {
  try {
    const draws = await Draw.find({ status: 'published' }).sort({ year: -1, month: -1 }).populate('winners.user', 'name');
    res.json({ success: true, draws });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
