import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Play, Send } from 'lucide-react';

export default function AdminDraws() {
  const [draws, setDraws] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth()+1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [drawType, setDrawType] = useState('random');
  const mn=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const fetch = () => api.get('/draws').then(r => setDraws(r.data.draws));
  useEffect(() => { fetch(); }, []);

  const create = async () => { try { await api.post('/draws',{month,year,drawType}); toast.success('Created'); fetch(); } catch(e){toast.error(e.response?.data?.message||'Failed');} };
  const simulate = async (id) => { try { await api.post('/draws/'+id+'/simulate'); toast.success('Simulated'); fetch(); } catch(e){toast.error(e.response?.data?.message||'Failed');} };
  const publish = async (id) => { try { await api.post('/draws/'+id+'/publish'); toast.success('Published'); fetch(); } catch(e){toast.error(e.response?.data?.message||'Failed');} };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="section-heading mb-8">Draw Management</h1>
      <div className="card mb-8"><h2 className="font-bold text-navy-900 mb-4">Create Draw</h2>
        <div className="grid sm:grid-cols-4 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Month</label><select value={month} onChange={e=>setMonth(+e.target.value)} className="input-field">{mn.map((m,i)=><option key={i} value={i+1}>{m}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Year</label><input type="number" value={year} onChange={e=>setYear(+e.target.value)} className="input-field"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={drawType} onChange={e=>setDrawType(e.target.value)} className="input-field"><option value="random">Random</option><option value="algorithmic">Algorithmic</option></select></div>
          <div className="flex items-end"><button onClick={create} className="btn-primary w-full flex items-center justify-center gap-2"><Plus className="w-5 h-5"/>Create</button></div>
        </div>
      </div>
      <div className="space-y-4">{draws.map(d=>(
        <div key={d._id} className="card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div><h3 className="font-bold text-navy-900">{mn[d.month-1]} {d.year}</h3><p className="text-sm text-gray-400">{d.drawType} · {d.participantCount} participants · £{d.prizePool?.total?.toFixed(2)}</p><span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${d.status==='published'?'bg-green-100 text-green-700':d.status==='simulated'?'bg-yellow-100 text-yellow-700':'bg-gray-100'}`}>{d.status}</span></div>
            <div className="flex gap-2">
              {d.status==='pending'&&<button onClick={()=>simulate(d._id)} className="btn-outline py-2 px-4 text-sm flex items-center gap-1"><Play className="w-4 h-4"/>Simulate</button>}
              {d.status==='simulated'&&<button onClick={()=>publish(d._id)} className="btn-primary py-2 px-4 text-sm flex items-center gap-1"><Send className="w-4 h-4"/>Publish</button>}
            </div>
          </div>
          {d.winningNumbers?.length>0&&<div className="mt-3 flex gap-2">{d.winningNumbers.map((n,i)=><div key={i} className="w-10 h-10 bg-navy-900 text-white rounded-lg flex items-center justify-center font-bold">{n}</div>)}</div>}
        </div>
      ))}</div>
    </div>
  );
}
