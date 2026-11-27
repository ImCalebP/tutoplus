import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata("Inscription au tutorat", "Inscrivez votre enfant aux services de tutorat et d’orthopédagogie Tuto+.", '/inscription', false);
export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
