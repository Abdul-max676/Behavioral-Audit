
import React from 'react';
import { Habit } from '../types';
import { calculateOverallStats } from '../utils/analytics';

interface DashboardProps {
  habits: Habit[];
}

const Dashboard: React.FC<DashboardProps> = ({ habits }) => {
  const overall = calculateOverallStats(habits);

  return (
    <div className="bg-zinc-900 text-white pb-12 sm:pb-24 shadow-2xl">
      {/* Header section */}
      <div className="bg-zinc-950 pt-16 pb-12 px-6 sm:px-12 border-b border-zinc-800">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">
              AUDIT REPORT
            </h1>
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em]">
              Behavioral Pattern Analysis &bull; Real-time
            </p>
          </div>
          <div className="flex items-center gap-6 bg-zinc-900/50 p-4 border border-zinc-800 rounded-sm">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">Performance</p>
              <p className="text-4xl font-light leading-none">{overall.score}<span className="text-xl text-zinc-600">%</span></p>
            </div>
            <div className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center p-1">
               <div 
                 className="w-full h-full rounded-full flex items-center justify-center text-[10px] font-bold"
                 style={{
                   background: `conic-gradient(#fff ${overall.score}%, transparent 0)`
                 }}
               >
                 <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center" />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid section */}
      <div className="max-w-2xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-zinc-800/30 p-6 border border-zinc-800">
            <span className="block text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-2">Tracking Total</span>
            <span className="text-3xl font-light">{overall.total} <span className="text-sm uppercase text-zinc-600 font-bold">Units</span></span>
          </div>
          <div className="bg-zinc-800/30 p-6 border border-zinc-800">
            <span className="block text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-2">Highest Consistency</span>
            <span className="text-xl font-medium truncate block leading-tight">{overall.best}</span>
          </div>
          <div className="bg-zinc-800/30 p-6 border border-zinc-800 sm:col-span-2">
            <span className="block text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-2">Primary Weakness</span>
            <span className="text-xl font-medium truncate block text-red-500/80 uppercase tracking-tight">{overall.worst}</span>
          </div>
        </div>

        <div className="mt-12 p-8 border-l-2 border-zinc-700 bg-zinc-900/50 italic text-zinc-400 text-sm leading-relaxed">
          "The most consistent behavior is usually the one you aren't tracking. This report only covers your declared intentions."
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
