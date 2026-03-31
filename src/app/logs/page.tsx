'use client';
import { useEffect, useState } from 'react';

export default function LogsPage() {
  const [logs, setLogs] = useState<{ date: string; items: string[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/logs', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setLogs(data.logs || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-1 border-b border-zinc-900 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Autonomous Logs</h1>
        <p className="text-zinc-500 font-medium">Daily agent activity from /memory/*.md</p>
      </header>

      <div className="flex flex-col gap-12">
        {logs.map((log) => (
          <div key={log.date} className="relative pl-10 border-l border-zinc-800 last:border-0 pb-12 last:pb-0">
            <div className="absolute left-[-5px] top-0 size-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] border-2 border-zinc-950" />
            <h2 className="text-sm font-bold font-mono text-zinc-400 uppercase tracking-widest mb-6">{log.date}</h2>
            <div className="grid grid-cols-1 gap-4">
              {log.items.map((item, i) => (
                <div key={i} className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl flex flex-col gap-1 hover:border-zinc-700/50 transition-all">
                  <span className="text-sm text-zinc-300 font-medium leading-relaxed">{item}</span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="size-1 rounded-full bg-zinc-600" />
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Logged by Zen3</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {loading && <div className="p-8 text-center text-zinc-500">Scanning activity logs...</div>}
      </div>
    </div>
  );
}
