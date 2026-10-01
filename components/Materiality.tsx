'use client';

import React, { useState } from 'react';
import { DynamicPictureSlot } from '@/components/DynamicPictureSlot';
import { ArrowUpRight } from 'lucide-react';
import { MATERIALS, Material } from '@/data/materials';
import { ScrollReveal } from '@/components/ScrollReveal';
import { motion, AnimatePresence } from 'motion/react';
import { SmoothAutoHeight } from '@/components/SmoothAutoHeight';

interface MaterialityProps {
  onOpenProjectByTitle: (title: string) => void;
}

export function Materiality({ onOpenProjectByTitle }: MaterialityProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(MATERIALS[0]);

  return (
    <section id="materiality" className="py-16 sm:py-28 bg-[#F5F3ED] border-b border-[#E3DCCF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="flex flex-col items-center text-center gap-6 border-b border-[#D8D0C0] pb-10 mb-12">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-[#99744C] text-[10px] tracking-[0.3em] uppercase font-bold mb-4">
              <span className="w-3 h-px bg-[#B8936D]" />
              <span>THE SPECIFICATION PALETTE</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-5xl md:text-6xl text-[#141311] tracking-[-0.03em] font-normal">
              Materials &amp; <br className="hidden sm:inline" />
              <span className="italic text-[#B8936D]">Structural Engineering.</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#575046] max-w-2xl leading-relaxed font-light">
            Authentic branded finishes and architectural materials selected for structural durability, sensory warmth, and enduring luxury across Soul Space developments.
          </p>
        </ScrollReveal>

        {/* Material Selector Nav Tabs */}
        <ScrollReveal delay={0.1} className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-8 sm:mb-12 w-full">
          {MATERIALS.map((mat) => {
            const isSelected = selectedMaterial.id === mat.id;
            return (
              <button
                key={mat.id}
                onClick={() => setSelectedMaterial(mat)}
                className={`p-3.5 sm:p-6 rounded-xl border transition-all duration-200 cursor-pointer min-w-0 flex flex-col items-center justify-between text-center ${
                  isSelected
                    ? 'bg-[#181715] text-white border-[#2D2A26] hover:border-[#CBB8A0] shadow-none'
                    : 'bg-[#FAF8F4] text-[#2D2821] border-[#DCD5C8] hover:border-[#CBB8A0] shadow-none'
                }`}
                id={`material-tab-${mat.id}`}
              >
                <div className="w-full flex flex-col items-center">
                  <span
                    className={`text-[9px] sm:text-[10px] font-sans tracking-wider uppercase block mb-1 font-semibold w-full text-center ${
                      isSelected ? 'text-[#C5A880]' : 'text-[#B8936D]'
                    }`}
                  >
                    {mat.category}
                  </span>
                  <h3 className={`font-serif text-sm sm:text-lg lg:text-xl leading-tight font-normal w-full text-center break-normal ${
                    isSelected ? 'text-white' : 'text-[#181714]'
                  }`}>
                    {mat.name.split('&')[0]}
                  </h3>
                </div>
                <div className={`mt-3 sm:mt-4 w-full flex items-center justify-center border-t pt-2 sm:pt-3 ${
                  isSelected ? 'border-[#332F2A]' : 'border-[#E5DFD4]'
                }`}>
                  <span
                    className={`text-[10px] sm:text-[11px] font-sans text-center w-full ${
                      isSelected ? 'text-white/80' : 'text-[#7A7061]'
                    }`}
                  >
                    DENSITY: {mat.density}
                  </span>
                </div>
              </button>
            );
          })}
        </ScrollReveal>

        {/* Selected Material Deep-Dive Panel with Pure Solid White */}
        <ScrollReveal yOffset={32} className="border border-[#E5DFD4] bg-[#FAF8F4] rounded-xl p-4 sm:p-8 lg:p-10 overflow-hidden shadow-none w-full">
          <SmoothAutoHeight duration={0.36}>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMaterial.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center w-full"
              >
                {/* Macro Texture Photography Column - Dynamic Adaptive Slot */}
                <div className="lg:col-span-5 relative w-full bg-[#181715] rounded-lg overflow-hidden">
                  <DynamicPictureSlot
                    slotId={`material_img_0${MATERIALS.findIndex((m) => m.id === selectedMaterial.id) + 1}`}
                    title={selectedMaterial.name}
                    caption={selectedMaterial.finish}
                    src={selectedMaterial.image}
                    orientation="portrait"
                    aspectHint="4:3"
                    className="border-0 rounded-none w-full"
                  />
                </div>

                {/* Technical Specifications Column */}
                <div className="lg:col-span-7 flex flex-col justify-between min-w-0 w-full">
                  <div className="space-y-6 sm:space-y-8">
                    <div className="border-b border-[#E5DFD4]/60 pb-5 sm:pb-6 text-center">
                      <div className="text-[11px] sm:text-xs font-sans text-[#8C7A65] tracking-wider uppercase mb-1 text-center flex items-center justify-center">
                        <span className="text-center w-full break-normal">SURFACE FINISH: {selectedMaterial.finish}</span>
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#181715] font-normal leading-tight text-center mt-1 break-normal">
                        {selectedMaterial.name}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 text-sm text-[#4D453B] leading-relaxed">
                      <div className="space-y-6">
                        <div>
                          <h5 className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#B8936D] mb-2 font-bold">
                            Sensory & Tactile Quality
                          </h5>
                          <p className="font-light text-[#574F44]">{selectedMaterial.tactileDescription}</p>
                        </div>

                        <div>
                          <h5 className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#B8936D] mb-2 font-bold">
                            Extraction & Provenance
                          </h5>
                          <p className="font-light text-[#574F44]">{selectedMaterial.provenance}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-[#F4F2EB] p-5 rounded-lg border border-[#E5DFD4] text-center flex flex-col items-center justify-center">
                          <h5 className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#B8936D] mb-2 font-bold text-center w-full">
                            Decadal Aging & Patina
                          </h5>
                          <p className="font-light italic font-serif text-[#574F44] leading-relaxed text-center w-full">
                            &ldquo;{selectedMaterial.agingBehavior}&rdquo;
                          </p>
                        </div>

                        {/* Technical Parameters Sub-Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-4 bg-[#F4F2EB] border border-[#E0D9CC] rounded-lg min-w-0 text-center flex flex-col items-center justify-center">
                            <span className="text-[9px] font-sans text-[#8C7F70] uppercase block mb-1 text-center w-full">Density</span>
                            <span className="font-serif text-lg text-[#181715] font-medium truncate block text-center w-full">{selectedMaterial.density}</span>
                          </div>
                          <div className="p-4 bg-[#F4F2EB] border border-[#E0D9CC] rounded-lg min-w-0 text-center flex flex-col items-center justify-center">
                            <span className="text-[9px] font-sans text-[#8C7F70] uppercase block mb-1 text-center w-full">Structural</span>
                            <span className="font-serif text-xs text-[#181715] font-medium truncate block text-center w-full">
                              {selectedMaterial.structuralUtility.split(',')[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Projects Featured In */}
                  <div className="pt-8 border-t border-[#E5DFD4] mt-8">
                    <span className="text-[11px] font-sans text-[#8C7F70] uppercase tracking-[0.2em] block mb-4 font-semibold">
                      FEATURED IN DEVELOPMENTS:
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {selectedMaterial.featuredIn.map((projTitle, i) => (
                        <button
                          key={i}
                          onClick={() => onOpenProjectByTitle(projTitle)}
                          className="text-[9.5px] sm:text-[11px] px-3 sm:px-5 py-1.5 sm:py-2.5 bg-[#181715] text-[#F7F5F0] rounded-full transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer border border-[#2B2723] hover:border-[#CBB8A0] shadow-none"
                        >
                          <span className="whitespace-nowrap">{projTitle}</span>
                          <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B8936D]" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </SmoothAutoHeight>
        </ScrollReveal>
      </div>
    </section>
  );
}
