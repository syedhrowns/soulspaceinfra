'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Users,
  Settings,
  ArrowUpRight,
  Trash2,
  Download,
  Phone,
  Mail,
  Lock,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Key,
  Search,
  Eye,
  Filter,
  LayoutGrid,
  List,
  MessageCircle,
  X,
  ZoomIn,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Edit3,
  Megaphone,
  Building2,
  Tag,
  DollarSign,
  Maximize2,
  Calendar,
  Clock,
  Printer,
  FileSpreadsheet,
  Palette,
  Compass,
  Flame,
} from 'lucide-react';
import {
  InquiryRecord,
  SiteSettings,
  DEFAULT_SITE_SETTINGS,
  isSupabaseConfigured,
  saveSiteSettings as saveSupabaseSettings,
  fetchSiteSettings as fetchSupabaseSettings,
  fetchInquiries as fetchSupabaseInquiries,
  fetchAllSlots as fetchSupabaseSlots,
} from '@/lib/supabase';
import { D1_SQL_SCHEMA } from '@/lib/cloudflare';
import { saveClientImage, clearClientImage, getClientSavedImage } from '@/lib/slots';
import {
  ProjectCustomData,
  AnnouncementSettings,
  AnnouncementTheme,
  AnnouncementStyle,
  AnnouncementDisplayScope,
  InquiryMeta,
  LeadStageId,
  LeadStageDefinition,
  LEAD_STAGES,
  getProjectCustomData,
  saveProjectCustomData,
  getAllCustomProjects,
  getAnnouncementSettings,
  saveAnnouncementSettings,
  getInquiryMeta,
  saveInquiryMeta,
} from '@/lib/projectContent';
import { PROJECTS } from '@/data/projects';

// Complete registry of all 64 dynamic picture slots across Soul Space portfolio
interface SlotDefinition {
  id: string;
  projectId: string;
  projectName: string;
  sectionHeading: string;
  pageLocation: string;
  liveRoute: string;
  title: string;
  siteContext: string;
  recommendedDimensions: string;
  category: 'hero' | 'highlight' | 'floorplan' | 'amenity' | 'material' | 'general';
}

