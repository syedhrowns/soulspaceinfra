import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// ==============================================================================
// CLOUDFLARE D1 (5 GB Free SQL DB) & R2 (10 GB Free Storage, $0 Egress)
// Pure Free Tier Architecture for Soul Space Infrastructure
// ==============================================================================

export interface SlotRecord {
  slot_id: string;
  image_url: string;
  title?: string;
  caption?: string;
  project_id?: string;
  updated_at?: string;
}

export interface InquiryRecord {
  id?: string;
  docket_number?: string;
  name: string;
  email: string;
  phone: string;
  project_id?: string;
  project_title?: string;
  typology?: string;
  unit_preference?: string;
  target_year?: string;
  notes?: string;
  status?: 'new' | 'contacted' | 'site_visit' | 'closed';
  created_at?: string;
}

export interface SiteSettings {
  primary_phone: string;
  secondary_phone: string;
  whatsapp_number: string;
  email: string;
  office_address: string;
  instagram_url: string;
  facebook_url: string;
  owner_name?: string;
  owner_title?: string;
  master_passkey?: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  primary_phone: '+91 96777 71331',
  secondary_phone: '+91 91591 33331',
  whatsapp_number: '+91 91591 33331',
  email: 'soulspaceinfrastructure@gmail.com',
  office_address: 'No 5/2, Hindustan Avenue, Nava India Road, Sowripalayam Post, Coimbatore - 641028',
  instagram_url: 'https://www.instagram.com/soul.space.projects/',
  facebook_url: 'https://www.facebook.com/soulspaceinfra',
  owner_name: 'Managing Director',
  owner_title: 'Director of Soul Space Infrastructure',
  master_passkey: 'soulspace2026',
};

// Check if Cloudflare D1 environment variables are present
export function isCloudflareD1Configured(): boolean {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const apiToken = process.env.CLOUDFLARE_API_TOKEN?.trim();
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID?.trim();
  return Boolean(accountId && apiToken && databaseId);
}

// Check if Cloudflare R2 environment variables are present
export function isCloudflareR2Configured(): boolean {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY?.trim();
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME?.trim() || 'soulspace-media';
  return Boolean(accountId && accessKeyId && secretAccessKey && bucketName);
}

// Check if either or both are ready
export function isCloudflareConfigured(): boolean {
  return isCloudflareD1Configured() || isCloudflareR2Configured();
}

/**
 * Execute SQL against Cloudflare D1 via official REST API
 * Free tier includes 5 GB storage, 5 million reads/day, 100k writes/day, no pause/sleep.
 */
export async function queryD1<T = any>(
  sql: string,
  params: any[] = []
): Promise<{ success: boolean; results: T[]; error?: string }> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const apiToken = process.env.CLOUDFLARE_API_TOKEN?.trim();
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID?.trim();

  if (!accountId || !apiToken || !databaseId) {
    return {
      success: false,
      results: [],
      error: 'Cloud database credentials not configured in environment',
    };
  }

  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
      cache: 'no-store',
    });

    const json = await res.json();
    if (!json.success) {
      const errMsg = json.errors?.[0]?.message || 'Database query execution failed';
      return { success: false, results: [], error: errMsg };
    }

    const results = (json.result?.[0]?.results || []) as T[];
    return { success: true, results };
  } catch (err: any) {
    return { success: false, results: [], error: err.message || 'Network error communicating with database' };
  }
}

/**
 * Cloudflare D1 SQL Schema Initialization
 */
export const D1_SQL_SCHEMA = `-- Run in Cloudflare Dashboard -> Workers & Pages -> D1 -> soulspace-db -> Console
-- OR click "Initialize D1 Schema" in the Soul Space Admin Panel (/admin)

CREATE TABLE IF NOT EXISTS slots (
  slot_id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT DEFAULT '',
  caption TEXT DEFAULT '',
  project_id TEXT DEFAULT '',
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  docket_number TEXT DEFAULT '',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  project_id TEXT DEFAULT '',
  project_title TEXT DEFAULT '',
  typology TEXT DEFAULT '',
  unit_preference TEXT DEFAULT '',
  target_year TEXT DEFAULT '2026',
  notes TEXT DEFAULT '',
  status TEXT DEFAULT 'new',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  settings_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`;

/**
 * Run schema initialization against Cloudflare D1
 */
