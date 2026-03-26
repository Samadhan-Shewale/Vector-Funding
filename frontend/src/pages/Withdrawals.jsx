import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { motion } from 'framer-motion';
import { DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const Withdrawals = ({ user }) => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [wData, aData] = await Promise.all([
        apiService.getWithdrawals(user.uid),
        apiService.getAccounts(user.uid)
      ]);
      setWithdrawals(wData);
      setAccounts(aData.filter(a => a.status === 'passed'));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const requestWithdrawal = async (account) => {
    if (!user) return;
    const profit = account.currentBalance - account.initialBalance;
    if (profit <= 0) return;

    try {
      await apiService.createWithdrawal({
        userId: user.uid,
        accountId: account.id || account._id,
        amount: profit * 0.8, // 80% profit split
        status: 'pending',
      });
      fetchData();
    } catch (error) {
      console.error('Withdrawal failed:', error);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Withdrawals</h1>
        <p className="text-gray-400">Manage your profit payouts and withdrawal history.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available for Payout */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            Available Payouts
          </h2>
          
          {accounts.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No accounts have passed the challenge yet.</p>
            </div>
          ) : (
            accounts.map((acc, index) => (
              <div key={acc.id || acc._id || index} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-gray-500 text-xs font-bold uppercase mb-1">{acc.type} Account</p>
                <p className="text-white font-bold text-xl mb-4">${(acc.currentBalance - acc.initialBalance).toLocaleString()} Profit</p>
                <button 
                  onClick={() => requestWithdrawal(acc)}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition-colors text-sm"
                >
                  Request 80% Payout
                </button>
              </div>
            ))
          )}
        </div>

        {/* History */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Payout History
          </h2>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500 bg-black/20">
                <tr>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500 italic">No withdrawal history found.</td>
                  </tr>
                ) : (
                  withdrawals.map((w, index) => (
                    <tr key={w.id || w._id || index} className="border-t border-white/5">
                      <td className="p-4">{new Date(w.requestedAt).toLocaleDateString()}</td>
                      <td className="p-4 font-mono text-white">${w.amount.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`flex items-center gap-1.5 text-xs font-bold uppercase ${
                          w.status === 'pending' ? 'text-yellow-500' : 
                          w.status === 'approved' ? 'text-emerald-500' : 'text-red-500'
                        }`}>
                          {w.status === 'pending' && <Clock className="w-3 h-3" />}
                          {w.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                          {w.status === 'rejected' && <XCircle className="w-3 h-3" />}
                          {w.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
