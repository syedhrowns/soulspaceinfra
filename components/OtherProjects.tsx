'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Building2 } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { FULL_PROJECTS_DATA } from '@/data/projectDataFull';
import { DynamicPictureSlot } from '@/components/DynamicPictureSlot';

interface OtherProjectsProps {
  currentProjectId: string;
}

export function OtherProjects({ currentProjectId }: OtherProjectsProps) {
  // Filter out the current project to get the other 3 projects
  const otherProjects = Object.values(FULL_PROJECTS_DATA).filter(
    (p) => p.id !== currentProjectId
  );

  return (
    <section className="py-16 sm:py-28 bg-[#ECE7DF] text-[#1C1A17] border-b border-[#D8D0C2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="flex flex-col items-center text-center gap-6 border-b border-[#D8D0C0] pb-10 sm:pb-12 mb-12 sm:mb-16">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 text-[#B8936D] text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-bold mb-3 sm:mb-4 font-sans">
              <span className="w-3 h-px bg-[#B8936D]" />
              <span>PORTFOLIO EXPLORATION</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#181714] tracking-[-0.03em] font-normal leading-tight">
              Other Flagship <br className="hidden sm:inline" />
              <span className="italic text-[#B8936D]">Developments.</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#575046] max-w-2xl leading-relaxed font-light text-center mx-auto">
            Discover our other landmark residential enclaves, luxury villas, and commercial IT workspaces crafted across Coimbatore.
          </p>
        </ScrollReveal>

        {/* 3 Projects Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {otherProjects.map((project) => (
            <StaggerItem
              key={project.id}
              className="group flex flex-col justify-between bg-[#FAF8F4] border border-[#DCD5C8] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#CBB8A0] hover:shadow-none"
            >
              <div>
                {/* Photo Container */}
                <div className="relative overflow-hidden bg-[#181715]">
                  <DynamicPictureSlot
                    slotId={project.heroSlotId}
                    title={project.title}
                    orientation="landscape"
                    className="border-0 rounded-none w-full"
                  />
                </div>

                {/* Content Details: Clean, Center-Aligned Title & Typology (No addresses) */}
                <div className="p-6 sm:p-7 text-center flex flex-col items-center justify-center space-y-1.5">
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#181714] font-normal leading-tight group-hover:text-[#B8936D] transition-colors text-center">
                    {project.title}
                  </h3>

                  <p className="text-[11px] font-sans text-[#8C7A65] tracking-widest uppercase font-semibold text-center">
                    {project.typologyLabel}
                  </p>
                </div>
              </div>

              {/* Action Button: sqft and view project as usual */}
              <div className="px-6 pb-6 pt-3 border-t border-[#DCD5C8]/70 flex items-center justify-between mt-auto">
                <div className="text-[11px] font-sans text-[#6B6152]">
                  <span className="font-medium text-[#181715]">{project.areaSqFt.toLocaleString()} sq ft</span>
                </div>

                <Link
                  href={`/projects/${project.id}`}
                  prefetch={true}
                  className="inline-flex items-center flex-nowrap gap-1.5 px-4 py-2 bg-[#181715] text-white rounded-full text-[10.5px] font-sans tracking-[0.2em] uppercase font-semibold transition-all duration-300 shadow-none border border-[#2D2A26] hover:border-[#CBB8A0] whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap inline-block">View Project</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
