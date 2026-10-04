import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey &&
    supabaseAnonKey.length > 20
  );
};

// Safe Supabase client initialization (won't crash if env vars are unset)
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==============================================================================
// 1. DYNAMIC PICTURE SLOTS
// ==============================================================================
export interface SlotRecord {
  slot_id: string;
  image_url: string;
  title?: string;
  caption?: string;
  project_id?: string;
  updated_at?: string;
}

export async function fetchAllSlots(): Promise<Record<string, SlotRecord>> {
  if (!supabase) return {};

  try {
    const { data, error } = await supabase
      .from('slots')
      .select('*');

    if (error) {
      console.warn('Supabase fetch slots error:', error.message);
      return {};
    }

    const map: Record<string, SlotRecord> = {};
    (data || []).forEach((row: any) => {
      map[row.slot_id] = {
        slot_id: row.slot_id,
        image_url: row.image_url,
        title: row.title,
        caption: row.caption,
        project_id: row.project_id,
        updated_at: row.updated_at,
      };
    });
    return map;
  } catch (err) {
    console.warn('Failed to fetch slots from Supabase:', err);
    return {};
  }
}

export async function saveSlot(slot: SlotRecord): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase is not configured yet. Add your URL & Key in .env.local' };
  }

  try {
    const { error } = await supabase
      .from('slots')
      .upsert(
        {
          slot_id: slot.slot_id,
          image_url: slot.image_url,
          title: slot.title || '',
          caption: slot.caption || '',
          project_id: slot.project_id || '',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slot_id' }
      );

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save slot' };
  }
}

export async function uploadMediaFile(
  file: File,
  folder: string = 'slots'
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase storage is not configured' };
  }

  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${folder}/${Date.now()}_${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from('project-media')
      .getPublicUrl(filePath);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (err: any) {
    return { success: false, error: err.message || 'File upload failed' };
  }
}

// ==============================================================================
// 2. INQUIRIES & LEADS
// ==============================================================================
export interface InquiryRecord {
  id?: string;
  name: string;
  email: string;
  phone: string;
  project_id?: string;
  project_title?: string;
  typology?: string;
  unit_preference?: string;
  target_year?: string;
  notes?: string;
  docket_number?: string;
  status?: 'new' | 'contacted' | 'site_visit' | 'closed';
  created_at?: string;
}

export async function submitInquiry(
  inquiry: InquiryRecord
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    // If Supabase is not connected, return graceful success so user experience doesn't break
    return { success: true };
  }

  try {
    const { error } = await supabase.from('inquiries').insert([
      {
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        project_id: inquiry.project_id || '',
        project_title: inquiry.project_title || '',
        typology: inquiry.typology || '',
        unit_preference: inquiry.unit_preference || '',
        target_year: inquiry.target_year || '2026',
        notes: inquiry.notes || '',
        docket_number: inquiry.docket_number || '',
        status: 'new',
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.warn('Inquiry db submission warning:', err.message);
    return { success: false, error: err.message };
  }
}

export async function fetchInquiries(): Promise<InquiryRecord[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Fetch inquiries error:', err);
    return [];
  }
}

// ==============================================================================
// 3. SITE SETTINGS & CONTACT
// ==============================================================================
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

export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (!supabase) return DEFAULT_SITE_SETTINGS;

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'main')
      .single();

    if (error || !data) return DEFAULT_SITE_SETTINGS;
    return { ...DEFAULT_SITE_SETTINGS, ...data.settings };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function saveSiteSettings(
  settings: SiteSettings
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase is not connected' };
  }

  try {
    const { error } = await supabase.from('site_settings').upsert({
      id: 'main',
      settings,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
