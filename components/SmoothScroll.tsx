'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Disable automatic browser scroll restoration so pages always start from the top
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Guarantee every page appears from the very top, or scrolls to hash target if present
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash;
      const target = document.querySelector(hash);
      if (target) {
        setTimeout(() => {
          if (window.__lenis) {
            window.__lenis.scrollTo(target as HTMLElement, { offset: -70, duration: 1.2 });
          } else {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }, 200);
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  useEffect(() => {
    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024);

    // On mobile / touch devices, bypass Lenis completely.
    // iOS and Android mobile browsers utilize out-of-process compositor threads
    // for hardware 120Hz momentum scrolling. Eliminating JS RAF loops frees the CPU completely.
    if (isTouch) {
      const handleAnchorClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a[href^="#"]');
        if (anchor) {
          const href = anchor.getAttribute('href');
          if (href && href !== '#') {
            if (href === '#hero') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              return;
            }
            const targetEl = document.querySelector(href);
            if (targetEl) {
              e.preventDefault();
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      };

      document.addEventListener('click', handleAnchorClick);
      return () => document.removeEventListener('click', handleAnchorClick);
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      infinite: false,
    });

    Object.defineProperty(window, '__lenis', {
      value: lenis,
      writable: true,
      configurable: true,
      enumerable: false,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Provide globally accessible anchor scroll helper for navigation links on desktop
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href !== '#') {
          if (href === '#hero') {
            e.preventDefault();
            lenis.scrollTo(0, {
              duration: 1.2,
              easing: (t) => 1 - Math.pow(1 - t, 4),
            });
            return;
          }
          const targetEl = document.querySelector(href);
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl as HTMLElement, {
              offset: -80,
              duration: 1.4,
              easing: (t) => 1 - Math.pow(1 - t, 4),
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      if (window.__lenis === lenis) {
        window.__lenis = undefined;
      }
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
