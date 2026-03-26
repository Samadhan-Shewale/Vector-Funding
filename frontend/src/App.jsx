import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { apiService } from './services/api';
import { Navbar } from './components/Navbar';
import { Auth } from './components/Auth';
import { Home } from './pages/Home';
import { Trading } from './pages/Trading';
import { Rules } from './pages/Rules';
import { Withdrawals } from './pages/Withdrawals';
import { About } from './pages/About';
import { Terms } from './pages/Terms';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await apiService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    apiService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar user={user} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/trading" element={<Trading user={user} />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/withdrawals" element={<Withdrawals user={user} />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer className="py-12 px-4 border-t border-white/5 bg-black/40">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
                  <div className="w-3 h-3 bg-black rounded-sm" />
                </div>
                <span className="text-white font-bold text-lg tracking-tight">APEX<span className="text-emerald-500">PROP</span></span>
              </div>
              <p className="text-gray-500 text-sm max-w-sm">
                ApexProp is a leading proprietary trading firm providing capital to skilled traders worldwide. 
                Our mission is to democratize access to institutional-grade funding.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="/rules" className="hover:text-emerald-500 transition-colors">Trading Rules</a></li>
                <li><a href="/" className="hover:text-emerald-500 transition-colors">Funding Plans</a></li>
                <li><a href="/trading" className="hover:text-emerald-500 transition-colors">Trading Terminal</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="/terms" className="hover:text-emerald-500 transition-colors">Terms of Service</a></li>
                <li><a href="/terms" className="hover:text-emerald-500 transition-colors">Privacy Policy</a></li>
                <li><a href="/about" className="hover:text-emerald-500 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-gray-600 text-xs">
            © 2026 ApexProp Trading. All rights reserved. Trading involves significant risk.
          </div>
        </footer>
      </div>
    </Router>
  );
}
