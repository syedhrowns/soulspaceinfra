'use client';

import dynamic from 'next/dynamic';

const InfraChatbot = dynamic(
  () => import('@/components/InfraChatbot').then((m) => m.InfraChatbot),
  { ssr: false }
);

export function InfraChatbotWrapper() {
  return <InfraChatbot />;
}
