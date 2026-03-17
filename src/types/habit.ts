export type Category = 'Fitness' | 'Study' | 'Health' | 'Work' | 'Mindset' | 'Other';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  emoji: string;
  category: Category;
  color: string;
  frequency: string[]; // ['Mon', 'Tue', ...]
  created_at: string;
  updated_at: string;
  completed_days: string[]; // ['2024-03-24', ...]
  streak_current: number;
  streak_longest: number;
  reminder_time?: string;
}

export interface UserStats {
  xp: number;
  level: number;
  badges: string[];
}

export interface DayLog {
  date: string;
  mood?: string;
  notes?: string;
}
