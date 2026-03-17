import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useHabitStore } from '../../store/useHabitStore';
import type { Category } from '../../types/habit';
import { cn } from '../../utils/cn';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: Category[] = ['Fitness', 'Study', 'Health', 'Work', 'Mindset', 'Other'];
const EMOJIS = ['🏃', '📚', '🧘', '💧', '🥗', '💻', '🛌', '🧠', '🍎', '💪', '🎨', '🎹'];
const COLORS = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#007aff', '#5856d6', '#af52de', '#ff2d55'];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose }) => {
  const addHabit = useHabitStore((state) => state.addHabit);
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJIS[0]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('Fitness');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addHabit({
      id: Math.random().toString(36).substr(2, 9),
      user_id: 'sample-user',
      name,
      emoji: selectedEmoji,
      category: selectedCategory,
      color: selectedColor,
      frequency: ['Daily'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_days: [],
      streak_current: 0,
      streak_longest: 0,
    });

    setName('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg bg-[rgb(var(--card))] rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-extrabold tracking-tight">New Habit</h2>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="flex flex-col gap-3 text-center items-center">
                  <div 
                    className="w-24 h-24 rounded-[32px] flex items-center justify-center text-5xl shadow-inner mb-2"
                    style={{ backgroundColor: `${selectedColor}15`, border: `2px solid ${selectedColor}30` }}
                  >
                    {selectedEmoji}
                  </div>
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Habit name..."
                    className="w-full text-center text-2xl font-bold bg-transparent outline-none placeholder:opacity-30"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Icon & Color</label>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-8 h-8 rounded-full transition-all duration-200 border-2",
                          selectedColor === color ? "scale-125 border-white dark:border-black ring-2 ring-brand-primary" : "border-transparent opacity-60 hover:opacity-100"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center py-2">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        className={cn(
                          "text-3xl transition-transform",
                          selectedEmoji === emoji ? "scale-150" : "opacity-40 hover:opacity-100"
                        )}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                          selectedCategory === cat 
                            ? "bg-brand-primary text-white" 
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="w-full py-5 rounded-2xl bg-brand-primary text-white font-extrabold text-lg shadow-xl shadow-brand-primary/30 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 mb-4"
                >
                  Create Habit ✨
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
