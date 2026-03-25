import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Search, Edit2, Save, X } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => { api.get('/admin/users').then(r => setUsers(r.data.users)); }, []);
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const startEdit = (u) => { setEditing(u._id); setEditData({ name: u.name, role: u.role, subscriptionStatus: u.subscriptionStatus }); };
  const saveEdit = async (id) => {
    try { await api.put('/admin/users/' + id, editData); toast.success('Updated'); setEditing(null); api.get('/admin/users').then(r => setUsers(r.data.users)); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="section-heading mb-6">User Management</h1>
      <div className="max-w-md mb-6 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} className="input-field pl-12" /></div>
      <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-gray-100"><th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th><th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th><th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Role</th><th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th><th className="py-3 px-4"></th></tr></thead><tbody>
        {filtered.map(u => (
          <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50">
            <td className="py-3 px-4">{editing===u._id?<input value={editData.name} onChange={e=>setEditData({...editData,name:e.target.value})} className="input-field py-1 text-sm"/>:<span className="font-medium">{u.name}</span>}</td>
            <td className="py-3 px-4 text-sm text-gray-500">{u.email}</td>
            <td className="py-3 px-4">{editing===u._id?<select value={editData.role} onChange={e=>setEditData({...editData,role:e.target.value})} className="input-field py-1 text-sm"><option value="user">User</option><option value="admin">Admin</option></select>:<span className="text-xs px-2 py-1 rounded-full bg-gray-100">{u.role}</span>}</td>
            <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full ${u.subscriptionStatus==='active'?'bg-green-100 text-green-700':'bg-gray-100'}`}>{u.subscriptionStatus}</span></td>
            <td className="py-3 px-4">{editing===u._id?<div className="flex gap-2"><button onClick={()=>saveEdit(u._id)} className="text-green-600"><Save className="w-4 h-4"/></button><button onClick={()=>setEditing(null)} className="text-gray-400"><X className="w-4 h-4"/></button></div>:<button onClick={()=>startEdit(u)} className="text-gray-400 hover:text-blue-600"><Edit2 className="w-4 h-4"/></button>}</td>
          </tr>
        ))}
      </tbody></table></div>
    </div>
  );
}
