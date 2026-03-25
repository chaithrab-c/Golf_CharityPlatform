import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Target } from 'lucide-react';

export default function Scores() {
  const [scores, setScores] = useState([]);
  const [score, setScore] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const fetchScores = () => api.get('/scores').then(r => setScores(r.data.scores));
  useEffect(() => { fetchScores(); }, []);

  const addScore = async (e) => {
    e.preventDefault();
    if (!score || score < 1 || score > 45) { toast.error('Score must be 1-45'); return; }
    setLoading(true);
    try {
      await api.post('/scores', { score: Number(score), date });
      toast.success('Score added!');
      setScore('');
      fetchScores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add score');
    } finally {
      setLoading(false);
    }
  };

  const deleteScore = async (id) => {
    try {
      await api.delete(`/scores/${id}`);
      toast.success('Score deleted');
      fetchScores();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="section-heading mb-8">Your Golf Scores</h1>
      <p className="text-gray-500 mb-6">Enter your latest Stableford scores (1-45). Only your most recent 5 scores are kept.</p>

      <form onSubmit={addScore} className="card mb-8">
        <h2 className="font-display font-bold text-lg text-navy-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-brand-500" /> Add New Score
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Score (1-45)</label>
            <input type="number" min="1" max="45" value={score} onChange={e => setScore(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" required />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> {loading ? 'Adding...' : 'Add Score'}
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-3">
        {scores.map(s => (
          <div key={s._id} className="card flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-navy-900">{s.score}</span>
              <span className="text-gray-400 ml-2">points</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">{new Date(s.date).toLocaleDateString()}</span>
              <button onClick={() => deleteScore(s._id)} className="text-gray-300 hover:text-red-500 transition">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {scores.length === 0 && <p className="text-gray-400 text-center py-8">No scores yet. Add your first score above!</p>}
      </div>
    </div>
  );
}
