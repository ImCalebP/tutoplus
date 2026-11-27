import type { Metadata } from 'next';
export const SITE_URL = 'https://tutoplus.ca';
export const IS_PREVIEW = Boolean(process.env.CONTEXT && process.env.CONTEXT !== 'production');
export const PUBLIC_PATHS = ['/', '/orthopedagogie', '/conditions-utilisation', '/politique-de-confidentialite'];

export function pageMetadata(title: string, description: string, path: string, index = true): Metadata {
  const url = new URL(path, SITE_URL).toString();
  return {
    title, description,
    alternates: { canonical: url },
    robots: { index: index && !IS_PREVIEW, follow: !IS_PREVIEW },
    openGraph: {
      title: title + ' | Tuto+', description, url,
      siteName: 'Tuto+', locale: 'fr_CA', type: 'website',
      images: [{ url: SITE_URL + '/logo.jpg', alt: 'Tuto+ — tutorat à domicile et en ligne' }],
    },
    twitter: {
      card: 'summary', title: title + ' | Tuto+', description,
      images: [SITE_URL + '/logo.jpg'],
    },
  };
}
export const organization = {
  '@type': 'EducationalOrganization', '@id': SITE_URL + '/#organization',
  name: 'Tuto+', url: SITE_URL, logo: SITE_URL + '/logo.jpg',
  email: 'tutoplus2025@gmail.com',
  description: 'Tutorat à domicile et en ligne pour les élèves du primaire, du secondaire et du cégep.',
  areaServed: ['Val-des-Monts', 'Gatineau', 'Longueuil', 'Brossard et les environs']
    .map(name => ({ '@type': 'Place', name })),
};
