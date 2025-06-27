import { getDirectoryBySlug } from '@/actions/directory'
import { getStartupsByDirectory } from '@/actions/startup'
import { getStartupFundingStages, getStartupTags, getStartupTeamSizes } from '@/actions/tags'
import NavMobile from '@/components/layout/nav-mobile'
import StartupFilters, { StartupFiltersSkeleton } from '@/components/modules/startups/filters'
import { StartupPagination } from '@/components/modules/startups/pagination'
import ScrollToTop from '@/components/scrollToTopClient'
import Empty from '@/components/ui/empty'
import StartupCard from '@/components/ui/startup-card'
import { directoryMetadata, emptyMetadata } from '@/lib/metadata'
import { PAGE_SIZE } from '@/types/startup'
import type { StartupOrder } from '@/types/startup'
import type { Metadata } from 'next'
import { Suspense } from 'react'

interface SlugPageProps {
    params: Promise<{
        slug: string
    }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(
    { params }: SlugPageProps,
): Promise<Metadata> {
    const { slug } = await params;

    // Get directories based on whether the parameter is a UUID or a slug
    const directory = await getDirectoryBySlug(slug);

    if (!directory) {
        return emptyMetadata;
    }
    return directoryMetadata(directory);
}

async function DirectoryHeader({ slug }: { slug: string }) {
    const directory = await getDirectoryBySlug(slug);

    if (!directory) {
        return (
            <div className='flex justify-between items-center px-7'>
                <h1 className="font-brand text-3xl">Directory non trovata</h1>
                <NavMobile />
            </div>
        );
    }

    return (
        <div className='flex justify-between items-center px-7'>
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
            directorySlug={slug}
        />
    );
}

export default async function SlugPage({ params, searchParams }: SlugPageProps) {
    const { slug } = await params;
    const waitedParams = await searchParams;

    // Parse search params
    const name = Array.isArray(waitedParams.name) ? waitedParams.name[0] : waitedParams.name;
    const tags = waitedParams.tags ? (Array.isArray(waitedParams.tags) ? waitedParams.tags[0] : waitedParams.tags).split(',') : undefined;
    const fundingStages = waitedParams.fundingStages ? (Array.isArray(waitedParams.fundingStages) ? waitedParams.fundingStages[0] : waitedParams.fundingStages).split(',') : undefined;
    const teamSizes = waitedParams.teamSizes ? (Array.isArray(waitedParams.teamSizes) ? waitedParams.teamSizes[0] : waitedParams.teamSizes).split(',') : undefined;
    const page = Number.parseInt(waitedParams.page as string || '1', 10);
    const sort = (waitedParams.sort as StartupOrder) || "nameAsc";

    // Get directory info
    const directory = await getDirectoryBySlug(slug);

    if (!directory) {
        return <Empty description="Directory non trovata. Ma hey, non arrenderti! Prova con un'altra directory." />;
    }

    // Get startups with filters and pagination
    const { startups, count: total } = await getStartupsByDirectory({
        directorySlug: slug,
        name,
        tags,
        fundingStages,
        teamSizes,
        page,
        sort
    });

    const pages = Math.ceil(total / PAGE_SIZE);

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
                <div className='flex flex-col gap-1 px-3 py-4 w-full h-full'>
                    {startups.length === 0 ? (
                        <Empty description="Non ci sono ancora startup in questa directory. Ma hey, non arrenderti! Prova più tardi." />
                    ) : (
                        startups.map((startup) => (
                            <StartupCard
                                key={startup.id}
                                item={startup}
                                selectedTags={tags || []}
                                selectedFundingStages={fundingStages || []}
                                selectedTeamSizes={teamSizes || []}
                            />
                        ))
                    )}
                </div>
                <StartupPagination
                    currentPage={page}
                    searchParams={{
                        name,
                        page: page.toString(),
                        sort
                    }}
                    totalPages={pages}
                    totalResults={total}
                />
            </Suspense>
        </div>
    )
}

