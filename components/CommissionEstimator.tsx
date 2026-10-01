'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Compass, CheckCircle2, Send, Download, Building2, Check, Phone, Mail, ChevronDown, MessageSquare } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { motion, AnimatePresence } from 'motion/react';
import { SmoothAutoHeight } from '@/components/SmoothAutoHeight';
import { PROJECTS } from '@/data/projects';

interface CommissionEstimatorProps {
  initialTypology?: string;
  initialProjectName?: string;
}

interface CustomProjectOption {
  id: string;
  code?: string;
  title: string;
  subtitle: string;
  typologyLabel: string;
  location: string;
  areaSqFt: number;
  structuralConcept: string;
  sustainabilityRating: string;
  unitOptions: string[];
  specs: { label: string; value: string }[];
}

const CUSTOM_OPTION: CustomProjectOption = {
  id: 'custom-build',
  code: '',
  title: 'CUSTOM CIVIL PROJECT',
  subtitle: 'Turnkey residential and commercial construction across Coimbatore',
  typologyLabel: 'Turnkey Civil Construction',
  location: 'Coimbatore, Tamil Nadu',
  areaSqFt: 2500,
  structuralConcept: 'Earthquake-resistant RCC foundation with M25 grade concrete and high-density precision block masonry.',
  sustainabilityRating: '100% Vasthu & Manaiyadi Compliant',
  unitOptions: [
    'Custom Luxury Villa / Bungalow',
    'Commercial Office / IT Workspaces',
    'Premium Apartment Development',
    'Turnkey Civil Contract Consultation',
  ],
  specs: [
    { label: 'Structural Standard', value: 'M25 RCC Earthquake Resistant' },
    { label: 'Vasthu Geometry', value: '100% Vasthu & Manaiyadi Compliant' },
    { label: 'Brand Partnerships', value: 'Kohler, Roca, Legrand, Polycab' },
    { label: 'Management Style', value: 'Direct Partner Site Supervision' },
  ],
};

