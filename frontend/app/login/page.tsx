'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Lock, Mail, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await api.auth.login({ email, password });
      login(token, user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 font-sans text-zinc-900 dark:text-zinc-50">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-12 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 space-y-10">
        <div className="text-center space-y-2">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl w-fit mx-auto mb-6">
             <Lock size={32} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter">Sign In</h1>
          <p className="text-zinc-500 font-medium">Access your enterprise dashboard</p>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-red-600" />
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Password</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-[2rem] shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 disabled:bg-indigo-300 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Login to System'}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm font-medium pt-4">
          Need access?{' '}
          <Link href="/register" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline underline-offset-4">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
