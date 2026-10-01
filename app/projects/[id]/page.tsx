import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProjectBySlug, FULL_PROJECTS_DATA } from '@/data/projectDataFull';
import { ProjectPageClient } from '@/components/ProjectPageClient';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return [
    { id: 'aurum-villas' },
    { id: 'abv-arbor' },
    { id: 'dotcom-workspaces' },
    { id: 'mystic-villas' },
    { id: 'uptown-residences' },
    { id: 'aurum' },
    { id: 'abv' },
    { id: 'dotcom' },
    { id: 'dot-com' },
    { id: 'mystic' },
    { id: 'uptown' },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = getProjectBySlug(id);

  if (!project) {
    return {
      title: 'Project Details | Soul Space Infrastructure',
    };
  }

  const canonicalUrl = `https://soulspaceinfra.com/projects/${id}`;

  return {
    title: `${project.title} — ${project.address} | Soul Space Infrastructure`,
    description: `${project.title} located at ${project.address}. ${project.subtitle} High-end residential & commercial architectural portfolio in Coimbatore.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${project.title} | ${project.address} | Soul Space Infrastructure`,
      description: `${project.subtitle} Located at ${project.address}`,
      url: canonicalUrl,
      type: 'article',
      images: [
        {
          url: '/brand/logo.png',
          width: 1200,
          height: 630,
          alt: `${project.title} — Soul Space Infrastructure`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | Soul Space Infrastructure`,
      description: project.subtitle,
      images: ['/brand/logo.png'],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = getProjectBySlug(id);

  if (!project) {
    notFound();
  }

  const propertyType =
    project.typology === 'commercial'
      ? 'CommercialProperty'
      : project.slug.includes('arbor') || project.slug.includes('uptown')
      ? 'ApartmentComplex'
      : 'SingleFamilyResidence';

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'RealEstateListing',
        '@id': `https://soulspaceinfra.com/projects/${id}#listing`,
        name: `${project.title} — Luxury ${project.typologyLabel || 'Development'} in Coimbatore`,
        alternateName: project.title,
        description: `${project.subtitle} Located at ${project.address}. ${project.tagline}. Vasthu compliance: ${project.vasthuCompliance}. Designed and constructed by Soul Space Infrastructure.`,
        url: `https://soulspaceinfra.com/projects/${id}`,
        image: 'https://soulspaceinfra.com/brand/logo.png',
        datePosted: '2025-01-01',
        mainEntity: {
          '@type': propertyType,
          '@id': `https://soulspaceinfra.com/projects/${id}#property`,
          name: project.title,
          description: project.subtitle,
          address: {
            '@type': 'PostalAddress',
            streetAddress: project.address,
            addressLocality: 'Coimbatore',
            addressRegion: 'Tamil Nadu',
            postalCode: '641028',
            addressCountry: 'IN',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 11.0168,
            longitude: 76.9558,
          },
          floorSize: {
            '@type': 'QuantitativeValue',
            value: project.areaSqFt,
            unitCode: 'FTK',
            unitText: 'SQFT',
          },
          amenityFeature: project.amenitiesList?.map((amenity) => ({
            '@type': 'LocationFeatureSpecification',
            name: amenity,
            value: true,
          })) || [],
          additionalProperty: [
            {
              '@type': 'PropertyValue',
              name: 'Vasthu Compliance',
              value: project.vasthuCompliance,
            },
            {
              '@type': 'PropertyValue',
              name: 'Architectural Style',
              value: 'Contemporary Vedic Vasthu & Biophilic Tropical Modernism',
            },
            {
              '@type': 'PropertyValue',
              name: 'Developer & Turnkey Contractor',
              value: 'Soul Space Infrastructure',
            },
            ...(project.unitsCount
              ? [
                  {
                    '@type': 'PropertyValue',
                    name: 'Units Configuration',
                    value: project.unitsCount,
                  },
                ]
              : []),
          ],
        },
        offers: {
          '@type': 'Offer',
          businessFunction: 'http://purl.org/goodrelations/v1#Sell',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          validFrom: '2025-01-01',
          seller: {
            '@type': 'RealEstateAgent',
            '@id': 'https://soulspaceinfra.com/#business',
            name: 'Soul Space Infrastructure',
            telephone: '+919677771331',
            url: 'https://soulspaceinfra.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'No 5/2, Hindustan Avenue, Nava india road, Sowripalayam post',
              addressLocality: 'Coimbatore',
              addressRegion: 'Tamil Nadu',
              postalCode: '641028',
              addressCountry: 'IN',
            },
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://soulspaceinfra.com/projects/${id}#breadcrumb`,
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
            name: 'Developments',
            item: 'https://soulspaceinfra.com/#works',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: project.title,
            item: `https://soulspaceinfra.com/projects/${id}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <ProjectPageClient project={project} />
    </>
  );
}
