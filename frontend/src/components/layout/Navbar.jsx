import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Trophy, User, LogOut, LayoutDashboard, Settings } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-navy-900">GolfCharity</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/charities" className="text-gray-600 hover:text-brand-600 font-medium transition">Charities</Link>
            <Link to="/draws" className="text-gray-600 hover:text-brand-600 font-medium transition">Draws</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-brand-600 font-medium transition">Dashboard</Link>
                <Link to="/scores" className="text-gray-600 hover:text-brand-600 font-medium transition">Scores</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-brand-600 font-medium transition">Admin</Link>
                )}
                <div className="flex items-center gap-3 ml-2">
                  <span className="text-sm text-gray-500">{user.name}</span>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-sm py-2 px-4">Log In</Link>
                <Link to="/subscribe" className="btn-primary text-sm py-2 px-4">Subscribe</Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-3">
          <Link to="/charities" className="block text-gray-600 font-medium" onClick={() => setOpen(false)}>Charities</Link>
          <Link to="/draws" className="block text-gray-600 font-medium" onClick={() => setOpen(false)}>Draws</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="block text-gray-600 font-medium" onClick={() => setOpen(false)}>Dashboard</Link>
              <Link to="/scores" className="block text-gray-600 font-medium" onClick={() => setOpen(false)}>Scores</Link>
              {user.role === 'admin' && <Link to="/admin" className="block text-gray-600 font-medium" onClick={() => setOpen(false)}>Admin</Link>}
              <button onClick={() => { handleLogout(); setOpen(false); }} className="text-red-500 font-medium">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-600 font-medium" onClick={() => setOpen(false)}>Log In</Link>
              <Link to="/subscribe" className="block btn-primary text-center" onClick={() => setOpen(false)}>Subscribe</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
