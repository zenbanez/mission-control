import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const subpath = searchParams.get('path') || '';
    
    const workspacePath = '/home/node/.openclaw/workspace/projects';
    const projectRoot = path.join(workspacePath, id);
    const currentPath = path.join(projectRoot, subpath);
    
    if (!fs.existsSync(currentPath)) {
      return NextResponse.json({ error: 'Project path not found' }, { status: 404 });
    }

    const stats = fs.statSync(currentPath);
    
    // If currentPath is a file, read its content
    if (stats.isFile()) {
      let fileContent = "";
      if (currentPath.endsWith('.md')) {
        fileContent = fs.readFileSync(currentPath, 'utf8');
      }
      return NextResponse.json({ 
        project: {
          id,
          name: path.basename(currentPath),
          subpath,
          isFile: true,
          content: fileContent,
          updatedAt: stats.mtime
        }
      });
    }

    // List only direct children of the current path
    const items = fs.readdirSync(currentPath, { withFileTypes: true });
    let files: any[] = [];
    let directories: any[] = [];
    
    for (const item of items) {
      if (item.name === 'node_modules' || item.name.startsWith('.')) continue;
      
      const fullPath = path.join(currentPath, item.name);
      const relativePath = path.join(subpath, item.name);
      
      if (item.isDirectory()) {
        directories.push({ name: item.name, type: 'directory', path: relativePath });
      } else {
        files.push({ name: item.name, type: 'file', path: relativePath });
      }
    }

    // Attempt to find project summary from README or project-specific MD
    let summary = "No summary found.";
    let fullReadme = "";
    const readmePaths = ['README.md', 'summary.md', `${id}.md`, 'setup.md'];
    
    const extractSummary = (content: string) => {
        // Try ## Overview first
        let match = content.match(/## Overview([\s\S]*?)(?=##|$)/i);
        if (match) return match[1].trim();
        
        // Try ## 📝 Project Summary
        match = content.match(/## 📝 Project Summary([\s\S]*?)(?=##|$)/i);
        if (match) return match[1].trim();
        
        // Fallback to first paragraph (skipping the main title)
        return content.split('\n\n')[0].replace(/^# .*\n/, '').trim();
    };

    for (const name of readmePaths) {
      const p = path.join(currentPath, name);
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        fullReadme = content;
        summary = extractSummary(content);
        break;
      }
    }

    // If no summary in current directory, try project root
    if ((summary === "No summary found." || summary === "") && subpath !== '') {
        for (const name of readmePaths) {
            const p = path.join(projectRoot, name);
            if (fs.existsSync(p)) {
              const content = fs.readFileSync(p, 'utf8');
              summary = extractSummary(content);
              break;
            }
        }
    }

    // Heuristic progress
    const progress = Math.min((files.length + directories.length) * 10, 100);

    return NextResponse.json({ 
      project: {
        id,
        name: id.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        subpath,
        summary,
        fullReadme,
        files,
        directories,
        progress,
        updatedAt: stats.mtime
      }
    });
  } catch (error) {
    console.error('Failed to fetch project details:', error);
    return NextResponse.json({ error: 'Failed to read project details' }, { status: 500 });
  }
}
