import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AuthScreenProps {
  onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-6 py-12 bg-[rgb(var(--background))] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-brand-primary rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-brand-secondary rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-xl shadow-brand-primary/20 mb-6"
          >
            ✨
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">HabitFlow</h1>
          <p className="text-muted-foreground font-medium">Design your dream life, one bit at a time.</p>
        </div>

        <div className="ios-card bg-white dark:bg-black/20 p-8 shadow-2xl shadow-black/5">
          <div className="flex bg-muted rounded-xl p-1 mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={cn(
                "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                isLogin ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground" : "text-muted-foreground"
              )}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={cn(
                "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                !isLogin ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground" : "text-muted-foreground"
              )}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {!isLogin && (
              <AuthInput icon={<User className="w-4 h-4" />} placeholder="Full Name" type="text" />
            )}
            <AuthInput 
              icon={<Mail className="w-4 h-4" />} 
              placeholder="Email address" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <AuthInput 
              icon={<Lock className="w-4 h-4" />} 
              placeholder="Password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-4 rounded-xl bg-brand-primary text-white font-bold flex items-center justify-center gap-2 mt-4 shadow-lg shadow-brand-primary/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Welcome Back' : 'Get Started'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground font-medium">
            By continuing, you agree to our Terms and Conditions.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const AuthInput = ({ icon, ...props }: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
      {icon}
    </div>
    <input 
      {...props}
      className="w-full pl-11 pr-4 py-3.5 bg-muted rounded-xl text-sm font-medium outline-none focus:ring-2 ring-brand-primary/20 transition-all border border-transparent focus:border-brand-primary/20"
    />
  </div>
);
