import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Trophy, Target, Heart, Calendar, TrendingUp, Gift } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [winnings, setWinnings] = useState([]);

  useEffect(() => {
    api.get('/scores').then(r => setScores(r.data.scores)).catch(() => {});
    api.get('/subscriptions/my').then(r => setSubscription(r.data.subscription)).catch(() => {});
    api.get('/winners/my').then(r => setWinnings(r.data.winnings)).catch(() => {});
  }, []);

  const totalWon = winnings.reduce((s, w) => s + (w.prizeAmount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="section-heading mb-8">Welcome, {user?.name} 👋</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-brand-600" />
            </div>
            <span className="text-sm text-gray-500">Subscription</span>
          </div>
          <p className="text-xl font-bold text-navy-900 capitalize">{user?.subscriptionStatus || 'Inactive'}</p>
          <p className="text-sm text-gray-400">{user?.subscriptionPlan || 'No plan'}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Scores Entered</span>
          </div>
          <p className="text-xl font-bold text-navy-900">{scores.length}/5</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-600" />
            </div>
            <span className="text-sm text-gray-500">Charity</span>
          </div>
          <p className="text-xl font-bold text-navy-900">{user?.selectedCharity?.name || 'None selected'}</p>
          <p className="text-sm text-gray-400">{user?.charityPercentage}% contribution</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gold-400/20 rounded-xl flex items-center justify-center">
              <Gift className="w-5 h-5 text-gold-600" />
            </div>
            <span className="text-sm text-gray-500">Total Winnings</span>
          </div>
          <p className="text-xl font-bold text-navy-900">£{totalWon.toFixed(2)}</p>
        </div>
      </div>

      {/* Recent Scores */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-navy-900">Recent Scores</h2>
            <Link to="/scores" className="text-brand-600 text-sm font-medium hover:underline">Manage →</Link>
          </div>
          {scores.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">No scores entered yet.</p>
          ) : (
            <div className="space-y-3">
              {scores.map(s => (
                <div key={s._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="font-semibold text-navy-900">{s.score} pts</span>
                  <span className="text-sm text-gray-400">{new Date(s.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="font-display font-bold text-lg text-navy-900 mb-4">Winnings History</h2>
          {winnings.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">No winnings yet. Keep playing!</p>
          ) : (
            <div className="space-y-3">
              {winnings.map((w, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <span className="font-semibold text-navy-900">{w.matchType}</span>
                    <p className="text-xs text-gray-400">{w.month}/{w.year}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-brand-600">£{w.prizeAmount?.toFixed(2)}</span>
                    <p className="text-xs text-gray-400 capitalize">{w.paymentStatus}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
