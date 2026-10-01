'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Compass,
  Building2,
  Calendar,
  Layers,
  CheckCircle2,
  Maximize2,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Phone,
  Mail,
  Clock,
  Car,
  Trees,
  Sliders,
  ChevronRight,
  Accessibility,
  Armchair,
  Bath,
  ArrowUpDown,
  Zap,
  BatteryCharging,
  Cctv,
  PhoneCall,
  Video,
  Crown,
  UtensilsCrossed,
  Dumbbell,
  Users,
  Waves,
  Gamepad2,
  Droplets,
  Flame,
  Tv,
  Smile,
  Leaf,
  Home,
  Plane,
  HeartPulse,
  Briefcase,
  GraduationCap,
  ShoppingBag,
  Train,
  Store,
  Navigation,
  Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FullProjectDetail } from '@/data/projectDataFull';
import { DynamicPictureSlot } from '@/components/DynamicPictureSlot';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { OtherProjects } from '@/components/OtherProjects';
import { ProjectMap } from '@/components/ProjectMap';
import { CommissionEstimator } from '@/components/CommissionEstimator';
import { ProjectBrochureSection } from '@/components/ProjectBrochureSection';
import { Footer } from '@/components/Footer';
import { BrandLogo } from '@/components/BrandLogo';
import { SmoothAutoHeight } from '@/components/SmoothAutoHeight';

// Contextual icon resolution for specification categories
function getSpecCategoryIcon(categoryText: string) {
  const lower = categoryText.toLowerCase();
  if (lower.includes('structure') || lower.includes('foundation') || lower.includes('rcc') || lower.includes('frame')) {
    return Building2;
  }
  if (lower.includes('wall') || lower.includes('masonry') || lower.includes('plaster') || lower.includes('block')) {
    return Layers;
  }
  if (lower.includes('floor') || lower.includes('tile') || lower.includes('granite') || lower.includes('finish')) {
    return ShieldCheck;
  }
  if (lower.includes('door') || lower.includes('window') || lower.includes('joinery') || lower.includes('glass')) {
    return Maximize2;
  }
  if (lower.includes('electric') || lower.includes('wire') || lower.includes('power') || lower.includes('generator')) {
    return Zap;
  }
  if (lower.includes('plumb') || lower.includes('sanitary') || lower.includes('cp') || lower.includes('water') || lower.includes('drain')) {
    return Droplets;
  }
  if (lower.includes('paint') || lower.includes('polish') || lower.includes('exterior') || lower.includes('wall care')) {
    return Sparkles;
  }
  if (lower.includes('landscape') || lower.includes('common') || lower.includes('lift') || lower.includes('terrace')) {
    return Trees;
  }
  return CheckCircle2;
}

// Contextual icon resolution for landmarks
function getLandmarkIcon(landmarkText: string) {
  const lower = landmarkText.toLowerCase();
  if (lower.includes('airport') || lower.includes('aerodrome') || lower.includes('cjb')) {
    return Plane;
  }
  if (lower.includes('hospital') || lower.includes('kmch') || lower.includes('medical') || lower.includes('healthcare')) {
    return HeartPulse;
  }
  if (lower.includes('tidel') || lower.includes('it corridor') || lower.includes('tech') || lower.includes('software')) {
    return Briefcase;
  }
  if (lower.includes('college') || lower.includes('psg') || lower.includes('school') || lower.includes('university') || lower.includes('academy')) {
    return GraduationCap;
  }
  if (lower.includes('mall') || lower.includes('brookefields') || lower.includes('puram') || lower.includes('shopping') || lower.includes('retail')) {
    return ShoppingBag;
  }
  if (lower.includes('station') || lower.includes('junction') || lower.includes('railway') || lower.includes('transit') || lower.includes('train')) {
    return Train;
  }
  return Navigation;
}

// Subtitle for landmark cards
function getLandmarkSubtitle(landmarkText: string) {
  const lower = landmarkText.toLowerCase();
  if (lower.includes('airport') || lower.includes('aerodrome')) return 'Civil Aviation Gateway';
  if (lower.includes('kmch') || lower.includes('hospital')) return 'Tertiary Healthcare Center';
  if (lower.includes('tidel') || lower.includes('tech') || lower.includes('corridor')) return 'IT Tech Park & Enterprise SEZ';
  if (lower.includes('psg') || lower.includes('college') || lower.includes('school')) return 'Premier Academic Academy';
  if (lower.includes('brookefields') || lower.includes('mall') || lower.includes('puram')) return 'High-Street Retail & Lifestyle';
  if (lower.includes('station') || lower.includes('junction')) return 'Central Railway Terminal';
  return 'Prime City Transit Landmark';
}

// Smart contextual icon resolution for amenities
function getAmenityIcon(amenityText: string) {
  const lower = amenityText.toLowerCase();

  if (lower.includes('specially abled') || lower.includes('accessible') || lower.includes('wheelchair')) {
    return Accessibility;
  }
  if (lower.includes('stacked')) {
    return Layers;
  }
  if (lower.includes('parking') || lower.includes('wheeler') || lower.includes('car') || lower.includes('ev charging')) {
    return Car;
  }
  if (lower.includes('lift') || lower.includes('elevator') || lower.includes('staircase')) {
    return ArrowUpDown;
  }
  if (lower.includes('gym') || lower.includes('fitness') || lower.includes('workout')) {
    return Dumbbell;
  }
  if (lower.includes('cafeteria') || lower.includes('dinning') || lower.includes('dining') || lower.includes('food') || lower.includes('banquet')) {
    return UtensilsCrossed;
  }
  if (lower.includes('cctv') || lower.includes('surveillance')) {
    return Cctv;
  }
  if (lower.includes('security') || lower.includes('guard')) {
    return ShieldCheck;
  }
  if (lower.includes('backup') || lower.includes('1kva') || lower.includes('battery') || lower.includes('dg back')) {
    return BatteryCharging;
  }
  if (lower.includes('gen-set') || lower.includes('genset') || lower.includes('generator') || lower.includes('power') || lower.includes('electrical')) {
    return Zap;
  }
  if (lower.includes('video phone') || lower.includes('video') || lower.includes('camera')) {
    return Video;
  }
  if (lower.includes('phone') || lower.includes('intercom')) {
    return PhoneCall;
  }
  if (lower.includes('lounge') || lower.includes('waiting') || lower.includes('cozy')) {
    return Armchair;
  }
  if (lower.includes('office') || lower.includes('workspace') || lower.includes('work space')) {
    return Building2;
  }
  if (lower.includes('toilet') || lower.includes('restroom') || lower.includes('bath') || lower.includes('sanitary')) {
    return Bath;
  }
  if (lower.includes('club house') || lower.includes('clubhouse') || lower.includes('community hall') || lower.includes('party hall')) {
    return Crown;
  }
  if (lower.includes('driver')) {
    return Users;
  }
  if (lower.includes('swimming') || lower.includes('pool')) {
    return Waves;
  }
  if (lower.includes('water') || lower.includes('ro water') || lower.includes('bore') || lower.includes('pressure pump')) {
    return Droplets;
  }
  if (lower.includes('snooker') || lower.includes('tennis') || lower.includes('game')) {
    return Gamepad2;
  }
  if (lower.includes('lawn') || lower.includes('garden') || lower.includes('park') || lower.includes('terrace')) {
    return Trees;
  }
  if (lower.includes('gas') || lower.includes('piped')) {
    return Flame;
  }
  if (lower.includes('theatre') || lower.includes('theater')) {
    return Tv;
  }
  if (lower.includes('children') || lower.includes('kids')) {
    return Smile;
  }
  if (lower.includes('sewage') || lower.includes('treatment plant')) {
    return Leaf;
  }
  if (lower.includes('guest house')) {
    return Home;
  }
  if (lower.includes('vasthu') || lower.includes('vastu')) {
    return Compass;
  }

  return Sparkles;
}

