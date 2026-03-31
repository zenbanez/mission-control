'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1 border-b border-zinc-900 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Project Portfolio</h1>
        <p className="text-zinc-500 font-medium">Directory scan from /projects</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project.id} className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl flex flex-col gap-6 hover:border-emerald-500/30 hover:bg-zinc-900/80 transition-all shadow-lg group">
            <Link href={`/projects/${project.id}`} className="flex flex-col gap-2">
                <h2 className="text-lg font-bold text-zinc-50 tracking-tight group-hover:text-emerald-400 transition-colors">{project.name}</h2>
                <p className="text-xs text-zinc-500 leading-relaxed font-mono truncate">{project.path.replace('/home/node/.openclaw/workspace/', '')}</p>
            </Link>

            <div className="flex flex-col gap-2 mt-4 text-xs text-zinc-400">
                <div className="flex justify-between"><span>README:</span><span>{project.hasReadme ? '✅' : '❌'}</span></div>
                {project.subfolders.length > 0 && (
                    <div className="mt-2 border-t border-zinc-800 pt-2">
                        <p className="font-bold text-zinc-500 uppercase tracking-widest text-[10px] mb-1">Subdirectories</p>
                        {project.subfolders.map((sf: any) => (
                            <div key={sf.name} className="flex justify-between">
                                <span>{sf.name}</span>
                                <span>{sf.hasReadme ? '✅' : '❌'}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="flex flex-col gap-4 mt-auto">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                <span>Progress Score</span>
                <span className="text-zinc-400">{project.progress}%</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden border border-zinc-950/50">
                <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] rounded-full transition-all duration-1000" style={{ width: `${project.progress}%` }} />
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-zinc-800 pt-6 mt-4">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{project.status}</span>
              </div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Files: {project.fileCount}</span>
            </div>
          </div>
        ))}
        {loading && <div className="p-8 text-center text-zinc-500">Scanning filesystem...</div>}
      </div>
    </div>
  );
}
