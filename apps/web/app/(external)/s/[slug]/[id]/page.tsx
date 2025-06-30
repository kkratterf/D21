import { getStartupById } from '@/actions/startup'
import { LeftPanelSkeleton } from '@/components/modules/startup-detail/left-panel-skeleton'
import { RightPanelSkeleton } from '@/components/modules/startup-detail/right-panel-skeleton'
import { StartupDetailWrapper } from '@/components/modules/startup-detail/startup-detail-wrapper'
import Empty from '@/components/ui/empty'
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
    const { id } = await params;

    // Check if the startup exists to show Empty if necessary
    const startup = await getStartupById(id);

    if (!startup) {
        return <Empty title="Startup not found" description="The startup you are looking for does not exist." />;
    }

    return (
        <Suspense fallback={
            <div className='relative flex lg:flex-row flex-col gap-4 p-6 pb-0 w-full min-h-dvh'>
                <LeftPanelSkeleton />
                <RightPanelSkeleton />
            </div>
        }>
            <StartupDetailWrapper id={id} />
        </Suspense>
    )
}