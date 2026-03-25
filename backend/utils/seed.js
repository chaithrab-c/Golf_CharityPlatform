const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const Charity = require('../models/Charity');
const Score = require('../models/Score');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/golf-charity-platform');
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Charity.deleteMany({});
  await Score.deleteMany({});

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@golfcharity.com',
    password: 'admin123',
    role: 'admin',
    subscriptionStatus: 'active',
    subscriptionPlan: 'yearly'
  });
  console.log('✅ Admin created: admin@golfcharity.com / admin123');

  // Create test user
  const user = await User.create({
    name: 'John Golfer',
    email: 'john@example.com',
    password: 'user123',
    role: 'user',
    subscriptionStatus: 'active',
    subscriptionPlan: 'monthly',
    handicap: 18,
    country: 'UK'
  });
  console.log('✅ User created: john@example.com / user123');

  // Create charities
  const charities = await Charity.insertMany([
    { name: 'Golf for Good', description: 'Supporting underprivileged youth through golf programs.', category: 'Youth', featured: true },
    { name: 'Green Fairways Foundation', description: 'Environmental conservation and sustainable golf course management.', category: 'Environment', featured: true },
    { name: 'Swing for Health', description: 'Promoting mental and physical health through sports.', category: 'Health', featured: false },
    { name: 'Caddie Scholarship Fund', description: 'Providing scholarships for young caddies worldwide.', category: 'Education', featured: false },
    { name: 'Veterans on the Green', description: 'Helping veterans reintegrate through golf therapy.', category: 'Veterans', featured: true }
  ]);
  console.log(`✅ ${charities.length} charities created`);

  // Update user's charity
  await User.findByIdAndUpdate(user._id, { selectedCharity: charities[0]._id });

  // Add scores for test user
  const scores = [];
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (i * 7));
    scores.push({ user: user._id, score: Math.floor(Math.random() * 35) + 10, date });
  }
  await Score.insertMany(scores);
  console.log('✅ 5 scores created for test user');

  console.log('\n🎉 Seed complete!');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
