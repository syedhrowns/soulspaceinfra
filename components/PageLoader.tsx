'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECTS } from '@/data/projects';

// Elegant, luxurious duration of 1 full completed animation cycle passing through the logo and text (2200ms)
export const ANIMATION_CYCLE_DURATION = 2200;

/**
 * Calculates the exact millisecond delay required to complete the CURRENT animation iteration.
 * - Always ensures at least 1 snappy iteration (cycle 1 = 800ms).
 * - If currently inside cycle N (where N >= 2), completes cycle N cleanly.
 * - If right at the boundary (within 40ms of a cycle completion), finishes at that boundary.
 */
export function calculateIterationCompletionDelay(
  startTime: number,
  cycleDuration: number = ANIMATION_CYCLE_DURATION
): number {
  const elapsed = Math.max(0, Date.now() - startTime);

  // If we haven't finished even 1 full cycle, wait until 1 full cycle completes
  if (elapsed <= cycleDuration) {
    return cycleDuration - elapsed;
  }

  const completedCycles = Math.floor(elapsed / cycleDuration);
  const progressInCurrentCycle = elapsed % cycleDuration;

  // Boundary check: if we just crossed into the next cycle by <= 40ms,
  // we consider the previous cycle completed cleanly.
  if (progressInCurrentCycle <= 40) {
    return 0;
  }

  // Otherwise, wait until this current iteration finishes smoothly
  const targetElapsed = (completedCycles + 1) * cycleDuration;
  return targetElapsed - elapsed;
}

/**
 * Preload only essential assets in the background during the loading animation
 * so that when the curtain opens, the user receives an instantaneous, seamless experience
 * without saturating network bandwidth on unnecessary offscreen assets.
 */
function preloadCriticalAssets(targetHref?: string) {
  if (typeof window === 'undefined') return;

  try {
    // 1. Always ensure logo mark is preloaded
    const logoImg = new Image();
    logoImg.src = '/brand/logo-mark.png';

    // 2. Preload target project hero image ONLY if navigating to a specific project
    if (targetHref && targetHref.includes('/projects/')) {
      const slug = targetHref.replace(/.*\/projects\//, '').split('/')[0].split('?')[0].split('#')[0];
      const project = PROJECTS.find((p) => p.id === slug);
      if (project?.heroImage) {
        const heroImg = new Image();
        heroImg.src = project.heroImage;
      }
    }
  } catch {
    // Graceful fallback
  }
}

/**
 * Reusable animated luxury brand display with continuous light glide across both mark and typography.
 * Smoothly loops seamlessly via pure hardware-accelerated CSS keyframes at constant speed (2.6s cycle).
 */
export function LoadingBrandDisplay() {
  const logoSrc = '/brand/logo-mark.png';

  return (
    <div className="inline-flex items-center gap-3 sm:gap-4 md:gap-5 select-none py-3 px-2 leading-none pointer-events-none">
      {/* Animated Logo Mark Image at Left Side - Zero background, rock-solid stationary */}
      <div className="relative shrink-0 flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 pointer-events-none">
        {/* Base structural mark - always crisp solid dark charcoal */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt="Soul Space Logo Mark"
          className="w-full h-full object-contain pointer-events-none bg-transparent"
        />
        {/* Continuous light glide mask, running in unified single coordinate flow */}
        <div
          className="absolute inset-0 animate-flow-light-glide-mask pointer-events-none"
          style={{
            WebkitMaskImage: `url(${logoSrc})`,
            maskImage: `url(${logoSrc})`,
          }}
        />
      </div>

      {/* Typography with unified single continuous light glide running simultaneously */}
      <div className="animate-flow-light-glide inline-flex items-center gap-1.5 sm:gap-3 md:gap-3.5 select-none leading-none max-w-full overflow-hidden px-1">
        <span className="font-serif text-[18px] min-[360px]:text-[22px] min-[400px]:text-[26px] sm:text-[38px] md:text-[46px] font-normal tracking-[-0.015em] whitespace-nowrap">
          SOUL SPACE
        </span>
        <span
          className="font-sans font-thin text-[12px] sm:text-[24px] md:text-[30px] opacity-40 select-none -translate-y-[1px] shrink-0"
          aria-hidden="true"
        >
          |
        </span>
        <span className="font-sans text-[7.5px] min-[360px]:text-[8.5px] min-[400px]:text-[10px] sm:text-[12px] md:text-[14px] font-light uppercase tracking-[0.14em] min-[360px]:tracking-[0.2em] sm:tracking-[0.28em] whitespace-nowrap opacity-85 pt-[2px]">
          INFRASTRUCTURE
        </span>
      </div>
    </div>
  );
}

/**
 * Programmatic helper to trigger the page transition loader from any component.
 */
export function navigateWithLoader(url: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('soulspace-navigate', { detail: { url } }));
  }
}

