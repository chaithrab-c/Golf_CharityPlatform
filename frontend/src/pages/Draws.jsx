import { useState, useEffect } from 'react';
import api from '../services/api';
import { Trophy, Calendar } from 'lucide-react';

export default function Draws() {
  const [draws, setDraws] = useState([]);

  useEffect(() => {
    api.get('/draws/published').then(r => setDraws(r.data.draws)).catch(() => {});
  }, []);

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="section-heading mb-3">Monthly Draws</h1>
        <p className="text-gray-500 text-lg">See past draw results and winning numbers</p>
      </div>

      {draws.length === 0 ? (
        <div className="text-center py-16">
          <Trophy className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No published draws yet. Stay tuned!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {draws.map(draw => (
            <div key={draw._id} className="card-elevated">
              <div className="flex flex-wrap items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold-400/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-navy-900">{monthNames[draw.month - 1]} {draw.year}</h3>
                    <p className="text-sm text-gray-400">{draw.participantCount} participants</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Prize Pool</p>
                  <p className="font-bold text-lg text-brand-600">£{draw.prizePool?.total?.toFixed(2)}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Winning Numbers</p>
                <div className="flex gap-2">
                  {draw.winningNumbers?.map((n, i) => (
                    <div key={i} className="w-12 h-12 bg-navy-900 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                      {n}
                    </div>
                  ))}
                </div>
              </div>

              {draw.winners?.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Winners</p>
                  <div className="space-y-2">
                    {draw.winners.map((w, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <span className="font-semibold text-navy-900">{w.user?.name || 'Player'}</span>
                          <span className="text-sm text-gray-400 ml-2">{w.matchType}</span>
                        </div>
                        <span className="font-bold text-brand-600">£{w.prizeAmount?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
