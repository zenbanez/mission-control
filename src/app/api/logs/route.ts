import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const memoryDir = '/home/node/.openclaw/workspace/memory';
    if (!fs.existsSync(memoryDir)) {
      return NextResponse.json({ logs: [] });
    }

    const files = fs.readdirSync(memoryDir)
      .filter(file => file.endsWith('.md'))
      .sort()
      .reverse()
      .slice(0, 5); // Get last 5 days

    const logs = files.map(file => {
      const filePath = path.join(memoryDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const stats = fs.statSync(filePath);
      
      // Extract first few items from Activity Log
      const activityMatch = content.match(/## 📝 Activity Log([\s\S]*?)(?=##|$)/);
      const items = activityMatch 
        ? activityMatch[1].trim().split('\n').filter(l => l.startsWith('-')).slice(0, 3)
        : [];

      return {
        date: file.replace('.md', ''),
        items: items.map(i => i.replace(/^- \*\*\d{2}:\d{2} UTC:\*\* /, '').replace(/^- /, '').trim()),
        updatedAt: stats.mtime
      };
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Failed to fetch memory logs:', error);
    return NextResponse.json({ error: 'Failed to read memory' }, { status: 500 });
  }
}
