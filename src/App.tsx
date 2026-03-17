import { useEffect, useState, useCallback } from 'react';
import { useHabitStore } from './store/useHabitStore';
import { useConfettiStore } from './store/useConfettiStore';
import { Navbar } from './components/layout/Navbar';
import { Dashboard } from './components/habits/Dashboard';
import { AuthScreen } from './components/auth/AuthScreen';
import { StatsScreen } from './components/analytics/StatsScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { CalendarView } from './components/analytics/CalendarView';
import { Home, Calendar, BarChart2, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

type Tab = 'home' | 'history' | 'stats' | 'settings';

const AUTH_KEY = 'habit-flow-auth';

function App() {
  const { habits, setHabits, stats } = useHabitStore();
  const { isActive: isConfettiActive } = useConfettiStore();
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });
  const [activeTab, setActiveTab] = useState<Tab>('home');

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Only seed sample habits if store is empty (first-time users)
  useEffect(() => {
    if (habits.length === 0) {
      setHabits([
        {
          id: '1',
          user_id: 'sample',
          name: 'Morning Run',
          emoji: '🏃',
          category: 'Fitness',
          color: '#ff3b30',
          frequency: ['Mon', 'Wed', 'Fri'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_days: [],
          streak_current: 3,
          streak_longest: 12,
        },
        {
          id: '2',
          user_id: 'sample',
          name: 'Read 20 Pages',
          emoji: '📚',
          category: 'Study',
          color: '#5856d6',
          frequency: ['Daily'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_days: [new Date().toISOString().split('T')[0]],
          streak_current: 5,
          streak_longest: 5,
        },
        {
          id: '3',
          user_id: 'sample',
          name: 'Meditation',
          emoji: '🧘',
          category: 'Mindset',
          color: '#34c759',
          frequency: ['Daily'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_days: [],
          streak_current: 8,
          streak_longest: 20,
        },
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = useCallback(() => {
    localStorage.setItem(AUTH_KEY, 'true');
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setActiveTab('home');
  }, []);

  if (!isAuthenticated) {
    return <AuthScreen onSuccess={handleLogin} />;
  }

  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'home', icon: <Home className="w-6 h-6" />, label: 'Home' },
    { id: 'history', icon: <Calendar className="w-6 h-6" />, label: 'History' },
    { id: 'stats', icon: <BarChart2 className="w-6 h-6" />, label: 'Stats' },
    { id: 'settings', icon: <Settings className="w-6 h-6" />, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-[rgb(var(--background))] border-x border-[rgb(var(--border))] shadow-2xl relative">
      {isConfettiActive && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={250}
          recycle={false}
          colors={['#007aff', '#5856d6', '#34c759', '#ffcc00', '#ff3b30', '#af52de']}
        />
      )}

      <Navbar />

      <main className="flex-1 px-6 pt-8 pb-36 overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {activeTab === 'home' && <Dashboard />}
            {activeTab === 'history' && (
              <div className="flex flex-col gap-6">
                <header>
                  <h2 className="text-3xl font-black tracking-tighter">History</h2>
                  <p className="text-muted-foreground font-medium mt-1">Track your past completions</p>
                </header>
                <CalendarView />
              </div>
            )}
            {activeTab === 'stats' && <StatsScreen />}
            {activeTab === 'settings' && <SettingsScreen onLogout={handleLogout} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg glass border-t border-[rgb(var(--border))] px-2 py-3 pb-8 flex justify-around items-center rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.06)]">
        {tabs.map((tab) => (
          <NavIcon
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </nav>
    </div>
  );
}

const NavIcon = ({
  icon, label, active = false, onClick,
}: {
  icon: React.ReactNode; label: string; active?: boolean; onClick: () => void;
}) => (
  <motion.button
    whileTap={{ scale: 0.88 }}
    onClick={onClick}
    className="flex flex-col items-center gap-1 relative px-4 py-1"
  >
    <motion.div
      animate={{ color: active ? '#007aff' : undefined }}
      className={active ? 'text-brand-primary' : 'text-muted-foreground'}
    >
      {active && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute -inset-1 bg-brand-primary/10 rounded-xl -z-10"
        />
      )}
      {icon}
    </motion.div>
    <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${active ? 'text-brand-primary' : 'text-muted-foreground'}`}>
      {label}
    </span>
  </motion.button>
);

export default App;
