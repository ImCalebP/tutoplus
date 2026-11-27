import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata("Espace famille", "Suivez votre inscription et vos séances Tuto+.", '/tableau-de-bord', false);
export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
