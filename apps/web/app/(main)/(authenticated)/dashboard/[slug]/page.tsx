import { getDirectoryBySlugForAdmin } from '@/actions/directory'
import { checkDirectoryAccess } from '@/actions/directory'
import { getStartupsByDirectoryForAdmin } from '@/actions/startup'
import { getStartupFundingStagesForAdmin, getStartupTagsForAdmin, getStartupTeamSizesForAdmin } from '@/actions/tags'
import NavMobile from '@/components/layout/nav-mobile'
import { AdminDirectoryHeader } from '@/components/modules/admin/admin-directory-header'
import { DirectoryHeaderSkeleton } from '@/components/modules/directories'
import Loading from '@/components/modules/directories/loading'
import { StartupFiltersSkeleton } from '@/components/modules/startups/filters'
import { StartupPagination } from '@/components/modules/startups/pagination'
import { StartupFiltersClient } from '@/components/modules/startups/startup-filters-client'
import ScrollToTop from '@/components/scrollToTopClient'
import DashboardStartupCard from '@/components/ui/dashboard-startup-card'
import Empty from '@/components/ui/empty'
import { createClient } from '@/lib/supabase/server'
import { PAGE_SIZE } from '@/types/startup'
import type { StartupOrder } from '@/types/startup'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

interface AdminDirectoryPageProps {
    params: Promise<{
        slug: string
    }>
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

// Componente async per l'header
async function DirectoryHeaderWrapper({ slug }: { slug: string }) {
    const directory = await getDirectoryBySlugForAdmin(slug)

    if (!directory) {
        return (
            <div className='flex justify-between items-center px-7'>
                <h1 className="font-brand text-3xl">Directory not found</h1>
                <NavMobile />
            </div>
        )
    }

    return <AdminDirectoryHeader directory={directory} />
}

// Componente async per i filtri
async function StartupFiltersWrapper({ slug }: { slug: string }) {
    const [availableTags, availableFundingStages, availableTeamSizes] = await Promise.all([
        getStartupTagsForAdmin(slug),
        getStartupFundingStagesForAdmin(slug),
        getStartupTeamSizesForAdmin(slug)
    ])

    return (
        <StartupFiltersClient
            tags={availableTags}
            fundingStages={availableFundingStages}
            teamSizes={availableTeamSizes}
            directorySlug={slug}
        />
    )
}

// Componente async per la lista startup
async function StartupListWrapper({
    slug,
    name,
    tags,
    fundingStages,
    teamSizes,
    page,
    sort
}: {
    slug: string
    name?: string
    tags?: string[]
    fundingStages?: string[]
    teamSizes?: string[]
    page: number
    sort: StartupOrder
}) {
    const { startups, count: total } = await getStartupsByDirectoryForAdmin({
        directorySlug: slug,
        name,
        tags,
        fundingStages,
        teamSizes,
        page,
        sort,
        includeHidden: true
    })

    const pages = Math.ceil(total / PAGE_SIZE)

    if (startups.length === 0) {
        return (
            <>
                <div className='flex flex-col gap-1 px-3 py-4 w-full h-full'>
                    <Empty title="No startups found" description="No startups found matching the selected filters." />
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
        )
    }

    return (
        <>
            <div className='flex flex-col gap-1 px-3 py-4 w-full h-full'>
                {startups.map((startup) => (
                    <DashboardStartupCard
                        key={startup.id}
                        item={startup}
                        selectedTags={tags || []}
                        selectedFundingStages={fundingStages || []}
                        selectedTeamSizes={teamSizes || []}
                    />
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
    )
}

export default async function AdminDirectoryPage({ params, searchParams }: AdminDirectoryPageProps) {
    const { slug } = await params
    const waitedParams = await searchParams

    // Check authentication and access
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if the user has access to the directory
    const hasAccess = await checkDirectoryAccess(slug, user.id)
    if (!hasAccess) {
        return <Empty title="No access" description="You don't have access to this directory." />
    }

    // Check if the directory exists
    const directory = await getDirectoryBySlugForAdmin(slug)
    if (!directory) {
        return <Empty title="Directory not found" description="The directory you are looking for does not exist." />
    }

    const name = Array.isArray(waitedParams.name) ? waitedParams.name[0] : waitedParams.name
    const tags = waitedParams.tags ? (Array.isArray(waitedParams.tags) ? waitedParams.tags[0] : waitedParams.tags).split(',') : undefined
    const fundingStages = waitedParams.fundingStages ? (Array.isArray(waitedParams.fundingStages) ? waitedParams.fundingStages[0] : waitedParams.fundingStages).split(',') : undefined
    const teamSizes = waitedParams.teamSizes ? (Array.isArray(waitedParams.teamSizes) ? waitedParams.teamSizes[0] : waitedParams.teamSizes).split(',') : undefined
    const page = Number.parseInt(waitedParams.page as string || '1', 10)
    const sort = (waitedParams.sort as StartupOrder) || "nameAsc"

    return (
        <div className="flex flex-col pt-6">
            {/* Header with skeleton - the directory check is here */}
            <Suspense fallback={<DirectoryHeaderSkeleton />}>
                <DirectoryHeaderWrapper slug={slug} />
            </Suspense>

            {/* Filters with skeleton - parallel loading */}
            <Suspense fallback={<StartupFiltersSkeleton />}>
                <StartupFiltersWrapper slug={slug} />
            </Suspense>

            {/* Startup list with skeleton - parallel loading */}
            <Suspense fallback={<Loading />}>
                <ScrollToTop />
                <StartupListWrapper
                    slug={slug}
                    name={name}
                    tags={tags}
                    fundingStages={fundingStages}
                    teamSizes={teamSizes}
                    page={page}
                    sort={sort}
                />
            </Suspense>
        </div>
    )
} 