export async function initD1Tables(): Promise<{ success: boolean; error?: string }> {
  const statements = [
    `CREATE TABLE IF NOT EXISTS slots (
      slot_id TEXT PRIMARY KEY,
      image_url TEXT NOT NULL,
      title TEXT DEFAULT '',
      caption TEXT DEFAULT '',
      project_id TEXT DEFAULT '',
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      docket_number TEXT DEFAULT '',
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      project_id TEXT DEFAULT '',
      project_title TEXT DEFAULT '',
      typology TEXT DEFAULT '',
      unit_preference TEXT DEFAULT '',
      target_year TEXT DEFAULT '2026',
      notes TEXT DEFAULT '',
      status TEXT DEFAULT 'new',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS site_settings (
      id TEXT PRIMARY KEY DEFAULT 'main',
      settings_json TEXT NOT NULL DEFAULT '{}',
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
  ];

  for (const sql of statements) {
    const res = await queryD1(sql);
    if (!res.success) {
      return { success: false, error: res.error };
    }
  }

  return { success: true };
}

// ==============================================================================
// 1. D1 PICTURE SLOTS
// ==============================================================================
export async function fetchD1Slots(): Promise<Record<string, SlotRecord>> {
  if (!isCloudflareD1Configured()) return {};

  const res = await queryD1<SlotRecord>(
    "SELECT * FROM slots WHERE image_url IS NOT NULL AND trim(image_url) != '';"
  );
  if (!res.success) {
    console.warn('Cloudflare D1 fetch slots warning:', res.error);
    return {};
  }

  const map: Record<string, SlotRecord> = {};
  res.results.forEach((row) => {
    if (row.slot_id && row.image_url) {
      map[row.slot_id] = {
        slot_id: row.slot_id,
        image_url: row.image_url,
        title: row.title,
        caption: row.caption,
        project_id: row.project_id,
        updated_at: row.updated_at,
      };
    }
  });

  return map;
}

export async function saveD1Slot(slot: SlotRecord): Promise<{ success: boolean; error?: string }> {
  if (!isCloudflareD1Configured()) {
    return { success: false, error: 'Cloud database is not configured in environment' };
  }

  if (!slot.image_url || slot.image_url.trim() === '') {
    return await queryD1('DELETE FROM slots WHERE slot_id = ?;', [slot.slot_id]);
  }

  const sql = `
    INSERT INTO slots (slot_id, image_url, title, caption, project_id, updated_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(slot_id) DO UPDATE SET
      image_url = excluded.image_url,
      title = excluded.title,
      caption = excluded.caption,
      project_id = excluded.project_id,
      updated_at = datetime('now');
  `;

  return await queryD1(sql, [
    slot.slot_id,
    slot.image_url,
    slot.title || '',
    slot.caption || '',
    slot.project_id || '',
  ]);
}

// ==============================================================================
// 2. D1 INQUIRIES & LEADS
// ==============================================================================
export async function fetchD1Inquiries(): Promise<InquiryRecord[]> {
  if (!isCloudflareD1Configured()) return [];

  const res = await queryD1<InquiryRecord>(
    'SELECT * FROM inquiries ORDER BY created_at DESC;'
  );

  if (!res.success) {
    console.warn('Cloudflare D1 fetch inquiries warning:', res.error);
    return [];
  }

  return res.results || [];
}

export async function saveD1Inquiry(
  inquiry: InquiryRecord
): Promise<{ success: boolean; error?: string }> {
  if (!isCloudflareD1Configured()) {
    return { success: true }; // Graceful fallback
  }

  const id = inquiry.id || `inq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const sql = `
    INSERT INTO inquiries (
      id, docket_number, name, email, phone,
      project_id, project_title, typology, unit_preference,
      target_year, notes, status, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', datetime('now'));
  `;

  return await queryD1(sql, [
    id,
    inquiry.docket_number || '',
    inquiry.name,
    inquiry.email,
    inquiry.phone,
    inquiry.project_id || '',
    inquiry.project_title || '',
    inquiry.typology || '',
    inquiry.unit_preference || '',
    inquiry.target_year || '2026',
    inquiry.notes || '',
  ]);
}

// ==============================================================================
// 3. D1 SITE SETTINGS
// ==============================================================================
export async function fetchD1SiteSettings(): Promise<SiteSettings> {
  if (!isCloudflareD1Configured()) return DEFAULT_SITE_SETTINGS;

  const res = await queryD1<{ id: string; settings_json: string }>(
    "SELECT * FROM site_settings WHERE id = 'main' LIMIT 1;"
  );

  if (res.success && res.results.length > 0) {
    try {
      const parsed = JSON.parse(res.results[0].settings_json);
      return { ...DEFAULT_SITE_SETTINGS, ...parsed };
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  }

  return DEFAULT_SITE_SETTINGS;
}

export async function saveD1SiteSettings(
  settings: SiteSettings
): Promise<{ success: boolean; error?: string }> {
  if (!isCloudflareD1Configured()) {
    return { success: false, error: 'Cloudflare D1 not configured' };
  }

  const sql = `
    INSERT INTO site_settings (id, settings_json, updated_at)
    VALUES ('main', ?, datetime('now'))
    ON CONFLICT(id) DO UPDATE SET
      settings_json = excluded.settings_json,
      updated_at = datetime('now');
  `;

  return await queryD1(sql, [JSON.stringify(settings)]);
}

// ==============================================================================
// 4. CLOUDFLARE R2 OBJECT STORAGE (10 GB Free, Zero Egress Fees)
// ==============================================================================
export async function uploadToR2(
  fileBuffer: Buffer | Uint8Array,
  fileName: string,
  contentType: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY?.trim();
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME?.trim() || 'soulspace-media';
  const publicDomain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN?.trim();

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return {
      success: false,
      error: 'Cloud storage credentials not configured in environment',
    };
  }

  try {
    const s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const key = `slots/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
      })
    );

    // Form public URL
    let publicUrl = '';
    if (publicDomain) {
      const cleanDomain = publicDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
      publicUrl = `https://${cleanDomain}/${key}`;
    } else {
      // Default public bucket access endpoint
      publicUrl = `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${key}`;
    }

    return { success: true, url: publicUrl };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to upload photography to cloud storage' };
  }
}
