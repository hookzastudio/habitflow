import React from 'react';
import { motion } from 'framer-motion';
import { useHabitStore } from '../../store/useHabitStore';
import { LogOut, Bell, Moon, ChevronRight, Info, Heart, Trash2 } from 'lucide-react';

interface SettingsScreenProps {
  onLogout: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onLogout }) => {
  const { habits, stats } = useHabitStore();

  const handleClearData = () => {
    if (confirm('This will delete all your habits and reset your progress. Are you sure?')) {
      localStorage.removeItem('habit-flow-storage');
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-3xl font-black tracking-tighter">Settings</h2>
        <p className="text-muted-foreground font-medium mt-1">Customize your experience</p>
      </header>

      {/* Profile Card */}
      <div className="ios-card bg-gradient-to-br from-brand-primary to-brand-secondary text-white border-none p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black">
          ✨
        </div>
        <div>
          <h3 className="text-xl font-black">HabitFlow User</h3>
          <p className="text-white/70 font-medium text-sm">Level {stats.level} · {stats.xp} XP</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">{habits.length} habits</span>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="ios-card flex flex-col gap-0 overflow-hidden divide-y divide-[rgb(var(--border))] p-0">
        <div className="p-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-4 pt-3 pb-2">Preferences</p>
        </div>
        <SettingRow
          icon={<Bell className="w-4 h-4 text-red-500" />}
          iconBg="bg-red-100 dark:bg-red-900/40"
          label="Daily Reminders"
          description="Get notified to complete habits"
          action={<Toggle />}
        />
        <SettingRow
          icon={<Moon className="w-4 h-4 text-indigo-500" />}
          iconBg="bg-indigo-100 dark:bg-indigo-900/40"
          label="Dark Mode"
          description="Follows system setting"
          action={<span className="text-xs text-muted-foreground font-medium">System</span>}
        />
      </div>

      {/* About */}
      <div className="ios-card flex flex-col gap-0 overflow-hidden divide-y divide-[rgb(var(--border))] p-0">
        <div className="p-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-4 pt-3 pb-2">About</p>
        </div>
        <SettingRow
          icon={<Info className="w-4 h-4 text-brand-primary" />}
          iconBg="bg-blue-100 dark:bg-blue-900/40"
          label="Version"
          action={<span className="text-xs text-muted-foreground font-medium">1.0.0</span>}
        />
        <SettingRow
          icon={<Heart className="w-4 h-4 text-pink-500" />}
          iconBg="bg-pink-100 dark:bg-pink-900/40"
          label="Made with ❤️"
          action={<ChevronRight className="w-4 h-4 text-muted-foreground" />}
        />
      </div>

      {/* Danger Zone */}
      <div className="ios-card flex flex-col gap-0 overflow-hidden divide-y divide-[rgb(var(--border))] p-0">
        <div className="p-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-4 pt-3 pb-2">Danger Zone</p>
        </div>
        <button
          onClick={handleClearData}
          className="flex items-center gap-4 px-4 py-3.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all w-full text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
            <Trash2 className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-bold text-red-500">Clear All Data</span>
            <p className="text-xs text-muted-foreground">Delete all habits and reset progress</p>
          </div>
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-4 px-4 py-3.5 hover:bg-muted transition-all w-full text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
            <LogOut className="w-4 h-4 text-orange-500" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-bold text-orange-500">Sign Out</span>
            <p className="text-xs text-muted-foreground">Return to login screen</p>
          </div>
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground pb-4">HabitFlow · Build great habits, one day at a time ✨</p>
    </div>
  );
};

const Toggle = () => {
  const [on, setOn] = React.useState(false);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`w-11 h-6 rounded-full transition-all duration-300 relative ${on ? 'bg-brand-success' : 'bg-muted'}`}
    >
      <motion.div
        animate={{ x: on ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 600, damping: 30 }}
        className="w-5 h-5 bg-white rounded-full shadow absolute top-0.5"
      />
    </button>
  );
};

const SettingRow = ({
  icon, iconBg, label, description, action
}: {
  icon: React.ReactNode; iconBg: string; label: string; description?: string; action: React.ReactNode;
}) => (
  <div className="flex items-center gap-4 px-4 py-3.5">
    <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>{icon}</div>
    <div className="flex-1 min-w-0">
      <span className="text-sm font-bold">{label}</span>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
    {action}
  </div>
);
