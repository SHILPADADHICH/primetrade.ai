'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, UserPlus, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.auth.register({ name, email, password });
      setSuccess('Account created successfully!');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 font-sans text-zinc-900">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-12 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 space-y-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl w-fit mx-auto mb-6 transition-transform hover:scale-110">
             <UserPlus size={32} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter dark:text-zinc-50">Create Account</h1>
          <p className="text-zinc-500 font-medium tracking-tight">Access the next-generation workflow platform</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold text-sm">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 font-bold text-sm">
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 relative group text-zinc-400 focus-within:text-indigo-600 transition-colors">
            <label className="text-[10px] font-black uppercase tracking-widest ml-4">Full Name</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 transition-colors" size={20} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                placeholder="Full Name"
                required
              />
            </div>
          </div>
          <div className="space-y-2 relative group text-zinc-400 focus-within:text-indigo-600 transition-colors">
            <label className="text-[10px] font-black uppercase tracking-widest ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 transition-colors" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>
          <div className="space-y-2 relative group text-zinc-400 focus-within:text-indigo-600 transition-colors">
            <label className="text-[10px] font-black uppercase tracking-widest ml-4">Account Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 transition-colors" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-950 dark:bg-zinc-50 dark:text-zinc-950 text-white font-bold py-5 rounded-[2rem] shadow-xl hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95 disabled:bg-zinc-300 flex items-center justify-center gap-3 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create System Account'}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm font-medium pt-4">
          Existing member?{' '}
          <Link href="/login" className="text-zinc-950 dark:text-zinc-50 font-bold hover:underline underline-offset-4">
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
}
