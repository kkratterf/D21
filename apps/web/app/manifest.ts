import type { MetadataRoute } from 'next'

import { manifestMetadata } from '@/lib/metadataRoute'

export default function manifest(): MetadataRoute.Manifest {
    return manifestMetadata
}