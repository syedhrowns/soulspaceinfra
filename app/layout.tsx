import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import { SmoothScroll } from '@/components/SmoothScroll';
import { PageLoader } from '@/components/PageLoader';
import { WhatsAppConcierge } from '@/components/WhatsAppConcierge';
import { SupabaseSync } from '@/components/SupabaseSync';
import './globals.css';

import { InfraChatbotWrapper } from '@/components/InfraChatbotWrapper';
import { AnnouncementBar } from '@/components/AnnouncementBar';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FAF7F2',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://soulspaceinfra.com'),
  alternates: {
    canonical: 'https://soulspaceinfra.com',
  },
  title: 'SOUL SPACE INFRASTRUCTURE — Premium Residential & Commercial Developments',
  description: 'Exclusive Independent Luxury Villas, Luxury Apartments, Budget Apartments, Commercial Workspaces, and Farmhouse Villas by Soul Space Infrastructure across Coimbatore.',
  keywords: [
    'Soul Space Infrastructure',
    'Independent Luxury Villas Coimbatore',
    'Luxury Apartments Coimbatore',
    'Budget Apartments Coimbatore',
    'Commercial Workspaces Coimbatore',
    'Farmhouse Villas Coimbatore',
    'Aurum Villas',
    'ABV Arbor',
    'Dotcom Workspaces',
    'Mystic Villas',
    'Uptown Residences',
    'civil construction Coimbatore',
    'Vasthu architecture Tamil Nadu',
    'Manaiyadi Shastra construction',
  ],
  authors: [{ name: 'Soul Space Infrastructure', url: 'https://soulspaceinfra.com' }],
  creator: 'Soul Space Infrastructure',
  publisher: 'Soul Space Infrastructure',
  manifest: '/site.webmanifest',
  icons: {
    icon: '/icon.png',
    apple: '/brand/logo-mark.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'SOUL SPACE INFRASTRUCTURE — Premium Residential & Commercial Developments',
    description: 'Exclusive Independent Luxury Villas, Luxury Apartments, Budget Apartments, Commercial Workspaces, and Farmhouse Villas by Soul Space Infrastructure across Coimbatore.',
    url: 'https://soulspaceinfra.com',
    type: 'website',
    siteName: 'Soul Space Infrastructure',
    locale: 'en_IN',
    images: [
      {
        url: '/brand/logo.png',
        width: 1200,
        height: 630,
        alt: 'Soul Space Infrastructure — Architecture, Civil Engineering & Developments',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOUL SPACE INFRASTRUCTURE — Premium Residential & Commercial Developments',
    description: 'Exclusive Independent Luxury Villas, Luxury Apartments, Budget Apartments, Commercial Workspaces, and Farmhouse Villas by Soul Space Infrastructure across Coimbatore.',
    images: ['/brand/logo.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['RealEstateAgent', 'GeneralContractor', 'HomeAndConstructionBusiness', 'Organization'],
      '@id': 'https://soulspaceinfra.com/#business',
      name: 'SOUL SPACE INFRASTRUCTURE',
      legalName: 'Soul Space Infrastructure',
      url: 'https://soulspaceinfra.com',
      logo: 'https://soulspaceinfra.com/brand/logo.png',
      image: 'https://soulspaceinfra.com/brand/logo.png',
      description: 'Independent Luxury Villas, Luxury Apartments, Budget Apartments, Commercial Workspaces, and Farmhouse Villas in Coimbatore, Tamil Nadu.',
      foundingDate: '2016',
      priceRange: '₹₹₹₹',
      telephone: '+919677771331',
      email: 'soulspaceinfrastructure@gmail.com',
      sameAs: [
        'https://www.instagram.com/soul.space.projects/',
        'https://www.facebook.com/soulspaceinfra'
      ],
      areaServed: [
        {
          '@type': 'City',
          name: 'Coimbatore',
        },
        {
          '@type': 'State',
          name: 'Tamil Nadu',
        },
        {
          '@type': 'Country',
          name: 'India',
        },
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'No 5/2, Hindustan Avenue, Nava india road, Sowripalayam post',
        addressLocality: 'Coimbatore',
        addressRegion: 'Tamil Nadu',
        postalCode: '641028',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 11.0028,
        longitude: 76.9926,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '19:00',
        },
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+919677771331',
          contactType: 'sales and architectural consultation',
          areaServed: ['IN', 'AE', 'US', 'SG'],
          availableLanguage: ['English', 'Tamil'],
        },
        {
          '@type': 'ContactPoint',
          telephone: '+919159133331',
          contactType: 'customer support and site inquiries',
          areaServed: 'IN',
          availableLanguage: ['English', 'Tamil'],
        },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Soul Space Developments',
        itemListElement: [
          {
            '@type': 'OfferCatalog',
            name: 'Aurum Luxury Villas',
            description: 'Ultra-luxury modern minimalist villas and estates in Saravanampatti / Kalapatti, Coimbatore.',
            url: 'https://soulspaceinfra.com/projects/aurum-villas',
          },
          {
            '@type': 'OfferCatalog',
            name: 'ABV Arbor',
            description: 'Biophilic luxury gated community residences on Trichy Road, Coimbatore.',
            url: 'https://soulspaceinfra.com/projects/abv-arbor',
          },
          {
            '@type': 'OfferCatalog',
            name: 'Dotcom Workspaces',
            description: 'Grade-A column-free IT and commercial workspaces at Nava India, Coimbatore.',
            url: 'https://soulspaceinfra.com/projects/dotcom-workspaces',
          },
          {
            '@type': 'OfferCatalog',
            name: 'Mystic Nature Villas',
            description: 'Luxury 80-20 concept plantation farmhouses near Isha & Siruvani, Semmedu, Coimbatore.',
            url: 'https://soulspaceinfra.com/projects/mystic-villas',
          },
          {
            '@type': 'OfferCatalog',
            name: 'Uptown Residences',
            description: 'Prestige duplex residences and penthouses in Coimbatore.',
            url: 'https://soulspaceinfra.com/projects/uptown-residences',
          },
        ],
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://soulspaceinfra.com/#website',
      url: 'https://soulspaceinfra.com',
      name: 'SOUL SPACE INFRASTRUCTURE',
      description: 'Architecture, Civil Engineering & Luxury Real Estate Developments in Coimbatore.',
      publisher: {
        '@id': 'https://soulspaceinfra.com/#business',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable} scroll-smooth`}>
      <head>
        <link rel="preload" href="/brand/logo-mark.png" as="image" />
        <style
          dangerouslySetInnerHTML={{
            __html: `body{background-color:#FAF7F2;color:#1D1814;margin:0;padding:0;}img,svg,video{max-width:100%;height:auto;}#global-page-loader{position:fixed!important;inset:0!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;background-color:#F7F5F0!important;z-index:999999!important;display:flex!important;align-items:center!important;justify-content:center!important;}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-[#F7F5F0] text-[#1D1B18] selection:bg-[#B8936D] selection:text-white min-h-screen" suppressHydrationWarning>
        <AnnouncementBar />
        <SupabaseSync />
        <PageLoader />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <WhatsAppConcierge />
        <InfraChatbotWrapper />
      </body>
    </html>
  );
}

