/**
 * Standardized Lowercase Serial Number Generator for Picture Slots
 * Format: [project_name]_img_[slot_number] (all lowercase)
 */
export function getProjectSlotId(projectId: string, index: number = 1): string {
  const normalized = projectId.toLowerCase();
  
  let prefix = 'project';
  if (normalized.includes('mystic')) {
    prefix = 'mystic';
  } else if (normalized.includes('aurum')) {
    prefix = 'aurum';
  } else if (normalized.includes('arbor') || normalized.includes('abv')) {
    prefix = 'abvarbor';
  } else if (normalized.includes('dotcom')) {
    prefix = 'dotcom';
  } else if (normalized.includes('uptown')) {
    prefix = 'uptown';
  } else {
    prefix = projectId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  }

  const slotNum = String(index).padStart(2, '0');
  return `${prefix}_img_${slotNum}`;
}

/**
 * Verified Cloudinary / Local Image Registry provided by the user.
 * Automatically resolves all dynamic picture slots across desktop and mobile.
 *
 * For Aurum Villas, upload through the browser UI or map public asset URLs:
 * - aurum_img_plan_north_ground : North Facing - Ground Floor Plan (1,566 Sq.Ft.)
 * - aurum_img_plan_north_first  : North Facing - First Floor Plan (1,376 Sq.Ft.)
 * - aurum_img_plan_east_ground  : East Facing - Ground Floor Plan (1,016 Sq.Ft.)
 * - aurum_img_plan_east_first   : East Facing - First Floor Plan (1,016 Sq.Ft.)
 * - aurum_img_plan_west_ground  : West Facing - Ground Floor Plan (1,449 Sq.Ft.)
 * - aurum_img_plan_west_first   : West Facing - First Floor Plan (1,322 Sq.Ft.)
 * - aurum_img_plan_south_ground : South Facing - Ground Floor Plan (1,462 Sq.Ft.)
 * - aurum_img_plan_south_first  : South Facing - First Floor Plan (1,241 Sq.Ft.)
 */
