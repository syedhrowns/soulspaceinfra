import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DEFAULT_ANNOUNCEMENT, AnnouncementSettings } from '@/lib/projectContent';

const CONFIG_PATH = path.join(process.cwd(), 'data', 'announcementConfig.json');

export async function GET() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      return NextResponse.json(parsed);
    }
  } catch (err) {
    console.error('Failed to read announcement config:', err);
  }
  return NextResponse.json({ ...DEFAULT_ANNOUNCEMENT, enabled: false });
}

export async function POST(req: Request) {
  try {
    const body: AnnouncementSettings = await req.json();
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ success: true, settings: body });
  } catch (err) {
    console.error('Failed to save announcement config:', err);
    return NextResponse.json({ success: false, error: 'Failed to write config' }, { status: 500 });
  }
}
