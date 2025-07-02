'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';

import { Button } from '@d21/design-system/components/ui/button';
import { Tooltip } from '@d21/design-system/components/ui/tooltip';
import { cn } from '@d21/design-system/lib/utils';

import type { SearchParams } from '@/lib/utils';

export function stringifyStartupSearchParams(params: SearchParams): string {
    const urlParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && (Array.isArray(value) ? value.length : true)) {
            urlParams.append(key, value);
        }
    }
    return urlParams.toString();
}

export function StartupPagination({
    currentPage,
    totalPages,
    totalResults,
    searchParams,
    basePath,
}: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    searchParams: SearchParams;
    basePath: string;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [optimisticPage, setOptimisticPage] = useOptimistic(currentPage);

    const updateURL = (newPage: number) => {
        const newSearchParams = { ...searchParams, page: newPage.toString() };
        const queryString = stringifyStartupSearchParams(newSearchParams);
        const finalURL = queryString ? `${basePath}?${queryString}` : basePath;
        router.replace(finalURL, {
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

    if (totalPages <= 1) {
        return null;
    }
    return (
        <div className='sticky bottom-0 flex w-full flex-row items-center justify-between gap-2 border-border border-t bg-background py-3 pr-6 pl-7'>
            <div className='flex flex-row gap-2 font-mono text-description text-sm'>
                <p><span className='text'>{totalResults.toLocaleString()}</span> Results</p>
                -
                <p>Page <span className='text'>{optimisticPage.toLocaleString()}</span>/{totalPages.toLocaleString()}</p>
            </div>
            <div className='flex flex-row'>
                <Tooltip className='hidden sm:flex' content="Previous page">
                    <Button
                        variant="secondary"
                        className={cn('rounded-r-none border-r-0')}
                        size="small"
                        icon
                        disabled={optimisticPage <= 1 || isPending}
                        onClick={() => handlePageChange(optimisticPage - 1)}
                    >
                        <ChevronLeft />
                    </Button>
                </Tooltip>
                <Tooltip className='hidden sm:flex' content="Next page">
                    <Button
                        variant="secondary"
                        size="small"
                        icon
                        className='rounded-l-none'
                        disabled={optimisticPage >= totalPages || isPending}
                        onClick={() => handlePageChange(optimisticPage + 1)}
                    >
                        <ChevronRight />
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
} 