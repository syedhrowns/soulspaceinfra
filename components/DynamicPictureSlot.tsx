'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Maximize2, X, Loader2, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getClientSavedImage } from '@/lib/slots';
import {
  useAdaptiveDimensions,
  getOrientationRatio,
  parseAspectHint,
  SlotOrientation,
} from '@/lib/adaptiveImage';

export type { SlotOrientation };

export interface DynamicPictureSlotProps {
  slotId: string;
  title?: string;
  caption?: string;
  aspectHint?: string;
  orientation?: SlotOrientation;
  src?: string | null;
  className?: string;
  priority?: boolean;
  maxRenderHeight?: string;
  allowLightbox?: boolean;
}

export function DynamicPictureSlot({
  slotId,
  title,
  caption,
  aspectHint,
  orientation = 'landscape',
  src,
  className = '',
  priority = false,
  maxRenderHeight,
  allowLightbox = true,
}: DynamicPictureSlotProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  // Strictly lowercase canonical serial number: e.g. aurum_img_01, abvarbor_img_02
  const serialNumber = slotId.toLowerCase().trim();

  // Support local client saved uploads when user uploads or updates them
  const [clientSrc, setClientSrc] = useState<string | null>(() => {
    return getClientSavedImage(serialNumber);
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ slotId: string }>;
      if (customEvent.detail && customEvent.detail.slotId === serialNumber) {
        setClientSrc(getClientSavedImage(serialNumber));
      }
    };

    window.addEventListener('soulspace-image-updated', handler);
    return () => window.removeEventListener('soulspace-image-updated', handler);
  }, [serialNumber]);

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
  } = useAdaptiveDimensions(hasValidSrc ? activeSrc : null, fallbackRatio, priority);

  // Escape key handler for lightbox modal
  useEffect(() => {
    if (!isOpenModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpenModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpenModal]);

  // Compute responsive maximum width constraint so portrait/tall images scale fluidly without squashing or blowing out
  const hasCustomMaxWidth = Boolean(className && /\bmax-w-/.test(className));
  const effectiveMaxWidth = hasCustomMaxWidth
    ? undefined
    : activeRatio < 1.15
      ? `min(100%, calc(min(85vh, 850px) * ${activeRatio}))`
      : '100%';

  return (
    <>
      <figure
        role="group"
        aria-label={title || `Architectural image slot ${serialNumber}`}
        className={`group relative w-full overflow-hidden rounded-xl border border-[#B8936D] bg-[#181715] transition-all duration-500 hover:border-[#B8936D] hover:shadow-none ${className}`}
        style={{
          aspectRatio: `${activeRatio}`,
          ...(effectiveMaxWidth ? { maxWidth: effectiveMaxWidth } : {}),
          margin: '0 auto',
          transition: 'aspect-ratio 0.4s cubic-bezier(0.16, 1, 0.3, 1), max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {hasValidSrc ? (
          <>
            {/* Loading Skeleton / Architectural Shimmer while image resolves */}
            {!isLoaded && !hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#181715] z-10">
                <Loader2 className="w-5 h-5 text-[#8C7E6D]/50 animate-spin mb-2" />
                <span className="font-mono text-[9px] tracking-wider text-[#8C7E6D]/60 uppercase">
                  Resolving {serialNumber}
                </span>
              </div>
            )}

            {/* Error Fallback */}
            {hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#181715] text-[#8C7E6D]/70 select-none">
                <span className="font-mono text-[10px] sm:text-xs mb-1 uppercase tracking-wider">
                  Asset Unavailable
                </span>
                <span className="font-mono text-[9px] lowercase opacity-60">
                  {serialNumber}
                </span>
              </div>
            )}

            {/* Responsive Fluid Image Element */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeSrc as string}
              alt={title || serialNumber}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              ref={(el) => {
                if (el && el.complete && el.naturalWidth > 0 && !isLoaded) {
                  handleDomLoad({ currentTarget: el } as unknown as React.SyntheticEvent<HTMLImageElement>);
                }
              }}
              onLoad={handleDomLoad}
              className={`w-full h-full object-contain select-none transition-all duration-700 ease-out group-hover:scale-[1.015] ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* High-Resolution Inspection Trigger */}
            {allowLightbox && isLoaded && (
              <button
                type="button"
                onClick={() => setIsOpenModal(true)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-1.5 sm:p-2 rounded-full bg-black/60 text-white/90 hover:text-white backdrop-blur-md opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black min-w-[36px] min-h-[36px] flex items-center justify-center focus:opacity-100 focus:outline-hidden"
                aria-label={`Inspect high resolution view of ${title || serialNumber}`}
              >
                <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
          </>
        ) : (
          /* Architectural Blueprint Plate Placeholder when no image is uploaded yet */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 select-none pointer-events-none bg-[#1A1816] bg-grid-architectural">
            <div className="w-10 h-10 rounded-full bg-[#26221D] border border-[#3E3830] flex items-center justify-center text-[#B8936D] mb-3 shadow-inner">
              <Layers className="w-4 h-4 text-[#B8936D]" />
            </div>
            <span className="font-mono text-[10px] sm:text-xs lowercase tracking-wider text-[#C5A880] font-semibold mb-0.5">
              {serialNumber}
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#7A7061] font-sans">
              Architectural Asset Plate
            </span>
          </div>
        )}
      </figure>

      {/* Lightbox / High Resolution Modal preserving intrinsic proportions */}
      <AnimatePresence>
        {isOpenModal && hasValidSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpenModal(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-7xl max-h-[92vh] w-full flex flex-col items-center justify-center"
            >
              <button
                type="button"
                onClick={() => setIsOpenModal(false)}
                className="absolute top-2 right-2 sm:-top-12 sm:right-0 z-30 p-2 text-white/80 hover:text-white rounded-full bg-black/60 hover:bg-black transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-hidden"
                aria-label="Close image preview"
              >
                <X className="w-6 h-6" />
              </button>

              <div
                className="relative max-w-full max-h-[80vh] flex items-center justify-center overflow-hidden"
                style={{
                  aspectRatio: dimensions?.aspectRatio ? `${dimensions.aspectRatio}` : undefined,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeSrc as string}
                  alt={title || serialNumber}
                  className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg"
                />
              </div>

              {(title || caption) && (
                <div className="mt-4 text-center max-w-2xl px-4">
                  {title && <p className="font-serif text-lg sm:text-xl text-white/95">{title}</p>}
                  {caption && <p className="text-xs sm:text-sm text-[#C5A880] mt-1 font-light">{caption}</p>}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
