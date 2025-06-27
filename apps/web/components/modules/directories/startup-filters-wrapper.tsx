import { getStartupFundingStages, getStartupTags, getStartupTeamSizes } from '@/actions/tags'
import { StartupFiltersClient } from '@/components/modules/startups/startup-filters-client'

interface StartupFiltersWrapperProps {
    slug: string
}

export async function StartupFiltersWrapper({ slug }: StartupFiltersWrapperProps) {
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