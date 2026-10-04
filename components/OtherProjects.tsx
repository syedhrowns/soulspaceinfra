'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { FULL_PROJECTS_DATA } from '@/data/projectDataFull';
import { DynamicPictureSlot } from '@/components/DynamicPictureSlot';

interface OtherProjectsProps {
  currentProjectId: string;
}

export function OtherProjects({ currentProjectId }: OtherProjectsProps) {
  // Filter out the current project to get the other 4 flagship developments
  const otherProjects = Object.values(FULL_PROJECTS_DATA).filter(
    (p) => p.id !== currentProjectId
  );

  return (
    <section className="py-20 sm:py-28 bg-[#F4F0E8] text-[#1C1A17] border-b border-[#D8D0C2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <ScrollReveal className="flex flex-col items-center text-center gap-4 border-b border-[#DCD5C6] pb-10 sm:pb-12 mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 text-[#B8936D] text-[9.5px] sm:text-[10px] tracking-[0.3em] uppercase font-bold font-sans">
            <span className="w-4 h-px bg-[#B8936D]" />
            <span>PORTFOLIO EXPLORATION</span>
            <span className="w-4 h-px bg-[#B8936D]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#181714] tracking-[-0.03em] font-normal leading-tight">
            Other Flagship <br className="hidden sm:inline" />
            <span className="italic text-[#B8936D]">Developments.</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#5C5346] max-w-2xl leading-relaxed font-light text-center mx-auto">
            Discover our other landmark residential enclaves, bespoke farmhouse villas, and commercial workspaces crafted across Coimbatore.
          </p>
        </ScrollReveal>

        {/* 4 Flagship Projects Responsive Editorial Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {otherProjects.map((project, idx) => (
            <StaggerItem key={project.id} className="h-full">
              <Link
                href={`/projects/${project.id}`}
                prefetch={true}
                className="group flex flex-col justify-between h-full bg-[#FAF8F5] border border-[#DDD5C7] hover:border-[#B8936D] rounded-2xl overflow-hidden p-3.5 sm:p-4 transition-all duration-300 hover:shadow-xl hover:shadow-[#181714]/6 hover:-translate-y-1 cursor-pointer block"
              >
                <div>
                  {/* Photo Container Frame with Inset Rounded Corners & Status Badge */}
                  <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-[#EAE3D5]">
                    <DynamicPictureSlot
                      slotId={project.heroSlotId}
                      title={project.title}
                      orientation="landscape"
                      fitMode="cover"
                      className="border-0 rounded-xl w-full h-full"
                    />

                    {/* Subtle Monograph Index Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full bg-[#181715]/75 backdrop-blur-md text-[#FAF8F5] text-[9px] font-sans tracking-widest uppercase border border-white/15">
                      <span>0{idx + 1} // {project.typologyLabel.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* Typography & Core Details */}
                  <div className="pt-4 pb-2 px-1 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-sans text-[#8C7A65] tracking-widest uppercase font-semibold">
                      <span>{project.typologyLabel}</span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-[26px] text-[#181714] font-normal leading-tight group-hover:text-[#B8936D] transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Subtle Editorial Footer Strip */}
                <div className="pt-3.5 mt-2 border-t border-[#EAE3D5] flex items-center justify-between px-1">
                  <div className="text-[11px] font-sans text-[#6B6152] font-medium tracking-wide">
                    <span>{project.areaSqFt.toLocaleString()} sq ft</span>
                  </div>

                  {/* Understated Luxury Arrow Pill */}
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-sans uppercase tracking-[0.16em] font-medium text-[#181715] group-hover:text-[#B8936D] transition-colors">
                    <span className="hidden min-[400px]:inline">Explore</span>
                    <div className="w-6 h-6 rounded-full bg-[#EDE6D9] group-hover:bg-[#181715] group-hover:text-white transition-all flex items-center justify-center">
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
