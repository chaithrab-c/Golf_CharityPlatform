import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Heart, Globe, Calendar, MapPin } from 'lucide-react';

export default function CharityDetail() {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const [charity, setCharity] = useState(null);

  useEffect(() => {
    api.get(`/charities/${id}`).then(r => setCharity(r.data.charity));
  }, [id]);

  const selectCharity = async () => {
    try {
      const res = await api.put('/auth/profile', { selectedCharity: id });
      updateUser(res.data.user);
      toast.success(`Now supporting ${charity.name}!`);
    } catch { toast.error('Failed to select charity'); }
  };

  if (!charity) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card-elevated">
        <h1 className="section-heading mb-4">{charity.name}</h1>
        <div className="flex flex-wrap gap-3 mb-6">
          {charity.category && <span className="bg-brand-100 text-brand-700 text-sm px-3 py-1 rounded-full">{charity.category}</span>}
          {charity.featured && <span className="bg-gold-400/20 text-gold-600 text-sm px-3 py-1 rounded-full">⭐ Featured</span>}
        </div>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">{charity.description}</p>
        {charity.website && (
          <a href={charity.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-brand-600 hover:underline mb-6">
            <Globe className="w-4 h-4" /> Visit website
          </a>
        )}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Total Contributions</p>
            <p className="text-2xl font-bold text-navy-900">£{charity.totalContributions?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Supporters</p>
            <p className="text-2xl font-bold text-navy-900">{charity.subscriberCount || 0}</p>
          </div>
        </div>

        {charity.events?.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display font-bold text-xl text-navy-900 mb-4">Upcoming Events</h2>
            <div className="space-y-3">
              {charity.events.map((e, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-navy-900">{e.title}</h3>
                  <div className="flex gap-4 mt-1 text-sm text-gray-500">
                    {e.date && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(e.date).toLocaleDateString()}</span>}
                    {e.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{e.location}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {user && (
          <button onClick={selectCharity} className="btn-primary inline-flex items-center gap-2">
            <Heart className="w-5 h-5" />
            {user.selectedCharity?._id === id ? 'Currently Supporting' : 'Support This Charity'}
          </button>
        )}
      </div>
    </div>
  );
}
