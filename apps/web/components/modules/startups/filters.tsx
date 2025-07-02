'use client';

import { ArrowDownAZ, ArrowDownNarrowWide, ArrowDownWideNarrow, ArrowDownZA, DollarSign, type LucideIcon, Tags, Users, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';

import { Button } from '@d21/design-system/components/ui/button';
import { Input } from '@d21/design-system/components/ui/input';
import { Skeleton } from '@d21/design-system/components/ui/skeleton';
import { Tooltip } from '@d21/design-system/components/ui/tooltip';

import { Filter } from '@/components/ui/filter';
import { Sort } from '@/components/ui/sort';
import type { StartupOrder } from '@/types/startup';

interface IProps {
    searchParams: URLSearchParams;
    tags: { label: string; value: string; }[];
    fundingStages: { label: string; value: string; }[];
    teamSizes: { label: string; value: string; }[];
    directorySlug: string;
}

export interface StartupSearchParams {
    name?: string;
    tags?: string;
    fundingStages?: string;
    teamSizes?: string;
    sort?: StartupOrder;
    page: string;
}

export function stringifyStartupSearchParams(params: StartupSearchParams): string {
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
    value: StartupOrder;
    icon: LucideIcon
}[] = [
        { label: "Alphabetical", value: "nameAsc", icon: ArrowDownAZ },
        { label: "Reverse alphabetical", value: "nameDesc", icon: ArrowDownZA },
        { label: "Newest first", value: "createdAtDesc", icon: ArrowDownNarrowWide },
        { label: "Oldest first", value: "createdAtAsc", icon: ArrowDownWideNarrow },
        { label: "Founded newest", value: "foundedAtDesc", icon: ArrowDownNarrowWide },
        { label: "Founded oldest", value: "foundedAtAsc", icon: ArrowDownWideNarrow },
    ];

const StartupsFiltersWithParams = ({
    searchParams,
    tags,
    fundingStages,
    teamSizes,
    directorySlug,
}: IProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    // Parse search params
    const initialFilters: StartupSearchParams = {
        name: searchParams.get('name') || undefined,
        tags: searchParams.get('tags') || undefined,
        fundingStages: searchParams.get('fundingStages') || undefined,
        teamSizes: searchParams.get('teamSizes') || undefined,
        sort: (searchParams.get('sort') as StartupOrder) || "nameAsc",
        page: searchParams.get('page') || "1"
    };

    const [optimisticFilters, setOptimisticFilters] =
        useOptimistic<StartupSearchParams>({
            ...initialFilters,
            sort: initialFilters.sort || "nameAsc"
        });

    const updateURL = (newFilters: StartupSearchParams) => {
        const queryString = stringifyStartupSearchParams(newFilters);
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
            scroll: false
        });
    };

    const handleFilterChange = (
        filterType: keyof StartupSearchParams,
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
        filterType: keyof StartupSearchParams,
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

    const getSelectedValues = (filterType: keyof StartupSearchParams): Set<string> => {
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
                        placeholder="Search startups..."
                        className="w-full md:max-w-64 xl:max-w-72"
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
                        <Filter
                            icon={<DollarSign />}
                            title="Funding Stage"
                            tooltip="Funding Stage"
                            options={fundingStages}
                            selectedValues={getSelectedValues('fundingStages')}
                            onFilterChange={(values) => handleFacetedFilterChange('fundingStages', values)}
                        />
                        <Filter
                            icon={<Users />}
                            title="Team Size"
                            tooltip="Team Size"
                            options={teamSizes}
                            selectedValues={getSelectedValues('teamSizes')}
                            onFilterChange={(values) => handleFacetedFilterChange('teamSizes', values)}
                        />
                    </div>
                    {hasActiveFilters() && (
                        <Tooltip content="Reset filters" className='hidden 2xl:hidden z-50 md:flex'>
                            <Button
                                className="w-full md:w-auto"
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
                <div className="flex items-center gap-2">
                    <Sort
                        options={SortOptions}
                        selectedValues={getSelectedValues('sort')}
                        onFilterChange={(values) => handleFacetedFilterChange('sort', values)}
                        singleOption
                    />
                </div>
            </div>
        </div>
    );
};

interface StartupFiltersProps {
    tags: { label: string; value: string; }[];
    fundingStages: { label: string; value: string; }[];
    teamSizes: { label: string; value: string; }[];
    directorySlug: string;
}

const StartupFilters = ({ tags, fundingStages, teamSizes, directorySlug }: StartupFiltersProps) => {
    const searchParams = useSearchParams();
    return <StartupsFiltersWithParams searchParams={searchParams} tags={tags} fundingStages={fundingStages} teamSizes={teamSizes} directorySlug={directorySlug} />;
}

export default StartupFilters;

export const StartupFiltersSkeleton = () => {
    return (
        <div className='top-0 z-20 sticky bg-background px-6 py-4 border-b border-border'>
            <div className='flex md:flex-row flex-col items-center gap-2 w-full'>
                <Skeleton className='w-full md:max-w-64 h-9' />
                <div className='flex flex-row gap-2 w-full md:w-auto'>
                    <Skeleton className='w-full md:w-[38px] h-9' />
                    <Skeleton className='w-full md:w-[38px] h-9' />
                    <Skeleton className='w-full md:w-[38px] h-9' />
                </div>
            </div>
        </div>
    );
} 