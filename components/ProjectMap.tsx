'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Navigation, ArrowUpRight, Compass, Building2, Home, Landmark } from 'lucide-react';
import { MAP_LOCATIONS, MapLocation } from '@/data/mapLocations';
import { ScrollReveal } from '@/components/ScrollReveal';

// Dynamic Import for Leaflet Map component (SSR false to prevent hydration errors)
const LeafletMapInner = dynamic(() => import('@/components/LeafletMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[380px] sm:h-[480px] lg:h-[550px] bg-[#F4F2EB] border border-[#D5CDBF] rounded-2xl flex flex-col items-center justify-center gap-3 animate-pulse">
      <Compass className="w-8 h-8 text-[#B8936D] animate-spin-slow" />
      <span className="text-xs font-sans font-medium text-[#8C7A65] uppercase tracking-widest">
        Loading Architectural Map...
      </span>
    </div>
  ),
});

interface ProjectMapProps {
  onOpenProject?: (projectId: string) => void;
  initialLocationId?: string;
  focusProjectId?: string;
}

export function ProjectMap({ onOpenProject, initialLocationId, focusProjectId }: ProjectMapProps) {
  const defaultId = initialLocationId || (focusProjectId ? MAP_LOCATIONS.find(l => l.projectId === focusProjectId)?.id : null) || 'studio-hq';
  const [selectedLocationId, setSelectedLocationId] = useState<string>(defaultId);
  const [isDesktop, setIsDesktop] = useState(false);
  const mapWrapperRef = React.useRef<HTMLDivElement>(null);
  const [shouldMountMap, setShouldMountMap] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldMountMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: '350px 0px' }
    );
    if (mapWrapperRef.current) {
      observer.observe(mapWrapperRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const filteredLocations = MAP_LOCATIONS;
  const selectedLocation = MAP_LOCATIONS.find((l) => l.id === selectedLocationId) || MAP_LOCATIONS[0];

  const categoryIcons = {
    studio: Landmark,
    residential: Home,
    commercial: Building2,
    farmhouse: Compass,
  };

  return (
    <section id="map" className="py-16 sm:py-28 bg-[#FAF8F4] border-b border-[#E3DCCF] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="flex flex-col items-center text-center gap-4 border-b border-[#D8D0C0] pb-10 mb-12">
          <div className="flex items-center gap-2 text-[#99744C] text-[10px] tracking-[0.3em] uppercase font-bold">
            <span className="w-3 h-px bg-[#B8936D]" />
            <span>SOUL SPACE GEOGRAPHIC FOOTPRINT</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#141311] tracking-[-0.03em] font-normal">
            Architectural Footprint &amp; <br className="hidden sm:inline" />
            <span className="italic text-[#B8936D]">Site Locations.</span>
          </h2>

          <p className="text-sm text-[#575046] max-w-2xl leading-relaxed font-light">
            Locate our Studio Headquarters, luxury villa developments, column-free commercial IT suites, and natural farmhouses across Coimbatore.
          </p>
        </ScrollReveal>

        {/* Map & Location Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Leaflet Map Canvas (8 Cols) */}
          <div ref={mapWrapperRef} className="lg:col-span-8 w-full">
            {shouldMountMap ? (
              <LeafletMapInner
                locations={filteredLocations}
                selectedLocationId={selectedLocationId}
                onSelectLocation={(loc) => setSelectedLocationId(loc.id)}
                onOpenProject={onOpenProject}
              />
            ) : (
              <div className="w-full h-[380px] sm:h-[480px] lg:h-[550px] bg-[#F4F2EB] border border-[#D5CDBF] rounded-2xl flex flex-col items-center justify-center gap-3">
                <Compass className="w-8 h-8 text-[#B8936D]" />
                <span className="text-xs font-sans font-medium text-[#8C7A65] uppercase tracking-widest">
                  Architectural Map
                </span>
              </div>
            )}
          </div>

          {/* Location Selector Cards List (4 Cols) — Desktop: independent scroll; Mobile: natural page flow without scroll traps */}
          <div
            data-lenis-prevent={isDesktop ? '' : undefined}
            className="lg:col-span-4 space-y-3 lg:max-h-[550px] lg:overflow-y-auto lg:overscroll-contain pr-1"
          >
            {filteredLocations.map((loc) => {
              const isSelected = loc.id === selectedLocationId;
              const IconComp = categoryIcons[loc.category] || MapPin;

              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocationId(loc.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#181714] text-[#FAF8F4] border-[#B8936D] shadow-md'
                      : 'bg-[#F4F2EB] text-[#181714] border-[#E5DFD4] hover:border-[#CBB8A0]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-[9.5px] font-sans uppercase tracking-wider font-semibold ${
                        isSelected ? 'text-[#B8936D]' : 'text-[#8C7A65]'
                      }`}
                    >
                      {loc.categoryLabel}
                    </span>
                    <IconComp
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-[#B8936D]' : 'text-[#8C7A65]'
                      }`}
                    />
                  </div>

                  <h3
                    className={`font-serif text-lg font-medium leading-snug mb-1 ${
                      isSelected ? 'text-white' : 'text-[#181714]'
                    }`}
                  >
                    {loc.title}
                  </h3>

                  <p
                    className={`text-xs leading-relaxed mb-3 line-clamp-2 ${
                      isSelected ? 'text-[#C4BCB0]' : 'text-[#5C5346]'
                    }`}
                  >
                    {loc.address}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[#D5CDBF]/30 text-[10px] font-sans">
                    <span className={isSelected ? 'text-[#B8936D]' : 'text-[#8C7A65]'}>
                      {loc.areaSqFt}
                    </span>

                    {loc.projectId && onOpenProject && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenProject(loc.projectId!);
                        }}
                        className={`inline-flex items-center gap-1 uppercase transition-colors ${
                          isSelected
                            ? 'text-white hover:text-white border-b border-transparent hover:border-white'
                            : 'text-[#181714] hover:text-[#181714] border-b border-transparent hover:border-[#CBB8A0]'
                        }`}
                      >
                        <span>View Details</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Location Feature Detail Card */}
        {selectedLocation && (
          <div className="mt-8 bg-[#F4F2EB] border border-[#E5DFD4] p-6 sm:p-8 rounded-2xl shadow-none">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-[10px] font-sans text-[#B8936D] uppercase tracking-widest font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {selectedLocation.categoryLabel}
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#181714]">
                  {selectedLocation.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5346] leading-relaxed">
                  {selectedLocation.address}
                </p>

                {/* Highlights */}
                <div className="flex items-center gap-2 flex-wrap pt-2">
                  {selectedLocation.highlights.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-sans bg-[#FAF8F4] border border-[#D5CDBF] text-[#4A433A] px-2.5 py-1 rounded-md"
                    >
                      &bull; {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Font-sans, View Details, Hover changes ONLY border color */}
              <div className="flex items-center gap-3 shrink-0 flex-wrap">
                <a
                  href={selectedLocation.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#181714] text-[#B8936D] border border-[#2D2A26] hover:border-[#B8936D] rounded-full text-[11px] font-sans font-semibold uppercase tracking-[0.14em] transition-colors inline-flex items-center gap-2 shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>

                {selectedLocation.projectId && onOpenProject && (
                  <button
                    onClick={() => onOpenProject(selectedLocation.projectId!)}
                    className="px-5 py-2.5 bg-[#FAF8F4] text-[#181714] border border-[#D5CDBF] hover:border-[#CBB8A0] rounded-full text-[11px] font-sans font-semibold uppercase tracking-[0.14em] transition-colors inline-flex items-center gap-2"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
