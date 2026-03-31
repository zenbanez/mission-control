import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mission Control | Zen3",
  description: "Autonomous Agent Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <head>
        <meta name="referrer" content="no-referrer" />
        <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
        <style dangerouslySetInnerHTML={{ __html: `
          @theme {
            --color-emerald-500: #10b981;
            --color-zinc-50: #fafafa;
            --color-zinc-400: #a1a1aa;
            --color-zinc-500: #71717a;
            --color-zinc-600: #52525b;
            --color-zinc-700: #3f3f46;
            --color-zinc-800: #27272a;
            --color-zinc-900: #18181b;
            --color-zinc-950: #09090b;
          }
        ` }} />
      </head>
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 antialiased`}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 p-4 flex flex-col gap-8">
            <Link href="/" className="flex items-center gap-2 px-2 hover:opacity-80 transition-opacity">
              <div className="size-6 rounded bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="font-semibold tracking-tight text-lg">Zen3</span>
            </Link>
            
            <nav className="flex-1 flex flex-col gap-1">
              <div className="px-2 py-1 text-xs font-medium text-zinc-500 uppercase tracking-wider">Main</div>
              <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-50 text-sm font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/projects" className="flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-50 text-sm font-medium transition-colors">
                Projects
              </Link>
              <Link href="/tasks" className="flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-50 text-sm font-medium transition-colors">
                Tasks
              </Link>
              
              <div className="mt-6 px-2 py-1 text-xs font-medium text-zinc-500 uppercase tracking-wider">Intelligence</div>
              <Link href="/memory" className="flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-50 text-sm font-medium transition-colors">
                Memory
              </Link>
              <Link href="/logs" className="flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-50 text-sm font-medium transition-colors">
                Logs
              </Link>
            </nav>

            <div className="p-2 border-t border-zinc-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Status</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-zinc-950 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
