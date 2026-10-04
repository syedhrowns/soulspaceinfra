'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ShieldCheck, Clock, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';

export function Studio() {
  const pillars = [
    {
      title: 'Quality First',
      desc: 'M25 foundations, ISO-certified steel, and European fittings engineered to endure for generations.',
      icon: ShieldCheck,
    },
    {
      title: 'Punctual Delivery',
      desc: 'Disciplined project milestones ensuring on-schedule completion without cutting corners.',
      icon: Clock,
    },
    {
      title: 'Safety & Compliance',
      desc: '100% seismic-resistant RCC designs and complete Vastu compliance on every development.',
      icon: Award,
    },
    {
      title: 'Hands-On Leadership',
      desc: 'Direct principal site stewardship bridging architectural design and precision execution.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-28 bg-[#FAF8F4] border-b border-[#E3DCCF] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="flex flex-col items-center text-center gap-6 border-b border-[#D8D0C0] pb-10 mb-16">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-[#99744C] text-[10px] tracking-[0.3em] uppercase font-bold mb-4">
              <span className="w-3 h-px bg-[#B8936D]" />
              <span>ABOUT SOUL SPACE INFRASTRUCTURE</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#141311] tracking-[-0.03em] font-normal">
              Quality, Functionality <br className="hidden sm:inline" />
              <span className="italic text-[#B8936D] font-normal">&amp; Enduring Value.</span>
            </h2>
          </div>

          <p className="text-sm text-[#575046] max-w-2xl leading-relaxed font-light">
            Building trust with passion and integrity since 2016 across Coimbatore, Tamil Nadu.
          </p>
        </ScrollReveal>

        {/* Official Company Statement Card */}
        <ScrollReveal yOffset={25} className="mb-16">
          <div className="bg-[#F4F2EB] border border-[#E5DFD4] p-5 sm:p-12 lg:p-14 rounded-2xl shadow-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 sm:w-64 sm:h-64 bg-[#B8936D]/5 rounded-bl-full pointer-events-none" />

            <div className="max-w-4xl">
              <span className="text-[10px] font-sans text-[#B8936D] tracking-[0.25em] uppercase font-bold block mb-4">
                FOUNDING PROFILE &bull; ESTABLISHED 2016
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#181715] font-normal leading-snug mb-5">
                &ldquo;We have always believed that quality, time and safety are the topmost priority.&rdquo;
              </h3>

              <div className="text-sm sm:text-base text-[#4A433A] leading-relaxed font-light">
                <p>
                  Established in 2016 in Coimbatore, <strong>Soul Space</strong> combines civil engineering rigor with refined architectural development. We emphasize a hands-on management style, personal attention to every client, and an uncompromising commitment to structural safety and enduring value.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-8 border-t border-[#E5DFD4] text-xs font-sans">
                <div>
                  <span className="text-[#8C7A65] uppercase block text-[10px]">Founded</span>
                  <span className="font-serif text-[#181715] text-lg font-medium">2016</span>
                </div>
                <div>
                  <span className="text-[#8C7A65] uppercase block text-[10px]">Focus</span>
                  <span className="font-serif text-[#181715] text-lg font-medium">Quality &amp; Value</span>
                </div>
                <div>
                  <span className="text-[#8C7A65] uppercase block text-[10px]">Style</span>
                  <span className="font-serif text-[#181715] text-lg font-medium">Hands-On Management</span>
                </div>
                <div>
                  <span className="text-[#8C7A65] uppercase block text-[10px]">Territory</span>
                  <span className="font-serif text-[#181715] text-lg font-medium">Coimbatore, TN</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 4 Pillars of Practice */}
        <div>
          <div className="text-center mb-10">
            <span className="text-[10px] font-sans text-[#8C7A65] tracking-widest uppercase font-semibold">
              OUR CORE ETHOS
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#181715] mt-1 font-normal">
              What Defines Soul Space
            </h3>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <StaggerItem
                  key={i}
                  className="bg-[#F4F2EB] border border-[#E5DFD4] p-6 rounded-xl flex flex-col justify-between hover:border-[#CBB8A0] transition-all duration-300 shadow-none"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#181715] text-[#C4BCB0] flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-[#B8936D]" />
                    </div>
                    <h4 className="font-serif text-xl text-[#181715] font-normal mb-2">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-[#5C5346] leading-relaxed font-light">
                      {pillar.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-[#EFECE5] text-[10px] font-sans font-semibold tracking-widest text-[#8C7A65]">
                    PILLAR 0{i + 1}
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Monograph Portal Callout Banner */}
        <ScrollReveal yOffset={25} className="mt-14 sm:mt-20">
          <div className="bg-[#181715] text-[#FAF8F5] border border-[#2D2A26] rounded-2xl p-6 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-none hover:border-[#CBB8A0] transition-colors duration-300">
            <div className="absolute inset-0 bg-grid-architectural opacity-15 pointer-events-none" />
            <div className="relative z-10 max-w-2xl space-y-3 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[#B8936D] text-[10px] tracking-[0.25em] uppercase font-bold font-sans">
                <span className="w-3 h-px bg-[#B8936D]" />
                <span>PRACTICE MONOGRAPH &bull; 2016 — 2026</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-4xl text-white font-normal leading-snug">
                Explore the Complete Architectural Monograph.
              </h3>
              <p className="text-xs sm:text-sm text-[#A69B8D] leading-relaxed font-light">
                Discover our decade-long chronicle, civil engineering tectonics, 100% Vasthu methodology, and the five signature residential &amp; commercial portfolio works.
              </p>
            </div>

            <div className="relative z-10 shrink-0 w-full sm:w-auto">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-4 rounded-full bg-[#FAF8F5] text-[#181714] text-xs font-sans tracking-[0.18em] uppercase font-semibold hover:bg-white hover:text-black transition-all duration-300 shadow-none group"
              >
                <span>Read Full Monograph</span>
                <ArrowUpRight className="w-4 h-4 text-[#B8936D] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