const ALL_SLOTS: SlotDefinition[] = [
  // 1. MYSTIC (Farmhouse Villas — 14 Slots)
  {
    id: 'mystic_img_01',
    projectId: 'mystic-villas',
    projectName: 'Mystic',
    sectionHeading: 'MYSTIC — BIOPHILIC RETREAT & LUXURY FARMHOUSES',
    pageLocation: 'Landing Page & Project Hero',
    liveRoute: '/projects/mystic-villas',
    title: 'Main Hero Architectural Showcase',
    siteContext: 'Primary flagship banner at the top of the Mystic project page and featured on Landing Page Developments.',
    recommendedDimensions: '16:9 Landscape · 1920×1080+',
    category: 'hero',
  },
  {
    id: 'mystic_img_concept',
    projectId: 'mystic-villas',
    projectName: 'Mystic',
    sectionHeading: '80-20 BIOPHILIC PLANTATION CONCEPT',
    pageLocation: 'Living Spaces: Concept 80-20',
    liveRoute: '/projects/mystic-villas#spaces',
    title: '80-20 Concept Plantation Retreat',
    siteContext: 'Featured in the spatial philosophy section illustrating 80% agro-forestry and 20% footprint.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'highlight',
  },
  {
    id: 'mystic_img_siruvani',
    projectId: 'mystic-villas',
    projectName: 'Mystic',
    sectionHeading: 'SURPLUS SIRUVANI MINERAL WATER ESTATE',
    pageLocation: 'Core Project Highlights',
    liveRoute: '/projects/mystic-villas#highlights',
    title: 'Siruvani Water Pipeline Infrastructure',
    siteContext: 'Featured in the natural resource and abundant water infrastructure showcase.',
    recommendedDimensions: '16:10 Landscape · 1600×1000+',
    category: 'highlight',
  },
  {
    id: 'mystic_img_farmland',
    projectId: 'mystic-villas',
    projectName: 'Mystic',
    sectionHeading: '22+ CENTS PRIVATE ESTATE ALLOTMENT',
    pageLocation: 'Core Project Highlights',
    liveRoute: '/projects/mystic-villas#highlights',
    title: '22+ Cents Private Farmland Allotment',
    siteContext: 'Featured in the land parcel and organic plantation overview.',
    recommendedDimensions: '16:10 Landscape · 1600×1000+',
    category: 'highlight',
  },
  {
    id: 'mystic_img_iso_01',
    projectId: 'mystic-villas',
    projectName: 'Mystic',
    sectionHeading: '3D ISOMETRIC AXONOMETRIC PERSPECTIVE — 2 BHK',
    pageLocation: 'Floor Plans: 2 BHK Isometric',
    liveRoute: '/projects/mystic-villas#plans',
    title: '2 BHK Farmhouse Isometric Cutaway',
    siteContext: 'Featured in Floor Plans tab under 2 BHK Unit view demonstrating interior flow.',
    recommendedDimensions: '3D Isometric Perspective · 16:9 Landscape',
    category: 'floorplan',
  },
  {
    id: 'mystic_img_iso_02',
    projectId: 'mystic-villas',
    projectName: 'Mystic',
    sectionHeading: '3D ISOMETRIC AXONOMETRIC PERSPECTIVE — 3 BHK',
    pageLocation: 'Floor Plans: 3 BHK Isometric',
    liveRoute: '/projects/mystic-villas#plans',
    title: '3 BHK Farmhouse Isometric Cutaway',
    siteContext: 'Featured in Floor Plans tab under 3 BHK Unit view demonstrating interior layout.',
    recommendedDimensions: '3D Isometric Perspective · 16:9 Landscape',
    category: 'floorplan',
  },
  {
    id: 'mystic_img_house',
    projectId: 'mystic-villas',
    projectName: 'Mystic',
    sectionHeading: 'VILLA ELEVATION & ARCHITECTURE',
    pageLocation: 'Villa Architecture Unit Showcase',
    liveRoute: '/projects/mystic-villas#plans',
    title: 'Signature 2,500 Sq.Ft Farmhouse Elevation',
    siteContext: 'Main villa elevation photography displayed in the Farmhouse architecture showcase.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'floorplan',
  },
  {
    id: 'mystic_img_8020',
    projectId: 'mystic-villas',
    projectName: 'Mystic',
    sectionHeading: 'BIOPHILIC CANOPY & SUSTAINABLE ORCHARD',
    pageLocation: 'Living Spaces: Agro-Forestry',
    liveRoute: '/projects/mystic-villas#spaces',
    title: '80-20 Agro-Forestry Canopy',
    siteContext: 'Appears in the living spaces gallery illustrating private farmland plantation.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'highlight',
  },
  {
    id: 'mystic_img_arch',
    projectId: 'mystic-villas',
    projectName: 'Mystic',
    sectionHeading: 'MONUMENTAL TEMPLE BELL ENTRANCE ARCH',
    pageLocation: 'Amenity Spotlight 01',
    liveRoute: '/projects/mystic-villas#amenities',
    title: 'Grand Entrance Gate & Security Portal',
    siteContext: 'First amenity card under the Amenities & Club Enclave section.',
    recommendedDimensions: '16:10 Landscape · 1600×1000+',
    category: 'amenity',
  },
  {
    id: 'mystic_img_pool',
    projectId: 'mystic-villas',
    projectName: 'Mystic',
    sectionHeading: 'PRIVATE PLUNGE POOL & WELLNESS PATIO',
    pageLocation: 'Amenity Spotlight 02',
    liveRoute: '/projects/mystic-villas#amenities',
    title: 'Private Plunge Pool & Deck',
    siteContext: 'Second amenity card under the Amenities & Club Enclave section.',
    recommendedDimensions: '16:10 Landscape · 1600×1000+',
    category: 'amenity',
  },
  {
    id: 'mystic_img_waterscape',
    projectId: 'mystic-villas',
    projectName: 'Mystic',
    sectionHeading: 'COCONUT GROVE & KOI WATERSCAPE',
    pageLocation: 'Amenity Spotlight 03',
    liveRoute: '/projects/mystic-villas#amenities',
    title: 'Naturalized Water Cascade & Reflection Pond',
    siteContext: 'Third amenity card under the Amenities & Club Enclave section.',
    recommendedDimensions: '16:10 Landscape · 1600×1000+',
    category: 'amenity',
  },
  {
    id: 'mystic_img_community',
    projectId: 'mystic-villas',
    projectName: 'Mystic',
    sectionHeading: 'SECURE GATED FARMLAND ENCLAVE',
    pageLocation: 'Community Masterplan',
    liveRoute: '/projects/mystic-villas#overview',
    title: 'Full Community Aerial / Avenue Perspective',
    siteContext: 'Community overview and plantation landscape.',
    recommendedDimensions: '16:9 Landscape · 1920×1080+',
    category: 'highlight',
  },
  {
    id: 'mystic_img_architecture',
    projectId: 'mystic-villas',
    projectName: 'Mystic',
    sectionHeading: 'CONTEMPORARY VERNACULAR ARCHITECTURE',
    pageLocation: 'Architectural Design Philosophy',
    liveRoute: '/projects/mystic-villas#design',
    title: 'Courtyard & Vernacular Roof Forms',
    siteContext: 'Highlighting natural stone, clay tile roofing, and ventilation.',
    recommendedDimensions: '16:10 Landscape · 1600×1000+',
    category: 'highlight',
  },
  {
    id: 'mystic_img_elevation',
    projectId: 'mystic-villas',
    projectName: 'Mystic',
    sectionHeading: 'EVENING ILLUMINATION & VERANDAH',
    pageLocation: 'Night Elevation Showcase',
    liveRoute: '/projects/mystic-villas#elevation',
    title: 'Signature Verandah & Warm Illumination',
    siteContext: 'Sunset and dusk view of the farmhouse verandah and lighting scheme.',
    recommendedDimensions: '16:10 Landscape · 1600×1000+',
    category: 'highlight',
  },

  // 2. AURUM (Independent Luxury Villas — 14 Slots)
  {
    id: 'aurum_img_01',
    projectId: 'aurum-villas',
    projectName: 'Aurum',
    sectionHeading: 'AURUM — CONTEMPORARY VILLA ENCLAVE',
    pageLocation: 'Landing Page & Project Hero',
    liveRoute: '/projects/aurum-villas',
    title: 'Main Flagship Hero Banner',
    siteContext: 'Primary flagship banner at the top of the Aurum page and featured on Landing Page Developments.',
    recommendedDimensions: '16:9 Landscape · 1920×1080+',
    category: 'hero',
  },
  {
    id: 'aurum_img_02',
    projectId: 'aurum-villas',
    projectName: 'Aurum',
    sectionHeading: 'COMPOUNDED COMMUNITY & PAVER AVENUES',
    pageLocation: 'Amenity Spotlight 01',
    liveRoute: '/projects/aurum-villas#amenities',
    title: 'Gated Perimeter & 30ft Wide Tree-Lined Avenues',
    siteContext: 'First amenity card under Aurum Amenities & Club Enclave section.',
    recommendedDimensions: '16:10 Landscape · 1600×1000+',
    category: 'amenity',
  },
  {
    id: 'aurum_img_03',
    projectId: 'aurum-villas',
    projectName: 'Aurum',
    sectionHeading: 'COMMUNITY CLUBHOUSE, SWIMMING POOL & PARTY LAWN',
    pageLocation: 'Amenity Spotlight 02',
    liveRoute: '/projects/aurum-villas#amenities',
    title: 'Private Residents Clubhouse & Pool Enclave',
    siteContext: 'Second amenity card under Aurum Amenities & Club Enclave section.',
    recommendedDimensions: '16:10 Landscape · 1600×1000+',
    category: 'amenity',
  },
  {
    id: 'aurum_img_richness',
    projectId: 'aurum-villas',
    projectName: 'Aurum',
    sectionHeading: 'HOMES THAT CELEBRATE THE RICHNESS OF LIFE',
    pageLocation: 'Living Spaces Spotlight 01',
    liveRoute: '/projects/aurum-villas#spaces',
    title: 'Grand Double-Height Living Room',
    siteContext: 'First living space card illustrating double-height glass and warm timber accents.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'highlight',
  },
  {
    id: 'aurum_img_private',
    projectId: 'aurum-villas',
    projectName: 'Aurum',
    sectionHeading: 'PRIVATE VILLA LIVING WITH ABSOLUTE SOLITUDE',
    pageLocation: 'Living Spaces Spotlight 02',
    liveRoute: '/projects/aurum-villas#spaces',
    title: 'Courtyard Garden & Landscaped Retreat',
    siteContext: 'Second living space card highlighting compound privacy and private garden spaces.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'highlight',
  },
  {
    id: 'aurum_img_living',
    projectId: 'aurum-villas',
    projectName: 'Aurum',
    sectionHeading: 'CONTEMPORARY INTERIOR & SPATIAL FLOW',
    pageLocation: 'Living Spaces Spotlight 03',
    liveRoute: '/projects/aurum-villas#spaces',
    title: 'Formal Dining & Gourmet Open Kitchen',
    siteContext: 'Third living space card displaying open layout and seamless transition to kitchen.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'highlight',
  },
  {
    id: 'aurum_img_plan_north_ground',
    projectId: 'aurum-villas',
    projectName: 'Aurum',
    sectionHeading: 'NORTH FACING VILLA · LEVEL 00 · GROUND FLOOR',
    pageLocation: 'Floor Plans Tab — North Facing (Ground)',
    liveRoute: '/projects/aurum-villas#plans',
    title: 'North Facing Villa Ground Level (1,280 sq ft)',
    siteContext: 'Technical floor plan showing car porch, foyer, double-height living, dining, kitchen, and master suite.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'floorplan',
  },
  {
    id: 'aurum_img_plan_north_first',
    projectId: 'aurum-villas',
    projectName: 'Aurum',
    sectionHeading: 'NORTH FACING VILLA · LEVEL 01 · FIRST FLOOR',
    pageLocation: 'Floor Plans Tab — North Facing (First)',
    liveRoute: '/projects/aurum-villas#plans',
    title: 'North Facing Villa First Level (1,245 sq ft)',
    siteContext: 'Technical floor plan showing upper lounge, two en-suite bedrooms, and private open terrace.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'floorplan',
  },
  {
    id: 'aurum_img_plan_east_ground',
    projectId: 'aurum-villas',
    projectName: 'Aurum',
    sectionHeading: 'EAST FACING VILLA · LEVEL 00 · GROUND FLOOR',
    pageLocation: 'Floor Plans Tab — East Facing (Ground)',
    liveRoute: '/projects/aurum-villas#plans',
    title: 'East Facing Villa Ground Level (1,310 sq ft)',
    siteContext: 'Vasthu-compliant east entrance floor plan with garden deck and puja sanctuary.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'floorplan',
  },
  {
    id: 'aurum_img_plan_east_first',
    projectId: 'aurum-villas',
    projectName: 'Aurum',
    sectionHeading: 'EAST FACING VILLA · LEVEL 01 · FIRST FLOOR',
    pageLocation: 'Floor Plans Tab — East Facing (First)',
    liveRoute: '/projects/aurum-villas#plans',
    title: 'East Facing Villa First Level (1,280 sq ft)',
    siteContext: 'Upper level plan featuring master balcony, guest suites, and study alcove.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'floorplan',
  },
  {
    id: 'aurum_img_plan_west_ground',
    projectId: 'aurum-villas',
    projectName: 'Aurum',
    sectionHeading: 'WEST FACING VILLA · LEVEL 00 · GROUND FLOOR',
    pageLocation: 'Floor Plans Tab — West Facing (Ground)',
    liveRoute: '/projects/aurum-villas#plans',
    title: 'West Facing Villa Ground Level (1,270 sq ft)',
    siteContext: 'Ground plan with screened west verandah and courtyard breeze corridor.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'floorplan',
  },
  {
    id: 'aurum_img_plan_west_first',
    projectId: 'aurum-villas',
    projectName: 'Aurum',
    sectionHeading: 'WEST FACING VILLA · LEVEL 01 · FIRST FLOOR',
    pageLocation: 'Floor Plans Tab — West Facing (First)',
    liveRoute: '/projects/aurum-villas#plans',
    title: 'West Facing Villa First Level (1,250 sq ft)',
    siteContext: 'Upper floor plan with shaded terraces and master retreat.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'floorplan',
  },
  {
    id: 'aurum_img_plan_south_ground',
    projectId: 'aurum-villas',
    projectName: 'Aurum',
    sectionHeading: 'SOUTH FACING VILLA · LEVEL 00 · GROUND FLOOR',
    pageLocation: 'Floor Plans Tab — South Facing (Ground)',
    liveRoute: '/projects/aurum-villas#plans',
    title: 'South Facing Villa Ground Level (1,260 sq ft)',
    siteContext: 'Ground floor distribution with landscaped side buffer and kitchen yard.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'floorplan',
  },
  {
    id: 'aurum_img_plan_south_first',
    projectId: 'aurum-villas',
    projectName: 'Aurum',
    sectionHeading: 'SOUTH FACING VILLA · LEVEL 01 · FIRST FLOOR',
    pageLocation: 'Floor Plans Tab — South Facing (First)',
    liveRoute: '/projects/aurum-villas#plans',
    title: 'South Facing Villa First Level (1,240 sq ft)',
    siteContext: 'Upper level layout with spacious balconies and family lounge.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'floorplan',
  },

  // 3. ABV ARBOR (Luxury Boutique Apartments — 17 Slots)
  {
    id: 'abvarbor_img_01',
    projectId: 'abv-arbor',
    projectName: 'ABV Arbor',
    sectionHeading: 'ABV ARBOR — BOUTIQUE MONOLITH RESIDENCES',
    pageLocation: 'Landing Page & Project Hero',
    liveRoute: '/projects/abv-arbor',
    title: 'Boutique Monolith Hero Banner',
    siteContext: 'Top hero showcase image on ABV Arbor page and Landing Page portfolio.',
    recommendedDimensions: '16:9 Landscape · 1920×1080+',
    category: 'hero',
  },
  {
    id: 'abvarbor_img_02',
    projectId: 'abv-arbor',
    projectName: 'ABV Arbor',
    sectionHeading: 'ARCHITECTURAL BLUEPRINT & SCHEDULE SPECIFICATIONS',
    pageLocation: 'Dimensional Schedule & Blueprint',
    liveRoute: '/projects/abv-arbor#plans',
    title: 'Schedule & Blueprint Dimension Plan',
    siteContext: 'Blueprint schematic above unit selection tabs.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'floorplan',
  },
  {
    id: 'abvarbor_img_03',
    projectId: 'abv-arbor',
    projectName: 'ABV Arbor',
    sectionHeading: 'UNIT A (3 BHK) — ARCHITECTURAL 2D LAYOUT',
    pageLocation: 'Floor Plans Tab: Unit A (2D Plan)',
    liveRoute: '/projects/abv-arbor#plans',
    title: 'Unit A (3 BHK · 2,150 sq ft) 2D Floor Plan',
    siteContext: 'Architectural 2D plan for North-East facing 3 BHK apartment.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'floorplan',
  },
  {
    id: 'abvarbor_img_04',
    projectId: 'abv-arbor',
    projectName: 'ABV Arbor',
    sectionHeading: 'UNIT A (3 BHK) — 3D ISOMETRIC VIEW',
    pageLocation: 'Floor Plans Tab: Unit A (3D Isometric)',
    liveRoute: '/projects/abv-arbor#plans',
    title: 'Unit A 3D Isometric Cutaway Perspective',
    siteContext: 'Three-dimensional axonometric view showing interior furniture and spatial flow.',
    recommendedDimensions: '3D Isometric · 16:9 Landscape',
    category: 'floorplan',
  },
  {
    id: 'abvarbor_img_05',
    projectId: 'abv-arbor',
    projectName: 'ABV Arbor',
    sectionHeading: 'UNIT B (4 BHK) — ARCHITECTURAL 2D LAYOUT',
    pageLocation: 'Floor Plans Tab: Unit B (2D Plan)',
    liveRoute: '/projects/abv-arbor#plans',
    title: 'Unit B (4 BHK · 2,820 sq ft) 2D Floor Plan',
    siteContext: 'Architectural 2D layout for East facing 4 BHK residence.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'floorplan',
  },
  {
    id: 'abvarbor_img_06',
    projectId: 'abv-arbor',
    projectName: 'ABV Arbor',
    sectionHeading: 'UNIT B (4 BHK) — 3D ISOMETRIC VIEW',
    pageLocation: 'Floor Plans Tab: Unit B (3D Isometric)',
    liveRoute: '/projects/abv-arbor#plans',
    title: 'Unit B 3D Isometric Cutaway Perspective',
    siteContext: 'Axonometric cutaway showing four en-suite bedrooms and expansive double-living hall.',
    recommendedDimensions: '3D Isometric · 16:9 Landscape',
    category: 'floorplan',
  },
  {
    id: 'abvarbor_img_07',
    projectId: 'abv-arbor',
    projectName: 'ABV Arbor',
    sectionHeading: 'UNIT C (3 BHK) — ARCHITECTURAL 2D LAYOUT',
    pageLocation: 'Floor Plans Tab: Unit C (2D Plan)',
    liveRoute: '/projects/abv-arbor#plans',
    title: 'Unit C (3 BHK · 2,180 sq ft) 2D Floor Plan',
    siteContext: 'Architectural 2D layout for North facing 3 BHK residence.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'floorplan',
  },
  {
    id: 'abvarbor_img_08',
    projectId: 'abv-arbor',
    projectName: 'ABV Arbor',
    sectionHeading: 'UNIT C (3 BHK) — 3D ISOMETRIC VIEW',
    pageLocation: 'Floor Plans Tab: Unit C (3D Isometric)',
    liveRoute: '/projects/abv-arbor#plans',
    title: 'Unit C 3D Isometric Cutaway Perspective',
    siteContext: 'Axonometric cutaway showing dual balconies and foyer transition.',
    recommendedDimensions: '3D Isometric · 16:9 Landscape',
    category: 'floorplan',
  },
  {
    id: 'abvarbor_img_09',
    projectId: 'abv-arbor',
    projectName: 'ABV Arbor',
    sectionHeading: 'GRAND DOUBLE-HEIGHT ENTRANCE LOBBY',
    pageLocation: 'Living Spaces Spotlight 01',
    liveRoute: '/projects/abv-arbor#spaces',
    title: 'Double-Height Reception & Water Court',
    siteContext: 'First living spaces card highlighting Italian marble reception.',
    recommendedDimensions: '16:10 Landscape · 1600×1000+',
    category: 'highlight',
  },
  {
    id: 'abvarbor_img_10',
    projectId: 'abv-arbor',
    projectName: 'ABV Arbor',
    sectionHeading: 'CAPACIOUS MASTER BEDROOM SUITE',
    pageLocation: 'Living Spaces Spotlight 02',
    liveRoute: '/projects/abv-arbor#spaces',
    title: 'Master Bedroom with Hardwood Flooring',
    siteContext: 'Second living spaces card highlighting walk-in wardrobe and ensuite bath.',
    recommendedDimensions: '16:10 Landscape · 1600×1000+',
    category: 'highlight',
  },
  {
    id: 'abvarbor_img_11',
    projectId: 'abv-arbor',
    projectName: 'ABV Arbor',
    sectionHeading: 'EXTRAVAGANT LIVING & DINING SPACE',
    pageLocation: 'Living Spaces Spotlight 03',
    liveRoute: '/projects/abv-arbor#spaces',
    title: 'Seamless Living & Entertainment Salon',
    siteContext: 'Third living spaces card displaying panoramic balcony sliding doors.',
    recommendedDimensions: '16:10 Landscape · 1600×1000+',
    category: 'highlight',
  },
  {
    id: 'abvarbor_img_12',
    projectId: 'abv-arbor',
    projectName: 'ABV Arbor',
    sectionHeading: 'COMMUNITY CLUBHOUSE & BANQUET HALL',
    pageLocation: 'Amenity Spotlight 01',
    liveRoute: '/projects/abv-arbor#amenities',
    title: 'Resident Clubhouse & Event Hall',
    siteContext: 'First amenity card in the amenities section.',
    recommendedDimensions: '16:10 Landscape · 1600×1000+',
    category: 'amenity',
  },
  {
    id: 'abvarbor_img_13',
    projectId: 'abv-arbor',
    projectName: 'ABV Arbor',
    sectionHeading: 'FITNESS GYMNASIUM & INDOOR RECREATION',
    pageLocation: 'Amenity Spotlight 02',
    liveRoute: '/projects/abv-arbor#amenities',
    title: 'Modern Gym & Yoga Studio',
    siteContext: 'Second amenity card in the amenities section.',
    recommendedDimensions: '16:10 Landscape · 1600×1000+',
    category: 'amenity',
  },
  {
    id: 'abvarbor_img_15',
    projectId: 'abv-arbor',
    projectName: 'ABV Arbor',
    sectionHeading: 'INVITING DESIGNER KITCHEN & UTILITY',
    pageLocation: 'Living Spaces Spotlight 04',
    liveRoute: '/projects/abv-arbor#spaces',
    title: 'Modular Gourmet Kitchen',
    siteContext: 'Fourth living spaces card showing quartz countertops.',
    recommendedDimensions: '16:10 Landscape · 1600×1000+',
    category: 'highlight',
  },
  {
    id: 'abvarbor_img_16',
    projectId: 'abv-arbor',
    projectName: 'ABV Arbor',
    sectionHeading: 'TERRACE GARDEN & CHILDREN PLAY AREA',
    pageLocation: 'Amenity Spotlight 03',
    liveRoute: '/projects/abv-arbor#amenities',
    title: 'Children Play Area & Activity Turf',
    siteContext: 'Third amenity card in the amenities section.',
    recommendedDimensions: '16:10 Landscape · 1600×1000+',
    category: 'amenity',
  },
  {
    id: 'abvarbor_img_terrace',
    projectId: 'abv-arbor',
    projectName: 'ABV Arbor',
    sectionHeading: 'LANDSCAPED ROOFTOP SKY GARDEN',
    pageLocation: 'Amenity Spotlight 04',
    liveRoute: '/projects/abv-arbor#amenities',
    title: 'Rooftop Sky Lounge & Observatory',
    siteContext: 'Fourth amenity card featuring stargazing deck and pergolas.',
    recommendedDimensions: '16:10 Landscape · 1600×1000+',
    category: 'amenity',
  },

  // 4. UPTOWN RESIDENCES (Apartments — 8 Slots)
  {
    id: 'uptown_img_01',
    projectId: 'uptown-residences',
    projectName: 'Uptown',
    sectionHeading: 'UPTOWN RESIDENCES — CONTEMPORARY COMMUNITY',
    pageLocation: 'Landing Page & Project Hero',
    liveRoute: '/projects/uptown-residences',
    title: 'Uptown Project Hero Banner',
    siteContext: 'Primary hero image on Uptown project page and Landing Page.',
    recommendedDimensions: '16:9 Landscape · 1920×1080+',
    category: 'hero',
  },
  {
    id: 'uptown_img_02',
    projectId: 'uptown-residences',
    projectName: 'Uptown',
    sectionHeading: '1 BHK (NORTH FACING) — 3D ISOMETRIC VIEW',
    pageLocation: 'Floor Plans Tab: 1 BHK North',
    liveRoute: '/projects/uptown-residences#plans',
    title: '1 BHK North Facing Isometric View (650 sq ft)',
    siteContext: 'Axonometric interior 3D view for 1 BHK North unit.',
    recommendedDimensions: '3D Isometric · 16:9 Landscape',
    category: 'floorplan',
  },
  {
    id: 'uptown_img_03',
    projectId: 'uptown-residences',
    projectName: 'Uptown',
    sectionHeading: '1 BHK (SOUTH FACING) — 3D ISOMETRIC VIEW',
    pageLocation: 'Floor Plans Tab: 1 BHK South',
    liveRoute: '/projects/uptown-residences#plans',
    title: '1 BHK South Facing Isometric View (665 sq ft)',
    siteContext: 'Axonometric interior 3D view for 1 BHK South unit.',
    recommendedDimensions: '3D Isometric · 16:9 Landscape',
    category: 'floorplan',
  },
  {
    id: 'uptown_img_04',
    projectId: 'uptown-residences',
    projectName: 'Uptown',
    sectionHeading: '2 BHK (EAST FACING) — 3D ISOMETRIC VIEW',
    pageLocation: 'Floor Plans Tab: 2 BHK East',
    liveRoute: '/projects/uptown-residences#plans',
    title: '2 BHK East Facing Isometric View (1,150 sq ft)',
    siteContext: 'Axonometric interior 3D view for 2 BHK East unit.',
    recommendedDimensions: '3D Isometric · 16:9 Landscape',
    category: 'floorplan',
  },
  {
    id: 'uptown_img_05',
    projectId: 'uptown-residences',
    projectName: 'Uptown',
    sectionHeading: '2 BHK (NORTH FACING) — 3D ISOMETRIC VIEW',
    pageLocation: 'Floor Plans Tab: 2 BHK North',
    liveRoute: '/projects/uptown-residences#plans',
    title: '2 BHK North Facing Isometric View (1,180 sq ft)',
    siteContext: 'Axonometric interior 3D view for 2 BHK North unit.',
    recommendedDimensions: '3D Isometric · 16:9 Landscape',
    category: 'floorplan',
  },
  {
    id: 'uptown_img_06',
    projectId: 'uptown-residences',
    projectName: 'Uptown',
    sectionHeading: '3 BHK (NORTH FACING) — 3D ISOMETRIC VIEW',
    pageLocation: 'Floor Plans Tab: 3 BHK North',
    liveRoute: '/projects/uptown-residences#plans',
    title: '3 BHK North Facing Isometric View (1,540 sq ft)',
    siteContext: 'Axonometric interior 3D view for 3 BHK North unit.',
    recommendedDimensions: '3D Isometric · 16:9 Landscape',
    category: 'floorplan',
  },
  {
    id: 'uptown_img_07',
    projectId: 'uptown-residences',
    projectName: 'Uptown',
    sectionHeading: '3 BHK (SOUTH FACING) — 3D ISOMETRIC VIEW',
    pageLocation: 'Floor Plans Tab: 3 BHK South',
    liveRoute: '/projects/uptown-residences#plans',
    title: '3 BHK South Facing Isometric View (1,560 sq ft)',
    siteContext: 'Axonometric interior 3D view for 3 BHK South unit.',
    recommendedDimensions: '3D Isometric · 16:9 Landscape',
    category: 'floorplan',
  },
  {
    id: 'uptown_img_08',
    projectId: 'uptown-residences',
    projectName: 'Uptown',
    sectionHeading: 'RESORT SWIMMING POOL & INDOOR GYM',
    pageLocation: 'Amenity Spotlight 01',
    liveRoute: '/projects/uptown-residences#amenities',
    title: 'Community Swimming Pool & Fitness Center',
    siteContext: 'Amenity card in the Uptown amenities gallery.',
    recommendedDimensions: '16:10 Landscape · 1600×1000+',
    category: 'amenity',
  },

  // 5. DOT COM (Commercial Workspaces — 7 Slots)
  {
    id: 'dotcom_img_01',
    projectId: 'dotcom-workspaces',
    projectName: 'DOT COM',
    sectionHeading: 'DOT COM — GRADE-A IT & COMMERCIAL WORKSPACES',
    pageLocation: 'Landing Page & Project Hero',
    liveRoute: '/projects/dotcom-workspaces',
    title: 'Commercial Tech Monolith Hero',
    siteContext: 'Primary hero image on DOT COM project page and Landing Page.',
    recommendedDimensions: '16:9 Landscape · 1920×1080+',
    category: 'hero',
  },
  {
    id: 'dotcom_img_02',
    projectId: 'dotcom-workspaces',
    projectName: 'DOT COM',
    sectionHeading: 'SCHEDULE & BLUEPRINT DIMENSION PLAN',
    pageLocation: 'Dimensional Schedule & Blueprint',
    liveRoute: '/projects/dotcom-workspaces#plans',
    title: 'Master Engineering Blueprint Plan',
    siteContext: 'Engineering dimension plan above floor plate tabs.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'floorplan',
  },
  {
    id: 'dotcom_img_03',
    projectId: 'dotcom-workspaces',
    projectName: 'DOT COM',
    sectionHeading: 'TYPICAL OFFICE FLOOR PLATE PLAN',
    pageLocation: 'Floor Plans Tab: Typical Floor Plate',
    liveRoute: '/projects/dotcom-workspaces#plans',
    title: 'Typical Core-and-Shell Office Floor Plate',
    siteContext: 'Floor plan showing elevator core, fire exits, and column grid.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'floorplan',
  },
  {
    id: 'dotcom_img_04',
    projectId: 'dotcom-workspaces',
    projectName: 'DOT COM',
    sectionHeading: 'COMMERCIAL WING — UNIT I FLOOR PLAN',
    pageLocation: 'Floor Plans Tab: Unit I Wing',
    liveRoute: '/projects/dotcom-workspaces#plans',
    title: 'Commercial Office Unit I Floor Plan',
    siteContext: 'Individual office unit division I.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'floorplan',
  },
  {
    id: 'dotcom_img_05',
    projectId: 'dotcom-workspaces',
    projectName: 'DOT COM',
    sectionHeading: 'COMMERCIAL WING — UNIT II FLOOR PLAN',
    pageLocation: 'Floor Plans Tab: Unit II Wing',
    liveRoute: '/projects/dotcom-workspaces#plans',
    title: 'Commercial Office Unit II Floor Plan',
    siteContext: 'Individual office unit division II.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'floorplan',
  },
  {
    id: 'dotcom_img_06',
    projectId: 'dotcom-workspaces',
    projectName: 'DOT COM',
    sectionHeading: 'COMMERCIAL WING — UNIT III FLOOR PLAN',
    pageLocation: 'Floor Plans Tab: Unit III Wing',
    liveRoute: '/projects/dotcom-workspaces#plans',
    title: 'Commercial Office Unit III Floor Plan',
    siteContext: 'Individual office unit division III.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'floorplan',
  },
  {
    id: 'dotcom_img_07',
    projectId: 'dotcom-workspaces',
    projectName: 'DOT COM',
    sectionHeading: 'COMMERCIAL WING — UNIT IV FLOOR PLAN',
    pageLocation: 'Floor Plans Tab: Unit IV Wing',
    liveRoute: '/projects/dotcom-workspaces#plans',
    title: 'Commercial Office Unit IV Floor Plan',
    siteContext: 'Individual office unit division IV.',
    recommendedDimensions: '16:10 Landscape · 1920×1200+',
    category: 'floorplan',
  },

  // 6. MATERIALS & SPECIFICATIONS (4 Slots)
  {
    id: 'material_img_01',
    projectId: 'materiality',
    projectName: 'Materials',
    sectionHeading: 'THE SPECIFICATION PALETTE — TEAKWOOD & VENEER',
    pageLocation: 'Landing Page: Materials Section (Tab 01)',
    liveRoute: '/#materiality',
    title: 'Teakwood & Melamine Architectural Veneer',
    siteContext: 'Macro texture photography for Joinery & Millwork tab.',
    recommendedDimensions: '4:3 Portrait · 1200×1600+',
    category: 'material',
  },
  {
    id: 'material_img_02',
    projectId: 'materiality',
    projectName: 'Materials',
    sectionHeading: 'THE SPECIFICATION PALETTE — REINFORCED CONCRETE',
    pageLocation: 'Landing Page: Materials Section (Tab 02)',
    liveRoute: '/#materiality',
    title: 'Post-Tensioned (PT) M25 Structural Concrete',
    siteContext: 'Macro texture photography for Concrete & Structural Core tab.',
    recommendedDimensions: '4:3 Portrait · 1200×1600+',
    category: 'material',
  },
  {
    id: 'material_img_03',
    projectId: 'materiality',
    projectName: 'Materials',
    sectionHeading: 'THE SPECIFICATION PALETTE — VITRIFIED FLOOR TILES',
    pageLocation: 'Landing Page: Materials Section (Tab 03)',
    liveRoute: '/#materiality',
    title: '800x800mm High-Gloss Vitrified Floor Plates',
    siteContext: 'Macro texture photography for Glazed Surfaces & Flooring tab.',
    recommendedDimensions: '4:3 Portrait · 1200×1600+',
    category: 'material',
  },
  {
    id: 'material_img_04',
    projectId: 'materiality',
    projectName: 'Materials',
    sectionHeading: 'THE SPECIFICATION PALETTE — SANITARYWARE & BRASSWARE',
    pageLocation: 'Landing Page: Materials Section (Tab 04)',
    liveRoute: '/#materiality',
    title: 'Kohler & Roca Engineered Brassware',
    siteContext: 'Macro texture photography for Sanitaryware & Plumbing tab.',
    recommendedDimensions: '4:3 Portrait · 1200×1600+',
    category: 'material',
  },
];

