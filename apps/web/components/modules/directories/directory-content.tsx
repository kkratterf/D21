import { getStartupsByDirectory } from '@/actions/startup'
import { StartupFiltersSkeleton } from '@/components/modules/startups/filters'
import { StartupPagination } from '@/components/modules/startups/pagination'
import ScrollToTop from '@/components/scrollToTopClient'
import { PAGE_SIZE } from '@/types/startup'
import type { StartupOrder } from '@/types/startup'
import { Suspense } from 'react'
import { StartupFiltersWrapper } from './startup-filters-wrapper'
import { StartupList } from './startup-list'

interface DirectoryContentProps {
    slug: string
    name?: string
    tags?: string[]
    fundingStages?: string[]
    teamSizes?: string[]
    page: number
    sort: StartupOrder
}

export async function DirectoryContent({
    slug,
    name,
    tags,
    fundingStages,
    teamSizes,
    page,
    sort
}: DirectoryContentProps) {
    // Get startups with filters and pagination
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

    return (
        <>
            <Suspense fallback={<StartupFiltersSkeleton />}>
                <StartupFiltersWrapper slug={slug} />
            </Suspense>

            <Suspense>
                <ScrollToTop />
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
            </Suspense>
        </>
    )
} 