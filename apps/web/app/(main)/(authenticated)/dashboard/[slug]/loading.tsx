import { Skeleton } from '@d21/design-system/components/ui/skeleton';

export default function Loading() {
    return (
        <div className="flex flex-col pt-6">
            <div className='flex justify-between items-center px-7'>
                <div>
                    <Skeleton className='w-48 h-8' />
                    <Skeleton className='mt-1 w-64 h-4' />
                    <div className='flex gap-2 mt-2'>
                        <Skeleton className='w-20 h-5' />
                    </div>
                </div>
            </div>
            <div className="px-7">
                <div className='flex flex-col gap-1 px-3 py-4 w-full h-full'>
                    {Array.from({ length: 8 }, (_, i) => (
                        <Skeleton key={i} className='w-full h-20' />
                    ))}
                </div>
            </div>
        </div>
    );
} 