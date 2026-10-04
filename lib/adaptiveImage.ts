'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export type SlotOrientation = 'landscape' | 'portrait' | 'square' | 'wide';

export interface ImageDimensions {
  naturalWidth: number;
  naturalHeight: number;
  aspectRatio: number;
}

// Global in-memory dimension registry to eliminate Cumulative Layout Shift (CLS) across page transitions
const GLOBAL_DIMENSION_CACHE = new Map<string, ImageDimensions>();

// Pre-seeded intrinsic dimensions for all verified project assets to render instantaneously without layout pop
const PRELOADED_ASSET_RATIOS: Record<string, { width: number; height: number }> = {
  // Hero Assets (2:1 / 18:9 Widescreen Frame)
  'aurum_img_01': { width: 1920, height: 960 },
  'abvarbor_img_01': { width: 1920, height: 960 },
  'dotcom_img_01': { width: 1376, height: 688 },
  'mystic_img_01': { width: 1920, height: 960 },
  'uptown_img_01': { width: 1920, height: 960 },

  // Technical Floor Plans (Portrait Drawings)
  'aurum_img_plan_north_ground': { width: 1200, height: 1848 },
  'aurum_img_plan_north_first': { width: 1200, height: 1697 },
  'aurum_img_plan_east_ground': { width: 1200, height: 2229 },
  'aurum_img_plan_east_first': { width: 1200, height: 2161 },
  'aurum_img_plan_west_ground': { width: 1200, height: 1789 },
  'aurum_img_plan_west_first': { width: 1200, height: 1781 },
  'aurum_img_plan_south_ground': { width: 1200, height: 1831 },
  'aurum_img_plan_south_first': { width: 1200, height: 1772 },

  // Mystic Architectural Highlights
  'mystic_img_arch': { width: 1200, height: 1200 },
  'mystic_img_pool': { width: 1200, height: 800 },
  'mystic_img_house': { width: 1200, height: 1500 },
  'mystic_img_iso_01': { width: 1200, height: 598 },
  'mystic_img_iso_02': { width: 1200, height: 663 },
  'mystic_img_8020': { width: 1200, height: 675 },

  // ABV Arbor Living Spaces
  'abvarbor_img_02': { width: 1200, height: 449 },
  'abvarbor_img_03': { width: 1200, height: 1319 },
  'abvarbor_img_04': { width: 1200, height: 1121 },
  'abvarbor_img_05': { width: 1200, height: 950 },
  'abvarbor_img_06': { width: 1200, height: 1038 },
  'abvarbor_img_07': { width: 1200, height: 1228 },
  'abvarbor_img_08': { width: 1200, height: 1299 },
  'abvarbor_img_09': { width: 1200, height: 600 },
  'abvarbor_img_10': { width: 1200, height: 835 },
  'abvarbor_img_11': { width: 1200, height: 838 },
  'abvarbor_img_12': { width: 1200, height: 901 },
  'abvarbor_img_13': { width: 1200, height: 894 },
  'abvarbor_img_15': { width: 1200, height: 903 },
  'abvarbor_img_16': { width: 1200, height: 773 },

  // Materials & Textures
  'material_img_01': { width: 736, height: 736 },
  'material_img_02': { width: 736, height: 1185 },
  'material_img_03': { width: 688, height: 1024 },
  'material_img_04': { width: 735, height: 985 },
};

// Seed the cache with pre-calculated asset ratios
Object.entries(PRELOADED_ASSET_RATIOS).forEach(([key, val]) => {
  GLOBAL_DIMENSION_CACHE.set(key, {
    naturalWidth: val.width,
    naturalHeight: val.height,
    aspectRatio: val.width / val.height,
  });
});

/**
 * Extracts a numeric ratio from common string hints such as:
 * "16:9", "21/9", "4:3", "1:1", "3:4", "4:5", "0.75"
 */
export function parseAspectHint(hint?: string): number | null {
  if (!hint) return null;
  const clean = hint.trim();

  // Match width:height or width/height
  const match = clean.match(/(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)/);
  if (match) {
    const w = parseFloat(match[1]);
    const h = parseFloat(match[2]);
    if (w > 0 && h > 0) return w / h;
  }

  // Direct float
  const direct = parseFloat(clean);
  if (!isNaN(direct) && direct > 0) return direct;

  return null;
}

