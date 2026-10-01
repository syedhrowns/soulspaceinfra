'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass } from 'lucide-react';
import { PROJECTS } from '@/data/projects';
import { ScrollReveal } from '@/components/ScrollReveal';
import { DynamicPictureSlot } from '@/components/DynamicPictureSlot';
import { getProjectSlotId } from '@/lib/slots';
import { BrandLogo } from '@/components/BrandLogo';

interface IdentityBannerProps {
  onOpenProject: (projectId: string) => void;
}

export function IdentityBanner({ onOpenProject }: IdentityBannerProps) {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  // All flagship developments for instant preview
  const showcaseProjects = PROJECTS;
  const currentProject = showcaseProjects[selectedProjectIndex] || PROJECTS[0];

  return (
    <section 
      id="showcase"
      className="bg-[#f4f2eb] py-12 sm:py-16 md:py-20 lg:py-24 border-b border-[#E5DFD4] flex flex-col justify-center items-center w-full overflow-hidden scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <ScrollReveal 
          className="flex flex-col items-center text-center mb-6 sm:mb-8"
        >
          {/* Main Brand Lockup */}
          <div className="flex justify-center">
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
              className="cursor-pointer focus:outline-hidden hover:opacity-90 transition-opacity flex items-center justify-center"
              aria-label="Scroll to top of current page"
              id="banner-brand-logo-link"
            >
              <BrandLogo variant="banner" />
            </button>
          </div>
        </ScrollReveal>

        {/* Compact, Full-Viewport Architectural Canvas Card with Pure Glass Blur */}
        <ScrollReveal
          delay={0.15}
          className="bg-[#FAF8F5]/30 backdrop-blur-2xl border border-[#E5DFD4]/60 rounded-xl shadow-none p-4 sm:p-8 lg:p-10 relative overflow-hidden flex flex-col items-center"
        >
          {/* Main Visual Stage - Dynamic Adaptive Slot */}
          <div className="relative w-full rounded-lg overflow-hidden bg-[#181715] group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <DynamicPictureSlot
                  slotId={getProjectSlotId(currentProject.id, 1)}
                  title={currentProject.title}
                  src={currentProject.heroImage}
                  orientation="wide"
                  aspectHint="21:9"
                  priority
                  className="border-0 rounded-none w-full"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Project Details Bar (Outside the image slot) */}
          <div className="w-full mt-4 flex items-center justify-between gap-4 py-2 border-b border-[#E5DFD4]/60 min-h-[40px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3"
              >
                <h2 className="font-serif text-lg sm:text-xl text-[#181715] font-normal">
                  {currentProject.title}
                </h2>
                <span className="hidden sm:inline text-xs text-[#7A7061] font-sans">
                  ({currentProject.location})
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Integrated Quick Switcher Bar with Warm Linen Tone */}
          <div className="w-full mt-4 px-4 py-3 sm:px-6 sm:py-3.5 bg-[#FAF8F4] border border-[#E5DFD4] rounded-lg sm:rounded-full flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-sans text-[#7A7061] uppercase tracking-wider shrink-0">
              <Compass className="w-3.5 h-3.5 text-[#B8936D]" />
              <span className="hidden md:inline">FLAGSHIP DEVELOPMENTS:</span>
            </div>

            {/* Fast 4-Project Switch Pills */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              {showcaseProjects.map((project, idx) => {
                const isActive = selectedProjectIndex === idx;
                return (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProjectIndex(idx)}
                    className={`px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-sans tracking-wider uppercase transition-all cursor-pointer text-center sm:text-left truncate border ${
                      isActive
                        ? 'bg-[#181715] text-white border-[#2B2723] hover:border-[#CBB8A0]'
                        : 'bg-[#EDE7DC] text-[#4A4338] border-[#D9D1C3] hover:border-[#CBB8A0]'
                    }`}
                    id={`hero-project-tab-${project.id}`}
                  >
                    <span>{project.title.replace('The ', '')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compact Metric Strip */}
          <div className="w-full mt-4 grid grid-cols-2 md:grid-cols-4 border border-[#E5DFD4] rounded-lg overflow-hidden bg-[#FAF8F4] text-[#2C2720] divide-x divide-[#E5DFD4] divide-y md:divide-y-0">
            <div className="px-3 py-2.5 sm:px-6 sm:py-4">
              <span className="text-[9px] font-sans uppercase tracking-widest text-[#8C7E6D] block">
                PRACTICE SCOPE
              </span>
              <p className="font-serif text-sm sm:text-base text-[#181715] font-medium leading-tight mt-1">
                Villas &amp; Commercial IT
              </p>
            </div>

            <div className="px-3 py-2.5 sm:px-6 sm:py-4">
              <span className="text-[9px] font-sans uppercase tracking-widest text-[#8C7E6D] block">
                CORE TECTONICS
              </span>
              <p className="font-serif text-sm sm:text-base text-[#181715] font-medium leading-tight mt-1">
                PT Slabs &amp; Teakwood
              </p>
            </div>

            <div className="px-3 py-2.5 sm:px-6 sm:py-4">
              <span className="text-[9px] font-sans uppercase tracking-widest text-[#8C7E6D] block">
                COMPLIANCE RIGOR
              </span>
              <p className="font-serif text-sm sm:text-base text-[#181715] font-medium leading-tight mt-1">
                100% Vasthu Compliant
              </p>
            </div>

            <div className="px-3 py-2.5 sm:px-6 sm:py-4">
              <span className="text-[9px] font-sans uppercase tracking-widest text-[#8C7E6D] block">
                HEADQUARTERS
              </span>
              <p className="font-serif text-sm sm:text-base text-[#99744C] font-medium leading-tight mt-1">
                Coimbatore, TN
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
