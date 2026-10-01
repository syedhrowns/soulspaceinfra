'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Download,
  CheckCircle2,
  ArrowUpRight,
  Loader2,
  ShieldCheck,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { FullProjectDetail } from '@/data/projectDataFull';

interface ProjectBrochureSectionProps {
  project: FullProjectDetail;
}

export function ProjectBrochureSection({ project }: ProjectBrochureSectionProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!project.brochurePdfUrl) return null;

  const rawUrl = project.brochurePdfUrl;
  // Cloudinary fl_attachment flag guarantees an immediate Content-Disposition: attachment header
  const attachmentUrl = rawUrl.includes('/upload/')
    ? rawUrl.replace('/upload/', '/upload/fl_attachment/')
    : rawUrl;

  const filename = `${project.title.replace(/\s+/g, '_')}_Soulspace_Brochure.pdf`;

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDownloading) return;

    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      // First attempt: fetch blob to trigger immediate local download dialog
      const res = await fetch(attachmentUrl);
      if (!res.ok) throw new Error('Fetch failed');
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4500);
    } catch {
      // Fallback: use direct Cloudinary attachment URL in hidden link
      const fallbackLink = document.createElement('a');
      fallbackLink.href = attachmentUrl;
      fallbackLink.setAttribute('download', filename);
      fallbackLink.target = '_blank';
      fallbackLink.rel = 'noopener noreferrer';
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4500);
    } finally {
      setIsDownloading(false);
    }
  };

  const detailFeatures = [
    'Master site layout & architectural floor blueprints',
    'Room-by-room carpet dimensions & area schedule',
    'Civil engineering, foundation & structural specifications',
    '100% Vasthu & Manaiyadi compliance verification',
    'Locality map, proximity matrix & transit ingress guide',
  ];

  return (
    <section
      id="brochure"
      className="py-16 sm:py-28 bg-[#F5F2EB] text-[#1C1A17] border-b border-[#D8D0C2] overflow-hidden scroll-mt-16 relative"
    >
      {/* Subtle Background Architectural Grid */}
      <div className="absolute inset-0 bg-grid-architectural opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Canonical Header */}
        <ScrollReveal className="flex flex-col items-center text-center gap-6 border-b border-[#D8D0C0] pb-10 sm:pb-12 mb-12 sm:mb-16">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 text-[#99744C] text-[8.5px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.28em] uppercase font-bold mb-3 sm:mb-4 font-sans whitespace-nowrap max-w-full">
              <span className="w-2.5 sm:w-3 h-px bg-[#B8936D] shrink-0" />
              <span className="whitespace-nowrap">OFFICIAL PROJECT DETAILS</span>
              <span className="w-2.5 sm:w-3 h-px bg-[#B8936D] shrink-0" />
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#141311] tracking-[-0.03em] font-normal leading-tight">
              Download Project <span className="italic text-[#B8936D]">Brochure.</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#575046] max-w-2xl leading-relaxed font-light text-center mx-auto">
            Acquire the complete publication, master site blueprints, material schedules, and spatial floor plans in high-resolution archival format.
          </p>
        </ScrollReveal>

        {/* Master Editorial Details Folio Card */}
        <ScrollReveal yOffset={24} className="max-w-5xl mx-auto">
          <div className="bg-[#FAF8F4] border border-[#DCD5C8] rounded-2xl overflow-hidden shadow-none transition-all duration-300 hover:border-[#CBB8A0]">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Column: Pure Minimal Centered Folio Cover */}
              <div className="lg:col-span-5 bg-[#141311] text-[#FAF8F5] p-8 sm:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[280px] sm:min-h-[380px] border-b lg:border-b-0 lg:border-r border-[#2A2621]">
                <div className="flex flex-col items-center justify-center text-center space-y-2 sm:space-y-3">
                  <span className="font-sans text-[9.5px] sm:text-[11px] tracking-[0.24em] text-[#A69B8D] uppercase font-medium text-center">
                    {project.typologyLabel}
                  </span>
                  <h3 className="font-serif text-3xl sm:text-5xl text-[#FAF8F5] font-normal leading-tight tracking-[-0.02em] text-center">
                    {project.title}
                  </h3>
                  <p className="font-serif text-xs sm:text-sm text-[#C5A880] italic font-light tracking-wide text-center">
                    Official Specification Details
                  </p>
                </div>
              </div>

              {/* Right Column: Details & Download Actions (7 cols) */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#E5DFD4] pb-3 mb-6">
                    <span className="text-[9.5px] font-sans tracking-[0.22em] text-[#99744C] uppercase font-bold">
                      DOCUMENT HIGHLIGHTS
                    </span>
                    <span className="text-[9px] font-sans tracking-widest text-[#8C7A65] uppercase">
                      READY FOR DOWNLOAD
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#4A433A] leading-relaxed font-light mb-6">
                    Explore the comprehensive architectural documentation for <strong className="font-medium text-[#181714]">{project.title}</strong>. This publication provides detailed blueprints, material finishes, and spatial dimensions to assist with design evaluation and acquisition planning.
                  </p>

                  {/* Bullet Highlights — Minimalist Bronze Markers */}
                  <ul className="space-y-3 mb-8">
                    {detailFeatures.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs text-[#524B41] font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B8936D] shrink-0 mt-1.5" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Download Actions */}
                <div className="pt-6 border-t border-[#E5DFD4] space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Primary Direct Download Button with fluid layout transitions */}
                    <motion.button
                      layout
                      onClick={handleDownload}
                      disabled={isDownloading}
                      transition={{
                        layout: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                        backgroundColor: { duration: 0.25 },
                      }}
                      className={`flex-1 inline-flex items-center justify-center min-h-[46px] px-6 py-3.5 rounded-full text-[11px] font-sans tracking-[0.16em] uppercase font-semibold cursor-pointer shadow-none border ${
                        downloadSuccess
                          ? 'bg-[#2E5E44] text-white border-[#2E5E44]'
                          : 'bg-[#181715] text-white hover:bg-[#23201C] border-[#2D2A26] hover:border-[#CBB8A0]'
                      }`}
                      aria-label="Download project brochure PDF"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {isDownloading ? (
                          <motion.span
                            key="downloading"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="inline-flex items-center gap-2.5 whitespace-nowrap"
                          >
                            <Loader2 className="w-4 h-4 text-[#B8936D] animate-spin" />
                            <span>Preparing Download...</span>
                          </motion.span>
                        ) : downloadSuccess ? (
                          <motion.span
                            key="success"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="inline-flex items-center gap-2.5 whitespace-nowrap"
                          >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>Download Started</span>
                          </motion.span>
                        ) : (
                          <motion.span
                            key="idle"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="inline-flex items-center gap-2.5 whitespace-nowrap"
                          >
                            <Download className="w-3.5 h-3.5 text-[#B8936D]" />
                            <span>Download Brochure (PDF)</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    {/* Secondary Preview Link */}
                    <a
                      href={rawUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-full text-[11px] font-sans tracking-[0.16em] uppercase font-semibold bg-[#FAF8F4] text-[#181714] border border-[#D5CDBF] hover:border-[#CBB8A0] transition-colors duration-200"
                    >
                      <span>Preview</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#B8936D]" />
                    </a>
                  </div>

                  <div className="text-[9.5px] sm:text-[10.5px] font-sans text-[#8C7A65] flex items-center justify-center sm:justify-start gap-1.5 pt-1 text-center sm:text-left whitespace-nowrap">
                    <Sparkles className="w-3 h-3 text-[#B8936D] shrink-0" />
                    <span>Instant access &bull; No sign-up required &bull; High-resolution PDF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
