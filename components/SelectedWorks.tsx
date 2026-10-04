'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DynamicPictureSlot } from '@/components/DynamicPictureSlot';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { PROJECTS } from '@/data/projects';
import { ScrollReveal } from '@/components/ScrollReveal';
import { getProjectSlotId } from '@/lib/slots';
import { getAllCustomProjects, ProjectCustomData } from '@/lib/projectContent';

interface SelectedWorksProps {
  onOpenProject: (projectId: string) => void;
}

export function SelectedWorks({ onOpenProject }: SelectedWorksProps) {
  const [customMap, setCustomMap] = useState<Record<string, ProjectCustomData>>({});

  useEffect(() => {
    setCustomMap(getAllCustomProjects());
    const handleUpdate = () => setCustomMap(getAllCustomProjects());
    window.addEventListener('soulspace-project-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('soulspace-project-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);
  return (
    <section id="works" className="py-16 sm:py-28 bg-[#F7F5F0] border-b border-[#E3DCCF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="flex flex-col items-center text-center gap-6 border-b border-[#D8D0C0] pb-10 mb-12 sm:mb-16">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-[#99744C] text-xs tracking-[0.22em] uppercase font-semibold mb-2">
              <span className="w-2 h-0.5 bg-[#B8936D]" />
              <span>THE DEVELOPMENT PORTFOLIO</span>
            </div>
            <h2 
              className="font-serif text-2xl sm:text-5xl md:text-6xl text-[#141311] tracking-[-0.03em] font-normal leading-tight sm:leading-[65px]"
            >
              Projects <br className="hidden sm:inline" />
              <span className="italic text-[#B8936D] font-normal">&amp; Developments.</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#575046] max-w-2xl leading-relaxed font-light">
            A curated portfolio of luxury gated villas, exclusive residential enclaves, and commercial IT workspaces crafted across Coimbatore.
          </p>
        </ScrollReveal>

        {/* Editorial Developments Showcase */}
        <div className="space-y-16 sm:space-y-24">
          {PROJECTS.map((project, index) => {
            const isEven = index % 2 === 0;
            return (
              <ScrollReveal
                key={project.id}
                yOffset={32}
                id={`project-card-${project.id}`}
                className="group border border-[#E5DFD4] bg-[#FAF8F4] rounded-xl p-4 sm:p-10 lg:p-12 transition-all hover:border-[#CBB8A0] shadow-none relative overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12 items-center">
                  {/* Visual Column */}
                  <div
                    className={`lg:col-span-7 min-w-0 ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <div
                      onClick={() => onOpenProject(project.id)}
                      className="relative overflow-hidden rounded-xl bg-transparent cursor-pointer"
                    >
                      <DynamicPictureSlot
                        slotId={getProjectSlotId(project.id, 1)}
                        title={project.title}
                        caption={project.subtitle}
                        src={project.heroImage}
                        orientation="landscape"
                        isHero={true}
                        className="border-0 rounded-none w-full"
                      />
                    </div>
                  </div>

                  {/* Content Column — Essential & Important Details */}
                  <div
                    className={`lg:col-span-5 min-w-0 ${
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    } flex flex-col justify-center min-w-0 py-2 sm:py-4`}
                  >
                    <div className="flex-1 min-w-0">
                      {/* Title & Subtitle */}
                      <Link href={`/projects/${project.id}`} className="block group/title">
                        <h3 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#141311] group-hover/title:text-[#B8936D] transition-colors font-normal leading-[1.1] mb-2">
                          {project.title}
                        </h3>
                      </Link>

                      <p className="text-xs sm:text-[16px] text-[#8C7A65] font-serif mb-3 sm:mb-4 leading-relaxed">
                        {customMap[project.id]?.tagline || project.subtitle}
                      </p>

                      <p className="text-[10px] sm:text-xs text-[#5C5346] font-sans mb-4 sm:mb-5 leading-relaxed">
                        {project.location}
                      </p>

                      {/* Essential Metrics Grid */}
                      <div className="grid grid-cols-2 gap-3 p-3.5 sm:p-4 bg-[#F4F2EB] border border-[#E5DFD4] rounded-xl mb-6">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#8C7E6D] font-sans block">
                            CONFIGURATION
                          </span>
                          <span className="text-xs sm:text-sm font-serif text-[#181715] font-normal">
                            {customMap[project.id]?.unitsCount || project.metrics[0]?.value || 'Custom'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#8C7E6D] font-sans block">
                            TOTAL BUILT AREA
                          </span>
                          <span className="text-xs sm:text-sm font-serif text-[#181715] font-normal">
                            {customMap[project.id]?.areaRange || project.areaRange || `${project.areaSqFt.toLocaleString()} sq ft`}
                          </span>
                        </div>
                        <div className="border-t border-[#EFECE5] pt-2 col-span-2 flex items-center justify-between text-xs text-[#5C5346]">
                          <span className="flex items-center gap-1 text-[#B8936D]">
                            <CheckCircle2 className="w-3 h-3" /> 100% Vasthu Compliant
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-xs sm:text-[14px] leading-relaxed text-[#4D453B] font-light mb-6">
                        {project.articleParagraphs ? (
                          project.articleParagraphs.map((paragraph, pIdx) => (
                            <p key={pIdx}>{paragraph}</p>
                          ))
                        ) : (
                          <p>{project.overview}</p>
                        )}
                      </div>
                    </div>

                    {/* Action Bar — Outer corner alignment: right corner when picture is on left, left corner when picture is on right */}
                    <div
                      className={`flex items-center justify-stretch ${
                        isEven ? 'sm:justify-end' : 'sm:justify-start'
                      } gap-3 pt-4 border-t border-[#E5DFD4]/60 mt-auto flex-nowrap shrink-0`}
                    >
                      <button
                        onClick={() => onOpenProject(project.id)}
                        className="w-full sm:w-auto inline-flex items-center justify-center flex-nowrap gap-2 px-6 py-2.5 bg-[#181715] text-white text-[11px] font-sans tracking-[0.14em] uppercase font-medium rounded-full transition-all duration-200 cursor-pointer shadow-none border border-[#2D2A26] hover:border-[#CBB8A0] whitespace-nowrap shrink-0"
                        id={`landing-quick-detail-btn-${project.id}`}
                      >
                        <span className="whitespace-nowrap inline-block">VIEW DETAILS</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-white/90 shrink-0" />
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
