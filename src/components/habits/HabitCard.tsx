import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, MoreVertical } from 'lucide-react';
import { HabitMenu } from './HabitMenu';
import type { Habit } from '../../types/habit';
import { useHabitStore } from '../../store/useHabitStore';
import { useConfettiStore } from '../../store/useConfettiStore';
import { format } from 'date-fns';
import { cn } from '../../utils/cn';

interface HabitCardProps {
  habit: Habit;
  date: Date;
  onEdit: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, date, onEdit }) => {
  const toggleHabitStatus = useHabitStore((state) => state.toggleHabitStatus);
  const triggerConfetti = useConfettiStore((state) => state.trigger);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const formattedDate = format(date, 'yyyy-MM-dd');
  const isCompleted = habit.completed_days.includes(formattedDate);

  const handleToggle = () => {
    if (!isCompleted) {
      triggerConfetti();
    }
    toggleHabitStatus(habit.id, formattedDate);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ios-card flex items-center justify-between group"
    >
      <div className="flex items-center gap-4">
        <div 
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300",
            isCompleted ? "bg-brand-success/20 animate-bounce-subtle" : "bg-muted"
          )}
          style={{ backgroundColor: isCompleted ? `${habit.color}20` : undefined }}
        >
          {habit.emoji}
        </div>
        
        <div className="flex flex-col">
          <h3 className={cn(
            "font-semibold transition-all",
            isCompleted && "text-muted-foreground line-through"
          )}>
            {habit.name}
          </h3>
          <div className="flex items-center gap-3 mt-0.5">
            <div className="flex items-center gap-1 text-xs text-brand-warning font-bold">
              <Flame className="w-3 h-3 fill-brand-warning" />
              {habit.streak_current}d
            </div>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter px-1.5 py-0.5 bg-muted rounded-md line-clamp-1">
              {habit.category}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleToggle}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-75",
            isCompleted 
              ? "bg-brand-success text-white shadow-lg shadow-brand-success/30" 
              : "border-2 border-muted text-muted hover:border-brand-primary hover:text-brand-primary"
          )}
        >
          {isCompleted ? <Check className="w-6 h-6 stroke-[3]" /> : <div className="w-2 h-2 rounded-full bg-current" />}
        </button>
        
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <HabitMenu 
        habitId={habit.id}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onEdit={() => {
          setIsMenuOpen(false);
          onEdit();
        }}
      />
    </motion.div>
  );
};
