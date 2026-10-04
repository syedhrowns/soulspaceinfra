-- ==============================================================================
-- SOUL SPACE INFRASTRUCTURE — SUPABASE DATABASE & STORAGE SCHEMA
-- Free Tier Compatible (PostgreSQL 15+)
-- ==============================================================================
-- Run this script in your Supabase Project Dashboard -> SQL Editor -> New Query -> Run

-- 1. Create DYNAMIC PICTURE SLOTS table
CREATE TABLE IF NOT EXISTS public.slots (
    slot_id TEXT PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT DEFAULT '',
    caption TEXT DEFAULT '',
    project_id TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;

-- Allow public read access to slots
CREATE POLICY "Public Read Slots" ON public.slots
    FOR SELECT USING (true);

-- Allow write access to slots
CREATE POLICY "Public Insert/Update Slots" ON public.slots
    FOR ALL USING (true);


-- 2. Create CUSTOMER INQUIRIES & LEADS table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    docket_number TEXT,
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
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit an inquiry
CREATE POLICY "Public Submit Inquiries" ON public.inquiries
    FOR INSERT WITH CHECK (true);

-- Allow reading inquiries
CREATE POLICY "Read Inquiries" ON public.inquiries
    FOR SELECT USING (true);


-- 3. Create SITE SETTINGS table (Contact, Phones, Address)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read of site settings
CREATE POLICY "Public Read Settings" ON public.site_settings
    FOR SELECT USING (true);

-- Allow update of site settings
CREATE POLICY "Allow Update Settings" ON public.site_settings
    FOR ALL USING (true);

-- Insert initial default settings
INSERT INTO public.site_settings (id, settings)
VALUES (
    'main',
    '{
        "primary_phone": "+91 96777 71331",
        "secondary_phone": "+91 91591 33331",
        "whatsapp_number": "+91 91591 33331",
        "email": "soulspaceinfrastructure@gmail.com",
        "office_address": "No 5/2, Hindustan Avenue, Nava India Road, Sowripalayam Post, Coimbatore - 641028",
        "instagram_url": "https://www.instagram.com/soul.space.projects/",
        "facebook_url": "https://www.facebook.com/soulspaceinfra"
    }'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- 4. Storage Bucket Setup
-- Note: You can create a bucket named 'project-media' in Supabase -> Storage -> New Bucket
-- Set 'Public bucket' to ON so images can be viewed on your website.
