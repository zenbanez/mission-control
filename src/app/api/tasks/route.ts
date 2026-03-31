import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const taskFile = '/home/node/.openclaw/workspace/tasks/master-tasks.md';
    if (!fs.existsSync(taskFile)) {
      return NextResponse.json({ tasks: [] });
    }
    
    const content = fs.readFileSync(taskFile, 'utf8');
    const lines = content.split('\n');
    
    const tasks = lines
      .filter(line => line.trim().startsWith('- [ ]') || line.trim().startsWith('- [x]'))
      .map((line, idx) => {
        const isCompleted = line.includes('[x]');
        const text = line.replace('- [x]', '').replace('- [ ]', '').trim();
        const priority = line.toLowerCase().includes('high priority') ? 'high' : 'medium';
        
        return {
          id: idx,
          text,
          isCompleted,
          priority
        };
      });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ error: 'Failed to read tasks file' }, { status: 500 });
  }
}
