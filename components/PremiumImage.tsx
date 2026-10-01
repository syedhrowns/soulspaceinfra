'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getClientSavedImage } from '@/lib/slots';
import { useAdaptiveDimensions } from '@/lib/adaptiveImage';

export interface PremiumImageProps {
  src?: string | null;
  alt: string;
  slotId?: string;
  className?: string;
  containerClassName?: string;
  fitMode?: 'cover' | 'contain' | 'auto';
  fill?: boolean;
  priority?: boolean;
  fallbackRatio?: number;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

export function PremiumImage({
  src,
  alt,
  slotId,
  className = '',
  containerClassName = '',
  fitMode = 'auto',
  fill = false,
  priority = false,
  fallbackRatio = 16 / 10,
  referrerPolicy = 'no-referrer',
}: PremiumImageProps) {
  // Strictly lowercase serial number
  const formattedSlotId = slotId ? slotId.toLowerCase().trim() : null;

  const [clientSrc, setClientSrc] = useState<string | null>(() => {
    return formattedSlotId ? getClientSavedImage(formattedSlotId) : null;
  });

  // Listen for image updates in case an admin/user uploads them
  useEffect(() => {
    if (!formattedSlotId) return;

    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ slotId: string }>;
      if (customEvent.detail && customEvent.detail.slotId === formattedSlotId) {
        setClientSrc(getClientSavedImage(formattedSlotId));
      }
    };

    window.addEventListener('soulspace-image-updated', handler);
    return () => window.removeEventListener('soulspace-image-updated', handler);
  }, [formattedSlotId]);

  const activeSrc = clientSrc || src;
  const hasValidSrc = Boolean(
    activeSrc &&
      typeof activeSrc === 'string' &&
      activeSrc.trim().length > 0 &&
      !activeSrc.startsWith('/placeholder') &&
      activeSrc !== ''
  );

  const {
    dimensions,
    activeRatio,
    isLoaded,
    hasError,
    handleDomLoad,
  } = useAdaptiveDimensions(hasValidSrc ? activeSrc : null, fallbackRatio, priority);

  // In auto mode: if fill is requested, use object-contain to preserve 100% of the image without cropping
  const effectiveFit =
    fitMode === 'auto'
      ? (dimensions ? 'object-contain' : 'object-cover')
      : fitMode === 'contain'
      ? 'object-contain'
      : 'object-cover';

  return (
    <div
      className={`relative overflow-hidden bg-[#181715] flex items-center justify-center group ${containerClassName} ${
        fill ? 'w-full h-full' : 'w-full'
      }`}
      style={{
        ...(!fill ? { aspectRatio: `${activeRatio}` } : {}),
        transition: 'aspect-ratio 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Visual Slot - active image or dark architectural background with adaptive serial number */}
      {!hasValidSrc ? (
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-[#181715] select-none pointer-events-none">
          {formattedSlotId && (
            <span className="font-mono text-[9px] sm:text-[11px] md:text-xs lowercase tracking-wider text-[#8C7E6D]/80">
              {formattedSlotId}
            </span>
          )}
        </div>
      ) : (
        <>
          {/* Subtle placeholder while image is decoding */}
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#181715]">
              <div className="w-full h-full bg-[#181715] animate-pulse opacity-40" />
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeSrc as string}
            alt={alt || (formattedSlotId ? formattedSlotId : 'architectural asset')}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            referrerPolicy={referrerPolicy}
            ref={(el) => {
              if (el && el.complete && el.naturalWidth > 0 && !isLoaded) {
                handleDomLoad({ currentTarget: el } as unknown as React.SyntheticEvent<HTMLImageElement>);
              }
            }}
            onLoad={handleDomLoad}
            className={`w-full h-full ${effectiveFit} select-none transition-all duration-700 ease-out group-hover:scale-[1.015] ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.01]'
            } ${className}`}
          />
        </>
      )}
    </div>
  );
}
