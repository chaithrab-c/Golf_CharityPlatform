const Draw = require('../models/Draw');

exports.uploadProof = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.drawId);
    if (!draw) return res.status(404).json({ success: false, message: 'Draw not found' });

    const winner = draw.winners.find(w => w.user.toString() === req.user._id.toString());
    if (!winner) return res.status(404).json({ success: false, message: 'You are not a winner in this draw' });

    winner.proofImage = req.file ? req.file.filename : req.body.proofImage;
    winner.verificationStatus = 'pending';
    await draw.save();

    res.json({ success: true, message: 'Proof uploaded successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyWinner = async (req, res) => {
  try {
    const { drawId, winnerId } = req.params;
    const { status } = req.body;

    const draw = await Draw.findById(drawId);
    if (!draw) return res.status(404).json({ success: false, message: 'Draw not found' });

    const winner = draw.winners.id(winnerId);
    if (!winner) return res.status(404).json({ success: false, message: 'Winner not found' });

    winner.verificationStatus = status;
    await draw.save();

    res.json({ success: true, message: `Winner ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markPaid = async (req, res) => {
  try {
    const { drawId, winnerId } = req.params;
    const draw = await Draw.findById(drawId);
    if (!draw) return res.status(404).json({ success: false, message: 'Draw not found' });

    const winner = draw.winners.id(winnerId);
    if (!winner) return res.status(404).json({ success: false, message: 'Winner not found' });
    if (winner.verificationStatus !== 'verified') {
      return res.status(400).json({ success: false, message: 'Winner must be verified first' });
    }

    winner.paymentStatus = 'paid';
    await draw.save();

    res.json({ success: true, message: 'Payment marked as completed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyWinnings = async (req, res) => {
  try {
    const draws = await Draw.find({
      'winners.user': req.user._id,
      status: 'published'
    }).populate('winners.user', 'name email');

    const winnings = draws.map(draw => {
      const myWin = draw.winners.find(w => w.user._id.toString() === req.user._id.toString());
      return {
        drawId: draw._id,
        month: draw.month,
        year: draw.year,
        matchType: myWin.matchType,
        prizeAmount: myWin.prizeAmount,
        verificationStatus: myWin.verificationStatus,
        paymentStatus: myWin.paymentStatus
      };
    });

    res.json({ success: true, winnings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
