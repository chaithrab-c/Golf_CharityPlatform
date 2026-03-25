import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function AdminCharities() {
  const [charities, setCharities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', description:'', category:'', website:'', featured:false });
  const [editing, setEditing] = useState(null);

  const fetch = () => api.get('/charities').then(r=>setCharities(r.data.charities));
  useEffect(()=>{fetch();},[]);

  const submit = async (e) => {
    e.preventDefault();
    try { editing ? await api.put('/charities/'+editing,form) : await api.post('/charities',form); toast.success(editing?'Updated':'Created'); setShowForm(false); setEditing(null); setForm({name:'',description:'',category:'',website:'',featured:false}); fetch(); }
    catch{toast.error('Failed');}
  };

  const startEdit = (c) => { setForm({name:c.name,description:c.description,category:c.category||'',website:c.website||'',featured:c.featured}); setEditing(c._id); setShowForm(true); };
  const del = async (id) => { if(!confirm('Deactivate?')) return; try{await api.delete('/charities/'+id);toast.success('Done');fetch();}catch{toast.error('Failed');} };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8"><h1 className="section-heading">Charities</h1><button onClick={()=>{setShowForm(!showForm);setEditing(null);setForm({name:'',description:'',category:'',website:'',featured:false});}} className="btn-primary py-2 px-4 text-sm flex items-center gap-2"><Plus className="w-4 h-4"/>Add</button></div>
      {showForm&&<form onSubmit={submit} className="card mb-8 space-y-4"><div className="grid sm:grid-cols-2 gap-4"><input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-field" required/><input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="input-field"/></div><textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="input-field h-24" required/><input placeholder="Website" value={form.website} onChange={e=>setForm({...form,website:e.target.value})} className="input-field"/><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})}/>Featured</label><div className="flex gap-3"><button type="submit" className="btn-primary py-2 px-6 text-sm">{editing?'Update':'Create'}</button><button type="button" onClick={()=>{setShowForm(false);setEditing(null);}} className="btn-outline py-2 px-6 text-sm">Cancel</button></div></form>}
      <div className="space-y-3">{charities.map(c=>(<div key={c._id} className="card flex items-center justify-between"><div><h3 className="font-semibold text-navy-900">{c.name}{c.featured&&' ⭐'}</h3><p className="text-sm text-gray-400">{c.category}</p></div><div className="flex gap-2"><button onClick={()=>startEdit(c)} className="text-gray-400 hover:text-blue-600"><Edit2 className="w-4 h-4"/></button><button onClick={()=>del(c._id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button></div></div>))}</div>
    </div>
  );
}