/**
 * Provides intentional architectural fallback ratios when no image is loaded yet
 */
export function getOrientationRatio(orientation?: SlotOrientation): number {
  switch (orientation) {
    case 'portrait':
      return 3 / 4; // 0.75 standard architectural vertical
    case 'square':
      return 1; // 1.0
    case 'wide':
      return 2 / 1; // 2.0 cinematic wide
    case 'landscape':
    default:
      return 16 / 10; // 1.6 golden landscape
  }
}

/**
 * Resolves cached dimensions from URL or slot identifier
 */
function resolveCachedDimensions(src?: string | null): ImageDimensions | null {
  if (!src) return null;
  const clean = src.trim();

  // 1. Direct URL cache
  if (GLOBAL_DIMENSION_CACHE.has(clean)) {
    return GLOBAL_DIMENSION_CACHE.get(clean)!;
  }

  // 2. Slot key matching (e.g. url contains /abvarbor_img_01_)
  for (const [key, dims] of GLOBAL_DIMENSION_CACHE.entries()) {
    if (clean.includes(key)) {
      GLOBAL_DIMENSION_CACHE.set(clean, dims);
      return dims;
    }
  }

  return null;
}

/**
 * Robust React Hook for dynamic intrinsic image dimension & aspect ratio detection.
 * Automatically adapts geometry when:
 * 1. An image is loaded for the first time
 * 2. An image is replaced by a new image of different dimensions/proportions
 * 3. An image is served from browser cache (synchronous detection, prevents CLS)
 */
export function useAdaptiveDimensions(
  src?: string | null,
  fallbackRatio: number = 16 / 10,
  priority: boolean = false
) {
  const cleanSrc = src && typeof src === 'string' && src.trim().length > 0 && !src.startsWith('/placeholder') ? src.trim() : null;

  // Initialize with cached dimensions immediately if available to eliminate layout shifts
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(() => {
    return resolveCachedDimensions(cleanSrc);
  });
  const [isLoaded, setIsLoaded] = useState<boolean>(() => {
    return !!resolveCachedDimensions(cleanSrc);
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const currentSrcRef = useRef<string | null>(cleanSrc);

  const applyDimensions = useCallback((width: number, height: number, url?: string | null) => {
    if (width > 0 && height > 0) {
      const dims: ImageDimensions = {
        naturalWidth: width,
        naturalHeight: height,
        aspectRatio: width / height,
      };
      if (url) {
        GLOBAL_DIMENSION_CACHE.set(url, dims);
      }
      setDimensions(dims);
      setIsLoaded(true);
      setIsLoading(false);
      setHasError(false);
    }
  }, []);

  useEffect(() => {
    currentSrcRef.current = cleanSrc;

    if (!cleanSrc) {
      setDimensions(null);
      setIsLoaded(false);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    const cached = resolveCachedDimensions(cleanSrc);
    if (cached) {
      setDimensions(cached);
      setIsLoaded(true);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    // Check fast-path browser Image in memory
    if (typeof window !== 'undefined') {
      const probe = new window.Image();
      probe.src = cleanSrc;

      if (probe.complete && probe.naturalWidth > 0 && probe.naturalHeight > 0) {
        applyDimensions(probe.naturalWidth, probe.naturalHeight, cleanSrc);
        return;
      }

      setIsLoading(true);

      probe.onload = () => {
        if (currentSrcRef.current === cleanSrc && probe.naturalWidth > 0 && probe.naturalHeight > 0) {
          applyDimensions(probe.naturalWidth, probe.naturalHeight, cleanSrc);
        }
      };

      probe.onerror = () => {
        if (currentSrcRef.current === cleanSrc) {
          setHasError(true);
          setIsLoading(false);
          setIsLoaded(false);
        }
      };

      return () => {
        probe.onload = null;
        probe.onerror = null;
      };
    }
  }, [cleanSrc, applyDimensions]);

  const handleDomLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        applyDimensions(img.naturalWidth, img.naturalHeight, cleanSrc);
      }
    },
    [applyDimensions, cleanSrc]
  );

  const activeRatio = dimensions?.aspectRatio || fallbackRatio;

  return {
    dimensions,
    activeRatio,
    isLoaded,
    isLoading,
    hasError,
    handleDomLoad,
  };
}
