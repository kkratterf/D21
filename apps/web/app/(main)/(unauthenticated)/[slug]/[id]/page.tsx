import { getStartupById } from '@/actions/startup'
import { StartupContent } from '@/components/slug/id/content'
import { SlugHeader } from '@/components/slug/id/header'
import { ContentLoading } from '@/components/slug/id/loading'
import { emptyMetadata, startupMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import { Suspense } from 'react'

interface SlugPageProps {
    params: Promise<{
        slug: string
        id: string
    }>
}

export async function generateMetadata(
    { params }: SlugPageProps,
): Promise<Metadata> {
    const { id } = await params;

    // Get startup details
    const startup = await getStartupById(id);

    if (!startup) {
        return emptyMetadata;
    }
    return startupMetadata(startup);
}

export default async function SlugPage({ params }: SlugPageProps) {
    const { slug, id } = await params;

    return (
        <div className='relative flex h-full w-full flex-col'>
            <SlugHeader id={id} />
            <Suspense fallback={<ContentLoading />}>
                <StartupContent id={id} />
            </Suspense>
        </div>
    )
}