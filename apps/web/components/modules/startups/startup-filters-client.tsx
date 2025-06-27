'use client';

import StartupFilters from './filters';

interface StartupFiltersClientProps {
    tags: { label: string; value: string; }[];
    fundingStages: { label: string; value: string; }[];
    teamSizes: { label: string; value: string; }[];
    directorySlug: string;
}

export function StartupFiltersClient({ tags, fundingStages, teamSizes, directorySlug }: StartupFiltersClientProps) {
    return (
        <StartupFilters
            tags={tags}
            fundingStages={fundingStages}
            teamSizes={teamSizes}
            directorySlug={directorySlug}
        />
    );
} 