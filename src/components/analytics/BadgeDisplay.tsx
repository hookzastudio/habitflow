import React from 'react';
import { motion } from 'framer-motion';
import { useHabitStore } from '../../store/useHabitStore';
import { format } from 'date-fns';

interface Badge {
  id: string;
  emoji: string;
  name: string;
  description: string;
  unlocked: boolean;
}

export const BadgeDisplay: React.FC = () => {
  const { habits, stats } = useHabitStore();
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const completedToday = habits.filter(h => h.completed_days.includes(todayStr)).length;
  const highestStreak = habits.reduce((max, h) => Math.max(max, h.streak_current), 0);
  const totalCompletions = habits.reduce((acc, h) => acc + h.completed_days.length, 0);

  const badges: Badge[] = [
    {
      id: 'first_habit',
      emoji: '🌱',
      name: 'First Step',
      description: 'Create your first habit',
      unlocked: habits.length >= 1,
    },
    {
      id: 'on_fire',
      emoji: '🔥',
      name: 'On Fire',
      description: '3-day streak on any habit',
      unlocked: highestStreak >= 3,
    },
    {
      id: 'perfect_day',
      emoji: '⭐',
      name: 'Perfect Day',
      description: 'Complete all habits in one day',
      unlocked: habits.length > 0 && completedToday >= habits.length,
    },
    {
      id: 'xp_100',
      emoji: '⚡',
      name: 'Power Up',
      description: 'Earn 100 XP',
      unlocked: stats.xp >= 100,
    },
    {
      id: 'habit_3',
      emoji: '🎯',
      name: 'Committed',
      description: 'Track 3 habits',
      unlocked: habits.length >= 3,
    },
    {
      id: 'streak_7',
      emoji: '🏆',
      name: 'Week Warrior',
      description: '7-day streak on any habit',
      unlocked: highestStreak >= 7,
    },
    {
      id: 'completions_10',
      emoji: '💎',
      name: 'Diamond',
      description: '10 total completions',
      unlocked: totalCompletions >= 10,
    },
    {
      id: 'level_2',
      emoji: '🚀',
      name: 'Level Up!',
      description: 'Reach Level 2',
      unlocked: stats.level >= 2,
    },
  ];

  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);

  return (
    <div className="ios-card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg flex items-center gap-2">
          Achievements <span className="text-xl">🏅</span>
        </h3>
        <span className="text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          {unlockedBadges.length}/{badges.length}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            title={`${badge.name}: ${badge.description}`}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              badge.unlocked ? '' : 'opacity-25 grayscale'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl relative ${
              badge.unlocked
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 ring-1 ring-yellow-200 dark:ring-yellow-800'
                : 'bg-muted'
            }`}>
              {badge.emoji}
              {badge.unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-brand-success rounded-full flex items-center justify-center"
                >
                  <span className="text-[8px] text-white font-black">✓</span>
                </motion.div>
              )}
            </div>
            <span className="text-[9px] font-bold text-center leading-tight max-w-[56px] text-muted-foreground">
              {badge.name}
            </span>
          </motion.div>
        ))}
      </div>

      {unlockedBadges.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-2">
          Complete habits to unlock achievements! 🌟
        </p>
      )}
    </div>
  );
};
