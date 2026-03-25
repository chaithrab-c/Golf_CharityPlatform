import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Heart, Star, ArrowRight } from 'lucide-react';

export default function Charities() {
  const [charities, setCharities] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/charities', { params: { search } }).then(r => setCharities(r.data.charities));
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="section-heading mb-3">Our Charities</h1>
        <p className="text-gray-500 text-lg">Choose a charity to support with your subscription</p>
      </div>

      <div className="max-w-md mx-auto mb-10 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" placeholder="Search charities..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-12" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charities.map(c => (
          <Link to={`/charities/${c._id}`} key={c._id} className="card group cursor-pointer hover:border-brand-200">
            {c.featured && (
              <div className="inline-flex items-center gap-1 bg-gold-400/20 text-gold-600 text-xs font-bold px-2 py-1 rounded-full mb-3">
                <Star className="w-3 h-3" /> Featured
              </div>
            )}
            <h3 className="font-display font-bold text-lg text-navy-900 mb-2 group-hover:text-brand-600 transition">{c.name}</h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{c.description}</p>
            {c.category && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{c.category}</span>}
            <div className="mt-4 flex items-center text-brand-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition">
              Learn more <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>
      {charities.length === 0 && <p className="text-gray-400 text-center py-12">No charities found.</p>}
    </div>
  );
}
