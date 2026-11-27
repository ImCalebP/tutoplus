import HomePage from '@/components/HomePage';
import StructuredData from '@/components/StructuredData';
import { pageMetadata, organization, SITE_URL } from '@/lib/seo';

export const metadata = pageMetadata(
  'Tutorat à domicile et en ligne',
  'Tutorat au primaire, secondaire et cégep à Val-des-Monts, Gatineau, Longueuil, Brossard et les environs. Aide aux devoirs à domicile ou en ligne.',
  '/'
);
export default function Home() {
  return <>
    <StructuredData data={{
      '@context': 'https://schema.org',
      '@graph': [
        organization,
        { '@type': 'WebSite', '@id': SITE_URL + '/#website', url: SITE_URL, name: 'Tuto+', inLanguage: 'fr-CA', publisher: { '@id': organization['@id'] } },
        { '@type': 'Service', '@id': SITE_URL + '/#tutorat', name: 'Tutorat à domicile et en ligne',
          serviceType: 'Soutien scolaire au primaire, au secondaire et au cégep',
          url: SITE_URL, provider: { '@id': organization['@id'] }, areaServed: organization.areaServed },
      ],
    }} />
    <HomePage />
  </>;
}
