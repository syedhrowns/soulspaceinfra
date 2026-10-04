'use client';

import React, { useEffect } from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'nav' | 'banner' | 'footer' | 'drawer';
  theme?: 'light' | 'dark';
  animated?: boolean;
}

let hasCleanedStaleLogoStorage = false;

export function BrandLogo({ 
  className = '', 
  variant = 'nav',
  theme = 'light',
  animated = false,
}: BrandLogoProps) {
  useEffect(() => {
    if (hasCleanedStaleLogoStorage) return;
    hasCleanedStaleLogoStorage = true;

    // Purge any stale client image from localStorage to ensure clean transparent logo
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('soulspace_client_images');
        if (raw) {
          const map = JSON.parse(raw);
          if (map['logo_img_01']) {
            delete map['logo_img_01'];
            localStorage.setItem('soulspace_client_images', JSON.stringify(map));
          }
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const isDark = theme === 'dark';

  // Colors matching the exact brand lockup:
  // Primary serif text: deep charcoal in light mode, off-white in dark mode
  const titleColor = isDark ? 'text-[#FAF8F5]' : 'text-[#1A1815] group-hover:text-[#B8936D]';
  // Vertical divider line: warm architectural sand/gold
  const dividerBg = isDark ? 'bg-[#C8B195]/60' : 'bg-[#C8B195]';
  // Subtitle sans-serif text: warm muted taupe/stone
  const subtitleColor = isDark ? 'text-[#A69B8D]' : 'text-[#7D7364]';
  // Official Cloudinary logo link: https://res.cloudinary.com/ty5psz5d/image/upload/v1790839563/image_20261001125420.jpg
  // Use dedicated transparent PNG assets (light & dark) extracted directly from the official logo
  const logoMarkSrc = isDark ? '/brand/logo-mark-dark.png' : '/brand/logo-mark.png';
  const logoFilter = '';
  const animatedMarkClass = isDark ? 'animate-flow-light-glide-mask-dark' : 'animate-flow-light-glide-mask';
  const animatedTextClass = isDark ? 'animate-flow-light-glide-dark' : 'animate-flow-light-glide';

  // Variant: Navigation Header (compact, perfectly balanced, responsive)
  if (variant === 'nav') {
    return (
      <div 
        className={`flex items-center gap-2 sm:gap-2.5 lg:gap-3 select-none bg-transparent ${className}`}
      >
        {/* Logo Mark Image at Left Side - Perfectly Proportionate & Crisp */}
        <div 
          className="relative shrink-0 flex items-center justify-center pointer-events-none bg-transparent w-8 h-8 sm:w-9 sm:h-9 md:w-[38px] md:h-[38px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoMarkSrc}
            alt="Soul Space Logo Mark"
            width={38}
            height={38}
            className={`w-full h-full object-contain pointer-events-none bg-transparent transition-all duration-500 ${logoFilter}`}
          />
          {animated && (
            <div 
              className={`absolute inset-0 ${animatedMarkClass} pointer-events-none bg-transparent`}
              style={{
                WebkitMaskImage: `url(${logoMarkSrc})`,
                maskImage: `url(${logoMarkSrc})`,
              }}
            />
          )}
        </div>

        {/* Text Lockup */}
        <div className={`hidden sm:flex items-center gap-2 sm:gap-2.5 lg:gap-3 bg-transparent ${animated ? animatedTextClass : ''}`}>
          <span 
            className={`font-serif text-[20px] sm:text-[26px] md:text-[30px] tracking-[-0.01em] font-medium leading-none whitespace-nowrap transition-colors duration-500 ${titleColor}`}
          >
            SOUL SPACE
          </span>
          <div className={`h-4 sm:h-6 w-[1px] shrink-0 self-center transition-colors duration-500 ${dividerBg}`} />
          <span 
            className={`font-sans text-[9px] sm:text-[11px] md:text-[13px] tracking-[0.2em] sm:tracking-[0.26em] uppercase font-light leading-none whitespace-nowrap pt-[1px] transition-colors duration-500 ${subtitleColor}`}
          >
            INFRASTRUCTURE
          </span>
        </div>
      </div>
    );
  }

  // Variant: Drawer Menu (clean, high legibility)
  if (variant === 'drawer') {
    return (
      <div className={`flex items-center gap-2 sm:gap-2.5 select-none bg-transparent max-w-full overflow-hidden ${className}`}>
        <div className="relative shrink-0 flex items-center justify-center bg-transparent w-6 h-6 sm:w-8 sm:h-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoMarkSrc}
            alt="Soul Space Logo Mark"
            width={32}
            height={32}
            className={`w-full h-full object-contain bg-transparent ${logoFilter}`}
          />
          {animated && (
            <div 
              className={`absolute inset-0 ${animatedMarkClass} pointer-events-none bg-transparent`}
              style={{
                WebkitMaskImage: `url(${logoMarkSrc})`,
                maskImage: `url(${logoMarkSrc})`,
              }}
            />
          )}
        </div>
        <div className={`flex items-center gap-1.5 sm:gap-2.5 bg-transparent min-w-0 ${animated ? animatedTextClass : ''}`}>
          <span className={`font-serif text-base sm:text-2xl tracking-[-0.01em] font-medium leading-none whitespace-nowrap ${titleColor}`}>
            SOUL SPACE
          </span>
          <div className={`h-4 sm:h-5 w-[1px] shrink-0 self-center ${dividerBg}`} />
          <span className={`font-sans text-[7.5px] sm:text-[10px] tracking-[0.16em] sm:tracking-[0.26em] uppercase font-light leading-none whitespace-nowrap pt-[1px] ${subtitleColor}`}>
            INFRASTRUCTURE
          </span>
        </div>
      </div>
    );
  }

  // Variant: Footer
  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-2 sm:gap-3 select-none bg-transparent max-w-full overflow-hidden ${className}`}>
        <div className="relative shrink-0 flex items-center justify-center bg-transparent w-8 h-8 sm:w-10 sm:h-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoMarkSrc}
            alt="Soul Space Logo Mark"
            width={40}
            height={40}
            className={`w-full h-full object-contain bg-transparent ${logoFilter}`}
          />
          {animated && (
            <div 
              className={`absolute inset-0 ${animatedMarkClass} pointer-events-none bg-transparent`}
              style={{
                WebkitMaskImage: `url(${logoMarkSrc})`,
                maskImage: `url(${logoMarkSrc})`,
              }}
            />
          )}
        </div>
        <div className={`flex items-center gap-1.5 sm:gap-3 bg-transparent min-w-0 ${animated ? animatedTextClass : ''}`}>
          <span className={`font-serif text-lg sm:text-3xl tracking-[-0.01em] font-normal leading-none text-[#181714] whitespace-nowrap`}>
            SOUL SPACE
          </span>
          <div className="h-4 sm:h-6 w-[1px] bg-[#C8B195] shrink-0 self-center" />
          <span className="font-sans text-[8px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.28em] uppercase font-light text-[#7D7364] leading-none whitespace-nowrap pt-[1px]">
            INFRASTRUCTURE
          </span>
        </div>
      </div>
    );
  }

  // Default Variant: Large Hero / Identity Banner Lockup
  return (
    <div className={`flex items-center gap-2 sm:gap-4.5 select-none bg-transparent max-w-full overflow-hidden ${className}`}>
      <div className="relative shrink-0 flex items-center justify-center bg-transparent w-10 h-10 sm:w-16 sm:h-16 lg:w-18 lg:h-18">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoMarkSrc}
          alt="Soul Space Logo Mark"
          width={64}
          height={64}
          className={`w-full h-full object-contain bg-transparent ${logoFilter}`}
        />
        {animated && (
          <div 
            className={`absolute inset-0 ${animatedMarkClass} pointer-events-none bg-transparent`}
            style={{
              WebkitMaskImage: `url(${logoMarkSrc})`,
              maskImage: `url(${logoMarkSrc})`,
            }}
          />
        )}
      </div>
      <div className={`flex items-center gap-1.5 sm:gap-4 bg-transparent min-w-0 ${animated ? animatedTextClass : ''}`}>
        <span className="font-serif text-xl sm:text-5xl lg:text-6xl tracking-[-0.02em] font-medium leading-none text-[#1A1815] whitespace-nowrap">
          SOUL SPACE
        </span>
        <div className="h-4 sm:h-11 lg:h-13 w-[1px] bg-[#C8B195] shrink-0 self-center mx-0.5 sm:mx-1" />
        <span className="font-sans text-[8.5px] sm:text-sm lg:text-base tracking-[0.16em] sm:tracking-[0.3em] uppercase font-light text-[#7D7364] leading-none whitespace-nowrap pt-[1px] sm:pt-[2px]">
          INFRASTRUCTURE
        </span>
      </div>
    </div>
  );
}
