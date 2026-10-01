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
 * Verified Cloudinary Image Registry provided by the user.
 * Automatically resolves all dynamic picture slots across desktop and mobile.
 */
export const DEFAULT_SLOT_IMAGES: Record<string, string> = {};

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
        if (map[normalized]) {
          return map[normalized];
        }
        if (map[slotId.toLowerCase().trim()]) {
          return map[slotId.toLowerCase().trim()];
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
    const map = raw ? JSON.parse(raw) : {};
    map[normalized] = dataUrl;
    localStorage.setItem(CLIENT_IMAGES_STORAGE_KEY, JSON.stringify(map));
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
    if (!raw) return;
    const map = JSON.parse(raw);
    delete map[normalized];
    delete map[slotId.toLowerCase().trim()];
    localStorage.setItem(CLIENT_IMAGES_STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent('soulspace-image-updated', { detail: { slotId: normalized } }));
  } catch (err) {
    console.error('Failed to clear image', err);
  }
}
