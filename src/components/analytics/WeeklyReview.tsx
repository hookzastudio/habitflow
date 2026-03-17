import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Zap } from 'lucide-react';
import { useHabitStore } from '../../store/useHabitStore';
import { format, subDays, eachDayOfInterval } from 'date-fns';

export const WeeklyReview: React.FC = () => {
  const { stats, habits } = useHabitStore();
  const today = new Date();

  // Calculate real weekly flow %
  const last7 = eachDayOfInterval({ start: subDays(today, 6), end: today });
  const weeklyFlow = habits.length === 0 ? 0 : (() => {
    const total = habits.length * 7;
    const done = habits.reduce((acc, h) =>
      acc + last7.filter(d => h.completed_days.includes(format(d, 'yyyy-MM-dd'))).length, 0);
    return Math.round((done / total) * 100);
  })();

  // Count unlocked "badges" = level milestones
  const badgeCount = Math.floor(stats.level / 2) + (stats.xp > 500 ? 1 : 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="ios-card bg-gradient-to-br from-brand-primary to-brand-secondary text-white border-none p-6 overflow-hidden relative"
    >
      <div className="absolute -top-4 -right-4 opacity-10 pointer-events-none">
        <Trophy className="w-36 h-36" />
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-black">Weekly Flow</h3>
            <span className="text-2xl">🔥</span>
          </div>
          <p className="text-white/70 font-medium text-sm">
            {weeklyFlow >= 80 ? 'You were amazing this week! 🎉' :
             weeklyFlow >= 50 ? 'Good progress, keep it up! 💪' :
             'Every day is a fresh start ✨'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatBox icon={<Zap className="w-4 h-4" />} label="XP" value={`${stats.xp}`} />
          <StatBox icon={<TrendingUp className="w-4 h-4" />} label="Flow" value={`${weeklyFlow}%`} />
          <StatBox icon={<Trophy className="w-4 h-4" />} label="Badges" value={`${badgeCount}`} />
        </div>

        {/* XP Progress to next level */}
        <div className="bg-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold opacity-70">Level {stats.level} → {stats.level + 1}</span>
              <span className="text-xs font-black">{stats.xp % 1000}/1000 XP</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((stats.xp % 1000) / 10, 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatBox = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex flex-col items-center gap-1 bg-white/10 rounded-2xl py-3 border border-white/10">
    <div className="p-1.5 bg-white/10 rounded-lg">{icon}</div>
    <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">{label}</span>
    <span className="text-sm font-black">{value}</span>
  </div>
);
