import { DashboardFiltersSkeleton } from '@/components/modules/dashboard/filters-skeleton';
import { DashboardPaginationSkeleton } from '@/components/modules/dashboard/pagination';
import { DirectoryCardSkeleton } from '@/components/ui/directory-card';

export default function Loading() {
    return (
        <>
            <div className='sticky top-0 z-20 border-border border-b bg-background px-6 py-4'>
                <DashboardFiltersSkeleton />
            </div>
            <div className='flex h-full w-full flex-col gap-1 px-3 py-4'>
                {Array.from({ length: 10 }, (_, i) => (
                    <DirectoryCardSkeleton key={i} />
                ))}
            </div>
            <DashboardPaginationSkeleton />
        </>
    );
}