import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, DollarSign } from 'lucide-react';

export default function AdminWinners() {
  const [draws, setDraws] = useState([]);
  const mn=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fetch = () => api.get('/draws').then(r=>setDraws(r.data.draws.filter(d=>d.winners?.length>0)));
  useEffect(()=>{fetch();},[]);

  const verify = async (did,wid,status) => { try{await api.put('/winners/'+did+'/'+wid+'/verify',{status});toast.success(status);fetch();}catch{toast.error('Failed');} };
  const pay = async (did,wid) => { try{await api.put('/winners/'+did+'/'+wid+'/pay');toast.success('Paid');fetch();}catch(e){toast.error(e.response?.data?.message||'Failed');} };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="section-heading mb-8">Winner Verification</h1>
      {draws.length===0?<p className="text-gray-400 text-center py-12">No winners yet.</p>:draws.map(d=>(
        <div key={d._id} className="card mb-6"><h2 className="font-bold text-navy-900 mb-4">{mn[d.month-1]} {d.year}</h2>
          <div className="space-y-3">{d.winners.map(w=>(
            <div key={w._id} className="bg-gray-50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div><p className="font-semibold">{w.user?.name||'Unknown'}</p><p className="text-sm text-gray-400">{w.matchType} · £{w.prizeAmount?.toFixed(2)}</p>
                <div className="flex gap-2 mt-1"><span className={`text-xs px-2 py-0.5 rounded-full ${w.verificationStatus==='verified'?'bg-green-100 text-green-700':w.verificationStatus==='rejected'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700'}`}>{w.verificationStatus}</span><span className={`text-xs px-2 py-0.5 rounded-full ${w.paymentStatus==='paid'?'bg-green-100 text-green-700':'bg-gray-100'}`}>{w.paymentStatus}</span></div></div>
              <div className="flex gap-2">
                {w.verificationStatus==='pending'&&<><button onClick={()=>verify(d._id,w._id,'verified')} className="text-green-600 p-2 rounded-lg hover:bg-green-50"><CheckCircle className="w-5 h-5"/></button><button onClick={()=>verify(d._id,w._id,'rejected')} className="text-red-500 p-2 rounded-lg hover:bg-red-50"><XCircle className="w-5 h-5"/></button></>}
                {w.verificationStatus==='verified'&&w.paymentStatus==='pending'&&<button onClick={()=>pay(d._id,w._id)} className="text-blue-600 p-2 rounded-lg hover:bg-blue-50 flex items-center gap-1 text-sm font-medium"><DollarSign className="w-5 h-5"/>Pay</button>}
              </div>
            </div>
          ))}</div>
        </div>
      ))}
    </div>
  );
}
