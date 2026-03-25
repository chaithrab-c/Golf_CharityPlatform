import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Check, Crown, Zap } from 'lucide-react';

export default function Subscribe() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const plans = [
    { id: 'monthly', name: 'Monthly', price: '9.99', period: '/month', icon: Zap, features: ['Enter golf scores', 'Monthly draw entry', 'Charity contribution', 'Winner dashboard'] },
    { id: 'yearly', name: 'Yearly', price: '99.99', period: '/year', icon: Crown, features: ['Everything in Monthly', '2 months free', 'Priority support', 'Early draw access'], popular: true }
  ];

  const handleSubscribe = async (plan) => {
    if (!user) { navigate('/register'); return; }
    setLoading(plan);
    try {
      await api.post('/subscriptions/subscribe', { plan });
      toast.success(`Subscribed to ${plan} plan!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="section-heading mb-4">Choose Your Plan</h1>
          <p className="text-gray-500 text-lg">Subscribe and start making a difference today</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map(plan => (
            <div key={plan.id} className={`card relative ${plan.popular ? 'ring-2 ring-brand-500 shadow-lg shadow-brand-500/10' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>
              )}
              <plan.icon className="w-10 h-10 text-brand-500 mb-4" />
              <h3 className="font-display text-2xl font-bold text-navy-900">{plan.name}</h3>
              <div className="mt-2 mb-6">
                <span className="text-4xl font-bold text-navy-900">£{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-brand-500 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => handleSubscribe(plan.id)} disabled={loading === plan.id}
                className={`w-full font-semibold py-3 rounded-xl transition ${plan.popular ? 'btn-primary' : 'btn-outline'}`}>
                {loading === plan.id ? 'Processing...' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
