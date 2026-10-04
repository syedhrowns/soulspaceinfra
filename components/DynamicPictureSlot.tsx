'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getClientSavedImage } from '@/lib/slots';
import {
  useAdaptiveDimensions,
  getOrientationRatio,
  parseAspectHint,
  SlotOrientation,
} from '@/lib/adaptiveImage';
import { useScrollLock } from '@/lib/scrollLock';

export type { SlotOrientation };

export interface DynamicPictureSlotProps {
  slotId: string;
  title?: string;
  caption?: string;
  aspectHint?: string;
  orientation?: SlotOrientation;
  aspectRatio?: string;
  src?: string | null;
  className?: string;
  priority?: boolean;
  maxRenderHeight?: string;
  allowLightbox?: boolean;
  isHero?: boolean;
  fitMode?: 'cover' | 'contain' | 'auto';
  isAdminPreview?: boolean;
  focalPosition?: string;
}

export function DynamicPictureSlot({
  slotId,
  title,
  caption,
  aspectHint,
  orientation = 'landscape',
  aspectRatio,
  src,
  className = '',
  priority = false,
  maxRenderHeight,
  allowLightbox = true,
  isHero = false,
  fitMode = 'auto',
  isAdminPreview = false,
  focalPosition = 'center',
}: DynamicPictureSlotProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Background scroll lock whenever floating lightbox modal is opened
  useScrollLock(isOpenModal);

  // Strictly lowercase canonical serial number: e.g. aurum_img_01, abvarbor_img_16
  const serialNumber = slotId.toLowerCase().trim();

  const [clientSrc, setClientSrc] = useState<string | null>(() => {
    return getClientSavedImage(serialNumber);
  });

  useEffect(() => {
    // 1. Immediately read latest saved image on client mount
    const saved = getClientSavedImage(serialNumber);
    if (saved) {
      setClientSrc(saved);
    }

    // 2. Same-window update event (e.g. admin panel in same tab or instant action)
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ slotId: string }>;
      if (
        !customEvent.detail ||
        customEvent.detail.slotId === serialNumber ||
        customEvent.detail.slotId === slotId
      ) {
        setClientSrc(getClientSavedImage(serialNumber));
      }
    };

    // 3. Cross-tab storage event (e.g. user uploaded in /admin in one tab, viewing landing page in another)
    const storageHandler = (e: StorageEvent) => {
      if (!e.key || e.key === 'soulspace_client_images') {
        setClientSrc(getClientSavedImage(serialNumber));
      }
    };

    window.addEventListener('soulspace-image-updated', handler);
    window.addEventListener('storage', storageHandler);
    return () => {
      window.removeEventListener('soulspace-image-updated', handler);
      window.removeEventListener('storage', storageHandler);
    };
  }, [serialNumber, slotId]);

  const activeSrc = clientSrc || src;

  const hasValidSrc = Boolean(
    activeSrc &&
      typeof activeSrc === 'string' &&
      activeSrc.trim().length > 0 &&
      !activeSrc.startsWith('/placeholder') &&
      activeSrc !== ''
  );

  // Determine architectural fallback ratio before image is loaded
  const fallbackRatio = useMemo(() => {
    return parseAspectHint(aspectHint) || getOrientationRatio(orientation);
  }, [aspectHint, orientation]);

  // Dynamic intrinsic dimension & aspect ratio hook
  const {
    dimensions,
    activeRatio,
    isLoaded,
    isLoading,
    hasError,
    handleDomLoad,
  } = useAdaptiveDimensions(hasValidSrc ? activeSrc : null, fallbackRatio, priority || isHero);

  // Escape key handler for lightbox modal
  useEffect(() => {
    if (!isOpenModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpenModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpenModal]);

  // Determine effective object-fit strategy per use case
  const resolvedFit = useMemo(() => {
    if (fitMode === 'cover') return 'object-cover';
    if (fitMode === 'contain') return 'object-contain';
    if (isHero) return 'object-cover';
    if (aspectRatio) return 'object-cover';
    // Technical floor plans / blueprints prioritize complete visibility
    if (slotId.includes('plan') || orientation === 'portrait' && maxRenderHeight) {
      return 'object-contain';
    }
    // Default fluid containment for architectural rendering
    return 'object-contain';
  }, [fitMode, isHero, aspectRatio, slotId, orientation, maxRenderHeight]);

  // Sizing architecture:
  // HERO: Controlled, consistent fixed responsive frame (never jumps height between pages)
  // UNIFORM ASPECT: Strictly uniform architectural aspect ratio across all project pages
  // TECHNICAL PLANS / DOCUMENTS: Bounded height ceiling so portrait plans don't blow out
  // GENERAL CONTENT: Adaptive intrinsic aspect ratio
  const containerStyle = useMemo<React.CSSProperties>(() => {
    if (aspectRatio) {
      return {
        width: '100%',
        aspectRatio,
        margin: '0 auto',
      };
    }

    if (isHero) {
      const heroRatio = activeRatio > 0 ? activeRatio : (fallbackRatio || 2);
      return {
        width: '100%',
        aspectRatio: `${heroRatio}`,
        margin: '0 auto',
        transition: 'aspect-ratio 0.3s ease',
      };
    }

    if (maxRenderHeight) {
      const calcMaxWidth =
        activeRatio < 1
          ? `min(100%, calc(${maxRenderHeight} * ${activeRatio}))`
          : '100%';
      return {
        aspectRatio: `${activeRatio}`,
        maxHeight: maxRenderHeight,
        maxWidth: calcMaxWidth,
        margin: '0 auto',
        transition: 'aspect-ratio 0.3s ease, max-width 0.3s ease',
      };
    }

    const hasCustomMaxWidth = Boolean(className && /\bmax-w-/.test(className));
    const effectiveMaxWidth = hasCustomMaxWidth
      ? undefined
      : activeRatio < 1.15
        ? `min(100%, calc(min(80vh, 800px) * ${activeRatio}))`
        : '100%';

    return {
      aspectRatio: `${activeRatio}`,
      ...(effectiveMaxWidth ? { maxWidth: effectiveMaxWidth } : {}),
      margin: '0 auto',
      transition: 'aspect-ratio 0.3s ease, max-width 0.3s ease',
    };
  }, [aspectRatio, isHero, maxRenderHeight, activeRatio, fallbackRatio, className]);

  // Hero frame class configuration (intentional fixed responsive frame without letterboxing)
  const heroFrameClass = isHero
    ? 'overflow-hidden max-h-[640px]'
    : '';

  return (
    <>
      <figure
        role="group"
        aria-label={title || `Architectural visual for ${serialNumber}`}
        className={`group relative w-full max-w-full min-w-0 rounded-xl overflow-hidden bg-transparent transition-all duration-300 border-0 flex items-center justify-center ${heroFrameClass} ${className}`}
        style={containerStyle}
      >
        {hasValidSrc ? (
          <>
            {/* Loading Skeleton / Architectural Shimmer while image resolves */}
            {!isLoaded && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#FAF8F5]/80 backdrop-blur-xs z-10">
                <Loader2 className="w-5 h-5 text-[#8C7E6D]/50 animate-spin" />
              </div>
            )}

            {/* Error Fallback */}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center p-3 select-none bg-[#1A1816] pointer-events-none">
                {isAdminPreview && (
                  <span className="font-mono text-[9px] min-[360px]:text-[10px] sm:text-xs lowercase tracking-wider text-[#8C7E6D]/80">
                    {serialNumber}
                  </span>
                )}
              </div>
            )}

            {/* Responsive Fluid Image Element - STRICT ZERO HOVER ZOOM */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeSrc as string}
              alt={title || serialNumber}
              loading={priority || isHero ? 'eager' : 'lazy'}
              fetchPriority={priority || isHero ? 'high' : 'auto'}
              decoding="async"
              style={{ objectPosition: focalPosition }}
              ref={(el) => {
                if (el && el.complete && el.naturalWidth > 0 && !isLoaded) {
                  handleDomLoad({ currentTarget: el } as unknown as React.SyntheticEvent<HTMLImageElement>);
                }
              }}
              onClick={() => {
                if (allowLightbox && isLoaded) {
                  setIsOpenModal(true);
                }
              }}
              onLoad={handleDomLoad}
              className={`w-full h-full max-w-full ${resolvedFit} rounded-[inherit] select-none transition-opacity duration-300 ease-out ${
                allowLightbox ? 'cursor-zoom-in' : ''
              } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Lightbox Trigger ONLY */}
            {isLoaded && allowLightbox && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(true)}
                  className="p-1.5 sm:p-2 rounded-full bg-black/60 text-white/90 hover:text-white backdrop-blur-md transition-colors cursor-pointer hover:bg-black min-w-[34px] min-h-[34px] flex items-center justify-center focus:opacity-100 focus:outline-hidden"
                  title="Inspect high resolution"
                  aria-label={`Inspect high resolution view of ${title || serialNumber}`}
                >
                  <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* When image has not been uploaded:
             In Admin mode: shows serial number for configuration.
             On Public website: renders clean architectural card without developer code strings. */
          isAdminPreview ? (
            <div className="absolute inset-0 flex items-center justify-center p-3 select-none bg-[#1A1816] pointer-events-none">
              <span className="font-mono text-[9px] min-[360px]:text-[10px] sm:text-xs lowercase tracking-wider text-[#C5A880]/80">
                {serialNumber}
              </span>
            </div>
          ) : (
            <div className="w-full h-full min-h-[160px] flex flex-col items-center justify-center p-6 bg-[#F4F1EA] border border-[#E5DFD4] rounded-xl select-none text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo-mark.png"
                alt="Soul Space Mark"
                className="w-8 h-8 object-contain opacity-25 mb-2 pointer-events-none"
              />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#9A8D7C] font-sans font-medium">
                {title || 'Architectural View'}
              </span>
            </div>
          )
        )}
      </figure>

      {/* Lightbox / High Resolution Modal with complete scroll isolation — Portaled to document.body */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpenModal && hasValidSrc && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpenModal(false)}
              data-lenis-prevent
              className="fixed inset-0 z-[999999] bg-[#0B0A09]/96 backdrop-blur-3xl flex flex-col items-center justify-center p-4 sm:p-8 select-none overflow-y-auto"
            >
              {/* Dedicated High-Visibility Floating Close Button */}
              <button
                type="button"
                onClick={() => setIsOpenModal(false)}
                className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[1000000] p-3 rounded-full bg-[#181714]/90 text-[#FAF8F5] hover:text-[#B8936D] border border-white/20 hover:border-[#B8936D] backdrop-blur-md shadow-2xl transition-all cursor-pointer min-w-[48px] min-h-[48px] flex items-center justify-center focus:outline-hidden"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-7xl max-h-[92vh] w-full flex flex-col items-center justify-center my-auto"
              >
                <div
                  className="relative max-w-full max-h-[82vh] flex items-center justify-center overflow-hidden"
                  style={{
                    aspectRatio: dimensions?.aspectRatio ? `${dimensions.aspectRatio}` : undefined,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeSrc as string}
                    alt={title || serialNumber}
                    className="max-w-full max-h-[82vh] w-auto h-auto object-contain rounded-xl shadow-2xl"
                  />
                </div>

                {(title || caption) && (
                  <div className="mt-4 sm:mt-5 text-center max-w-3xl px-6 py-3 bg-[#181714]/90 rounded-xl border border-white/10 backdrop-blur-md shadow-xl">
                    {title && <h3 className="font-serif text-lg sm:text-2xl text-[#FAF8F5] font-normal tracking-wide">{title}</h3>}
                    {caption && <p className="text-xs sm:text-sm text-[#C5A880] mt-1 font-light leading-relaxed">{caption}</p>}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
