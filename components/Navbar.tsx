'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, Layers, Send, Phone, MessageSquare, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECTS } from '@/data/projects';
import { useScrollLock } from '@/lib/scrollLock';
import { BrandLogo } from '@/components/BrandLogo';

interface NavbarProps {
  onOpenProject: (projectId: string) => void;
  onOpenCommission: () => void;
}

export function Navbar({ onOpenProject, onOpenCommission }: NavbarProps) {
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [logoMotion, setLogoMotion] = useState<'idle' | 'down' | 'up'>('idle');
  const [hasScrolledPastTop, setHasScrolledPastTop] = useState(false);
  const lastScrollY = React.useRef(0);
  const lastIsScrolledDown = React.useRef(false);
  const motionTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [indexDrawerOpen, setIndexDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock background scroll when floating sections/drawers are open
  useScrollLock(mobileMenuOpen || indexDrawerOpen);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const triggerMotion = (targetScrolledDown: boolean) => {
      if (lastIsScrolledDown.current === targetScrolledDown) return;
      lastIsScrolledDown.current = targetScrolledDown;
      setIsScrolledDown(targetScrolledDown);

      if (motionTimerRef.current) {
        clearTimeout(motionTimerRef.current);
      }

      if (targetScrolledDown) {
        setLogoMotion('down');
        // Delay (180ms) + Duration (520ms) = 700ms total travel time
        motionTimerRef.current = setTimeout(() => {
          setLogoMotion('idle');
        }, 700);
      } else {
        setLogoMotion('up');
        // Delay (0ms) + Duration (500ms) = 500ms total travel time
        motionTimerRef.current = setTimeout(() => {
          setLogoMotion('idle');
        }, 510);
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      setHasScrolledPastTop(currentScrollY > 20);

      // Adaptive delta threshold: larger on mobile touch devices to eliminate micro-jitter frame drops
      const threshold = window.innerWidth < 768 ? 18 : 6;

      // If near the absolute top, always return to initial corner state
      if (currentScrollY <= 40) {
        triggerMotion(false);
      } else if (delta > threshold && currentScrollY > 60) {
        // Scrolling down -> buttons disappear with blur effect, logo moves to center
        triggerMotion(true);
      } else if (delta < -threshold) {
        // Scrolling up -> logo returns to left corner with blur, buttons appear
        triggerMotion(false);
      }

      lastScrollY.current = currentScrollY;
    };

    let ticking = false;
    const handleScrollWithRaf = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScrollWithRaf, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollWithRaf);
      if (motionTimerRef.current) {
        clearTimeout(motionTimerRef.current);
      }
    };
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    setIndexDrawerOpen(false);

    // If target is hero (top of page)
    if (id === 'hero') {
      if (typeof window !== 'undefined' && !document.getElementById('hero')) {
        window.location.href = '/';
        return;
      }
      if (lastIsScrolledDown.current) {
        lastIsScrolledDown.current = false;
        setIsScrolledDown(false);
        setLogoMotion('up');
        if (motionTimerRef.current) clearTimeout(motionTimerRef.current);
        motionTimerRef.current = setTimeout(() => {
          setLogoMotion('idle');
        }, 510);
      }
    }

    // If on a subpage where the target section element does not exist, navigate to homepage section
    const el = document.getElementById(id);
    if (!el && typeof window !== 'undefined') {
      window.location.href = `/#${id}`;
      return;
    }

    // Force unlock scroll and restart Lenis immediately so the scroll is not blocked by drawer lock
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('lenis-stopped');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      if (window.__lenis) {
        window.__lenis.start();
      }
    }

    // Execute scroll after drawer unmount starts
    setTimeout(() => {
      const targetEl = id === 'hero' ? null : document.getElementById(id);
      if (typeof window !== 'undefined') {
        if (window.__lenis) {
          if (id === 'hero' || !targetEl) {
            window.__lenis.scrollTo(0, { duration: 1.2 });
          } else {
            window.__lenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
          }
        } else {
          if (id === 'hero' || !targetEl) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }, 60);
  };

  // High-end spring transitions
  const springConfig = { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 } as const;
  const fadeConfig = { duration: 0.5, ease: [0.16, 1, 0.3, 1] } as const;

  return (
    <>
      {/* Primary Sticky Navigation with Frosted Glassmorphism matching Project Page */}
      <header
        id="main-navigation"
        className={`sticky top-0 z-50 py-3 sm:py-4 transition-[background-color,backdrop-filter] duration-500 border-none ${
          hasScrolledPastTop
            ? 'glassmorphic-header shadow-none'
            : 'bg-transparent shadow-none'
        }`}
        style={hasScrolledPastTop ? {
          backgroundColor: 'rgba(247, 244, 237, 0.48)',
          backdropFilter: 'blur(28px) saturate(200%)',
          WebkitBackdropFilter: 'blur(28px) saturate(200%)',
        } : undefined}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10 relative">
          {/* Logo - Smoothly glides between left corner and center; blur effect active strictly while moving */}
          <div
            id="navbar-brand-container"
            onTransitionEnd={(e) => {
              if (e.target === e.currentTarget && (e.propertyName === 'left' || e.propertyName === 'transform')) {
                setLogoMotion('idle');
              }
            }}
            onTransitionCancel={(e) => {
              if (e.target === e.currentTarget) {
                setLogoMotion('idle');
              }
            }}
            className={`absolute top-1/2 z-20 shrink-0 flex items-center ${
              isScrolledDown ? 'left-1/2' : 'left-4 sm:left-6 lg:left-8'
            } ${
              logoMotion === 'down'
                ? 'logo-blur-moving-down'
                : logoMotion === 'up'
                ? 'logo-blur-moving-up'
                : 'logo-blur-idle'
            }`}
            style={{
              transform: isScrolledDown ? 'translate(-50%, -50%)' : 'translate(0, -50%)',
              willChange: 'left, transform, filter',
              transition: isScrolledDown
                ? 'left 0.52s cubic-bezier(0.16, 1, 0.3, 1) 0.18s, transform 0.52s cubic-bezier(0.16, 1, 0.3, 1) 0.18s'
                : 'left 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0s',
            }}
          >
            <button
              onClick={() => scrollTo('hero')}
              className="text-left group cursor-pointer focus:outline-hidden shrink-0 flex items-center bg-transparent border-none shadow-none p-0"
              id="brand-home-link"
              aria-label="Soul Space Infrastructure Home"
            >
              <BrandLogo variant="nav" />
            </button>
          </div>

          {/* Right Section: Project Inquiry + Menu Toggle (Fades/blurs out when scrolling down) */}
          <div
            className="ml-auto flex items-center gap-x-2.5 sm:gap-x-3 shrink-0 z-20"
            style={{
              opacity: isScrolledDown ? 0 : 1,
              filter: isScrolledDown ? 'blur(8px)' : 'blur(0px)',
              pointerEvents: isScrolledDown ? 'none' : 'auto',
              transform: isScrolledDown ? 'scale(0.95)' : 'scale(1)',
              willChange: 'opacity, filter, transform',
              transition: isScrolledDown
                ? 'opacity 0.28s ease, filter 0.28s ease, transform 0.28s ease'
                : 'opacity 0.38s ease 0.18s, filter 0.38s ease 0.18s, transform 0.38s ease 0.18s',
            }}
          >
            {/* About Practice Link */}
            <Link
              href="/about"
              style={{ height: '36.5px' }}
              className="hidden md:inline-flex items-center px-3.5 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#181714] hover:text-[#B8936D] transition-colors whitespace-nowrap"
              id="nav-about-link"
            >
              <span>About</span>
            </Link>

            {/* Project Inquiry Button */}
            <button
              onClick={() => onOpenCommission()}
              style={{ height: '36.5px' }}
              className="hidden sm:flex items-center gap-2 px-4 text-[11px] tracking-[0.2em] uppercase font-semibold bg-[#181715] text-white rounded-full transition-all cursor-pointer border border-[#2D2A26] hover:border-[#CBB8A0] shadow-none whitespace-nowrap group"
              id="nav-project-inquiry-btn"
            >
              <Send className="w-3.5 h-3.5 text-white/90" />
              <span className="text-[11px]">Project Inquiry</span>
            </button>

            {/* Menu Toggle Button - Clean 3 lines without container layout */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 sm:p-1.5 text-[#1D1B18] hover:text-[#B8936D] focus:outline-hidden cursor-pointer transition-colors bg-transparent border-none shadow-none flex items-center justify-center min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0"
              id="mobile-nav-toggle-btn"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 sm:w-6 sm:h-6" /> : <Menu className="w-6 h-6 sm:w-6 sm:h-6 stroke-[1.75]" />}
            </button>
          </div>
        </div>
      </header>

      {/* Floating Centered Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu-drawer"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overscroll-contain"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="bg-[#FAF8F5] text-[#181714] w-full max-w-[390px] sm:max-w-[430px] p-4 sm:p-8 flex flex-col items-center text-center border border-[#DCD5C8] rounded-2xl shadow-[0_24px_50px_-12px_rgba(0,0,0,0.25)] relative max-h-[88vh] overflow-y-auto overscroll-contain"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button Top Right */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 text-[#7D7364] hover:text-[#181714] border border-transparent hover:border-[#CBB8A0] rounded-full transition-colors cursor-pointer min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                id="mobile-menu-close-btn"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Brand Logo Centered */}
              <div className="flex flex-col items-center text-center pt-2 pb-5 border-b border-[#E5DFD4] w-full">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollTo('hero');
                  }}
                  className="cursor-pointer focus:outline-hidden"
                  aria-label="Scroll to top"
                  id="drawer-brand-logo-link"
                >
                  <BrandLogo variant="drawer" theme="light" />
                </button>
                <p className="text-[9.5px] tracking-[0.24em] text-[#7D7364] uppercase mt-2 font-sans font-medium">
                  Coimbatore, Tamil Nadu
                </p>
              </div>

              {/* Navigation Links Centered */}
              <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2.5 py-4 w-full">
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center font-serif text-lg sm:text-3xl text-[#181714] hover:text-[#B8936D] transition-colors cursor-pointer w-full py-2 sm:py-0.5 min-h-[44px] flex items-center justify-center tracking-[-0.01em]"
                  id="mobile-link-about"
                >
                  About Practice
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollTo('works');
                  }}
                  className="text-center font-serif text-lg sm:text-3xl text-[#181714] hover:text-[#B8936D] transition-colors cursor-pointer w-full py-2 sm:py-0.5 min-h-[44px] flex items-center justify-center tracking-[-0.01em]"
                  id="mobile-link-works"
                >
                  Projects
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollTo('philosophy');
                  }}
                  className="text-center font-serif text-lg sm:text-3xl text-[#181714] hover:text-[#B8936D] transition-colors cursor-pointer w-full py-2 sm:py-0.5 min-h-[44px] flex items-center justify-center tracking-[-0.01em]"
                  id="mobile-link-philosophy"
                >
                  Philosophy
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollTo('materiality');
                  }}
                  className="text-center font-serif text-lg sm:text-3xl text-[#181714] hover:text-[#B8936D] transition-colors cursor-pointer w-full py-2 sm:py-0.5 min-h-[44px] flex items-center justify-center tracking-[-0.01em]"
                  id="mobile-link-materiality"
                >
                  Materiality
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollTo('journal');
                  }}
                  className="text-center font-serif text-lg sm:text-3xl text-[#181714] hover:text-[#B8936D] transition-colors cursor-pointer w-full py-2 sm:py-0.5 min-h-[44px] flex items-center justify-center tracking-[-0.01em]"
                  id="mobile-link-journal"
                >
                  Journal
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollTo('services');
                  }}
                  className="text-center font-serif text-lg sm:text-3xl text-[#181714] hover:text-[#B8936D] transition-colors cursor-pointer w-full py-2 sm:py-0.5 min-h-[44px] flex items-center justify-center tracking-[-0.01em]"
                  id="mobile-link-services"
                >
                  Services
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollTo('map');
                  }}
                  className="text-center font-serif text-lg sm:text-3xl text-[#181714] hover:text-[#B8936D] transition-colors cursor-pointer w-full py-2 sm:py-0.5 min-h-[44px] flex items-center justify-center tracking-[-0.01em]"
                  id="mobile-link-map"
                >
                  Footprint Map
                </button>
              </div>

              {/* Inquire CTA & Contacts Centered */}
              <div className="border-t border-[#E5DFD4] pt-5 space-y-3.5 w-full flex flex-col items-center text-center">
                <button
                  onClick={() => {
                    scrollTo('inquiries');
                  }}
                  className="w-full py-3 bg-[#181715] text-[#FAF8F5] font-semibold tracking-[0.18em] uppercase text-[11px] rounded-full border border-[#2D2A26] hover:border-[#CBB8A0] transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-none"
                  id="mobile-commission-btn"
                >
                  <span>Project Inquiry</span>
                  <ArrowUpRight className="w-4 h-4 text-[#C5A880]" />
                </button>

                <div className="flex flex-col items-center justify-center gap-2.5 text-center text-[11px] text-[#5C5346] w-full pt-1">
                  {/* Both Direct Phone Call Links */}
                  <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
                    <Phone className="w-3.5 h-3.5 text-[#B8936D] shrink-0" />
                    <a
                      href="tel:+919677771331"
                      className="font-medium text-[#181714] hover:text-[#B8936D] transition-colors py-0.5"
                      aria-label="Call +91 96777 71331"
                    >
                      +91 96777 71331
                    </a>
                    <span className="text-[#A89F91]">/</span>
                    <a
                      href="tel:+919159133331"
                      className="font-medium text-[#181714] hover:text-[#B8936D] transition-colors py-0.5"
                      aria-label="Call +91 91591 33331"
                    >
                      +91 91591 33331
                    </a>
                  </div>

                  {/* Both WhatsApp Direct Chat Links */}
                  <div className="flex items-center justify-center gap-2.5 text-[10.5px] font-medium text-[#181714] flex-wrap">
                    <a
                      href="https://wa.me/919677771331?text=Hello%20Soul%20Space%20Infrastructure%2C%20I%20would%20like%20to%20inquire%20about%20your%20projects."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-[#B8936D] transition-colors py-0.5"
                      aria-label="Chat on WhatsApp +91 96777 71331"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#B8936D] shrink-0" />
                      <span>WhatsApp: +91 96777 71331</span>
                    </a>
                    <span className="text-[#A89F91] hidden sm:inline">&bull;</span>
                    <a
                      href="https://wa.me/919159133331?text=Hello%20Soul%20Space%20Infrastructure%2C%20I%20would%20like%20to%20inquire%20about%20your%20projects."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-[#B8936D] transition-colors py-0.5"
                      aria-label="Chat on WhatsApp +91 91591 33331"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#B8936D] shrink-0" />
                      <span>WhatsApp: +91 91591 33331</span>
                    </a>
                  </div>

                  {/* Location Address Centered with MapPin Icon */}
                  <a
                    href="https://maps.google.com/?q=Soul+Space+Infrastructure,+No+5/2,+Hindustan+Avenue,+Nava+India+Road,+Sowripalayam+Post,+Coimbatore+-+641028"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center text-[10px] tracking-wider text-[#7D7364] hover:text-[#B8936D] pt-1 transition-colors group text-center"
                    aria-label="View Soul Space Registered Office on Google Maps"
                  >
                    <div className="inline-flex items-center justify-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#B8936D] shrink-0" />
                      <span className="hover:underline underline-offset-2">No 5/2, Hindustan Avenue, Nava India Road,</span>
                    </div>
                    <span className="hover:underline underline-offset-2 mt-0.5">
                      Sowripalayam Post, Coimbatore - 641028
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Archive Centered Index Modal */}
      <AnimatePresence>
        {indexDrawerOpen && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overscroll-contain"
            onClick={() => setIndexDrawerOpen(false)}
          >
            <motion.div
              data-lenis-prevent
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-[#ECE7DF] text-[#1C1A17] w-full max-w-2xl max-h-[85vh] overflow-y-auto overscroll-contain p-6 sm:p-10 flex flex-col border border-[#D8D0C2] rounded-xl shadow-none relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#D5CDBF] pb-6 mb-8">
                  <div>
                    <div className="flex items-center gap-2 text-[#B8936D] text-[9.5px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold">
                      <Layers className="w-3.5 h-3.5" />
                      <span>ARCHIVAL CATALOG INDEX</span>
                    </div>
                    <h3 className="font-serif text-lg sm:text-2xl text-[#181714] mt-1 font-normal">All Built Monoliths</h3>
                  </div>
                  <button
                    onClick={() => setIndexDrawerOpen(false)}
                    className="p-1.5 sm:p-2 text-[#6E6457] hover:text-[#181714] rounded-full bg-[#E8E2D7] border border-[#DDD5C7] hover:border-[#CBB8A0] transition-colors cursor-pointer min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                    aria-label="Close archive drawer"
                    id="close-index-drawer-btn"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                <p className="text-[11px] sm:text-xs text-[#5C5346] mb-4 sm:mb-6 leading-relaxed font-light">
                  Comprehensive index of residential enclaves, luxury villas, and commercial IT developments by Soul Space Infrastructure.
                </p>

                <div className="space-y-2.5 sm:space-y-3">
                  {PROJECTS.map((p) => (
                    <div
                      key={p.id}
                      className="w-full text-left p-3 sm:p-4 border border-[#DCD5C8] hover:border-[#CBB8A0] bg-[#FAF8F4] rounded-xl transition-all group shadow-none"
                      id={`index-item-${p.id}`}
                    >
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#786E5F] tracking-widest uppercase mb-1 font-medium">
                        <span className="font-sans text-[#B8936D] font-medium">{p.typologyLabel}</span>
                        <span className="hidden sm:inline">{p.location}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            setIndexDrawerOpen(false);
                            onOpenProject(p.id);
                          }}
                          className="font-serif text-base sm:text-lg text-[#181714] font-normal text-left cursor-pointer py-1.5 sm:py-0 min-h-[38px] sm:min-h-0 flex items-center"
                        >
                          {p.title}
                        </button>
                        <Link
                          href={`/projects/${p.id}`}
                          onClick={() => setIndexDrawerOpen(false)}
                          className="text-[10px] font-sans uppercase tracking-widest text-white px-3 py-2 sm:py-1 rounded-full bg-[#181715] border border-[#2D2A26] hover:border-[#CBB8A0] flex items-center gap-1 transition-colors font-medium shadow-none min-h-[38px] sm:min-h-0 shrink-0"
                        >
                          <span>Full Page</span>
                          <ArrowUpRight className="w-3 h-3 text-white" />
                        </Link>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#786E5F] mt-2 pt-2 border-t border-[#E5DFD4]">
                        <span>{p.typologyLabel}</span>
                        <span className="font-sans">{p.areaM2} m²</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-[#D5CDBF] mt-8 flex items-center justify-between text-xs text-[#6E6457]">
                <span>Soul Space Infrastructure Archives</span>
                <button
                  onClick={() => {
                    setIndexDrawerOpen(false);
                    scrollTo('works');
                  }}
                  className="text-[#B8936D] hover:underline uppercase tracking-widest text-[10px] font-semibold cursor-pointer"
                >
                  View Full Canvas &rarr;
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
