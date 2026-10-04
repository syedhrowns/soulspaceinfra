'use client';

import React from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';

interface ServicesProps {
  onOpenCommission?: (typology?: string) => void;
}

export function Services({ onOpenCommission }: ServicesProps) {
  const practices = [
    {
      code: 'SERVICE 01',
      typologyId: 'aurum-villas',
      title: 'Independent Luxury Villas',
      desc: 'Bespoke 3 & 4 BHK individual gated residences with private landscaped terrace gardens, 100% Vasthu geometry, and seasoned teakwood joinery.',
      deliverables: ['100% Vasthu & Manaiyadi', 'Private Terrace Gardens', 'Seasoned Teakwood Doors', 'Clubhouse & Pool'],
    },
    {
      code: 'SERVICE 02',
      typologyId: 'abv-arbor',
      title: 'Luxury Apartments',
      desc: 'Exclusive low-density boutique monoliths (Stilt + 5 floors) with private terrace gardens, piped gas, and premium European fixtures in prime city hubs.',
      deliverables: ['Stilt + 5 RCC Monolith', 'Piped Gas Infrastructure', 'Private Terrace Gardens', '1 kVA Genset Backup'],
    },
    {
      code: 'SERVICE 03',
      typologyId: 'uptown-residences',
      title: 'Budget Apartments',
      desc: 'Thoughtfully crafted 1, 2 & 3 BHK contemporary residences delivering attainable luxury with resort-style amenities, swimming pool, and community parks.',
      deliverables: ['1, 2 & 3 BHK Residences', 'Swimming Pool & Gym', 'Private Home Theatre', 'Dedicated STP & Parks'],
    },
    {
      code: 'SERVICE 04',
      typologyId: 'dotcom-workspaces',
      title: 'Commercial Workspaces',
      desc: 'Grade-A column-free IT tech suites engineered with Post-Tensioned (PT) slabs, 11’6” ceiling clearance, and automated stacked parking systems.',
      deliverables: ['Column-Free PT Slabs', '11’6” Floor Clearance', 'Automated Stacked Parking', 'Rooftop Dining & Gym'],
    },
    {
      code: 'SERVICE 05',
      typologyId: 'mystic-villas',
      title: 'Farmhouse Villas',
      desc: 'Biophilic 80-20 concept coconut plantation retreats on 22+ cent estates with private plunge pools and pure Siruvani mineral water near Isha Adiyogi.',
      deliverables: ['80-20 Nature Concept', '22+ Cents Private Land', 'Private Plunge Pools', 'Surplus Siruvani Water'],
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-28 bg-[#ECE7DF] text-[#1C1A17] border-b border-[#D8D0C2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="flex flex-col items-center text-center gap-4 pb-8 mb-10">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 text-[#B8936D] text-[9px] tracking-[0.3em] uppercase font-sans mb-3 font-bold">
              <span className="w-2.5 h-px bg-[#B8936D]" />
              <span>SERVICES &amp; DEVELOPMENT PRACTICE</span>
              <span className="w-2.5 h-px bg-[#B8936D]" />
            </div>
            <h2 className="font-serif text-2xl sm:text-5xl md:text-6xl text-[#181714] tracking-[-0.03em] font-normal leading-tight">
              Scope of Development
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5346] max-w-2xl leading-relaxed font-light mt-3">
              Five signature disciplines defining Soul Space Infrastructure across residential, commercial, and biophilic developments in Coimbatore.
            </p>
          </div>
        </ScrollReveal>

        {/* 5 Disciplines Responsive Layout */}
        <div className="flex flex-wrap justify-center gap-5 sm:gap-6 items-stretch">
          {practices.map((practice, i) => (
            <ScrollReveal
              key={i}
              delay={i * 0.08}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(20%-20px)] border border-[#DCD5C8] bg-[#FAF8F4] p-6 rounded-xl flex flex-col items-center text-center justify-between hover:border-[#CBB8A0] transition-all shadow-none group"
            >
              <div className="flex flex-col items-center text-center w-full">
                <span className="text-[9px] font-sans text-[#B8936D] tracking-widest block mb-2 font-bold uppercase">
                  {practice.code}
                </span>
                <h3 className="font-serif text-lg sm:text-xl text-[#181714] mb-2 sm:mb-3 font-normal min-h-[48px] sm:min-h-[56px] flex items-center justify-center leading-snug">
                  {practice.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#5C5346] leading-relaxed font-light mb-5">
                  {practice.desc}
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 mb-5 mt-auto">
                  {practice.deliverables.map((item, j) => (
                    <span
                      key={j}
                      className="text-[9px] sm:text-[10px] font-sans px-2.5 py-1 bg-[#F4F2EB] text-[#5C5346] border border-[#E0D9CC] rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {onOpenCommission && (
                <button
                  type="button"
                  onClick={() => onOpenCommission(practice.typologyId)}
                  className="w-full mt-2 pt-3 border-t border-[#EAE3D6] text-[10px] font-sans tracking-[0.16em] uppercase font-semibold text-[#8C7A65] group-hover:text-[#B8936D] transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                  aria-label={`Inquire about ${practice.title}`}
                >
                  <span>Inquire Service</span>
                  <span className="text-xs">&rarr;</span>
                </button>
              )}
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
