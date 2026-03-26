import React from 'react';
import { ShieldCheck, Target, AlertTriangle, Clock, Calendar, BarChart3, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

export const Rules = () => {
  const rules = [
    {
      title: "Profit Target",
      desc: "Reach a 10% profit target on your initial balance to pass the challenge.",
      icon: Target,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Daily Drawdown",
      desc: "Do not lose more than 5% of your starting balance in a single day.",
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-500/10"
    },
    {
      title: "Maximum Drawdown",
      desc: "Total account loss must not exceed 10% of the initial balance.",
      icon: BarChart3,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    {
      title: "Minimum Trading Days",
      desc: "You must trade for at least 5 days during the evaluation period.",
      icon: Calendar,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "No News Trading",
      desc: "Executing trades during high-impact news events is strictly prohibited.",
      icon: Clock,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      title: "Lot Size Consistency",
      desc: "Maintain consistent lot sizes relative to your account equity.",
      icon: Scale,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10"
    },
    {
      title: "Weekend Holding",
      desc: "All positions must be closed before the market closes on Friday.",
      icon: ShieldCheck,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10"
    }
  ];

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Trading Rules</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          To ensure long-term success and risk management, all traders must adhere to the following rules. 
          Violation of these rules may result in account termination.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map((rule, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-colors"
          >
            <div className="flex gap-4">
              <div className={`w-12 h-12 ${rule.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <rule.icon className={`w-6 h-6 ${rule.color}`} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-2">{rule.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{rule.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl text-center">
        <h2 className="text-white font-bold text-xl mb-4">Ready to start your challenge?</h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
          Choose a plan that fits your trading style and start your journey to becoming a funded professional.
        </p>
        <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-8 rounded-xl transition-colors">
          View Funding Plans
        </button>
      </div>
    </div>
  );
};
