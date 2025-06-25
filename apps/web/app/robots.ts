import type { MetadataRoute } from 'next'

import { robotsMetadata } from '@/lib/metadataRoute'

export default function robots(): MetadataRoute.Robots {
    return robotsMetadata
}