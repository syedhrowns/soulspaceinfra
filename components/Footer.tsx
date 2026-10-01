'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MessageSquare, MapPin, Instagram, Facebook } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BrandLogo } from '@/components/BrandLogo';

interface FooterProps {
  onOpenProject: (projectId: string) => void;
  onOpenCommission?: () => void;
}

export function Footer({ onOpenProject }: FooterProps) {

  return (
    <footer className="bg-[#ECE7DF] text-[#181714] border-t border-[#D5CDBF]">
      {/* Main Footer Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <ScrollReveal yOffset={32} className="flex flex-col md:flex-row md:items-start justify-between gap-10 lg:gap-16">
          {/* Brand & Details (Left) */}
          <div className="max-w-xl space-y-4">
            <div>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    if ((window as any).__lenis) {
                      (window as any).__lenis.scrollTo(0, { duration: 1.2 });
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }
                }}
                className="text-left cursor-pointer focus:outline-hidden"
                aria-label="Scroll to top of current page"
                id="footer-brand-logo-link"
              >
                <BrandLogo variant="footer" />
              </button>
              <p className="text-[10px] font-sans tracking-[0.2em] text-[#786E5F] uppercase mt-1 font-semibold">
                CIVIL CONSTRUCTION &bull; COIMBATORE, TAMIL NADU
              </p>
            </div>

            <p className="text-xs text-[#5C5346] leading-relaxed font-light max-w-lg">
              Integrated residential and commercial development firm based in Coimbatore. Specializing in luxury villas, premium apartments, column-free commercial IT suites, and turnkey civil execution.
            </p>

            <div className="text-[11px] font-sans text-[#5C5346] space-y-2.5 pt-2">
              {/* Location */}
              <div className="flex items-start gap-2">
                <a
                  href="https://maps.google.com/?q=Soul+Space+Infrastructure,+No+5/2,+Hindustan+Avenue,+Nava+India+Road,+Sowripalayam+Post,+Coimbatore+-+641028"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2 text-[#2C2722] hover:text-[#B8936D] transition-colors group text-left"
                  aria-label="View Soul Space Registered Office on Google Maps"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#B8936D] shrink-0 mt-[2px]" />
                  <span className="leading-normal hover:underline underline-offset-2">
                    No 5/2, Hindustan Avenue, Nava India Road, Sowripalayam Post, Coimbatore - 641028
                  </span>
                </a>
              </div>

              {/* Phone Numbers with Call links */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Phone className="w-3.5 h-3.5 text-[#B8936D] shrink-0" />
                  <a
                    href="tel:+919677771331"
                    className="hover:text-[#B8936D] font-medium text-[#181714] transition-colors"
                    aria-label="Call +91 96777 71331"
                  >
                    +91 96777 71331
                  </a>
                  <span className="text-[#A89F91]">/</span>
                  <a
                    href="tel:+919159133331"
                    className="hover:text-[#B8936D] font-medium text-[#181714] transition-colors"
                    aria-label="Call +91 91591 33331"
                  >
                    +91 91591 33331
                  </a>
                </div>

                {/* WhatsApp links directly below */}
                <div className="flex items-center gap-3 pl-5 text-[10.5px] flex-wrap text-[#786E5F]">
                  <a
                    href="https://wa.me/919677771331?text=Hello%20Soul%20Space%20Infrastructure%2C%20I%20would%20like%20to%20inquire%20about%20your%20projects."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[#B8936D] transition-colors"
                    aria-label="WhatsApp +91 96777 71331"
                  >
                    <MessageSquare className="w-3 h-3 text-[#B8936D]" />
                    <span>WhatsApp: +91 96777 71331</span>
                  </a>
                  <span>&bull;</span>
                  <a
                    href="https://wa.me/919159133331?text=Hello%20Soul%20Space%20Infrastructure%2C%20I%20would%20like%20to%20inquire%20about%20your%20projects."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[#B8936D] transition-colors"
                    aria-label="WhatsApp +91 91591 33331"
                  >
                    <MessageSquare className="w-3 h-3 text-[#B8936D]" />
                    <span>WhatsApp: +91 91591 33331</span>
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B8936D] shrink-0" />
                <a
                  href="mailto:soulspaceinfrastructure@gmail.com"
                  className="hover:text-[#B8936D] transition-colors"
                >
                  soulspaceinfrastructure@gmail.com
                </a>
              </div>

              {/* Official Social Media Channels */}
              <div className="flex items-center gap-3.5 pt-2 text-xs font-sans flex-wrap">
                <a
                  href="https://www.instagram.com/soul.space.projects/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#2C2722] hover:text-[#B8936D] transition-colors"
                  aria-label="Soul Space Infrastructure on Instagram (@soul.space.projects)"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#B8936D]" />
                  <span>@soul.space.projects</span>
                </a>
                <span className="text-[#A89F91]">&bull;</span>
                <a
                  href="https://www.facebook.com/soulspaceinfra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#2C2722] hover:text-[#B8936D] transition-colors"
                  aria-label="Soul Space Infrastructure on Facebook (@soulspaceinfra)"
                >
                  <Facebook className="w-3.5 h-3.5 text-[#B8936D]" />
                  <span>@soulspaceinfra</span>
                </a>
              </div>
            </div>
          </div>

          {/* Nav Links: Developments (Right) */}
          <div className="space-y-3 text-xs shrink-0">
            <span className="text-[11px] font-sans tracking-[0.2em] text-[#B8936D] uppercase block mb-4 font-semibold">
              FEATURED DEVELOPMENTS
            </span>
            <ul className="space-y-2.5 text-[#5C5346]">
                <li>
                  <Link
                    href="/projects/mystic-villas"
                    className="hover:text-[#B8936D] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Mystic — Luxury Villas (Semmedu)</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects/aurum-villas"
                    className="hover:text-[#B8936D] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Aurum — Luxury Villas (Vilankurichi)</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects/abv-arbor"
                    className="hover:text-[#B8936D] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>ABV Arbor — Luxury Flats (Ramanathapuram)</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects/dotcom-workspaces"
                    className="hover:text-[#B8936D] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>DOT COM — Tech Workspaces (PN Palayam)</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects/uptown-residences"
                    className="hover:text-[#B8936D] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Uptown — Modern Apartments (Eachanari)</span>
                  </Link>
                </li>
              </ul>
          </div>
        </ScrollReveal>

        {/* Bottom Colophon & Copyright Bar */}
        <div className="pt-10 sm:pt-12 mt-10 sm:mt-12 border-t border-[#D5CDBF] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[10.5px] sm:text-xs font-sans text-[#786E5F] text-center sm:text-left">
          <div>
            &copy; 2016&mdash;2026 SOUL SPACE INFRASTRUCTURE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center flex-wrap justify-center sm:justify-end gap-x-4 sm:gap-x-6 gap-y-1.5 text-[10.5px] sm:text-[11px]">
            <a
              href="https://www.instagram.com/soul.space.projects/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#B8936D] transition-colors"
              aria-label="Instagram: @soul.space.projects"
            >
              <Instagram className="w-3.5 h-3.5 text-[#B8936D]" />
              <span>Instagram</span>
            </a>
            <span>&bull;</span>
            <a
              href="https://www.facebook.com/soulspaceinfra"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#B8936D] transition-colors"
              aria-label="Facebook: @soulspaceinfra"
            >
              <Facebook className="w-3.5 h-3.5 text-[#B8936D]" />
              <span>Facebook</span>
            </a>
            <span>&bull;</span>
            <span>COIMBATORE, TAMIL NADU</span>
            <span>&bull;</span>
            <span>ESTABLISHED 2016</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
