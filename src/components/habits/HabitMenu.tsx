import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, X } from 'lucide-react';
import { useHabitStore } from '../../store/useHabitStore';
import { cn } from '../../utils/cn';

interface HabitMenuProps {
  habitId: string;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const HabitMenu: React.FC<HabitMenuProps> = ({ habitId, isOpen, onClose, onEdit }) => {
  const deleteHabit = useHabitStore((state) => state.deleteHabit);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habitId);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="relative w-full max-w-[280px] bg-[rgb(var(--card))] rounded-[24px] overflow-hidden shadow-2xl border border-[rgb(var(--border))]"
          >
            <div className="p-2 flex flex-col gap-1">
              <button
                onClick={onEdit}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-2xl transition-all text-sm font-bold"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Edit2 className="w-4 h-4" />
                </div>
                Edit Habit
              </button>
              
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all text-sm font-bold text-red-500"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                Delete Habit
              </button>

              <div className="h-px bg-[rgb(var(--border))] my-1 mx-2" />

              <button
                onClick={onClose}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-2xl transition-all text-sm font-bold opacity-60"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <X className="w-4 h-4" />
                </div>
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
