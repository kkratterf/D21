import { getDirectoryBySlugForAdmin } from '@/actions/directory'
import { checkDirectoryAccess } from '@/actions/directory'
import { getStartupsByDirectoryForAdmin } from '@/actions/startup'
import { getStartupFundingStagesForAdmin, getStartupTagsForAdmin, getStartupTeamSizesForAdmin } from '@/actions/tags'
import NavMobile from '@/components/layout/nav-mobile'
import { EditStartupButton } from '@/components/modules/admin/edit-startup-button'
import { StartupVisibilitySwitch } from '@/components/modules/admin/startup-visibility-switch'
import StartupFilters, { StartupFiltersSkeleton } from '@/components/modules/startups/filters'
import { StartupPagination } from '@/components/modules/startups/pagination'
import ScrollToTop from '@/components/scrollToTopClient'
import Empty from '@/components/ui/empty'
import StartupCard from '@/components/ui/startup-card'
import { createClient } from '@/lib/supabase/server'
import { PAGE_SIZE } from '@/types/startup'
import type { StartupOrder } from '@/types/startup'
import { Badge } from '@d21/design-system/components/ui/badge'
import { Clock, Eye, } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

interface AdminDirectoryPageProps {
    params: Promise<{
        slug: string
    }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function DirectoryHeader({ slug }: { slug: string }) {
    const directory = await getDirectoryBySlugForAdmin(slug);

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
                <div className='flex gap-2 mt-2'>
                    <Badge variant="default">
                        {directory._count.startups} startup totali
                    </Badge>
                </div>
            </div>
            <NavMobile />
        </div>
    );
}

async function StartupFiltersWrapper({ slug }: { slug: string }) {
    const [availableTags, availableFundingStages, availableTeamSizes] = await Promise.all([
        getStartupTagsForAdmin(slug),
        getStartupFundingStagesForAdmin(slug),
        getStartupTeamSizesForAdmin(slug)
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

async function StartupList({ slug, searchParams }: { slug: string; searchParams: Record<string, string | string[] | undefined> }) {
    // Parse search params
    const name = Array.isArray(searchParams.name) ? searchParams.name[0] : searchParams.name;
    const tags = searchParams.tags ? (Array.isArray(searchParams.tags) ? searchParams.tags[0] : searchParams.tags).split(',') : undefined;
    const fundingStages = searchParams.fundingStages ? (Array.isArray(searchParams.fundingStages) ? searchParams.fundingStages[0] : searchParams.fundingStages).split(',') : undefined;
    const teamSizes = searchParams.teamSizes ? (Array.isArray(searchParams.teamSizes) ? searchParams.teamSizes[0] : searchParams.teamSizes).split(',') : undefined;
    const page = Number.parseInt(searchParams.page as string || '1', 10);
    const sort = (searchParams.sort as StartupOrder) || "nameAsc";

    // Get startups with filters and pagination (include both visible and hidden)
    const { startups, count: total } = await getStartupsByDirectoryForAdmin({
        directorySlug: slug,
        name,
        tags,
        fundingStages,
        teamSizes,
        page,
        sort,
        includeHidden: true
    });

    const pages = Math.ceil(total / PAGE_SIZE);

    if (startups.length === 0) {
        return (
            <>
                <div className='flex flex-col gap-1 px-3 py-4 w-full h-full'>
                    <Empty description="Non ci sono startup che corrispondono ai filtri selezionati." />
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
            </>
        );
    }

    return (
        <>
            <div className='flex flex-col gap-1 px-3 py-4 w-full h-full'>
                {startups.map((startup) => (
                    <div key={startup.id} className="relative">
                        <StartupCard
                            item={startup}
                            selectedTags={tags || []}
                            selectedFundingStages={fundingStages || []}
                            selectedTeamSizes={teamSizes || []}
                        />
                        <div className='top-2 right-2 absolute flex items-center gap-2'>
                            <Badge variant={startup.visible ? "default" : "warning"} className="flex items-center gap-1">
                                {startup.visible ? (
                                    <>
                                        <Eye className='w-3 h-3' />
                                        Visibile
                                    </>
                                ) : (
                                    <>
                                        <Clock className='w-3 h-3' />
                                        In attesa
                                    </>
                                )}
                            </Badge>
                            <StartupVisibilitySwitch
                                startupId={startup.id}
                                isVisible={startup.visible}
                            />
                            <EditStartupButton startup={startup} directorySlug={slug} />
                        </div>
                    </div>
                ))}
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
        </>
    );
}

export default async function AdminDirectoryPage({ params, searchParams }: AdminDirectoryPageProps) {
    const { slug } = await params;
    const waitedParams = await searchParams;

    // Verifica autenticazione e accesso
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Verifica che l'utente abbia accesso alla directory
    const hasAccess = await checkDirectoryAccess(slug, user.id);
    if (!hasAccess) {
        return <Empty description="Non hai accesso a questa directory." />;
    }

    // Verifica che la directory esista
    const directory = await getDirectoryBySlugForAdmin(slug);
    if (!directory) {
        return <Empty description="Directory non trovata." />;
    }

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
                <StartupList slug={slug} searchParams={waitedParams} />
            </Suspense>
        </div>
    );
} 