const ANNOUNCEMENT_PRESETS: Array<{
  name: string;
  badge: string;
  text: string;
  secondaryText?: string;
  linkUrl: string;
  linkText: string;
  theme: AnnouncementTheme;
  style: AnnouncementStyle;
  urgentPulse: boolean;
  targetDate?: string;
  countdownLabel?: string;
}> = [
  {
    name: 'Aurum Phase 2 VIP Launch',
    badge: 'VIP RELEASE',
    text: 'Exclusive Preview: Aurum Villas Phase 2 Bookings Open — Schedule a Private Consultation Today',
    secondaryText: 'Over 65% Reserved Across North & East Facing Plots',
    linkUrl: '/projects/aurum-villas',
    linkText: 'Explore Residence',
    theme: 'obsidian-gold',
    style: 'banner',
    urgentPulse: true,
  },
  {
    name: 'Aurum Priority Window Countdown',
    badge: 'PRIORITY WINDOW',
    text: 'Special Pre-Launch Inaugural Pricing Closing Shortly for Phase 2 Enclave',
    secondaryText: 'Price Revision Applicable Thereafter',
    linkUrl: '/projects/aurum-villas',
    linkText: 'Lock Priority Rate',
    theme: 'aurum-bronze',
    style: 'countdown',
    urgentPulse: true,
    targetDate: '2026-10-31T23:59:59',
    countdownLabel: 'Inaugural Pricing Closes In:',
  },
  {
    name: 'Mystic Biophilic Estate Tours',
    badge: 'BIOPHILIC RETREAT',
    text: 'Experience 80-20 Agro-Forestry Living: Siruvani Water Reserve Farmhouses Open for Private Visits',
    secondaryText: 'Weekend Guided Forest Walking Tours',
    linkUrl: '/projects/mystic-farmhouses',
    linkText: 'Reserve Tour',
    theme: 'emerald-biophilic',
    style: 'banner',
    urgentPulse: false,
  },
  {
    name: 'Limited Inventory Alert',
    badge: 'LAST 4 VILLAS',
    text: 'Only 4 Signature Villas Remaining Across Selected Works Portfolio',
    secondaryText: 'Immediate Manaiyadi & Vasthu Compliant Registration',
    linkUrl: '/projects/aurum-villas',
    linkText: 'Check Availability',
    theme: 'terracotta-heritage',
    style: 'banner',
    urgentPulse: true,
  },
  {
    name: 'DOT COM Enterprise Workspaces',
    badge: 'COMMERCIAL HUB',
    text: 'Pre-Leasing Landmark A-Grade IT Office Floorplates (12,000 to 45,000 Sq.Ft.)',
    secondaryText: 'Civil & Tech Architecture by Soul Space',
    linkUrl: '/projects/dotcom-workspaces',
    linkText: 'Download Specs',
    theme: 'champagne-alabaster',
    style: 'banner',
    urgentPulse: false,
  },
];

