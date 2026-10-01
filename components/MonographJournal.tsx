'use client';

import React, { useState } from 'react';
import { Clock, ArrowUpRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { JOURNAL_ESSAYS, JournalEssay } from '@/data/journal';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { useScrollLock } from '@/lib/scrollLock';

export function MonographJournal() {
  const [selectedEssay, setSelectedEssay] = useState<JournalEssay | null>(null);

  // Universal background scroll lock with Lenis pause
  useScrollLock(!!selectedEssay);

  return (
    <section id="journal" className="py-16 sm:py-28 bg-[#F5F3ED] border-b border-[#E3DCCF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="flex flex-col items-center text-center gap-6 border-b border-[#D8D0C0] pb-10 mb-16">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 text-[#99744C] text-xs tracking-[0.22em] uppercase font-semibold mb-2">
              <span className="w-2 h-0.5 bg-[#B8936D]" />
              <span>THE TECHNICAL JOURNAL</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#141311] tracking-[-0.03em] font-normal">
              Insights on Engineering &amp; <br className="hidden sm:inline" />
              <span className="italic text-[#B8936D]">Civil Craft.</span>
            </h2>
          </div>

          <p className="text-sm text-[#575046] max-w-2xl leading-relaxed font-light">
            In-depth perspectives on civil construction, Vasthu Shastra spatial harmony, Post-Tensioned (PT) engineering, and enduring development authored by Soul Space leadership.
          </p>
        </ScrollReveal>

        {/* Essays Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {JOURNAL_ESSAYS.map((essay) => (
            <StaggerItem
              key={essay.id}
              onClick={() => setSelectedEssay(essay)}
              className="border border-[#E5DFD4] bg-[#FAF8F4] rounded-xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#CBB8A0] transition-all cursor-pointer group shadow-none"
              id={`essay-card-${essay.id}`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-sans text-[#8C7A65] tracking-widest uppercase mb-3">
                  <span>{essay.issue}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#B8936D]" />
                    {essay.readTime}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-[#141311] group-hover:text-[#B8936D] transition-colors leading-snug">
                  {essay.title}
                </h3>

                <p className="font-serif text-xs text-[#B8936D] mt-1 mb-4">
                  {essay.subtitle}
                </p>

                <p className="text-xs text-[#524B40] leading-relaxed font-light mb-6">
                  {essay.abstract}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {essay.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-sans px-3 py-1 bg-[#F4F2EB] text-[#4F473C] border border-[#E0D9CC] rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#E5DFD4]/60 flex items-center justify-between text-xs text-[#7A7061]">
                  <span className="font-sans text-[11px]">{essay.author}</span>
                  <span className="font-sans text-[11px] text-[#181715] group-hover:text-[#B8936D] flex items-center gap-1 uppercase font-semibold">
                    Read Article <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Full Essay Reading Modal */}
        <AnimatePresence>
          {selectedEssay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              data-lenis-prevent
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-8 overflow-y-auto overscroll-contain"
              onClick={() => setSelectedEssay(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                data-lenis-prevent
                className="bg-[#FAF8F5]/95 backdrop-blur-2xl text-[#1D1B18] w-full max-w-3xl rounded-xl p-4 sm:p-12 border border-[#E5DFD4] my-auto max-h-[90vh] overflow-y-auto overscroll-contain shadow-none"
                onClick={(e) => e.stopPropagation()}
              >
              <div className="flex items-center justify-between border-b border-[#DDD5C7] pb-4 mb-6">
                <span className="font-sans text-xs text-[#B8936D] tracking-widest uppercase">
                  {selectedEssay.issue} · {selectedEssay.date}
                </span>
                <button
                  onClick={() => setSelectedEssay(null)}
                  className="p-1 text-[#8C8070] cursor-pointer rounded-full bg-transparent border border-transparent hover:border-[#CBB8A0] transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                  aria-label="Close article modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <h2 className="font-serif text-xl sm:text-4xl text-[#141311] leading-tight mb-2">
                {selectedEssay.title}
              </h2>
              <p className="font-serif text-xs sm:text-base text-[#B8936D] mb-6">
                {selectedEssay.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-sans text-[#786E5F] border-y border-[#E5DFD4] py-2.5 sm:py-3 mb-6 sm:mb-8 bg-[#F0ECE3] px-3 sm:px-4 rounded-xl">
                <span className="font-semibold text-[#181715]">{selectedEssay.author}</span>
                <span>·</span>
                <span>{selectedEssay.role}</span>
                <span>·</span>
                <span>{selectedEssay.readTime}</span>
              </div>

              <div className="space-y-4 sm:space-y-6 text-xs sm:text-base text-[#3E372E] leading-relaxed font-light">
                {selectedEssay.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-[#DDD5C7] flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 text-[10px] sm:text-xs text-[#7A6F60] text-center sm:text-left">
                <span>Archived in Soul Space Technical Library</span>
                <button
                  onClick={() => setSelectedEssay(null)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2.5 bg-[#181715] text-white text-[10px] sm:text-xs uppercase tracking-widest rounded-full transition-colors cursor-pointer border border-[#2D2A26] hover:border-[#CBB8A0] shadow-none min-h-[44px] sm:min-h-0 flex items-center justify-center"
                >
                  Close Article
                </button>
              </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