export function CommissionEstimator({ initialTypology, initialProjectName }: CommissionEstimatorProps) {
  // Determine initial selection based on props
  const getInitialProjectId = () => {
    if (initialProjectName) {
      const match = PROJECTS.find((p) => p.title.toLowerCase().includes(initialProjectName.toLowerCase()));
      if (match) return match.id;
    }
    return null;
  };

  const [selectedId, setSelectedId] = useState<string | null>(getInitialProjectId());

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [targetYear, setTargetYear] = useState('2026');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [docketNumber, setDocketNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  // Find active project details
  const activeProject = selectedId ? PROJECTS.find((p) => p.id === selectedId) : null;

  // Unit options based on genuine project data
  const getUnitOptions = (projId: string | null): string[] => {
    if (!projId) return [];
    switch (projId) {
      case 'mystic-villas':
        return ['22 Cents Plot + 2,500 sq ft Luxury Farmhouse with Plunge Pool', '22+ Cents Custom Plantation Plot Walkthrough'];
      case 'aurum-villas':
        return ['3 BHK Luxury Gated Villa (2,132 – 3,012 sq ft)', 'East / West / South / North Villa Tour'];
      case 'abv-arbor':
        return ['3 BHK Luxury Residence (~2,395 sq ft)', '4 BHK Luxury Penthouse Suite', 'Site & Model Flat Walkthrough'];
      case 'dotcom-workspaces':
        return ['Single Column-Free Floor Plate (~2,054 sq ft)', 'Multi-Floor IT Corporate Suite', 'Rooftop Dining & Workspace Leasing'];
      case 'uptown-residences':
        return ['1 BHK Budget Apartment', '2 BHK Family Residence', '3 BHK Premium Apartment (~1,450 sq ft)'];
      default:
        return CUSTOM_OPTION.unitOptions;
    }
  };

  const currentUnitOptions = getUnitOptions(selectedId);

  // Real specifications for the preview box
  const getProjectSpecs = () => {
    if (selectedId === CUSTOM_OPTION.id) {
      return CUSTOM_OPTION.specs;
    }

    if (!activeProject) {
      return [
        { label: 'Practice Focus', value: 'Mid-Level Premium Residential & Commercial Construction' },
        { label: 'Vasthu Geometry', value: '100% Vasthu & Manaiyadi Compliant Proportions' },
        { label: 'Structural Engineering', value: 'M25 Concrete Standards with Earthquake Resistant Isolated Footing' },
        { label: 'Brand Partnerships', value: 'Kohler • Roca • Legrand • Polycab • Finolex' },
      ];
    }

    return [
      {
        label: 'Configuration & Scale',
        value: `${activeProject.typologyLabel} (~${activeProject.areaSqFt.toLocaleString()} sq ft)`,
      },
      {
        label: 'Vasthu Standard',
        value: activeProject.sustainabilityRating,
      },
      {
        label: 'Structural Engineering',
        value: activeProject.structuralConcept,
      },
      {
        label: 'Key Brand Specifications',
        value: activeProject.materials.slice(0, 3).join(' • '),
      },
    ];
  };

  const currentSpecs = getProjectSpecs();
  const currentTitle = selectedId === CUSTOM_OPTION.id
    ? CUSTOM_OPTION.title
    : activeProject
    ? activeProject.title
    : 'GENERAL INQUIRY & CONSULTATION';

  const currentSubtitle = selectedId === CUSTOM_OPTION.id
    ? CUSTOM_OPTION.subtitle
    : activeProject
    ? activeProject.subtitle
    : 'Select a development from the left to view verified specifications, or submit a general consultation request below.';

  const currentLocation = selectedId === CUSTOM_OPTION.id
    ? CUSTOM_OPTION.location
    : activeProject
    ? activeProject.location
    : 'Coimbatore, Tamil Nadu';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!name.trim() || !email.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    const randomDocket = `INQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setDocketNumber(randomDocket);
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 200);
  };

  const handleDownloadBrief = () => {
    const briefText = `
SOUL SPACE INFRASTRUCTURE — PROJECT INQUIRY BRIEF
-------------------------------------------------
Inquiry Docket: ${docketNumber || 'INQ-2026-DRAFT'}
Client Name: ${name || 'Prospective Client'}
Email: ${email}
Phone: ${phone || 'Not Provided'}

PROJECT SELECTION (OFFICIAL PORTFOLIO):
- Development: ${currentTitle}
- Typology: ${activeProject ? activeProject.typologyLabel : CUSTOM_OPTION.typologyLabel}
- Physical Location: ${currentLocation}
${selectedId === CUSTOM_OPTION.id ? `- Subject / Project Title: ${subject || 'Custom Civil Project Consultation'}` : `- Selected Unit Preference: ${selectedUnit || currentUnitOptions[0]}`}
- Target Timeline: ${targetYear}

VERIFIED ENGINEERING & MATERIAL SPECIFICATIONS:
- Structural System: ${activeProject ? activeProject.structuralConcept : CUSTOM_OPTION.structuralConcept}
- Vasthu Compliance: ${activeProject ? activeProject.sustainabilityRating : CUSTOM_OPTION.sustainabilityRating}
- Materials & Finishes: ${activeProject ? activeProject.materials.join(', ') : 'M25 Concrete, Kohler/Roca CP fittings, Legrand switches'}

CLIENT NOTES & REQUIREMENTS:
${notes || 'Standard project inquiry.'}

-------------------------------------------------
Soul Space Infrastructure
No 5/2, Hindustan Avenue, Nava india road, Sowripalayam post, Coimbatore -641028
Phone: +91 96777 71331 / +91 91591 33331
Email: soulspaceinfrastructure@gmail.com
    `.trim();

    const blob = new Blob([briefText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Soul_Space_Inquiry_${docketNumber || 'Draft'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="inquiries" className="py-16 sm:py-28 bg-[#F4F2EB] border-b border-[#E3DCCF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="flex flex-col items-center text-center gap-6 border-b border-[#D8D0C0] pb-10 mb-16">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 text-[#99744C] text-xs tracking-[0.22em] uppercase font-semibold mb-2">
              <span className="w-2 h-0.5 bg-[#B8936D]" />
              <span>PROJECT INQUIRIES &amp; CONSULTATION</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-5xl md:text-6xl text-[#141311] tracking-[-0.03em] font-normal">
              Initiate a Project <br className="hidden sm:inline" />
              <span className="italic text-[#B8936D]">Consultation.</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#575046] max-w-2xl leading-relaxed font-light">
            Connect directly with Soul Space Infrastructure for unit bookings, floor plans, and site visits across Coimbatore.
          </p>
        </ScrollReveal>

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Official Development Selector */}
          <ScrollReveal delay={0.05} xOffset={-24} yOffset={24} className="lg:col-span-6 space-y-6 bg-[#FAF8F4] border border-[#E5DFD4] p-6 sm:p-8 rounded-xl shadow-none min-w-0">
            <div>
              <span className="text-xs font-sans text-[#8C7A65] tracking-widest uppercase block mb-3 font-semibold">
                SELECT A SOUL SPACE DEVELOPMENT
              </span>
              <p className="text-xs text-[#6B6153] mb-4 font-light">
                Choose one of our four active developments in Coimbatore or request a custom turnkey build.
              </p>

              {/* Development Cards Selection */}
              <div className="space-y-2.5">
                {PROJECTS.map((proj) => {
                  const isSelected = selectedId === proj.id;
                  return (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => {
                        setSelectedId(proj.id);
                        setSelectedUnit('');
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#ECE7DF] text-[#181715] border-[#D5CDBF] hover:border-[#CBB8A0] shadow-none'
                          : 'bg-[#F4F2EB] text-[#181715] border-[#E0D9CC] hover:border-[#CBB8A0]'
                      }`}
                      id={`select-project-${proj.id}`}
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-sans truncate ${isSelected ? 'text-black font-medium' : 'text-[#7A6F60]'}`}>
                            {proj.typologyLabel}
                          </span>
                        </div>
                        <h4 className="font-serif text-[20px] font-normal leading-snug">
                          {proj.title}
                        </h4>
                        <p className={`text-xs mt-1 truncate ${
                          isSelected ? 'text-[#8C7A65]' : 'text-[#8C7A65]'
                        }`}>
                          <span>{proj.location}</span>
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center">
                        <span className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#B8936D] border-[#B8936D] text-white'
                            : 'border-[#D5CDBF] text-transparent'
                        }`}>
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </button>
                  );
                })}

                {/* Custom Civil Option */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(CUSTOM_OPTION.id);
                    setSelectedUnit('');
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    selectedId === CUSTOM_OPTION.id
                      ? 'bg-[#ECE7DF] text-[#181715] border-[#D5CDBF] hover:border-[#CBB8A0] shadow-none'
                      : 'bg-[#FAF8F4] text-[#181715] border-[#E0D9CC] hover:border-[#CBB8A0]'
                  }`}
                  id="select-project-custom"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] uppercase font-sans tracking-widest font-semibold px-2 py-0.5 rounded-full ${
                        selectedId === CUSTOM_OPTION.id ? 'bg-[#DCD5C8] text-[#181715]' : 'bg-[#EFECE5] text-[#B8936D]'
                      }`}>
                        CUSTOM
                      </span>
                      <span className={`text-xs font-sans truncate ${selectedId === CUSTOM_OPTION.id ? 'text-black font-medium' : 'text-[#7A6F60]'}`}>
                        Turnkey Civil Construction
                      </span>
                    </div>
                    <h4 className="font-serif text-[20px] font-normal leading-snug">
                      Custom Residential / Commercial Build
                    </h4>
                    <p className="text-xs mt-1 truncate text-[#8C7A65]">
                      <span>Coimbatore &amp; Surrounding Region</span>
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center">
                    <span className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                      selectedId === CUSTOM_OPTION.id
                        ? 'bg-[#B8936D] border-[#B8936D] text-white'
                        : 'border-[#D5CDBF] text-transparent'
                    }`}>
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Direct Verified Contact Numbers */}
            <div className="p-4 bg-[#EFECE5]/80 border border-[#E0D9CC] rounded-xl text-xs font-sans space-y-3 text-[#5C5346]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8936D] block">
                  DIRECT INQUIRY DESK
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#786E5F]">
                  Coimbatore, TN
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs flex-wrap min-w-0">
                  <a
                    href="tel:+919677771331"
                    className="flex items-center gap-1.5 font-medium text-[#181715] hover:text-[#B8936D] transition-colors shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#B8936D]" />
                    <span>+91 96777 71331</span>
                  </a>
                  <a
                    href="tel:+919159133331"
                    className="flex items-center gap-1.5 font-medium text-[#181715] hover:text-[#B8936D] transition-colors shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#B8936D]" />
                    <span>+91 91591 33331</span>
                  </a>
                  <a
                    href="mailto:soulspaceinfrastructure@gmail.com"
                    className="flex items-center gap-1.5 text-[#B8936D] hover:underline shrink-0"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Team</span>
                  </a>
                </div>

                <div className="pt-2 border-t border-[#E0D9CC]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs flex-wrap min-w-0">
                  <a
                    href="https://wa.me/919677771331"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-medium text-[#181715] hover:text-[#B8936D] transition-colors shrink-0"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#B8936D]" />
                    <span>WhatsApp: +91 96777 71331</span>
                  </a>
                  <a
                    href="https://wa.me/919159133331"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-medium text-[#181715] hover:text-[#B8936D] transition-colors shrink-0"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#B8936D]" />
                    <span>WhatsApp: +91 91591 33331</span>
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Verified Project Specs & Submission Form */}
          <ScrollReveal delay={0.15} xOffset={24} yOffset={24} className="lg:col-span-6 flex flex-col gap-6 min-w-0">
            {/* Real Project Specifications Summary Box */}
            <SmoothAutoHeight duration={0.32}>
              <div className="bg-[#ECE7DF] text-[#181714] p-6 sm:p-8 rounded-xl border border-[#D5CDBF] font-sans text-xs shadow-none overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D5CDBF] pb-4 mb-5 gap-2">
                  <span className="flex items-center gap-2 text-[#181715] tracking-[0.15em] uppercase font-bold text-[11px]">
                    <Compass className="w-4 h-4" />
                    VERIFIED DEVELOPMENT DATA
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-serif text-2xl text-[#181715] font-normal leading-tight">
                      {currentTitle}
                    </h3>
                    <p className="text-[14px] text-[#7A6F60] mt-1 font-serif italic">
                      {currentSubtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#D5CDBF]">
                    {currentSpecs.map((spec, sIdx) => (
                      <div key={sIdx} className={sIdx >= 2 ? 'sm:col-span-2' : ''}>
                        <span className="text-[10px] text-[#786E5F] uppercase tracking-widest block mb-1 font-medium">
                          {spec.label}
                        </span>
                        <span className="text-xs text-[#292520] font-sans leading-relaxed block">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SmoothAutoHeight>

            {/* Direct Submission Form */}
            <SmoothAutoHeight duration={0.38}>
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="commission-form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-[#FAF8F4] border border-[#E5DFD4] p-6 sm:p-8 rounded-xl space-y-5 shadow-none overflow-visible"
                    id="commission-inquiry-form"
                  >
                <div className="border-b border-[#E5DFD4] pb-3">
                  <h3 className="font-serif text-2xl text-[#181715] font-normal">
                    {selectedId ? `Submit Inquiry for ${currentTitle}` : 'Submit Project Inquiry'}
                  </h3>
                  <p className="text-xs text-[#7A6F60] mt-1 font-light">
                    Direct communication with Soul Space directors and project engineering leads.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="inquiry-name-input" className="block text-[11px] font-sans uppercase tracking-widest text-[#695F50] font-semibold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-[#EFECE5] border border-[#E0D9CC] hover:border-[#B8936D] focus:border-[#B8936D] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-[#B8936D] text-xs px-3.5 py-2.5 rounded-lg text-[#181715] transition-colors"
                      id="inquiry-name-input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="inquiry-email-input" className="block text-[11px] font-sans uppercase tracking-widest text-[#695F50] font-semibold">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ramesh@gmail.com"
                      className="w-full bg-[#EFECE5] border border-[#E0D9CC] hover:border-[#B8936D] focus:border-[#B8936D] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-[#B8936D] text-xs px-3.5 py-2.5 rounded-lg text-[#181715] transition-colors"
                      id="inquiry-email-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="inquiry-phone-input" className="block text-[11px] font-sans uppercase tracking-widest text-[#695F50] font-semibold">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-[#EFECE5] border border-[#E0D9CC] hover:border-[#B8936D] focus:border-[#B8936D] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-[#B8936D] text-xs px-3.5 py-2.5 rounded-lg text-[#181715] transition-colors"
                      id="inquiry-phone-input"
                    />
                  </div>

                  {selectedId === CUSTOM_OPTION.id ? (
                    <div className="space-y-1.5">
                      <label htmlFor="inquiry-subject-input" className="block text-[11px] font-sans uppercase tracking-widest text-[#695F50] font-semibold">
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Turnkey Villa Construction / Commercial Complex"
                        className="w-full bg-[#EFECE5] border border-[#E0D9CC] hover:border-[#B8936D] focus:border-[#B8936D] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-[#B8936D] text-xs px-3.5 py-2.5 rounded-lg text-[#181715] transition-colors"
                        id="inquiry-subject-input"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5 relative" ref={dropdownRef}>
                      <label htmlFor="inquiry-unit-select-btn" className="block text-[11px] font-sans uppercase tracking-widest text-[#695F50] font-semibold">
                        Configuration of Interest
                      </label>

                      {/* Custom Architectural Dropdown Button: perfectly matches the other form inputs */}
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                        aria-haspopup="listbox"
                        aria-expanded={isDropdownOpen}
                        id="inquiry-unit-select-btn"
                        className={`w-full text-left text-xs px-3.5 py-2.5 rounded-lg border transition-colors duration-150 cursor-pointer flex items-center justify-between gap-2 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-[#B8936D] ${
                          isDropdownOpen
                            ? 'bg-[#EFECE5] border-[#B8936D] text-[#181715]'
                            : 'bg-[#EFECE5] text-[#181715] border-[#E0D9CC] hover:border-[#B8936D]'
                        }`}
                      >
                        <span className="truncate font-sans font-normal">
                          {selectedUnit || currentUnitOptions[0]}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-[#786E5F] shrink-0 transition-transform duration-200 ${
                            isDropdownOpen ? 'rotate-180 text-[#181715]' : ''
                          }`}
                        />
                      </button>

                      {/* Custom Dropdown Options Popover: perfectly harmonized with form inputs */}
                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -2 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -2 }}
                            transition={{ duration: 0.12 }}
                            className="absolute z-50 left-0 right-0 top-full mt-1 bg-[#EFECE5] border border-[#D5CEBF] rounded-lg shadow-none overflow-hidden p-1 space-y-0.5"
                            role="listbox"
                            id="inquiry-unit-dropdown-menu"
                          >
                            {currentUnitOptions.map((opt, oIdx) => {
                              const isSelectedOption = (selectedUnit || currentUnitOptions[0]) === opt;
                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  role="option"
                                  aria-selected={isSelectedOption}
                                  onClick={() => {
                                    setSelectedUnit(opt);
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2.5 sm:py-2 min-h-[38px] sm:min-h-0 rounded-md text-xs font-sans border transition-colors duration-150 flex items-center justify-between gap-2 cursor-pointer ${
                                    isSelectedOption
                                      ? 'bg-[#E5DFD4] text-[#181715] font-medium border-[#B8936D]'
                                      : 'bg-[#FAF8F5] text-[#332E27] border-transparent hover:border-[#CBB8A0]'
                                  }`}
                                  id={`dropdown-unit-option-${oIdx}`}
                                >
                                  <span className="leading-snug break-normal">
                                    {opt}
                                  </span>
                                  {isSelectedOption && (
                                    <Check className="w-3.5 h-3.5 text-[#B8936D] shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="inquiry-notes-textarea" className="block text-[11px] font-sans uppercase tracking-widest text-[#695F50] font-semibold">
                    {selectedId === CUSTOM_OPTION.id ? 'Subject Details *' : 'Specific Requirements or Site Visit Request'}
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      selectedId === CUSTOM_OPTION.id
                        ? 'Describe your plot size, civil construction scope, location, or estimated budget...'
                        : `Inquire about unit availability, floor plans, or schedule a visit to ${currentTitle}...`
                    }
                    className="w-full bg-[#EFECE5] border border-[#E0D9CC] hover:border-[#B8936D] focus:border-[#B8936D] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-[#B8936D] text-xs p-3.5 rounded-lg text-[#181715] transition-colors resize-none"
                    id="inquiry-notes-textarea"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#181715] text-white text-[11px] font-sans tracking-[0.14em] sm:tracking-[0.16em] uppercase py-3 sm:py-3.5 px-4 sm:px-6 rounded-full transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-none font-medium border border-[#2D2A26] hover:border-[#B8936D] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-0 focus-visible:ring-0"
                  id="submit-commission-btn"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Transmitting Details...' : 'Send Project Inquiry'}</span>
                </button>
                  </motion.form>
                ) : (
                  /* Success Confirmation Card */
                  <motion.div
                    key="commission-success"
                    layout
                    className="bg-[#F5F2EB]/95 backdrop-blur-2xl border border-[#B8936D] p-6 sm:p-8 rounded-xl space-y-4 shadow-none"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.32 }}
                  >
                <div className="flex items-center gap-3 text-[#B8936D]">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <div>
                    <h4 className="font-serif text-xl text-[#181715]">Inquiry Received for {currentTitle}</h4>
                    <p className="text-xs font-sans text-[#8C7A65]">INQUIRY DOCKET: {docketNumber}</p>
                  </div>
                </div>

                <p className="text-xs text-[#524B40] leading-relaxed">
                  Thank you, <span className="font-semibold text-[#181715]">{name}</span>. Your inquiry details for{' '}
                  <span className="font-semibold text-[#181715]">{currentTitle}</span> have been routed directly to Soul Space Infrastructure directors. Our team will contact you at{' '}
                  <span className="underline">{email}</span> or <span className="font-semibold">{phone}</span> within 24 hours.
                </p>

                <div className="p-4 bg-[#EFECE5] border border-[#E0D9CC] rounded-xl text-xs font-sans space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#8C7F70]">DEVELOPMENT:</span>
                    <span className="text-[#181715] font-semibold">{currentTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C7F70]">LOCATION:</span>
                    <span className="text-[#181715] font-semibold">{currentLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C7F70]">{selectedId === CUSTOM_OPTION.id ? 'SUBJECT:' : 'CONFIGURATION:'}</span>
                    <span className="text-[#181715] font-semibold">{selectedId === CUSTOM_OPTION.id ? (subject || 'Custom Civil Project Consultation') : (selectedUnit || currentUnitOptions[0])}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 pt-2 w-full">
                  <button
                    onClick={handleDownloadBrief}
                    className="w-full sm:w-auto justify-center px-5 py-2.5 bg-[#181715] text-white text-[11px] font-sans uppercase tracking-wider rounded-full flex items-center gap-2 transition-colors cursor-pointer border border-[#2D2A26] hover:border-[#CBB8A0]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Inquiry Brief (TXT)</span>
                  </button>

                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="w-full sm:w-auto justify-center px-5 py-2.5 border border-[#D5CDBF] bg-transparent hover:border-[#B8936D] text-[#181715] text-[11px] font-sans uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </motion.div>
            )}
              </AnimatePresence>
            </SmoothAutoHeight>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
