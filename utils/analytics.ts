
import { Habit, HabitStats, LogEntry } from '../types';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const calculateStats = (habit: Habit): HabitStats => {
  // Removed unused sortedLogs variable
  const completions = habit.logs.filter(l => l.status === 'completed');
  const misses = habit.logs.filter(l => l.status === 'missed');

  // Streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date().toISOString().split('T')[0];
  // Removed unused yesterday variable
  
  // Simple streak logic based on consecutive daily logs
  // In a real app we'd handle gaps, but here we track explicitly logged completions
  const completedDates = new Set(completions.map(l => l.date));
  let checkDate = new Date();
  
  // Calculate current streak backward from today or yesterday
  while (true) {
    const dStr = checkDate.toISOString().split('T')[0];
    if (completedDates.has(dStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // If today is not logged, check yesterday. If yesterday is not logged, streak is 0.
      if (dStr === today) {
        checkDate.setDate(checkDate.getDate() - 1);
        continue; 
      }
      break;
    }
  }

  // Calculate longest streak
  const uniqueSortedDates = Array.from(new Set(habit.logs.map(l => l.date))).sort();
  tempStreak = 0;
  let prevDate: Date | null = null;

  uniqueSortedDates.forEach(dStr => {
    const currDate = new Date(dStr);
    const isCompleted = completedDates.has(dStr);

    if (isCompleted) {
      if (prevDate) {
        const diff = (currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);
        if (diff === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
    prevDate = currDate;
  });

  // Weekly consistency (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  });
  const recentCompletions = completions.filter(l => last7Days.includes(l.date)).length;
  const weeklyConsistency = Math.round((recentCompletions / 7) * 100);

  // Most missed weekday
  const missedWeekdayCounts: Record<string, number> = {};
  misses.forEach(m => {
    const day = WEEKDAYS[new Date(m.date).getDay()];
    missedWeekdayCounts[day] = (missedWeekdayCounts[day] || 0) + 1;
  });
  let mostMissedWeekday = null;
  let maxMissCount = 0;
  Object.entries(missedWeekdayCounts).forEach(([day, count]) => {
    if (count > maxMissCount) {
      maxMissCount = count;
      mostMissedWeekday = day;
    }
  });

  // Time ranges
  const timeCounts = { Morning: 0, Afternoon: 0, Night: 0 };
  completions.forEach(c => {
    if (!c.time) return;
    const hour = parseInt(c.time.split(':')[0]);
    if (hour >= 5 && hour < 12) timeCounts.Morning++;
    else if (hour >= 12 && hour < 18) timeCounts.Afternoon++;
    else timeCounts.Night++;
  });
  
  let mostCommonTimeRange: 'Morning' | 'Afternoon' | 'Night' | 'N/A' = 'N/A';
  let maxTimeCount = 0;
  // Use for...of instead of forEach to allow TypeScript to track variable assignment correctly for control flow analysis
  for (const [range, count] of Object.entries(timeCounts)) {
    if (count > maxTimeCount) {
      maxTimeCount = count;
      mostCommonTimeRange = range as 'Morning' | 'Afternoon' | 'Night';
    }
  }

  // Excuses
  const excuseFrequency: Record<string, number> = {};
  misses.forEach(m => {
    if (m.note) {
      const note = m.note.trim().toLowerCase();
      excuseFrequency[note] = (excuseFrequency[note] || 0) + 1;
    }
  });

  // Insights
  const insights: string[] = [];
  if (mostMissedWeekday) {
    insights.push(`Your discipline reliably fails on ${mostMissedWeekday}s.`);
  }
  // Control flow analysis now correctly identifies mostCommonTimeRange can be non-N/A
  if (mostCommonTimeRange !== 'N/A') {
    insights.push(`You are a ${mostCommonTimeRange.toLowerCase()} performer. Attempting this at other times likely leads to failure.`);
  }
  if (misses.length > completions.length) {
    insights.push(`This is currently more of a wish than a habit. Your failure rate is ${Math.round((misses.length / (misses.length + completions.length)) * 100)}%.`);
  }
  if (currentStreak > 0 && currentStreak === longestStreak) {
    insights.push(`You are at your peak. Expect a regression soon if you don't stay vigilant.`);
  }
  if (weeklyConsistency < 30) {
    insights.push(`Consistency is non-existent. You are essentially starting from zero every week.`);
  }
  if (tempStreak > 5) {
     insights.push(`Pattern detected: Your consistency often drops significantly after a 5-day push.`);
  }

  return {
    currentStreak,
    longestStreak,
    weeklyConsistency,
    totalCompletions: completions.length,
    totalMisses: misses.length,
    mostMissedWeekday,
    mostCommonTimeRange,
    excuseFrequency,
    insights
  };
};

export const calculateOverallStats = (habits: Habit[]) => {
  if (habits.length === 0) return { score: 0, total: 0, best: 'None', worst: 'None' };

  const totalPossible = habits.length * 7; // simplified last 7 days
  let totalDone = 0;
  habits.forEach(h => {
    const stats = calculateStats(h);
    totalDone += (stats.weeklyConsistency / 100) * 7;
  });

  const overallConsistency = Math.round((totalDone / totalPossible) * 100) || 0;

  const sortedByConsistency = [...habits].map(h => ({
    name: h.name,
    cons: calculateStats(h).weeklyConsistency
  })).sort((a, b) => b.cons - a.cons);

  return {
    score: overallConsistency,
    total: habits.length,
    best: sortedByConsistency[0]?.name || 'None',
    worst: sortedByConsistency[sortedByConsistency.length - 1]?.name || 'None'
  };
};
