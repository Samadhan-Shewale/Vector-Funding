import React, { useState } from 'react';
import { apiService } from '../services/api';
import { Shield, TrendingUp, Zap, Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let data;
      if (isLogin) {
        data = await apiService.login(formData.email, formData.password);
      } else {
        data = await apiService.signup(formData.email, formData.password, formData.displayName);
      }
      onLogin(data.user);
    } catch (err) {
      console.error('Auth failed:', err);
      const serverError = err.response?.data?.error;
      const details = err.response?.data?.details;
      setError(serverError ? `${serverError}${details ? `: ${details}` : ''}` : 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full z-10"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <TrendingUp className="text-black w-8 h-8" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Vector-<span className="text-emerald-500">Funding</span>
          </h1>
          <p className="text-gray-400 text-lg">
            {isLogin ? 'Welcome back to the terminal' : 'Start your trading journey today'}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all disabled:opacity-50 mt-4"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <Zap className="w-5 h-5 text-emerald-500 mb-2" />
            <h3 className="text-white text-sm font-semibold">Fast Execution</h3>
            <p className="text-gray-500 text-xs">Low latency engine</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <Shield className="w-5 h-5 text-emerald-500 mb-2" />
            <h3 className="text-white text-sm font-semibold">Secure Payouts</h3>
            <p className="text-gray-500 text-xs">Reliable system</p>
          </div>
        </div>

        <p className="mt-8 text-gray-500 text-xs text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};
