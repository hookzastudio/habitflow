import React, { useState } from 'react';
import { useHabitStore } from '../../store/useHabitStore';
import { HabitCard } from './HabitCard';
import { AddHabitModal } from './AddHabitModal';
import { EditHabitModal } from './EditHabitModal';
import { BadgeDisplay } from '../analytics/BadgeDisplay';
import type { Habit } from '../../types/habit';
import { WeeklyReview } from '../analytics/WeeklyReview';
import { CalendarView } from '../analytics/CalendarView';
import { format } from 'date-fns';
import { Plus, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Dashboard: React.FC = () => {
  const { habits } = useHabitStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const today = new Date();

  return (
    <div className="flex flex-col gap-8 pb-32">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-3xl font-extrabold tracking-tight">Today</h2>
            <p className="text-muted-foreground font-medium">
              {format(today, 'EEEE, MMMM do')}
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-brand-primary/20"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-brand-primary/5 p-4 rounded-2xl border border-brand-primary/10 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-brand-primary">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Weekly Flow</span>
            </div>
            <span className="text-2xl font-bold">84%</span>
          </div>
          <div className="bg-brand-secondary/5 p-4 rounded-2xl border border-brand-secondary/10 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-brand-secondary">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Monthly Goal</span>
            </div>
            <span className="text-2xl font-bold">12/30</span>
          </div>
        </div>
      </header>

      <WeeklyReview />

      <BadgeDisplay />

      <section className="flex flex-col gap-3">
        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
            <span className="text-6xl">🌱</span>
            <div className="text-center">
              <h3 className="font-bold text-lg">No habits yet</h3>
              <p className="text-sm">Start your journey by adding your first habit!</p>
            </div>
          </div>
        ) : (
          habits.map((habit) => (
            <HabitCard 
              key={habit.id} 
              habit={habit} 
              date={today} 
              onEdit={() => setEditingHabit(habit)}
            />
          ))
        )}
      </section>

      <CalendarView />

      {/* Mood Tracker Placeholder */}
      <section className="ios-card bg-gradient-to-br from-brand-secondary/10 to-brand-primary/10 border-none p-6">
        <h3 className="font-bold flex items-center gap-2 mb-4">
          <span>How are you feeling today?</span>
          <span className="text-xl">✨</span>
        </h3>
        <div className="flex justify-between items-center px-2">
          {['😞', '😐', '😊', '🔥', '🥳'].map((emoji) => (
            <motion.button
              key={emoji}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedMood(emoji)}
              className={cn(
                "text-3xl transition-all duration-300",
                selectedMood === emoji ? "filter-none scale-125" : "filter grayscale opacity-40 hover:opacity-100 hover:grayscale-0"
              )}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </section>

      <AddHabitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <EditHabitModal
        habit={editingHabit}
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
      />
    </div>
  );
};
