import React from 'react';
import { Flame, User } from 'lucide-react';
import { useHabitStore } from '../../store/useHabitStore';
import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { stats, habits } = useHabitStore();

  // Real highest current streak across all habits
  const highestStreak = habits.reduce((max, h) => Math.max(max, h.streak_current), 0);
  const xpProgress = Math.min((stats.xp % 1000) / 10, 100);

  return (
    <nav className="sticky top-0 z-50 glass px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl">✨</span>
        <h1 className="text-xl font-black bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent m-0 tracking-tighter">
          HabitFlow
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Real Streak */}
        <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/30 px-3 py-1.5 rounded-full border border-orange-100 dark:border-orange-900/50">
          <Flame className="w-4 h-4 text-brand-warning fill-brand-warning" />
          <span className="text-sm font-black text-brand-warning">{highestStreak}</span>
        </div>

        {/* Level + XP */}
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.04 }}
        >
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Lv.{stats.level}</span>
            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden mt-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center border border-brand-primary/20">
            <User className="w-4 h-4 text-brand-primary" />
          </div>
        </motion.div>
      </div>
    </nav>
  );
};
