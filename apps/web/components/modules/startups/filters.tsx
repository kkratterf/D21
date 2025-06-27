'use client';

import { ArrowDownAZ, ArrowDownNarrowWide, ArrowDownWideNarrow, ArrowDownZA, DollarSign, type LucideIcon, Plus, Tags, Users, X } from 'lucide-react';
import { useRouter, useSearchParams, } from 'next/navigation';
import { useOptimistic, useState, useTransition } from 'react';

import { Button } from '@d21/design-system/components/ui/button';
import { Input } from '@d21/design-system/components/ui/input';
import { Skeleton } from '@d21/design-system/components/ui/skeleton';
import { Tooltip } from '@d21/design-system/components/ui/tooltip';

import { SubmitStartupSheet } from '@/components/modules/startups/submit-sheet';
import { Filter } from '@/components/ui/filter';
import { Sort } from '@/components/ui/sort';
import type { StartupOrder } from '@/types/startup';
import Link from 'next/link';

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
    const [isPending, startTransition] = useTransition();
    const [isSubmitSheetOpen, setIsSubmitSheetOpen] = useState(false);

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
        const currentPath = window.location.pathname;
        router.replace(queryString ? `${currentPath}?${queryString}` : currentPath, {
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
        <div className='sticky top-0 z-20 border-border border-b bg-background px-6 py-4'>
            <div className='flex flex-col items-center justify-between gap-2 md:flex-row'>
                <div className='flex w-full flex-col items-center gap-2 md:flex-row'>
                    <Input
                        placeholder="Search startups..."
                        className='w-full md:max-w-64 xl:max-w-72'
                        value={optimisticFilters.name ?? ""}
                        onChange={(e) => handleFilterChange('name', e.target.value)}
                    />
                    <div className='flex w-full flex-row gap-2 md:w-auto'>
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
                        <Tooltip content="Reset filtri" className='z-50 hidden md:flex 2xl:hidden'>
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
                                <X className='hidden md:flex 2xl:hidden' />
                                <span className='flex md:hidden 2xl:flex'>Reset</span>
                            </Button>
                        </Tooltip>
                    )}
                </div>
                <div className='flex items-center gap-2'>
                    <Tooltip content="Submit Startup">
                        <Button
                            variant="primary"
                            size="small"
                            onClick={() => setIsSubmitSheetOpen(true)}
                            className='hidden md:flex'
                        >
                            <Plus className="size-4" />
                            <span className='hidden lg:flex'>Submit Startup</span>
                        </Button>
                    </Tooltip>
                    <Button>
                        <Link href={`/${directorySlug}/map`}>Map</Link>
                    </Button>
                    <Button
                        variant="primary"
                        size="small"
                        onClick={() => setIsSubmitSheetOpen(true)}
                        className='md:hidden'
                    >
                        <Plus className="size-4" />
                    </Button>
                    <Sort
                        options={SortOptions}
                        selectedValues={getSelectedValues('sort')}
                        onFilterChange={(values) => handleFacetedFilterChange('sort', values)}
                        singleOption
                    />
                </div>
            </div>
            <SubmitStartupSheet
                isOpen={isSubmitSheetOpen}
                onOpenChange={setIsSubmitSheetOpen}
                directorySlug={directorySlug}
            />
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
        <div className='sticky top-0 z-20 border-border border-b bg-background px-6 py-4'>
            <div className='flex flex-col items-center gap-2 md:flex-row'>
                <Skeleton className='h-9 md:max-w-64' />
                <Skeleton className='h-9 w-20' />
                <Skeleton className='h-9 w-32' />
                <Skeleton className='h-9 w-24' />
                <Skeleton className='h-9 w-28' />
            </div>
        </div>
    );
} 