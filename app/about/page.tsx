import React from 'react';
import { Metadata } from 'next';
import { AboutPageClient } from '@/components/AboutPageClient';

export const metadata: Metadata = {
  title: 'Practice Monograph & Architectural Story | Soul Space Infrastructure',
  description:
    'Discover the architectural story, founding chronicle (2016), civil engineering standards, and five signature residential & commercial works of Soul Space Infrastructure in Coimbatore, Tamil Nadu.',
  alternates: {
    canonical: 'https://soulspaceinfra.com/about',
  },
  openGraph: {
    title: 'About Soul Space Infrastructure — Practice Monograph & Portfolio Folio',
    description:
      'Quality, functionality, and enduring value. Established in 2016 in Coimbatore. Explore our signature residential villas, commercial workspaces, and biophilic nature retreats.',
    url: 'https://soulspaceinfra.com/about',
    type: 'website',
    images: [
      {
        url: '/brand/logo.png',
        width: 1200,
        height: 630,
        alt: 'About Soul Space Infrastructure — Practice Monograph & Architectural Story',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Soul Space Infrastructure — Practice Monograph',
    description: 'Founding chronicle, civil engineering standards, and signature developments across Coimbatore.',
    images: ['/brand/logo.png'],
  },
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': 'https://soulspaceinfra.com/about#webpage',
      url: 'https://soulspaceinfra.com/about',
      name: 'Practice Monograph & Architectural Story | Soul Space Infrastructure',
      description: 'Discover the architectural story, founding chronicle (2016), civil engineering standards, and signature residential & commercial works of Soul Space Infrastructure in Coimbatore, Tamil Nadu.',
      isPartOf: {
        '@id': 'https://soulspaceinfra.com/#website',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://soulspaceinfra.com/about#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://soulspaceinfra.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'About Practice',
          item: 'https://soulspaceinfra.com/about',
        },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <AboutPageClient />
    </>
  );
}
