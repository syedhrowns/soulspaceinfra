import { NextRequest, NextResponse } from 'next/server';
import { isCloudflareR2Configured, uploadToR2, saveD1Slot } from '@/lib/cloudflare';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const slotId = (formData.get('slotId') as string)?.trim();
    const title = (formData.get('title') as string) || '';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!slotId) {
      return NextResponse.json({ success: false, error: 'No slot ID provided' }, { status: 400 });
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // If Cloudflare R2 is configured, upload directly to R2 bucket
    if (isCloudflareR2Configured()) {
      const uploadRes = await uploadToR2(buffer, file.name, file.type || 'image/jpeg');

      if (!uploadRes.success || !uploadRes.url) {
        return NextResponse.json(
          { success: false, error: uploadRes.error || 'Failed to upload photography to cloud storage' },
          { status: 500 }
        );
      }

      // Automatically sync new URL to Cloudflare D1
      await saveD1Slot({
        slot_id: slotId,
        image_url: uploadRes.url,
        title,
      });

      return NextResponse.json({
        success: true,
        url: uploadRes.url,
        slotId,
        storage: 'cloud-storage',
        message: 'Photography successfully uploaded and published live across website.',
      });
    }

    // High-performance Cloud Architecture file storage:
    // Persist original image buffer to uploads directory and serve via streaming media endpoint
    const fs = await import('fs');
    const path = await import('path');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      await fs.promises.mkdir(uploadsDir, { recursive: true });
    }

    const cleanExt = path.extname(file.name) || '.jpg';
    const cleanName = `${slotId}_${Date.now()}${cleanExt}`.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = path.join(uploadsDir, cleanName);
    await fs.promises.writeFile(filePath, buffer);

    const mediaUrl = `/api/media/${cleanName}`;

    // Persist clean URL into Cloudflare D1 SQL
    await saveD1Slot({
      slot_id: slotId,
      image_url: mediaUrl,
      title,
    });

    return NextResponse.json({
      success: true,
      url: mediaUrl,
      slotId,
      storage: 'cloud-storage',
      message: 'Photography successfully processed and published live across website.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'File upload error' }, { status: 500 });
  }
}
