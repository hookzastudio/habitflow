import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Habit, UserStats } from '../types/habit';

interface HabitState {
  habits: Habit[];
  stats: UserStats;
  loading: boolean;
  setHabits: (habits: Habit[]) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitStatus: (habitId: string, date: string) => void;
  updateStats: (xp: number) => void;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [],
      stats: {
        xp: 0,
        level: 1,
        badges: [],
      },
      loading: false,

      setHabits: (habits) => set({ habits }),

      addHabit: (habit) => set((state) => ({ 
        habits: [...state.habits, habit],
        stats: { ...state.stats, xp: state.stats.xp + 50 }
      })),

      updateHabit: (id, updates) => set((state) => ({
        habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
      })),

      deleteHabit: (id) => set((state) => ({
        habits: state.habits.filter((h) => h.id !== id),
      })),

      toggleHabitStatus: (habitId, date) => set((state) => {
        const updatedHabits = state.habits.map((habit) => {
          if (habit.id === habitId) {
            const isCompleted = habit.completed_days.includes(date);
            let newCompletedDays;

            if (isCompleted) {
              newCompletedDays = habit.completed_days.filter((d) => d !== date);
            } else {
              newCompletedDays = [...habit.completed_days, date];
            }

            // Calculate streaks (simplified for now)
            const currentStreak = calculateStreak(newCompletedDays);
            const longestStreak = Math.max(habit.streak_longest, currentStreak);

            return {
              ...habit,
              completed_days: newCompletedDays,
              streak_current: currentStreak,
              streak_longest: longestStreak,
            };
          }
          return habit;
        });

        return { 
          habits: updatedHabits,
          stats: { ...state.stats, xp: state.stats.xp + 10 }
        };
      }),

      updateStats: (xp) => set((state) => {
        const totalXp = state.stats.xp + xp;
        const newLevel = Math.floor(totalXp / 1000) + 1;
        return {
          stats: {
            ...state.stats,
            xp: totalXp,
            level: newLevel,
          }
        };
      }),
    }),
    {
      name: 'habit-flow-storage',
    }
  )
);

function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  // Very simplified streak calculation: check consecutive days count
  return dates.length; 
}
