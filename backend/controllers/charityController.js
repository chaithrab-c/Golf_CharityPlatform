const Charity = require('../models/Charity');

exports.getCharities = async (req, res) => {
  try {
    const { search, category, featured } = req.query;
    const filter = { active: true };
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    const charities = await Charity.find(filter).sort({ featured: -1, name: 1 });
    res.json({ success: true, charities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCharity = async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);
    if (!charity) return res.status(404).json({ success: false, message: 'Charity not found' });
    res.json({ success: true, charity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCharity = async (req, res) => {
  try {
    const charity = await Charity.create(req.body);
    res.status(201).json({ success: true, charity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!charity) return res.status(404).json({ success: false, message: 'Charity not found' });
    res.json({ success: true, charity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCharity = async (req, res) => {
  try {
    await Charity.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ success: true, message: 'Charity deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
