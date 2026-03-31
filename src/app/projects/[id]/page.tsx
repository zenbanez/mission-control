'use client';
import { use, useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, FileText, Folder, Clock, Hash, Layout } from 'lucide-react';

function ProjectContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subpath = searchParams.get('path') || '';
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/projects/${id}?path=${encodeURIComponent(subpath)}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(d => {
        setData(d.project);
        setLoading(false);
      });
  }, [id, subpath]);

  const navigateTo = (newPath: string) => {
    router.push(`/projects/${id}?path=${encodeURIComponent(newPath)}`);
  };

  const goBack = () => {
    const parts = subpath.split('/').filter(Boolean);
    parts.pop();
    navigateTo(parts.join('/'));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-sm font-medium text-zinc-500 italic">Scanning project...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-zinc-500 flex flex-col gap-4">
        <span>Item not found.</span>
        <Link href="/projects" className="text-emerald-500 hover:underline flex items-center justify-center gap-2">
          <ChevronLeft size={16} /> Return to Portfolio
        </Link>
      </div>
    );
  }

  const pathParts = subpath.split('/').filter(Boolean);

  if (data.isFile) {
    return (
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-zinc-900 pb-8">
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
             <Link href="/projects" className="hover:text-zinc-200 transition-colors">Portfolio</Link>
             <span>/</span>
             <Link href={`/projects/${id}`} className="hover:text-zinc-200 transition-colors">{id}</Link>
             {pathParts.slice(0, -1).map((part, idx) => (
               <div key={idx} className="flex items-center gap-4">
                  <span>/</span>
                  <button 
                    onClick={() => navigateTo(pathParts.slice(0, idx + 1).join('/'))}
                    className="hover:text-zinc-200 transition-colors"
                  >
                    {part}
                  </button>
               </div>
             ))}
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-zinc-50 flex items-center gap-3">
              <FileText className="text-emerald-500" size={24} />
              {data.name}
            </h1>
            <button 
              onClick={goBack}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-50 hover:border-zinc-700 transition-all flex items-center gap-2"
            >
              <ChevronLeft size={14} /> Back
            </button>
          </div>
        </header>

        <article className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 lg:p-12 shadow-xl">
          {data.content ? (
            <div className="markdown-content prose prose-invert max-w-none prose-emerald prose-sm lg:prose-base">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {data.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-24 text-zinc-600">
              <Hash size={48} className="opacity-20" />
              <p className="italic text-sm uppercase tracking-widest">No preview available for this file type.</p>
            </div>
          )}
        </article>
        
        <style jsx global>{`
          .markdown-content h1 { @apply text-2xl font-bold mb-6 text-zinc-50 border-b border-zinc-800 pb-4 mt-8 first:mt-0; }
          .markdown-content h2 { @apply text-xl font-bold mb-4 text-zinc-200 mt-8; }
          .markdown-content h3 { @apply text-lg font-bold mb-3 text-zinc-300 mt-6; }
          .markdown-content p { @apply text-zinc-400 leading-relaxed mb-4; }
          .markdown-content ul { @apply list-disc list-inside mb-4 text-zinc-400 gap-2 flex flex-col; }
          .markdown-content li { @apply leading-relaxed; }
          .markdown-content code { @apply bg-zinc-800/50 px-1.5 py-0.5 rounded font-mono text-emerald-400 text-xs; }
          .markdown-content pre { @apply bg-zinc-950 p-6 rounded-xl border border-zinc-800 my-6 overflow-x-auto; }
          .markdown-content pre code { @apply bg-transparent p-0 text-zinc-300; }
          .markdown-content a { @apply text-emerald-500 hover:underline; }
          .markdown-content blockquote { @apply border-l-4 border-emerald-500/30 pl-6 italic text-zinc-500 my-6; }
          .markdown-content hr { @apply border-zinc-800 my-10; }
          .markdown-content table { @apply w-full border-collapse mb-6; }
          .markdown-content th { @apply text-left border-b border-zinc-800 p-3 text-xs font-bold uppercase tracking-widest text-zinc-500; }
          .markdown-content td { @apply p-3 border-b border-zinc-900 text-sm text-zinc-400; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-1 border-b border-zinc-900 pb-8">
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
           <Link href="/projects" className="hover:text-zinc-200 transition-colors">Portfolio</Link>
           <span>/</span>
           <Link href={`/projects/${id}`} className={`transition-colors ${subpath === '' ? 'text-zinc-50' : 'hover:text-zinc-200'}`}>
             {id}
           </Link>
           {pathParts.map((part, idx) => (
             <div key={idx} className="flex items-center gap-4">
                <span>/</span>
                <button 
                  onClick={() => navigateTo(pathParts.slice(0, idx + 1).join('/'))}
                  className={`transition-colors ${idx === pathParts.length - 1 ? 'text-zinc-50' : 'hover:text-zinc-200'}`}
                >
                  {part}
                </button>
             </div>
           ))}
        </div>
        <h1 className="text-2xl font-bold text-zinc-50 mt-4 flex items-center gap-3">
          <Layout size={24} className="text-emerald-500" />
          {id}
        </h1>
        <p className="text-zinc-500 font-medium mt-2">Deep-dive project explorer.</p>
      </header>

      {/* Directory Cards (Clickable Subfolders) */}
      {data.directories && data.directories.length > 0 && (
        <section className="flex flex-col gap-6">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Folders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.directories.map((dir: any, i: number) => (
              <button
                key={i}
                onClick={() => navigateTo(dir.path)}
                className="group flex flex-col gap-4 p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 hover:bg-zinc-900/60 transition-all text-left"
              >
                <Folder className="text-zinc-500 group-hover:text-emerald-500 group-hover:scale-110 transition-all" size={32} />
                <div className="flex flex-col">
                   <span className="text-sm font-semibold text-zinc-200 truncate">{dir.name}</span>
                   <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mt-1">Directory</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2/3) - Files and Stats */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          {/* Summary Section */}
          <section className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl flex flex-col gap-4">
             <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">
               {subpath === '' ? 'Overview' : `${pathParts[pathParts.length-1]} Overview`}
             </h2>
             <div className="text-sm text-zinc-300 leading-relaxed font-medium markdown-content prose-sm prose-emerald prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {data.summary}
                </ReactMarkdown>
             </div>
             {subpath === '' && (
               <div className="flex flex-col gap-3 mt-4">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                    <span>Heuristic Progress</span>
                    <span className="text-zinc-400">{data.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden">
                    <div className={`h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]`} style={{ width: `${data.progress}%` }} />
                  </div>
               </div>
             )}
          </section>

          {/* File Browser */}
          <section className="flex flex-col gap-6">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Files</h2>
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800/50 shadow-sm">
              {data.files.map((file: any, i: number) => (
                <button 
                  key={i} 
                  onClick={() => navigateTo(file.path)}
                  className="w-full p-4 flex items-center gap-4 hover:bg-zinc-900/50 transition-colors group text-left"
                >
                   <FileText size={18} className="text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                   <div className="flex flex-col">
                     <span className="text-sm text-zinc-300 font-mono font-medium">{file.name}</span>
                   </div>
                   <div className="ml-auto flex items-center gap-4">
                      <span className="text-[10px] text-zinc-700 font-mono uppercase">file</span>
                   </div>
                </button>
              ))}
              {data.files.length === 0 && (
                <div className="p-8 text-center text-xs text-zinc-600 italic uppercase tracking-widest">No files in this directory.</div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column (1/3) - Metadata & Full Readme */}
        <div className="flex flex-col gap-8">
           <section className="flex flex-col gap-4">
             <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Metadata</h2>
             <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4 shadow-sm">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-zinc-600" />
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Last Updated</span>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono pl-6">{new Date(data.updatedAt).toLocaleString()}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-zinc-600" />
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Current Path</span>
                  </div>
                  <span className="text-[10px] text-zinc-600 font-mono truncate pl-6">/projects/{id}/{subpath}</span>
                </div>
             </div>
           </section>

           {data.fullReadme && (
             <section className="flex flex-col gap-4">
               <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Readme</h2>
               <div className="bg-zinc-900/10 border border-zinc-800/50 rounded-xl p-6 shadow-inner">
                 <div className="max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                   <div className="markdown-content prose prose-invert prose-emerald prose-sm">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {data.fullReadme}
                      </ReactMarkdown>
                   </div>
                 </div>
               </div>
             </section>
           )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectContent id={id} />
    </Suspense>
  );
}
