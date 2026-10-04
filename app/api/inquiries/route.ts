import { NextRequest, NextResponse } from 'next/server';
import { saveD1Inquiry } from '@/lib/cloudflare';
import { submitInquiry as submitSupabaseInquiry } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Persist to Cloudflare D1 (5 GB Free SQL)
    await saveD1Inquiry(body).catch((err) => {
      console.warn('Cloudflare D1 inquiry save warning:', err);
    });

    // 2. Persist to Supabase if configured
    await submitSupabaseInquiry(body).catch((err) => {
      console.warn('Supabase inquiry save warning:', err);
    });

    return NextResponse.json({ success: true, message: 'Inquiry received and logged.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
