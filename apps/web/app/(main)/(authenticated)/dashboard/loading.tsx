import { DirectoryCardSkeleton } from '@/components/ui/directory-card';

export default function Loading() {
    return (
        <div className='flex h-full w-full flex-col gap-1 px-3 py-4'>
            {Array.from({ length: 10 }, (_, i) => (
                <DirectoryCardSkeleton key={i} />
            ))}
        </div>
    );
}