'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, X, Sparkles, Clock } from 'lucide-react';
import {
  getAnnouncementSettings,
  AnnouncementSettings,
  AnnouncementTheme,
} from '@/lib/projectContent';

// Theme styling maps
const THEME_STYLES: Record<
  AnnouncementTheme,
  {
    container: string;
    border: string;
    badge: string;
    text: string;
    secondaryText: string;
    link: string;
    closeBtn: string;
    countdownBox: string;
    fadeGradient: string;
  }
> = {
  'obsidian-gold': {
    container: 'bg-[#141311] text-[#FAF8F5]',
    border: 'border-b border-[#2C2720]',
    badge: 'bg-[#B8936D] text-[#141311] font-bold shadow-xs',
    text: 'text-[#EFEAE2]',
    secondaryText: 'text-[#AFA495]',
    link: 'bg-[#B8936D]/15 text-[#D4AF37] hover:bg-[#B8936D] hover:text-[#141311] border border-[#B8936D]/30',
    closeBtn: 'text-[#8C7A65] hover:text-[#FAF8F5] hover:bg-white/5',
    countdownBox: 'bg-[#1F1C18] border border-[#3A3226] text-[#D4AF37]',
    fadeGradient: 'from-[#141311]',
  },
  'champagne-alabaster': {
    container: 'bg-[#FAF7F2] text-[#1D1B18]',
    border: 'border-b border-[#DDD4C5]',
    badge: 'bg-[#99744C] text-white font-bold',
    text: 'text-[#24211D]',
    secondaryText: 'text-[#6C6356]',
    link: 'bg-[#1D1B18] text-[#FAF7F2] hover:bg-[#99744C] border border-[#1D1B18]',
    closeBtn: 'text-[#8C7E6C] hover:text-[#1D1B18] hover:bg-black/5',
    countdownBox: 'bg-[#EFE9DF] border border-[#D5CBB9] text-[#7A5B36]',
    fadeGradient: 'from-[#FAF7F2]',
  },
  'emerald-biophilic': {
    container: 'bg-[#0E231B] text-[#F3F7F5]',
    border: 'border-b border-[#1E3F32]',
    badge: 'bg-[#2E6B52] text-[#F3F7F5] font-semibold border border-[#448D6F]',
    text: 'text-[#E1ECE7]',
    secondaryText: 'text-[#88A99B]',
    link: 'bg-[#194434] text-[#8BE4BA] hover:bg-[#2E6B52] hover:text-white border border-[#2E6B52]',
    closeBtn: 'text-[#6D9585] hover:text-[#F3F7F5] hover:bg-white/5',
    countdownBox: 'bg-[#153428] border border-[#2B5745] text-[#8BE4BA]',
    fadeGradient: 'from-[#0E231B]',
  },
  'terracotta-heritage': {
    container: 'bg-[#291712] text-[#FDF9F7]',
    border: 'border-b border-[#472920]',
    badge: 'bg-[#C25838] text-white font-bold',
    text: 'text-[#F5E7E2]',
    secondaryText: 'text-[#BFA49C]',
    link: 'bg-[#C25838]/20 text-[#FFA082] hover:bg-[#C25838] hover:text-white border border-[#C25838]/40',
    closeBtn: 'text-[#A67E72] hover:text-white hover:bg-white/5',
    countdownBox: 'bg-[#3A2019] border border-[#593429] text-[#FFA082]',
    fadeGradient: 'from-[#291712]',
  },
  'aurum-bronze': {
    container: 'bg-gradient-to-r from-[#211A12] via-[#2F2418] to-[#211A12] text-[#FBF8F3]',
    border: 'border-b border-[#4A3A28]',
    badge: 'bg-gradient-to-r from-[#C5A065] to-[#E3C38C] text-[#1E1710] font-bold shadow-xs',
    text: 'text-[#F2E8D8]',
    secondaryText: 'text-[#B8A790]',
    link: 'bg-[#C5A065]/20 text-[#E3C38C] hover:bg-[#C5A065] hover:text-[#1E1710] border border-[#C5A065]/40',
    closeBtn: 'text-[#96826C] hover:text-white hover:bg-white/5',
    countdownBox: 'bg-[#1C150E] border border-[#4F3C28] text-[#E3C38C]',
    fadeGradient: 'from-[#211A12]',
  },
};

