import type { StartupOrder } from '@/types/startup'

export interface ParsedSearchParams {
    name?: string
    tags?: string[]
    fundingStages?: string[]
    teamSizes?: string[]
    page: number
    sort: StartupOrder
}

export function parseSearchParams(searchParams: Record<string, string | string[] | undefined>): ParsedSearchParams {
    const name = Array.isArray(searchParams.name) ? searchParams.name[0] : searchParams.name
    const tags = searchParams.tags
        ? (Array.isArray(searchParams.tags) ? searchParams.tags[0] : searchParams.tags).split(',')
        : undefined
    const fundingStages = searchParams.fundingStages
        ? (Array.isArray(searchParams.fundingStages) ? searchParams.fundingStages[0] : searchParams.fundingStages).split(',')
        : undefined
    const teamSizes = searchParams.teamSizes
        ? (Array.isArray(searchParams.teamSizes) ? searchParams.teamSizes[0] : searchParams.teamSizes).split(',')
        : undefined
    const page = Number.parseInt(searchParams.page as string || '1', 10)
    const sort = (searchParams.sort as StartupOrder) || "nameAsc"

    return {
        name,
        tags,
        fundingStages,
        teamSizes,
        page,
        sort
    }
} 