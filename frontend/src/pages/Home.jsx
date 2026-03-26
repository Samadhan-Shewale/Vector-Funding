import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { ACCOUNT_PLANS } from '../types';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, AlertCircle, Plus, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const Home = ({ user }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const navigate = useNavigate();

  const fetchAccounts = async () => {
    if (!user) return;
    try {
      const data = await apiService.getAccounts(user.uid);
      setAccounts(data);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  const handlePurchase = async (planKey) => {
    if (!user) return;
    const plan = ACCOUNT_PLANS[planKey];
    
    try {
      await apiService.createAccount({
        userId: user.uid,
        type: planKey,
        status: 'active',
        initialBalance: plan.funding,
        currentBalance: plan.funding,
        equity: plan.funding,
        maxDrawdown: plan.maxDrawdown,
        dailyDrawdownLimit: plan.dailyDrawdown,
        profitTarget: plan.profitTarget,
      });
      setShowBuyModal(false);
      fetchAccounts();
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.displayName}</p>
        </div>
        <button 
          onClick={() => setShowBuyModal(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Account
        </button>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Wallet className="text-emerald-500 w-5 h-5" />
            </div>
            <span className="text-gray-400 text-sm font-medium">Total Funding</span>
          </div>
          <p className="text-3xl font-bold text-white">
            ${accounts.reduce((sum, acc) => sum + acc.initialBalance, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue-500 w-5 h-5" />
            </div>
            <span className="text-gray-400 text-sm font-medium">Active Accounts</span>
          </div>
          <p className="text-3xl font-bold text-white">{accounts.filter(a => a.status === 'active').length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="text-purple-500 w-5 h-5" />
            </div>
            <span className="text-gray-400 text-sm font-medium">Passed Challenges</span>
          </div>
          <p className="text-3xl font-bold text-white">{accounts.filter(a => a.status === 'passed').length}</p>
        </div>
      </div>

      {/* Accounts List */}
      <section>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          Your Accounts
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : accounts.length === 0 ? (
          <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">No accounts found</h3>
            <p className="text-gray-500 mb-6">Purchase your first funded account to start trading.</p>
            <button 
              onClick={() => setShowBuyModal(true)}
              className="text-emerald-500 font-bold hover:underline"
            >
              Browse Plans →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {accounts.map((account, index) => (
              <motion.div 
                key={account.id || account._id || index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider rounded mb-2 inline-block">
                      {account.type} Account
                    </span>
                    <h3 className="text-white font-bold text-xl">${account.initialBalance.toLocaleString()} Challenge</h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    account.status === 'active' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {account.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-black/40 rounded-xl">
                    <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Current Balance</p>
                    <p className="text-white font-mono text-lg">${account.currentBalance.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-black/40 rounded-xl">
                    <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Profit Target</p>
                    <p className="text-white font-mono text-lg">${account.profitTarget.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Daily Drawdown Limit</span>
                    <span className="text-red-400">-${account.dailyDrawdownLimit.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '75%' }} />
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/trading')}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  View Trading Terminal
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Select Your Funding Plan</h2>
              <button onClick={() => setShowBuyModal(false)} className="text-gray-500 hover:text-white">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.keys(ACCOUNT_PLANS).map((key) => {
                const plan = ACCOUNT_PLANS[key];
                return (
                  <div key={key} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
                    <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                    <p className="text-emerald-500 font-bold text-2xl mb-6">${plan.funding.toLocaleString()}</p>
                    
                    <ul className="space-y-3 mb-8 flex-grow">
                      <li className="text-gray-400 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Profit Target: ${plan.profitTarget.toLocaleString()}
                      </li>
                      <li className="text-gray-400 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Max Drawdown: ${plan.maxDrawdown.toLocaleString()}
                      </li>
                      <li className="text-gray-400 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Daily Limit: ${plan.dailyDrawdown.toLocaleString()}
                      </li>
                    </ul>

                    <button 
                      onClick={() => handlePurchase(key)}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-colors"
                    >
                      Buy for ${plan.price}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
