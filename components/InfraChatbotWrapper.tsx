'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const InfraChatbot = dynamic(
  () => import('@/components/InfraChatbot').then((m) => m.InfraChatbot),
  { ssr: false }
);

export function InfraChatbotWrapper() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <InfraChatbot />;
}
