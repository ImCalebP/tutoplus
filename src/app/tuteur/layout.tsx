import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata("Espace tuteur", "Élèves et séances de tutorat Tuto+.", '/tuteur', false);
export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
