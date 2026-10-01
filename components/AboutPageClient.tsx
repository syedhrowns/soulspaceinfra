'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  Award,
  Clock,
  CheckCircle2,
  Compass,
  Building2,
  Trees,
  Layers,
  Sparkles,
  Phone,
  Mail,
  Send,
  Calendar,
  MapPin,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Check,
  Instagram,
  Facebook,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { DynamicPictureSlot } from '@/components/DynamicPictureSlot';
import { BrandLogo } from '@/components/BrandLogo';
import { CommissionEstimator } from '@/components/CommissionEstimator';
import { Footer } from '@/components/Footer';

export function AboutPageClient() {
  const [hasScrolledPastTop, setHasScrolledPastTop] = useState(false);
  const [arrowVisible, setArrowVisible] = useState(true);
  const [isInFolioSection, setIsInFolioSection] = useState(false);

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

          // Dynamic detection for Chapter 03 Portfolio Folio dark section
          const folioSection = document.getElementById('portfolio-folio');
          if (folioSection) {
            const rect = folioSection.getBoundingClientRect();
            const headerThreshold = 64; // height of the sticky header
            setIsInFolioSection(rect.top <= headerThreshold && rect.bottom >= headerThreshold);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

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

  const milestones = [
    {
      year: '2016',
      phase: 'The Genesis & Civil Foundation',
      description:
        'Founded in Coimbatore as a disciplined civil contracting enterprise focused on foundation rigor and on-time execution.',
      focus: 'Foundation engineering and structural masonry.',
    },
    {
      year: '2019',
      phase: 'Gated Enclave Development',
      description:
        'Expanded into master-planned communities with hydro-pneumatic water loops, private clubhouses, and 24/7 campus security.',
      focus: 'Gated enclaves and residential infrastructure.',
    },
    {
      year: '2022',
      phase: 'Commercial & Vertical Architecture',
      description:
        'Pioneered column-free commercial IT workspaces with PT slabs at DOT COM and boutique luxury city flats at ABV ARBOR near Race Course.',
      focus: 'Commercial PT slabs and urban luxury flats.',
    },
    {
      year: '2024 — Present',
      phase: 'Biophilic Havens & Signature Villas',
      description:
        'Delivering signature villas at AURUM (Vilankurichi), 110 homes at UPTOWN (Eachanari), and farmhouses at MYSTIC (Semmedu).',
      focus: 'Biophilic nature retreats and modern villas.',
    },
  ];

  const pillars = [
    {
      title: 'Quality First',
      desc: 'M25 concrete foundations, ISO-certified steel, and European fittings engineered for generational endurance.',
      icon: ShieldCheck,
      spec: 'M25 RCC / Branded Fixtures',
    },
    {
      title: 'Punctual Delivery',
      desc: 'Disciplined scheduling targets ensuring on-schedule completion without cutting corners.',
      icon: Clock,
      spec: 'Critical Path Scheduling',
    },
    {
      title: 'Safety & Vasthu Compliance',
      desc: '100% seismic-resistant RCC designs and complete Vastu compliance on every development.',
      icon: Award,
      spec: '100% Vedic & Seismic Engineering',
    },
    {
      title: 'Hands-On Stewardship',
      desc: 'Direct principal site stewardship bridging architectural design and precision execution.',
      icon: CheckCircle2,
      spec: 'Direct Principal Supervision',
    },
  ];

  const portfolioFolio = [
    {
      index: '01',
      id: 'aurum-villas',
      slotId: 'aurum_img_01',
      title: 'AURUM',
      tagline: 'A World of Luxury Awaits',
      typology: '33 Luxury Villas',
      location: 'Vilankurichi, Coimbatore',
      area: '2,132 – 3,012 Sq.Ft (198 – 280 m²)',
      summary:
        '33 luxury three-bedroom villas across four facing typologies with clubhouse, swimming pool, and 100% Vastu compliance.',
      highlights: [
        '33 Three-Bedroom Luxury Villas',
        'East, West, South & North Facing Typologies',
        'Fully Furnished Clubhouse & Pool',
        '62.5 KVA Genset & RO Hydro-Pneumatic System',
      ],
      link: '/projects/aurum-villas',
    },
    {
      index: '02',
      id: 'abv-arbor',
      slotId: 'abvarbor_img_01',
      title: 'ABV ARBOR',
      tagline: 'Sign Up for an Unrivalled Home Experience',
      typology: 'Luxury City Residences',
      location: 'Ramanathapuram, Coimbatore',
      area: '2,395 Sq.Ft (222 m²)',
      summary:
        'Boutique Stilt + 5 floors monolith offering 12 spacious 3 & 4 BHK residences with private terrace gardens, 5 minutes from Race Course.',
      highlights: [
        '5 Minutes from Prestigious Race Course',
        'Stilt + 5 Floors RCC Framed Monolith',
        '12 Exclusive 3 BHK & 4 BHK Flats',
        'Piped Gas, Gym & Terrace Garden',
      ],
      link: '/projects/abv-arbor',
    },
    {
      index: '03',
      id: 'dotcom-workspaces',
      slotId: 'dotcom_img_01',
      title: 'DOT COM',
      tagline: "The City's Premier Tech Address",
      typology: 'Commercial Workspaces',
      location: 'PN Palayam, Coimbatore',
      area: '2,054 Sq.Ft (191 m²)',
      summary:
        '16 column-free commercial IT workspaces with Post-Tensioned (PT) slabs, 11’6” ceiling clearance, and stacked parking.',
      highlights: [
        '16 Column-Free Tech Workspaces',
        'PT Slab Engineering & 11’6” Ceilings',
        '5 Min to Avinashi Rd & Lakshmi Mills',
        'Rooftop Dining, Gym & Stacked Parking',
      ],
      link: '/projects/dotcom-workspaces',
    },
    {
      index: '04',
      id: 'uptown-residences',
      slotId: 'uptown_img_01',
      title: 'SOULSPACE UPTOWN',
      tagline: 'Luxury Space at an Unbeatable Price',
      typology: 'Contemporary Living Apartments',
      location: 'Eachanari, Coimbatore',
      area: '1,450 Sq.Ft (135 m²)',
      summary:
        '110 contemporary apartments (1, 2 & 3 BHK) located 500m from Eachanari temple with pool, gym, and private theatre.',
      highlights: [
        '110 Thoughtfully Crafted Budget Apartments',
        '500m from 500-Year-Old Eachanari Temple',
        'Swimming Pool, Gym & Home Theatre',
        'STP, Piped Gas & EV Charging Ports',
      ],
      link: '/projects/uptown-residences',
    },
    {
      index: '05',
      id: 'mystic-villas',
      slotId: 'mystic_img_01',
      title: 'MYSTIC',
      tagline: 'Close to Nature, Near to Your World',
      typology: 'Luxury Farmhouse & Gated Villas',
      location: 'Semmedu, Near Isha Adiyogi, Coimbatore',
      area: '2,500 Sq.Ft Farmhouse (22 Cents+)',
      summary:
        '2.5-acre biophilic coconut plantation retreat offering customized private farmhouses with Siruvani water, 10 minutes from Isha Adiyogi.',
      highlights: [
        '80% Plantation & 20% Built Farmhouse',
        '22 Cents+ Land with 2500 Sq.Ft Farmhouse & Pool',
        'Pure Siruvani River Bed Water Access',
        '10 Min to Adiyogi & Isha Yoga Centre',
      ],
      link: '/projects/mystic-villas',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181714] selection:bg-[#B8936D] selection:text-white relative">
      {/* Header: Matches project page header opacity, blur effect, and borderless design with smooth darkening across Portfolio Folio section */}
      <header
        id="about-navigation"
        className={`sticky top-0 z-40 py-3 sm:py-4 transition-[background-color,backdrop-filter] duration-500 ease-out border-none ${
          isInFolioSection
            ? 'shadow-none'
            : hasScrolledPastTop
            ? 'glassmorphic-header shadow-none'
            : 'bg-transparent shadow-none'
        }`}
        style={
          isInFolioSection
            ? {
                backgroundColor: 'rgba(20, 18, 16, 0.78)',
                backdropFilter: 'blur(30px) saturate(190%)',
                WebkitBackdropFilter: 'blur(30px) saturate(190%)',
              }
            : hasScrolledPastTop
            ? {
                backgroundColor: 'rgba(247, 244, 237, 0.48)',
                backdropFilter: 'blur(28px) saturate(200%)',
                WebkitBackdropFilter: 'blur(28px) saturate(200%)',
              }
            : undefined
        }
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 grid grid-cols-3 items-center h-10">
          {/* Left Corner: Back to Home Arrow with scroll-direction blur effect */}
          <div className="flex items-center justify-start">
            <Link
              href="/"
              className={`hover:text-[#B8936D] cursor-pointer inline-flex items-center justify-center p-2 sm:p-1 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 transition-all duration-500 ease-out ${
                isInFolioSection ? 'text-[#FAF8F5]' : 'text-[#1A1815]'
              } ${
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
                  if ((window as any).__lenis) {
                    (window as any).__lenis.scrollTo(0, { duration: 1.2 });
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }
              }}
              className="inline-block text-center group cursor-pointer focus:outline-hidden"
              id="brand-home-link"
              aria-label="Scroll to top of current page"
            >
              <BrandLogo variant="nav" theme={isInFolioSection ? 'dark' : 'light'} />
            </button>
          </div>

          {/* Right: Empty spacer for strict center balance */}
          <div className="flex items-center justify-end" />
        </div>
      </header>

      {/* Hero Section: Stately Monograph Editorial Cover */}
      <section id="about-hero" className="relative min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-4.5rem)] flex flex-col items-center justify-center py-8 sm:py-12 md:py-14 overflow-hidden border-b border-[#E3DCCF] box-border">
        {/* Subtle Architectural Blueprint Grid Background */}
        <div className="absolute inset-0 bg-grid-architectural opacity-30 pointer-events-none" />

        {/* Ambient Warm Golden Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[750px] sm:h-[450px] bg-[#E8DFD0]/45 rounded-full blur-[90px] sm:blur-[150px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center justify-center">
          <ScrollReveal yOffset={20} className="max-w-5xl lg:max-w-6xl mx-auto text-center flex flex-col items-center w-full">
            {/* Category Eyebrow Tag */}
            <div className="flex items-center justify-center gap-2 text-[#99744C] text-[8.5px] sm:text-[10px] tracking-[0.24em] sm:tracking-[0.3em] uppercase font-bold mb-3 sm:mb-4 font-sans whitespace-nowrap">
              <span className="w-3 sm:w-4 h-px bg-[#B8936D] shrink-0" />
              <span>THE PRACTICE MONOGRAPH &bull; ESTABLISHED 2016</span>
              <span className="w-3 sm:w-4 h-px bg-[#B8936D] shrink-0" />
            </div>

            {/* Main Headline — Reduced line height like landing page */}
            <h1 className="font-serif text-3xl sm:text-6xl md:text-7xl leading-[1.0] sm:leading-[0.98] md:leading-[0.98] text-[#141311] font-normal tracking-[-0.035em] mb-3 sm:mb-5">
              Architecture of <br className="hidden sm:inline" />
              <span className="italic text-[#B8936D]">Permanent Resonance.</span>
            </h1>

            {/* Tagline — Strictly on one single line on desktop, gracefully responsive on mobile */}
            <p className="font-serif text-xs sm:text-2xl text-[#8C7A65] text-center mx-auto mb-4 sm:mb-5 font-light whitespace-normal sm:whitespace-nowrap max-w-none w-full px-2 sm:px-0">
              Quality, Functionality &amp; Enduring Value across Coimbatore, Tamil Nadu.
            </p>

            {/* Lead Narrative — Elegantly proportioned on mobile, 2 to 3 lines on desktop */}
            <p className="text-[11px] sm:text-base text-[#575046] max-w-3xl leading-normal sm:leading-relaxed font-light text-center mx-auto mb-5 sm:mb-7 px-4">
              Since 2016, <strong>Soulspace Infrastructure</strong> delivers luxury villas, contemporary apartments, column-free commercial IT suites, and biophilic nature retreats across Coimbatore with uncompromised engineering rigor.
            </p>

            {/* Centered Actions: View Portfolio Folio button with Practice Timeline below it without layout */}
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-3.5 w-full">
              <button
                onClick={() => scrollToAnchor('portfolio-folio')}
                className="px-7 py-3 bg-[#181715] text-[#FAF8F5] text-xs font-sans tracking-[0.18em] uppercase font-semibold rounded-full border border-[#2D2A26] hover:border-[#CBB8A0] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-none"
              >
                <span>View Portfolio Folio</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#B8936D]" />
              </button>

              <button
                onClick={() => scrollToAnchor('chronicle')}
                className="group inline-flex flex-col items-center justify-center gap-1 cursor-pointer bg-transparent border-none p-0 focus:outline-none transition-colors duration-300 text-center"
                aria-label="Scroll to Practice Timeline"
              >
                <span className="font-sans text-[10px] sm:text-[11px] font-medium tracking-[0.26em] uppercase text-[#7D7364] group-hover:text-[#181714] transition-colors duration-300">
                  Practice Timeline
                </span>
                <motion.span
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-flex items-center justify-center text-[#B8936D] group-hover:translate-y-0.5 transition-transform duration-300"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.span>
              </button>
            </div>
          </ScrollReveal>

          {/* Stately Statistics Ribbon — Balanced, centered, eliminating wasted vertical space */}
          <ScrollReveal yOffset={24} className="mt-6 sm:mt-8 md:mt-10 w-full max-w-5xl mx-auto">
            <div className="bg-[#FAF8F4] border border-[#DCD5C8] rounded-2xl p-5 sm:p-7 shadow-none">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-y-6 gap-x-4 sm:gap-8 md:divide-x md:divide-[#E5DFD4]">
                <div className="text-center">
                  <span className="text-[9.5px] sm:text-[10px] font-sans tracking-[0.2em] text-[#8C7A65] uppercase block mb-1">
                    FOUNDED
                  </span>
                  <span className="font-serif text-2xl sm:text-4xl text-[#181714] font-normal">
                    2016
                  </span>
                  <span className="text-[10px] text-[#A69B8D] block mt-0.5">Coimbatore, TN</span>
                </div>

                <div className="text-center">
                  <span className="text-[9.5px] sm:text-[10px] font-sans tracking-[0.2em] text-[#8C7A65] uppercase block mb-1">
                    DEVELOPED
                  </span>
                  <span className="font-serif text-2xl sm:text-4xl text-[#181714] font-normal">
                    250K+
                  </span>
                  <span className="text-[10px] text-[#A69B8D] block mt-0.5">Square Feet Built</span>
                </div>

                <div className="text-center">
                  <span className="text-[9.5px] sm:text-[10px] font-sans tracking-[0.2em] text-[#8C7A65] uppercase block mb-1">
                    VASTHU &amp; CODE
                  </span>
                  <span className="font-serif text-2xl sm:text-4xl text-[#181714] font-normal">
                    100%
                  </span>
                  <span className="text-[10px] text-[#A69B8D] block mt-0.5">Manaiyadi Verified</span>
                </div>

                <div className="text-center">
                  <span className="text-[9.5px] sm:text-[10px] font-sans tracking-[0.2em] text-[#8C7A65] uppercase block mb-1">
                    LANDMARKS
                  </span>
                  <span className="font-serif text-2xl sm:text-4xl text-[#181714] font-normal">
                    10+
                  </span>
                  <span className="text-[10px] text-[#A69B8D] block mt-0.5">Delivered &amp; Ongoing</span>
                </div>

                <div className="text-center col-span-2 md:col-span-1 pt-4 md:pt-0 border-t border-[#E5DFD4]/70 md:border-t-0">
                  <span className="text-[9.5px] sm:text-[10px] font-sans tracking-[0.2em] text-[#8C7A65] uppercase block mb-1">
                    COMPROMISE
                  </span>
                  <span className="font-serif text-2xl sm:text-4xl text-[#181714] font-normal">
                    0%
                  </span>
                  <span className="text-[10px] text-[#A69B8D] block mt-0.5">M25 RCC Standards</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Chapter 01: Practice Manifesto & Foundational Principles */}
      <section id="chronicle" className="py-16 sm:py-28 bg-[#F4F2EB] border-b border-[#E3DCCF] scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Monograph Intro (5 Cols) */}
            <ScrollReveal className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-2 text-[#99744C] text-[10px] tracking-[0.26em] uppercase font-bold font-sans">
                <span className="w-3 h-px bg-[#B8936D]" />
                <span>CHAPTER 01 &bull; THE MANIFESTO</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl text-[#141311] font-normal leading-tight tracking-[-0.02em]">
                Craftsmanship over Mass Production.
              </h2>

              <p className="text-xs sm:text-sm text-[#575046] leading-relaxed font-light">
                We emphasize direct hands-on leadership on every site, ensuring continuous principal supervision and uncompromised craftsmanship.
              </p>

              <div className="p-5 bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-[#B8936D]">
                  <Compass className="w-4 h-4" />
                  <span className="text-[10px] font-sans tracking-[0.2em] uppercase font-semibold">
                    The Soul Space Promise
                  </span>
                </div>
                <p className="font-serif text-base sm:text-lg text-[#181714] italic leading-snug">
                  &ldquo;We have always believed that quality, time and safety are the topmost priority. Therefore, we set disciplined targets that never force us to compromise the quality of work delivered.&rdquo;
                </p>
                <span className="text-[10px] font-sans text-[#8C7A65] block uppercase tracking-wider">
                  — Executive Leadership, Soul Space Infrastructure
                </span>
              </div>
            </ScrollReveal>

            {/* Right Detailed Narrative (7 Cols) */}
            <ScrollReveal yOffset={24} className="lg:col-span-7 space-y-6">
              <div className="bg-[#FAF8F5] border border-[#DCD5C8] rounded-2xl p-6 sm:p-10 space-y-6">
                <h3 className="font-serif text-2xl text-[#181714] font-normal border-b border-[#E5DFD4] pb-4">
                  A Decade of Disciplined Evolution
                </h3>

                <p className="text-xs sm:text-sm text-[#4A433A] leading-relaxed font-light">
                  Beginning in 2016, Soul Space was forged in the demanding discipline of civil construction—testing concrete matrices, inspecting structural steel, and perfecting site execution.
                </p>

                <p className="text-xs sm:text-sm text-[#4A433A] leading-relaxed font-light">
                  Today, every Soul Space commission represents a harmonious union of three essential architectural pillars:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E5DFD4]">
                  <div className="p-4 bg-[#F4F2EB] rounded-lg border border-[#E0D7C9]">
                    <span className="text-[10px] font-sans font-bold text-[#B8936D] tracking-wider uppercase block mb-1">
                      01 &bull; TECTONICS
                    </span>
                    <h4 className="font-serif text-sm font-medium text-[#181714] mb-1">Structural Rigor</h4>
                    <p className="text-[11px] text-[#635A4E] leading-snug">
                      M25 RCC frames, isolated footings, and branded ISO certified components.
                    </p>
                  </div>

                  <div className="p-4 bg-[#F4F2EB] rounded-lg border border-[#E0D7C9]">
                    <span className="text-[10px] font-sans font-bold text-[#B8936D] tracking-wider uppercase block mb-1">
                      02 &bull; HARMONY
                    </span>
                    <h4 className="font-serif text-sm font-medium text-[#181714] mb-1">Vedic Alignment</h4>
                    <p className="text-[11px] text-[#635A4E] leading-snug">
                      100% Vasthu &amp; Manaiyadi compliance guaranteeing light and ventilation.
                    </p>
                  </div>

                  <div className="p-4 bg-[#F4F2EB] rounded-lg border border-[#E0D7C9]">
                    <span className="text-[10px] font-sans font-bold text-[#B8936D] tracking-wider uppercase block mb-1">
                      03 &bull; SERVICE
                    </span>
                    <h4 className="font-serif text-sm font-medium text-[#181714] mb-1">Personal Care</h4>
                    <p className="text-[11px] text-[#635A4E] leading-snug">
                      Hands-on principal management style with direct client communication.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Chapter 02: Practice Chronicle Timeline */}
      <section id="chronicle" className="py-16 sm:py-28 bg-[#FAF8F5] border-b border-[#E3DCCF] scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="flex flex-col items-center text-center gap-4 border-b border-[#D8D0C0] pb-10 mb-16">
            <div className="flex items-center gap-2 text-[#99744C] text-[10px] tracking-[0.28em] uppercase font-bold font-sans">
              <span className="w-3 h-px bg-[#B8936D]" />
              <span>CHAPTER 02 &bull; PRACTICE CHRONICLE</span>
              <span className="w-3 h-px bg-[#B8936D]" />
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#141311] font-normal tracking-[-0.02em]">
              The Evolutionary Trajectory.
            </h2>
            <p className="text-xs sm:text-sm text-[#575046] max-w-2xl leading-relaxed font-light">
              Key milestones marking our transformation from civil contractors into a distinguished architectural development practice.
            </p>
          </ScrollReveal>

          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {milestones.map((item, idx) => (
              <ScrollReveal
                key={idx}
                yOffset={20}
                delay={idx * 0.08}
                className="bg-[#F4F2EB] border border-[#E0D7C9] rounded-2xl p-6 sm:p-8 hover:border-[#CBB8A0] transition-colors relative overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-start">
                  <div className="sm:col-span-3">
                    <span className="font-serif text-3xl sm:text-4xl text-[#B8936D] font-normal block">
                      {item.year}
                    </span>
                    <span className="text-[10px] font-sans tracking-[0.2em] text-[#8C7A65] uppercase font-semibold block mt-1">
                      PHASE 0{idx + 1}
                    </span>
                  </div>

                  <div className="sm:col-span-9 space-y-2">
                    <h3 className="font-serif text-xl sm:text-2xl text-[#181714] font-normal">
                      {item.phase}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#524B41] leading-relaxed font-light">
                      {item.description}
                    </p>
                    <div className="pt-2 text-[11px] font-sans text-[#8C7A65] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#B8936D] shrink-0" />
                      <span>{item.focus}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter 03: The Portfolio Folio — Dynamic Picture Slots for Each Project */}
      <section
        id="portfolio-folio"
        className="py-16 sm:py-28 bg-[#181715] text-[#FAF8F5] border-b border-[#2D2A26] relative overflow-hidden scroll-mt-16"
      >
        {/* Subtle Background Architectural Grid */}
        <div className="absolute inset-0 bg-grid-architectural opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="flex flex-col items-center text-center gap-4 border-b border-[#2D2A26] pb-10 mb-16">
            <div className="flex items-center gap-2 text-[#B8936D] text-[10px] tracking-[0.28em] uppercase font-bold font-sans">
              <span className="w-3 h-px bg-[#B8936D]" />
              <span>CHAPTER 03 &bull; PORTFOLIO FOLIO</span>
              <span className="w-3 h-px bg-[#B8936D]" />
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal tracking-[-0.02em]">
              Five Signature Commissions.
            </h2>
            <p className="text-xs sm:text-sm text-[#A69B8D] max-w-2xl leading-relaxed font-light">
              An architectural showcase across residential enclaves, boutique city flats, tech commercial suites, and biophilic nature retreats in Coimbatore.
            </p>
          </ScrollReveal>

          {/* Project Folio Cards with One Dynamic Picture Slot for Each Project */}
          <div className="space-y-12 sm:space-y-16">
            {portfolioFolio.map((proj, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <ScrollReveal
                  key={proj.id}
                  yOffset={28}
                  className="bg-[#201E1B] border border-[#332F2A] rounded-2xl overflow-hidden hover:border-[#B8936D]/60 transition-all duration-300 shadow-none"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                    {/* Visual Column with Dynamic Picture Slot (7 Cols) */}
                    <div
                      className={`lg:col-span-7 p-4 sm:p-6 lg:p-8 flex flex-col justify-center ${
                        isEven ? 'lg:order-1' : 'lg:order-2'
                      }`}
                    >
                      <DynamicPictureSlot
                        slotId={proj.slotId}
                        title={`${proj.title} — Signature Architectural Facade`}
                        caption={`${proj.title} located at ${proj.location}. ${proj.typology}.`}
                        aspectHint="Cinematic Landscape (16:9)"
                        orientation="landscape"
                        priority={idx === 0}
                        className="border-[#332F2A] hover:border-[#B8936D]/60"
                      />
                    </div>

                    {/* Editorial Data Column (5 Cols) — Aligned in middle */}
                    <div
                      className={`lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-center items-center text-center my-auto border-t lg:border-t-0 ${
                        isEven
                          ? 'lg:order-2 lg:border-l border-[#2D2A26]'
                          : 'lg:order-1 lg:border-r border-[#2D2A26]'
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center text-center w-full max-w-md mx-auto my-auto">
                        {/* Title & Tagline */}
                        <h3 className="font-serif text-2xl sm:text-4xl text-white font-normal mb-2 tracking-tight text-center">
                          {proj.title}
                        </h3>
                        <p className="font-serif text-xs sm:text-sm text-[#B8936D] italic mb-4 font-light text-center">
                          {proj.tagline}
                        </p>

                        {/* Location & Specs */}
                        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-[#A69B8D] mb-5 text-center">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#B8936D] shrink-0" />
                            <span>{proj.location}</span>
                          </div>
                          <span className="text-[#4A453E] hidden sm:inline">&bull;</span>
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#B8936D] shrink-0" />
                            <span>{proj.area}</span>
                          </div>
                        </div>

                        {/* Summary */}
                        <p className="text-xs sm:text-[13px] text-[#C4BCB0] leading-relaxed font-light mb-6 text-center">
                          {proj.summary}
                        </p>

                        {/* Detail Exploration Link */}
                        <div className="pt-2 w-full flex justify-center">
                          <Link
                            href={proj.link}
                            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto py-3 px-7 rounded-full bg-[#FAF8F5] text-[#181714] text-xs font-sans tracking-[0.16em] uppercase font-semibold hover:bg-white transition-colors duration-200 shadow-none"
                          >
                            <span>Explore Project Details</span>
                            <ArrowUpRight className="w-4 h-4 text-[#B8936D]" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Chapter 04: The Four Pillars of Practice */}
      <section className="py-16 sm:py-28 bg-[#FAF8F5] border-b border-[#E3DCCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="flex flex-col items-center text-center gap-4 border-b border-[#D8D0C0] pb-10 mb-16">
            <div className="flex items-center gap-2 text-[#99744C] text-[10px] tracking-[0.28em] uppercase font-bold font-sans">
              <span className="w-3 h-px bg-[#B8936D]" />
              <span>CHAPTER 04 &bull; CORE PILLARS</span>
              <span className="w-3 h-px bg-[#B8936D]" />
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#141311] font-normal tracking-[-0.02em]">
              The Soul Space Standard.
            </h2>
            <p className="text-xs sm:text-sm text-[#575046] max-w-2xl leading-relaxed font-light">
              Four fundamental tenets guide every architectural blueprint, tender specification, and concrete pour.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <StaggerItem
                  key={i}
                  className="bg-[#F4F2EB] border border-[#E5DFD4] p-6 sm:p-8 rounded-2xl flex flex-col justify-between hover:border-[#CBB8A0] transition-all duration-300 shadow-none"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#181715] flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6 text-[#B8936D]" />
                    </div>
                    <span className="text-[10px] font-sans font-bold tracking-widest text-[#B8936D] uppercase block mb-1">
                      TENET 0{i + 1}
                    </span>
                    <h3 className="font-serif text-2xl text-[#181714] font-normal mb-3">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#524B41] leading-relaxed font-light mb-6">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#DED7CB] text-[10.5px] font-sans text-[#7D7364] flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#B8936D] shrink-0" />
                    <span>{pillar.spec}</span>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Chapter 05: Construction Engineering & Material Integrity */}
      <section className="py-16 sm:py-28 bg-[#F4F2EB] border-b border-[#E3DCCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column (5 Cols) */}
            <ScrollReveal className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-2 text-[#99744C] text-[10px] tracking-[0.28em] uppercase font-bold font-sans">
                <span className="w-3 h-px bg-[#B8936D]" />
                <span>CHAPTER 05 &bull; TECTONIC INTEGRITY</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#141311] font-normal tracking-[-0.02em] leading-tight">
                Engineered to Outlast Generations.
              </h2>
              <p className="text-xs sm:text-sm text-[#575046] leading-relaxed font-light">
                Our materials are selected not for short-term visual appeal, but for their structural longevity, thermal resistance, and acoustic tranquility in Coimbatore&apos;s tropical climate.
              </p>

              <div className="pt-2">
                <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#DCD5C8] space-y-2.5 text-xs">
                  <span className="text-[10px] font-sans font-bold text-[#B8936D] uppercase tracking-wider block">
                    REGISTERED OFFICE &bull; COIMBATORE
                  </span>
                  <a
                    href="https://maps.google.com/?q=Soul+Space+Infrastructure,+No+5/2,+Hindustan+Avenue,+Nava+India+Road,+Sowripalayam+Post,+Coimbatore+-+641028"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-2 font-sans text-xs text-[#181714] hover:text-[#B8936D] transition-colors leading-relaxed group text-left"
                    aria-label="View Soul Space Registered Office on Google Maps"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#B8936D] shrink-0 mt-[2px]" />
                    <span className="hover:underline underline-offset-2">
                      No 5/2, Hindustan Avenue, Nava India Road, Sowripalayam Post, Coimbatore - 641028, Tamil Nadu, India.
                    </span>
                  </a>
                  <div className="pt-2 flex items-center gap-3 border-t border-[#E5DFD4] text-[11px] text-[#5C5346] flex-wrap">
                    <a
                      href="https://www.instagram.com/soul.space.projects/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-[#B8936D] transition-colors"
                      aria-label="Instagram: @soul.space.projects"
                    >
                      <Instagram className="w-3.5 h-3.5 text-[#B8936D]" />
                      <span>@soul.space.projects</span>
                    </a>
                    <span>&bull;</span>
                    <a
                      href="https://www.facebook.com/soulspaceinfra"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-[#B8936D] transition-colors"
                      aria-label="Facebook: @soulspaceinfra"
                    >
                      <Facebook className="w-3.5 h-3.5 text-[#B8936D]" />
                      <span>@soulspaceinfra</span>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Specification Matrix (7 Cols) */}
            <ScrollReveal yOffset={24} className="lg:col-span-7">
              <div className="bg-[#FAF8F5] border border-[#DCD5C8] rounded-2xl p-6 sm:p-10 divide-y divide-[#E5DFD4]">
                <div className="pb-5">
                  <div className="flex items-center gap-2 text-[#B8936D] mb-1">
                    <Building2 className="w-4 h-4" />
                    <span className="text-[11px] font-sans tracking-wider uppercase font-semibold text-[#181714]">
                      Foundation &amp; Sub-Structure
                    </span>
                  </div>
                  <p className="text-xs text-[#524B41] font-light leading-relaxed">
                    M25 Grade concrete RCC framed monoliths with isolated footings and corrosion-resistant steel rebar.
                  </p>
                </div>

                <div className="py-5">
                  <div className="flex items-center gap-2 text-[#B8936D] mb-1">
                    <Layers className="w-4 h-4" />
                    <span className="text-[11px] font-sans tracking-wider uppercase font-semibold text-[#181714]">
                      Super-Structure Masonry
                    </span>
                  </div>
                  <p className="text-xs text-[#524B41] font-light leading-relaxed">
                    Acoustically insulated AAC blocks, Porotherm thermal clay bricks, and polymer-modified mortar.
                  </p>
                </div>

                <div className="py-5">
                  <div className="flex items-center gap-2 text-[#B8936D] mb-1">
                    <Compass className="w-4 h-4" />
                    <span className="text-[11px] font-sans tracking-wider uppercase font-semibold text-[#181714]">
                      Sanitaryware &amp; Hydraulics
                    </span>
                  </div>
                  <p className="text-xs text-[#524B41] font-light leading-relaxed">
                    European wall-hung sanitary fittings by Kohler and Roca with hydro-pneumatic pressurized water loops.
                  </p>
                </div>

                <div className="pt-5">
                  <div className="flex items-center gap-2 text-[#B8936D] mb-1">
                    <Award className="w-4 h-4" />
                    <span className="text-[11px] font-sans tracking-wider uppercase font-semibold text-[#181714]">
                      Electro-Mechanical &amp; Power
                    </span>
                  </div>
                  <p className="text-xs text-[#524B41] font-light leading-relaxed">
                    Concealed copper wiring with ISO cables, modular Legrand switches, 100% DG backup, and EV charging ports.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Chapter 06: Commission Feasibility & Inquiries */}
      <section id="inquiries" className="scroll-mt-16">
        <CommissionEstimator initialTypology="residential" />
      </section>

      {/* Global Footer */}
      <Footer onOpenProject={() => {}} />
    </div>
  );
}