export function AnnouncementBar() {
  const [settings, setSettings] = useState<AnnouncementSettings | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const pathname = usePathname();

  // Load and subscribe to live settings changes
  useEffect(() => {
    // Check session storage for dismissal state
    const isSessionDismissed = sessionStorage.getItem('soulspace_announcement_dismissed_v1') === 'true';
    setDismissed(isSessionDismissed);

    // Initial check from localStorage / default
    setSettings(getAnnouncementSettings());

    // Authoritative check from server endpoint
    fetch('/api/announcement')
      .then((res) => (res.ok ? res.json() : null))
      .then((serverData) => {
        if (serverData && typeof serverData.enabled === 'boolean') {
          setSettings(serverData);
          try {
            localStorage.setItem('soulspace_announcement_v1', JSON.stringify(serverData));
          } catch {}
        }
      })
      .catch(() => {});

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<AnnouncementSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
        setDismissed(false);
        sessionStorage.removeItem('soulspace_announcement_dismissed_v1');
      } else {
        setSettings(getAnnouncementSettings());
      }
    };

    window.addEventListener('soulspace-announcement-updated', handleUpdate);
    return () => window.removeEventListener('soulspace-announcement-updated', handleUpdate);
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (!settings || settings.style !== 'countdown' || !settings.targetDate) {
      setTimeLeft(null);
      return;
    }

    const targetTime = new Date(settings.targetDate).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (isNaN(difference) || difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [settings?.style, settings?.targetDate]);

  // CRITICAL REQUIREMENT 1: NEVER display the announcement banner on admin routes (neither login nor dashboard)
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  if (!settings || !settings.enabled || dismissed) return null;

  // Check display scope targeting
  if (settings.displayScope === 'home' && pathname !== '/') {
    return null;
  }
  if (settings.displayScope === 'projects' && !pathname?.startsWith('/projects')) {
    return null;
  }

  const themeKey = settings.theme || 'obsidian-gold';
  const styles = THEME_STYLES[themeKey] || THEME_STYLES['obsidian-gold'];

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('soulspace_announcement_dismissed_v1', 'true');
  };

  const handleActionClick = (e: React.MouseEvent) => {
    if (settings.linkUrl === '#inquire' || settings.linkUrl === 'inquiry') {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('soulspace-open-inquiry'));
      const contactSection = document.getElementById('contact') || document.getElementById('inquire');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isExternal = settings.linkUrl?.startsWith('http') || settings.linkUrl?.startsWith('https');

  // Single item unit used across both desktop view and mobile infinite loop ticker
  const renderBannerItem = (isMobileTicker = false) => (
    <div className={`flex items-center gap-2.5 shrink-0 ${isMobileTicker ? 'pr-8' : ''}`}>
      {/* Badge */}
      {settings.badge && (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold shrink-0 ${
            styles.badge
          } ${settings.urgentPulse ? 'animate-pulse' : ''}`}
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>{settings.badge}</span>
        </span>
      )}

      {/* Main Announcement Text */}
      <span className={`text-[11.5px] sm:text-xs font-normal tracking-wide whitespace-nowrap ${styles.text}`}>
        {settings.text}
      </span>

      {/* Secondary Highlight */}
      {settings.secondaryText && (
        <span className={`text-[10.5px] sm:text-[11px] font-light whitespace-nowrap opacity-80 ${styles.secondaryText}`}>
          • {settings.secondaryText}
        </span>
      )}

      {/* Countdown Timer Block (if countdown style active) */}
      {settings.style === 'countdown' && timeLeft && (
        <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-md text-[10px] font-mono">
          {settings.countdownLabel && (
            <span className={`text-[9.5px] font-sans uppercase tracking-wider ${styles.secondaryText}`}>
              {settings.countdownLabel}
            </span>
          )}
          <div className={`px-1.5 py-0.5 rounded font-bold tracking-widest ${styles.countdownBox}`}>
            <span>{String(timeLeft.days).padStart(2, '0')}d</span> :{' '}
            <span>{String(timeLeft.hours).padStart(2, '0')}h</span> :{' '}
            <span>{String(timeLeft.minutes).padStart(2, '0')}m</span> :{' '}
            <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
          </div>
        </div>
      )}

      {/* Action CTA Button */}
      {settings.linkUrl && (
        <div className="shrink-0 ml-1">
          {isExternal ? (
            <a
              href={settings.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-medium tracking-wide transition-all ${styles.link}`}
            >
              <span>{settings.linkText || 'Explore Residence'}</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          ) : (
            <Link
              href={settings.linkUrl}
              onClick={handleActionClick}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-medium tracking-wide transition-all ${styles.link}`}
            >
              <span>{settings.linkText || 'Explore Residence'}</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}
    </div>
  );

  return (
    <aside
      aria-label="Website Announcement"
      className={`w-full ${styles.container} ${styles.border} relative z-50 text-xs font-sans transition-all duration-300 shadow-xs select-none`}
    >
      {/* =========================================================================
          DESKTOP VIEW (sm:flex and above): Centered elegant banner with dismiss button
          ========================================================================= */}
      <div className="hidden sm:flex max-w-7xl mx-auto px-4 py-2 sm:py-2.5 items-center justify-between gap-3">
        <div className="flex items-center gap-3 mx-auto overflow-hidden justify-center text-left">
          {renderBannerItem(false)}
        </div>

        {/* Dismiss Button */}
        {settings.dismissible !== false && (
          <button
            onClick={handleDismiss}
            className={`p-1 rounded-md shrink-0 transition-colors cursor-pointer ${styles.closeBtn}`}
            aria-label="Dismiss announcement banner"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* =========================================================================
          MOBILE VIEW (< sm): Continuous Infinite Loop Marquee Ticker (move inloop)
          ========================================================================= */}
      <div className="flex sm:hidden items-center w-full relative overflow-hidden py-2 px-2">
        {/* Soft edge gradient fades for authentic luxury finish */}
        <div className={`pointer-events-none absolute left-0 top-0 bottom-0 w-6 z-10 bg-gradient-to-r ${styles.fadeGradient} to-transparent`} />
        <div className={`pointer-events-none absolute right-8 top-0 bottom-0 w-8 z-10 bg-gradient-to-l ${styles.fadeGradient} to-transparent`} />

        {/* Infinite Loop Marquee Track: Seamlessly scrolls Track A and Track B */}
        <div className="flex overflow-hidden w-full">
          <div className="animate-ticker-loop items-center">
            {renderBannerItem(true)}
            <span className="text-[#B8936D]/60 pr-8">✦</span>
            {renderBannerItem(true)}
            <span className="text-[#B8936D]/60 pr-8">✦</span>
            {renderBannerItem(true)}
            <span className="text-[#B8936D]/60 pr-8">✦</span>
            {renderBannerItem(true)}
            <span className="text-[#B8936D]/60 pr-8">✦</span>
          </div>
        </div>

        {/* Docked Mobile Close Button */}
        {settings.dismissible !== false && (
          <button
            onClick={handleDismiss}
            className={`p-1.5 ml-1 shrink-0 z-20 cursor-pointer ${styles.closeBtn}`}
            aria-label="Dismiss announcement banner"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </aside>
  );
}
