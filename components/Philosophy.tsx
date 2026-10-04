'use client';

import React from 'react';
import { ShieldCheck, Compass, Clock, Sparkles } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { VasthuScience } from '@/components/VasthuScience';

export function Philosophy() {
  return (
    <section id="philosophy" className="py-16 sm:py-28 bg-[#ECE7DF] text-[#1C1A17] border-b border-[#D8D0C2] relative overflow-hidden">
      {/* Ambient Atmospheric Glows for Glass Refraction */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#B8936D]/15 blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-[#C89D6A]/10 blur-[140px]" />
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-[#B8936D]/10 blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal className="pb-8 mb-12 text-center flex flex-col items-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-[#B8936D] text-[9px] tracking-[0.3em] uppercase font-bold mb-4">
            <span className="w-2.5 h-px bg-[#B8936D]" />
            <span>PRACTICE MANIFESTO &amp; PHILOSOPHY</span>
            <span className="w-2.5 h-px bg-[#B8936D]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-5xl md:text-6xl text-[#181714] tracking-[-0.03em] font-normal mb-4 sm:mb-6">
            Quality, Time <span className="italic text-[#B8936D] font-normal">&amp; Safety.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#5C5346] leading-relaxed font-light text-center max-w-xl">
            Rooted in disciplined engineering since 2016, Soul Space crafts residential and commercial landmarks where structural rigor, natural light, and timely execution converge.
          </p>
        </ScrollReveal>

        {/* 4 Architectural Pillars Grid with Exact Space Consistency & Luxury Card Presentation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 sm:mb-20 pt-10 border-t border-[#D5CDBF]">
          <ScrollReveal delay={0.05} className="h-full">
            <div className="group p-6 sm:p-7 rounded-2xl bg-[#FAF8F4] border border-[#DCD5C8] shadow-none flex flex-col items-center text-center justify-start h-full transition-all duration-300 hover:border-[#CBB8A0]">
              <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] border border-[#DCD5C8] flex items-center justify-center text-[#B8936D] shadow-none shrink-0 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#181714] font-normal leading-snug tracking-tight mb-2">
                Structural Integrity
              </h3>
              <p className="text-xs text-[#5C5346] leading-relaxed font-light text-center">
                M25/M30 grade concrete and precision foundation engineering for generational durability.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="h-full">
            <div className="group p-6 sm:p-7 rounded-2xl bg-[#FAF8F4] border border-[#DCD5C8] shadow-none flex flex-col items-center text-center justify-start h-full transition-all duration-300 hover:border-[#CBB8A0]">
              <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] border border-[#DCD5C8] flex items-center justify-center text-[#B8936D] shadow-none shrink-0 mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#181714] font-normal leading-snug tracking-tight mb-2">
                Vasthu &amp; Natural Light
              </h3>
              <p className="text-xs text-[#5C5346] leading-relaxed font-light text-center">
                100% Manaiyadi Shastra compliance, maximizing cross-ventilation and natural morning light.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.25} className="h-full">
            <div className="group p-6 sm:p-7 rounded-2xl bg-[#FAF8F4] border border-[#DCD5C8] shadow-none flex flex-col items-center text-center justify-start h-full transition-all duration-300 hover:border-[#CBB8A0]">
              <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] border border-[#DCD5C8] flex items-center justify-center text-[#B8936D] shadow-none shrink-0 mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#181714] font-normal leading-snug tracking-tight mb-2">
                Punctual Delivery
              </h3>
              <p className="text-xs text-[#5C5346] leading-relaxed font-light text-center">
                Disciplined project scheduling and partner-led site supervision ensuring on-time handover.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.35} className="h-full">
            <div className="group p-6 sm:p-7 rounded-2xl bg-[#FAF8F4] border border-[#DCD5C8] shadow-none flex flex-col items-center text-center justify-start h-full transition-all duration-300 hover:border-[#CBB8A0]">
              <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] border border-[#DCD5C8] flex items-center justify-center text-[#B8936D] shadow-none shrink-0 mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#181714] font-normal leading-snug tracking-tight mb-2">
                Premium Materiality
              </h3>
              <p className="text-xs text-[#5C5346] leading-relaxed font-light text-center">
                Seasoned teakwood, Kohler fittings, Legrand electricals, and Post-Tensioned structural slabs.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* The Importance & Science Behind Vastu Shastra */}
        <ScrollReveal yOffset={36}>
          <VasthuScience />
        </ScrollReveal>
      </div>
    </section>
  );
}
