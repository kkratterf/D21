import type { MetadataRoute } from 'next';

import { sitemapMetadata } from '@/lib/metadataRoute';

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapMetadata;
}
