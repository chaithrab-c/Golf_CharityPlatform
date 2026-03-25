const User = require('../models/User');
const Subscription = require('../models/Subscription');

const PLANS = {
  monthly: { price: 9.99, interval: 'month' },
  yearly: { price: 99.99, interval: 'year' }
};

exports.getPlans = (req, res) => {
  res.json({ success: true, plans: PLANS });
};

exports.subscribe = async (req, res) => {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ success: false, message: 'Invalid plan' });

    const planInfo = PLANS[plan];
    const startDate = new Date();
    const endDate = new Date();
    if (plan === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
    else endDate.setFullYear(endDate.getFullYear() + 1);

    const charityAmount = planInfo.price * (req.user.charityPercentage / 100);
    const prizePoolAmount = planInfo.price * 0.5;

    const subscription = await Subscription.create({
      user: req.user._id,
      plan,
      amount: planInfo.price,
      charityAmount,
      prizePoolAmount,
      startDate,
      endDate
    });

    await User.findByIdAndUpdate(req.user._id, {
      subscriptionStatus: 'active',
      subscriptionPlan: plan,
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate
    });

    res.status(201).json({ success: true, subscription });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      subscriptionStatus: 'cancelled',
      subscriptionPlan: null
    });
    await Subscription.findOneAndUpdate(
      { user: req.user._id, status: 'active' },
      { status: 'cancelled' }
    );
    res.json({ success: true, message: 'Subscription cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id, status: 'active' });
    res.json({ success: true, subscription });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
