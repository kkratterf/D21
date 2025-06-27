'use client';

import DirectoryFilters from './filters';

interface DirectoryFiltersClientProps {
    tags: { label: string; value: string; }[];
}

export function DirectoryFiltersClient({ tags }: DirectoryFiltersClientProps) {
    return <DirectoryFilters tags={tags} />;
} 