import { getStartupById } from '@/actions/startup'
import LeftPanel from '@/components/modules/startup-detail/left-panel'
import RightPanel from '@/components/modules/startup-detail/right-panel'
import Empty from '@/components/ui/empty'
import { emptyMetadata, startupMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

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

    const startup = await getStartupById(id);

    if (!startup) {
        return <Empty description="Something went wrong. But hey, don't give up! Try again later." />;
    }

    return (
        <div className='relative flex min-h-dvh w-full flex-col gap-4 p-6 pb-0 lg:flex-row'>
            <LeftPanel startup={startup} />
            <RightPanel startup={startup} />
        </div>
    )
}