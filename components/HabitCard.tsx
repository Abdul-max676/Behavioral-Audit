
import React, { useState } from 'react';
import { Habit, LogStatus } from '../types';
import { calculateStats } from '../utils/analytics';

interface HabitCardProps {
  habit: Habit;
  onLog: (habitId: string, status: LogStatus, date: string, time?: string, note?: string) => void;
  onDelete: (habitId: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onLog, onDelete }) => {
  const stats = calculateStats(habit);
  const [isLogging, setIsLogging] = useState<LogStatus | null>(null);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logTime, setLogTime] = useState(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
  const [logNote, setLogNote] = useState('');

  const handleLogSubmit = () => {
    if (isLogging) {
      onLog(habit.id, isLogging, logDate, isLogging === 'completed' ? logTime : undefined, logNote);
      setIsLogging(null);
      setLogNote('');
      setLogDate(new Date().toISOString().split('T')[0]);
    }
  };

  const commonExcuses = Object.entries(stats.excuseFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="bg-white border border-zinc-200 p-5 sm:p-7 shadow-sm transition-all">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tighter leading-none">{habit.name}</h3>
          <p className="text-zinc-400 text-[9px] uppercase font-bold tracking-[0.2em] mt-2">ID: {habit.id.slice(0, 8)}</p>
        </div>
        <button 
          onClick={() => { if(confirm('Permanently delete this habit?')) onDelete(habit.id); }}
          className="text-zinc-300 hover:text-red-600 text-[10px] uppercase font-bold tracking-widest transition-colors p-2 -mr-2"
        >
          Remove
        </button>
      </div>

      <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-10">
        <div className="flex flex-col">
          <span className="text-zinc-400 text-[9px] uppercase font-bold tracking-widest mb-1">Streak</span>
          <span className="text-2xl font-light leading-none">{stats.currentStreak}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-zinc-400 text-[9px] uppercase font-bold tracking-widest mb-1">Weekly</span>
          <span className="text-2xl font-light leading-none">{stats.weeklyConsistency}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-zinc-400 text-[9px] uppercase font-bold tracking-widest mb-1">All-Time Max</span>
          <span className="text-2xl font-light leading-none">{stats.longestStreak}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-zinc-400 text-[9px] uppercase font-bold tracking-widest mb-1">C / M</span>
          <span className="text-2xl font-light leading-none">{stats.totalCompletions}<span className="text-zinc-300 mx-1">/</span>{stats.totalMisses}</span>
        </div>
      </div>

      <div className="space-y-8 mb-8">
        <div>
          <h4 className="text-[10px] font-bold text-zinc-900 uppercase mb-3 tracking-widest flex items-center">
            <span className="w-1 h-1 bg-zinc-900 mr-2"></span> DATA PATTERNS
          </h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block text-zinc-400 uppercase font-bold mb-1 tracking-tight">Vulnerable On</span>
                <span className="font-semibold text-zinc-800">{stats.mostMissedWeekday || 'NONE'}</span>
              </div>
              <div>
                <span className="block text-zinc-400 uppercase font-bold mb-1 tracking-tight">Active Hours</span>
                <span className="font-semibold text-zinc-800">{stats.mostCommonTimeRange}</span>
              </div>
            </div>
            
            {commonExcuses.length > 0 && (
              <div className="bg-zinc-50 p-3 rounded-sm border border-zinc-100">
                <h5 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">COMMON EXCUSES</h5>
                <ul className="space-y-1">
                  {commonExcuses.map(([excuse, count], i) => (
                    <li key={i} className="text-[11px] flex justify-between text-zinc-600">
                      <span className="italic truncate pr-4">"{excuse}"</span>
                      <span className="font-bold text-zinc-300 whitespace-nowrap">× {count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="text-[10px] font-bold text-zinc-900 uppercase mb-3 tracking-widest flex items-center">
            <span className="w-1 h-1 bg-red-500 mr-2"></span> RAW INSIGHTS
          </h4>
          <div className="space-y-2">
            {stats.insights.length > 0 ? stats.insights.map((insight, idx) => (
              <p key={idx} className="text-xs text-zinc-600 italic leading-snug font-medium">
                &bull; {insight}
              </p>
            )) : (
              <p className="text-xs text-zinc-400 italic">Analysis pending more data points.</p>
            )}
          </div>
        </div>
      </div>

      {!isLogging ? (
        <div className="flex gap-3">
          <button 
            onClick={() => setIsLogging('completed')}
            className="flex-1 bg-zinc-900 text-white h-12 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 active:scale-[0.98] transition-all"
          >
            Mark Complete
          </button>
          <button 
            onClick={() => setIsLogging('missed')}
            className="flex-1 border border-zinc-200 text-zinc-600 h-12 text-xs font-bold uppercase tracking-widest hover:bg-zinc-50 active:scale-[0.98] transition-all"
          >
            Missed
          </button>
        </div>
      ) : (
        <div className="bg-zinc-50 p-5 border border-zinc-200 animate-in fade-in slide-in-from-top-1 duration-200 rounded-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-[10px] font-bold uppercase text-zinc-900 tracking-widest">
              LOG {isLogging === 'completed' ? 'SUCCESS' : 'FAILURE'}
            </h4>
            <button onClick={() => setIsLogging(null)} className="text-zinc-400 hover:text-zinc-900">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] uppercase font-bold text-zinc-400 mb-2 tracking-widest">Incident Date</label>
                <input 
                  type="date" 
                  value={logDate} 
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="w-full text-sm border-b border-zinc-300 bg-transparent pb-1 focus:outline-none focus:border-zinc-900 transition-colors"
                />
              </div>
              {isLogging === 'completed' && (
                <div>
                  <label className="block text-[9px] uppercase font-bold text-zinc-400 mb-2 tracking-widest">Timestamp</label>
                  <input 
                    type="time" 
                    value={logTime} 
                    onChange={(e) => setLogTime(e.target.value)}
                    className="w-full text-sm border-b border-zinc-300 bg-transparent pb-1 focus:outline-none focus:border-zinc-900 transition-colors"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-[9px] uppercase font-bold text-zinc-400 mb-2 tracking-widest">
                {isLogging === 'completed' ? 'CONTEXT' : 'PRIMARY EXCUSE'}
              </label>
              <input 
                type="text" 
                autoFocus
                placeholder={isLogging === 'missed' ? "Why was discipline absent?" : "Additional context..."}
                value={logNote}
                onChange={(e) => setLogNote(e.target.value)}
                className="w-full text-sm border-b border-zinc-300 bg-transparent py-2 focus:outline-none focus:border-zinc-900 transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleLogSubmit()}
              />
            </div>
            <button 
              onClick={handleLogSubmit}
              className="w-full bg-zinc-900 text-white h-12 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors mt-2"
            >
              Update Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitCard;
