'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Form from 'next/form';
import { useFormStatus } from 'react-dom';

import { Button } from '@d21/design-system/components/ui/button';
import { Tooltip } from '@d21/design-system/components/ui/tooltip';
import { cn } from '@d21/design-system/lib/utils';

import type { SearchParams } from '@/lib/utils';

function FormValues({
    searchParams,
    pageNumber,
}: {
    searchParams: SearchParams;
    pageNumber: number;
}) {
    const { pending } = useFormStatus();

    return (
        <div data-pending={pending ? '' : undefined}>
            {/* Keep the existing search params */}
            {Object.entries(searchParams).map(
                ([key, value]) =>
                    key !== 'page' && (
                        <input key={key} type="hidden" name={key} value={value as string} />
                    )
            )}
            <input type="hidden" name="page" value={pageNumber.toString()} />
        </div>
    );
}

export function StartupPagination({
    currentPage,
    totalPages,
    totalResults,
    searchParams,
}: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    searchParams: SearchParams;
}) {
    if (totalPages <= 1) {
        return null;
    }
    return (
        <div className='sticky bottom-0 flex w-full flex-row items-center justify-between gap-2 border-border border-t bg-background py-3 pr-6 pl-7'>
            <div className='flex flex-row gap-2 font-mono text-description text-sm'>
                <p><span className='text'>{totalResults.toLocaleString()}</span> Results</p>
                -
                <p>Page <span className='text'>{currentPage.toLocaleString()}</span>/{totalPages.toLocaleString()}</p>
            </div>
            <div className='flex flex-row'>
                <Form action="/directories">
                    <FormValues
                        searchParams={searchParams}
                        pageNumber={Math.max(1, currentPage - 1)}
                    />
                    <Tooltip className='hidden sm:flex' content="Previous page">
                        <Button
                            variant="secondary"
                            className={cn('rounded-r-none border-r-0')}
                            type="submit"
                            size="small"
                            icon
                            disabled={currentPage <= 1}
                        >
                            <ChevronLeft />
                        </Button>
                    </Tooltip>
                </Form>
                <Form action="/directories">
                    <FormValues
                        searchParams={searchParams}
                        pageNumber={Math.min(totalPages, currentPage + 1)}
                    />
                    <Tooltip className='hidden sm:flex' content="Next page">
                        <Button
                            variant="secondary"
                            type="submit"
                            icon
                            size="small"
                            className='rounded-l-none'
                            disabled={currentPage >= totalPages}
                        >
                            <ChevronRight />
                        </Button>
                    </Tooltip>
                </Form>
            </div>
        </div>
    );
} 