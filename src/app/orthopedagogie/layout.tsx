import type { ReactNode } from 'react';
import { pageMetadata, SITE_URL } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';
export const metadata = pageMetadata("Orthopédagogie à Gatineau et en ligne", "Accompagnement en lecture, écriture et mathématiques avec Tuto+. Rencontres d’orthopédagogie en ligne ou en bibliothèque à Gatineau.", '/orthopedagogie', true);
export default function Layout({ children }: { children: ReactNode }) {
  return <>
    <StructuredData data={{
      '@context': 'https://schema.org', '@type': 'Service',
      '@id': SITE_URL + '/orthopedagogie#service',
      name: 'Orthopédagogie à Gatineau et en ligne',
      description: 'Accompagnement en lecture, écriture et mathématiques. Rencontres en ligne ou en bibliothèque municipale à Gatineau.',
      url: SITE_URL + '/orthopedagogie',
      provider: { '@type': 'EducationalOrganization', '@id': SITE_URL + '/#organization', name: 'Tuto+', url: SITE_URL },
      areaServed: { '@type': 'Place', name: 'Gatineau' },
    }} />
{children}</>;
}
