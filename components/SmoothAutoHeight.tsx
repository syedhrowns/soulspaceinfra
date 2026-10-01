'use client';

import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface SmoothAutoHeightProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  ease?: [number, number, number, number];
  animateOpacity?: boolean;
}

/**
 * SmoothAutoHeight: High-performance auto-animating layout container.
 * Automatically animates its height whenever children content, text length,
 * wrapped lines, or child dimensions change.
 * 
 * - Seamlessly transitions from current px height to new px height
 * - Holds exact pixel height to guarantee zero layout snapping from 'auto'
 * - Instant adaptation during window resize (no lag)
 * - Clean overflow management during transition
 * - Respects prefers-reduced-motion
 */
export function SmoothAutoHeight({
  children,
  className = '',
  duration = 0.38,
  ease = [0.16, 1, 0.3, 1],
  animateOpacity = false,
}: SmoothAutoHeightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isImmediate, setIsImmediate] = useState(true);
  const isFirstMount = useRef(true);
  const lastWidth = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();

  // Synchronously measure initial height on mount before first paint
  useLayoutEffect(() => {
    if (contentRef.current) {
      const initialH = contentRef.current.offsetHeight;
      const initialW = contentRef.current.offsetWidth;
      lastWidth.current = initialW;
      if (initialH > 0) {
        setHeight(initialH);
      }
    }
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const currentWidth = Math.round(entry.contentRect.width);
        const newHeight = Math.ceil(contentRef.current?.offsetHeight || entry.contentRect.height);

        // First mount bypass
        if (isFirstMount.current) {
          isFirstMount.current = false;
          lastWidth.current = currentWidth;
          if (newHeight > 0) {
            setHeight(newHeight);
          }
          return;
        }

        // Viewport / container width change (responsive resize) -> immediate update
        if (lastWidth.current !== currentWidth && lastWidth.current !== 0) {
          lastWidth.current = currentWidth;
          setIsImmediate(true);
          setHeight(newHeight);
          setIsTransitioning(false);
          return;
        }
        lastWidth.current = currentWidth;

        if (newHeight > 0) {
          if (prefersReducedMotion) {
            setIsImmediate(true);
            setHeight(newHeight);
            setIsTransitioning(false);
            return;
          }

          // Content height change -> animate smoothly
          setIsImmediate(false);
          setIsTransitioning(true);
          setHeight(newHeight);
        }
      }
    });

    observer.observe(contentRef.current);

    return () => {
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  return (
    <motion.div
      ref={containerRef}
      style={{ overflow: isTransitioning ? 'hidden' : 'visible' }}
      animate={{
        height: height !== undefined ? height : 'auto',
        ...(animateOpacity ? { opacity: 1 } : {}),
      }}
      initial={false}
      transition={
        prefersReducedMotion || isImmediate
          ? { duration: 0 }
          : {
              height: { duration, ease },
              opacity: { duration: duration * 0.7, ease },
            }
      }
      onAnimationComplete={() => {
        setIsTransitioning(false);
      }}
      className={className}
    >
      <div ref={contentRef} className="w-full">
        {children}
      </div>
    </motion.div>
  );
}
