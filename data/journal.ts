export interface JournalEssay {
  id: string;
  issue: string;
  title: string;
  subtitle: string;
  author: string;
  role: string;
  date: string;
  readTime: string;
  abstract: string;
  content: string[];
  tags: string[];
}

export const JOURNAL_ESSAYS: JournalEssay[] = [
  {
    id: 'civil-foundations-quality',
    issue: 'ISSUE NO. 08',
    title: 'Quality, Time & Safety: The Three Pillars of Enduring Civil Construction',
    subtitle: 'Why hands-on project management and structural discipline create lifelong client trust',
    author: 'Soul Space Leadership',
    role: 'Managing Directors & Chief Civil Engineers',
    date: 'Spring 2026',
    readTime: '6 min read',
    abstract: 'An in-depth perspective on how direct partner involvement, rigid material quality checks, and rigorous safety protocols deliver projects on schedule without compromise.',
    content: [
      'Since our inception in 2016, Soul Space Infrastructures has grown by maintaining a strict, hands-on management philosophy where directors personally oversee site execution.',
      'Quality in construction is not merely about aesthetic finishes; it begins with soil testing, concrete mix batching, steel tensile verification, and waterproofing integrity.',
      'We believe that transparency, adherence to promised delivery timelines, and unbending safety standards are what turn houses into generational family heirlooms and commercial buildings into thriving corporate hubs.',
    ],
    tags: ['Civil Construction', 'Project Management', 'Structural Integrity', 'Quality Assurance'],
  },
  {
    id: 'vastu-manaiyadi-architecture',
    issue: 'ISSUE NO. 07',
    title: 'Harmonizing Vastu & Manaiyadi Shastra with Modern Structural Design',
    subtitle: 'Aligning ancient spatial geometry with contemporary light and natural ventilation',
    author: 'Soul Space Design Bureau',
    role: 'Vastu & Architectural Planning Division',
    date: 'Winter 2025',
    readTime: '7 min read',
    abstract: 'How Soul Space integrates 100% Vasthu and Manaiyadi dimensional compliance into high-efficiency modern layouts across Aurum Villas and ABV Arbor.',
    content: [
      'Vasthu Shastra is fundamentally the science of light, solar orientation, wind flow, and cosmic energy distribution across domestic living spaces.',
      'In every residential enclave we craft, from individual 3-BHK villas at Aurum to exclusive luxury apartments at ABV Arbor, room placements and entrances are calculated according to authentic Manaiyadi measurements.',
      'By integrating these timeless principles with open balconies and cross-ventilation corridors, we create homes that promote positive vitality, tranquility, and lasting prosperity.',
    ],
    tags: ['Vasthu Compliance', 'Manaiyadi Shastra', 'Spatial Geometry', 'Residential Design'],
  },
  {
    id: 'pt-slab-workspaces',
    issue: 'ISSUE NO. 06',
    title: 'Column-Free Architecture: The Post-Tensioned (PT) Engineering Advantage',
    subtitle: 'How prestressed concrete empowers flexible corporate IT and tech environments',
    author: 'Soul Space Engineering Team',
    role: 'Structural & Commercial Practice Leads',
    date: 'Autumn 2025',
    readTime: '5 min read',
    abstract: 'Analyzing the structural mechanics behind Dotcom Workspaces and how post-tensioned concrete eliminates interior column clutter for maximum tenant utility.',
    content: [
      'Modern IT and tech businesses require agile workspaces that can easily be reconfigured for collaborative teams, private executive suites, or open hot-desking.',
      'By utilizing Post-Tensioned (PT) high-tensile steel tendon engineering, we achieve spans that eliminate restrictive internal columns while maintaining exceptional floor-to-floor ceiling heights.',
      'This structural mastery provides corporate tenants with boundless spatial versatility, acoustic dampening between floors, and accelerated construction turnarounds.',
    ],
    tags: ['PT Slabs', 'Commercial Architecture', 'Column-Free Design', 'Structural Engineering'],
  },
];
