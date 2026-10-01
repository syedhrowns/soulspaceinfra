'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] text-[#181715] px-6 text-center selection:bg-[#B8936D] selection:text-white">
      <div className="mb-8">
        <BrandLogo variant="nav" />
      </div>
      <span className="text-xs font-sans tracking-[0.25em] text-[#B8936D] uppercase mb-3 font-semibold">
        ERROR 404
      </span>
      <h1 className="font-serif text-4xl sm:text-5xl mb-4 font-normal text-[#181715]">
        Spatial Coordinate Not Found
      </h1>
      <p className="font-sans text-xs sm:text-sm text-[#7A7061] max-w-md mb-8 leading-relaxed font-light">
        The requested architectural detail or development project does not exist within the archive.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#181715] text-white text-xs uppercase tracking-[0.18em] font-medium rounded-full transition-colors shadow-none border border-[#2D2A26] hover:border-[#CBB8A0] min-h-[44px]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Developments</span>
      </Link>
    </main>
  );
}
