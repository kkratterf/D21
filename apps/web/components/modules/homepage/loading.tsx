import { HomepageCardSkeleton } from "@/components/ui/homepage-card";
import { Skeleton } from "@d21/design-system/components/ui/skeleton";


export default function Loading() {
    return (
        <div className="flex flex-col gap-1">
            {Array.from({ length: 5 }, (_, i) => (
                <HomepageCardSkeleton key={i} />
            ))}
        </div>
    );
}

export const LoadingBanner = () => {
    return (
        <div className='flex w-full flex-col px-5 py-6'>
            <Skeleton className='h-32 w-full rounded-lg' />
        </div>
    );
}