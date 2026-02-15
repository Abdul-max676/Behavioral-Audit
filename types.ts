
export type LogStatus = 'completed' | 'missed';

export interface LogEntry {
  date: string; // ISO Date string (YYYY-MM-DD)
  timestamp: string; // Full ISO string
  status: LogStatus;
  time?: string; // HH:mm
  note?: string; // Excuse or context
}

export interface Habit {
  id: string;
  name: string;
  createdAt: string;
  logs: LogEntry[];
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  weeklyConsistency: number; // 0-100
  totalCompletions: number;
  totalMisses: number;
  mostMissedWeekday: string | null;
  mostCommonTimeRange: 'Morning' | 'Afternoon' | 'Night' | 'N/A';
  excuseFrequency: Record<string, number>;
  insights: string[];
}
