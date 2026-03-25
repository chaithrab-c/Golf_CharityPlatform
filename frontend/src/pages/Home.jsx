import { Link } from 'react-router-dom';
import { Trophy, Heart, Target, TrendingUp, Gift, Users, ArrowRight, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.15),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
              <Star className="w-4 h-4 text-gold-400" />
              <span>Monthly prizes worth thousands</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              Play. <span className="gradient-text">Win.</span> Give.
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Enter your golf scores, compete in monthly draws, and support charities you love — all in one platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/subscribe" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
                Start Playing <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/charities" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition inline-flex items-center gap-2">
                Explore Charities <Heart className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="section-heading mb-4">How It Works</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Three simple steps to play, win, and make a difference</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Enter Scores', desc: 'Submit your latest 5 Stableford golf scores through our simple interface.', color: 'bg-blue-100 text-blue-600' },
              { icon: Trophy, title: 'Win Prizes', desc: 'Your scores become your lucky numbers. Match the monthly draw to win big.', color: 'bg-gold-400/20 text-gold-600' },
              { icon: Heart, title: 'Give Back', desc: 'A portion of every subscription goes directly to the charity you choose.', color: 'bg-rose-100 text-rose-600' }
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.15 }} className="card text-center">
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-xl mb-3 text-navy-900">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Players', value: '2,500+', icon: Users },
              { label: 'Prizes Awarded', value: '£150K+', icon: Gift },
              { label: 'Charity Raised', value: '£75K+', icon: Heart },
              { label: 'Monthly Draws', value: '36+', icon: Zap }
            ].map((stat, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="text-center">
                <stat.icon className="w-8 h-8 text-brand-500 mx-auto mb-3" />
                <div className="font-display text-3xl font-bold text-navy-900">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-brand-600 to-brand-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="font-display text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-brand-100 mb-8">Join thousands of golfers who play for prizes and give to charity.</p>
          <Link to="/subscribe" className="bg-white text-brand-700 font-bold text-lg px-10 py-4 rounded-xl hover:bg-brand-50 transition inline-flex items-center gap-2">
            Subscribe Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