export const DEFAULT_SLOT_IMAGES: Record<string, string> = {
  // ABV Arbor
  abvarbor_img_01: '/uploads/abvarbor_img_01_1791092471599.webp',
  abvarbor_img_02: '/uploads/abvarbor_img_02_1791092488449.webp',
  abvarbor_img_03: '/uploads/abvarbor_img_03_1791092546689.webp',
  abvarbor_img_04: '/uploads/abvarbor_img_04_1791092558312.webp',
  abvarbor_img_05: '/uploads/abvarbor_img_05_1791092588801.webp',
  abvarbor_img_06: '/uploads/abvarbor_img_06_1791092648028.webp',
  abvarbor_img_07: '/uploads/abvarbor_img_07_1791092680486.webp',
  abvarbor_img_08: '/uploads/abvarbor_img_08_1791092690650.webp',
  abvarbor_img_09: '/uploads/abvarbor_img_09_1791092707079.webp',
  abvarbor_img_10: '/uploads/abvarbor_img_10_1791092716273.webp',
  abvarbor_img_11: '/uploads/abvarbor_img_11_1791092722908.webp',
  abvarbor_img_12: '/uploads/abvarbor_img_12_1791092733744.webp',
  abvarbor_img_13: '/uploads/abvarbor_img_13_1791092746931.webp',
  abvarbor_img_15: '/uploads/abvarbor_img_15_1791092793820.webp',
  abvarbor_img_16: '/uploads/abvarbor_img_16_1791092802398.webp',
  abvarbor_img_terrace: '/uploads/abvarbor_img_16_1791092802398.webp',

  // Aurum Villas
  aurum_img_01: '/uploads/aurum_img_01_1791092221872.webp',
  aurum_img_02: '/uploads/aurum_img_02_1791092241009.webp',
  aurum_img_03: '/uploads/aurum_img_03_1791092249285.webp',
  aurum_img_clubhouse: '/uploads/aurum_img_clubhouse_1791014028416.png',
  aurum_img_gym: '/uploads/aurum_img_gym_1791014033327.png',
  aurum_img_living: '/uploads/aurum_img_living_1791092297858.webp',
  aurum_img_private: '/uploads/aurum_img_private_1791092280181.webp',
  aurum_img_richness: '/uploads/aurum_img_richness_1791092263457.webp',
  aurum_img_plan_north_ground: '/uploads/aurum_img_plan_north_ground_1791092313228.webp',
  aurum_img_plan_north_first: '/uploads/aurum_img_plan_north_first_1791092327665.webp',
  aurum_img_plan_east_ground: '/uploads/aurum_img_plan_east_ground_1791092346301.webp',
  aurum_img_plan_east_first: '/uploads/aurum_img_plan_east_first_1791092357893.webp',
  aurum_img_plan_west_ground: '/uploads/aurum_img_plan_west_ground_1791092381933.webp',
  aurum_img_plan_west_first: '/uploads/aurum_img_plan_west_first_1791092411546.webp',
  aurum_img_plan_south_ground: '/uploads/aurum_img_plan_south_ground_1791092432880.webp',
  aurum_img_plan_south_first: '/uploads/aurum_img_plan_south_first_1791092444140.webp',

  // Dotcom Workspaces
  dotcom_img_01: '/uploads/dotcom_img_01_1791092835486.webp',
  dotcom_img_02: '/uploads/dotcom_img_02_1791092845881.webp',
  dotcom_img_03: '/uploads/dotcom_img_03_1791092853676.webp',
  dotcom_img_04: '/uploads/dotcom_img_04_1791092888648.webp',
  dotcom_img_05: '/uploads/dotcom_img_05_1791092899359.webp',
  dotcom_img_06: '/uploads/dotcom_img_06_1791092905467.webp',
  dotcom_img_07: '/uploads/dotcom_img_07_1791092914071.webp',

  // Materials
  material_img_01: '/uploads/material_img_01_1791017188523.jpg',
  material_img_02: '/uploads/material_img_02_1791017278635.jpg',
  material_img_03: '/uploads/material_img_03_1791017362001.jpg',
  material_img_04: '/uploads/material_img_04_1791017458182.jpg',

  // Mystic Villas
  mystic_img_01: '/uploads/mystic_img_01_1791093087981.webp',
  mystic_img_8020: '/uploads/mystic_img_8020_1791093194551.webp',
  mystic_img_arch: '/uploads/mystic_img_arch_1791093206295.webp',
  mystic_img_architecture: '/uploads/mystic_img_architecture_1791093828877.jpg',
  mystic_img_community: '/uploads/mystic_img_community_1791093266237.webp',
  mystic_img_concept: '/uploads/mystic_img_concept_1791093105853.webp',
  mystic_img_elevation: '/uploads/mystic_img_elevation_1791093758040.webp',
  mystic_img_farmland: '/uploads/mystic_img_farmland_1791093153207.webp',
  mystic_img_house: '/uploads/mystic_img_house_1791093186998.webp',
  mystic_img_iso_01: '/uploads/mystic_img_iso_01_1791093162179.webp',
  mystic_img_iso_02: '/uploads/mystic_img_iso_02_1791093170997.webp',
  mystic_img_pool: '/uploads/mystic_img_pool_1791093213235.webp',
  mystic_img_siruvani: '/uploads/mystic_img_siruvani_1791093998148.jpg',

  // Uptown Residences
  uptown_img_01: '/uploads/uptown_img_01_1791093544743.webp',
  uptown_img_02: '/uploads/uptown_img_02_1791092962314.webp',
  uptown_img_03: '/uploads/uptown_img_03_1791092970031.webp',
  uptown_img_04: '/uploads/uptown_img_04_1791092990629.webp',
  uptown_img_05: '/uploads/uptown_img_05_1791093005795.webp',
  uptown_img_06: '/uploads/uptown_img_06_1791093030499.webp',
  uptown_img_07: '/uploads/uptown_img_07_1791093043387.webp',
  uptown_img_08: '/uploads/uptown_img_08_1791093059953.webp',
};