export function usePageTransition() {
  return {
    navigate: navigateWithLoader,
  };
}

export function PageLoader() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const [isVisible, setIsVisible] = useState(true);
  const [loaderKey, setLoaderKey] = useState(0);

  const startTimeRef = useRef<number>(0);
  const isPageReadyRef = useRef<boolean>(false);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const targetPathRef = useRef<string | null>(null);
  const isNavigatingRef = useRef<boolean>(false);
  const currentPathRef = useRef<string>(pathname);

  // Sync current pathname
  useEffect(() => {
    currentPathRef.current = pathname;
  }, [pathname]);

  // Dismiss loader cleanly at the exact completion of the current animation iteration
  const markPageReady = useCallback(() => {
    isPageReadyRef.current = true;

    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }

    const startTime = startTimeRef.current || Date.now();
    const elapsed = Math.max(0, Date.now() - startTime);

    // Guaranteed minimum display duration: whenever loader is shown, ensure at least 1 full 2200ms cycle
    const remainingInCycle = ANIMATION_CYCLE_DURATION > elapsed ? ANIMATION_CYCLE_DURATION - elapsed : 0;
    const iterationDelay = calculateIterationCompletionDelay(startTime, ANIMATION_CYCLE_DURATION);
    const delay = Math.max(remainingInCycle, iterationDelay);

    dismissTimerRef.current = setTimeout(() => {
      // Guarantee scroll position starts cleanly at top when page opens
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        (window as any).__lenis.scrollTo(0, { immediate: true });
      }

      // If URL has a hash, smoothly scroll to it after reveal
      if (typeof window !== 'undefined' && window.location.hash) {
        const hashEl = document.getElementById(window.location.hash.slice(1));
        if (hashEl) {
          setTimeout(() => {
            hashEl.scrollIntoView({ behavior: 'smooth' });
          }, 80);
        }
      }

      setIsVisible(false);
      isNavigatingRef.current = false;
      targetPathRef.current = null;
      document.body.style.overflow = '';
      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current);
        safetyTimerRef.current = null;
      }
      dismissTimerRef.current = null;
    }, delay);
  }, []);

  // Initiate a new page transition:
  // Shows the loading page, starts animation from t=0, and navigates
  const startPageTransition = useCallback(
    (targetHref: string) => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current);
        safetyTimerRef.current = null;
      }

      let targetPath = targetHref;
      try {
        const parsed = new URL(targetHref, window.location.href);
        targetPath = parsed.pathname;
      } catch {
        // fallback
      }

      isNavigatingRef.current = true;
      isPageReadyRef.current = false;
      targetPathRef.current = targetPath;
      startTimeRef.current = Date.now();

      // Lock scrolling so page doesn't scroll behind loader
      document.body.style.overflow = 'hidden';

      // Increment loaderKey to cleanly remount and restart animation at 0%
      setLoaderKey((prev) => prev + 1);
      setIsVisible(true);

      // Preload critical assets in background during loading animation
      preloadCriticalAssets(targetHref);

      // Safety timeout: dismiss after 39s (15 complete cycles) if navigation completely hangs
      safetyTimerRef.current = setTimeout(() => {
        markPageReady();
      }, 39000);

      // Trigger Next.js client-side navigation
      try {
        router.push(targetHref);
      } catch (err) {
        console.error('Navigation error, falling back to window.location:', err);
        window.location.href = targetHref;
      }
    },
    [router, markPageReady]
  );

  // Initial site mount: show loading page and complete at least 1 full animation cycle
  useEffect(() => {
    startTimeRef.current = Date.now();
    targetPathRef.current = pathname;
    document.body.style.overflow = 'hidden';

    // Preload critical assets in background during initial animation cycle
    preloadCriticalAssets();

    let isMounted = true;

    const onInitialReady = () => {
      if (!isMounted) return;
      // When document and fonts are ready, mark page ready (will complete current cycle)
      if (document.fonts?.ready) {
        document.fonts.ready
          .then(() => {
            if (isMounted) markPageReady();
          })
          .catch(() => {
            if (isMounted) markPageReady();
          });
      } else {
        markPageReady();
      }
    };

    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      onInitialReady();
    } else {
      document.addEventListener('DOMContentLoaded', onInitialReady, { once: true });
    }

    // Safety timeout after 15 cycles (39s)
    safetyTimerRef.current = setTimeout(() => {
      if (isMounted) markPageReady();
    }, 39000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
        if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
        setIsVisible(false);
        isNavigatingRef.current = false;
        document.body.style.overflow = '';
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      isMounted = false;
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current);
        safetyTimerRef.current = null;
      }
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [markPageReady]);

  // When pathname changes (new route has mounted): schedule dismissal at end of current cycle
  useEffect(() => {
    if (isNavigatingRef.current || (targetPathRef.current && pathname === targetPathRef.current)) {
      // Let React and Next.js finish layout and paint
      const raf = requestAnimationFrame(() => {
        setTimeout(() => {
          markPageReady();
        }, 60);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [pathname, markPageReady]);

  // Handle browser Back / Forward navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const nextPath = window.location.pathname;
      if (nextPath === currentPathRef.current) return;
      currentPathRef.current = nextPath;

      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
      isNavigatingRef.current = true;
      isPageReadyRef.current = false;
      targetPathRef.current = nextPath;
      startTimeRef.current = Date.now();
      setLoaderKey((prev) => prev + 1);
      setIsVisible(true);
      document.body.style.overflow = 'hidden';

      preloadCriticalAssets(nextPath);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Listen to custom navigation events
  useEffect(() => {
    const handleCustomNavigate = (e: Event) => {
      const customEvent = e as CustomEvent<{ url: string }>;
      if (customEvent.detail?.url) {
        startPageTransition(customEvent.detail.url);
      }
    };
    window.addEventListener('soulspace-navigate', handleCustomNavigate);
    return () => window.removeEventListener('soulspace-navigate', handleCustomNavigate);
  }, [startPageTransition]);

  // Intercept all internal link clicks across the application
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Primary left click only, without modifier keys
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      // Find nearest anchor tag
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Skip external, target=_blank, download, mailto, tel, javascript
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('//') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        anchor.getAttribute('target') === '_blank' ||
        anchor.hasAttribute('download')
      ) {
        return;
      }

      // Skip pure in-page hash links (e.g. #works, #philosophy, #hero)
      if (href.startsWith('#')) {
        return;
      }

      let targetUrl: URL;
      try {
        targetUrl = new URL(href, window.location.href);
      } catch {
        return;
      }

      // Only handle same origin
      if (targetUrl.origin !== window.location.origin) {
        return;
      }

      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;

      // If navigating to the exact same page & search query:
      if (targetUrl.pathname === currentPath && targetUrl.search === currentSearch) {
        if (targetUrl.hash) {
          // Let hash scrolling proceed normally
          return;
        }
        e.preventDefault();
        return;
      }

      // If already navigating to this target, prevent double action
      if (isNavigatingRef.current) {
        e.preventDefault();
        return;
      }

      // Real navigation to a new page!
      e.preventDefault();
      startPageTransition(targetUrl.pathname + targetUrl.search + targetUrl.hash);
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => document.removeEventListener('click', handleGlobalClick, { capture: true });
  }, [startPageTransition]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="soul-space-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { ease: [0.16, 1, 0.3, 1], duration: 0.55 },
          }}
          onAnimationComplete={() => {
            if (!isVisible) {
              document.body.style.overflow = '';
            }
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F7F5F0] text-[#1D1B18] select-none overflow-hidden"
          id="global-page-loader"
        >
          {/* Centered brand lockup with single continuous uniform light glide */}
          <div className="flex items-center justify-center px-6 pointer-events-none">
            <LoadingBrandDisplay key={`brand-display-${loaderKey}`} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
