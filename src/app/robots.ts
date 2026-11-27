import type { MetadataRoute } from 'next';
import { IS_PREVIEW, SITE_URL } from '@/lib/seo';
export default function robots(): MetadataRoute.Robots {
  // HTML remains crawlable so crawlers can read noindex on account pages.
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    ...(!IS_PREVIEW ? { sitemap: SITE_URL + '/sitemap.xml' } : {}),
  };
}