// Micro-category kicker for consistent architectural hierarchy and alignment
function getAmenityCategory(amenityText: string): string {
  const lower = amenityText.toLowerCase();
  if (lower.includes('parking') || lower.includes('wheeler')) return 'Mobility & Bays';
  if (lower.includes('office') || lower.includes('workspace')) return 'Work Environment';
  if (lower.includes('lounge') || lower.includes('waiting')) return 'Executive Reception';
  if (lower.includes('toilet') || lower.includes('restroom')) return 'Private Hygiene';
  if (lower.includes('lift') || lower.includes('elevator')) return 'Vertical Transit';
  if (lower.includes('gen-set') || lower.includes('backup') || lower.includes('power')) return 'Power Continuity';
  if (lower.includes('cctv') || lower.includes('surveillance') || lower.includes('security')) return '24/7 Surveillance';
  if (lower.includes('video') || lower.includes('intercom') || lower.includes('phone')) return 'Access Security';
  if (lower.includes('club house') || lower.includes('clubhouse') || lower.includes('recreation')) return 'Private Club';
  if (lower.includes('dining') || lower.includes('cafeteria')) return 'Rooftop Dining';
  if (lower.includes('gym') || lower.includes('fitness')) return 'Wellness Suite';
  if (lower.includes('driver')) return 'Chauffeur Facility';
  if (lower.includes('pool')) return 'Aquatics & Leisure';
  if (lower.includes('garden') || lower.includes('terrace') || lower.includes('lawn')) return 'Outdoor Grounds';
  if (lower.includes('water')) return 'Hydro-Pneumatics';
  if (lower.includes('game') || lower.includes('snooker')) return 'Indoor Recreation';
  return 'Community Amenity';
}

interface ProjectPageClientProps {
  project: FullProjectDetail;
}

