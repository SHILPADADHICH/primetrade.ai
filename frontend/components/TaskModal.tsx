'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  task?: Task | null;
}

export default function TaskModal({ isOpen, onClose, onSubmit, task }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('TODO');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
    } else {
      setTitle('');
      setDescription('');
      setStatus('TODO');
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ title, description, status });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-white/90" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white border-2 border-black p-8 shadow overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="border-b border-black pb-4 mb-8 flex items-center justify-between">
          <h3 className="text-xl font-bold uppercase tracking-widest leading-none">
            {task ? 'Edit Task' : 'New Task'}
          </h3>
          <button onClick={onClose} className="p-1 px-4 border border-black hover:bg-black hover:text-white transition-colors text-xs font-bold uppercase">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-black bg-white text-sm focus:bg-gray-50 outline-none"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-black bg-white text-sm focus:bg-gray-50 outline-none min-h-[80px]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-black bg-white text-xs font-bold uppercase outline-none"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div className="flex gap-4 mt-10">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-black text-white font-bold uppercase text-xs tracking-widest hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Processing...' : (task ? 'Save Changes' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
