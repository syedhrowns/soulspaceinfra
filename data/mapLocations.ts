export interface MapLocation {
  id: string;
  projectId?: string;
  code: string;
  title: string;
  subtitle: string;
  category: 'studio' | 'residential' | 'commercial' | 'farmhouse';
  categoryLabel: string;
  coordinates: [number, number]; // [lat, lng]
  address: string;
  areaSqFt?: string;
  highlights: string[];
  googleMapsUrl: string;
}

export const MAP_LOCATIONS: MapLocation[] = [
  {
    id: 'studio-hq',
    code: 'HQ-01',
    title: 'SOUL SPACE HEADQUARTERS',
    subtitle: 'Principal Studio & Administrative HQ',
    category: 'studio',
    categoryLabel: 'Studio HQ',
    coordinates: [11.0116, 76.9930],
    address: 'No 5/2, Hindustan Avenue, Nava India Road, Sowripalayam, Coimbatore - 641028',
    areaSqFt: 'Central Design Studio',
    highlights: ['Client Experience Lounge', 'Architectural Drafting Studio', 'Materiality & Sample Gallery'],
    googleMapsUrl: 'https://maps.google.com/?q=11.0116,76.9930',
  },
  {
    id: 'aurum-villas',
    projectId: 'aurum-villas',
    code: 'LOC-01',
    title: 'AURUM LUXURY VILLAS',
    subtitle: 'Collection of 33 Three-Bedroom Luxury Villas',
    category: 'residential',
    categoryLabel: 'Gated Villa Enclave',
    coordinates: [11.0543, 77.0084],
    address: 'SF No.189,190 Ashok J Nagar, Vilankurichi, Coimbatore - 641035',
    areaSqFt: '2,132 – 3,012 Sq.Ft. per Villa',
    highlights: ['33 Gated Luxury Villas', 'East, West, South & North Facing', '100% Vasthu Compliant'],
    googleMapsUrl: 'https://maps.google.com/?q=11.0543,77.0084',
  },
  {
    id: 'abv-arbor',
    projectId: 'abv-arbor',
    code: 'LOC-02',
    title: 'ABV ARBOR RESIDENCES',
    subtitle: '12 Exclusive Contemporary Luxury Apartments',
    category: 'residential',
    categoryLabel: 'Luxury Apartments',
    coordinates: [10.9961, 76.9850],
    address: 'Plot No.18, G Square Blue Crest, Ramanathapuram, Coimbatore - 641045',
    areaSqFt: '2,395 Sq.Ft. per Residence',
    highlights: ['12 Exclusive Luxury Flats', '5 Mins to Race Course', 'Landscaped Terrace Garden'],
    googleMapsUrl: 'https://maps.google.com/?q=10.9961,76.9850',
  },
  {
    id: 'dotcom-workspaces',
    projectId: 'dotcom-workspaces',
    code: 'LOC-03',
    title: 'DOT COM WORKSPACES',
    subtitle: '16 Column-Free Commercial Tech Suites',
    category: 'commercial',
    categoryLabel: 'Commercial Workspaces',
    coordinates: [11.0152, 76.9745],
    address: 'No.58B, Parameshwaran Layout Road, PN Palayam, Coimbatore - 641037',
    areaSqFt: '2,054 Sq.Ft. Workspaces',
    highlights: ['100% Column-Free PT Slabs', '11’6” Clear Floor Height', 'Stacked Car Parking'],
    googleMapsUrl: 'https://maps.google.com/?q=11.0152,76.9745',
  },
  {
    id: 'mystic-villas',
    projectId: 'mystic-villas',
    code: 'LOC-04',
    title: 'MYSTIC NATURE ESTATE',
    subtitle: '22+ Cents Coconut Plantation & Luxury Farmhouse',
    category: 'farmhouse',
    categoryLabel: 'Nature Farmhouses',
    coordinates: [10.9702, 76.7328],
    address: 'Semmedu, Near Adiyogi & Isha Yoga Centre, Coimbatore - 641114',
    areaSqFt: '22+ Cents Land • 2,500 Sq.Ft.',
    highlights: ['Private Plunge Pool', 'Surplus Siruvani Water', '10 Mins to Isha Yoga'],
    googleMapsUrl: 'https://maps.google.com/?q=10.9702,76.7328',
  },
  {
    id: 'uptown-residences',
    projectId: 'uptown-residences',
    code: 'LOC-05',
    title: 'UPTOWN RESIDENCES',
    subtitle: '110 Thoughtfully Crafted Budget Apartments',
    category: 'residential',
    categoryLabel: 'Residential Community',
    coordinates: [10.9168, 76.9691],
    address: 'SF No.629/10A Chettipalayam Road, Eachanari, Coimbatore - 641021',
    areaSqFt: '1,450 Sq.Ft. Apartments',
    highlights: ['110 Crafted Residences', '500m to Eachanari Temple', 'Pool, Gym & Home Theatre'],
    googleMapsUrl: 'https://maps.google.com/?q=10.9168,76.9691',
  },
];
