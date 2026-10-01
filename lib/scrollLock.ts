'use client';

import { useEffect } from 'react';
import type Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

let lockCount = 0;
let originalPaddingRight = '';

export function lockScroll() {
  if (typeof window === 'undefined') return;

  lockCount++;
  if (lockCount === 1) {
    // 1. Pause Lenis virtual scroll engine
    if (window.__lenis) {
      window.__lenis.stop();
    }

    // 2. Prevent scrollbar jump by calculating scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    originalPaddingRight = document.body.style.paddingRight || '';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // 3. Lock native document and html scrolling
    document.documentElement.classList.add('lenis-stopped');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  }
}

export function unlockScroll() {
  if (typeof window === 'undefined') return;

  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    // 1. Resume Lenis
    if (window.__lenis) {
      window.__lenis.start();
    }

    // 2. Restore document styles
    document.documentElement.classList.remove('lenis-stopped');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = originalPaddingRight;
    document.body.style.touchAction = '';
  }
}

/**
 * React hook to effortlessly lock background scrolling when any modal,
 * drawer, lightbox, or floating sheet is active.
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      lockScroll();
      return () => {
        unlockScroll();
      };
    }
  }, [isLocked]);
}
