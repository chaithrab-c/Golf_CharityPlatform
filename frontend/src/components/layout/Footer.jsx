import { Trophy, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">GolfCharity</span>
            </div>
            <p className="text-gray-400 text-sm">Play. Win. Give. Making a difference one round at a time.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <Link to="/charities" className="block hover:text-white transition">Charities</Link>
              <Link to="/draws" className="block hover:text-white transition">Monthly Draws</Link>
              <Link to="/subscribe" className="block hover:text-white transition">Subscribe</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>contact@golfcharity.com</p>
              <p>Terms & Conditions</p>
              <p>Privacy Policy</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center gap-1">Made with <Heart className="w-4 h-4 text-red-500" /> for charity © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
