import NavMobile from '@/components/layout/nav-mobile';
import { BackButton } from '@/components/ui/back-button';
import { Skeleton } from "@d21/design-system/components/ui/skeleton";

export const LeftPanelSkeleton = () => {
    return (
        <div className='mb-0 flex h-full w-full flex-col gap-5 p-0 lg:mb-10 lg:w-3/5 lg:p-4'>
            <div className='flex w-full flex-row items-center justify-between'>
                <BackButton />
                <NavMobile />
            </div>
            <div className='flex w-full flex-col gap-5'>
                <div className='flex w-full flex-col gap-3'>
                    <div className='flex flex-row items-start justify-between gap-3'>
                        <Skeleton className='size-16 rounded-xl' />
                        <div className="flex flex-row gap-1.5">
                            <Skeleton className='h-9 w-9' />
                            <Skeleton className='h-9 w-20' />
                        </div>
                    </div>
                    <Skeleton className='h-8 w-3/4' />
                    <Skeleton className='h-6 w-full' />
                </div>
                <div className="flex flex-row gap-1">
                    <Skeleton className='h-6 w-16 rounded-full' />
                    <Skeleton className='h-6 w-20 rounded-full' />
                    <Skeleton className='h-6 w-14 rounded-full' />
                </div>
            </div>
            <div className='space-y-3 pt-4'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-5/6' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-4/5' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-3/4' />
            </div>
        </div>
    );
}; 