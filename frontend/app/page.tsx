'use client';

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Box, Check, Cpu, Layout, Lock } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-500/5 blur-[120px] -z-10" />

      <header className="px-8 py-6 max-w-7xl mx-auto flex justify-between items-center bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold uppercase tracking-widest transition-transform hover:scale-110">PrimeTradeAI</span>
        </div>
        <div className="flex items-center gap-8">
          {user ? (
            <Link href="/dashboard" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold transition-all flex items-center gap-2">
              Dashboard <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold hover:text-indigo-600 transition-colors">Sign In</Link>
              <Link href="/register" className="px-6 py-2.5 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-full font-bold transition-transform active:scale-95">Sign Up</Link>
            </>
          )}
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-8 py-20 lg:py-32">
        <div className="max-w-3xl space-y-8">
          <span className="text-xs font-black uppercase text-indigo-600 tracking-[0.2em] flex items-center gap-2">
            <Cpu size={14} /> Fullstack Assignment System
          </span>
          <h2 className="text-6xl sm:text-7xl font-bold leading-[1.05] tracking-tight">
            Build Faster. <br />
            <span className="text-zinc-400">Manage Better.</span>
          </h2>
          <p className="text-xl text-zinc-500 max-w-xl leading-relaxed">
            Experience a streamlined, high-performance task management ecosystem built with modern tools for real-world reliability.
          </p>
          <div className="flex gap-4 pt-4">
            <Link href="/register" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/10 transition-all hover:scale-110 active:scale-95">Get Started Today</Link>
            <a href="http://localhost:5000/api-docs" target="_blank" className="px-8 py-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold text-lg hover:bg-zinc-100 transition-colors">Swagger API</a>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-32">
          {[
            { icon: <Lock className="text-emerald-500" />, title: "Secure Auth", desc: "Enterprise-grade JWT auth with password hashing at the core." },
            { icon: <Cpu className="text-indigo-500" />, title: "Redis Cache", desc: "Experience blazing fast speeds with distributed state caching." },
            { icon: <Box className="text-blue-500" />, title: "Prisma Layer", desc: "Type-safe database interactions with robust PostgreSQL schema." }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all">
              <div className="mb-6 p-3 bg-zinc-50 dark:bg-zinc-800 w-fit rounded-xl group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-zinc-500 text-sm leading-6">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-20 py-12 px-8 border-t border-zinc-100 dark:border-zinc-800 text-sm text-zinc-400 flex justify-between items-center max-w-7xl mx-auto">
        <label>© 2026 PRIME TRADE AI LABS.</label>
        <div className="flex gap-6 uppercase font-bold text-[10px] tracking-widest">
          <span>TS</span><span>PRISMA</span><span>REDIS</span><span>DOCKER</span>
        </div>
      </footer>
    </div>
  );
}
