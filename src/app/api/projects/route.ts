import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const workspacePath = '/home/node/.openclaw/workspace/projects';
    const items = fs.readdirSync(workspacePath, { withFileTypes: true });
    
    const projects = items
      .filter(item => item.isDirectory())
      .map(dir => {
        const dirPath = path.join(workspacePath, dir.name);
        const stats = fs.statSync(dirPath);
        
        // Include subfolders in active project scope
        const subfolders = fs.readdirSync(dirPath, { withFileTypes: true })
            .filter(i => i.isDirectory())
            .map(i => {
                const subPath = path.join(dirPath, i.name);
                const hasReadme = fs.existsSync(path.join(subPath, 'README.md'));
                return {
                    name: i.name,
                    hasReadme
                };
            });
        
        const hasReadme = fs.existsSync(path.join(dirPath, 'README.md'));
        const files = fs.readdirSync(dirPath);
        
        return {
          id: dir.name,
          name: dir.name.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          path: dirPath,
          hasReadme,
          subfolders,
          updatedAt: stats.mtime,
          fileCount: files.length,
          status: 'Active',
          progress: Math.min(files.length * 10, 100)
        };
      });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json({ error: 'Failed to read workspace' }, { status: 500 });
  }
}
