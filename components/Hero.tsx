'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

interface HeroProps {
  onOpenProject: (projectId: string) => void;
  onExploreWorks: () => void;
}

export function Hero({ onOpenProject, onExploreWorks }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });



  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const rawY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const rawScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  const ySpring = useSpring(rawY, { stiffness: 90, damping: 22 });
  const opacitySpring = useSpring(rawOpacity, { stiffness: 90, damping: 22 });
  const scaleSpring = useSpring(rawScale, { stiffness: 90, damping: 22 });

  // On mobile touch devices, bypass continuous spring physics differential equations to conserve main thread
  const y = isMobile ? rawY : ySpring;
  const opacity = isMobile ? rawOpacity : opacitySpring;
  const scale = isMobile ? rawScale : scaleSpring;

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-4.5rem)] flex flex-col items-center justify-center bg-[#FAF8F5] py-6 sm:py-8 lg:py-[clamp(1.5rem,3.5vh,3.5rem)] overflow-hidden scroll-mt-20 box-border"
    >
      {/* Subtle Architectural Background Grid */}
      <div className="absolute inset-0 bg-grid-architectural opacity-30 pointer-events-none" />

      <motion.div
        style={{ y, opacity, scale }}
        className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 relative w-full flex flex-col items-center justify-center will-change-transform z-10"
      >
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center w-full">
          {/* Brand Anchor: Logo Mark on Top, Logo Words Below */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center mb-2 sm:mb-[clamp(0.75rem,2.2vh,1.75rem)] text-center select-none pointer-events-none"
          >
            {/* Logo Mark - Perfectly Scaled, Completely Still, Zero Background */}
            <div className="relative flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 md:w-[clamp(4.5rem,7.5vh,6.5rem)] md:h-[clamp(4.5rem,7.5vh,6.5rem)] mb-2 sm:mb-3 pointer-events-none bg-transparent">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo-mark.png"
                alt="Soul Space Infrastructure Logo Mark"
                className="w-full h-full object-contain pointer-events-none bg-transparent"
              />
            </div>

            {/* Logo Words Below Logo Mark */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2.5 leading-none">
              <span className="font-serif text-xl sm:text-3xl md:text-[34px] text-[#181715] font-normal tracking-[-0.015em] whitespace-nowrap">
                SOUL SPACE
              </span>
              <span
                className="font-sans font-thin text-sm sm:text-lg md:text-xl text-[#B8936D] opacity-60 select-none -translate-y-[1px] shrink-0"
                aria-hidden="true"
              >
                |
              </span>
              <span className="font-sans text-[8.5px] sm:text-[11px] md:text-[12px] font-light uppercase tracking-[0.24em] sm:tracking-[0.28em] text-[#7D7364] whitespace-nowrap pt-[2px]">
                INFRASTRUCTURE
              </span>
            </div>
          </motion.div>

          {/* Centered Headline — Increased size strictly on mobile screen & strictly one line */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(17.5px,5.25vw,24px)] sm:text-3xl md:text-4xl lg:text-[clamp(2.25rem,4.5vh,3rem)] text-[#1A1815] font-medium sm:font-normal tracking-[-0.025em] sm:tracking-[-0.03em] text-center w-full max-w-4xl mx-auto leading-tight px-1 sm:px-2 mt-2 sm:mt-3 whitespace-nowrap"
          >
            Crafting Spaces with Quality,{' '}
            <span className="italic text-[#B8936D] font-normal whitespace-nowrap">&amp; Enduring Value.</span>
          </motion.h1>

          {/* Centered Subtitle Description — Ample line-height and descender clearance for mobile */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#645D52] text-[12px] sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto font-light text-center px-4 mt-2 sm:mt-4 pb-1"
          >
            Exclusive luxury residences, gated villa enclaves, and landmark commercial IT workspaces across Coimbatore.
          </motion.p>

          {/* Centered Minimal Action — Layout-free, Premium Subtle Animated Trigger */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center mt-3 sm:mt-[clamp(0.75rem,2.5vh,2rem)]"
          >
            <button
              onClick={onExploreWorks}
              className="group inline-flex flex-col items-center justify-center gap-1 sm:gap-2 cursor-pointer bg-transparent border-none p-0 focus:outline-none transition-colors duration-300 text-center"
              aria-label="Explore Projects"
            >
              <span className="font-sans text-[8px] sm:text-[11px] font-normal sm:font-medium tracking-[0.2em] sm:tracking-[0.28em] uppercase text-[#6E6659] group-hover:text-[#B8936D] transition-colors duration-300 text-center">
                Explore Projects
              </span>
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center justify-center text-[#B8936D]/80 group-hover:text-[#B8936D]"
              >
                <svg
                  className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 transform group-hover:translate-y-0.5 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </motion.span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
