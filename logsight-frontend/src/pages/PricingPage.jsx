import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createCheckoutSession } from '../services/paymentService';

const PricingPage = ({ onBack }) => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const { url } = await createCheckoutSession();
      if (url) {
        window.location.href = url; // Redirect to Stripe Checkout
      }
    } catch (error) {
      console.error('Failed to start checkout:', error);
      alert('Payment service unavailable right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col pt-12 items-center">
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 text-slate-400 hover:text-white transition flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Dashboard
      </button>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 space-y-4 max-w-2xl px-4 mt-8"
      >
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Scale Your Observability
        </h1>
        <p className="text-slate-400 text-lg">
          Choose the right plan to monitor your systems effectively. 
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mt-16 max-w-4xl px-4 z-10 w-full">
        {/* Free Plan */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="border border-slate-800 bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 flex flex-col relative"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Hobby</h2>
          <div className="flex items-baseline mb-6 border-b border-slate-800 pb-6">
            <span className="text-4xl font-extrabold text-white">$0</span>
            <span className="text-slate-500 ml-2">/month</span>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1 text-slate-300">
            <li className="flex items-center gap-3">
              <span className="text-emerald-500">✓</span> Up to 1,000 logs / month
            </li>
            <li className="flex items-center gap-3">
              <span className="text-emerald-500">✓</span> Basic Dashboards
            </li>
            <li className="flex items-center gap-3">
              <span className="text-emerald-500">✓</span> Standard Support
            </li>
          </ul>

          <button disabled className="w-full py-3 rounded-lg bg-slate-800 text-slate-400 font-medium cursor-not-allowed">
            Current Plan
          </button>
        </motion.div>

        {/* Pro Plan */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="border border-blue-500/50 bg-blue-950/20 backdrop-blur-md rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-white">LogSight Pro</h2>
            <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30">
              RECOMMENDED
            </span>
          </div>
          
          <div className="flex items-baseline mb-6 border-b border-blue-900/50 pb-6">
            <span className="text-4xl font-extrabold text-white">$15</span>
            <span className="text-slate-500 ml-2">/month</span>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1 text-slate-200">
            <li className="flex items-center gap-3 font-medium">
              <span className="text-blue-400">✦</span> Unlimited Logs Ingestion
            </li>
            <li className="flex items-center gap-3">
              <span className="text-blue-400">✦</span> 30-Day Data Retention
            </li>
            <li className="flex items-center gap-3">
              <span className="text-blue-400">✦</span> AI Anomaly Insights
            </li>
            <li className="flex items-center gap-3">
              <span className="text-blue-400">✦</span> Priority Support
            </li>
          </ul>

          <button 
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-blue-500/25 transition disabled:opacity-50"
          >
            {loading ? 'Redirecting to secure checkout...' : 'Upgrade to Pro'}
          </button>
        </motion.div>
      </div>

      {/* Decorative Blur */}
      <div className="absolute bottom-0 -z-10 h-1/2 w-full bg-gradient-to-t from-blue-900/20 to-transparent blur-3xl opacity-50" />
    </div>
  );
};

export default PricingPage;
