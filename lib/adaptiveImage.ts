'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export type SlotOrientation = 'landscape' | 'portrait' | 'square' | 'wide';

export interface ImageDimensions {
  naturalWidth: number;
  naturalHeight: number;
  aspectRatio: number;
}

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
 * Provides clean architectural fallback ratios when no image is loaded yet
 */
export function getOrientationRatio(orientation?: SlotOrientation): number {
  switch (orientation) {
    case 'portrait':
      return 4 / 5; // 0.8
    case 'square':
      return 1; // 1.0
    case 'wide':
      return 21 / 9; // ~2.333
    case 'landscape':
    default:
      return 16 / 10; // 1.6
  }
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
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Keep a stable ref to avoid race conditions during fast image replacement
  const currentSrcRef = useRef<string | null>(null);

  const applyDimensions = useCallback((width: number, height: number) => {
    if (width > 0 && height > 0) {
      setDimensions({
        naturalWidth: width,
        naturalHeight: height,
        aspectRatio: width / height,
      });
      setIsLoaded(true);
      setIsLoading(false);
      setHasError(false);
    }
  }, []);

  useEffect(() => {
    const cleanSrc = src && typeof src === 'string' && src.trim().length > 0 && !src.startsWith('/placeholder') ? src.trim() : null;
    currentSrcRef.current = cleanSrc;

    if (!cleanSrc) {
      setDimensions(null);
      setIsLoaded(false);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    // For non-priority images, DO NOT eagerly probe offscreen with new Image().
    // The native DOM <img> element with loading="lazy" and decoding="async" will handle
    // network fetching when entering the viewport, and will invoke handleDomLoad synchronously.
    // This eliminates massive network congestion and memory overhead on cold load!
    if (!priority) {
      return;
    }

    setIsLoading(true);
    setHasError(false);

    // Create an offscreen Image element to inspect intrinsic dimensions immediately for priority assets
    if (typeof window !== 'undefined') {
      const probe = new window.Image();
      probe.src = cleanSrc;

      // Fast-path: Image already decoded / cached in browser memory
      if (probe.complete && probe.naturalWidth > 0 && probe.naturalHeight > 0) {
        applyDimensions(probe.naturalWidth, probe.naturalHeight);
        return;
      }

      // Async-path: Await image headers / full load
      probe.onload = () => {
        if (currentSrcRef.current === cleanSrc && probe.naturalWidth > 0 && probe.naturalHeight > 0) {
          applyDimensions(probe.naturalWidth, probe.naturalHeight);
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
  }, [src, priority, applyDimensions]);

  // Handle direct onLoad callback from the DOM <img> element for guaranteed sync
  const handleDomLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        applyDimensions(img.naturalWidth, img.naturalHeight);
      }
    },
    [applyDimensions]
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
