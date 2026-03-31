'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [data, setData] = useState<{
    projects: any[];
    tasks: { id: string; text: string; priority: string; isCompleted: boolean }[];
    logs: { date: string; items: string[] }[];
    memory: { title: string; body: string[] }[];
    loading: boolean;
  }>({ 
    projects: [], 
    tasks: [], 
    logs: [], 
    memory: [], 
    loading: true 
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, taskRes, logRes, memRes] = await Promise.all([
          fetch('/api/projects', { cache: 'no-store' }),
          fetch('/api/tasks', { cache: 'no-store' }),
          fetch('/api/logs', { cache: 'no-store' }),
          fetch('/api/memory', { cache: 'no-store' })
        ]);
        const projData = await projRes.json();
        const taskData = await taskRes.json();
        const logData = await logRes.json();
        const memData = await memRes.json();
        
        setData({ 
          projects: projData.projects || [], 
          tasks: taskData.tasks || [], 
          logs: logData.logs || [],
          memory: memData.sections || [],
          loading: false 
        });
      } catch (error) {
        console.error('Fetch error:', error);
        setData(prev => ({ ...prev, loading: false }));
      }
    }
    fetchData();
  }, []);

  const stats = [
    { label: "Active Projects", value: data.projects.length.toString(), icon: "🌱", trend: "+1 this week" },
    { label: "Pending Tasks", value: data.tasks.filter(t => !t.isCompleted).length.toString(), icon: "📋", trend: `${data.tasks.filter(t => t.priority === 'high' && !t.isCompleted).length} high priority` },
    { label: "Total Tokens", value: "158k", icon: "⚡", trend: "$0.09 spent" },
    { label: "Memory Recall", value: "98%", icon: "🧠", trend: "Curated daily" },
  ];

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-sm font-medium text-zinc-500">Initializing Mission Control...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pb-12">
      {/* Header */}
      <header className="flex items-end justify-between border-b border-zinc-900 pb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Mission Control</h1>
          <p className="text-zinc-500 font-medium">Monitoring autonomous agent operations for Zen.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-1 bg-zinc-900 text-zinc-400 rounded-md uppercase tracking-wider">v1.0.0</span>
          <span className="text-xs font-semibold px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">Live</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex flex-col gap-4 shadow-sm hover:border-zinc-700/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">{stat.trend}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{stat.label}</span>
              <span className="text-2xl font-semibold text-zinc-50 tracking-tight">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Primary Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2/3) - Projects & Memory */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          {/* Projects */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-zinc-200 uppercase tracking-widest text-xs">Active Projects</h2>
              <Link href="/projects" className="text-xs font-bold text-zinc-500 hover:text-zinc-200 transition-colors uppercase tracking-widest">Manage Projects &rarr;</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects.map((project) => (
                <Link href={`/projects/${project.id}`} key={project.id} className="group bg-zinc-900/30 border border-zinc-800 p-6 rounded-xl flex flex-col gap-6 hover:bg-zinc-900/50 hover:border-zinc-700/50 transition-all cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-zinc-50 tracking-tight group-hover:text-emerald-400 transition-colors">{project.name}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed truncate font-mono">{project.path.replace('/home/node/.openclaw/workspace/', '')}</p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-zinc-600">Health / Progress</span>
                      <span className="text-zinc-400">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden">
                      <div className={`h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]`} style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-zinc-800/50 pt-4 mt-2">
                    <div className="flex items-center gap-2">
                       <span className="size-2 rounded-full bg-emerald-500" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{project.status}</span>
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono">FILES: {project.fileCount}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Long-Term Memory (Phase 3 addition) */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-zinc-200 uppercase tracking-widest text-xs">Long-Term Memory</h2>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Curated Core Context</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.memory.map((section) => (
                <div key={section.title} className="bg-zinc-900/20 border border-zinc-800/50 p-6 rounded-xl flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2">{section.title}</h3>
                  <ul className="flex flex-col gap-2">
                    {section.body.map((bullet, i) => (
                      <li key={i} className="text-xs text-zinc-500 leading-relaxed list-none pl-0">
                         {bullet.replace(/^- /, '')}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (1/3) - Tasks & History */}
        <div className="flex flex-col gap-10">
          {/* Pending Tasks */}
          <section className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-200 uppercase tracking-widest text-xs">Pending Tasks</h2>
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl divide-y divide-zinc-800/50 overflow-hidden shadow-sm">
              {data.tasks.filter(t => !t.isCompleted).map((task) => (
                <div key={task.id} className="p-4 flex gap-3 hover:bg-zinc-900/50 transition-colors group">
                  <div className={`size-1.5 rounded-full mt-1.5 shrink-0 ${task.priority === 'high' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-zinc-700'}`} />
                  <span className="text-[13px] text-zinc-400 font-medium leading-snug group-hover:text-zinc-200 transition-colors">{task.text}</span>
                </div>
              ))}
              {data.tasks.filter(t => !t.isCompleted).length === 0 && (
                <div className="p-8 text-center text-xs text-zinc-600 italic uppercase tracking-widest">Clear for Takeoff</div>
              )}
            </div>
          </section>

          {/* Autonomous Log (Phase 3 addition) */}
          <section className="flex flex-col gap-6">
             <h2 className="text-lg font-semibold tracking-tight text-zinc-200 uppercase tracking-widest text-xs">Autonomous Log</h2>
             <div className="flex flex-col gap-4">
               {data.logs.map((log) => (
                 <div key={log.date} className="relative pl-6 pb-6 border-l border-zinc-800 last:pb-0">
                   <div className="absolute left-[-4.5px] top-0 size-2 rounded-full bg-zinc-700 border border-zinc-950" />
                   <div className="flex flex-col gap-2">
                     <span className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-wider">{log.date}</span>
                     <div className="bg-zinc-900/40 border border-zinc-800/30 p-3 rounded-lg flex flex-col gap-1.5">
                       {log.items.map((item, i) => (
                         <p key={i} className="text-[11px] text-zinc-500 leading-relaxed truncate">
                            {item}
                         </p>
                       ))}
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </section>
        </div>
      </div>

      {/* System Footer Bar */}
      <footer className="mt-12 pt-8 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono text-zinc-600 tracking-tighter uppercase">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            API_CONNECTED: 05:40 UTC
          </span>
          <span>FS_WATCH_ACTIVE: /workspace</span>
        </div>
        <div>Zen3 // Mission Control v1.0.0-phase3</div>
      </footer>
    </div>
  );
}
