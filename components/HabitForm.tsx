
import React, { useState } from 'react';

interface HabitFormProps {
  onAdd: (name: string) => void;
  existingNames: string[];
}

const HabitForm: React.FC<HabitFormProps> = ({ onAdd, existingNames }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Name is required.');
      return;
    }
    if (existingNames.map(n => n.toLowerCase()).includes(cleanName.toLowerCase())) {
      setError('Habit already exists.');
      return;
    }
    onAdd(cleanName);
    setName('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 border border-zinc-200 shadow-sm">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Initialize New Habit</h2>
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          placeholder="Habit Label (e.g. 05:00 Wakeup)"
          className="flex-1 bg-zinc-50 border border-zinc-200 px-4 h-12 text-sm focus:outline-none focus:border-zinc-400 focus:bg-white transition-all rounded-sm"
        />
        <button
          type="submit"
          className="h-12 bg-zinc-900 text-white px-6 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors active:scale-[0.98]"
        >
          Add Unit
        </button>
      </div>
      {error && <p className="text-red-500 text-[10px] mt-3 font-bold uppercase tracking-tight">{error}</p>}
    </form>
  );
};

export default HabitForm;
