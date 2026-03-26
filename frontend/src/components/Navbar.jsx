import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, TrendingUp, LayoutDashboard, FileText, Info, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Trading', path: '/trading', icon: TrendingUp },
    { name: 'Rules', path: '/rules', icon: FileText },
    { name: 'Withdrawals', path: '/withdrawals', icon: HelpCircle },
    { name: 'About', path: '/about', icon: Info },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
            <TrendingUp className="text-black w-5 h-5" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">APEX<span className="text-emerald-500">PROP</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(link.path)
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-white font-semibold leading-none mb-1">{user?.displayName || 'Trader'}</span>
              <span className="text-[10px] text-gray-500 leading-none">{user?.email}</span>
            </div>
            <button 
              onClick={onLogout}
              className="ml-2 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-400 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-black/95 border-t border-white/5 mt-4"
          >
            <div className="flex flex-col gap-2 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium ${
                    isActive(link.path)
                      ? 'text-emerald-500 bg-emerald-500/10'
                      : 'text-gray-400'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-white/5 px-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-xs text-white font-semibold">{user?.displayName || 'Trader'}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
