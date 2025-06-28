import { Skeleton } from '@d21/design-system/components/ui/skeleton';

export function DashboardFiltersSkeleton() {
    return (
        <div className='flex w-full items-center gap-2'>
            <div className='relative flex-1'>
                <Skeleton className='h-9 w-full md:max-w-64 xl:max-w-72' />
            </div>
            <Skeleton className='h-9 w-32' />
        </div>
    );
} 