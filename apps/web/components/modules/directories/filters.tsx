'use client';

import { ArrowDownAZ, ArrowDownNarrowWide, ArrowDownWideNarrow, ArrowDownZA, type LucideIcon, Tags, X, } from 'lucide-react';
import { useRouter, useSearchParams, } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';

import { Button } from '@d21/design-system/components/ui/button';
import { Input } from '@d21/design-system/components/ui/input';
import { Skeleton } from '@d21/design-system/components/ui/skeleton';
import { Tooltip } from '@d21/design-system/components/ui/tooltip';

import { Filter } from '@/components/ui/filter';
import { Sort } from '@/components/ui/sort';
import { parseDirectorySearchParams } from '@/lib/utils';
import type { DirectoryOrder } from '@/types/directory';

interface IProps {
    searchParams: URLSearchParams;
    tags: { label: string; value: string; }[];
}

export interface DirectorySearchParams {
    name?: string;
    tags?: string;
    sort?: DirectoryOrder;
    page: string;
}

export function stringifyDirectorySearchParams(params: DirectorySearchParams): string {
    const urlParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && (Array.isArray(value) ? value.length : true)) {
            urlParams.append(key, value);
        }
    }
    return urlParams.toString();
}

const SortOptions: {
    label: string;
    value: DirectoryOrder;
    icon: LucideIcon
}[] = [
        { label: "Alphabetical", value: "nameAsc", icon: ArrowDownAZ },
        { label: "Reverse alphabetical", value: "nameDesc", icon: ArrowDownZA },
        { label: "Newest first", value: "createdAtDesc", icon: ArrowDownNarrowWide },
        { label: "Oldest first", value: "createdAtAsc", icon: ArrowDownWideNarrow },
    ];

const DirectoriesFiltersWithParams = ({
    searchParams,
    tags,
}: IProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const initialFilters = parseDirectorySearchParams(Object.fromEntries(searchParams));

    const [optimisticFilters, setOptimisticFilters] =
        useOptimistic<DirectorySearchParams>({
            ...initialFilters,
            sort: initialFilters.sort || "nameAsc"
        });

    const updateURL = (newFilters: DirectorySearchParams) => {
        const queryString = stringifyDirectorySearchParams(newFilters);
        router.replace(queryString ? `/directories?${queryString}` : '/directories', {
            scroll: false
        });
    };

    const handleFilterChange = (
        filterType: keyof DirectorySearchParams,
        value: string | undefined
    ) => {
        startTransition(() => {
            if (value) {
                const newFilters = { ...optimisticFilters, [filterType]: value, page: "1" };
                setOptimisticFilters(newFilters);
                updateURL(newFilters);
            } else {
                const { [filterType]: _, ...rest } = optimisticFilters;
                const newFilters = { ...rest, page: "1" };
                setOptimisticFilters(newFilters);
                updateURL(newFilters);
            }
        });
    };

    const handleFacetedFilterChange = (
        filterType: keyof DirectorySearchParams,
        values: string[] | undefined
    ) => {
        startTransition(() => {
            if (values?.length) {
                const newFilters = {
                    ...optimisticFilters,
                    [filterType]: values.join(','),
                    page: "1"
                };
                setOptimisticFilters(newFilters);
                updateURL(newFilters);
            } else {
                const { [filterType]: _, ...rest } = optimisticFilters;
                const newFilters = { ...rest, page: "1" };
                setOptimisticFilters(newFilters);
                updateURL(newFilters);
            }
        });
    };

    const getSelectedValues = (filterType: keyof DirectorySearchParams): Set<string> => {
        return new Set(optimisticFilters[filterType]?.split(",") || []);
    };

    const hasActiveFilters = () => {
        return Object.entries(optimisticFilters).some(([key, value]) =>
            key !== 'page' && key !== 'sort' && value !== undefined
        );
    };

    return (
        <div className='top-0 z-20 sticky bg-background px-6 py-4 border-b border-border'>
            <div className='flex md:flex-row flex-col justify-between items-center gap-2'>
                <div className='flex md:flex-row flex-col items-center gap-2 w-full'>
                    <Input
                        placeholder="Search directories..."
                        className='w-full md:max-w-64 xl:max-w-72'
                        value={optimisticFilters.name ?? ""}
                        onChange={(e) => handleFilterChange('name', e.target.value)}
                    />
                    <div className='flex flex-row gap-2 w-full md:w-auto'>
                        <Filter
                            icon={<Tags />}
                            title="Tags"
                            tooltip="Tags"
                            options={tags}
                            selectedValues={getSelectedValues('tags')}
                            onFilterChange={(values) => handleFacetedFilterChange('tags', values)}
                        />
                    </div>
                    {hasActiveFilters() && (
                        <Tooltip content="Reset filters" className='hidden 2xl:hidden z-50 md:flex'>
                            <Button
                                className='w-full md:w-auto'
                                variant="text"
                                onClick={() => {
                                    startTransition(() => {
                                        const currentSort = optimisticFilters.sort;
                                        setOptimisticFilters({ page: "1", sort: currentSort });
                                        updateURL({ page: "1", sort: currentSort });
                                    });
                                }}
                            >
                                <X className='hidden 2xl:hidden md:flex' />
                                <span className='md:hidden flex 2xl:flex'>Reset</span>
                            </Button>
                        </Tooltip>
                    )}
                </div>
                <Sort
                    options={SortOptions}
                    selectedValues={getSelectedValues('sort')}
                    onFilterChange={(values) => handleFacetedFilterChange('sort', values)}
                    singleOption
                />
            </div>
        </div>
    );
};

interface DirectoryFiltersProps {
    tags: { label: string; value: string; }[];
}

const DirectoryFilters = ({ tags }: DirectoryFiltersProps) => {
    const searchParams = useSearchParams();
    return <DirectoriesFiltersWithParams searchParams={searchParams} tags={tags} />;
}

export default DirectoryFilters;

export const DirectoryFiltersSkeleton = () => {
    return (
        <div className='top-0 z-20 sticky bg-background px-6 py-4 border-b border-border'>
            <div className='flex md:flex-row flex-col items-center gap-2'>
                <Skeleton className='md:max-w-64 h-9' />
                <Skeleton className='w-[38px] h-9' />
            </div>
        </div>
    );
} 