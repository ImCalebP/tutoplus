import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata("Politique de confidentialité", "Découvrez comment Tuto+ recueille, utilise et protège les renseignements des élèves, des parents et des tuteurs.", '/politique-de-confidentialite', true);
export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
