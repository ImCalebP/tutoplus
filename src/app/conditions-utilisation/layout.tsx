import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata("Conditions d’utilisation", "Consultez les conditions d’utilisation des services de tutorat et d’orthopédagogie Tuto+.", '/conditions-utilisation', true);
export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
