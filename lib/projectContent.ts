/**
 * Soul Space Infrastructure — Dynamic Project & Editorial Content Store
 * Allows real-time editing of project taglines, status badges, pricing/area,
 * overview copy, brochure download links, and website announcement bars.
 */

export interface ProjectCustomData {
  statusBadge?: string;
  investmentRange?: string;
  areaRange?: string;
  tagline?: string;
  overview?: string;
  brochureUrl?: string;
  highlights?: string[];
  unitsCount?: string;
}

export type AnnouncementTheme = 'obsidian-gold' | 'champagne-alabaster' | 'emerald-biophilic' | 'terracotta-heritage' | 'aurum-bronze';
export type AnnouncementStyle = 'banner' | 'countdown' | 'ticker';
export type AnnouncementDisplayScope = 'all' | 'home' | 'projects';

export interface AnnouncementSettings {
  enabled: boolean;
  badge: string;
  text: string;
  linkUrl: string;
  linkText?: string;
  theme?: AnnouncementTheme;
  style?: AnnouncementStyle;
  targetDate?: string;
  countdownLabel?: string;
  displayScope?: AnnouncementDisplayScope;
  dismissible?: boolean;
  urgentPulse?: boolean;
  secondaryText?: string;
}

export const DEFAULT_ANNOUNCEMENT: AnnouncementSettings = {
  enabled: false,
  badge: 'NEW RELEASE',
  text: 'Exclusive Preview: Aurum Villas Phase 2 Bookings Open — Schedule a Private Consultation Today',
  linkUrl: '/projects/aurum-villas',
  linkText: 'Explore Residence',
  theme: 'obsidian-gold',
  style: 'banner',
  targetDate: '2026-10-31T23:59:59',
  countdownLabel: 'VIP Priority Window Closes In:',
  displayScope: 'all',
  dismissible: true,
  urgentPulse: true,
  secondaryText: 'Over 65% Already Reserved Across North & East Facing Plots',
};

export type LeadStageId = 'new' | 'contacted' | 'visit_scheduled' | 'negotiation' | 'closed' | 'archived';

export interface LeadStageDefinition {
  id: LeadStageId;
  label: string;
  shortLabel: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
}

export const LEAD_STAGES: LeadStageDefinition[] = [
  {
    id: 'new',
    label: 'New Lead',
    shortLabel: 'New',
    description: 'Fresh uncontacted inquiry received via website portal',
    badgeBg: 'bg-[#FFF9EE]',
    badgeText: 'text-[#9A7336]',
    badgeBorder: 'border-[#F1DFBA]',
    dotColor: 'bg-[#D4A359]',
  },
  {
    id: 'contacted',
    label: 'Contacted',
    shortLabel: 'Contacted',
    description: 'Initial discovery call or WhatsApp outreach conducted',
    badgeBg: 'bg-[#F0F7FF]',
    badgeText: 'text-[#1D4ED8]',
    badgeBorder: 'border-[#BFDBFE]',
    dotColor: 'bg-[#3B82F6]',
  },
  {
    id: 'visit_scheduled',
    label: 'Site Visit Scheduled',
    shortLabel: 'Site Visit',
    description: 'In-person villa tour or showroom briefing arranged',
    badgeBg: 'bg-[#FAF5FF]',
    badgeText: 'text-[#7E22CE]',
    badgeBorder: 'border-[#E9D5FF]',
    dotColor: 'bg-[#A855F7]',
  },
  {
    id: 'negotiation',
    label: 'In Negotiation',
    shortLabel: 'Negotiation',
    description: 'Unit selection, pricing or payment milestones review',
    badgeBg: 'bg-[#FFF7ED]',
    badgeText: 'text-[#C2410C]',
    badgeBorder: 'border-[#FED7AA]',
    dotColor: 'bg-[#F97316]',
  },
  {
    id: 'closed',
    label: 'Closed / Won',
    shortLabel: 'Closed / Won',
    description: 'Enclave reservation confirmed, token deposit received',
    badgeBg: 'bg-[#F0FDF4]',
    badgeText: 'text-[#15803D]',
    badgeBorder: 'border-[#BBF7D0]',
    dotColor: 'bg-[#22C55E]',
  },
  {
    id: 'archived',
    label: 'Archived / Dormant',
    shortLabel: 'Archived',
    description: 'Inquiry closed or dormant without active follow-up',
    badgeBg: 'bg-[#F5F4F0]',
    badgeText: 'text-[#6E6A63]',
    badgeBorder: 'border-[#E2DFD8]',
    dotColor: 'bg-[#9C978D]',
  },
];

const STORAGE_KEY_PROJECTS = 'soulspace_custom_projects_v1';
const STORAGE_KEY_ANNOUNCEMENT = 'soulspace_announcement_v1';
const STORAGE_KEY_INQUIRY_METAS = 'soulspace_inquiry_metas_v1';

export function getProjectCustomData(projectId: string): ProjectCustomData {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed[projectId] || {};
  } catch {
    return {};
  }
}

export function saveProjectCustomData(projectId: string, data: ProjectCustomData): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    const existing = raw ? JSON.parse(raw) : {};
    existing[projectId] = { ...existing[projectId], ...data };
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(existing));
    window.dispatchEvent(new CustomEvent('soulspace-content-updated', { detail: { projectId } }));
  } catch (err) {
    console.error('Failed to save project custom data', err);
  }
}

export function getAllCustomProjects(): Record<string, ProjectCustomData> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getAnnouncementSettings(): AnnouncementSettings {
  if (typeof window === 'undefined') return DEFAULT_ANNOUNCEMENT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ANNOUNCEMENT);
    return raw ? { ...DEFAULT_ANNOUNCEMENT, ...JSON.parse(raw) } : DEFAULT_ANNOUNCEMENT;
  } catch {
    return DEFAULT_ANNOUNCEMENT;
  }
}

export function saveAnnouncementSettings(settings: AnnouncementSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ANNOUNCEMENT, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('soulspace-announcement-updated', { detail: settings }));
  } catch (err) {
    console.error('Failed to save announcement', err);
  }
}

export interface StageHistoryEntry {
  stage: LeadStageId;
  timestamp: string;
  note?: string;
}

export interface InquiryMeta {
  status?: LeadStageId;
  internalNotes?: string;
  history?: StageHistoryEntry[];
  lastUpdated?: string;
}

export function getInquiryMeta(docketOrId: string): InquiryMeta {
  if (typeof window === 'undefined') return { status: 'new' };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INQUIRY_METAS);
    if (!raw) return { status: 'new' };
    const parsed = JSON.parse(raw);
    return parsed[docketOrId] || { status: 'new' };
  } catch {
    return { status: 'new' };
  }
}

export function saveInquiryMeta(docketOrId: string, meta: Partial<InquiryMeta>): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INQUIRY_METAS);
    const existing = raw ? JSON.parse(raw) : {};
    existing[docketOrId] = {
      ...(existing[docketOrId] || { status: 'new' }),
      ...meta,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_INQUIRY_METAS, JSON.stringify(existing));
    window.dispatchEvent(new CustomEvent('soulspace-inquiry-updated', { detail: { docketOrId } }));
  } catch (err) {
    console.error('Failed to save inquiry meta', err);
  }
}
