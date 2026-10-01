export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface InfraResponse {
  reply: string;
  suggestedPrompts?: string[];
  actionLink?: {
    label: string;
    url: string;
  };
}

/**
 * Intelligent deterministic response engine for Infra.
 * Answers queries with deep domain precision, executive poise, and exact specifications.
 */
export function generateInfraResponse(userMessage: string, history: ChatMessage[] = []): InfraResponse {
  const query = userMessage.toLowerCase().trim();

  // 1. GREETINGS & INTRODUCTIONS
  if (
    query.match(/^(hi|hello|hey|good\s*(morning|afternoon|evening)|namaste|who are you|what is infra)/i) &&
    query.length < 35
  ) {
    return {
      reply:
        'Good day. I am **Infra**, your architectural concierge for **Soul Space Infrastructure**.\n\nHow may I assist you today?',
      suggestedPrompts: [
        'Tell me about Aurum Villas',
        'What is the 80-20 concept at Mystic?',
        'ABV Arbor near Race Course',
        'Vastu principles used',
      ],
    };
  }

  // 2. PROJECT: AURUM VILLAS
  if (query.includes('aurum') || (query.includes('villa') && query.includes('vilankurichi')) || query.includes('33 villa')) {
    return {
      reply:
        '**AURUM — A World of Luxury Awaits**\n\nLocated in **Vilankurichi, Coimbatore** (SF No. 189, 190 Ashok J Nagar, backside of RJ Matriculation School), **Aurum** is an exclusive gated enclave of **33 three-bedroom luxury villas** designed with 100% Vastu compliance.\n\n**Architectural Typologies & Floor Areas:**\n• **East Facing:** 2,132 Sq.Ft. (198 m²)\n• **West Facing:** 2,883 Sq.Ft. (268 m²)\n• **South Facing:** 2,788 Sq.Ft. (259 m²)\n• **North Facing:** 3,012 Sq.Ft. (280 m²)\n\n**Curated Amenities & Infrastructure:**\n• Fully furnished clubhouse featuring a modern gym, banquet hall, snooker court, table tennis, and party lawn.\n• Private swimming pool and manicured paver avenues.\n• 62.5 KVA central Genset backup (1.5 KVA dedicated per villa + complete common lighting).\n• Treated R.O. water distribution via an automated hydro-pneumatic pressurized network.\n• Compounded campus with two secure entrance gates and 24x7 CCTV surveillance.\n\nWould you like me to guide you to the complete floor plans, or would you prefer to schedule a private site visit?',
      suggestedPrompts: [
        'Explore Aurum Floor Plans',
        'Schedule a site visit to Aurum',
        'Download Aurum brochure',
        'What are the nearby landmarks?',
      ],
      actionLink: {
        label: 'Explore Aurum Villas Monograph',
        url: '/projects/aurum-villas',
      },
    };
  }

  // 3. PROJECT: ABV ARBOR
  if (
    query.includes('arbor') ||
    query.includes('abv') ||
    (query.includes('flat') && query.includes('race course')) ||
    query.includes('ramanathapuram')
  ) {
    return {
      reply:
        '**ABV ARBOR — Sign Up for an Unrivalled Home Experience**\n\nSituated in **Ramanathapuram, Coimbatore** (Plot No. 18 G Square Blue Crest, 250m from Gem Hospital), **ABV Arbor** is an elite boutique residence positioned just **5 minutes from the prestigious Race Course**.\n\n**Development Highlights:**\n• **Typology:** Stilt + 5 floors RCC framed monolith with isolated footing foundations.\n• **Exclusivity:** Limited to only **12 spacious luxury residences** across 3 BHK and 4 BHK configurations.\n\n**Unit Configurations & Areas:**\n• **Unit A (3 BHK East Facing):** 2,217 Sq.Ft. (UDS: 870 Sq.Ft.)\n• **Unit B (4 BHK East Facing):** 2,395 Sq.Ft. (UDS: 939 Sq.Ft.)\n• **Unit C (3 BHK North Facing):** 2,178 Sq.Ft. (UDS: 854 Sq.Ft.)\n\n**Distinctive Amenities:**\n• Private landscaped terrace gardens and children’s play zone.\n• State-of-the-art fitness center and community party hall.\n• Reticulated piped gas network and high-pressure water supply.\n• 1 kVA power backup for each apartment and 24x7 security.\n• 100% Vastu and Manaiyadi Shastra certified spatial harmony.\n\nWould you like to examine the unit layouts or schedule an executive walkthrough?',
      suggestedPrompts: [
        'View ABV Arbor 3D Isometrics',
        'Schedule a visit to ABV Arbor',
        'Proximity to Race Course & Schools',
        'Tell me about material specifications',
      ],
      actionLink: {
        label: 'Explore ABV Arbor Details',
        url: '/projects/abv-arbor',
      },
    };
  }

  // 4. PROJECT: DOT COM COMMERCIAL WORKSPACES
  if (
    query.includes('dotcom') ||
    query.includes('dot com') ||
    query.includes('office') ||
    query.includes('workspace') ||
    query.includes('commercial') ||
    query.includes('pn palayam') ||
    query.includes('pt slab')
  ) {
    return {
      reply:
        "**DOT COM — The City's Premier Tech Address**\n\nLocated at **No. 58B, Parameshwaran Layout Road, PN Palayam, Coimbatore**, **Dot Com** is a premier commercial development positioned just 5 minutes from Avinashi Road, Nava India Road, and Lakshmi Mills.\n\n**Structural Engineering & Design:**\n• **Post-Tensioned (PT) Concrete Slabs:** Prestressed structural tendons completely eliminate interior column clutter, offering tenants total layout adaptability.\n• **Ceiling Clearance:** Expansive **11’6” floor-to-floor height** with abundant natural illumination and wide lobbies.\n• **Scale:** 16 expertly planned corporate workspaces.\n\n**Workspace Sizes:**\n• **Unit 101 (West Facing):** 2,054 Sq.Ft. (UDS: 797 Sq.Ft.)\n• **Unit 102 (North Facing):** 1,316 Sq.Ft. (UDS: 511 Sq.Ft.)\n• **Unit 103 (North Facing):** 1,623 Sq.Ft. (UDS: 629 Sq.Ft.)\n• **Unit 104 (East Facing):** 1,966 Sq.Ft. (UDS: 763 Sq.Ft.)\n\n**Commercial Amenities:**\n• Rooftop dining area and breakout terrace.\n• Well-equipped unisex rooftop gymnasium.\n• Automated stacked vehicular parking with dedicated bays for specially-abled visitors.\n• 8-passenger high-speed elevator and 1 kVA power backup per office.\n\nWould you like to review commercial leasing or purchase opportunities at Dot Com?",
      suggestedPrompts: [
        'View Dot Com Floor Plans',
        'Learn about PT Slab engineering',
        'Schedule a commercial consultation',
        'Locality & Connectivity of Dot Com',
      ],
      actionLink: {
        label: 'Explore Dot Com Commercial Suites',
        url: '/projects/dotcom-workspaces',
      },
    };
  }

  // 5. PROJECT: SOULSPACE UPTOWN
  if (
    query.includes('uptown') ||
    query.includes('eachanari') ||
    query.includes('110 unit') ||
    query.includes('budget') ||
    query.includes('apartment')
  ) {
    return {
      reply:
        '**SOULSPACE UPTOWN — Luxury Space at an Unbeatable Price**\n\nSituated at **SF No. 629/10A Chettipalayam Road, Eachanari, Coimbatore**, **Uptown** is a master-planned community of **110 contemporary apartments** (1 BHK, 2 BHK & 3 BHK) located just **500 meters from the historic 500-year-old Eachanari Vinayagar Temple**.\n\n**Community Highlights:**\n• Thoughtfully engineered to provide attainable luxury without compromising on civil construction quality.\n• Average typical unit scale: ~1,450 Sq.Ft. (135 m²).\n• Solid block masonry with seismic-resistant RCC foundations.\n\n**World-Class Lifestyle Amenities:**\n• Swimming pool and landscaped party lawn.\n• Fully equipped indoor fitness center and community banquet hall.\n• Private on-campus Home Theatre for residents.\n• Dedicated Children’s Park and recreational spaces.\n• Eco-infrastructure: On-site Sewage Treatment Plant (STP), reticulated piped gas, and EV charging ports.\n• 24x7 security surveillance and DG generator backup for elevators and common areas.\n\n**Location Advantage:** 5 minutes to Rathinam Techpark, Larsen & Toubro, and Karpagam Academy of Higher Education.\n\nMay I assist you with floor plans or pricing feasibility for Uptown?',
      suggestedPrompts: [
        'View Uptown 1, 2 & 3 BHK Plans',
        'Check Uptown Amenities',
        'Inquire about Uptown pricing',
        'Distance to Rathinam Techpark & L&T',
      ],
      actionLink: {
        label: 'Explore Soul Space Uptown',
        url: '/projects/uptown-residences',
      },
    };
  }

  // 6. PROJECT: MYSTIC VILLAS (80-20 CONCEPT)
  if (
    query.includes('mystic') ||
    query.includes('80-20') ||
    query.includes('80/20') ||
    query.includes('farmhouse') ||
    query.includes('plantation') ||
    query.includes('coconut') ||
    query.includes('semmedu') ||
    query.includes('isha') ||
    query.includes('adiyogi') ||
    query.includes('siruvani')
  ) {
    return {
      reply:
        '**MYSTIC — Close to Nature, Near to Your World**\n\nPositioned in **Semmedu, Coimbatore**, just **10 minutes from the Isha Yoga Centre and the iconic 112-foot Adiyogi Statue**, **Mystic** is a tranquil biophilic sanctuary spread across a 2.5-acre heavenly coconut plantation.\n\n**The Signature 80-20 Concept:**\n• **80% Natural Plantation:** Preserving the lush coconut groves, pure air, and indigenous flora.\n• **20% Built Luxury Farmhouse:** Crafting a bespoke, private residential retreat.\n\n**The Offering:**\n• **Land:** 22 Cents+ of fertile plantation land.\n• **Residence:** A tailor-made **2,500 Sq.Ft. luxury farmhouse villa** complete with your own **private plunge pool** and customizable organic farming or garden zones.\n• **Siruvani Water:** Blessed with direct access to pure Siruvani river bed water—widely celebrated for its natural sweetness and mineral purity—just 2 minutes from the river bed.\n\n**Environment & Sanctuary:** Nestled in the foothills of the Western Ghats with panoramic views toward the Velliangiri Hills, offering unmatched tranquility, family health, and cognitive rejuvenation.\n\nWould you like to schedule an escorted private visit to Mystic?',
      suggestedPrompts: [
        'Schedule a private visit to Mystic',
        'Siruvani water quality & access',
        'Mystic Farmhouse specifications',
        'Distance from Coimbatore Airport & City',
      ],
      actionLink: {
        label: 'Explore Mystic Plantation Retreat',
        url: '/projects/mystic-villas',
      },
    };
  }

  // 7. VASTU SHASTRA & MANAIYADI SHASTRA
  if (
    query.includes('vastu') ||
    query.includes('vasthu') ||
    query.includes('manaiyadi') ||
    query.includes('mandala') ||
    query.includes('physics') ||
    query.includes('science behind') ||
    query.includes('facing') ||
    query.includes('direction')
  ) {
    return {
      reply:
        '**The Environmental Physics of Vastu Shastra at Soul Space**\n\nAt Soul Space, we regard Vastu Shastra not as superstition, but as India’s ancient empirical science of **bioclimatic architecture** and **passive solar physics**, specifically calibrated for the tropical subcontinent.\n\nEvery project is planned in strict accordance with **100% Manaiyadi Shastra** guidelines across four fundamental physical principles:\n\n1. **Heliocentric & Solar Geometry:**\n   • North-East (Eshanya): Captures purifying morning ultraviolet rays for natural indoor sanitation.\n   • South-West (Nairuthi): Fortified with dense structural thermal mass to insulate living spaces from harsh afternoon infrared solar radiation.\n\n2. **Geomagnetic Grid Alignment:**\n   • Primary sleeping axes are synchronized with Earth’s North-South magnetic poles, mitigating electromagnetic drag on blood hemoglobin to promote deeper, restorative REM sleep.\n\n3. **Aerodynamic Stack Ventilation:**\n   • The central geometric core (*Brahmasthanam*) is kept unweighted or open, functioning as a natural thermal chimney that draws hot air upward and pulls cooling ambient breezes through living suites.\n\n4. **Pancha Bhoota Spatial Zoning:**\n   • Balances Water (*Jal*) in the NE, Fire (*Agni*) in the culinary SE, Earth (*Prithvi*) in the structural SW, Air (*Vayu*) in the NW, and Space (*Akash*) in the center.\n\nEvery blueprint is verified with certified Vastu and Manaiyadi consultants before ground breaking.',
      suggestedPrompts: [
        'How does Aurum incorporate Vastu?',
        'What is Manaiyadi Shastra?',
        'Does Dot Com follow commercial Vastu?',
        'Tell me about material specifications',
      ],
    };
  }

  // 8. MATERIALS & ENGINEERING SPECIFICATIONS
  if (
    query.includes('material') ||
    query.includes('concrete') ||
    query.includes('m25') ||
    query.includes('steel') ||
    query.includes('teak') ||
    query.includes('kohler') ||
    query.includes('roca') ||
    query.includes('tile') ||
    query.includes('structure') ||
    query.includes('specification')
  ) {
    return {
      reply:
        '**Soul Space Engineering & Specification Standards**\n\nWe select our materials not for transient cosmetic appeal, but for generational endurance, seismic safety, and tactile luxury:\n\n• **Structural Concrete:** Certified M25 / M30 Grade automated batched concrete with isolated and strap footings, paired with corrosion-resistant high-yield steel rebar.\n• **Post-Tensioned (PT) Slabs:** Commercial and selective residential floor plates engineered with prestressed steel tendons for column-free expanses.\n• **Joinery & Timber:** First-quality seasoned teakwood frames with melamine polish, paired with German Yale / Dorma smart digital locks.\n• **Flooring:** 800x800mm nano-polished vitrified slabs, imported laminated wooden flooring in master bedrooms, and anti-skid ceramic tiles in wet zones.\n• **Sanitaryware & Hydraulics:** European wall-hung sanitary fixtures by Kohler, Roca, and American Standard, supported by treated R.O. filtration and hydro-pneumatic pressurized distribution loops.\n• **Electro-Mechanical:** Fire-resistant ISO copper wiring (Finolex/Polycab), modular Legrand/GM switches, 100% DG generator backup circuits, and dedicated EV charging bays.\n\nWhich material or engineering aspect would you like to explore further?',
      suggestedPrompts: [
        'Tell me about Teakwood joinery',
        'Post-Tensioned PT Concrete benefits',
        'Kohler and Roca sanitary fixtures',
        'Book a technical site walkthrough',
      ],
    };
  }

  // 9. COMPANY HISTORY, LEADERSHIP, & TRACK RECORD
  if (
    query.includes('about') ||
    query.includes('company') ||
    query.includes('founder') ||
    query.includes('who are') ||
    query.includes('history') ||
    query.includes('experience') ||
    query.includes('track record') ||
    query.includes('coimbatore')
  ) {
    return {
      reply:
        '**About Soul Space Infrastructure**\n\n• **Founded:** Established in 2016 in Coimbatore, Tamil Nadu, originally as Soulspace Infrastructure before growing into Soul Space.\n• **Track Record:** 250,000+ Square Feet of delivered and ongoing residential, commercial, and biophilic developments across Coimbatore.\n• **Operating Philosophy:** *"Quality, Time and Safety are our topmost priorities."*\n• **Management Style:** We intentionally operate with a hands-on management approach. Our managing directors and principal engineers maintain personal supervision on every construction site, bridging the gap between architectural concept and structural execution.\n• **Specialization:** Gated luxury villa enclaves (Aurum), boutique city apartments (ABV Arbor), commercial tech workspaces (Dot Com), modern residential communities (Uptown), and biophilic plantation farmhouses (Mystic).\n\n**Registered Office:**\nNo 5/2, Hindustan Avenue, Nava India Road, Sowripalayam Post, Coimbatore - 641028, Tamil Nadu, India.',
      suggestedPrompts: [
        'Explore the Practice Monograph',
        'Contact Executive Leadership',
        'View all 5 developments',
        'Schedule a consultation',
      ],
      actionLink: {
        label: 'Read Full Practice Monograph',
        url: '/about',
      },
    };
  }

  // 10. PRICING, BUDGET & COMMISSION ESTIMATE
  if (
    query.includes('price') ||
    query.includes('cost') ||
    query.includes('rate') ||
    query.includes('sqft rate') ||
    query.includes('budget') ||
    query.includes('investment') ||
    query.includes('estimate') ||
    query.includes('payment')
  ) {
    return {
      reply:
        '**Project Investment & Financial Advisory**\n\nOur pricing is customized to each development’s typology, orientation, land parcel, and bespoke finishing schedule:\n\n• **AURUM (Vilankurichi):** 33 Luxury Villas ranging from 2,132 to 3,012 Sq.Ft. Pricing varies based on East, West, South, or North facing orientation and private garden allocations.\n• **ABV ARBOR (Ramanathapuram):** 12 Boutique Luxury Flats (2,178 – 2,395 Sq.Ft.) situated 5 minutes from Race Course.\n• **DOT COM (PN Palayam):** 16 Column-Free Commercial IT Suites (1,316 – 2,054 Sq.Ft.) with high capital appreciation and rental yield potential.\n• **UPTOWN (Eachanari):** 110 Value-Engineered contemporary apartments (1, 2 & 3 BHK) priced attractively for families and tech professionals.\n• **MYSTIC (Semmedu):** 22 Cents+ coconut plantation plots with custom 2,500 Sq.Ft. farmhouses and private plunge pools.\n\nTo receive an exact price schedule, financial breakdown, and availability matrix, our sales desk is at your disposal:\n📞 **Direct Line:** +91 91591 33331 / +91 96777 71331\n💬 **WhatsApp:** Available 24/7 for instant quotation dossiers.',
      suggestedPrompts: [
        'Open Commission Estimator',
        'Connect with Sales on WhatsApp',
        'Request Aurum pricing sheet',
        'Request Mystic price schedule',
      ],
      actionLink: {
        label: 'Launch Feasibility Estimator',
        url: '/#inquiries',
      },
    };
  }

  // 11. SITE VISIT, CONTACT & BOOKING
  if (
    query.includes('visit') ||
    query.includes('appointment') ||
    query.includes('book') ||
    query.includes('contact') ||
    query.includes('phone') ||
    query.includes('call') ||
    query.includes('whatsapp') ||
    query.includes('location') ||
    query.includes('address') ||
    query.includes('email')
  ) {
    return {
      reply:
        '**Private Site Inspections & Consultations**\n\nWe would be honored to host you for a private, guided walkthrough of our properties or welcome you to our registered headquarters in Coimbatore.\n\n**Contact Concierge Desk:**\n• **Direct Phone / WhatsApp:** [+91 91591 33331](tel:+919159133331) / [+91 96777 71331](tel:+919677771331)\n• **WhatsApp Direct:** [Chat on WhatsApp](https://wa.me/919159133331)\n\n**Registered Office Address:**\nSoul Space Infrastructure,\nNo 5/2, Hindustan Avenue, Nava India Road,\nSowripalayam Post, Coimbatore - 641028,\nTamil Nadu, India.\n\n**Social Channels:**\n• Instagram: [@soul.space.projects](https://www.instagram.com/soul.space.projects/)\n• Facebook: [@soulspaceinfra](https://www.facebook.com/soulspaceinfra)\n\nPlease let me know your preferred date, time, and development of interest, and I will ensure our senior engineering team is prepared to receive you.',
      suggestedPrompts: [
        'Chat on WhatsApp (+91 91591 33331)',
        'Schedule a visit to Aurum',
        'Schedule a visit to Mystic',
        'View Office on Map',
      ],
    };
  }

  // 12. FALLBACK / GENERAL QUERY
  return {
    reply:
      `Thank you for your inquiry. As the Executive Architectural Concierge for **Soul Space Infrastructure**, I have complete access to all specifications, architectural layouts, Vastu Shastra engineering, and site visit schedules for our developments across Coimbatore.\n\nMay I assist you with details regarding:\n\n1. **AURUM:** 33 Gated Luxury Villas in Vilankurichi (2,132 – 3,012 Sq.Ft.)\n2. **ABV ARBOR:** 12 Luxury Residences 5 min from Race Course\n3. **DOT COM:** 16 Column-Free IT Workspaces in PN Palayam\n4. **SOULSPACE UPTOWN:** 110 Contemporary Apartments in Eachanari\n5. **MYSTIC:** 2.5-Acre Coconut Plantation Farmhouses near Isha Adiyogi\n6. **Vastu Shastra & Materiality Standards**\n\nPlease let me know what you would like to explore, or speak directly with our directors at **+91 91591 33331**.`,
    suggestedPrompts: [
      'Tell me about Aurum Villas',
      'What is the 80-20 concept at Mystic?',
      'Vastu principles used',
      'Contact Sales Concierge',
    ],
  };
}