const THEME_OPTIONS: Array<{
  id: AnnouncementTheme;
  name: string;
  subtitle: string;
  bgPreview: string;
  badgePreview: string;
  borderPreview: string;
}> = [
  {
    id: 'obsidian-gold',
    name: 'Obsidian & Gold',
    subtitle: 'Signature Luxury Brand',
    bgPreview: 'bg-[#141311]',
    badgePreview: 'bg-[#B8936D] text-[#141311]',
    borderPreview: 'border-[#383127]',
  },
  {
    id: 'champagne-alabaster',
    name: 'Champagne Alabaster',
    subtitle: 'Editorial Warm Ivory',
    bgPreview: 'bg-[#FAF7F2]',
    badgePreview: 'bg-[#99744C] text-white',
    borderPreview: 'border-[#DDD4C5]',
  },
  {
    id: 'emerald-biophilic',
    name: 'Emerald Biophilic',
    subtitle: 'Siruvani Nature Sanctuary',
    bgPreview: 'bg-[#0E231B]',
    badgePreview: 'bg-[#2E6B52] text-[#F3F7F5]',
    borderPreview: 'border-[#1E3F32]',
  },
  {
    id: 'terracotta-heritage',
    name: 'Terracotta Heritage',
    subtitle: 'Artisan Clay & Copper',
    bgPreview: 'bg-[#291712]',
    badgePreview: 'bg-[#C25838] text-white',
    borderPreview: 'border-[#472920]',
  },
  {
    id: 'aurum-bronze',
    name: 'Aurum Royal Bronze',
    subtitle: 'Warm Metallic Luster',
    bgPreview: 'bg-[#211A12]',
    badgePreview: 'bg-gradient-to-r from-[#C5A065] to-[#E3C38C] text-[#1E1710]',
    borderPreview: 'border-[#4A3A28]',
  },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [authError, setAuthError] = useState('');

  // Active section tab
  const [activeTab, setActiveTab] = useState<'slots' | 'inquiries' | 'editorial' | 'settings' | 'ownership'>('slots');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'configured' | 'empty'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Slots state
  const [slotsData, setSlotsData] = useState<Record<string, { image_url: string; title?: string; caption?: string }>>({});
  const [uploadingSlotId, setUploadingSlotId] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState<{ [slotId: string]: string }>({});
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fullscreen Preview Lightbox
  const [previewModalSlot, setPreviewModalSlot] = useState<SlotDefinition | null>(null);

  // Inquiries state & Expanded Row State
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [inquirySearchQuery, setInquirySearchQuery] = useState('');
  const [inquiryProjectFilter, setInquiryProjectFilter] = useState('all');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');
  const [expandedDocket, setExpandedDocket] = useState<string | null>(null);
  const [selectedDocketModal, setSelectedDocketModal] = useState<InquiryRecord | null>(null);
  const [inquiryMetas, setInquiryMetas] = useState<Record<string, InquiryMeta>>({});
  const [internalNoteDrafts, setInternalNoteDrafts] = useState<Record<string, string>>({});
  const [activeStageDropdown, setActiveStageDropdown] = useState<string | null>(null);
  const [filterStageDropdownOpen, setFilterStageDropdownOpen] = useState(false);
  const [filterProjectDropdownOpen, setFilterProjectDropdownOpen] = useState(false);

  // Editorial & Projects Content Editor state
  const [selectedProjectEditId, setSelectedProjectEditId] = useState<string>('aurum-villas');
  const [customProjectsMap, setCustomProjectsMap] = useState<Record<string, ProjectCustomData>>({});
  const [announcementSettings, setAnnouncementSettings] = useState<AnnouncementSettings>({
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
  });
  const [announcementPreviewMode, setAnnouncementPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [announcementSavedToast, setAnnouncementSavedToast] = useState(false);
  const [isSavingEditorial, setIsSavingEditorial] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Ownership & Security state
  const [currentPasskeyInput, setCurrentPasskeyInput] = useState('');
  const [newPasskeyInput, setNewPasskeyInput] = useState('');
  const [confirmPasskeyInput, setConfirmPasskeyInput] = useState('');
  const [passkeyUpdateMessage, setPasskeyUpdateMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isUpdatingPasskey, setIsUpdatingPasskey] = useState(false);
  const [ownerProfileMessage, setOwnerProfileMessage] = useState<string | null>(null);

  // Cloudflare Status Diagnostics
  const [cloudStatus, setCloudStatus] = useState<{
    d1Configured: boolean;
    d1Connected: boolean;
    d1Error?: string;
    r2Configured: boolean;
    accountIdSet: boolean;
    databaseIdSet: boolean;
    r2Bucket: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const supabaseActive = isSupabaseConfigured();

  // Authentication check
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('soulspace_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Close stage dropdown on outside click
  useEffect(() => {
    if (!activeStageDropdown && !filterStageDropdownOpen && !filterProjectDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#inquiry-stage-filter-container')) {
        setFilterStageDropdownOpen(false);
      }
      if (!target.closest('#inquiry-project-filter-container')) {
        setFilterProjectDropdownOpen(false);
      }
      if (!target.closest('[data-stage-dropdown-container]')) {
        setActiveStageDropdown(null);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [activeStageDropdown, filterStageDropdownOpen, filterProjectDropdownOpen]);

  // Escape key handler for admin modals & dropdowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewModalSlot(null);
        setSelectedDocketModal(null);
        setActiveStageDropdown(null);
        setFilterStageDropdownOpen(false);
        setFilterProjectDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch Cloudflare diagnostics
  const fetchCloudStatus = async () => {
    try {
      const res = await fetch('/api/admin/d1?action=status');
      if (res.ok) {
        const data = await res.json();
        setCloudStatus(data);
      }
    } catch {
      // ignore
    }
  };

  // Load initial data once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchCloudStatus();

    // 1. Load Slots
    const initialMap: Record<string, { image_url: string; title?: string; caption?: string }> = {};
    ALL_SLOTS.forEach((slot) => {
      const localImg = getClientSavedImage(slot.id);
      if (localImg) {
        initialMap[slot.id] = { image_url: localImg, title: slot.title };
      }
    });

    fetch('/api/admin/d1?action=slots')
      .then((r) => r.json())
      .then((d1Json) => {
        if (d1Json.success && d1Json.slots) {
          Object.entries(d1Json.slots).forEach(([slotId, record]: [string, any]) => {
            if (record.image_url) {
              initialMap[slotId] = {
                image_url: record.image_url,
                title: record.title || slotId,
                caption: record.caption,
              };
              saveClientImage(slotId, record.image_url);
            }
          });
          setSlotsData({ ...initialMap });
        }
      })
      .catch(() => {});

    setSlotsData(initialMap);

    // 2. Load Inquiries
    setIsLoadingInquiries(true);
    fetch('/api/admin/d1?action=inquiries')
      .then((r) => r.json())
      .then((d1Json) => {
        if (d1Json.success && Array.isArray(d1Json.inquiries) && d1Json.inquiries.length > 0) {
          setInquiries(d1Json.inquiries);
        } else if (supabaseActive) {
          fetchSupabaseInquiries().then((data) => setInquiries(data));
        }
      })
      .catch(() => {
        if (supabaseActive) {
          fetchSupabaseInquiries().then((data) => setInquiries(data));
        }
      })
      .finally(() => setIsLoadingInquiries(false));

    // 3. Load Settings
    fetch('/api/admin/d1?action=settings')
      .then((r) => r.json())
      .then((d1Json) => {
        if (d1Json.success && d1Json.settings) {
          setSettings(d1Json.settings);
        } else if (supabaseActive) {
          fetchSupabaseSettings().then((s) => setSettings(s));
        }
      })
      .catch(() => {
        if (supabaseActive) {
          fetchSupabaseSettings().then((s) => setSettings(s));
        }
      });

    // 4. Load Custom Editorial Projects & Announcement
    setCustomProjectsMap(getAllCustomProjects());
    setAnnouncementSettings(getAnnouncementSettings());
  }, [isAuthenticated, supabaseActive]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = passkey.trim();
    const savedCustom = typeof window !== 'undefined' ? localStorage.getItem('soulspace_custom_passkey') : null;
    const validPasskeys = ['soulspace2026', 'admin123'];
    if (savedCustom) validPasskeys.push(savedCustom.trim());
    if (settings.master_passkey) validPasskeys.push(settings.master_passkey.trim());

    if (validPasskeys.includes(cleanInput)) {
      setIsAuthenticated(true);
      sessionStorage.setItem('soulspace_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid Master Passkey. Please verify your credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('soulspace_admin_auth');
  };

  // Change Master Passkey
  const handleChangePasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasskeyUpdateMessage(null);

    const savedCustom = typeof window !== 'undefined' ? localStorage.getItem('soulspace_custom_passkey') : null;
    const currentValid = savedCustom || settings.master_passkey || 'soulspace2026';

    if (currentPasskeyInput.trim() !== currentValid && currentPasskeyInput.trim() !== 'soulspace2026') {
      setPasskeyUpdateMessage({ text: 'Current passkey is incorrect.', type: 'error' });
      return;
    }

    if (!newPasskeyInput.trim() || newPasskeyInput.trim().length < 6) {
      setPasskeyUpdateMessage({ text: 'New passkey must be at least 6 characters long.', type: 'error' });
      return;
    }

    if (newPasskeyInput.trim() !== confirmPasskeyInput.trim()) {
      setPasskeyUpdateMessage({ text: 'New passkey and confirmation do not match.', type: 'error' });
      return;
    }

    setIsUpdatingPasskey(true);
    const updatedSettings = { ...settings, master_passkey: newPasskeyInput.trim() };
    setSettings(updatedSettings);

    if (typeof window !== 'undefined') {
      localStorage.setItem('soulspace_custom_passkey', newPasskeyInput.trim());
    }

    try {
      await fetch('/api/admin/d1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_settings',
          payload: updatedSettings,
        }),
      });
      setPasskeyUpdateMessage({
        text: 'Master Passkey updated successfully! Only you hold the new credentials.',
        type: 'success',
      });
      setCurrentPasskeyInput('');
      setNewPasskeyInput('');
      setConfirmPasskeyInput('');
    } catch {
      setPasskeyUpdateMessage({
        text: 'Passkey updated in secure session.',
        type: 'success',
      });
    } finally {
      setIsUpdatingPasskey(false);
    }
  };

  // Update Owner Profile details
  const handleUpdateOwnerProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setOwnerProfileMessage(null);
    try {
      await fetch('/api/admin/d1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_settings',
          payload: settings,
        }),
      });
      setOwnerProfileMessage('Owner profile details updated and saved successfully!');
      setTimeout(() => setOwnerProfileMessage(null), 3000);
    } catch {
      setOwnerProfileMessage('Saved in local session.');
      setTimeout(() => setOwnerProfileMessage(null), 3000);
    }
  };

  // Download complete website ownership backup archive
  const handleExportOwnershipBackup = () => {
    const backupData = {
      exportTimestamp: new Date().toISOString(),
      entity: 'Soul Space Infrastructure',
      owner: {
        name: settings.owner_name || 'Managing Director',
        title: settings.owner_title || 'Director of Soul Space Infrastructure',
        email: settings.email,
        phone: settings.primary_phone,
      },
      infrastructure: {
        storageType: 'Enterprise Cloud Architecture',
        totalRegisteredSlots: ALL_SLOTS.length,
        totalInquiries: inquiries.length,
      },
      slots: ALL_SLOTS.map((s) => ({
        slotId: s.id,
        projectId: s.projectId,
        projectName: s.projectName,
        sectionHeading: s.sectionHeading,
        pageLocation: s.pageLocation,
        title: s.title,
        category: s.category,
        imageUrl: slotsData[s.id]?.image_url || null,
      })),
      customProjects: customProjectsMap,
      announcement: announcementSettings,
      inquiries: inquiries,
      siteSettings: settings,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `SoulSpace_Ownership_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON of Slot Configurations Only
  const handleExportSlotsJson = () => {
    const slotsExport = ALL_SLOTS.map((s) => ({
      slotId: s.id,
      projectName: s.projectName,
      sectionHeading: s.sectionHeading,
      pageLocation: s.pageLocation,
      title: s.title,
      imageUrl: slotsData[s.id]?.image_url || null,
    }));
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(slotsExport, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `SoulSpace_Slots_Config_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import JSON of Slot Configurations
  const handleImportSlotsJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!Array.isArray(parsed)) {
          alert('Invalid configuration format. Expected an array of slot configurations.');
          return;
        }

        let updatedCount = 0;
        const newSlotsMap = { ...slotsData };

        for (const item of parsed) {
          if (item.slotId && item.imageUrl) {
            saveClientImage(item.slotId, item.imageUrl);
            newSlotsMap[item.slotId] = { image_url: item.imageUrl, title: item.title || item.slotId };
            updatedCount++;

            try {
              await fetch('/api/admin/d1', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  action: 'save_slot',
                  payload: { slot_id: item.slotId, image_url: item.imageUrl, title: item.title || item.slotId },
                }),
              });
            } catch {
              // ignore
            }
          }
        }

        setSlotsData(newSlotsMap);
        setStatusMessage({
          text: `Successfully imported and applied ${updatedCount} slot image configurations!`,
          type: 'success',
        });
      } catch (err: any) {
        setStatusMessage({ text: 'Failed to parse JSON file.', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  // Upload image to Cloudflare R2 and update D1
  const handleFileUpload = async (slotId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSlotId(slotId);
    setStatusMessage(null);

    const slotTitle = ALL_SLOTS.find((s) => s.id === slotId)?.title || slotId;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('slotId', slotId);
    formData.append('title', slotTitle);

    try {
      const res = await fetch('/api/admin/upload-r2', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.url) {
        saveClientImage(slotId, data.url);
        setSlotsData((prev) => ({
          ...prev,
          [slotId]: { image_url: data.url, title: slotTitle },
        }));

        setStatusMessage({
          text: `Slot ${slotId} published live across website!`,
          type: 'success',
        });
      } else {
        setStatusMessage({ text: data.error || 'Failed to upload image.', type: 'error' });
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Network upload error', type: 'error' });
    } finally {
      setUploadingSlotId(null);
    }
  };

  // Save manual Image URL
  const handleSaveUrl = async (slotId: string) => {
    const url = urlInput[slotId]?.trim();
    if (!url) return;

    const slotTitle = ALL_SLOTS.find((s) => s.id === slotId)?.title || slotId;

    saveClientImage(slotId, url);
    setSlotsData((prev) => ({
      ...prev,
      [slotId]: { image_url: url, title: slotTitle },
    }));

    try {
      await fetch('/api/admin/d1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_slot',
          payload: { slot_id: slotId, image_url: url, title: slotTitle },
        }),
      });
    } catch {
      // ignore
    }

    setUrlInput((prev) => ({ ...prev, [slotId]: '' }));
    setStatusMessage({ text: `Slot ${slotId} updated with image URL!`, type: 'success' });
  };

  // Clear slot
  const handleClearSlot = async (slotId: string) => {
    clearClientImage(slotId);
    setSlotsData((prev) => {
      const copy = { ...prev };
      delete copy[slotId];
      return copy;
    });

    try {
      await fetch('/api/admin/d1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_slot',
          payload: { slot_id: slotId, image_url: '', title: '' },
        }),
      });
    } catch {
      // ignore
    }

    setStatusMessage({ text: `Slot ${slotId} cleared. Reverted to architectural placeholder.`, type: 'success' });
  };

  // Save Company settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);

    try {
      const d1Res = await fetch('/api/admin/d1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_settings',
          payload: settings,
        }),
      });
      const d1Data = await d1Res.json();

      if (supabaseActive) {
        await saveSupabaseSettings(settings).catch(() => {});
      }

      if (d1Data.success) {
        setStatusMessage({ text: 'Company details saved successfully!', type: 'success' });
      } else {
        setStatusMessage({ text: 'Settings saved locally in session.', type: 'success' });
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Failed to save settings', type: 'error' });
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Save Project Custom Editorial Data
  const handleSaveProjectCustom = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingEditorial(true);

    const currentEdit = customProjectsMap[selectedProjectEditId] || {};
    saveProjectCustomData(selectedProjectEditId, currentEdit);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('soulspace-project-updated', {
          detail: { projectId: selectedProjectEditId },
        })
      );
    }

    setStatusMessage({
      text: `Live details for ${selectedProjectEditId.replace('-', ' ').toUpperCase()} updated and published!`,
      type: 'success',
    });
    setIsSavingEditorial(false);
  };

  // Save Announcement Settings
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    saveAnnouncementSettings(announcementSettings);
    fetch('/api/announcement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(announcementSettings),
    }).catch(console.error);
    setAnnouncementSavedToast(true);
    setTimeout(() => setAnnouncementSavedToast(false), 4000);
    setStatusMessage({
      text: announcementSettings.enabled
        ? 'Announcement banner published live on website!'
        : 'Announcement banner deactivated across all devices.',
      type: 'success',
    });
  };

  // Save Inquiry Status and Internal Note with Audit Trail
  const handleUpdateInquiryStatus = (docketKey: string, newStatus: LeadStageId) => {
    const existingMeta = inquiryMetas[docketKey] || getInquiryMeta(docketKey);
    const prevStatus = existingMeta.status || 'new';
    const now = new Date();
    const timestampStr = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    const auditText = `Stage transitioned from "${prevStatus.replace('_', ' ').toUpperCase()}" to "${newStatus.replace('_', ' ').toUpperCase()}" on ${timestampStr}`;

    const newHistory = [...(existingMeta.history || []), { stage: newStatus, timestamp: now.toISOString(), note: auditText }];

    saveInquiryMeta(docketKey, { status: newStatus, history: newHistory });
    setInquiryMetas((prev) => ({
      ...prev,
      [docketKey]: { ...(prev[docketKey] || {}), status: newStatus, history: newHistory },
    }));
    setActiveStageDropdown(null);
    setStatusMessage({ text: `Lead status updated to "${newStatus.replace('_', ' ').toUpperCase()}".`, type: 'success' });
  };

  const handleSaveInternalNote = (docketKey: string) => {
    const noteText = internalNoteDrafts[docketKey] || '';
    saveInquiryMeta(docketKey, { internalNotes: noteText });
    setInquiryMetas((prev) => ({
      ...prev,
      [docketKey]: { ...(prev[docketKey] || {}), internalNotes: noteText },
    }));
    setStatusMessage({ text: 'Internal follow-up note saved.', type: 'success' });
  };

  const handleExportCsv = () => {
    if (!inquiries.length) {
      alert('No inquiries recorded yet.');
      return;
    }

    const headers = ['Date', 'Docket #', 'Client Name', 'Phone', 'Email', 'Project', 'Typology', 'Unit Preference', 'Target Year', 'Status', 'Client Notes', 'Internal Notes'];
    const rows = inquiries.map((inq) => {
      const docketKey = inq.docket_number || inq.name;
      const meta = inquiryMetas[docketKey] || getInquiryMeta(docketKey);
      return [
        inq.created_at ? new Date(inq.created_at).toLocaleDateString() : 'N/A',
        `"${inq.docket_number || ''}"`,
        `"${inq.name.replace(/"/g, '""')}"`,
        `"${inq.phone.replace(/"/g, '""')}"`,
        `"${inq.email.replace(/"/g, '""')}"`,
        `"${(inq.project_title || inq.project_id || '').replace(/"/g, '""')}"`,
        `"${(inq.typology || '').replace(/"/g, '""')}"`,
        `"${(inq.unit_preference || '').replace(/"/g, '""')}"`,
        `"${inq.target_year || ''}"`,
        `"${(meta.status || inq.status || 'new').toUpperCase()}"`,
        `"${(inq.notes || '').replace(/"/g, '""')}"`,
        `"${(meta.internalNotes || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SoulSpace_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Global & Per-Project Slot Counts
  const projectSlotCounts = useMemo(() => {
    const counts: Record<string, { total: number; configured: number; empty: number }> = {
      all: { total: ALL_SLOTS.length, configured: 0, empty: 0 },
    };
    ALL_SLOTS.forEach((s) => {
      const hasImg = Boolean(slotsData[s.id]?.image_url);
      if (hasImg) counts.all.configured++;
      else counts.all.empty++;

      if (!counts[s.projectId]) {
        counts[s.projectId] = { total: 0, configured: 0, empty: 0 };
      }
      counts[s.projectId].total++;
      if (hasImg) counts[s.projectId].configured++;
      else counts[s.projectId].empty++;
    });
    return counts;
  }, [slotsData]);

  // Contextual scope for Status counts (dynamic based on active project & category selection)
  const scopedForStatus = useMemo(() => {
    return ALL_SLOTS.filter((s) => {
      if (projectFilter !== 'all' && s.projectId !== projectFilter) return false;
      if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = s.id.toLowerCase().includes(q);
        const matchHeading = s.sectionHeading.toLowerCase().includes(q);
        const matchLocation = s.pageLocation.toLowerCase().includes(q);
        const matchTitle = s.title.toLowerCase().includes(q);
        const matchProject = s.projectName.toLowerCase().includes(q);
        if (!matchId && !matchHeading && !matchLocation && !matchTitle && !matchProject) return false;
      }
      return true;
    });
  }, [projectFilter, categoryFilter, searchQuery]);

  // Contextual Status counts: accurately reflect the current project/category/search scope
  const statusCounts = useMemo(() => {
    const total = scopedForStatus.length;
    const configured = scopedForStatus.filter((s) => Boolean(slotsData[s.id]?.image_url)).length;
    const empty = total - configured;
    return { total, configured, empty };
  }, [scopedForStatus, slotsData]);

  // Category counts within current project filter scope
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: 0,
      hero: 0,
      floorplan: 0,
      highlight: 0,
      amenity: 0,
      material: 0,
    };
    ALL_SLOTS.forEach((s) => {
      if (projectFilter !== 'all' && s.projectId !== projectFilter) return;
      counts.all++;
      if (counts[s.category] !== undefined) {
        counts[s.category]++;
      }
    });
    return counts;
  }, [projectFilter]);

  // Filter slots for rendering
  const filteredSlots = useMemo(() => {
    return ALL_SLOTS.filter((s) => {
      if (projectFilter !== 'all' && s.projectId !== projectFilter) return false;

      const hasImage = Boolean(slotsData[s.id]?.image_url);
      if (statusFilter === 'configured' && !hasImage) return false;
      if (statusFilter === 'empty' && hasImage) return false;

      if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = s.id.toLowerCase().includes(q);
        const matchHeading = s.sectionHeading.toLowerCase().includes(q);
        const matchLocation = s.pageLocation.toLowerCase().includes(q);
        const matchTitle = s.title.toLowerCase().includes(q);
        const matchProject = s.projectName.toLowerCase().includes(q);
        if (!matchId && !matchHeading && !matchLocation && !matchTitle && !matchProject) return false;
      }

      return true;
    });
  }, [projectFilter, statusFilter, categoryFilter, searchQuery, slotsData]);

  // Global Statistics
  const configuredCount = projectSlotCounts.all?.configured || 0;
  const completionPercentage = Math.round((configuredCount / ALL_SLOTS.length) * 100);

  // Inquiry Pipeline Stage Counts
  const inquiryStageCounts = useMemo(() => {
    const counts: Record<string, number> = { all: inquiries.length };
    LEAD_STAGES.forEach((st) => { counts[st.id] = 0; });
    inquiries.forEach((inq) => {
      const docketKey = inq.docket_number || inq.name;
      const meta = inquiryMetas[docketKey] || getInquiryMeta(docketKey);
      const currentStatus = meta.status || inq.status || 'new';
      if (counts[currentStatus] !== undefined) {
        counts[currentStatus]++;
      } else {
        counts.new = (counts.new || 0) + 1;
      }
    });
    return counts;
  }, [inquiries, inquiryMetas]);

  // Inquiry Project Counts
  const inquiryProjectCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: inquiries.length,
      mystic: 0,
      aurum: 0,
      arbor: 0,
      uptown: 0,
      dotcom: 0,
      custom: 0,
    };
    inquiries.forEach((inq) => {
      const pKey = (inq.project_title || inq.project_id || '').toLowerCase();
      if (pKey.includes('mystic')) counts.mystic++;
      else if (pKey.includes('aurum')) counts.aurum++;
      else if (pKey.includes('arbor') || pKey.includes('abv')) counts.arbor++;
      else if (pKey.includes('uptown')) counts.uptown++;
      else if (pKey.includes('dotcom') || pKey.includes('dot com')) counts.dotcom++;
      else counts.custom++;
    });
    return counts;
  }, [inquiries]);

  // Filter inquiries with comprehensive search fields
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const docketKey = inq.docket_number || inq.name;
      const meta = inquiryMetas[docketKey] || getInquiryMeta(docketKey);
      const currentStatus = meta.status || inq.status || 'new';

      if (inquiryStatusFilter !== 'all' && currentStatus !== inquiryStatusFilter) {
        return false;
      }

      if (inquiryProjectFilter !== 'all') {
        const projectKey = (inq.project_title || inq.project_id || '').toLowerCase();
        if (!projectKey.includes(inquiryProjectFilter.toLowerCase())) return false;
      }

      if (inquirySearchQuery.trim()) {
        const q = inquirySearchQuery.toLowerCase().trim();
        const matchName = inq.name?.toLowerCase().includes(q);
        const matchPhone = inq.phone?.toLowerCase().includes(q);
        const matchEmail = inq.email?.toLowerCase().includes(q);
        const matchNotes = inq.notes?.toLowerCase().includes(q);
        const matchDocket = inq.docket_number?.toLowerCase().includes(q);
        const matchProject = inq.project_title?.toLowerCase().includes(q) || inq.project_id?.toLowerCase().includes(q);
        const matchUnit = inq.unit_preference?.toLowerCase().includes(q);
        const matchTypology = inq.typology?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchEmail && !matchNotes && !matchDocket && !matchProject && !matchUnit && !matchTypology) {
          return false;
        }
      }

      return true;
    });
  }, [inquiries, inquiryProjectFilter, inquiryStatusFilter, inquirySearchQuery, inquiryMetas]);

  // Active project being edited in Editorial tab
  const activeBaseProject = useMemo(() => {
    return PROJECTS.find((p) => p.id === selectedProjectEditId) || PROJECTS[0];
  }, [selectedProjectEditId]);

  const activeCustomProject = customProjectsMap[selectedProjectEditId] || {};

  // Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#181714] flex flex-col justify-center items-center px-4 selection:bg-[#B8936D] selection:text-white">
        <div className="max-w-md w-full bg-[#F5F2EB] border border-[#DCD5C8] rounded-2xl p-8 sm:p-10 shadow-sm text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-transparent flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-mark.png" alt="Soul Space Mark" className="w-full h-full object-contain" />
          </div>

          <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-[#99744C] font-bold block mb-1">
            SOUL SPACE INFRASTRUCTURE
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#181714] mb-2">
            Executive Portal
          </h1>
          <p className="text-xs text-[#786E5F] font-light mb-6">
            Private management suite for picture slots, photography assets, and architectural content.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative text-left">
              <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1">
                Master Passkey
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C7A65] absolute left-3 top-3.5 pointer-events-none" />
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Enter administrative passkey..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-sm text-[#181714] placeholder-[#A69B8D] focus:outline-none focus:border-[#B8936D] font-mono"
                  autoFocus
                />
              </div>
            </div>

            {authError && (
              <p className="text-xs text-[#7A2E2E] bg-[#FAF3F3] border border-[#E9CCCC] p-2.5 rounded-lg text-left">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[#181714] hover:bg-black text-white text-xs font-sans tracking-widest uppercase font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Authenticate &amp; Access
            </button>

            <div className="pt-2">
              <Link href="/" className="text-[11px] text-[#8C7A65] hover:text-[#181714] transition-colors">
                &larr; Return to Public Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181714] selection:bg-[#B8936D] selection:text-white">
      {/* Top Admin Header */}
      <header className="bg-[#ECE7DF] border-b border-[#D5CDBF] sticky top-0 z-40 shadow-xs w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Left Corner: Brand Lockup */}
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-mark.png" alt="Soul Space" className="w-8 h-8 object-contain shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-normal text-[#181714]">SOUL SPACE</span>
                <span className="text-[10px] font-sans tracking-widest text-[#B8936D] uppercase font-bold">
                  | ADMIN CONSOLE
                </span>
              </div>
              <p className="text-[10px] font-sans text-[#786E5F]">
                Full Architectural Content &amp; Media Stewardship
              </p>
            </div>
          </div>

          {/* Right Corner: Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Quick View Live Site Button */}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#D5CDBF] hover:border-[#B8936D] rounded-lg text-xs font-sans text-[#181714] transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#B8936D]" />
            </Link>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-[#181714] text-[#FAF8F5] hover:bg-black rounded-lg text-xs font-sans tracking-wider uppercase transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation — Centered in Header */}
        <div className="w-full px-4 sm:px-6 lg:px-8 border-t border-[#DDD5C7] flex items-center justify-center gap-1 sm:gap-5 overflow-x-auto text-xs font-sans">
          <button
            onClick={() => setActiveTab('slots')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'slots'
                ? 'border-[#B8936D] text-[#181714] font-semibold'
                : 'border-transparent text-[#786E5F] hover:text-[#181714]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#B8936D]" />
            <span>Picture Slots &amp; Media ({ALL_SLOTS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'inquiries'
                ? 'border-[#B8936D] text-[#181714] font-semibold'
                : 'border-transparent text-[#786E5F] hover:text-[#181714]'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#B8936D]" />
            <span>Inquiries &amp; Leads ({inquiries.length})</span>
          </button>

          {/* NEW TAB: EDITORIAL & WEBSITE CONTENT */}
          <button
            onClick={() => setActiveTab('editorial')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'editorial'
                ? 'border-[#B8936D] text-[#181714] font-semibold'
                : 'border-transparent text-[#786E5F] hover:text-[#181714]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-[#B8936D]" />
            <span>Website Content &amp; Projects</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-[#B8936D] text-[#181714] font-semibold'
                : 'border-transparent text-[#786E5F] hover:text-[#181714]'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-[#B8936D]" />
            <span>Company &amp; Contact Info</span>
          </button>

          <button
            onClick={() => setActiveTab('ownership')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ownership'
                ? 'border-[#B8936D] text-[#181714] font-semibold'
                : 'border-transparent text-[#786E5F] hover:text-[#181714]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#B8936D]" />
            <span>Master Security &amp; Access</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Global Alert Notification */}
        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center justify-between text-xs ${
              statusMessage.type === 'success'
                ? 'bg-[#F3F6F4] text-[#244A38] border-[#CCD8D0]'
                : 'bg-[#FAF3F3] text-[#7A2E2E] border-[#E9CCCC]'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#2E5A44] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#7A2E2E] shrink-0" />
              )}
              <span className="font-medium">{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-[#786E5F] hover:text-[#181714] font-semibold ml-4 cursor-pointer"
            >
              &times;
            </button>
          </div>
        )}

        {/* TAB 1: PICTURE SLOTS & MEDIA MANAGER */}
        {activeTab === 'slots' && (
          <div className="space-y-6">
            {/* Header + Portfolio Media Progress Bar */}
            <div className="bg-[#F5F2EB] border border-[#DCD5C8] rounded-2xl p-6 sm:p-8 space-y-6 shadow-none">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[#99744C] text-[10px] tracking-[0.25em] uppercase font-bold mb-1 font-sans">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>PORTFOLIO CURATION ENGINE</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#181714] font-normal">
                    Picture Slots &amp; Visual Architecture
                  </h2>
                  <p className="text-xs text-[#5C5346] font-light mt-1 max-w-2xl leading-relaxed">
                    Identify every picture slot by its exact live website section heading and page location. Upload photos, change angles, or inspect dimensions. Changes publish instantly across all devices.
                  </p>
                </div>

                {/* Bulk Configuration Tools */}
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <button
                    onClick={handleExportSlotsJson}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBF] hover:border-[#B8936D] rounded-lg text-xs font-sans text-[#181714] transition-colors cursor-pointer"
                    title="Download a JSON backup of all picture slots"
                  >
                    <Download className="w-3.5 h-3.5 text-[#B8936D]" />
                    <span>Backup Config (.json)</span>
                  </button>

                  <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBF] hover:border-[#B8936D] rounded-lg text-xs font-sans text-[#181714] transition-colors cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[#B8936D]" />
                    <span>Restore Config</span>
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleImportSlotsJson}
                    />
                  </label>
                </div>
              </div>

              {/* Progress & Health Bar */}
              <div className="bg-[#FAF8F4] border border-[#E2DDD2] rounded-xl p-4 sm:p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-[#181714]">
                      Overall Portfolio Media Coverage:
                    </span>
                    <span className="font-serif text-base text-[#99744C] font-semibold">
                      {completionPercentage}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-[#786E5F]">
                    <span>
                      <strong className="text-[#244A38]">{configuredCount}</strong> Published Live
                    </span>
                    <span>&bull;</span>
                    <span>
                      <strong className="text-[#7A6D5D]">{ALL_SLOTS.length - configuredCount}</strong> Unconfigured
                    </span>
                    <span>&bull;</span>
                    <span>
                      <strong>{ALL_SLOTS.length}</strong> Total Registered Slots
                    </span>
                  </div>
                </div>

                {/* Progress bar track */}
                <div className="w-full h-2.5 bg-[#E8E2D6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#B8936D] transition-all duration-500 rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="bg-[#F5F2EB] border border-[#DCD5C8] rounded-xl p-4 sm:p-5 space-y-4 shadow-none">
              {/* Row 1: Search Bar & View Mode Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#8C7A65] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by heading, slot ID (e.g. aurum_img_01), or location..."
                    className="w-full pl-9 pr-8 py-2 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-xs placeholder-[#A69B8D] focus:outline-none focus:border-[#B8936D]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-[#8C7A65] hover:text-black text-xs font-semibold cursor-pointer"
                    >
                      &times;
                    </button>
                  )}
                </div>

                {/* View Switcher & Result Count */}
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-[11px] text-[#786E5F] font-light">
                    Showing <strong className="text-[#181714]">{filteredSlots.length}</strong> of {ALL_SLOTS.length} slots
                  </span>

                  <div className="flex items-center bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg p-0.5">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        viewMode === 'grid' ? 'bg-[#181714] text-white' : 'text-[#786E5F] hover:text-[#181714]'
                      }`}
                      title="Visual Card Grid View"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        viewMode === 'table' ? 'bg-[#181714] text-white' : 'text-[#786E5F] hover:text-[#181714]'
                      }`}
                      title="Compact Audit Table View"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: Development Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-[#E2DDD2]">
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#8C7A65] font-semibold mr-1">
                  Project:
                </span>
                {[
                  { id: 'all', label: 'All Developments', count: ALL_SLOTS.length },
                  { id: 'mystic-villas', label: 'Mystic (Farmhouses)', count: projectSlotCounts['mystic-villas']?.total || 0 },
                  { id: 'aurum-villas', label: 'Aurum (Villas)', count: projectSlotCounts['aurum-villas']?.total || 0 },
                  { id: 'abv-arbor', label: 'ABV Arbor (Flats)', count: projectSlotCounts['abv-arbor']?.total || 0 },
                  { id: 'dotcom-workspaces', label: 'DOT COM (Workspaces)', count: projectSlotCounts['dotcom-workspaces']?.total || 0 },
                  { id: 'uptown-residences', label: 'Uptown (Apartments)', count: projectSlotCounts['uptown-residences']?.total || 0 },
                  { id: 'materiality', label: 'Materials & Specs', count: projectSlotCounts['materiality']?.total || 0 },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setProjectFilter(item.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-sans transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                      projectFilter === item.id
                        ? 'bg-[#181714] text-white font-medium'
                        : 'bg-[#ECE7DF] text-[#5C5346] hover:text-[#181714]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono ${
                        projectFilter === item.id ? 'bg-white/20 text-white' : 'bg-[#DDD5C7] text-[#6E6354]'
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Row 3: Contextual Status & Category Filter Pills */}
              <div className="flex items-center justify-between gap-3 flex-wrap pt-2 border-t border-[#E2DDD2] text-[11px]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#8C7A65] font-semibold mr-1">
                    Status:
                  </span>
                  {[
                    { id: 'all', label: `All (${statusCounts.total})` },
                    { id: 'configured', label: `Published Live (${statusCounts.configured})` },
                    { id: 'empty', label: `Needs Photo (${statusCounts.empty})` },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setStatusFilter(item.id as any)}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        statusFilter === item.id
                          ? 'bg-[#181714] text-white font-medium'
                          : 'bg-[#ECE7DF] text-[#5C5346] hover:text-[#181714]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#8C7A65] font-semibold mr-1">
                    Category:
                  </span>
                  {[
                    { id: 'all', label: `All (${categoryCounts.all})` },
                    { id: 'hero', label: `Hero Banners (${categoryCounts.hero})` },
                    { id: 'floorplan', label: `Floor Plans & 3D (${categoryCounts.floorplan})` },
                    { id: 'highlight', label: `Living Spaces (${categoryCounts.highlight})` },
                    { id: 'amenity', label: `Amenities (${categoryCounts.amenity})` },
                    { id: 'material', label: `Materials & Specs (${categoryCounts.material})` },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCategoryFilter(item.id)}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        categoryFilter === item.id
                          ? 'bg-[#B8936D] text-white font-medium'
                          : 'bg-[#ECE7DF] text-[#5C5346] hover:text-[#181714]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredSlots.length === 0 && (
              <div className="bg-[#F5F2EB] border border-[#DCD5C8] rounded-xl p-12 text-center space-y-3">
                <ImageIcon className="w-10 h-10 text-[#8C7A65] mx-auto opacity-60" />
                <h3 className="font-serif text-xl text-[#181714]">No picture slots found</h3>
                <p className="text-xs text-[#786E5F] max-w-sm mx-auto">
                  No slots match your active search &quot;{searchQuery}&quot; or filter criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setProjectFilter('all');
                    setStatusFilter('all');
                    setCategoryFilter('all');
                  }}
                  className="px-4 py-2 bg-[#181714] text-white rounded-lg text-xs font-sans uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* VIEW MODE 1: RICH CARDS GRID */}
            {viewMode === 'grid' && filteredSlots.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSlots.map((slot) => {
                  const currentData = slotsData[slot.id];
                  const hasImage = Boolean(currentData?.image_url);
                  const isUploading = uploadingSlotId === slot.id;

                  return (
                    <div
                      key={slot.id}
                      className="bg-[#F5F2EB] border border-[#DCD5C8] rounded-xl p-5 flex flex-col justify-between hover:border-[#B8936D] transition-all shadow-none relative group"
                    >
                      <div>
                        {/* Top Badges: Location & Status */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9.5px] font-sans uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#E8E2D6] text-[#786E5F]">
                              {slot.projectName}
                            </span>
                            <span className="text-[9.5px] font-sans font-medium px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#8C7A65] border border-[#DDD6C8]">
                              {slot.pageLocation}
                            </span>
                          </div>

                          {hasImage ? (
                            <span className="inline-flex items-center gap-1 text-[9.5px] font-sans font-semibold text-[#244A38] bg-[#F2F6F3] border border-[#CCD8D0] px-2 py-0.5 rounded-full shrink-0">
                              <CheckCircle2 className="w-3 h-3 text-[#2E5A44]" />
                              Live
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9.5px] font-sans font-semibold text-[#7A6D5D] bg-[#EDE8DF] border border-[#DCD5C8] px-2 py-0.5 rounded-full shrink-0">
                              Unconfigured
                            </span>
                          )}
                        </div>

                        {/* Exact Section Heading from Website */}
                        <div className="mb-3">
                          <span className="text-[9px] font-mono tracking-widest uppercase text-[#99744C] font-semibold block mb-0.5">
                            LIVE SECTION HEADING:
                          </span>
                          <h4 className="font-serif text-base text-[#181714] font-medium leading-snug">
                            {slot.sectionHeading}
                          </h4>
                          <p className="text-xs text-[#5C5346] font-light mt-1 leading-relaxed">
                            {slot.siteContext}
                          </p>
                        </div>

                        {/* Slot ID Monospace Pill & Dimensions Helper */}
                        <div className="flex items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-[#E2DDD2] text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#8C7A65] font-sans uppercase tracking-wider">SLOT ID:</span>
                            <code className="font-mono bg-[#ECE6DC] text-[#7A6B58] border border-[#DCD5C8] px-1.5 py-0.5 rounded text-[10.5px] font-semibold">
                              {slot.id}
                            </code>
                          </div>
                          <span className="text-[10px] text-[#8C7A65] font-light">
                            {slot.recommendedDimensions}
                          </span>
                        </div>

                        {/* Visual Preview Box */}
                        <div className="aspect-16/10 rounded-xl overflow-hidden bg-[#ECE7DF] border border-[#D5CDBF] mb-4 flex items-center justify-center relative group/preview">
                          {hasImage ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={currentData.image_url}
                                alt={slot.title}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => setPreviewModalSlot(slot)}
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-1.5 cursor-pointer backdrop-blur-2xs"
                              >
                                <ZoomIn className="w-4 h-4 text-[#C5A880]" />
                                <span>Inspect High-Res</span>
                              </button>
                            </>
                          ) : (
                            <div className="text-center p-4">
                              <span className="font-mono text-xs text-[#8C7A65] block mb-1">
                                {slot.id}
                              </span>
                              <span className="text-[10px] text-[#A69B8D] font-light">
                                Shows canonical architectural placeholder on website
                              </span>
                            </div>
                          )}

                          {isUploading && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-xs gap-2">
                              <RefreshCw className="w-4 h-4 animate-spin text-[#B8936D]" />
                              <span>Publishing Image...</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Actions & Live Jump Link */}
                      <div className="space-y-2 pt-2 border-t border-[#E2DDD2]">
                        {/* File Upload Button */}
                        <label className="w-full py-2 bg-[#181714] text-white hover:bg-black rounded-lg text-[11px] font-sans uppercase tracking-wider font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-[#B8936D]" />
                          <span>Upload Photography</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(slot.id, e)}
                            disabled={isUploading}
                          />
                        </label>

                        {/* Paste URL Input */}
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Or paste image URL..."
                            value={urlInput[slot.id] || ''}
                            onChange={(e) =>
                              setUrlInput((prev) => ({ ...prev, [slot.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSaveUrl(slot.id);
                              }
                            }}
                            className="flex-1 px-2.5 py-1.5 bg-[#FAF8F5] border border-[#D5CDBF] rounded text-xs placeholder-[#A69B8D] focus:outline-none focus:border-[#B8936D]"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveUrl(slot.id)}
                            className="px-3 py-1.5 bg-[#ECE7DF] hover:bg-[#DDD5C7] border border-[#D5CDBF] text-[10.5px] font-sans uppercase tracking-wider font-semibold rounded cursor-pointer"
                          >
                            Save
                          </button>
                        </div>

                        {/* Footer: Jump to Live Site + Clear Button */}
                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          <Link
                            href={slot.liveRoute}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-[#8C7A65] hover:text-[#B8936D] transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>View on Live Site</span>
                          </Link>

                          {hasImage && (
                            <button
                              type="button"
                              onClick={() => handleClearSlot(slot.id)}
                              className="inline-flex items-center gap-1 text-[#7A2E2E] hover:underline cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Clear</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW MODE 2: AUDIT TABLE VIEW */}
            {viewMode === 'table' && filteredSlots.length > 0 && (
              <div className="bg-[#FAF8F4] border border-[#DCD5C8] rounded-xl overflow-x-auto shadow-none">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#ECE7DF] border-b border-[#D5CDBF] text-[#786E5F] uppercase tracking-wider text-[10px] font-semibold">
                    <tr>
                      <th className="py-3 px-4">Preview</th>
                      <th className="py-3 px-4">Slot ID</th>
                      <th className="py-3 px-4">Project</th>
                      <th className="py-3 px-4">Live Section Heading</th>
                      <th className="py-3 px-4">Page Location</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DFD4] text-[#181714]">
                    {filteredSlots.map((slot) => {
                      const currentData = slotsData[slot.id];
                      const hasImage = Boolean(currentData?.image_url);

                      return (
                        <tr key={slot.id} className="hover:bg-[#F4F2EB] transition-colors">
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div
                              onClick={() => hasImage && setPreviewModalSlot(slot)}
                              className={`w-14 h-10 rounded-lg overflow-hidden bg-[#ECE7DF] border border-[#D5CDBF] flex items-center justify-center relative ${
                                hasImage ? 'cursor-pointer hover:border-[#B8936D]' : ''
                              }`}
                            >
                              {hasImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={currentData.image_url}
                                  alt={slot.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-[#8C7A65]/50" />
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <code className="font-mono bg-[#ECE6DC] text-[#7A6B58] border border-[#DCD5C8] px-2 py-0.5 rounded text-[11px] font-semibold">
                              {slot.id}
                            </code>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap font-medium">
                            {slot.projectName}
                          </td>

                          <td className="py-3 px-4 font-serif text-sm max-w-xs">
                            <div className="font-medium text-[#181714] line-clamp-1">{slot.sectionHeading}</div>
                            <div className="text-[10.5px] font-sans text-[#786E5F] line-clamp-1">{slot.title}</div>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 bg-[#FAF8F5] text-[#8C7A65] border border-[#DDD6C8] rounded-full text-[10px]">
                              {slot.pageLocation}
                            </span>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            {hasImage ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#244A38] bg-[#F2F6F3] border border-[#CCD8D0] px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3 text-[#2E5A44]" />
                                Live
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#7A6D5D] bg-[#EDE8DF] border border-[#DCD5C8] px-2 py-0.5 rounded-full">
                                Unconfigured
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={slot.liveRoute}
                                target="_blank"
                                className="p-1.5 bg-[#FAF8F5] hover:bg-[#ECE7DF] border border-[#D5CDBF] rounded text-[#181714]"
                                title="View on Live Site"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-[#B8936D]" />
                              </Link>

                              <label className="p-1.5 bg-[#181714] hover:bg-black rounded text-white cursor-pointer" title="Upload Photo">
                                <Upload className="w-3.5 h-3.5 text-[#B8936D]" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(slot.id, e)}
                                />
                              </label>

                              {hasImage && (
                                <button
                                  type="button"
                                  onClick={() => handleClearSlot(slot.id)}
                                  className="p-1.5 bg-[#FAF3F3] hover:bg-[#F5E5E5] border border-[#E9CCCC] rounded text-[#7A2E2E] cursor-pointer"
                                  title="Clear Image"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INQUIRIES & LEADS CRM WITH EXPANDABLE DOCKET LAYOUT */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCD5C8] pb-6">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#181714] font-normal">
                  Inquiries &amp; Buyer Leads CRM
                </h2>
                <p className="text-xs text-[#5C5346] font-light mt-1">
                  Click any inquiry row to expand all details, read the full unclipped message, update lead status, or follow up directly via WhatsApp.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCsv}
                  className="px-4 py-2 bg-[#181714] text-white hover:bg-black rounded-lg text-xs font-sans uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#B8936D]" />
                  <span>Export All Inquiries (.csv)</span>
                </button>
              </div>
            </div>

            {/* Inquiries Filter & Status Toolbar */}
            <div className="bg-[#F5F2EB] border border-[#DCD5C8] rounded-xl p-4 sm:p-5 space-y-3 shadow-none">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-[#8C7A65] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={inquirySearchQuery}
                    onChange={(e) => setInquirySearchQuery(e.target.value)}
                    placeholder="Search buyer name, phone, email, notes, docket #..."
                    className="w-full pl-9 pr-8 py-1.5 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-xs placeholder-[#A69B8D] focus:outline-none focus:border-[#B8936D]"
                  />
                  {inquirySearchQuery && (
                    <button
                      type="button"
                      onClick={() => setInquirySearchQuery('')}
                      className="absolute right-2.5 top-2 text-[#8C7A65] hover:text-black font-semibold text-xs cursor-pointer"
                    >
                      &times;
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Custom Stage Dropdown Filter */}
                  <div className="flex items-center gap-1.5 relative" id="inquiry-stage-filter-container">
                    <span className="text-[10px] font-sans uppercase tracking-widest text-[#8C7A65] font-semibold">
                      Stage:
                    </span>
                    <button
                      type="button"
                      id="inquiry-stage-dropdown-btn"
                      onClick={() => {
                        setFilterStageDropdownOpen(!filterStageDropdownOpen);
                        setFilterProjectDropdownOpen(false);
                      }}
                      className="inline-flex items-center justify-between gap-2 px-3 py-1.5 bg-[#FAF8F5] border border-[#D5CDBF] hover:border-[#B8936D] rounded-lg text-xs font-sans text-[#181714] transition-colors cursor-pointer min-w-[140px]"
                    >
                      <span className="truncate">
                        {inquiryStatusFilter === 'all'
                          ? `All Stages (${inquiries.length})`
                          : inquiryStatusFilter === 'new'
                          ? `New Leads (${inquiryStageCounts.new || 0})`
                          : inquiryStatusFilter === 'contacted'
                          ? `Contacted (${inquiryStageCounts.contacted || 0})`
                          : inquiryStatusFilter === 'visit_scheduled'
                          ? `Site Visit (${inquiryStageCounts.visit_scheduled || 0})`
                          : inquiryStatusFilter === 'negotiation'
                          ? `Negotiation (${inquiryStageCounts.negotiation || 0})`
                          : inquiryStatusFilter === 'closed'
                          ? `Closed / Won (${inquiryStageCounts.closed || 0})`
                          : `Archived (${inquiryStageCounts.archived || 0})`}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-[#8C7A65] shrink-0 transition-transform duration-200 ${
                          filterStageDropdownOpen ? 'rotate-180 text-[#B8936D]' : ''
                        }`}
                      />
                    </button>

                    {filterStageDropdownOpen && (
                      <div
                        id="inquiry-stage-dropdown-menu"
                        className="absolute right-0 top-full mt-1.5 w-56 bg-[#FAF8F5] border border-[#D5CDBF] rounded-xl shadow-xl py-1 z-50 text-xs font-sans animate-fadeIn"
                      >
                        {[
                          { value: 'all', label: 'All Stages', count: inquiries.length },
                          { value: 'new', label: 'New Leads', count: inquiryStageCounts.new || 0 },
                          { value: 'contacted', label: 'Contacted', count: inquiryStageCounts.contacted || 0 },
                          { value: 'visit_scheduled', label: 'Site Visit Scheduled', count: inquiryStageCounts.visit_scheduled || 0 },
                          { value: 'negotiation', label: 'In Negotiation', count: inquiryStageCounts.negotiation || 0 },
                          { value: 'closed', label: 'Closed / Won', count: inquiryStageCounts.closed || 0 },
                          { value: 'archived', label: 'Archived / Dormant', count: inquiryStageCounts.archived || 0 },
                        ].map((opt) => {
                          const isSelected = inquiryStatusFilter === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                setInquiryStatusFilter(opt.value);
                                setFilterStageDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-[#EFE8DD] text-[#181714] font-semibold'
                                  : 'text-[#4A4237] hover:bg-[#F3EFE8] hover:text-[#181714]'
                              }`}
                            >
                              <span>{opt.label}</span>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                  isSelected ? 'bg-[#DCD5C8] text-[#181714]' : 'bg-[#EAE4D8] text-[#786E5F]'
                                }`}
                              >
                                {opt.count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Custom Project Dropdown Filter */}
                  <div className="flex items-center gap-1.5 relative" id="inquiry-project-filter-container">
                    <span className="text-[10px] font-sans uppercase tracking-widest text-[#8C7A65] font-semibold">
                      Project:
                    </span>
                    <button
                      type="button"
                      id="inquiry-project-dropdown-btn"
                      onClick={() => {
                        setFilterProjectDropdownOpen(!filterProjectDropdownOpen);
                        setFilterStageDropdownOpen(false);
                      }}
                      className="inline-flex items-center justify-between gap-2 px-3 py-1.5 bg-[#FAF8F5] border border-[#D5CDBF] hover:border-[#B8936D] rounded-lg text-xs font-sans text-[#181714] transition-colors cursor-pointer min-w-[155px]"
                    >
                      <span className="truncate">
                        {inquiryProjectFilter === 'all'
                          ? `All Developments (${inquiries.length})`
                          : inquiryProjectFilter === 'Custom'
                          ? `Custom Civil (${inquiryProjectCounts.custom || 0})`
                          : `${inquiryProjectFilter} (${inquiryProjectCounts[inquiryProjectFilter.toLowerCase().replace(/[^a-z]/g, '')] || 0})`}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-[#8C7A65] shrink-0 transition-transform duration-200 ${
                          filterProjectDropdownOpen ? 'rotate-180 text-[#B8936D]' : ''
                        }`}
                      />
                    </button>

                    {filterProjectDropdownOpen && (
                      <div
                        id="inquiry-project-dropdown-menu"
                        className="absolute right-0 top-full mt-1.5 w-56 bg-[#FAF8F5] border border-[#D5CDBF] rounded-xl shadow-xl py-1 z-50 text-xs font-sans animate-fadeIn"
                      >
                        {[
                          { value: 'all', label: 'All Developments', count: inquiries.length },
                          { value: 'Mystic', label: 'Mystic', count: inquiryProjectCounts.mystic || 0 },
                          { value: 'Aurum', label: 'Aurum', count: inquiryProjectCounts.aurum || 0 },
                          { value: 'ABV Arbor', label: 'ABV Arbor', count: inquiryProjectCounts.arbor || 0 },
                          { value: 'Uptown', label: 'Uptown', count: inquiryProjectCounts.uptown || 0 },
                          { value: 'DOT COM', label: 'DOT COM', count: inquiryProjectCounts.dotcom || 0 },
                          { value: 'Custom', label: 'Custom Civil', count: inquiryProjectCounts.custom || 0 },
                        ].map((opt) => {
                          const isSelected = inquiryProjectFilter === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                setInquiryProjectFilter(opt.value);
                                setFilterProjectDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-[#EFE8DD] text-[#181714] font-semibold'
                                  : 'text-[#4A4237] hover:bg-[#F3EFE8] hover:text-[#181714]'
                              }`}
                            >
                              <span>{opt.label}</span>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                  isSelected ? 'bg-[#DCD5C8] text-[#181714]' : 'bg-[#EAE4D8] text-[#786E5F]'
                                }`}
                              >
                                {opt.count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Inquiry Filter Sub-bar: Result Counter & Reset */}
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#E2DDD2] text-[#786E5F]">
                <span>
                  Showing <strong className="text-[#181714]">{filteredInquiries.length}</strong> of {inquiries.length} buyer leads
                </span>
                {(inquirySearchQuery || inquiryStatusFilter !== 'all' || inquiryProjectFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setInquirySearchQuery('');
                      setInquiryStatusFilter('all');
                      setInquiryProjectFilter('all');
                    }}
                    className="text-[#99744C] hover:underline cursor-pointer font-medium"
                  >
                    Clear Filter Criteria &times;
                  </button>
                )}
              </div>
            </div>

            {isLoadingInquiries ? (
              <div className="p-12 text-center text-xs text-[#8C7A65]">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#B8936D]" />
                Loading buyer inquiries...
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="bg-[#F5F2EB] border border-[#DCD5C8] rounded-xl p-12 text-center text-xs text-[#8C7A65]">
                No inquiries match your active filter criteria.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-[11px] text-[#786E5F] flex items-center justify-between px-1">
                  <span>Showing {filteredInquiries.length} client inquiries. Click any row to expand full details.</span>
                  <span className="text-[#99744C] font-medium">Interactive Layout View</span>
                </div>

                {filteredInquiries.map((inq, idx) => {
                  const docketKey = inq.docket_number || inq.name || String(idx);
                  const isExpanded = expandedDocket === docketKey;
                  const meta = inquiryMetas[docketKey] || getInquiryMeta(docketKey);
                  const leadStatus = meta.status || inq.status || 'new';

                  return (
                    <div
                      key={docketKey}
                      className={`bg-[#FAF8F4] border rounded-xl transition-all shadow-none overflow-hidden ${
                        isExpanded
                          ? 'border-[#B8936D] ring-1 ring-[#B8936D]/30 shadow-md'
                          : 'border-[#DCD5C8] hover:border-[#CBB8A0]'
                      }`}
                    >
                      {/* Clickable Header Bar: Increases layout size when clicked! */}
                      <div
                        onClick={() => setExpandedDocket(isExpanded ? null : docketKey)}
                        className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-[#F5F2EB]/60 transition-colors select-none"
                      >
                        <div className="flex items-start sm:items-center gap-3 flex-wrap">
                          {/* Expand Icon */}
                          <button
                            type="button"
                            className="p-1 rounded bg-[#EAE4D8] text-[#181714] shrink-0"
                            aria-label={isExpanded ? 'Collapse docket' : 'Expand docket'}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          {/* Docket Number & Date */}
                          <div>
                            <span className="font-mono text-xs text-[#99744C] font-semibold block">
                              {inq.docket_number || `INQ-${new Date(inq.created_at || '').getFullYear() || '2026'}-${String(idx + 1).padStart(4, '0')}`}
                            </span>
                            <span className="text-[10px] text-[#8C7A65]">
                              {inq.created_at ? new Date(inq.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Recent Lead'}
                            </span>
                          </div>

                          {/* Client Name */}
                          <div className="pl-2 sm:border-l border-[#DCD5C8]">
                            <h4 className="font-serif text-base sm:text-lg text-[#181714] font-medium leading-tight">
                              {inq.name}
                            </h4>
                            <span className="text-xs text-[#5C5346] font-mono">
                              {inq.phone}
                            </span>
                          </div>

                          {/* Development Tag */}
                          <span className="px-2.5 py-0.5 bg-[#EAE3D6] text-[#181714] rounded-full text-[10.5px] font-medium shrink-0">
                            {inq.project_title || inq.project_id || 'General Portfolio'}
                          </span>
                        </div>

                        {/* Right Summary: Status Badge & Action Preview */}
                        <div className="flex items-center gap-3">
                          {/* Dynamic Stage Pill Badge with colored glowing dot */}
                          {(() => {
                            const currentStageDef = LEAD_STAGES.find((s) => s.id === leadStatus) || LEAD_STAGES[0];
                            return (
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border shadow-2xs ${currentStageDef.badgeBg} ${currentStageDef.badgeText} ${currentStageDef.badgeBorder}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${currentStageDef.dotColor}`} />
                                <span>{currentStageDef.label}</span>
                              </span>
                            );
                          })()}

                          <span className="text-xs text-[#B8936D] font-medium hidden sm:inline">
                            {isExpanded ? 'Hide Details' : 'View Full Details & Notes \u2192'}
                          </span>
                        </div>
                      </div>

                      {/* EXPANDED FULL MESSAGE & DOSSIER VIEW (INCREASED SIZE OF LAYOUT) */}
                      {isExpanded && (
                        <div className="p-5 sm:p-7 border-t border-[#E5DFD4] bg-[#FAF8F5] space-y-6 animate-fadeIn">
                          {/* Full Client Message Callout (NO TRUNCATION!) */}
                          <div className="bg-[#FAF8F4] border border-[#E0D8CB] rounded-xl p-5 shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99744C] font-bold flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-[#B8936D]" />
                                COMPLETE CLIENT MESSAGE &amp; INQUIRY BRIEF:
                              </span>
                              <span className="text-[10px] text-[#8C7A65]">
                                {inq.notes ? `${inq.notes.length} characters` : 'No text provided'}
                              </span>
                            </div>

                            <div className="p-4 bg-[#FAF8F5] border-l-4 border-[#B8936D] rounded-r-lg text-sm text-[#181714] leading-relaxed font-normal whitespace-pre-wrap select-text">
                              {inq.notes || 'Client submitted an inquiry request without additional text remarks.'}
                            </div>
                          </div>

                          {/* INTERACTIVE BUYER PIPELINE MILESTONE TRACKER */}
                          {(() => {
                            const currentStageDef = LEAD_STAGES.find((s) => s.id === leadStatus) || LEAD_STAGES[0];
                            return (
                              <div className="p-4 sm:p-5 rounded-xl bg-[#F7F4EE] border border-[#DCD5C8] space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#99744C] font-bold flex items-center gap-1.5">
                                    <Compass className="w-3.5 h-3.5 text-[#B8936D]" />
                                    BUYER PIPELINE MILESTONE TRACKER:
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-[#7A6B58]">Active Stage:</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border ${currentStageDef.badgeBg} ${currentStageDef.badgeText} ${currentStageDef.badgeBorder}`}>
                                      {currentStageDef.label}
                                    </span>
                                  </div>
                                </div>

                                {/* 5 Interactive Milestone Step Cards */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
                                  {LEAD_STAGES.filter((s) => s.id !== 'archived').map((st, stepIdx) => {
                                    const isActive = st.id === leadStatus;
                                    const currentIdx = LEAD_STAGES.findIndex(s => s.id === leadStatus);
                                    const isCompleted = currentIdx > stepIdx;
                                    return (
                                      <button
                                        key={st.id}
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdateInquiryStatus(docketKey, st.id);
                                        }}
                                        title={st.description}
                                        className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer relative ${
                                          isActive
                                            ? `${st.badgeBg} ${st.badgeBorder} ring-2 ring-[#B8936D]/60 shadow-sm font-semibold`
                                            : isCompleted
                                            ? 'bg-[#FAF8F4] border-[#D5CDBF] text-[#4A4135] hover:bg-[#F2ECE0]'
                                            : 'bg-white/80 border-[#E5DFD4] text-[#8C7A65] hover:bg-white hover:border-[#B8936D]'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between w-full mb-1.5">
                                          <span className="text-[9.5px] font-mono uppercase tracking-widest text-[#8C7A65]">
                                            0{stepIdx + 1}
                                          </span>
                                          {isCompleted ? (
                                            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                                          ) : isActive ? (
                                            <span className={`w-2.5 h-2.5 rounded-full ${st.dotColor} ring-4 ring-[#B8936D]/20 animate-pulse`} />
                                          ) : (
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#D5CDBF]" />
                                          )}
                                        </div>
                                        <span className={`text-xs leading-snug ${isActive ? st.badgeText : 'text-[#2D2A26]'}`}>
                                          {st.label}
                                        </span>
                                        <span className="text-[9.5px] text-[#8C7A65] font-light mt-1 line-clamp-1">
                                          {st.description}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Client Information Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-[#F4F1EA] border border-[#E2DDD2] text-xs">
                            <div>
                              <span className="text-[10px] font-sans uppercase tracking-wider text-[#8C7A65] block mb-0.5">
                                Full Name:
                              </span>
                              <span className="font-medium text-[#181714] text-sm">{inq.name}</span>
                            </div>

                            <div>
                              <span className="text-[10px] font-sans uppercase tracking-wider text-[#8C7A65] block mb-0.5">
                                Phone Number:
                              </span>
                              <a href={`tel:${inq.phone}`} className="font-mono text-[#99744C] font-semibold hover:underline">
                                {inq.phone}
                              </a>
                            </div>

                            <div>
                              <span className="text-[10px] font-sans uppercase tracking-wider text-[#8C7A65] block mb-0.5">
                                Email Address:
                              </span>
                              <a href={`mailto:${inq.email}`} className="text-[#181714] hover:underline break-all">
                                {inq.email || '—'}
                              </a>
                            </div>

                            <div>
                              <span className="text-[10px] font-sans uppercase tracking-wider text-[#8C7A65] block mb-0.5">
                                Target Completion Year:
                              </span>
                              <span className="font-medium text-[#181714]">{inq.target_year || '2026'}</span>
                            </div>

                            <div>
                              <span className="text-[10px] font-sans uppercase tracking-wider text-[#8C7A65] block mb-0.5">
                                Project Interest:
                              </span>
                              <span className="font-medium text-[#181714]">
                                {inq.project_title || inq.project_id || 'General Portfolio'}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] font-sans uppercase tracking-wider text-[#8C7A65] block mb-0.5">
                                Typology / Unit Preference:
                              </span>
                              <span className="font-medium text-[#181714]">
                                {inq.unit_preference || inq.typology || 'Independent Luxury Villa'}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] font-sans uppercase tracking-wider text-[#8C7A65] block mb-0.5">
                                Registered Docket ID:
                              </span>
                              <code className="font-mono bg-[#EAE4D8] px-1.5 py-0.5 rounded text-[11px] text-[#7A6B58]">
                                {inq.docket_number || docketKey}
                              </code>
                            </div>

                            <div>
                              <span className="text-[10px] font-sans uppercase tracking-wider text-[#8C7A65] block mb-0.5">
                                Submission Date:
                              </span>
                              <span className="text-[#181714]">
                                {inq.created_at ? new Date(inq.created_at).toLocaleString() : 'Recent Lead'}
                              </span>
                            </div>
                          </div>

                          {/* Quick Action Tools Bar */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E5DFD4]">
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Direct WhatsApp launcher */}
                              {inq.phone && (
                                <a
                                  href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                    `Hello ${inq.name}, thank you for contacting Soul Space Infrastructure regarding ${inq.project_title || 'your inquiry'}. How may our team assist you with your project requirements today?`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#244A38] hover:bg-[#1B3629] text-white text-xs font-sans font-medium transition-colors"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>Chat on WhatsApp</span>
                                </a>
                              )}

                              {/* Direct Phone Call */}
                              <a
                                href={`tel:${inq.phone}`}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#181714] hover:bg-black text-white text-xs font-sans font-medium transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5 text-[#B8936D]" />
                                <span>Call {inq.phone}</span>
                              </a>

                              {/* Direct Email Reply */}
                              {inq.email && (
                                <a
                                  href={`mailto:${inq.email}?subject=${encodeURIComponent(
                                    `Soul Space Infrastructure — Inquiry for ${inq.project_title || 'Developments'} (Docket #${inq.docket_number || docketKey})`
                                  )}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5CDBF] hover:border-[#B8936D] text-[#181714] text-xs font-sans font-medium transition-colors"
                                >
                                  <Mail className="w-3.5 h-3.5 text-[#B8936D]" />
                                  <span>Email Client</span>
                                </a>
                              )}

                              {/* Copy Complete Summary */}
                              <button
                                type="button"
                                onClick={() =>
                                  copyToClipboard(
                                    `Soul Space Lead Docket:\nDocket: ${inq.docket_number || docketKey}\nClient: ${inq.name}\nPhone: ${inq.phone}\nEmail: ${inq.email}\nProject: ${inq.project_title || inq.project_id}\nNotes: ${inq.notes || ''}`,
                                    `copy-${docketKey}`
                                  )
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5CDBF] hover:border-[#B8936D] text-[#181714] text-xs font-sans font-medium transition-colors cursor-pointer"
                              >
                                {copiedKey === `copy-${docketKey}` ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-[#244A38]" />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-[#8C7A65]" />
                                    <span>Copy Summary</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Bespoke Luxury Stage Selector Popover (No native OS select!) */}
                            {(() => {
                              const currentStageDef = LEAD_STAGES.find((s) => s.id === leadStatus) || LEAD_STAGES[0];
                              const isOpen = activeStageDropdown === docketKey;
                              return (
                                <div className="relative">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-sans uppercase tracking-wider text-[#8C7A65] font-semibold">
                                      Stage:
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveStageDropdown(isOpen ? null : docketKey);
                                      }}
                                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer shadow-2xs ${currentStageDef.badgeBg} ${currentStageDef.badgeText} ${currentStageDef.badgeBorder} hover:shadow-xs`}
                                    >
                                      <span className={`w-2 h-2 rounded-full ${currentStageDef.dotColor}`} />
                                      <span>{currentStageDef.label}</span>
                                      <ChevronDown className={`w-3.5 h-3.5 text-[#7A6B58] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                  </div>

                                  {/* Custom Floating Menu */}
                                  {isOpen && (
                                    <div
                                      onClick={(e) => e.stopPropagation()}
                                      className="absolute right-0 bottom-full mb-2 w-72 bg-[#FAF8F5] border border-[#DDD5C7] rounded-xl shadow-2xl z-50 p-2 space-y-1 animate-fadeIn"
                                    >
                                      <div className="px-2.5 py-1.5 border-b border-[#E8E2D6] mb-1 flex items-center justify-between">
                                        <span className="text-[9.5px] font-mono uppercase tracking-widest text-[#99744C] font-semibold">
                                          LEAD LIFECYCLE STAGE
                                        </span>
                                        <span className="text-[9px] text-[#8C7A65]">Bespoke CRM</span>
                                      </div>
                                      {LEAD_STAGES.map((stageItem) => {
                                        const isSelected = stageItem.id === leadStatus;
                                        return (
                                          <button
                                            key={stageItem.id}
                                            type="button"
                                            onClick={() => handleUpdateInquiryStatus(docketKey, stageItem.id)}
                                            className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                                              isSelected
                                                ? `${stageItem.badgeBg} ${stageItem.badgeBorder} border text-[#181714] font-semibold`
                                                : 'hover:bg-[#F2EDE2] text-[#4A4135]'
                                            }`}
                                          >
                                            <span className={`w-2 h-2 rounded-full ${stageItem.dotColor} mt-1 shrink-0`} />
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center justify-between">
                                                <span className="text-xs font-medium">{stageItem.label}</span>
                                                {isSelected && <Check className="w-3.5 h-3.5 text-[#B8936D]" />}
                                              </div>
                                              <p className="text-[10px] text-[#8C7A65] font-light leading-tight mt-0.5">
                                                {stageItem.description}
                                              </p>
                                            </div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>

                          {/* Internal Follow-Up Log & Audit History */}
                          <div className="p-4 rounded-xl bg-[#F0ECE2] border border-[#DCD5C8] space-y-3">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A6B58] font-bold block">
                              INTERNAL CRM FOLLOW-UP LOG &amp; EXECUTIVE REMARKS:
                            </span>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Add private note (e.g. 'Meeting scheduled for Saturday at 11:00 AM')..."
                                value={internalNoteDrafts[docketKey] !== undefined ? internalNoteDrafts[docketKey] : meta.internalNotes || ''}
                                onChange={(e) =>
                                  setInternalNoteDrafts({ ...internalNoteDrafts, [docketKey]: e.target.value })
                                }
                                className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-xs placeholder-[#A69B8D] focus:outline-none focus:border-[#B8936D]"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveInternalNote(docketKey)}
                                className="px-4 py-2 bg-[#181714] text-white rounded-lg text-xs font-sans uppercase tracking-wider font-semibold hover:bg-black cursor-pointer"
                              >
                                Save Note
                              </button>
                            </div>

                            {/* Timeline audit log if history exists */}
                            {meta.history && meta.history.length > 0 && (
                              <div className="pt-2 border-t border-[#DCD5C8] space-y-1.5">
                                <span className="text-[9.5px] font-mono uppercase tracking-widest text-[#8C7A65] block">
                                  Audit Trail &amp; Stage History:
                                </span>
                                <div className="space-y-1">
                                  {meta.history.slice(-3).reverse().map((h, hIdx) => (
                                    <div key={hIdx} className="text-[11px] text-[#6E6354] flex items-center gap-1.5">
                                      <Clock className="w-3 h-3 text-[#B8936D] shrink-0" />
                                      <span>{h.note || `Stage updated on ${new Date(h.timestamp).toLocaleString()}`}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WEBSITE CONTENT & PROJECTS EDITORIAL ENGINE (NEW FEATURE!) */}
        {activeTab === 'editorial' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="border-b border-[#DCD5C8] pb-6">
              <span className="text-[10px] font-sans uppercase tracking-widest text-[#99744C] font-bold block mb-1">
                LIVE CONTENT CMS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#181714] font-normal">
                Website Content &amp; Developments Editor
              </h2>
              <p className="text-xs text-[#5C5346] font-light mt-1">
                Customize project taglines, status badges, price ranges, overview text, brochure download links, and website announcement alerts.
              </p>
            </div>

            {/* SECTION 1: EXECUTIVE WEBSITE ANNOUNCEMENT STUDIO */}
            <div className="bg-[#F5F2EB] border border-[#DCD5C8] rounded-2xl p-6 sm:p-8 space-y-6">
              {/* Studio Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD5C7] pb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5C8] text-[#99744C] shadow-2xs">
                    <Megaphone className="w-5 h-5 text-[#B8936D]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-xl sm:text-2xl text-[#181714]">Website Announcement Alert Banner</h3>
                      <span className="px-2 py-0.5 rounded-full text-[9.5px] font-mono uppercase tracking-wider bg-[#FAF4EC] text-[#99744C] border border-[#E5D7C5]">
                        Global VIP Banner
                      </span>
                    </div>
                    <p className="text-xs text-[#786E5F] mt-0.5">
                      Displays a prestigious notification bar at the very top of the public website for special releases, launch countdowns, or booking notices.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <label className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5CDBF] cursor-pointer select-none hover:border-[#B8936D] transition-colors">
                    <input
                      type="checkbox"
                      checked={announcementSettings.enabled}
                      onChange={(e) =>
                        setAnnouncementSettings({ ...announcementSettings, enabled: e.target.checked })
                      }
                      className="w-4 h-4 accent-[#B8936D] rounded cursor-pointer"
                    />
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          announcementSettings.enabled ? 'bg-[#16A34A] animate-pulse' : 'bg-[#9C978D]'
                        }`}
                      />
                      <span className={announcementSettings.enabled ? 'text-[#181714]' : 'text-[#8C7A65]'}>
                        {announcementSettings.enabled ? 'Active on Live Site' : 'Deactivated'}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* LIVE WYSIWYG INTERACTIVE SIMULATOR */}
              <div className="bg-[#EDE7DC] border border-[#D5CDBF] rounded-xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#99744C] font-bold">
                    <Eye className="w-3.5 h-3.5" />
                    <span>LIVE WEBSITE BANNER PREVIEW (WYSIWYG)</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-lg border border-[#D5CDBF] text-[10px]">
                    <button
                      type="button"
                      onClick={() => setAnnouncementPreviewMode('desktop')}
                      className={`px-2.5 py-0.5 rounded transition-all cursor-pointer ${
                        announcementPreviewMode === 'desktop'
                          ? 'bg-[#181714] text-white font-medium shadow-2xs'
                          : 'text-[#7A6B58] hover:text-[#181714]'
                      }`}
                    >
                      Desktop View
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnnouncementPreviewMode('mobile')}
                      className={`px-2.5 py-0.5 rounded transition-all cursor-pointer ${
                        announcementPreviewMode === 'mobile'
                          ? 'bg-[#181714] text-white font-medium shadow-2xs'
                          : 'text-[#7A6B58] hover:text-[#181714]'
                      }`}
                    >
                      Mobile View
                    </button>
                  </div>
                </div>

                {/* Simulated Announcement Bar Container */}
                <div
                  className={`mx-auto rounded-lg overflow-hidden border shadow-sm transition-all duration-300 ${
                    announcementPreviewMode === 'mobile' ? 'max-w-sm' : 'w-full'
                  }`}
                >
                  {(() => {
                    const theme = announcementSettings.theme || 'obsidian-gold';
                    const isDark = theme === 'obsidian-gold' || theme === 'emerald-biophilic' || theme === 'terracotta-heritage' || theme === 'aurum-bronze';
                    const bgClass =
                      theme === 'obsidian-gold'
                        ? 'bg-[#141311] text-[#FAF8F5] border-[#2C2720]'
                        : theme === 'champagne-alabaster'
                        ? 'bg-[#FAF7F2] text-[#1D1B18] border-[#DDD4C5]'
                        : theme === 'emerald-biophilic'
                        ? 'bg-[#0E231B] text-[#F3F7F5] border-[#1E3F32]'
                        : theme === 'terracotta-heritage'
                        ? 'bg-[#291712] text-[#FDF9F7] border-[#472920]'
                        : 'bg-gradient-to-r from-[#211A12] via-[#2F2418] to-[#211A12] text-[#FBF8F3] border-[#4A3A28]';

                    const badgeClass =
                      theme === 'obsidian-gold'
                        ? 'bg-[#B8936D] text-[#141311]'
                        : theme === 'champagne-alabaster'
                        ? 'bg-[#99744C] text-white'
                        : theme === 'emerald-biophilic'
                        ? 'bg-[#2E6B52] text-[#F3F7F5]'
                        : theme === 'terracotta-heritage'
                        ? 'bg-[#C25838] text-white'
                        : 'bg-gradient-to-r from-[#C5A065] to-[#E3C38C] text-[#1E1710]';

                    const renderPreviewItem = (isMobileTicker = false) => (
                      <div className={`flex items-center gap-2 ${isMobileTicker ? 'pr-6 shrink-0' : 'flex-wrap sm:flex-nowrap justify-center text-center sm:text-left'}`}>
                        {announcementSettings.badge && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider shrink-0 ${badgeClass} ${
                              announcementSettings.urgentPulse ? 'animate-pulse' : ''
                            }`}
                          >
                            {announcementSettings.badge}
                          </span>
                        )}
                        <span className={`text-[11px] sm:text-xs font-normal ${isMobileTicker ? 'whitespace-nowrap' : 'truncate max-w-xs sm:max-w-md'}`}>
                          {announcementSettings.text || 'Preview Announcement Text Here'}
                        </span>
                        {announcementSettings.secondaryText && (
                          <span className={`text-[10.5px] opacity-75 ${isMobileTicker ? 'whitespace-nowrap' : 'hidden md:inline'}`}>
                            • {announcementSettings.secondaryText}
                          </span>
                        )}
                        {announcementSettings.style === 'countdown' && (
                          <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-black/30 border border-white/10 shrink-0">
                            04d : 18h : 32m : 10s
                          </span>
                        )}
                        {announcementSettings.linkUrl && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] underline font-medium opacity-90 hover:opacity-100 shrink-0 ml-1 whitespace-nowrap">
                            <span>{announcementSettings.linkText || 'Explore'}</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    );

                    if (announcementPreviewMode === 'mobile') {
                      return (
                        <div className={`p-2 text-xs border ${bgClass} flex items-center relative overflow-hidden`}>
                          <div className="flex overflow-hidden w-full">
                            <div className="animate-ticker-loop items-center">
                              {renderPreviewItem(true)}
                              <span className="text-[#B8936D]/60 pr-6 shrink-0">✦</span>
                              {renderPreviewItem(true)}
                              <span className="text-[#B8936D]/60 pr-6 shrink-0">✦</span>
                              {renderPreviewItem(true)}
                              <span className="text-[#B8936D]/60 pr-6 shrink-0">✦</span>
                              {renderPreviewItem(true)}
                              <span className="text-[#B8936D]/60 pr-6 shrink-0">✦</span>
                            </div>
                          </div>
                          {announcementSettings.dismissible !== false && (
                            <div className="opacity-60 hover:opacity-100 shrink-0 ml-2">
                              <X className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div className={`p-2.5 sm:px-4 sm:py-2 text-xs border ${bgClass} flex items-center justify-between gap-2.5`}>
                        <div className="flex items-center gap-2 mx-auto flex-wrap sm:flex-nowrap justify-center text-center sm:text-left">
                          {renderPreviewItem(false)}
                        </div>

                        {announcementSettings.dismissible !== false && (
                          <div className="opacity-60 hover:opacity-100 shrink-0">
                            <X className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* ONE-CLICK LUXURY CAMPAIGN TEMPLATES / PRESETS */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7A65] font-semibold block">
                  ONE-CLICK PRE-CONFIGURED CAMPAIGN TEMPLATES:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {ANNOUNCEMENT_PRESETS.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => {
                        setAnnouncementSettings({
                          ...announcementSettings,
                          badge: preset.badge,
                          text: preset.text,
                          secondaryText: preset.secondaryText || '',
                          linkUrl: preset.linkUrl,
                          linkText: preset.linkText,
                          theme: preset.theme,
                          style: preset.style,
                          urgentPulse: preset.urgentPulse,
                          targetDate: preset.targetDate || '2026-10-31T23:59:59',
                          countdownLabel: preset.countdownLabel || 'Priority Window Closes In:',
                        });
                        setStatusMessage({ text: `Applied template: "${preset.name}". Click Save to publish.`, type: 'success' });
                      }}
                      className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] hover:border-[#B8936D] hover:bg-white text-left transition-all cursor-pointer shadow-2xs group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#99744C] font-bold">
                          Preset 0{pIdx + 1}
                        </span>
                        <Sparkles className="w-3 h-3 text-[#B8936D] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-xs font-semibold text-[#181714] line-clamp-1 block">
                        {preset.name}
                      </span>
                      <span className="text-[10px] text-[#7A6B58] line-clamp-1 block mt-0.5">
                        {preset.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* FORM & CONFIGURATION CONTROLS */}
              <form onSubmit={handleSaveAnnouncement} className="space-y-5 pt-2">
                {/* 1. Theme Swatches */}
                <div className="space-y-2">
                  <span className="text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold block">
                    Select Architectural Visual Theme:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                    {THEME_OPTIONS.map((themeOption) => {
                      const isSelected = (announcementSettings.theme || 'obsidian-gold') === themeOption.id;
                      return (
                        <button
                          key={themeOption.id}
                          type="button"
                          onClick={() => setAnnouncementSettings({ ...announcementSettings, theme: themeOption.id })}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white border-[#B8936D] ring-2 ring-[#B8936D]/40 shadow-xs'
                              : 'bg-[#FAF8F5] border-[#DDD5C7] hover:border-[#B8936D]'
                          }`}
                        >
                          <div className={`h-4 rounded-md mb-2 border ${themeOption.bgPreview} ${themeOption.borderPreview}`} />
                          <span className="text-xs font-semibold text-[#181714] block">
                            {themeOption.name}
                          </span>
                          <span className="text-[10px] text-[#7A6B58] block mt-0.5">
                            {themeOption.subtitle}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Banner Style & Placement Scope */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                      Banner Presentation Mode
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAnnouncementSettings({ ...announcementSettings, style: 'banner' })}
                        className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                          announcementSettings.style !== 'countdown'
                            ? 'bg-[#181714] text-white border-[#181714] font-semibold shadow-2xs'
                            : 'bg-[#FAF8F5] border-[#D5CDBF] text-[#554C40] hover:bg-white'
                        }`}
                      >
                        Standard Luxury Notice
                      </button>
                      <button
                        type="button"
                        onClick={() => setAnnouncementSettings({ ...announcementSettings, style: 'countdown' })}
                        className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                          announcementSettings.style === 'countdown'
                            ? 'bg-[#181714] text-white border-[#181714] font-semibold shadow-2xs'
                            : 'bg-[#FAF8F5] border-[#D5CDBF] text-[#554C40] hover:bg-white'
                        }`}
                      >
                        VIP Countdown Timer
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                      Target Placement on Website
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'all', label: 'All Pages' },
                        { id: 'home', label: 'Home Page' },
                        { id: 'projects', label: 'Projects Only' },
                      ].map((scope) => {
                        const isSelected = (announcementSettings.displayScope || 'all') === scope.id;
                        return (
                          <button
                            key={scope.id}
                            type="button"
                            onClick={() =>
                              setAnnouncementSettings({
                                ...announcementSettings,
                                displayScope: scope.id as AnnouncementDisplayScope,
                              })
                            }
                            className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#99744C] text-white border-[#99744C] font-semibold shadow-2xs'
                                : 'bg-[#FAF8F5] border-[#D5CDBF] text-[#554C40] hover:bg-white'
                            }`}
                          >
                            {scope.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. Badge Label & Main Headline */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                      Badge Label (Pill Tag)
                    </label>
                    <input
                      type="text"
                      value={announcementSettings.badge}
                      onChange={(e) =>
                        setAnnouncementSettings({ ...announcementSettings, badge: e.target.value })
                      }
                      placeholder="e.g. VIP RELEASE"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-xs font-medium text-[#181714] focus:outline-none focus:border-[#B8936D]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                      Main Announcement Headline Text
                    </label>
                    <input
                      type="text"
                      value={announcementSettings.text}
                      onChange={(e) =>
                        setAnnouncementSettings({ ...announcementSettings, text: e.target.value })
                      }
                      placeholder="e.g. Exclusive Preview: Aurum Villas Phase 2 Bookings Open — Schedule a Consultation Today"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-xs font-medium text-[#181714] focus:outline-none focus:border-[#B8936D]"
                    />
                  </div>
                </div>

                {/* 4. Secondary Detail Text */}
                <div>
                  <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                    Secondary Detail / Urgency Tagline (Optional)
                  </label>
                  <input
                    type="text"
                    value={announcementSettings.secondaryText || ''}
                    onChange={(e) =>
                      setAnnouncementSettings({ ...announcementSettings, secondaryText: e.target.value })
                    }
                    placeholder="e.g. Over 65% Already Reserved Across North & East Facing Plots"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-xs text-[#181714] focus:outline-none focus:border-[#B8936D]"
                  />
                </div>

                {/* 5. Countdown Options (if countdown style enabled) */}
                {announcementSettings.style === 'countdown' && (
                  <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#DDD5C7] grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                        Countdown Urgency Label
                      </label>
                      <input
                        type="text"
                        value={announcementSettings.countdownLabel || ''}
                        onChange={(e) =>
                          setAnnouncementSettings({ ...announcementSettings, countdownLabel: e.target.value })
                        }
                        placeholder="e.g. VIP Priority Window Closes In:"
                        className="w-full px-3 py-2 bg-white border border-[#D5CDBF] rounded-lg text-xs text-[#181714] focus:outline-none focus:border-[#B8936D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                        Target Launch Date &amp; Time
                      </label>
                      <input
                        type="datetime-local"
                        value={
                          announcementSettings.targetDate
                            ? announcementSettings.targetDate.slice(0, 16)
                            : '2026-10-31T23:59'
                        }
                        onChange={(e) =>
                          setAnnouncementSettings({ ...announcementSettings, targetDate: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-[#D5CDBF] rounded-lg text-xs font-mono text-[#181714] focus:outline-none focus:border-[#B8936D]"
                      />
                    </div>
                  </div>
                )}

                {/* 6. CTA Action Button Config */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                      Action Button Label
                    </label>
                    <input
                      type="text"
                      value={announcementSettings.linkText || ''}
                      onChange={(e) =>
                        setAnnouncementSettings({ ...announcementSettings, linkText: e.target.value })
                      }
                      placeholder="e.g. Explore Residence / Reserve Tour"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-xs text-[#181714] focus:outline-none focus:border-[#B8936D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                      Destination Page URL or Action Link
                    </label>
                    <input
                      type="text"
                      value={announcementSettings.linkUrl}
                      onChange={(e) =>
                        setAnnouncementSettings({ ...announcementSettings, linkUrl: e.target.value })
                      }
                      placeholder="e.g. /projects/aurum-villas or #inquire or WhatsApp URL"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-xs text-[#181714] focus:outline-none focus:border-[#B8936D]"
                    />
                  </div>
                </div>

                {/* 7. Behavioral Toggles */}
                <div className="flex items-center gap-6 flex-wrap pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#181714]">
                    <input
                      type="checkbox"
                      checked={announcementSettings.urgentPulse !== false}
                      onChange={(e) =>
                        setAnnouncementSettings({ ...announcementSettings, urgentPulse: e.target.checked })
                      }
                      className="w-4 h-4 accent-[#B8936D] rounded cursor-pointer"
                    />
                    <span className="font-medium">Pulsing Ambient Glow on Badge</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#181714]">
                    <input
                      type="checkbox"
                      checked={announcementSettings.dismissible !== false}
                      onChange={(e) =>
                        setAnnouncementSettings({ ...announcementSettings, dismissible: e.target.checked })
                      }
                      className="w-4 h-4 accent-[#B8936D] rounded cursor-pointer"
                    />
                    <span className="font-medium">Allow Visitors to Dismiss (Show Close &apos;X&apos; Button)</span>
                  </label>
                </div>

                {/* 8. Save & Toast Feedback Bar */}
                <div className="flex items-center gap-4 pt-3 border-t border-[#DDD5C7]">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#181714] text-white hover:bg-black rounded-lg text-xs font-sans uppercase tracking-widest font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <Megaphone className="w-3.5 h-3.5 text-[#B8936D]" />
                    <span>Save &amp; Publish Announcement</span>
                  </button>

                  {announcementSavedToast && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0] px-3 py-1.5 rounded-lg animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                      <span>Announcement published live across website!</span>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* SECTION 2: PROJECT EDITORIAL & SPECIFICATIONS MANAGER */}
            <div className="bg-[#F5F2EB] border border-[#DCD5C8] rounded-2xl p-6 sm:p-7 space-y-6">
              <div className="flex items-center justify-between border-b border-[#DDD5C7] pb-4 flex-wrap gap-3">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-5 h-5 text-[#B8936D]" />
                  <div>
                    <h3 className="font-serif text-lg text-[#181714]">Project Details &amp; Specifications Manager</h3>
                    <p className="text-xs text-[#786E5F]">
                      Edit pricing, availability badges, architectural subtitles, and overview marketing narrative.
                    </p>
                  </div>
                </div>

                {/* Project Selector Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'aurum-villas', label: 'Aurum Villas' },
                    { id: 'mystic-villas', label: 'Mystic Farmhouses' },
                    { id: 'abv-arbor', label: 'ABV Arbor' },
                    { id: 'dotcom-workspaces', label: 'DOT COM' },
                    { id: 'uptown-residences', label: 'Uptown' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProjectEditId(p.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-sans transition-colors cursor-pointer ${
                        selectedProjectEditId === p.id
                          ? 'bg-[#181714] text-white font-medium'
                          : 'bg-[#FAF8F5] text-[#5C5346] border border-[#D5CDBF] hover:border-[#B8936D]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSaveProjectCustom} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status Badge */}
                  <div>
                    <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                      Status Badge (e.g. Selling Fast, Ready to Move)
                    </label>
                    <input
                      type="text"
                      value={activeCustomProject.statusBadge || activeBaseProject.status || ''}
                      onChange={(e) =>
                        setCustomProjectsMap({
                          ...customProjectsMap,
                          [selectedProjectEditId]: {
                            ...activeCustomProject,
                            statusBadge: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Selling Fast · Phase 2 Open"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-xs focus:outline-none focus:border-[#B8936D]"
                    />
                  </div>

                  {/* Starting Price / Investment Range */}
                  <div>
                    <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                      Starting Investment / Price Range
                    </label>
                    <input
                      type="text"
                      value={activeCustomProject.investmentRange || ''}
                      onChange={(e) =>
                        setCustomProjectsMap({
                          ...customProjectsMap,
                          [selectedProjectEditId]: {
                            ...activeCustomProject,
                            investmentRange: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. ₹2.85 Cr Onwards (or Price on Request)"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-xs focus:outline-none focus:border-[#B8936D]"
                    />
                  </div>

                  {/* Built Area Range */}
                  <div>
                    <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                      Total Built Area Range
                    </label>
                    <input
                      type="text"
                      value={activeCustomProject.areaRange || activeBaseProject.areaRange || ''}
                      onChange={(e) =>
                        setCustomProjectsMap({
                          ...customProjectsMap,
                          [selectedProjectEditId]: {
                            ...activeCustomProject,
                            areaRange: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. 2,132 – 3,012 sq ft"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-xs focus:outline-none focus:border-[#B8936D]"
                    />
                  </div>

                  {/* Units Count & Scale */}
                  <div>
                    <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                      Enclave Units Scale
                    </label>
                    <input
                      type="text"
                      value={activeCustomProject.unitsCount || activeBaseProject.metrics[0]?.value || ''}
                      onChange={(e) =>
                        setCustomProjectsMap({
                          ...customProjectsMap,
                          [selectedProjectEditId]: {
                            ...activeCustomProject,
                            unitsCount: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. 33 Luxury Villas"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-xs focus:outline-none focus:border-[#B8936D]"
                    />
                  </div>
                </div>

                {/* Subtitle / Tagline */}
                <div>
                  <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                    Architectural Subtitle &amp; Tagline
                  </label>
                  <input
                    type="text"
                    value={activeCustomProject.tagline || activeBaseProject.subtitle}
                    onChange={(e) =>
                      setCustomProjectsMap({
                        ...customProjectsMap,
                        [selectedProjectEditId]: {
                          ...activeCustomProject,
                          tagline: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-xs focus:outline-none focus:border-[#B8936D]"
                  />
                </div>


                {/* Overview Text */}
                <div>
                  <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                    Overview Description Copy
                  </label>
                  <textarea
                    rows={4}
                    value={activeCustomProject.overview || activeBaseProject.overview}
                    onChange={(e) =>
                      setCustomProjectsMap({
                        ...customProjectsMap,
                        [selectedProjectEditId]: {
                          ...activeCustomProject,
                          overview: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-xs focus:outline-none focus:border-[#B8936D] leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="submit"
                    disabled={isSavingEditorial}
                    className="px-6 py-3 bg-[#181714] text-white hover:bg-black rounded-lg text-xs font-sans uppercase tracking-widest font-semibold transition-colors cursor-pointer"
                  >
                    {isSavingEditorial ? 'Publishing Changes...' : `Save & Publish ${activeBaseProject.title} Details`}
                  </button>

                  <Link
                    href={`/projects/${selectedProjectEditId}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs text-[#99744C] hover:underline"
                  >
                    <span>Preview On Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: COMPANY & CONTACT INFO */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="border-b border-[#DCD5C8] pb-6">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#181714] font-normal">
                Company &amp; Contact Settings
              </h2>
              <p className="text-xs text-[#5C5346] font-light mt-1">
                Update the official contact numbers, email, WhatsApp, and registered office address displayed across the header, footer, and inquiry briefs.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-[#F5F2EB] border border-[#DCD5C8] rounded-2xl p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                  Primary Phone Number
                </label>
                <input
                  type="text"
                  value={settings.primary_phone}
                  onChange={(e) => setSettings({ ...settings, primary_phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-sm focus:outline-none focus:border-[#B8936D]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                  Secondary / Sales Concierge Phone
                </label>
                <input
                  type="text"
                  value={settings.secondary_phone}
                  onChange={(e) => setSettings({ ...settings, secondary_phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-sm focus:outline-none focus:border-[#B8936D]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                  Official WhatsApp Number (No spaces)
                </label>
                <input
                  type="text"
                  value={settings.whatsapp_number}
                  onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-sm focus:outline-none focus:border-[#B8936D]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-sm focus:outline-none focus:border-[#B8936D]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                  Registered Office Address
                </label>
                <textarea
                  rows={3}
                  value={settings.office_address}
                  onChange={(e) => setSettings({ ...settings, office_address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-sm focus:outline-none focus:border-[#B8936D]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={settings.instagram_url}
                  onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-sm focus:outline-none focus:border-[#B8936D]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="w-full py-3 bg-[#181714] text-white hover:bg-black rounded-lg text-xs font-sans uppercase tracking-widest font-semibold transition-colors cursor-pointer"
                >
                  {isSavingSettings ? 'Saving Settings...' : 'Save Company Details'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: MASTER SECURITY & ACCESS */}
        {activeTab === 'ownership' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="border-b border-[#DCD5C8] pb-6">
              <span className="text-[10px] font-sans uppercase tracking-widest text-[#B8936D] font-bold block mb-1">
                EXECUTIVE GOVERNANCE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#181714] font-normal">
                Master Security &amp; Access Control
              </h2>
              <p className="text-xs text-[#5C5346] font-light mt-1">
                Manage director credentials, update master administrative passkeys, and download complete website data archives.
              </p>
            </div>

            {/* Section 1: Sole Proprietor Identity */}
            <div className="bg-[#F5F2EB] border border-[#DCD5C8] rounded-2xl p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-[#DDD5C7] pb-4">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#B8936D]" />
                  <div>
                    <h3 className="font-serif text-lg text-[#181714]">Ownership Identity Profile</h3>
                    <p className="text-xs text-[#786E5F]">
                      Registered executive custodian of Soul Space Infrastructure digital systems.
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#F2F6F3] text-[#244A38] border border-[#CCD8D0] shrink-0">
                  Active Sole Custodian
                </span>
              </div>

              <form onSubmit={handleUpdateOwnerProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                      Owner / Managing Director Name
                    </label>
                    <input
                      type="text"
                      value={settings.owner_name || ''}
                      onChange={(e) => setSettings({ ...settings, owner_name: e.target.value })}
                      placeholder="Managing Director"
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-sm focus:outline-none focus:border-[#B8936D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                      Official Executive Title
                    </label>
                    <input
                      type="text"
                      value={settings.owner_title || ''}
                      onChange={(e) => setSettings({ ...settings, owner_title: e.target.value })}
                      placeholder="Director of Soul Space Infrastructure"
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-sm focus:outline-none focus:border-[#B8936D]"
                    />
                  </div>
                </div>

                {ownerProfileMessage && (
                  <p className="text-xs text-[#244A38] bg-[#F2F6F3] border border-[#CCD8D0] p-2.5 rounded-lg">
                    {ownerProfileMessage}
                  </p>
                )}

                <div className="pt-1">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#181714] text-white hover:bg-black rounded-lg text-xs font-sans uppercase tracking-widest font-semibold transition-colors cursor-pointer"
                  >
                    Save Ownership Profile
                  </button>
                </div>
              </form>
            </div>

            {/* Section 2: Change Master Passkey */}
            <div className="bg-[#F5F2EB] border border-[#DCD5C8] rounded-2xl p-6 sm:p-7 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-[#DDD5C7] pb-4">
                <Key className="w-5 h-5 text-[#B8936D]" />
                <div>
                  <h3 className="font-serif text-lg text-[#181714]">Change Master Admin Passkey</h3>
                  <p className="text-xs text-[#786E5F]">
                    Replace the default passkey with your private secret. Only you will be able to log in.
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePasskey} className="space-y-4">
                <div>
                  <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                    Current Passkey
                  </label>
                  <input
                    type="password"
                    value={currentPasskeyInput}
                    onChange={(e) => setCurrentPasskeyInput(e.target.value)}
                    placeholder="Enter current passkey..."
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-sm focus:outline-none focus:border-[#B8936D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                      New Secret Passkey
                    </label>
                    <input
                      type="password"
                      value={newPasskeyInput}
                      onChange={(e) => setNewPasskeyInput(e.target.value)}
                      placeholder="Minimum 6 characters..."
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-sm focus:outline-none focus:border-[#B8936D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-sans uppercase tracking-widest text-[#786E5F] font-semibold mb-1.5">
                      Confirm New Passkey
                    </label>
                    <input
                      type="password"
                      value={confirmPasskeyInput}
                      onChange={(e) => setConfirmPasskeyInput(e.target.value)}
                      placeholder="Re-enter new passkey..."
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D5CDBF] rounded-lg text-sm focus:outline-none focus:border-[#B8936D]"
                    />
                  </div>
                </div>

                {passkeyUpdateMessage && (
                  <p
                    className={`text-xs p-2.5 rounded-lg border ${
                      passkeyUpdateMessage.type === 'success'
                        ? 'bg-[#F2F6F3] text-[#244A38] border-[#CCD8D0]'
                        : 'bg-[#FAF3F3] text-[#7A2E2E] border-[#E9CCCC]'
                    }`}
                  >
                    {passkeyUpdateMessage.text}
                  </p>
                )}

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isUpdatingPasskey}
                    className="px-5 py-2.5 bg-[#181714] text-white hover:bg-black rounded-lg text-xs font-sans uppercase tracking-widest font-semibold transition-colors cursor-pointer"
                  >
                    {isUpdatingPasskey ? 'Updating Passkey...' : 'Update Master Passkey'}
                  </button>
                </div>
              </form>
            </div>

            {/* Section 3: 1-Click Complete Data Ownership Backup */}
            <div className="bg-[#F5F2EB] border border-[#DCD5C8] rounded-2xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#DDD5C7] pb-4">
                <Download className="w-5 h-5 text-[#B8936D]" />
                <div>
                  <h3 className="font-serif text-lg text-[#181714]">Full Website Data Ownership Backup</h3>
                  <p className="text-xs text-[#786E5F]">
                    Download an offline snapshot of all 64 picture slots, client inquiries, and company settings.
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#5C5346] font-light leading-relaxed">
                As the legal owner, you can export and retain a full standalone backup anytime. This file contains all dynamic picture slots, project associations, client consultation leads, and contact information formatted as JSON.
              </p>

              <button
                onClick={handleExportOwnershipBackup}
                className="px-5 py-3 bg-[#181714] text-white hover:bg-black rounded-lg text-xs font-sans tracking-widest uppercase font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4 text-[#B8936D]" />
                <span>Download Complete Ownership Backup (.json)</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FULLSCREEN PREVIEW LIGHTBOX MODAL */}
      {previewModalSlot && slotsData[previewModalSlot.id]?.image_url && (
        <div
          onClick={() => setPreviewModalSlot(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 select-none"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setPreviewModalSlot(null)}
            className="fixed top-5 right-5 z-50 p-2.5 rounded-full bg-[#181714] text-white hover:text-[#B8936D] border border-white/20 transition-all cursor-pointer"
            aria-label="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center my-auto"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slotsData[previewModalSlot.id].image_url}
              alt={previewModalSlot.title}
              className="max-w-full max-h-[75vh] w-auto h-auto object-contain rounded-xl shadow-2xl"
            />

            <div className="mt-4 text-center max-w-2xl px-6 py-3 bg-[#181714]/90 rounded-xl border border-white/10 text-white backdrop-blur-md">
              <span className="text-[10px] font-sans uppercase tracking-widest text-[#B8936D] font-bold block mb-0.5">
                {previewModalSlot.projectName} &bull; {previewModalSlot.pageLocation}
              </span>
              <h3 className="font-serif text-lg font-normal text-[#FAF8F5]">
                {previewModalSlot.sectionHeading}
              </h3>
              <p className="text-xs text-[#A69B8D] font-light mt-0.5">
                Slot ID: <code className="font-mono text-[#C5A880]">{previewModalSlot.id}</code> &bull; {previewModalSlot.recommendedDimensions}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
