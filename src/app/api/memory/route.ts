import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const memoryFile = '/home/node/.openclaw/workspace/MEMORY.md';
    if (!fs.existsSync(memoryFile)) {
      return NextResponse.json({ sections: [] });
    }
    
    const content = fs.readFileSync(memoryFile, 'utf8');
    const sections = [];
    
    // Simple header-based split
    const parts = content.split('## ');
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      const lines = part.split('\n');
      const title = lines[0].trim();
      const body = lines.slice(1).join('\n').trim();
      
      sections.push({
        title,
        body: body.split('\n').filter(l => l.startsWith('-')).slice(0, 3) // Get first 3 bullets
      });
    }

    return NextResponse.json({ sections });
  } catch (error) {
    console.error('Failed to fetch memory:', error);
    return NextResponse.json({ error: 'Failed to read memory file' }, { status: 500 });
  }
}
