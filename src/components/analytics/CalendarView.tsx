import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, subMonths, addMonths } from 'date-fns';
import { useHabitStore } from '../../store/useHabitStore';
import { cn } from '../../utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const CalendarView: React.FC = () => {
  const { habits } = useHabitStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the number of habits completed on a given day
  const getCompletedCount = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return habits.filter(h => h.completed_days.includes(dateStr)).length;
  };

  const totalCompletionsThisMonth = days.reduce((acc, day) => acc + getCompletedCount(day), 0);
  const perfectDays = days.filter(d => habits.length > 0 && getCompletedCount(d) >= habits.length).length;

  // Leading empty cells for day-of-week alignment
  const startDayOfWeek = monthStart.getDay(); // 0=Sun

  return (
    <div className="ios-card flex flex-col gap-5">
      {/* Month navigator */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 active:scale-90 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="text-lg font-black">{format(currentMonth, 'MMMM yyyy')}</h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          disabled={currentMonth >= startOfMonth(today)}
          className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 active:scale-90 transition-all disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-[10px] font-bold text-center text-muted-foreground opacity-50 pb-1">
            {d}
          </div>
        ))}

        {/* Empty leading cells */}
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Day cells */}
        {days.map((day) => {
          const count = getCompletedCount(day);
          const total = habits.length;
          const isToday = isSameDay(day, today);
          const isPerfect = total > 0 && count >= total;
          const isFuture = day > today;

          let cellBg = 'bg-muted text-muted-foreground opacity-30';
          if (isFuture) cellBg = 'bg-transparent border border-[rgb(var(--border))] text-muted-foreground opacity-30';
          else if (isToday) cellBg = 'bg-brand-primary text-white';
          else if (isPerfect) cellBg = 'bg-brand-success text-white';
          else if (count > 0) cellBg = 'bg-brand-success/20 text-brand-success';
          else cellBg = 'bg-muted text-muted-foreground opacity-40';

          return (
            <motion.div
              key={day.toISOString()}
              whileHover={!isFuture ? { scale: 1.15 } : {}}
              className={cn(
                'w-full aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold cursor-default transition-all relative',
                cellBg,
                isToday && 'ring-2 ring-brand-primary/40 ring-offset-1'
              )}
            >
              {format(day, 'd')}
              {count > 0 && !isToday && (
                <span className="absolute bottom-0.5 text-[6px] font-black opacity-70">{count}/{total}</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Monthly summary */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[rgb(var(--border))]">
        <div className="text-center">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total Done</p>
          <p className="text-xl font-black text-brand-primary">{totalCompletionsThisMonth}</p>
        </div>
        <div className="text-center border-x border-[rgb(var(--border))]">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Perfect Days</p>
          <p className="text-xl font-black text-brand-success">{perfectDays}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Habits</p>
          <p className="text-xl font-black">{habits.length}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-3 flex-wrap">
        <LegendItem color="bg-brand-primary" label="Today" />
        <LegendItem color="bg-brand-success" label="Perfect" />
        <LegendItem color="bg-brand-success/20" label="Partial" />
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-1.5">
    <div className={`w-3 h-3 rounded-md ${color}`} />
    <span className="text-[10px] font-bold text-muted-foreground">{label}</span>
  </div>
);
