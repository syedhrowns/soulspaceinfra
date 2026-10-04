'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DynamicPictureSlot } from '@/components/DynamicPictureSlot';
import { X, Compass, ArrowUpRight, CheckCircle2, Layers, ShieldCheck, ExternalLink, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SmoothAutoHeight } from '@/components/SmoothAutoHeight';
import { Project } from '@/data/projects';
import { useScrollLock } from '@/lib/scrollLock';
import { getProjectSlotId } from '@/lib/slots';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onInquireTypology: (typology: string) => void;
}

export function ProjectModal({ project, onClose, onInquireTypology }: ProjectModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'blueprint' | 'materials'>('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Universal background scroll lock with Lenis pause & scrollbar compensation
  useScrollLock(!!project);

  // Prefetch project route for instant transition
  useEffect(() => {
    if (project?.id) {
      router.prefetch(`/projects/${project.id}`);
    }
  }, [project?.id, router]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project || !mounted || typeof document === 'undefined') return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      id="project-modal-backdrop"
      data-lenis-prevent
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-6 overflow-y-auto overscroll-contain"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
        className="bg-[#FAF8F5]/95 backdrop-blur-2xl text-[#1D1B18] w-full max-w-5xl rounded-3xl overflow-hidden border border-[#E5DFD4] my-auto flex flex-col max-h-[92vh] shadow-none overscroll-contain relative"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
        id="project-detail-card"
      >
        {/* Floating Close Button in Top Right (no blank black header bar) */}
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-6 z-20 p-2 text-[#786E5F] hover:text-[#181715] bg-[#EFECE5] border border-[#DDD5C7] hover:border-[#CBB8A0] transition-colors cursor-pointer rounded-full shadow-none min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
          aria-label="Close project modal"
          id="close-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div data-lenis-prevent className="overflow-y-auto p-4 sm:p-10 space-y-6 sm:space-y-8 overscroll-contain pt-14 sm:pt-12">
          {/* Main Title Banner */}
          <div className="border-b border-[#E5DFD4] pb-4 sm:pb-6 text-center flex flex-col items-center">
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-sans text-[#8C7A65] uppercase tracking-widest mb-1.5 sm:mb-2">
              <span>{project.typologyLabel}</span>
              <span className="text-[#B8936D] hidden sm:inline">·</span>
              <span className="text-[#786E5F] font-medium text-center hidden sm:inline">{project.location}</span>
            </div>
            <h2 className="font-serif text-xl sm:text-5xl text-[#141311] font-normal text-center">
              {project.title}
            </h2>
            <p className="font-serif text-xs sm:text-base text-[#B8936D] mt-1 text-center">
              {project.subtitle}
            </p>
          </div>

          {/* Interactive Media Showcase */}
          <div>
            <div className="relative w-full bg-transparent rounded-2xl sm:rounded-3xl overflow-hidden">
              <DynamicPictureSlot
                slotId={getProjectSlotId(project.id, 1)}
                title={`${project.title} Architectural Showcase`}
                src={project.heroImage}
                orientation="landscape"
                aspectHint="16:9"
                isHero={true}
                className="border-0 rounded-none w-full"
              />
            </div>
          </div>

          {/* Tabs for In-Depth Data */}
          <div>
            <div className="flex border-b border-[#E5DFD4] space-x-3 sm:space-x-6 text-[9.5px] sm:text-xs tracking-[0.12em] sm:tracking-[0.16em] uppercase font-sans mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 sm:py-0 pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap min-h-[40px] sm:min-h-0 flex items-center ${
                  activeTab === 'overview'
                    ? 'border-[#B8936D] text-[#B8936D] font-semibold'
                    : 'border-transparent text-[#786E60] hover:border-[#CBB8A0]'
                }`}
              >
                Development Overview
              </button>
              <button
                onClick={() => setActiveTab('blueprint')}
                className={`py-2 sm:py-0 pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap min-h-[40px] sm:min-h-0 flex items-center ${
                  activeTab === 'blueprint'
                    ? 'border-[#B8936D] text-[#B8936D] font-semibold'
                    : 'border-transparent text-[#786E60] hover:border-[#CBB8A0]'
                }`}
              >
                Structural &amp; MEP Specs
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`py-2 sm:py-0 pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap min-h-[40px] sm:min-h-0 flex items-center ${
                  activeTab === 'materials'
                    ? 'border-[#B8936D] text-[#B8936D] font-semibold'
                    : 'border-transparent text-[#786E60] hover:border-[#CBB8A0]'
                }`}
              >
                Finishes &amp; Vasthu
              </button>
            </div>

            <SmoothAutoHeight duration={0.34}>
              <AnimatePresence mode="wait">
                {/* Tab 1: Overview & Narrative */}
                {activeTab === 'overview' && (
                  <motion.div
                    key="modal-tab-overview"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-[#3E3830] leading-relaxed"
                  >
                    <div>
                      <h4 className="font-serif text-base sm:text-lg text-[#141311] mb-2 font-medium">Project Intent &amp; Planning</h4>
                      <p className="font-light">{project.clientBrief}</p>

                      <h4 className="font-serif text-base sm:text-lg text-[#141311] mt-6 mb-2 font-medium">Executive Overview</h4>
                      <div className="space-y-3 font-light text-[#4A4237] leading-relaxed">
                        {project.articleParagraphs ? (
                          project.articleParagraphs.map((para, idx) => (
                            <p key={idx}>{para}</p>
                          ))
                        ) : (
                          <p>{project.overview}</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-[#F5F2EB] p-6 rounded-2xl border border-[#E5DFD4] flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] font-sans text-[#8C7A65] tracking-widest uppercase block mb-3">
                          Development &amp; Execution
                        </span>
                        <p className="font-serif text-xl text-[#181715]">Soul Space Infrastructure</p>
                        <p className="text-xs text-[#6B6152] mt-1">{project.sustainabilityRating}</p>

                        <div className="mt-6 border-l-2 border-[#B8936D] pl-3 py-1">
                          <p className="italic font-serif text-sm text-[#423C34]">&ldquo;{project.quote.text}&rdquo;</p>
                          <span className="block text-[10px] font-sans text-[#8C8070] mt-1 uppercase">— {project.quote.author}</span>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-[#E5DFD4] mt-6 flex items-center justify-between text-xs text-[#7A7061] font-sans">
                        <span>Vasthu &amp; Planning Alignment</span>
                        <span className="text-[#B8936D] font-medium">100% Vasthu Compliant</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab 2: Blueprint & Structural Specs */}
                {activeTab === 'blueprint' && (
                  <motion.div
                    key="modal-tab-blueprint"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <div className="bg-[#181715] text-[#F7F5F0] p-6 rounded-2xl border border-[#2B2723] font-sans text-xs">
                      <div className="flex items-center justify-between border-b border-[#2B2723] pb-3 mb-4 text-[#B8936D] tracking-widest uppercase">
                        <span className="flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          STRUCTURAL SCHEMATIC &amp; METRICS
                        </span>
                        <span className="bg-[#25221E] px-2 py-0.5 rounded-full border border-[#353028]">VERIFIED SPECS</span>
                      </div>
                      <p className="text-[#DDD5C7] leading-relaxed mb-4">
                        {project.structuralConcept}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#2B2723]">
                        {project.metrics.map((m, i) => (
                          <div key={i}>
                            <span className="text-[10px] text-[#8C8273] uppercase block">{m.label}</span>
                            <span className="text-sm font-serif text-white font-medium">{m.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab 3: Materials & Specs */}
                {activeTab === 'materials' && (
                  <motion.div
                    key="modal-tab-materials"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {project.materials.map((mat, i) => (
                      <div key={i} className="p-4 bg-[#F5F2EB] border border-[#E5DFD4] rounded-2xl">
                        <span className="text-[10px] font-sans text-[#B8936D] uppercase tracking-widest block">
                          SPECIFICATION 0{i + 1}
                        </span>
                        <p className="font-serif text-lg text-[#181715] mt-1">{mat}</p>
                        <p className="text-xs text-[#695F51] mt-1">
                          Tested for structural durability and compliant with quality and building code standards.
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </SmoothAutoHeight>
          </div>

          {/* Bottom Action Ribbon — Swapped button positions */}
          <div className="pt-6 border-t border-[#E5DFD4] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-sans text-[#786E5F] text-center sm:text-left">
              INTERESTED IN BOOKING OR ARCHITECTURAL CONSULTATION?
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  onClose();
                  onInquireTypology(project.typology);
                }}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3.5 bg-[#181715] text-white text-[10px] sm:text-xs tracking-[0.12em] sm:tracking-[0.16em] uppercase font-medium rounded-full transition-colors flex items-center justify-center flex-nowrap gap-1.5 sm:gap-2 cursor-pointer border border-[#2D2A26] hover:border-[#CBB8A0] shadow-none whitespace-nowrap shrink-0 min-h-[44px] sm:min-h-0"
                id="modal-inquire-btn"
              >
                <span className="whitespace-nowrap inline-block">Initiate Project Inquiry</span>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </button>
              <Link
                href={`/projects/${project.id}`}
                onClick={() => onClose()}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3.5 bg-[#181715] text-white text-[10px] sm:text-xs tracking-[0.12em] sm:tracking-[0.16em] uppercase font-semibold rounded-full transition-all flex items-center justify-center flex-nowrap gap-1.5 sm:gap-2 cursor-pointer shadow-none group border border-[#2D2A26] hover:border-[#CBB8A0] whitespace-nowrap shrink-0 min-h-[44px] sm:min-h-0"
                id="modal-full-details-btn"
              >
                <span className="whitespace-nowrap inline-block">Full Project Details</span>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
