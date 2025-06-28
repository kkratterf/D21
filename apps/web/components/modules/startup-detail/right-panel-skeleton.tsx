import { Card } from "@d21/design-system/components/ui/card";
import { Skeleton } from "@d21/design-system/components/ui/skeleton";

export const RightPanelSkeleton = () => {
    return (
        <div className='flex w-full flex-col gap-3 pt-4 lg:sticky lg:top-6 lg:h-fit lg:w-2/5 lg:pt-0'>
            <div className='flex w-full flex-col gap-3'>
                <Card className='flex w-full flex-col gap-3'>
                    <div className='flex flex-row items-center justify-between'>
                        <Skeleton className='h-4 w-20' />
                        <Skeleton className='h-4 w-16' />
                    </div>
                    <div className='flex flex-row items-center justify-between'>
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-4 w-12' />
                    </div>
                    <div className='flex flex-row items-center justify-between'>
                        <Skeleton className='h-4 w-22' />
                        <Skeleton className='h-4 w-32' />
                    </div>
                </Card>
                <Card className='flex flex-col gap-4 xl:flex-row'>
                    <div className='flex w-full flex-col gap-1'>
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-5 w-20' />
                    </div>
                    <div className='flex w-full flex-col gap-1'>
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-5 w-28' />
                    </div>
                </Card>
                <div className='flex w-full flex-row items-center justify-between px-6 py-3 pb-12'>
                    <Skeleton className='h-4 w-12' />
                    <div className='flex gap-2'>
                        <Skeleton className='h-8 w-8 rounded' />
                        <Skeleton className='h-8 w-8 rounded' />
                        <Skeleton className='h-8 w-8 rounded' />
                    </div>
                </div>
            </div>
        </div>
    );
}; 