import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Users, Trophy, Heart, DollarSign, BarChart3, UserCog, Gift } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/admin/stats').then(r => setStats(r.data.stats)).catch(() => {}); }, []);

  const cards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Active Subscribers', value: stats.activeSubscribers, icon: UserCog, color: 'bg-green-100 text-green-600' },
    { label: 'Total Revenue', value: `£${stats.totalRevenue?.toFixed(2)}`, icon: DollarSign, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Prize Pool', value: `£${stats.totalPrizePool?.toFixed(2)}`, icon: Trophy, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Charity Raised', value: `£${stats.totalCharityContributions?.toFixed(2)}`, icon: Heart, color: 'bg-rose-100 text-rose-600' },
    { label: 'Total Draws', value: stats.totalDraws, icon: BarChart3, color: 'bg-purple-100 text-purple-600' }
  ] : [];

  const links = [
    { to: '/admin/users', label: 'Manage Users', icon: Users, desc: 'View and edit user profiles' },
    { to: '/admin/draws', label: 'Draw Management', icon: Trophy, desc: 'Configure and publish draws' },
    { to: '/admin/charities', label: 'Manage Charities', icon: Heart, desc: 'Add and edit charities' },
    { to: '/admin/winners', label: 'Winner Verification', icon: Gift, desc: 'Verify and manage payouts' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="section-heading mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {cards.map((c, i) => (
          <div key={i} className="card">
            <div className={`w-10 h-10 ${c.color} rounded-xl flex items-center justify-center mb-2`}><c.icon className="w-5 h-5" /></div>
            <p className="text-2xl font-bold text-navy-900">{c.value}</p>
            <p className="text-sm text-gray-400">{c.label}</p>
          </div>
        ))}
      </div>
      <h2 className="font-display font-bold text-xl text-navy-900 mb-4">Quick Actions</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {links.map((l, i) => (
          <Link key={i} to={l.to} className="card group hover:border-green-200 flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0"><l.icon className="w-5 h-5 text-green-600" /></div>
            <div><h3 className="font-semibold text-navy-900">{l.label}</h3><p className="text-sm text-gray-400">{l.desc}</p></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
