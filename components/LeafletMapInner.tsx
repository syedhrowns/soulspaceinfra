'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import type LType from 'leaflet';
import { RotateCcw, Hand, Lock } from 'lucide-react';
import { MapLocation } from '@/data/mapLocations';

interface LeafletMapInnerProps {
  locations: MapLocation[];
  selectedLocationId: string | null;
  onSelectLocation: (loc: MapLocation) => void;
  onOpenProject?: (projectId: string) => void;
}

export default function LeafletMapInner({
  locations,
  selectedLocationId,
  onSelectLocation,
  onOpenProject,
}: LeafletMapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LType.Map | null>(null);
  const markersRef = useRef<Record<string, LType.Marker>>({});

  const [isMobile, setIsMobile] = useState(false);
  const [isPanActive, setIsPanActive] = useState(false);

  const COIMBATORE_CENTER: [number, number] = [11.005, 76.965];
  const DEFAULT_ZOOM = 11.5;

  useEffect(() => {
    let isMounted = true;
    const isTouchDevice = typeof window !== 'undefined' && (window.innerWidth < 1024 || 'ontouchstart' in window);
    setIsMobile(isTouchDevice);

    async function initMap() {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const leafletModule = await import('leaflet');
      const L = leafletModule.default || leafletModule;

      if (!isMounted || !mapContainerRef.current) return;

      // Initialize Leaflet Map
      // On mobile/touch devices, disable dragging by default so vertical swiping scrolls the webpage effortlessly
      const map = L.map(mapContainerRef.current, {
        center: COIMBATORE_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false, // Prevent accidental page scroll hijacking
        dragging: !isTouchDevice,
      });

      mapInstanceRef.current = map;

      // Add Clean Warm Architectural Map Tiles (OpenStreetMap with high-fidelity roads & labels)
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: 'abc',
        className: 'architectural-map-tiles',
      });
      tileLayer.addTo(map);

      // Fit bounds to all project coordinates with balanced padding so Marker 05 (Eachanari) & others are never cut off
      const latLngs = locations.map((loc) => loc.coordinates);
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, {
        padding: isTouchDevice ? [28, 28] : [52, 52],
        maxZoom: 13,
      });

      // Crucial: Invalidate size after layout stabilization to eliminate any white square / blank tile glitch
      const timer1 = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 150);

      const timer2 = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          mapInstanceRef.current.fitBounds(bounds, {
            padding: isTouchDevice ? [28, 28] : [52, 52],
            maxZoom: 13,
          });
        }
      }, 500);

      // Create Markers
      locations.forEach((loc, index) => {
        const isHQ = loc.category === 'studio';
        const badgeText = isHQ ? 'HQ' : `0${index}`;

        const iconHtml = `
          <div class="map-pin-pulse relative flex items-center justify-center">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full ${
              isHQ
                ? 'bg-[#181714] text-[#B8936D] border-2 border-[#B8936D] shadow-xl hover:border-[#CBB8A0]'
                : 'bg-[#FAF8F4] text-[#181714] border-2 border-[#B8936D] shadow-md hover:border-[#CBB8A0]'
            } flex items-center justify-center font-sans text-[11px] font-bold transition-all duration-200">
              ${badgeText}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-leaflet-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const marker = L.marker(loc.coordinates, { icon: customIcon }).addTo(map);

        // Popup Content matching brand aesthetics
        const popupHtml = `
          <div class="p-3.5 sm:p-4 max-w-[240px] sm:max-w-[280px] font-sans">
            <div class="text-[9.5px] font-sans tracking-widest text-[#B8936D] uppercase font-bold mb-1">
              ${loc.categoryLabel}
            </div>
            <h4 class="font-serif text-lg text-[#181714] font-semibold leading-snug mb-1">
              ${loc.title}
            </h4>
            <p class="text-[11px] text-[#5C5346] leading-relaxed">
              ${loc.address}
            </p>
          </div>
        `;

        marker.bindPopup(popupHtml);

        marker.on('click', () => {
          onSelectLocation(loc);
        });

        markersRef.current[loc.id] = marker;
      });

      const handleResize = () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      };
      window.addEventListener('resize', handleResize);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        window.removeEventListener('resize', handleResize);
      };
    }

    const cleanupInit = initMap();

    return () => {
      isMounted = false;
      cleanupInit.then((clean) => {
        if (typeof clean === 'function') clean();
      });
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map pan and marker active state when selectedLocationId changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedLocationId && markersRef.current[selectedLocationId]) {
      const loc = locations.find((l) => l.id === selectedLocationId);
      if (loc) {
        map.flyTo(loc.coordinates, 14, { duration: 1.2 });
        markersRef.current[selectedLocationId].openPopup();
      }
    }
  }, [selectedLocationId, locations]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = async () => {
    if (!mapInstanceRef.current) return;
    const leafletModule = await import('leaflet');
    const L = leafletModule.default || leafletModule;
    const latLngs = locations.map((loc) => loc.coordinates);
    const bounds = L.latLngBounds(latLngs);
    mapInstanceRef.current.flyToBounds(bounds, {
      padding: isMobile ? [28, 28] : [52, 52],
      maxZoom: 13,
      duration: 1.0,
    });
  };

  const handleTogglePan = () => {
    if (!mapInstanceRef.current) return;
    if (isPanActive) {
      mapInstanceRef.current.dragging.disable();
      setIsPanActive(false);
    } else {
      mapInstanceRef.current.dragging.enable();
      setIsPanActive(true);
    }
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[550px] rounded-2xl overflow-hidden border border-[#D5CDBF] shadow-xs">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Mobile Pan / Scroll Toggle Button (Only on Touch/Mobile Screens) */}
      {isMobile && (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
          <button
            type="button"
            onClick={handleTogglePan}
            className={`px-3 py-1.5 rounded-full text-[10px] font-sans font-semibold tracking-wider uppercase transition-all shadow-md flex items-center gap-1.5 border cursor-pointer ${
              isPanActive
                ? 'bg-[#181714] text-[#B8936D] border-[#B8936D]'
                : 'bg-[#FAF8F4]/95 text-[#181714] border-[#D5CDBF] hover:border-[#CBB8A0] backdrop-blur-xs'
            }`}
            aria-label={isPanActive ? 'Lock map and scroll page' : 'Enable pan map'}
          >
            {isPanActive ? (
              <>
                <Lock className="w-3 h-3 text-[#B8936D]" />
                <span>Lock Map (Scroll)</span>
              </>
            ) : (
              <>
                <Hand className="w-3 h-3 text-[#B8936D]" />
                <span>Pan Map</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Aesthetic Map Controls Overlay - Hover ONLY changes border */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 sm:w-9 sm:h-9 bg-[#FAF8F4] border border-[#D5CDBF] hover:border-[#CBB8A0] text-[#181714] rounded-lg flex items-center justify-center transition-colors shadow-xs font-sans text-base font-semibold"
          aria-label="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 sm:w-9 sm:h-9 bg-[#FAF8F4] border border-[#D5CDBF] hover:border-[#CBB8A0] text-[#181714] rounded-lg flex items-center justify-center transition-colors shadow-xs font-sans text-base font-semibold"
          aria-label="Zoom Out"
        >
          &minus;
        </button>
        <button
          onClick={handleResetView}
          className="w-10 h-10 sm:w-9 sm:h-9 bg-[#FAF8F4] border border-[#D5CDBF] hover:border-[#CBB8A0] text-[#181714] rounded-lg flex items-center justify-center transition-colors shadow-xs"
          aria-label="Reset Map View"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </div>
  );
}
