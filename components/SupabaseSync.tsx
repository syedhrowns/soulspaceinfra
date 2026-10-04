'use client';

import { useEffect } from 'react';
import { fetchAllSlots, isSupabaseConfigured } from '@/lib/supabase';
import { saveClientImage, getClientSavedImage } from '@/lib/slots';

/**
 * Universal Cloud Sync Component:
 * Runs silently on initial mount. Syncs dynamic picture slots from Cloudflare D1
 * (5 GB Free SQL) or Supabase (Free Tier) to keep all client views 100% updated in real-time.
 */
export function SupabaseSync() {
  useEffect(() => {
    let isMounted = true;

    async function syncData() {
      // 1. Try Cloudflare D1 via API
      try {
        const d1Res = await fetch('/api/admin/d1?action=slots');
        if (d1Res.ok) {
          const d1Json = await d1Res.json();
          if (d1Json.success && d1Json.slots && Object.keys(d1Json.slots).length > 0) {
            Object.entries(d1Json.slots).forEach(([slotId, record]: [string, any]) => {
              if (record.image_url) {
                saveClientImage(slotId, record.image_url);
              }
            });
            window.dispatchEvent(new CustomEvent('soulspace-image-updated'));
            return; // Successfully synced from D1
          }
        }
      } catch {
        // Continue to fallback
      }

      // 2. Fallback to Supabase if configured
      if (isSupabaseConfigured()) {
        try {
          const slotsMap = await fetchAllSlots();
          if (!isMounted) return;

          Object.entries(slotsMap).forEach(([slotId, record]) => {
            if (record.image_url) {
              const current = getClientSavedImage(slotId);
              if (current !== record.image_url) {
                saveClientImage(slotId, record.image_url);
              }
            }
          });
        } catch {
          // Silently catch network or offline errors
        }
      }
    }

    syncData();

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}
