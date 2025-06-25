'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';

import { Button } from '@d21/design-system/components/ui/button';
import { Skeleton } from '@d21/design-system/components/ui/skeleton';

import type { DashboardSearchParams } from '@/lib/utils';

interface IProps {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    searchParams: DashboardSearchParams;
}

export function stringifyDashboardSearchParams(params: DashboardSearchParams): string {
    const urlParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && (Array.isArray(value) ? value.length : true)) {
            urlParams.append(key, value);
        }
    }
    return urlParams.toString();
}

const DashboardPagination = ({
    currentPage,
    totalPages,
    totalResults,
    searchParams,
}: IProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [optimisticPage, setOptimisticPage] = useOptimistic(currentPage);

    const updateURL = (newPage: number) => {
        const newSearchParams = { ...searchParams, page: newPage.toString() };
        const queryString = stringifyDashboardSearchParams(newSearchParams);
        router.replace(queryString ? `/dashboard?${queryString}` : '/dashboard', {
            scroll: false
        });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;

        startTransition(() => {
            setOptimisticPage(newPage);
            updateURL(newPage);
        });
    };

    if (totalPages <= 1) return null;

    return (
        <div className='flex items-center justify-between border-border border-t px-6 py-4'>
            <div className='text-description text-sm'>
                {totalResults} risultati
            </div>
            <div className='flex items-center gap-2'>
                <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handlePageChange(optimisticPage - 1)}
                    disabled={optimisticPage <= 1 || isPending}
                >
                    <ChevronLeft className='h-4 w-4' />
                    Precedente
                </Button>
                <div className='flex items-center gap-1'>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={optimisticPage === page ? "primary" : "secondary"}
                            size="small"
                            onClick={() => handlePageChange(page)}
                            disabled={isPending}
                            className='h-8 w-8 p-0'
                        >
                            {page}
                        </Button>
                    ))}
                </div>
                <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handlePageChange(optimisticPage + 1)}
                    disabled={optimisticPage >= totalPages || isPending}
                >
                    Successiva
                    <ChevronRight className='h-4 w-4' />
                </Button>
            </div>
        </div>
    );
};

export { DashboardPagination };

export const DashboardPaginationSkeleton = () => {
    return (
        <div className='flex items-center justify-between border-border border-t px-6 py-4'>
            <Skeleton className='h-4 w-24' />
            <div className='flex items-center gap-2'>
                <Skeleton className='h-8 w-20' />
                <Skeleton className='h-8 w-8' />
                <Skeleton className='h-8 w-8' />
                <Skeleton className='h-8 w-20' />
            </div>
        </div>
    );
}; 