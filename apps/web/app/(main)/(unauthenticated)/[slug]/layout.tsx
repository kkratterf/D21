import type React from 'react';
import { Suspense } from 'react';

import { getDirectoryBySlug } from '@/actions/directory';
import { getStartupFundingStages, getStartupTags, getStartupTeamSizes } from '@/actions/tags';
import NavMobile from '@/components/layout/nav-mobile';
import StartupFilters, { StartupFiltersSkeleton } from '@/components/modules/startups/filters';
import ScrollToTop from '@/components/scrollToTopClient';

interface SlugLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        slug: string;
    }>;
}

async function StartupFiltersWrapper({ slug }: { slug: string }) {
    const [availableTags, availableFundingStages, availableTeamSizes] = await Promise.all([
        getStartupTags(slug),
        getStartupFundingStages(slug),
        getStartupTeamSizes(slug)
    ]);

    return (
        <StartupFilters
            tags={availableTags}
            fundingStages={availableFundingStages}
            teamSizes={availableTeamSizes}
        />
    );
}

async function DirectoryHeader({ slug }: { slug: string }) {
    const directory = await getDirectoryBySlug(slug);

    if (!directory) {
        return (
            <div className='flex items-center justify-between px-7'>
                <h1 className="font-brand text-3xl">Directory non trovata</h1>
                <NavMobile />
            </div>
        );
    }

    return (
        <div className='flex items-center justify-between px-7'>
            <div>
                <h1 className="font-brand text-3xl">{directory.name}</h1>
                {directory.description && (
                    <p className="mt-1 text-description">{directory.description}</p>
                )}
            </div>
            <NavMobile />
        </div>
    );
}

export default async function SlugLayout({
    children,
    params,
}: SlugLayoutProps) {
    const { slug } = await params;

    return (
        <div className="flex flex-col pt-6">
            <Suspense>
                <DirectoryHeader slug={slug} />
            </Suspense>
            <Suspense fallback={<StartupFiltersSkeleton />}>
                <StartupFiltersWrapper slug={slug} />
            </Suspense>
            <Suspense>
                <ScrollToTop />
                {children}
            </Suspense>
        </div>
    );
} 