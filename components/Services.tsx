'use client';

import React from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';

interface ServicesProps {
  onOpenCommission: () => void;
}

export function Services({ onOpenCommission }: ServicesProps) {
  const practices = [
    {
      code: 'SERVICE 01',
      title: 'Gated Luxury Villas',
      desc: 'Individual 3-BHK villas with private terrace gardens, 100% Vastu compliance, and teakwood finishes.',
      deliverables: ['100% Vasthu & Manaiyadi', 'Private Terrace Gardens', 'Seasoned Teakwood Doors', 'Dedicated Car Parks'],
    },
    {
      code: 'SERVICE 02',
      title: 'Private Residences',
      desc: 'Contemporary 2 & 3 BHK apartment communities designed for cross-ventilation and quiet family living.',
      deliverables: ['Vitrified Tile Flooring', 'Solar Water & Power Backup', 'Hydro-Pneumatic Water', 'Branded Sanitaryware'],
    },
    {
      code: 'SERVICE 03',
      title: 'Commercial IT Hubs',
      desc: 'Column-free IT office buildings with Post-Tensioned (PT) slabs and adaptable workspace floor plates.',
      deliverables: ['Column-Free PT Slabs', 'High-Speed Elevators', '100% Power Generator Backup', 'Fire Safety Networks'],
    },
    {
      code: 'SERVICE 04',
      title: 'Turnkey Civil Execution',
      desc: 'End-to-end contracting, structural engineering, MEP coordination, and disciplined on-time handover.',
      deliverables: ['Soil & Concrete Testing', 'Dedicated Partner Governance', 'Transparent Milestone Delivery', 'Post-Handover Support'],
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
          </div>
        </ScrollReveal>

        {/* 4 Disciplines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
          {practices.map((practice, i) => (
            <ScrollReveal
              key={i}
              delay={i * 0.1}
              className="border border-[#DCD5C8] bg-[#FAF8F4] p-6 sm:p-8 rounded-lg flex flex-col items-center text-center justify-between hover:border-[#CBB8A0] transition-all shadow-none"
            >
              <div className="flex flex-col items-center text-center w-full">
                <span className="text-[9px] font-sans text-[#B8936D] tracking-widest block mb-2 font-bold uppercase">
                  {practice.code}
                </span>
                <h3 className="font-serif text-lg sm:text-2xl text-[#181714] mb-2 sm:mb-3 font-normal">
                  {practice.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#5C5346] leading-relaxed font-light mb-5">
                  {practice.desc}
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 mt-auto">
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
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
