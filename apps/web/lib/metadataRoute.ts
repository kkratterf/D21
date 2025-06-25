import type { MetadataRoute } from 'next';

export const manifestMetadata: MetadataRoute.Manifest = {
    name: 'D21 - Open-source startup directories',
    short_name: 'D21',
    description: 'A growing, open-source database of startup directories 📁 Designed to make the ecosystem more transparent and accessible.',
    start_url: '/',
}

export const robotsMetadata: MetadataRoute.Robots = {
    rules: {
        userAgent: '*',
        allow: '/',
        disallow: '/private/',
    },
}

export const sitemapMetadata: MetadataRoute.Sitemap = [
    {
        url: 'https://www.d21.so',
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
    },
    {
        url: 'https://www.d21.so/directories',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    },
    {
        url: 'https://www.d21.so/manifesto',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
    },
]
