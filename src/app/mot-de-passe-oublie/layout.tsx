import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata("Mot de passe oublié", "Demandez un lien de réinitialisation pour votre compte Tuto+.", '/mot-de-passe-oublie', false);
export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
