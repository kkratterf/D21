import { getDirectoryBySlug } from '@/actions/directory'
import { getStartupsByDirectory } from '@/actions/startup'
import { getStartupFundingStages, getStartupTags, getStartupTeamSizes } from '@/actions/tags'
import { DirectoryHeader, DirectoryHeaderSkeleton, StartupList } from '@/components/modules/directories'
import Loading from '@/components/modules/directories/loading'
import { StartupFiltersSkeleton } from '@/components/modules/startups/filters'
import { StartupPagination } from '@/components/modules/startups/pagination'
import { StartupFiltersClient } from '@/components/modules/startups/startup-filters-client'
import ScrollToTop from '@/components/scrollToTopClient'
import Empty from '@/components/ui/empty'
import { directoryMetadata, emptyMetadata } from '@/lib/metadata'
import { PAGE_SIZE } from '@/types/startup'
import type { StartupOrder } from '@/types/startup'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface SlugPageProps {
    params: Promise<{
        slug: string
    }>
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(
    { params }: SlugPageProps,
): Promise<Metadata> {
    const { slug } = await params

    const directory = await getDirectoryBySlug(slug)

    if (!directory) {
        return emptyMetadata
    }
    return directoryMetadata(directory)
}

// Componente async per l'header
async function DirectoryHeaderWrapper({ slug }: { slug: string }) {
    const directory = await getDirectoryBySlug(slug)

    if (!directory) {
        return notFound()
    }

    return <DirectoryHeader slug={slug} directory={directory} />
}

// Componente async per i filtri
async function StartupFiltersWrapper({ slug }: { slug: string }) {
    const [availableTags, availableFundingStages, availableTeamSizes] = await Promise.all([
        getStartupTags(slug),
        getStartupFundingStages(slug),
        getStartupTeamSizes(slug)
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
    const { startups, count: total } = await getStartupsByDirectory({
        directorySlug: slug,
        name,
        tags,
        fundingStages,
        teamSizes,
        page,
        sort
    })

    const pages = Math.ceil(total / PAGE_SIZE)

    if (startups.length === 0) {
        return (
            <Empty
                title="No startups found"
                description="No startups found. But hey, don't give up! Try again later."
            />
        )
    }

    return (
        <>
            <StartupList
                startups={startups}
                tags={tags}
                fundingStages={fundingStages}
                teamSizes={teamSizes}
            />
            <StartupPagination
                currentPage={page}
                searchParams={{
                    name,
                    page: page.toString(),
                    sort
                }}
                totalPages={pages}
                totalResults={total}
                basePath={`/${slug}`}
            />
        </>
    )
}

export default async function SlugPage({ params, searchParams }: SlugPageProps) {
    const { slug } = await params
    const waitedParams = await searchParams

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

