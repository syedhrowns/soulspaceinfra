'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, HTMLMotionProps } from 'motion/react';

interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  xOffset?: number;
  scale?: number;
  blur?: boolean;
  className?: string;
  amount?: number | 'some' | 'all';
}

/**
 * Ultra-smooth, buttery scroll reveal component with hardware acceleration
 */
export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.65,
  yOffset = 28,
  xOffset = 0,
  scale = 0.99,
  blur = true,
  className = '',
  amount = 0.05,
  ...props
}: ScrollRevealProps) {
  const [effectiveXOffset, setEffectiveXOffset] = React.useState(0);
  const [effectiveScale, setEffectiveScale] = React.useState(1);
  const [allowBlur, setAllowBlur] = React.useState(blur);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDesktop = window.innerWidth >= 768;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        setAllowBlur(blur);
      }
      if (isDesktop && !prefersReduced) {
        setEffectiveXOffset(xOffset);
        setEffectiveScale(scale);
      }
    }
  }, [xOffset, blur, scale]);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: yOffset,
        x: effectiveXOffset,
        scale: effectiveScale,
        ...(allowBlur ? { filter: 'blur(2.5px)' } : {}),
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        ...(allowBlur ? { filter: 'blur(0px)' } : {}),
      }}
      viewport={{
        once: true,
        amount: amount,
        margin: '0px 0px 40px 0px',
      }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Editorial custom cubic bezier
      }}
      onAnimationComplete={() => {
        setHasAnimated(true);
      }}
      style={{
        willChange: hasAnimated ? 'auto' : 'transform, opacity',
        backfaceVisibility: 'hidden',
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Fluid Stagger Container for list items, partner cards, and grids
 */
export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.12,
  amount = 0.05,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  amount?: number | 'some' | 'all';
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: amount,
        margin: '0px 0px 60px 0px',
      }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.04,
          },
        },
      }}
      style={{
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Item with soft fluid arrival
 */
export function StaggerItem({
  children,
  className = '',
  yOffset = 32,
  scale = 0.985,
  blur = true,
  duration = 0.7,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
  scale?: number;
  blur?: boolean;
  duration?: number;
} & HTMLMotionProps<'div'>) {
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDesktop(window.innerWidth >= 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  const effectiveScale = isDesktop ? scale : 1;
  const effectiveBlur = blur;

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: yOffset,
          scale: effectiveScale,
          filter: effectiveBlur ? 'blur(2px)' : 'none',
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: effectiveBlur ? 'blur(0px)' : 'none',
          transition: {
            duration,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      style={{
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Top Architectural Scroll Progress Indicator Bar with physics spring
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  const scaleXSpring = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 20,
    restDelta: 0.0005,
  });

  const scaleX = isMobile ? scrollYProgress : scaleXSpring;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#B8936D] origin-left z-[100] pointer-events-none shadow-[0_0_12px_rgba(184,147,109,0.6)]"
      style={{ scaleX }}
    />
  );
}

/**
 * Smooth Parallax Image container that glides with scrolling
 */
export function ParallaxContainer({
  children,
  className = '',
  speed = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-speed * 100, speed * 100]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 25 });

  return (
    <div ref={ref} className={`overflow-hidden relative ${className}`}>
      <motion.div
        style={{
          y: smoothY,
          willChange: 'transform',
          transform: 'translate3d(0,0,0)',
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
