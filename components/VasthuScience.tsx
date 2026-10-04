'use client';

import React from 'react';
import { Sun, Compass, Wind, Layers, ShieldCheck, Sparkles, Check } from 'lucide-react';

export function VasthuScience() {
  const scientificPrinciples = [
    {
      number: '01',
      icon: Sun,
      title: 'Heliocentric & Solar Geometry',
      category: 'Thermal Physics',
      direction: 'North-East to South-West',
      description:
        'Living spaces align with the solar arc—capturing purifying morning daylight in the North-East while buffering dense structural walls against afternoon heat in the South-West.',
      highlight: 'Maximizes natural daylighting while reducing air-conditioning heat loads naturally.',
    },
    {
      number: '02',
      icon: Compass,
      title: 'Geomagnetic Alignment',
      category: 'Bio-Electromagnetism',
      direction: 'North-South Magnetic Axis',
      description:
        'Resting quarters synchronize with Earth’s magnetic flux, relieving cardiovascular tension and encouraging deeper, undisturbed REM sleep cycles.',
      highlight: 'Aligns resting physiology with terrestrial fields for optimal neurological recovery.',
    },
    {
      number: '03',
      icon: Wind,
      title: 'Aerodynamic Stack Ventilation',
      category: 'Microclimate Engineering',
      direction: 'Brahmasthanam Core',
      description:
        'An open, unweighted central core acts as a natural thermal chimney, drawing warm interior air upward while pulling cool ambient breezes across living suites.',
      highlight: 'Continuous natural cross-ventilation without mechanical noise or stagnation.',
    },
    {
      number: '04',
      icon: Layers,
      title: 'Pancha Bhoota Elemental Zoning',
      category: 'Biophilic Design',
      direction: 'Five Cardinal Energies',
      description:
        'Balancing water in the North-East, fire in the culinary South-East, earth in the structural South-West, air in the North-West, and central open space.',
      highlight: 'Harmonious spatial organization producing tangible calm and domestic peace.',
    },
  ];

  return (
    <div className="w-full">
      {/* Editorial Header */}
      <div className="border-t border-[#D5CDBF] pt-14 sm:pt-18 mb-12 sm:mb-16">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <div className="flex items-center gap-2 text-[#99744C] text-[10px] tracking-[0.3em] uppercase font-bold mb-3">
            <span className="w-3 h-px bg-[#B8936D]" />
            <span>ENVIRONMENTAL PHYSICS &amp; VEDIC ARCHITECTURE</span>
            <span className="w-3 h-px bg-[#B8936D]" />
          </div>

          <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#181714] tracking-[-0.02em] font-normal mb-4 leading-tight">
            The Science <br className="hidden sm:inline" />
            <span className="italic text-[#B8936D] font-normal">&amp; Sanctuary of Vastu Shastra.</span>
          </h3>

          <p className="text-xs sm:text-sm text-[#5C5346] leading-relaxed font-light max-w-xl text-center">
            India&apos;s empirical framework of bioclimatic architecture—engineered to synchronize human dwellings with solar geometry, prevailing breezes, and terrestrial magnetic flux.
          </p>
        </div>
      </div>

      {/* Narrative Dual-Column Streamlined Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-14 sm:mb-16 items-stretch">
        {/* Left Column: The Living Experience */}
        <div className="lg:col-span-6 bg-[#FAF8F4] border border-[#DCD5C8] rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#B8936D] text-[10px] tracking-[0.25em] uppercase font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE LIVING EXPERIENCE</span>
            </div>

            <h4 className="font-serif text-lg sm:text-2xl text-[#181714] font-normal tracking-tight mb-3">
              Generational Well-Being &amp; Calm
            </h4>

            <p className="text-xs sm:text-[13.5px] text-[#5C5346] leading-relaxed font-light mb-5">
              By aligning primary living suites with optimal elemental quadrants, a Soul Space residence becomes a restorative sanctuary fostering cognitive clarity and deep domestic tranquility.
            </p>

            <div className="space-y-2.5 pt-2 border-t border-[#E8E2D7]">
              <div className="flex items-center gap-2.5 text-xs text-[#2D2821]">
                <div className="w-4 h-4 rounded-full bg-[#EBE3D5] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-[#B8936D]" />
                </div>
                <span>Morning ultraviolet ingress for natural indoor sanitation</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#2D2821]">
                <div className="w-4 h-4 rounded-full bg-[#EBE3D5] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-[#B8936D]" />
                </div>
                <span>Geomagnetic bedroom alignment for restorative REM sleep</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#2D2821]">
                <div className="w-4 h-4 rounded-full bg-[#EBE3D5] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-[#B8936D]" />
                </div>
                <span>Manaiyadi Shastra metric proportions for spatial balance</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E8E2D7] flex items-center justify-between">
            <span className="text-[10px] font-sans text-[#8C7A65] tracking-wider uppercase font-medium">
              Core Benefit
            </span>
            <span className="text-[11px] font-sans text-[#181714] font-medium tracking-tight">
              Sustained Vitality &amp; Domestic Peace
            </span>
          </div>
        </div>

        {/* Right Column: The Bioclimatic Engineering */}
        <div className="lg:col-span-6 bg-[#181715] text-[#FAF8F5] border border-[#2D2A26] rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#C5A880] text-[10px] tracking-[0.25em] uppercase font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>THE ARCHITECTURAL SCIENCE</span>
            </div>

            <h4 className="font-serif text-lg sm:text-2xl text-[#FAF8F5] font-normal tracking-tight mb-3">
              Passive Solar &amp; Microclimate Physics
            </h4>

            <p className="text-xs sm:text-[13.5px] text-[#C2B8A8] leading-relaxed font-light mb-5">
              Stripped of dogma, authentic Vastu is an empirical system of bioclimatic architecture calibrated specifically for the thermal and seasonal realities of the tropical Indian subcontinent.
            </p>

            <div className="space-y-2.5 pt-2 border-t border-[#332F2A]">
              <div className="flex items-center gap-2.5 text-xs text-[#E5DFD4]">
                <div className="w-4 h-4 rounded-full bg-[#2D2A26] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-[#C5A880]" />
                </div>
                <span>Thermal mass buffering against harsh afternoon solar heat</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#E5DFD4]">
                <div className="w-4 h-4 rounded-full bg-[#2D2A26] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-[#C5A880]" />
                </div>
                <span>Convective stack ventilation for natural air exchange</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#E5DFD4]">
                <div className="w-4 h-4 rounded-full bg-[#2D2A26] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-[#C5A880]" />
                </div>
                <span>Reduced cooling load and optimized natural illumination</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#332F2A] flex items-center justify-between">
            <span className="text-[10px] font-sans text-[#A69B8D] tracking-wider uppercase font-medium">
              Engineering Standard
            </span>
            <span className="text-[11px] font-sans text-[#C5A880] font-medium tracking-tight">
              100% Passive Solar &amp; Magnetic Harmony
            </span>
          </div>
        </div>
      </div>

      {/* 4 Scientific Principles Cards Grid */}
      <div className="mb-12 sm:mb-16">
        <div className="flex flex-col items-center text-center mb-8">
          <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#B8936D] font-bold mb-1">
            THE FOUR PILLARS OF VASTU PHYSICS
          </span>
          <h4 className="font-serif text-xl sm:text-2xl text-[#181714] font-normal">
            Natural Forces Shaping Every Soul Space Layout
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {scientificPrinciples.map((principle) => {
            const Icon = principle.icon;
            return (
              <div
                key={principle.number}
                className="bg-[#FAF8F4] border border-[#DCD5C8] rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-[#CBB8A0] group shadow-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-[#E8E2D7] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#DCD5C8] flex items-center justify-center text-[#B8936D] group-hover:border-[#B8936D] transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-[#8C7A65] font-semibold block">
                          {principle.category}
                        </span>
                        <span className="text-[10px] font-sans text-[#B8936D] font-medium">
                          {principle.direction}
                        </span>
                      </div>
                    </div>
                    <span className="font-serif text-2xl text-[#D5CDBF] font-light group-hover:text-[#B8936D] transition-colors">
                      {principle.number}
                    </span>
                  </div>

                  <h5 className="font-serif text-lg sm:text-xl text-[#181714] font-normal mb-2 leading-snug">
                    {principle.title}
                  </h5>

                  <p className="text-xs text-[#5C5346] leading-relaxed font-light mb-4">
                    {principle.description}
                  </p>
                </div>

                <div className="bg-[#F3EFE7] rounded-xl p-3 border border-[#E3DCCF]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#B8936D] text-xs font-bold leading-none">✦</span>
                    <p className="text-[11px] text-[#6B6153] leading-snug font-light italic">
                      {principle.highlight}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Soul Space Architectural Commitment Colophon Banner */}
      <div className="border border-[#DCD5C8] bg-[#FAF8F4] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-none">
        <div className="max-w-2xl">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#99744C] text-[10px] tracking-[0.25em] uppercase font-bold mb-1.5">
            <span className="w-2.5 h-px bg-[#B8936D]" />
            <span>OUR ARCHITECTURAL COMMITMENT</span>
          </div>
          <h4 className="font-serif text-lg sm:text-xl text-[#181714] font-normal tracking-tight mb-1.5">
            100% Vastu &amp; Manaiyadi Compliant by Design
          </h4>
          <p className="text-xs text-[#5C5346] leading-relaxed font-light">
            Every villa, apartment, and workspace layout is meticulously verified with certified Vastu and Manaiyadi Shastra consultants before structural foundations are excavated.
          </p>
        </div>

        <div className="shrink-0 flex flex-col items-center md:items-end gap-1 border-t md:border-t-0 md:border-l border-[#DCD5C8] pt-4 md:pt-0 md:pl-8">
          <span className="text-[9px] font-sans uppercase tracking-[0.25em] text-[#8C7A65] font-semibold">
            COMPLIANCE GUARANTEE
          </span>
          <span className="font-serif text-3xl sm:text-4xl text-[#B8936D] font-normal leading-none">
            100%
          </span>
          <span className="text-[10px] font-sans text-[#5C5346] tracking-wider uppercase font-light">
            Zero Architectural Compromise
          </span>
        </div>
      </div>
    </div>
  );
}
