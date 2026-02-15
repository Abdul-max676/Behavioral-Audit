
import React, { useState, useEffect } from 'react';
import { Habit, LogStatus, LogEntry } from './types';
import Dashboard from './components/Dashboard';
import HabitForm from './components/HabitForm';
import HabitCard from './components/HabitCard';

const STORAGE_KEY = 'brutally_honest_habits';

const App: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'audit' | 'inventory'>('inventory');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHabits(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse habits", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    }
  }, [habits, isLoaded]);

  const addHabit = (name: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      logs: []
    };
    setHabits(prev => [newHabit, ...prev]);
    // Stay on inventory to see new habit
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const logActivity = (habitId: string, status: LogStatus, date: string, time?: string, note?: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const newLog: LogEntry = {
          date,
          status,
          timestamp: new Date().toISOString(),
          time,
          note
        };
        const filteredLogs = habit.logs.filter(l => l.date !== date);
        return {
          ...habit,
          logs: [...filteredLogs, newLog]
        };
      }
      return habit;
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Scrollable Area */}
      <div className="pb-safe">
        {activeTab === 'audit' ? (
          <div className="animate-in fade-in duration-300">
            <Dashboard habits={habits} />
          </div>
        ) : (
          <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-12 animate-in fade-in duration-300">
            <header className="mb-10">
              <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">INVENTORY</h1>
              <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest">Active Behavioral Units</p>
            </header>

            <section className="mb-12">
              <HabitForm 
                onAdd={addHabit} 
                existingNames={habits.map(h => h.name)} 
              />
            </section>

            {habits.length === 0 ? (
              <div className="text-center py-24 border border-zinc-200 bg-white shadow-sm">
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">System Empty. Add Habit to Start.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {habits.map(habit => (
                  <HabitCard 
                    key={habit.id} 
                    habit={habit} 
                    onLog={logActivity}
                    onDelete={deleteHabit}
                  />
                ))}
              </div>
            )}
          </main>
        )}
      </div>

      {/* Persistent Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 z-50 pt-1 pb-[env(safe-area-inset-bottom,0)] shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <div className="max-w-2xl mx-auto flex h-16">
          <button 
            onClick={() => { setActiveTab('inventory'); window.scrollTo(0, 0); }}
            className={`flex-1 flex flex-col items-center justify-center transition-colors ${activeTab === 'inventory' ? 'text-zinc-900' : 'text-zinc-400'}`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-[10px] uppercase font-bold tracking-widest">Habits</span>
          </button>
          <button 
            onClick={() => { setActiveTab('audit'); window.scrollTo(0, 0); }}
            className={`flex-1 flex flex-col items-center justify-center transition-colors ${activeTab === 'audit' ? 'text-zinc-900' : 'text-zinc-400'}`}
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-[10px] uppercase font-bold tracking-widest">Audit</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
