'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Plus, CheckCircle, Clock, ListTodo, Edit2, Trash2, LogOut, Loader2, RefreshCw } from 'lucide-react';
import TaskModal from '@/components/TaskModal';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  user?: { name: string; email: string };
}

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.tasks.getAll();
      setTasks(data.tasks);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      fetchTasks();
    }
  }, [user, authLoading, fetchTasks]);

  const handleCreateOrUpdate = async (data: any) => {
    try {
      if (activeTask) {
        await api.tasks.update(activeTask.id, data);
      } else {
        await api.tasks.create(data);
      }
      fetchTasks();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this task?')) {
      try {
        await api.tasks.delete(id);
        fetchTasks();
      } catch (err: any) {
        setError(err.message || 'Deletion failed');
      }
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'DONE': return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'IN_PROGRESS': return "bg-indigo-50 text-indigo-600 border-indigo-100";
      default: return "bg-zinc-100 text-zinc-500 border-zinc-200";
    }
  };

  if (authLoading) return <div className="p-10 flex items-center justify-center min-h-screen text-indigo-600 animate-pulse font-bold">Loading session...</div>;
  if (!user) return <div className="p-10 text-center text-red-500 font-bold uppercase tracking-widest min-h-screen flex items-center justify-center bg-gray-50">Error: Access Denied.</div>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans p-6 lg:p-12">
      {/* Header */}
      <nav className="max-w-6xl mx-auto flex items-center justify-between mb-16">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-xl shadow-indigo-500/20">
            <ListTodo size={20} />
          </div>
          <span className="text-2xl font-black tracking-tighter">Prime<span className="text-indigo-600">Board</span></span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold">{user.email}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-full w-fit ml-auto mt-0.5">{user.role}</div>
          </div>
          <button onClick={logout} className="p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 transition-colors shadow-sm group">
            <LogOut size={18} className="text-zinc-400 group-hover:text-red-600 transition-colors" />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">Pulse Dashboard</h2>
            <p className="text-zinc-500 font-medium text-lg">Manage your project workflow effortlessly.</p>
          </div>
          <button
            onClick={() => { setActiveTask(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            New Task
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 font-bold rounded-2xl mb-12 animate-in slide-in-from-top flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <Loader2 size={48} className="animate-spin text-indigo-600 opacity-20" />
            <span className="font-bold text-zinc-300 uppercase tracking-widest text-xs">Synchronizing API...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] bg-white/50 dark:bg-zinc-900/30 text-center max-w-2xl mx-auto animate-in fade-in zoom-in">
            <div className="p-6 bg-zinc-100 dark:bg-zinc-800 rounded-[2rem] text-zinc-400 mb-8 w-fit mx-auto shadow-sm">
               <RefreshCw size={40} className="animate-spin-slow" />
            </div>
            <h3 className="text-3xl font-black mb-3">No tasks found</h3>
            <p className="text-zinc-500 font-medium leading-relaxed max-w-xs">It looks like your board is clear. Create your first task to start tracking.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="group relative bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </div>
                  <div className="flex gap-1 group-hover:opacity-100 opacity-0 transition-opacity">
                    <button onClick={() => { setActiveTask(task); setIsModalOpen(true); }} className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-indigo-600">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(task.id)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grow space-y-3">
                  <h4 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                  <p className="text-zinc-500 font-medium text-sm leading-relaxed line-clamp-3">
                    {task.description || 'No detailed description.'}
                  </p>
                </div>

                <div className="mt-10 pt-6 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between text-zinc-400">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Active Task</span>
                  </div>
                  <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setActiveTask(null); }}
        onSubmit={handleCreateOrUpdate}
        task={activeTask}
      />
    </div>
  );
}
