import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata("Connexion", "Connectez-vous à votre espace Tuto+.", '/connexion', false);
export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
