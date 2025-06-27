import { Skeleton } from '@d21/design-system/components/ui/skeleton'

export function DirectoryHeaderSkeleton() {
    return (
        <div className='flex flex-col items-start justify-between gap-4 border-border border-b px-7 pb-6 md:flex-row'>
            <div className='flex w-full flex-col items-start gap-3'>
                <div className='flex w-full items-center gap-3'>
                    <Skeleton className='size-9 rounded-lg' />
                    <Skeleton className='h-8 w-48' />
                </div>
                <Skeleton className='h-6 w-full max-w-md' />
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className='h-9 w-9' />
                <Skeleton className='h-9 w-9' />
                <Skeleton className='h-9 w-20' />
            </div>
        </div>
    )
} 