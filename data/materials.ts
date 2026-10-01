export interface Material {
  id: string;
  name: string;
  category: string;
  origin: string;
  density: string;
  embodiedCarbon: string;
  finish: string;
  tactileDescription: string;
  provenance: string;
  structuralUtility: string;
  agingBehavior: string;
  image: string;
  featuredIn: string[];
}

export const MATERIALS: Material[] = [
  {
    id: 'teak-joinery',
    name: 'Seasoned Teakwood & Melamine Veneer',
    category: 'Natural Timber',
    origin: 'First-Quality Seasoned Teak, India',
    density: '660 kg/m³',
    embodiedCarbon: 'Sustainable Timber Standard',
    finish: 'Melamine Polished Matte / Yale Digital Locks',
    tactileDescription: 'Warm natural grain with hand-finished melamine polish and Yale digital locking.',
    provenance: 'Selected seasoned hardwood frames crafted with precision mortise joinery.',
    structuralUtility: 'Main entrance doors, internal frames, and acoustic suite divisions.',
    agingBehavior: 'Deepens in honey-gold patina over decades with superior humidity resistance.',
    image: '',
    featuredIn: ['MYSTIC', 'AURUM', 'ABV ARBOR', 'UPTOWN'],
  },
  {
    id: 'pt-concrete',
    name: 'Post-Tensioned (PT) M25 Concrete',
    category: 'Structural Core',
    origin: 'Automated Batching Plants, Tamil Nadu',
    density: '2,450 kg/m³',
    embodiedCarbon: 'Optimized Cement Ratio',
    finish: 'Monolithic Smooth Shuttered / Column-Free',
    tactileDescription: 'High-density monolithic finish enabling expansive column-free interior spans.',
    provenance: 'High-tensile steel tendon prestressing within automated M25/M30 concrete matrices.',
    structuralUtility: 'Column-free IT office floor plates, seismic foundations, and cantilever decks.',
    agingBehavior: 'Permanent structural rigidity with zero deflection over multi-decade cycles.',
    image: '',
    featuredIn: ['MYSTIC', 'DOTCOM', 'ABV ARBOR', 'AURUM'],
  },
  {
    id: 'vitrified-slabs',
    name: '800x800mm Vitrified & Laminated Slabs',
    category: 'Floor Finishes',
    origin: 'Premium Ceramic Tile Hubs, India',
    density: '2,350 kg/m³',
    embodiedCarbon: 'Low VOC Certified',
    finish: 'Nano-Polished Gloss & Satin Matte',
    tactileDescription: 'Silky, dust-resistant surface with ultra-fine rectified joint lines.',
    provenance: 'High-pressure hydraulic pressed porcelain with anti-skid bathroom surfaces.',
    structuralUtility: 'Expansive living lounges, master bedrooms, and executive lobby corridors.',
    agingBehavior: 'Stain-proof, scratch-resistant finish retaining showroom luster for decades.',
    image: '',
    featuredIn: ['MYSTIC', 'AURUM', 'ABV ARBOR', 'UPTOWN'],
  },
  {
    id: 'brass-sanitary',
    name: 'Kohler & Roca Engineered Brassware',
    category: 'Fixtures & Fittings',
    origin: 'International Certified Manufacturing',
    density: '8,400 kg/m³',
    embodiedCarbon: '100% Recyclable Brass Body',
    finish: 'Polished Chrome & PVD Brushed Finishes',
    tactileDescription: 'Heavy-gauge solid brass fixtures with ceramic disc cartridges for smooth actuation.',
    provenance: 'Precision European engineered CP fittings with water-saving aerators.',
    structuralUtility: 'Pressurized hydro-pneumatic water loops, master baths, and wellness suites.',
    agingBehavior: 'Corrosion-free PVD electroplated surfaces resistant to mineral scaling.',
    image: '',
    featuredIn: ['MYSTIC', 'AURUM', 'ABV ARBOR', 'DOTCOM'],
  },
];
