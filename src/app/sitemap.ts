import type { MetadataRoute } from 'next';
import { IS_PREVIEW, PUBLIC_PATHS, SITE_URL } from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap {
  if (IS_PREVIEW) return [];
  return PUBLIC_PATHS.map(path => ({ url: new URL(path, SITE_URL).toString() }));
}
