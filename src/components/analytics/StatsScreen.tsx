import React from 'react';
import { motion } from 'framer-motion';
import { useHabitStore } from '../../store/useHabitStore';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { Flame, Target, TrendingUp, Award, Zap } from 'lucide-react';

export const StatsScreen: React.FC = () => {
  const { habits, stats } = useHabitStore();
  const today = new Date();

  // Calculate weekly completion rate
  const last7 = eachDayOfInterval({ start: subDays(today, 6), end: today });
  const weeklyRate = habits.length === 0 ? 0 : (() => {
    const total = habits.length * 7;
    const completed = habits.reduce((acc, h) =>
      acc + last7.filter(d => h.completed_days.includes(format(d, 'yyyy-MM-dd'))).length, 0);
    return Math.round((completed / total) * 100);
  })();

  // Best streak across all habits
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak_longest), 0);
  const currentStreak = habits.reduce((max, h) => Math.max(max, h.streak_current), 0);

  // Total completions today
  const todayStr = format(today, 'yyyy-MM-dd');
  const completedToday = habits.filter(h => h.completed_days.includes(todayStr)).length;

  // Per habit stats
  const habitStats = habits.map(h => {
    const total = last7.filter(d => h.completed_days.includes(format(d, 'yyyy-MM-dd'))).length;
    return { ...h, weeklyCompleted: total, weeklyRate: Math.round((total / 7) * 100) };
  }).sort((a, b) => b.weeklyRate - a.weeklyRate);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-3xl font-black tracking-tighter">Your Stats</h2>
        <p className="text-muted-foreground font-medium mt-1">How you're doing this week</p>
      </header>

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Flame className="w-5 h-5 fill-brand-warning text-brand-warning" />}
          label="Current Streak"
          value={`${currentStreak}d`}
          color="bg-orange-50 dark:bg-orange-950/30"
        />
        <StatCard
          icon={<Award className="w-5 h-5 text-purple-500" />}
          label="Best Streak"
          value={`${bestStreak}d`}
          color="bg-purple-50 dark:bg-purple-950/30"
        />
        <StatCard
          icon={<Target className="w-5 h-5 text-brand-success" />}
          label="Done Today"
          value={`${completedToday}/${habits.length}`}
          color="bg-green-50 dark:bg-green-950/30"
        />
        <StatCard
          icon={<Zap className="w-5 h-5 text-brand-primary" />}
          label="Total XP"
          value={`${stats.xp}`}
          color="bg-blue-50 dark:bg-blue-950/30"
        />
      </div>

      {/* Weekly Rate */}
      <div className="ios-card flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">Weekly Flow</h3>
            <p className="text-xs text-muted-foreground">Last 7 days completion</p>
          </div>
          <span className="text-3xl font-black text-brand-primary">{weeklyRate}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${weeklyRate}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
          />
        </div>
        {/* 7-day grid */}
        <div className="flex justify-between mt-1">
          {last7.map((day) => {
            const anyCompleted = habits.some(h => h.completed_days.includes(format(day, 'yyyy-MM-dd')));
            const isToday = format(day, 'yyyy-MM-dd') === todayStr;
            return (
              <div key={day.toISOString()} className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all ${
                  isToday ? 'bg-brand-primary text-white' :
                  anyCompleted ? 'bg-brand-success/20 text-brand-success' : 'bg-muted text-muted-foreground opacity-40'
                }`}>
                  {format(day, 'd')}
                </div>
                <span className="text-[9px] text-muted-foreground">{format(day, 'EEE').charAt(0)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level Progress */}
      <div className="ios-card flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2">Level {stats.level} <span className="text-xl">⚡</span></h3>
          <span className="text-sm text-muted-foreground">{stats.xp % 1000} / 1000 XP</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(stats.xp % 1000) / 10}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-brand-secondary to-brand-primary rounded-full"
          />
        </div>
        <p className="text-xs text-muted-foreground">{1000 - (stats.xp % 1000)} XP until Level {stats.level + 1}</p>
      </div>

      {/* Per-Habit Rankings */}
      {habitStats.length > 0 && (
        <div className="ios-card flex flex-col gap-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-primary" /> Habit Rankings
          </h3>
          {habitStats.map((h, i) => (
            <div key={h.id} className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground w-4">#{i + 1}</span>
              <span className="text-2xl">{h.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold">{h.name}</span>
                  <span className="text-xs font-bold text-muted-foreground">{h.weeklyCompleted}/7</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${h.weeklyRate}%` }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: h.color }}
                  />
                </div>
              </div>
              <span className="text-xs font-black" style={{ color: h.color }}>{h.weeklyRate}%</span>
            </div>
          ))}
        </div>
      )}

      {habits.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 opacity-50 gap-3">
          <span className="text-6xl">📊</span>
          <p className="text-center font-bold">Add habits to see your stats!</p>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`ios-card flex flex-col gap-2 ${color} border-none`}
  >
    <div className="flex items-center gap-2">{icon}<span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</span></div>
    <span className="text-2xl font-black">{value}</span>
  </motion.div>
);
