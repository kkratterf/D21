'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';

import { Input } from '@d21/design-system/components/ui/input';

import { parseDashboardSearchParams, stringifyDashboardSearchParams } from '@/lib/utils';
import type { DashboardSearchParams } from '@/lib/utils';

const DashboardFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const initialFilters = parseDashboardSearchParams(Object.fromEntries(searchParams));

    const [optimisticFilters, setOptimisticFilters] =
        useOptimistic<DashboardSearchParams>(initialFilters);

    const updateURL = (newFilters: DashboardSearchParams) => {
        const queryString = stringifyDashboardSearchParams(newFilters);
        router.replace(queryString ? `/dashboard?${queryString}` : '/dashboard', {
            scroll: false
        });
    };

    const handleFilterChange = (value: string) => {
        startTransition(() => {
            if (value) {
                const newFilters = { ...optimisticFilters, name: value, page: "1" };
                setOptimisticFilters(newFilters);
                updateURL(newFilters);
            } else {
                const { name: _, ...rest } = optimisticFilters;
                const newFilters = { ...rest, page: "1" };
                setOptimisticFilters(newFilters);
                updateURL(newFilters);
            }
        });
    };

    return (
        <div className='flex items-center gap-2 w-full'>
            <div className='relative flex-1'>
                <Search className='top-1/2 left-3 absolute w-4 h-4 text-description -translate-y-1/2' />
                <Input
                    placeholder="Cerca le tue directories..."
                    className='pl-9'
                    value={optimisticFilters.name ?? ""}
                    onChange={(e) => handleFilterChange(e.target.value)}
                />
            </div>
        </div>
    );
};

export default DashboardFilters; 