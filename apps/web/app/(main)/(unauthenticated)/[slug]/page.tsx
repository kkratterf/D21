import { getDirectoryBySlug } from '@/actions/directory'
import { DirectoryContent } from '@/components/slug/content'
import { SlugHeader } from '@/components/slug/header'
import { ContentLoading } from '@/components/slug/loading'
import { directoryMetadata, emptyMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import { Suspense } from 'react'

interface SlugPageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata(
    { params }: SlugPageProps,
): Promise<Metadata> {
    const { slug } = await params;

    // Get directories based on whether the parameter is a UUID or a slug
    const directory = await getDirectoryBySlug(slug);

    if (!directory) {
        return emptyMetadata;
    }
    return directoryMetadata(directory);
}

export default async function SlugPage({ params }: SlugPageProps) {
    const { slug } = await params;

    return (
        <div className='relative flex h-full w-full flex-col'>
            <SlugHeader slug={slug} />
            <Suspense fallback={<ContentLoading />}>
                <DirectoryContent slug={slug} />
            </Suspense>
        </div>
    )
}