/**
 * Normalizes slot IDs for consistent lookup (e.g. handles single digits like _img_1 -> _img_01)
 */
export function normalizeSlotId(slotId: string): string {
  const clean = slotId.toLowerCase().trim();
  return clean.replace(/_img_(\d)$/, '_img_0$1');
}

/**
 * LocalStorage image slot manager so the user can easily upload/drag-drop
 * their real photos into any slot and see it instantly previewed across the site.
 * Falls back to DEFAULT_SLOT_IMAGES if no localStorage override exists.
 */
export const CLIENT_IMAGES_STORAGE_KEY = 'soulspace_client_images';

export function getClientSavedImage(slotId: string): string | null {
  const normalized = normalizeSlotId(slotId);
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(CLIENT_IMAGES_STORAGE_KEY);
      if (raw) {
        const map = JSON.parse(raw);
        if (map[normalized] !== undefined) {
          if (map[normalized] === '' || map[normalized] === '__CLEARED__') return null;
          return map[normalized];
        }
        const trimmed = slotId.toLowerCase().trim();
        if (map[trimmed] !== undefined) {
          if (map[trimmed] === '' || map[trimmed] === '__CLEARED__') return null;
          return map[trimmed];
        }
      }
    } catch {
      // ignore JSON parse errors
    }
  }

  return DEFAULT_SLOT_IMAGES[normalized] || DEFAULT_SLOT_IMAGES[slotId.toLowerCase().trim()] || null;
}

export function saveClientImage(slotId: string, dataUrl: string): void {
  if (typeof window === 'undefined') return;
  try {
    const normalized = normalizeSlotId(slotId);
    const raw = localStorage.getItem(CLIENT_IMAGES_STORAGE_KEY);
    let map: Record<string, string> = {};
    if (raw) {
      try {
        map = JSON.parse(raw);
      } catch {
        map = {};
      }
    }
    map[normalized] = dataUrl;

    try {
      localStorage.setItem(CLIENT_IMAGES_STORAGE_KEY, JSON.stringify(map));
    } catch (quotaErr) {
      // If browser quota exceeded due to old large base64 strings, purge all base64 data and keep clean URLs
      const cleanMap: Record<string, string> = {};
      Object.entries(map).forEach(([k, v]) => {
        if (typeof v === 'string' && !v.startsWith('data:')) {
          cleanMap[k] = v;
        }
      });
      cleanMap[normalized] = dataUrl;
      try {
        localStorage.setItem(CLIENT_IMAGES_STORAGE_KEY, JSON.stringify(cleanMap));
      } catch {
        localStorage.setItem(CLIENT_IMAGES_STORAGE_KEY, JSON.stringify({ [normalized]: dataUrl }));
      }
    }

    window.dispatchEvent(new CustomEvent('soulspace-image-updated', { detail: { slotId: normalized } }));
  } catch (err) {
    console.error('Failed to store image in localStorage', err);
  }
}

export function clearClientImage(slotId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const normalized = normalizeSlotId(slotId);
    const raw = localStorage.getItem(CLIENT_IMAGES_STORAGE_KEY);
    let map: Record<string, string> = {};
    if (raw) {
      try {
        map = JSON.parse(raw);
      } catch {
        map = {};
      }
    }
    // Mark as explicitly cleared so default fallback images don't immediately resurrect
    map[normalized] = '__CLEARED__';
    const trimmed = slotId.toLowerCase().trim();
    if (trimmed !== normalized) {
      map[trimmed] = '__CLEARED__';
    }
    localStorage.setItem(CLIENT_IMAGES_STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent('soulspace-image-updated', { detail: { slotId: normalized } }));
  } catch (err) {
    console.error('Failed to clear image', err);
  }
}
