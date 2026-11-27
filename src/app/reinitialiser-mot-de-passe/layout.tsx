import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata("Réinitialiser le mot de passe", "Choisissez un nouveau mot de passe pour votre compte Tuto+.", '/reinitialiser-mot-de-passe', false);
export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
