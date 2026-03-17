import { create } from 'zustand';

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

interface BadgeState {
  badges: Badge[];
  unlockBadge: (id: string) => void;
}

export const useBadgeStore = create<BadgeState>((set) => ({
  badges: [
    { id: '1', name: 'Early Bird', icon: '🌅', description: 'Complete a habit before 8 AM', unlocked: false },
    { id: '2', name: 'Consistent', icon: '🔥', description: 'Reach a 7-day streak', unlocked: true },
    { id: '3', name: 'Mindful', icon: '🧘', description: 'Complete 10 mindfulness habits', unlocked: false },
    { id: '4', name: 'Explorer', icon: '🌍', description: 'Create 5 different habits', unlocked: false },
  ],
  unlockBadge: (id) => set((state) => ({
    badges: state.badges.map(b => b.id === id ? { ...b, unlocked: true } : b)
  })),
}));
