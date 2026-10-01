'use client';

import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';

interface VasthuMorphPanelProps {
  activeKey: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * VasthuMorphPanel: State-of-the-art morphing container engineered specifically
 * for the Vastu Spatial Mandala right-hand content panel.
 * 
 * - Seamless physical height morphing between variable-height tab views
 * - Captures exact settled height prior to DOM mutation (zero snap on start)
 * - Dynamic duration scaling based on height delta (240ms - 420ms)
 * - Ultra-smooth luxury deceleration easing: cubic-bezier(0.16, 1, 0.3, 1)
 * - Outgoing content fades out smoothly with subtle translateY (-6px)
 * - Incoming content fades in with matching subtle translateY (6px -> 0)
 * - 100% interrupt-safe: rapid clicks capture live mid-flight bounding rect
 * - Resolves to height: auto & overflow: visible when settled for responsive agility
 * - Full prefers-reduced-motion accessibility support
 * - Window resize resilient
 */
export function VasthuMorphPanel({
  activeKey,
  children,
  className = '',
}: VasthuMorphPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const outgoingRef = useRef<HTMLDivElement>(null);
  const currentAnimRef = useRef<Animation | null>(null);

  // Store the settled height before any DOM update occurs
  const lastSettledHeightRef = useRef<number>(0);
  const isTransitioningRef = useRef<boolean>(false);

  // Track previous view for seamless cross-fade overlay
  const [outgoing, setOutgoing] = useState<{ key: string; node: React.ReactNode } | null>(null);

  const prevKeyRef = useRef(activeKey);
  const prevChildrenRef = useRef(children);
  const isInitialMount = useRef(true);

  // Synchronously update outgoing state during render when activeKey changes
  if (activeKey !== prevKeyRef.current) {
    setOutgoing({
      key: prevKeyRef.current,
      node: prevChildrenRef.current,
    });
    prevKeyRef.current = activeKey;
    prevChildrenRef.current = children;
  } else {
    // Keep children ref fresh
    prevChildrenRef.current = children;
  }

  // Continuously track settled height via ResizeObserver when not transitioning
  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver(() => {
      if (!isTransitioningRef.current && contentRef.current) {
        lastSettledHeightRef.current = Math.max(
          contentRef.current.offsetHeight,
          contentRef.current.scrollHeight
        );
      }
    });

    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (contentRef.current) {
        lastSettledHeightRef.current = Math.max(
          contentRef.current.offsetHeight,
          contentRef.current.scrollHeight
        );
      }
      if (containerRef.current) {
        containerRef.current.style.height = 'auto';
        containerRef.current.style.overflow = 'visible';
      }
      return;
    }

    if (!outgoing || !containerRef.current || !contentRef.current) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Capture instantaneous starting height:
    // If interrupted mid-flight, read the exact live bounding rect
    // If starting from settled state, use the accurate lastSettledHeight
    let fromH = 0;
    if (currentAnimRef.current) {
      fromH = containerRef.current.getBoundingClientRect().height;
      currentAnimRef.current.cancel();
      currentAnimRef.current = null;
    } else {
      fromH = lastSettledHeightRef.current || Math.max(containerRef.current.offsetHeight, containerRef.current.scrollHeight);
    }

    const toH = Math.max(contentRef.current.offsetHeight, contentRef.current.scrollHeight);
    const delta = Math.abs(toH - fromH);

    // Dynamic duration scaling: small delta (~20px) -> ~240ms, large delta (~120px) -> ~360ms
    const duration = prefersReducedMotion
      ? 0
      : Math.min(420, Math.max(240, 220 + (delta / 400) * 200));

    if (duration === 0 || delta < 0.5) {
      containerRef.current.style.height = 'auto';
      containerRef.current.style.overflow = 'visible';
      lastSettledHeightRef.current = toH;
      isTransitioningRef.current = false;
      setOutgoing(null);
      return;
    }

    isTransitioningRef.current = true;
    containerRef.current.style.overflow = 'hidden';

    // Animate container height using WAAPI with luxury deceleration easing
    const anim = containerRef.current.animate(
      [
        { height: `${fromH}px` },
        { height: `${toH}px` },
      ],
      {
        duration,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards',
      }
    );
    currentAnimRef.current = anim;

    // Animate outgoing content: swift fade out with subtle upward drift
    const exitDuration = Math.min(190, duration * 0.65);
    outgoingRef.current?.animate(
      [
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(-6px)' },
      ],
      {
        duration: exitDuration,
        easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
        fill: 'forwards',
      }
    );

    // Animate incoming content: gentle fade in with subtle upward glide
    contentRef.current.animate(
      [
        { opacity: 0, transform: 'translateY(6px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      {
        duration,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards',
      }
    );

    anim.onfinish = () => {
      anim.cancel();
      if (containerRef.current) {
        containerRef.current.style.height = 'auto';
        containerRef.current.style.overflow = 'visible';
      }
      lastSettledHeightRef.current = toH;
      isTransitioningRef.current = false;
      setOutgoing(null);
      currentAnimRef.current = null;
    };
  }, [outgoing, activeKey]);

  // Window resize handler: immediately reset to natural auto height
  useEffect(() => {
    const handleResize = () => {
      if (currentAnimRef.current) {
        currentAnimRef.current.cancel();
        currentAnimRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.style.height = 'auto';
        containerRef.current.style.overflow = 'visible';
      }
      if (contentRef.current) {
        lastSettledHeightRef.current = Math.max(
          contentRef.current.offsetHeight,
          contentRef.current.scrollHeight
        );
      }
      isTransitioningRef.current = false;
      setOutgoing(null);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flow-root ${className}`}
      style={{ overflow: outgoing ? 'hidden' : 'visible' }}
    >
      {/* Outgoing previous view during transition */}
      {outgoing && (
        <div
          ref={outgoingRef}
          key={`outgoing-${outgoing.key}`}
          className="absolute top-0 left-0 right-0 w-full pointer-events-none z-0 flow-root"
        >
          {outgoing.node}
        </div>
      )}

      {/* Incoming / Active view */}
      <div
        ref={contentRef}
        key={`active-${activeKey}`}
        className="relative w-full z-10 flow-root"
      >
        {children}
      </div>
    </div>
  );
}
