import { create } from 'zustand';

interface ConfettiState {
  isActive: boolean;
  trigger: () => void;
  stop: () => void;
}

export const useConfettiStore = create<ConfettiState>((set) => ({
  isActive: false,
  trigger: () => {
    set({ isActive: true });
    setTimeout(() => set({ isActive: false }), 4000);
  },
  stop: () => set({ isActive: false }),
}));
