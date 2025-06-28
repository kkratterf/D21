'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useOptimistic, useState, useTransition } from 'react';

import { Button } from '@d21/design-system/components/ui/button';
import { Input } from '@d21/design-system/components/ui/input';

import { parseDashboardSearchParams, stringifyDashboardSearchParams } from '@/lib/utils';
import type { DashboardSearchParams } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { CreateDirectorySheet } from './create-directory-sheet';

const DashboardFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
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
        <div className='flex w-full items-center gap-2'>
            <div className='relative flex-1'>
                <Input
                    placeholder="Search your directories..."
                    value={optimisticFilters.name ?? ""}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className='w-full md:max-w-64 xl:max-w-72'
                />
            </div>
            <Button
                onClick={() => setIsCreateSheetOpen(true)}
                className='flex items-center gap-2 sm:hidden'
                variant="secondary"
                icon
            >
                <Plus />
            </Button>
            <Button
                onClick={() => setIsCreateSheetOpen(true)}
                className='hidden items-center gap-2 sm:flex'
                variant="secondary"

            >
                Create directory
            </Button>
            <CreateDirectorySheet
                isOpen={isCreateSheetOpen}
                onOpenChange={setIsCreateSheetOpen}
            />
        </div>
    );
};

export default DashboardFilters; 