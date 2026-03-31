'use client';
import { useEffect, useState } from 'react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tasks', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setTasks(data.tasks || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1 border-b border-zinc-900 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Task Management</h1>
        <p className="text-zinc-500 font-medium">Real-time view of master-tasks.md</p>
      </header>

      <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl divide-y divide-zinc-800">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 flex items-center gap-4 hover:bg-zinc-900/50 transition-colors">
            <div className={`size-4 rounded border ${task.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-700'} flex items-center justify-center`}>
              {task.isCompleted && <span className="text-[10px] text-zinc-950 font-bold">✓</span>}
            </div>
            <span className={`text-sm ${task.isCompleted ? 'text-zinc-600 line-through' : 'text-zinc-300'} font-medium`}>
              {task.text}
            </span>
            {task.priority === 'high' && !task.isCompleted && (
              <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">High</span>
            )}
          </div>
        ))}
        {loading && <div className="p-8 text-center text-zinc-500">Loading tasks...</div>}
      </div>
    </div>
  );
}
