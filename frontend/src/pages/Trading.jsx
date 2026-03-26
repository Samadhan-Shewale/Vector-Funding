import React, { useState, useEffect } from 'react';
import { TradingChart } from '../components/TradingChart';
import { apiService } from '../services/api';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, History, Activity, TrendingUp, TrendingDown } from 'lucide-react';

export const Trading = ({ user }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [trades, setTrades] = useState([]);
  const [symbol, setSymbol] = useState('BTCUSD');
  const [lots, setLots] = useState(0.1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('open');
  const [livePrice, setLivePrice] = useState(0);
  const [orderType, setOrderType] = useState('market');
  const [limitPrice, setLimitPrice] = useState(0);
  const [timeframe, setTimeframe] = useState('1d');

  const fetchAccounts = async () => {
    if (!user) return;
    try {
      const data = await apiService.getAccounts(user.uid);
      const activeAccs = data.filter(a => a.status === 'active');
      setAccounts(activeAccs);
      if (activeAccs.length > 0 && !selectedAccount) {
        setSelectedAccount(activeAccs[0]);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrades = async () => {
    if (!selectedAccount) return;
    try {
      const data = await apiService.getTrades(selectedAccount.id || selectedAccount._id);
      setTrades(data);
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  useEffect(() => {
    fetchTrades();
    const interval = setInterval(fetchTrades, 5000); // Poll for trades
    return () => clearInterval(interval);
  }, [selectedAccount]);

  // Real-time price simulation for the UI
  useEffect(() => {
    const basePrice = symbol === 'BTCUSD' ? 65000 : symbol === 'ETHUSD' ? 3500 : 2300;
    setLivePrice(basePrice);
    
    const interval = setInterval(() => {
      setLivePrice(prev => prev + (Math.random() - 0.5) * (prev * 0.0005));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [symbol]);

  const handleTrade = async (type) => {
    if (!selectedAccount || !user) return;

    try {
      await apiService.createTrade({
        accountId: selectedAccount.id || selectedAccount._id,
        userId: user.uid,
        symbol,
        type,
        entryPrice: orderType === 'market' ? livePrice : limitPrice,
        lots,
        status: orderType === 'market' ? 'open' : 'pending',
      });
      fetchTrades();
      if (orderType === 'limit') {
        setActiveTab('pending');
      } else {
        setActiveTab('open');
      }
    } catch (error) {
      console.error('Trade failed:', error);
    }
  };

  const closeTrade = async (trade) => {
    if (!selectedAccount) return;
    const exitPrice = livePrice;
    const profit = trade.type === 'buy' 
      ? (exitPrice - trade.entryPrice) * trade.lots * 10 
      : (trade.entryPrice - exitPrice) * trade.lots * 10;

    try {
      await apiService.updateTrade(trade.id || trade._id, {
        status: 'closed',
        exitPrice,
        profit,
        closedAt: new Date().toISOString(),
      });

      await apiService.updateAccount(selectedAccount.id || selectedAccount._id, {
        currentBalance: selectedAccount.currentBalance + profit,
        equity: selectedAccount.currentBalance + profit,
      });
      
      fetchTrades();
      fetchAccounts();
    } catch (error) {
      console.error('Close trade failed:', error);
    }
  };

  const filteredTrades = trades.filter(t => t.status === activeTab).map(t => {
    if (t.status === 'open') {
      const profit = t.type === 'buy' 
        ? (livePrice - t.entryPrice) * t.lots * 10 
        : (t.entryPrice - livePrice) * t.lots * 10;
      return { ...t, profit };
    }
    return t;
  });

  const totalPnl = trades.reduce((sum, t) => {
    if (t.status === 'open') {
      const profit = t.type === 'buy' 
        ? (livePrice - t.entryPrice) * t.lots * 10 
        : (t.entryPrice - livePrice) * t.lots * 10;
      return sum + profit;
    }
    return sum + (t.profit || 0);
  }, 0);

  if (loading) return <div className="pt-24 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>;

  if (accounts.length === 0) {
    return (
      <div className="pt-32 px-4 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">No Active Accounts</h2>
        <p className="text-gray-400 mb-8">You need an active funded account to access the trading terminal.</p>
        <button onClick={() => navigate('/')} className="w-full py-3 bg-emerald-500 text-black font-bold rounded-xl">Purchase Account</button>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-4 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto flex flex-col min-h-screen lg:h-[calc(100vh-80px)] gap-4 overflow-y-auto lg:overflow-hidden">
      {/* Top Bar - Exness Style */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <label className="text-[10px] text-gray-500 uppercase font-bold">Asset</label>
            <div className="flex gap-1 mt-1">
              {['XAUUSD', 'BTCUSD', 'ETHUSD'].map(s => (
                <button 
                  key={s}
                  onClick={() => setSymbol(s)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    symbol === s ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-8 w-px bg-white/10 hidden sm:block" />

          <div className="flex flex-col">
            <label className="text-[10px] text-gray-500 uppercase font-bold">Account</label>
            <select 
              className="bg-transparent border-none text-white text-sm font-bold outline-none cursor-pointer"
              value={selectedAccount?.id || selectedAccount?._id}
              onChange={(e) => setSelectedAccount(accounts.find(a => (a.id || a._id) === e.target.value) || null)}
            >
              {accounts.map((acc, index) => (
                <option key={acc.id || acc._id || index} value={acc.id || acc._id} className="bg-[#0a0a0a]">
                  ${acc.initialBalance.toLocaleString()} {acc.type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-8">
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-bold">Balance</p>
            <p className="text-white font-mono font-bold text-sm sm:text-base">${selectedAccount?.currentBalance.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-bold">Equity</p>
            <p className="text-emerald-400 font-mono font-bold text-sm sm:text-base">${selectedAccount?.equity.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-500 text-[10px] font-bold">LIVE</span>
          </div>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-visible lg:overflow-hidden">
        {/* Left: Chart & History */}
        <div className="lg:col-span-9 flex flex-col gap-4 min-h-0">
          <div className="flex-grow min-h-[400px] lg:min-h-0 bg-[#0a0a0a] rounded-xl border border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
              <div className="flex items-center gap-3">
                <h3 className="text-white font-bold text-sm">{symbol}</h3>
                <span className="text-emerald-500 text-[10px] font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded">LIVE</span>
              </div>
              <div className="flex gap-1">
                {['5m', '15m', '1h', '4h', '1d'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                      timeframe === tf ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {tf.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-grow">
              <TradingChart 
                symbol={symbol} 
                timeframe={timeframe} 
                openTrades={trades.filter(t => t.status === 'open')}
                livePrice={livePrice}
              />
            </div>
          </div>
          
          {/* History - More compact with Tabs */}
          <div className="bg-white/5 border border-white/10 rounded-xl h-64 lg:h-48 overflow-hidden flex flex-col flex-shrink-0">
            <div className="px-4 py-2 border-b border-white/10 flex justify-between items-center bg-black/20">
              <div className="flex gap-4">
                {['open', 'closed', 'pending'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[10px] font-bold uppercase transition-colors ${
                      activeTab === tab ? 'text-emerald-500' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {tab.toUpperCase()} ORDERS
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">
                PNL: ${totalPnl.toFixed(2)}
              </span>
            </div>
            <div className="overflow-y-auto flex-grow">
              <table className="w-full text-left text-[11px]">
                <thead className="text-gray-500 sticky top-0 bg-[#0a0a0a] z-10">
                  <tr className="border-b border-white/5">
                    <th className="px-4 py-2 font-bold uppercase">Symbol</th>
                    <th className="px-4 py-2 font-bold uppercase">Type</th>
                    <th className="px-4 py-2 font-bold uppercase">Lots</th>
                    <th className="px-4 py-2 font-bold uppercase">Entry</th>
                    {activeTab === 'closed' && <th className="px-4 py-2 font-bold uppercase">Exit</th>}
                    <th className="px-4 py-2 font-bold uppercase">Profit</th>
                    <th className="px-4 py-2 font-bold uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {filteredTrades.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500 italic">No {activeTab} orders found.</td>
                    </tr>
                  ) : (
                    filteredTrades.map((trade, index) => (
                      <tr key={trade.id || trade._id || index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-2 font-medium">{trade.symbol}</td>
                        <td className="px-4 py-2">
                          <span className={trade.type === 'buy' ? 'text-emerald-400' : 'text-red-400'}>
                            {trade.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-2 font-mono">{trade.lots}</td>
                        <td className="px-4 py-2 font-mono">${trade.entryPrice.toLocaleString()}</td>
                        {activeTab === 'closed' && <td className="px-4 py-2 font-mono">${trade.exitPrice?.toLocaleString()}</td>}
                        <td className={`px-4 py-2 font-mono font-bold ${
                          (trade.profit || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {trade.profit ? `$${trade.profit.toFixed(2)}` : '-'}
                        </td>
                        <td className="px-4 py-2">
                          {trade.status === 'open' && (
                            <button 
                              onClick={() => closeTrade(trade)}
                              className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-[10px] font-bold transition-colors"
                            >
                              CLOSE
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Execution Panel - Exness Style */}
        <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto lg:pr-2 custom-scrollbar">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-6 flex-shrink-0">
            <h3 className="text-white text-sm font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              NEW ORDER
            </h3>

            <div className="space-y-4">
              <div className="flex bg-white/5 rounded-lg p-1">
                <button 
                  onClick={() => setOrderType('market')}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                    orderType === 'market' ? 'bg-emerald-500 text-black' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  MARKET
                </button>
                <button 
                  onClick={() => {
                    setOrderType('limit');
                    setLimitPrice(livePrice);
                  }}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                    orderType === 'limit' ? 'bg-emerald-500 text-black' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  LIMIT
                </button>
              </div>

              {orderType === 'limit' && (
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Limit Price</label>
                  <input 
                    type="number" 
                    value={limitPrice} 
                    onChange={(e) => setLimitPrice(parseFloat(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded h-8 text-center text-white font-mono text-sm"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Lot Size</label>
                <div className="flex items-center gap-1">
                  <button onClick={() => setLots(Math.max(0.01, lots - 0.1))} className="w-8 h-8 bg-white/5 rounded hover:bg-white/10 text-white font-bold">-</button>
                  <input 
                    type="number" 
                    value={lots} 
                    step="0.01"
                    onChange={(e) => setLots(parseFloat(e.target.value))}
                    className="flex-grow bg-black border border-white/10 rounded h-8 text-center text-white font-mono text-sm"
                  />
                  <button onClick={() => setLots(lots + 0.1)} className="w-8 h-8 bg-white/5 rounded hover:bg-white/10 text-white font-bold">+</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={() => handleTrade('sell')}
                  className="group relative flex flex-col items-center justify-center py-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  <span className="text-[10px] text-red-400 font-bold uppercase mb-1">Sell</span>
                  <span className="text-white font-mono font-bold text-sm">
                    {(livePrice - 2).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <div className="absolute top-0 right-0 p-1">
                    <TrendingDown className="w-3 h-3 text-red-500/50" />
                  </div>
                </button>

                <button 
                  onClick={() => handleTrade('buy')}
                  className="group relative flex flex-col items-center justify-center py-3 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-lg transition-all"
                >
                  <span className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Buy</span>
                  <span className="text-white font-mono font-bold text-sm">
                    {(livePrice + 2).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <div className="absolute top-0 right-0 p-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500/50" />
                  </div>
                </button>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500 font-bold uppercase">Margin Required</span>
                  <span className="text-white font-mono">${(lots * 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500 font-bold uppercase">Spread</span>
                  <span className="text-gray-400 font-mono">2.4 pips</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 flex-shrink-0">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Daily Drawdown</span>
              <span className="text-red-400 text-xs font-bold">-$240.00 / $500.00</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-red-500" style={{ width: '48%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
