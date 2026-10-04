import { NextRequest, NextResponse } from 'next/server';
import {
  isCloudflareD1Configured,
  isCloudflareR2Configured,
  queryD1,
  initD1Tables,
  fetchD1Slots,
  saveD1Slot,
  fetchD1Inquiries,
  saveD1Inquiry,
  fetchD1SiteSettings,
  saveD1SiteSettings,
} from '@/lib/cloudflare';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    if (action === 'status') {
      const d1Configured = isCloudflareD1Configured();
      const r2Configured = isCloudflareR2Configured();

      let d1Connected = false;
      let d1Error: string | undefined;

      if (d1Configured) {
        const testRes = await queryD1('SELECT 1 as ping;');
        if (testRes.success) {
          d1Connected = true;
        } else {
          d1Error = testRes.error;
        }
      }

      return NextResponse.json({
        success: true,
        d1Configured,
        d1Connected,
        d1Error,
        r2Configured,
        accountIdSet: Boolean(process.env.CLOUDFLARE_ACCOUNT_ID?.trim()),
        databaseIdSet: Boolean(process.env.CLOUDFLARE_D1_DATABASE_ID?.trim()),
        r2Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME?.trim() || 'soulspace-media',
      });
    }

    if (action === 'slots') {
      const slots = await fetchD1Slots();
      return NextResponse.json({ success: true, slots });
    }

    if (action === 'inquiries') {
      const inquiries = await fetchD1Inquiries();
      return NextResponse.json({ success: true, inquiries });
    }

    if (action === 'settings') {
      const settings = await fetchD1SiteSettings();
      return NextResponse.json({ success: true, settings });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    if (action === 'init_schema') {
      const res = await initD1Tables();
      return NextResponse.json(res);
    }

    if (action === 'save_slot') {
      const res = await saveD1Slot(payload);
      return NextResponse.json(res);
    }

    if (action === 'save_settings') {
      const res = await saveD1SiteSettings(payload);
      return NextResponse.json(res);
    }

    if (action === 'submit_inquiry') {
      const res = await saveD1Inquiry(payload);
      return NextResponse.json(res);
    }

    return NextResponse.json({ error: 'Unknown POST action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
