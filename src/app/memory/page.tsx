'use client';
import { useEffect, useState } from 'react';

export default function MemoryPage() {
  const [memory, setMemory] = useState<{ title: string; body: string[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/memory', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setMemory(data.sections || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1 border-b border-zinc-900 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Long-Term Memory</h1>
        <p className="text-zinc-500 font-medium">Curated context and goals</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {memory.map((section) => (
          <div key={section.title} className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl flex flex-col gap-6 hover:border-zinc-700 transition-colors">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">{section.title}</h2>
            <ul className="flex flex-col gap-4">
              {section.body.map((bullet, i) => (
                <li key={i} className="text-sm text-zinc-300 leading-relaxed font-medium">
                  • {bullet.replace(/^- /, '')}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {loading && <div className="p-8 text-center text-zinc-500">Retrieving memories...</div>}
      </div>
    </div>
  );
}