export function ProjectPageClient({ project }: ProjectPageClientProps) {
  // State for Unit Plan Tabs (for ABV Arbor, Dotcom, Uptown)
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);

  // State for specifications accordion (single-item exclusive open with silky smooth close)
  const [expandedSpec, setExpandedSpec] = useState<number | null>(null);

  const toggleSpec = (idx: number) => {
    setExpandedSpec((prev) => (prev === idx ? null : idx));
  };

  // State for back arrow blur & disappear / appear on scroll
  const [arrowVisible, setArrowVisible] = useState(true);
  const [hasScrolledPastTop, setHasScrolledPastTop] = useState(false);

  // Ensure every single time a page is opened, it appears from the very top
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (typeof window !== 'undefined' && (window as any).__lenis) {
      (window as any).__lenis.scrollTo(0, { immediate: true });
    }
  }, [project.id]);

  // Track scroll direction & top scroll position with requestAnimationFrame
  useEffect(() => {
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setHasScrolledPastTop(currentScrollY > 20);

          const threshold = window.innerWidth < 768 ? 18 : 6;

          if (currentScrollY <= 40) {
            // At or near top: always clearly visible
            setArrowVisible(true);
          } else if (currentScrollY - lastScrollY > threshold) {
            // Scrolling down: disappear with blur effect
            setArrowVisible(false);
          } else if (lastScrollY - currentScrollY > threshold) {
            // Scrolling up: appear with blur effect
            setArrowVisible(true);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to in-page section
  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        (window as any).__lenis.scrollTo(el, { offset: -70, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const activeUnit = project.unitFloorPlans ? project.unitFloorPlans[activeUnitIndex] : null;

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1D1B18] selection:bg-[#B8936D] selection:text-white antialiased">
      {/* Header: Matches landing page header opacity, insane blur effect, and borderless design */}
      <header
        id="project-navigation"
        className={`sticky top-0 z-40 py-3 sm:py-4 transition-[background-color,backdrop-filter] duration-500 border-none ${
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
        <div className="w-full px-4 sm:px-6 lg:px-8 grid grid-cols-3 items-center h-10">
          {/* Left Corner: Back to Home Arrow with scroll-direction blur effect */}
          <div className="flex items-center justify-start">
            <Link
              href="/"
              className={`text-[#1A1815] hover:text-[#B8936D] cursor-pointer inline-flex items-center justify-center p-2 sm:p-1 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 transition-all duration-500 ease-out ${
                arrowVisible
                  ? 'opacity-100 blur-none translate-x-0 pointer-events-auto'
                  : 'opacity-0 blur-md -translate-x-3 pointer-events-none'
              }`}
              aria-label="Back to home"
              title="Return to Home"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
            </Link>
          </div>

          {/* Center: BrandLogo scrolls to top of current page without taking user to landing page */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  if (window.__lenis) {
                    window.__lenis.scrollTo(0, { duration: 1.2 });
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }
              }}
              className="inline-block text-center group cursor-pointer focus:outline-hidden"
              id="brand-home-link"
              aria-label="Scroll to top of current page"
            >
              <BrandLogo variant="nav" />
            </button>
          </div>

          {/* Right: Empty spacer for strict center balance */}
          <div className="flex items-center justify-end" />
        </div>
      </header>

      {/* Hero Section: Stately Architectural Project Cover */}
      <section 
        id="project-hero" 
        className="relative min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-4.5rem)] flex flex-col justify-center items-center overflow-hidden bg-[#FAF8F5] py-8 sm:py-14 box-border border-b border-[#E3DCCF]"
      >
        {/* Subtle Architectural Blueprint Grid Background */}
        <div className="absolute inset-0 bg-grid-architectural opacity-30 pointer-events-none" />

        {/* Ambient Atmospheric Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[280px] h-[280px] sm:w-[700px] sm:h-[450px] bg-[#E8DFD0]/40 rounded-full blur-[80px] sm:blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center justify-center my-auto">
          {/* Centered Hero Header Lockup */}
          <ScrollReveal yOffset={20} className="max-w-4xl mx-auto text-center flex flex-col items-center w-full">
            {/* Category Eyebrow Tag — Strictly single line */}
            <div className="flex items-center justify-center gap-2 text-[#99744C] text-[8.5px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.28em] uppercase font-bold mb-3 sm:mb-4 font-sans whitespace-nowrap max-w-full">
              <span className="w-2.5 sm:w-3 h-px bg-[#B8936D] shrink-0" />
              <span className="whitespace-nowrap">{project.typologyLabel}</span>
              <span className="w-2.5 sm:w-3 h-px bg-[#B8936D] shrink-0" />
            </div>

            {/* Main Headline */}
            <h1
              className="font-serif text-2xl sm:text-[70px] leading-snug sm:leading-[78px] text-[#1A1815] font-normal tracking-[-0.035em] mb-3 sm:mb-6 px-2 text-center"
            >
              {project.title}
            </h1>

            {/* Tagline / Subtitle */}
            <p className="font-serif not-italic text-xs sm:text-2xl text-[#B8936D] max-w-2xl text-center mx-auto mb-3 sm:mb-4 font-normal" style={{ fontStyle: 'normal' }}>
              {project.tagline}
            </p>

            {/* Lead Description */}
            <p
              className="text-[11px] sm:text-[13px] leading-[16px] sm:leading-[20px] text-[#645D52] max-w-2xl mx-auto font-light text-center px-4 mb-3"
            >
              {project.subtitle}
            </p>

            {/* Location */}
            <p className="text-xs text-[#786E5F] mb-6 sm:mb-8 font-sans">
              <span>{project.location}</span>
            </p>

            {/* Action CTA Buttons: Deep obsidian luxury styling */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 w-full">
              {project.unitFloorPlans && (
                <button
                  onClick={() => scrollToAnchor('plans')}
                  className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-[#181715] text-white text-[9.5px] sm:text-[10.5px] tracking-[0.14em] sm:tracking-[0.22em] uppercase font-medium rounded-full transition-colors flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer border border-[#2D2A26] hover:border-[#CBB8A0] shadow-none min-h-[40px] sm:min-h-0"
                >
                  <span>View Floor Plans</span>
                  <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              )}
              <button
                onClick={() => scrollToAnchor('specs')}
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-[#181715] text-white text-[9.5px] sm:text-[10.5px] tracking-[0.14em] sm:tracking-[0.22em] uppercase font-medium rounded-full transition-colors flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer border border-[#2D2A26] hover:border-[#CBB8A0] shadow-none min-h-[40px] sm:min-h-0"
              >
                <span>Specifications</span>
              </button>
              {project.brochurePdfUrl && (
                <button
                  onClick={() => scrollToAnchor('brochure')}
                  className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-[#181715] text-white text-[9.5px] sm:text-[10.5px] tracking-[0.14em] sm:tracking-[0.22em] uppercase font-medium rounded-full transition-colors flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer border border-[#2D2A26] hover:border-[#CBB8A0] shadow-none min-h-[40px] sm:min-h-0"
                >
                  <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B8936D]" />
                  <span>Brochure</span>
                </button>
              )}
              <button
                onClick={() => scrollToAnchor('commission-inquiry-section')}
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-[#181715] text-white text-[9.5px] sm:text-[10.5px] tracking-[0.14em] sm:tracking-[0.22em] uppercase font-semibold rounded-full transition-colors flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer border border-[#2D2A26] hover:border-[#CBB8A0] shadow-none min-h-[40px] sm:min-h-0"
              >
                <span>Inquire on Project</span>
              </button>
            </div>

            {/* Centered Minimal Action: Explore Architecture with bouncing arrow */}
            <div className="flex items-center justify-center mt-6 sm:mt-10">
              <button
                onClick={() => scrollToAnchor('showcase')}
                className="group inline-flex flex-col items-center justify-center gap-1 sm:gap-2 cursor-pointer bg-transparent border-none p-0 focus:outline-none transition-colors duration-300 text-center"
                aria-label="Explore Project Architecture"
              >
                <span className="font-sans text-[8.5px] sm:text-[11px] font-normal sm:font-medium tracking-[0.2em] sm:tracking-[0.28em] uppercase text-[#6E6659] group-hover:text-[#B8936D] transition-colors duration-300 text-center">
                  Explore Architecture
                </span>
                <motion.span
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-flex items-center justify-center text-[#B8936D]/80 group-hover:text-[#B8936D]"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.span>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Architectural Showcase: Signature Exterior Perspective & Metric Strip */}
      <section id="showcase" className="relative py-12 sm:py-20 lg:py-24 bg-[#F4F2EB] border-b border-[#E3DCCF] overflow-hidden scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <ScrollReveal className="flex flex-col items-center text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2 text-[#99744C] text-[8.5px] sm:text-[10px] tracking-[0.24em] sm:tracking-[0.3em] uppercase font-bold mb-2 font-sans whitespace-nowrap">
              <span className="w-3 sm:w-4 h-px bg-[#B8936D] shrink-0" />
              <span>SIGNATURE PERSPECTIVE &bull; MONOLITHIC COMPOSITION</span>
              <span className="w-3 sm:w-4 h-px bg-[#B8936D] shrink-0" />
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#181715] font-normal tracking-[-0.02em]">
              {project.title} Architectural Exterior
            </h2>
          </ScrollReveal>

          {/* Hero Dynamic Picture Slot with Lowercase Serial Number */}
          <ScrollReveal yOffset={24} className="mb-8 sm:mb-12">
            <DynamicPictureSlot
              slotId={project.heroSlotId}
              title={`${project.title} — Signature Architectural Exterior`}
              caption={`${project.title} monolithic perspective and exterior architectural composition.`}
              aspectHint="Cinematic Landscape (16:9)"
              orientation="landscape"
              priority={true}
              className="rounded-2xl"
            />
          </ScrollReveal>

          {/* Architectural Metric Bar: Center-Aligned Luxury Metrics — Responsive Compact on Mobile */}
          <ScrollReveal yOffset={20}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 md:gap-6 p-4 sm:p-6 md:p-8 rounded-xl bg-[#FAF8F4] border border-[#DCD5C8] transition-all hover:border-[#CBB8A0] shadow-none">
              <div className="space-y-0.5 sm:space-y-1.5 text-center flex flex-col items-center justify-center">
                <span className="text-[8.5px] sm:text-[10px] font-sans text-[#B8936D] tracking-[0.16em] sm:tracking-[0.25em] uppercase block mb-0.5 sm:mb-1 font-bold text-center">
                  Scale &amp; Typology
                </span>
                <p className="font-serif text-[13.5px] min-[390px]:text-[15px] sm:text-2xl md:text-3xl text-[#181714] font-normal leading-snug sm:leading-tight text-center">
                  {project.unitsCount}
                </p>
                <p className="text-[10px] sm:text-xs text-[#5C5346] leading-tight sm:leading-relaxed font-light mt-0.5 sm:mt-1 text-center">
                  {project.typologyLabel && project.typologyLabel !== project.unitsCount ? project.typologyLabel : 'Luxury Residential'}
                </p>
              </div>

              <div className="space-y-0.5 sm:space-y-1.5 text-center flex flex-col items-center justify-center">
                <span className="text-[8.5px] sm:text-[10px] font-sans text-[#B8936D] tracking-[0.16em] sm:tracking-[0.25em] uppercase block mb-0.5 sm:mb-1 font-bold text-center">
                  Floor Area
                </span>
                <p className="font-serif text-[13.5px] min-[390px]:text-[15px] sm:text-2xl md:text-3xl text-[#181714] font-normal leading-snug sm:leading-tight text-center">
                  {project.areaSqFt.toLocaleString()} sq ft
                </p>
                <p className="text-[10px] sm:text-xs text-[#5C5346] leading-tight sm:leading-relaxed font-light mt-0.5 sm:mt-1 text-center">
                  {project.areaM2} m² carpet/saleable
                </p>
              </div>

              <div className="space-y-0.5 sm:space-y-1.5 text-center flex flex-col items-center justify-center">
                <span className="text-[8.5px] sm:text-[10px] font-sans text-[#B8936D] tracking-[0.16em] sm:tracking-[0.25em] uppercase block mb-0.5 sm:mb-1 font-bold text-center">
                  Vastu Alignment
                </span>
                <p className="font-serif text-[13.5px] min-[390px]:text-[15px] sm:text-2xl md:text-3xl text-[#181714] font-normal leading-snug sm:leading-tight text-center">
                  {project.vasthuCompliance}
                </p>
                <p className="text-[10px] sm:text-xs text-[#5C5346] leading-tight sm:leading-relaxed font-light mt-0.5 sm:mt-1 text-center">
                  Optimized for Light &amp; Airflow
                </p>
              </div>

              <div className="space-y-0.5 sm:space-y-1.5 text-center flex flex-col items-center justify-center">
                <span className="text-[8.5px] sm:text-[10px] font-sans text-[#B8936D] tracking-[0.16em] sm:tracking-[0.25em] uppercase block mb-0.5 sm:mb-1 font-bold text-center">
                  Location &amp; Hub
                </span>
                <p className="font-serif text-[13.5px] min-[390px]:text-[15px] sm:text-2xl md:text-3xl text-[#181714] font-normal leading-snug sm:leading-tight text-center">
                  {project.location.split(',')[0]}
                </p>
                <p className="text-[10px] sm:text-xs text-[#5C5346] leading-tight sm:leading-relaxed font-light mt-0.5 sm:mt-1 text-center">
                  {project.location.includes(',') ? project.location.split(',').slice(1).join(',').trim() : 'Coimbatore'}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 1: Overview & Monolith Narrative matching Philosophy.tsx */}
      <section id="overview" className="py-16 sm:py-28 bg-[#ECE7DF] text-[#1C1A17] border-b border-[#D8D0C2] relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#B8936D]/15 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Centered Canonical Header */}
          <ScrollReveal className="flex flex-col items-center text-center gap-6 border-b border-[#D8D0C0] pb-10 sm:pb-12 mb-12 sm:mb-16">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-2 text-[#B8936D] text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-bold mb-3 sm:mb-4 font-sans">
                <span className="w-3 h-px bg-[#B8936D]" />
                <span>ARCHITECTURAL SYNOPSIS</span>
              </div>
              <h2
                className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#181714] tracking-[-0.03em] font-normal leading-tight sm:leading-[1.15]"
              >
                Refined Design &amp; <br className="hidden sm:inline" />
                <span className="italic text-[#B8936D]">Enduring Permanence.</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#575046] max-w-2xl leading-relaxed font-light text-center mx-auto">
              {project.subtitle}
            </p>
          </ScrollReveal>

          {/* Two-Column Editorial Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Narrative Column (7 cols) - Centered vertically relative to right column */}
            <ScrollReveal className="lg:col-span-7 space-y-8 lg:self-center">
              {/* Vision Concept Quote */}
              <div className="border-l-2 border-[#B8936D] pl-5 sm:pl-6 py-1 bg-[#FAF8F5]/60 rounded-r-lg">
                <span className="text-[10px] font-sans tracking-[0.25em] text-[#B8936D] uppercase font-bold block mb-1">
                  PROJECT VISION &amp; CONCEPT
                </span>
                <p className="font-serif text-xl sm:text-2xl text-[#181714] font-normal leading-snug">
                  &ldquo;{project.tagline}&rdquo;
                </p>
              </div>

              {/* Narrative Storytelling */}
              <div className="space-y-4 text-sm sm:text-[15px] text-[#4A4338] leading-relaxed font-light">
                {project.aboutProject.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className={
                      idx === 0
                        ? 'text-base sm:text-lg text-[#181714] font-normal leading-relaxed pb-1 border-b border-[#D8D0C0]/60'
                        : 'text-sm sm:text-[14.5px] text-[#4A4338] leading-relaxed'
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Architectural Highlights in Curated Numbered Grid */}
              <div className="pt-6 border-t border-[#D5CDBF]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-sans text-[#B8936D] tracking-[0.25em] uppercase font-bold">
                    ARCHITECTURAL DISTINCTIONS
                  </span>
                  <span className="text-[10px] font-sans text-[#7A7061] tracking-widest uppercase">
                    Core Specifications
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {project.keyHighlights.slice(0, 4).map((highlight, i) => (
                    <div
                      key={i}
                      className="border border-[#DCD5C8] bg-[#FAF8F4] p-4 sm:p-5 rounded-xl flex items-start gap-3.5 transition-all duration-300 hover:border-[#B8936D] group shadow-none"
                    >
                      <span className="font-serif text-sm font-semibold text-[#B8936D] shrink-0 mt-0.5 w-6 h-6 rounded-full bg-[#EBE3D5] flex items-center justify-center group-hover:scale-105 transition-transform">
                        0{i + 1}
                      </span>
                      <p className="text-xs sm:text-[13px] text-[#2D2821] leading-relaxed font-normal min-w-0">
                        {highlight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Right Picture & Specifications Column (5 cols) */}
            <ScrollReveal delay={0.15} className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 mt-4 lg:mt-0">
              {/* Picture Slot for Exterior / Architectural Perspective */}
              <DynamicPictureSlot
                slotId={(project.spacesDescription && project.spacesDescription[0]?.slotId) || project.heroSlotId}
                title={`${project.title} Architectural Perspective`}
                caption={`${project.title} monolithic perspective and engineering detail.`}
                orientation="landscape"
              />

              {/* Quick Distinctions Card */}
              <div className="border border-[#DCD5C8] bg-[#FAF8F4] p-6 sm:p-7 rounded-xl shadow-none space-y-5">
                <div className="border-b border-[#D5CDBF] pb-3.5">
                  <span className="text-[10px] font-sans text-[#B8936D] tracking-widest uppercase font-bold">
                    SPECIFICATION BRIEF
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-[#E5DFD4]/70">
                    <span className="text-[#7A7061] font-sans">Typology</span>
                    <span className="font-serif text-sm text-[#181714] text-right font-medium">{project.typologyLabel}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-[#E5DFD4]/70">
                    <span className="text-[#7A7061] font-sans">Scale</span>
                    <span className="font-serif text-sm text-[#181714] text-right font-medium">{project.unitsCount}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-[#E5DFD4]/70">
                    <span className="text-[#7A7061] font-sans">Total Area</span>
                    <span className="font-serif text-sm text-[#181714] text-right font-medium">{project.areaSqFt.toLocaleString()} sq ft</span>
                  </div>
                  <div className="flex justify-between items-start py-1.5 gap-2">
                    <span className="text-[#7A7061] font-sans shrink-0 mt-0.5">Address</span>
                    <span className="font-sans text-xs text-[#181714] text-right flex-1 sm:max-w-[210px] leading-snug pl-2">
                      {project.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Soul Space Governance Guarantee / Builder Pledge */}
              <div className="border border-[#DCD5C8] bg-[#FAF8F4] p-5 sm:p-6 rounded-xl space-y-3 shadow-none transition-all hover:border-[#CBB8A0]">
                <div className="flex items-center gap-2.5 text-[#B8936D] pb-2 border-b border-[#E5DFD4]/70">
                  <ShieldCheck className="w-4 h-4 text-[#B8936D] shrink-0" />
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-[#B8936D]">
                    SOUL SPACE BUILDER PLEDGE
                  </span>
                </div>
                <p className="text-xs text-[#5C5346] leading-relaxed font-light">
                  {project.aboutSoulSpace}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Section 2: Architectural Blueprints & Schedules matching Materiality.tsx */}
      {project.unitFloorPlans && project.unitFloorPlans.length > 0 && (
        <section id="plans" className="py-16 sm:py-28 bg-[#F5F3ED] border-b border-[#E3DCCF] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Centered Canonical Header */}
            <ScrollReveal className="flex flex-col items-center text-center gap-6 border-b border-[#D8D0C0] pb-10 sm:pb-12 mb-12 sm:mb-16">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-2 text-[#99744C] text-[8.5px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.28em] uppercase font-bold mb-3 sm:mb-4 font-sans whitespace-nowrap max-w-full">
                  <span className="w-2.5 sm:w-3 h-px bg-[#B8936D] shrink-0" />
                  <span className="whitespace-nowrap">FLOOR PLANS &amp; LAYOUTS</span>
                  <span className="w-2.5 sm:w-3 h-px bg-[#B8936D] shrink-0" />
                </div>
                <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#141311] tracking-[-0.03em] font-normal leading-tight">
                  Architectural Blueprints &amp; <br className="hidden sm:inline" />
                  <span className="italic text-[#B8936D]">Unit Layouts.</span>
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#575046] max-w-2xl leading-relaxed font-light text-center mx-auto">
                Meticulously crafted dimensional plans, spatial orientations, and unit layouts designed for optimal natural light and airflow.
              </p>
            </ScrollReveal>

            {/* Typical Floor Schedule Table */}
            {project.floorPlanSchedule && project.floorPlanSchedule.length > 0 && (
              <ScrollReveal yOffset={24} className="mb-12">
                <div className="border border-[#DCD5C8] bg-[#FAF8F4] rounded-xl p-4 sm:p-8 shadow-none max-w-full min-w-0 overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E0D9CB] pb-4 mb-6">
                    <div>
                      <span className="text-[9px] font-sans text-[#B8936D] tracking-widest uppercase font-bold block mb-1">
                        SCHEDULE OF UNITS
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl text-[#181714] font-normal">
                        Typical Floor Plan Schedule
                      </h3>
                    </div>
                  </div>

                  {project.schedulePictureSlotId && (
                    <DynamicPictureSlot
                      slotId={project.schedulePictureSlotId}
                      title={`${project.title} Typical Floor Plan Schedule`}
                      orientation="wide"
                      aspectHint="Wide (16:10 / 21:9)"
                      className="mb-6"
                    />
                  )}

                  {/* Responsive Table */}
                  <div className="overflow-x-auto overscroll-x-contain pb-2">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-[#DCD5C8] text-[#8C7A65] font-sans uppercase tracking-[0.2em] text-[10px] font-bold">
                          <th className="py-3 px-3 whitespace-nowrap">S.NO</th>
                          <th className="py-3 px-3 whitespace-nowrap">FLOOR</th>
                          <th className="py-3 px-3 whitespace-nowrap">UNIT NO</th>
                          <th className="py-3 px-3 whitespace-nowrap">TYPOLOGY</th>
                          <th className="py-3 px-3 whitespace-nowrap">FACING</th>
                          <th className="py-3 px-3 whitespace-nowrap">SALEABLE AREA</th>
                          <th className="py-3 px-3 whitespace-nowrap">UDS AREA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5DFD4]/70">
                        {project.floorPlanSchedule.map((row, idx) => (
                          <tr key={idx} className="transition-colors">
                            <td className="py-3.5 px-3 font-sans text-xs text-[#B8936D] font-semibold whitespace-nowrap">{row.sno}</td>
                            <td className="py-3.5 px-3 font-sans text-xs sm:text-sm text-[#181715] font-normal whitespace-nowrap">{row.floor}</td>
                            <td className="py-3.5 px-3 font-sans text-xs sm:text-sm text-[#181715] font-semibold whitespace-nowrap">{row.unitNo}</td>
                            <td className="py-3.5 px-3 font-sans text-xs text-[#4A4338] whitespace-nowrap">{row.type}</td>
                            <td className="py-3.5 px-3 whitespace-nowrap">
                              <span className="px-2.5 py-0.5 rounded-sm bg-[#EFECE5] text-[#181715] text-[10px] font-sans font-medium uppercase tracking-wider whitespace-nowrap">
                                {row.facing}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 font-sans text-xs sm:text-sm text-[#181715] font-semibold whitespace-nowrap">{row.saleableAreaSqFt}</td>
                            <td className="py-3.5 px-3 font-sans text-xs text-[#695F50] whitespace-nowrap">{row.udsSqFt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Schedule Picture Container if provided */}
                  {project.schedulePictureSlotId && (
                    <DynamicPictureSlot
                      slotId={project.schedulePictureSlotId}
                      title={`${project.title} Typical Floor Schedule & Layout`}
                      caption="Architectural schedule master plan schematic."
                      aspectHint="Landscape (16:10)"
                      orientation="landscape"
                      className="mt-8"
                    />
                  )}
                </div>
              </ScrollReveal>
            )}

            {/* Interactive Unit Plan Showcase */}
            <div className="space-y-8">
              {/* Unit Selector Tabs matching soft warm stone luxury styling */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {project.unitFloorPlans.map((unit, idx) => {
                  const isActive = activeUnitIndex === idx;
                  return (
                    <button
                      key={unit.id}
                      onClick={() => setActiveUnitIndex(idx)}
                      className={`relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-sans tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'text-[#181714] font-semibold border border-[#D2C5B4] shadow-none'
                          : 'text-[#4A4237] bg-[#FAF8F4] border border-[#DCD5C8] hover:border-[#CBB8A0]'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeUnitTabIndicator"
                          className="absolute inset-0 bg-[#EBE3D5] rounded-full z-0"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 font-semibold">{unit.unitName}</span>
                      <span className="relative z-10 text-[10px] opacity-75 ml-1.5 hidden sm:inline">({unit.area})</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Unit Layout Container with fluid auto-height morphing */}
              <SmoothAutoHeight duration={0.38} ease={[0.16, 1, 0.3, 1]}>
                <AnimatePresence mode="wait">
                  {activeUnit && (
                    <motion.div
                      key={activeUnit.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="border border-[#DCD5C8] bg-[#FAF8F4] rounded-xl p-6 sm:p-10 shadow-none space-y-8 transition-all hover:border-[#CBB8A0]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D5CDBF] pb-5">
                        <div>
                          <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.25em] text-[#B8936D] mb-1 font-bold">
                            <span>{activeUnit.facing}</span>
                            {activeUnit.uds && <span>· {activeUnit.uds}</span>}
                          </div>
                          <h3 className="font-serif text-2xl sm:text-3xl text-[#181714] font-normal">
                            {activeUnit.unitName}
                          </h3>
                          <p className="text-xs text-[#5C5346] font-light leading-relaxed mt-0.5">
                            {activeUnit.subtitle} · {activeUnit.area}
                          </p>
                        </div>
                      </div>

                      {/* 2D Floor Plan & 3D Isometric View Container */}
                      <div className={`grid grid-cols-1 ${activeUnit.isometricSlotId && activeUnit.isometricSlotId !== activeUnit.planSlotId ? 'lg:grid-cols-2' : ''} gap-8 items-start`}>
                        <div className={activeUnit.isometricSlotId && activeUnit.isometricSlotId !== activeUnit.planSlotId ? '' : 'max-w-2xl sm:max-w-3xl mx-auto w-full'}>
                          <div className="flex items-center justify-between mb-3 text-[10px] font-sans uppercase tracking-[0.22em] text-[#B8936D] font-bold">
                            <span>ARCHITECTURAL 2D LAYOUT</span>
                          </div>
                          <DynamicPictureSlot
                            slotId={activeUnit.planSlotId}
                            title={`${activeUnit.unitName} — Architectural Floor Plan`}
                            caption="Technical floor distribution, room dimensions, and balcony positioning."
                            aspectHint={activeUnit.planOrientation === 'portrait' ? 'Vertical (3:4 / 4:5)' : 'Landscape (16:10)'}
                            orientation={activeUnit.planOrientation || 'landscape'}
                          />
                        </div>

                        {activeUnit.isometricSlotId && activeUnit.isometricSlotId !== activeUnit.planSlotId && (
                          <div>
                            <div className="flex items-center justify-between mb-3 text-[10px] font-sans uppercase tracking-[0.22em] text-[#B8936D] font-bold">
                              <span>3D ISOMETRIC VIEW</span>
                            </div>
                            <DynamicPictureSlot
                              slotId={activeUnit.isometricSlotId}
                              title={`${activeUnit.unitName} — 3D Isometric Perspective`}
                              caption="Three-dimensional axonometric visualization of interior volume and flow."
                              aspectHint={activeUnit.isometricOrientation === 'portrait' ? 'Vertical (3:4)' : 'Landscape (16:9)'}
                              orientation={activeUnit.isometricOrientation || 'portrait'}
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SmoothAutoHeight>
            </div>
          </div>
        </section>
      )}

      {/* Section 3: Curated Spaces Walkthrough matching Services.tsx */}
      {project.spacesDescription && project.spacesDescription.length > 0 && (
        <section id="spaces" className="py-16 sm:py-28 bg-[#ECE7DF] text-[#1C1A17] border-b border-[#D8D0C2] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Centered Canonical Header */}
            <ScrollReveal className="flex flex-col items-center text-center gap-6 border-b border-[#D8D0C0] pb-10 sm:pb-12 mb-12 sm:mb-16">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-2 text-[#B8936D] text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-bold mb-3 sm:mb-4 font-sans">
                  <span className="w-3 h-px bg-[#B8936D]" />
                  <span>SPATIAL WALKTHROUGH</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#181714] tracking-[-0.03em] font-normal leading-tight">
                  Curated Spaces &amp; <br className="hidden sm:inline" />
                  <span className="italic text-[#B8936D]">Living Flow.</span>
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#575046] max-w-2xl leading-relaxed font-light text-center mx-auto">
                From spacious living rooms to private terrace gardens and bespoke culinary suites, every zone is planned with care.
              </p>
            </ScrollReveal>

            {/* Alternating Spaces Grid */}
            <div className="space-y-16">
              {project.spacesDescription.map((space, idx) => {
                const isEven = idx % 2 === 0;
                const hasSlot = Boolean(space.slotId);

                if (!hasSlot) {
                  return (
                    <ScrollReveal
                      key={idx}
                      className="border border-[#DCD5C8] bg-[#FAF8F4] rounded-xl p-8 sm:p-12 shadow-none transition-all hover:border-[#CBB8A0]"
                    >
                      <span className="text-[9px] sm:text-[10px] font-sans text-[#B8936D] tracking-widest block mb-2 font-bold uppercase">
                        ARCHITECTURAL LIVING ZONE
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl text-[#181714] font-normal leading-tight mb-3">
                        {space.title}
                      </h3>
                      {space.text && (
                        <p className="text-xs sm:text-sm text-[#5C5346] leading-relaxed font-light max-w-3xl">
                          {space.text}
                        </p>
                      )}
                    </ScrollReveal>
                  );
                }

                return (
                  <ScrollReveal
                    key={idx}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
                  >
                    {/* Visual Container (7 cols) */}
                    <div className={`lg:col-span-7 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <DynamicPictureSlot
                        slotId={space.slotId!}
                        title={space.title}
                        orientation={space.orientation}
                        aspectHint={
                          space.orientation === 'portrait'
                            ? 'Vertical (3:4)'
                            : space.orientation === 'wide'
                            ? 'Panoramic (21:9)'
                            : 'Landscape (16:9)'
                        }
                      />
                    </div>

                    {/* Text Column (5 cols) */}
                    <div className={`lg:col-span-5 ${isEven ? 'lg:order-2' : 'lg:order-1'} space-y-4`}>
                      <span className="text-[9px] sm:text-[10px] font-sans text-[#B8936D] tracking-widest block mb-2 font-bold uppercase">
                        ARCHITECTURAL LIVING ZONE
                      </span>

                      <h3 className="font-serif text-2xl sm:text-4xl text-[#181714] font-normal leading-tight">
                        {space.title}
                      </h3>

                      {space.text && (
                        <p className="text-xs sm:text-sm text-[#5C5346] leading-relaxed font-light">
                          {space.text}
                        </p>
                      )}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Section 4: Community Amenities matching Services.tsx */}
      <section id="amenities" className="py-16 sm:py-28 bg-[#F7F5F0] border-b border-[#E5DFD4] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Canonical Header */}
          <ScrollReveal className="flex flex-col items-center text-center gap-6 border-b border-[#D8D0C0] pb-10 sm:pb-12 mb-12 sm:mb-16">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-2 text-[#99744C] text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-bold mb-3 sm:mb-4 font-sans">
                <span className="w-3 h-px bg-[#B8936D]" />
                <span>LIFESTYLE &amp; CONVENIENCE</span>
              </div>
              <h2
                className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#141311] tracking-[-0.03em] font-normal leading-tight sm:leading-[1.15]"
              >
                Curated Community <br className="hidden sm:inline" />
                <span className="italic text-[#B8936D]">Amenities.</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#575046] max-w-2xl leading-relaxed font-light text-center mx-auto">
              Designed to foster health, social connection, and effortless ease across all generations of residents.
            </p>
          </ScrollReveal>

          {/* Amenities Grid matching ultra-premium architectural plates with strict space consistency */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-16">
            {project.amenitiesList.map((amenity, idx) => {
              const IconComponent = getAmenityIcon(amenity);
              const category = getAmenityCategory(amenity);
              return (
                <StaggerItem
                  key={idx}
                  className="group relative flex items-center gap-4 p-6 sm:p-7 rounded-2xl border border-[#DCD5C8] bg-[#FAF8F5] transition-all duration-300 hover:border-[#CBB8A0] hover:shadow-none min-h-[118px] overflow-hidden"
                >
                  {/* Luxury Obsidian Icon Coin */}
                  <div className="w-12 h-12 rounded-xl bg-[#181715] border border-[#2D2A26] flex items-center justify-center text-[#C5A880] group-hover:border-[#CBB8A0] transition-all duration-300 shadow-none shrink-0">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Body: Title and Category Kicker with precision uniform spacing */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="text-[10px] font-sans tracking-[0.22em] uppercase font-semibold text-[#B8936D]">
                      {category}
                    </div>
                    <h4 className="font-serif text-[17px] sm:text-[19px] text-[#181714] font-normal leading-snug group-hover:text-[#0F0E0D] transition-colors">
                      {amenity}
                    </h4>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* Amenities Picture Slots (if configured) */}
          {project.amenitiesPictureSlots && project.amenitiesPictureSlots.length > 0 && (
            <div
              className={`grid gap-8 ${
                project.amenitiesPictureSlots.length === 1
                  ? 'grid-cols-1 max-w-4xl mx-auto'
                  : 'grid-cols-1 md:grid-cols-2'
              }`}
            >
              {project.amenitiesPictureSlots.map((slot, idx) => (
                <ScrollReveal key={idx} delay={idx * 0.1}>
                  <DynamicPictureSlot
                    slotId={slot.slotId}
                    title={slot.title}
                    caption={slot.description}
                    orientation={slot.orientation}
                    aspectHint={slot.orientation === 'wide' ? 'Wide (21:9)' : 'Landscape (16:10)'}
                  />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 4B: Project Core Highlights (if defined, e.g. Uptown) */}
      {project.projectHighlightsList && project.projectHighlightsList.length > 0 && (
        <section id="project-highlights" className="py-16 sm:py-24 bg-[#ECE7DF] border-b border-[#D8D0C2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="flex flex-col items-center text-center gap-6 border-b border-[#D8D0C0] pb-10 sm:pb-12 mb-12 sm:mb-16">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-2 text-[#99744C] text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-bold mb-3 sm:mb-4 font-sans">
                  <span className="w-3 h-px bg-[#B8936D]" />
                  <span>DISTINCTIVE HIGHLIGHTS</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#141311] tracking-[-0.03em] font-normal leading-tight">
                  Project <span className="italic text-[#B8936D]">Highlights.</span>
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.projectHighlightsList.map((highlight, idx) => (
                <div key={idx} className="border border-[#DCD5C8] bg-[#FAF8F4] p-6 sm:p-8 rounded-xl shadow-none text-center flex flex-col items-center justify-center space-y-2.5 transition-all hover:border-[#CBB8A0]">
                  <span className="text-[10px] font-sans text-[#B8936D] tracking-widest uppercase font-bold block text-center">
                    {highlight.title.toUpperCase()}
                  </span>
                  <h4 className="font-serif text-2xl text-[#181714] font-normal text-center">
                    {highlight.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5C5346] leading-relaxed font-light text-center">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 5: Engineering & Material Specifications matching Materiality.tsx */}
      <section id="specs" className="py-16 sm:py-28 bg-[#ECE7DF] text-[#1C1A17] border-b border-[#D8D0C2] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Canonical Header */}
          <ScrollReveal className="flex flex-col items-center text-center gap-6 border-b border-[#D8D0C0] pb-10 sm:pb-12 mb-12 sm:mb-16">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-2 text-[#B8936D] text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-bold mb-3 sm:mb-4 font-sans">
                <span className="w-3 h-px bg-[#B8936D]" />
                <span>TECHNICAL EXCELLENCE</span>
              </div>
              <h2
                className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#181714] tracking-[-0.03em] font-normal leading-tight sm:leading-[1.15]"
              >
                Engineering &amp; <br className="hidden sm:inline" />
                <span className="italic text-[#B8936D]">Material Schedule.</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#575046] max-w-2xl leading-relaxed font-light text-center mx-auto">
              Every foundation, conduit, masonry block, and sanitary fitting is specified for structural durability and enduring safety.
            </p>
          </ScrollReveal>

          {/* Specifications Accordion Grid with silky, stutter-free animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {project.specifications.map((group, idx) => {
              const isExpanded = expandedSpec === idx;
              const SpecIcon = getSpecCategoryIcon(group.category);
              return (
                <ScrollReveal
                  key={idx}
                  delay={idx * 0.05}
                  className={`rounded-2xl border transition-all duration-300 shadow-none overflow-hidden bg-[#FAF8F5] ${
                    isExpanded
                      ? 'border-[#B8936D] shadow-none'
                      : 'border-[#DCD5C8] hover:border-[#CBB8A0]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSpec(idx)}
                    aria-expanded={isExpanded}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none transition-colors group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#181715] border border-[#2D2A26] text-[#C5A880] flex items-center justify-center shrink-0 shadow-none">
                        <SpecIcon className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif text-lg sm:text-xl text-[#181714] font-normal tracking-[-0.01em] truncate">
                        {group.category}
                      </h3>
                    </div>

                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors bg-[#FAF8F5] ${
                        isExpanded
                          ? 'border-[#B8936D] text-[#B8936D]'
                          : 'border-[#D5CDBF] text-[#181715] group-hover:border-[#CBB8A0]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="accordion-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: 'auto',
                          opacity: 1,
                          transition: {
                            height: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.25, ease: 'easeOut', delay: 0.04 },
                          },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: {
                            height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.18, ease: 'easeIn' },
                          },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-[#DCD5C8]/80 px-6 sm:px-8 pb-7 pt-5 bg-[#FAF8F5]/70">
                          <ul className="space-y-3.5">
                            {group.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-start gap-3 text-xs sm:text-[13px] text-[#484138] font-light leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#B8936D] mt-2 shrink-0" />
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 6A: Vilankurichi Strategic Advantages (for Aurum) */}
      {project.locationAdvantages && project.locationAdvantages.length > 0 && (
        <section id="locality-advantages" className="py-16 sm:py-28 bg-[#F7F5F0] border-b border-[#E5DFD4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="flex flex-col items-center text-center gap-6 border-b border-[#D8D0C0] pb-10 sm:pb-12 mb-12 sm:mb-16">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-2 text-[#99744C] text-[8.5px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.28em] uppercase font-bold mb-3 sm:mb-4 font-sans whitespace-nowrap max-w-full">
                  <span className="w-2.5 sm:w-3 h-px bg-[#B8936D] shrink-0" />
                  <span className="whitespace-nowrap">LOCALITY &amp; ADVANTAGES</span>
                  <span className="w-2.5 sm:w-3 h-px bg-[#B8936D] shrink-0" />
                </div>
                <h2
                  className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#141311] tracking-[-0.03em] font-normal leading-tight sm:leading-[1.15]"
                >
                  Vilankurichi Locality &amp; <br className="hidden sm:inline" />
                  <span className="italic text-[#B8936D]">Strategic Advantages.</span>
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#575046] max-w-2xl leading-relaxed font-light text-center mx-auto">
                Vilankurichi is a locality in Coimbatore, Tamil Nadu, India. It is known for its strategic location and various advantages.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {project.locationAdvantages.map((adv, idx) => (
                <div
                  key={idx}
                  className="border border-[#DCD5C8] bg-[#FAF8F4] p-6 sm:p-8 rounded-xl shadow-none text-center flex flex-col items-center justify-center space-y-3 transition-all hover:border-[#CBB8A0]"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#181715] border border-[#2D2A26] text-[#C5A880] flex items-center justify-center shrink-0 mb-1 shadow-none">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-sans text-[#B8936D] tracking-widest uppercase font-bold block text-center">
                    {adv.title.toUpperCase()}
                  </span>
                  <h4 className="font-serif text-2xl text-[#181714] font-normal text-center">
                    {adv.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5C5346] leading-relaxed font-light text-center">
                    {adv.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 6: Strategic Connectivity & Proximity Matrix */}
      {project.proximityMatrix && project.proximityMatrix.length > 0 && (
        <section id="location" className="py-16 sm:py-28 bg-[#F7F5F0] border-b border-[#E5DFD4] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Centered Canonical Header */}
            <ScrollReveal className="flex flex-col items-center text-center gap-6 border-b border-[#D8D0C0] pb-10 sm:pb-12 mb-12 sm:mb-16">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-2 text-[#99744C] text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-bold mb-3 sm:mb-4 font-sans">
                  <span className="w-3 h-px bg-[#B8936D]" />
                  <span>STRATEGIC CONNECTIVITY</span>
                </div>
                <h2
                  className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#141311] tracking-[-0.03em] font-normal leading-tight sm:leading-[1.15]"
                >
                  Distance from Prominent <br className="hidden sm:inline" />
                  <span className="italic text-[#B8936D]">Landmarks.</span>
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#575046] max-w-2xl leading-relaxed font-light text-center mx-auto">
                Located for swift connectivity to prime transit corridors, premier hospitals, educational academies, and business centers.
              </p>
            </ScrollReveal>

            {/* 2-Column Luxury Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Left Proximity Cards (7 cols) */}
              <ScrollReveal className="lg:col-span-7 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#DCD5C8]">
                  <span className="text-[10px] font-sans text-[#B8936D] tracking-[0.25em] uppercase font-bold">
                    CORRIDOR COMMUTE TIMES
                  </span>
                  <span className="text-[10px] font-sans text-[#7A7061] tracking-widest uppercase">
                    ESTIMATED DURATION
                  </span>
                </div>

                <div className="space-y-3">
                  {project.proximityMatrix.map((item, idx) => {
                    const LandmarkIcon = getLandmarkIcon(item.landmark);
                    const subtitle = getLandmarkSubtitle(item.landmark);
                    return (
                      <div
                        key={idx}
                        className="p-4 sm:p-5 rounded-xl border border-[#DCD5C8] bg-[#FAF8F4] transition-all duration-300 hover:border-[#CBB8A0] shadow-none flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-[#EBE3D5] border border-[#D2C5B4] text-[#8C6D49] flex items-center justify-center shrink-0 shadow-none">
                            <LandmarkIcon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <h4 className="font-serif text-lg sm:text-xl text-[#181714] font-normal leading-snug truncate">
                              <span>{item.landmark}</span>
                            </h4>
                            <span className="text-[10px] font-sans tracking-[0.16em] uppercase text-[#8C6D49] font-medium block">
                              {subtitle}
                            </span>
                          </div>
                        </div>

                        {/* Soft warm stone time pill */}
                        <div className="px-3.5 py-1.5 rounded-full bg-[#EBE3D5] text-[#2D2821] border border-[#D2C5B4] text-[11px] font-sans tracking-wider uppercase font-semibold whitespace-nowrap shadow-none shrink-0">
                          {item.distanceTime}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollReveal>

              {/* Right Neighborhood Details (5 cols) */}
              <ScrollReveal delay={0.15} className="lg:col-span-5 space-y-6">
                {/* Stately Neighborhood Details Card */}
                <div className="border border-[#DCD5C8] bg-[#FAF8F4] rounded-xl p-6 sm:p-8 space-y-5 shadow-none transition-all hover:border-[#CBB8A0]">
                  <div className="flex items-center gap-3 text-[#B8936D] border-b border-[#DCD5C8] pb-4">
                    <Compass className="w-5 h-5 text-[#B8936D]" />
                    <h4 className="font-serif text-xl sm:text-2xl text-[#181714] font-normal">
                      Neighborhood Details
                    </h4>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5C5346] leading-relaxed font-light">
                    Positioned at {project.location} with immediate transit ingress to Coimbatore ring corridors, healthcare centers, and prime institutions.
                  </p>

                  <div className="p-4 bg-[#F4F2EB] rounded-lg border border-[#D5CDBF] space-y-2 text-xs">
                    <div className="text-[10px] font-sans uppercase tracking-widest text-[#B8936D] font-bold">
                      <span>PROJECT POSTAL ADDRESS</span>
                    </div>
                    <div className="font-sans text-xs sm:text-sm text-[#181714] font-medium leading-relaxed">
                      <span>{project.address}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* Official Project Brochure Download Section */}
      <ProjectBrochureSection project={project} />

      {/* Interactive Location Map */}
      <ProjectMap focusProjectId={project.id} />

      {/* Section 7: Discovery of Other Projects matching landing page SelectedWorks */}
      <OtherProjects currentProjectId={project.id} />

      {/* Section 8: Consultation & Feasibility Estimator (Exact Landing Page Component) */}
      <div id="commission-inquiry-section">
        <CommissionEstimator
          initialTypology={project.typology}
          initialProjectName={project.title}
        />
      </div>

      {/* Global Footer matching Landing Page */}
      <Footer onOpenProject={() => {}} />
    </div>
  );
}
