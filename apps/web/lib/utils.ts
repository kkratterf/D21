import type { DirectoryOrder } from "@/types/directory";
import type { StartupOrder } from "@/types/startup";

export interface SearchParams {
    name?: string;
    page: string;
    categories?: string;
    fundingStage?: string;
    location?: string;
    teamSize?: string;
    sort?: StartupOrder;
}

export interface DirectorySearchParams {
    name?: string;
    page: string;
    tags?: string;
    location?: string;
    featured?: string;
    sort?: DirectoryOrder;
}

export interface DashboardSearchParams {
    name?: string;
    page: string;
    sort?: DirectoryOrder;
}

export function parseSearchParams(
    params: Record<string, string | string[] | undefined>
): SearchParams {
    return {
        name: typeof params.name === 'string' ? params.name : undefined,
        page: typeof params.page === 'string' ? params.page : "1",
        categories: typeof params.categories === 'string' ? params.categories : undefined,
        fundingStage: typeof params.fundingStage === 'string' ? params.fundingStage : undefined,
        location: typeof params.location === 'string' ? params.location : undefined,
        teamSize: typeof params.teamSize === 'string' ? params.teamSize : undefined,
        sort: typeof params.sort === 'string' ? params.sort as StartupOrder : 'nameAsc'
    };
}

export function parseDirectorySearchParams(
    params: Record<string, string | string[] | undefined>
): DirectorySearchParams {
    return {
        name: typeof params.name === 'string' ? params.name : undefined,
        page: typeof params.page === 'string' ? params.page : "1",
        tags: typeof params.tags === 'string' ? params.tags : undefined,
        location: typeof params.location === 'string' ? params.location : undefined,
        featured: typeof params.featured === 'string' ? params.featured : undefined,
        sort: typeof params.sort === 'string' ? params.sort as DirectoryOrder : 'featuredOrderAsc'
    };
}

export function parseDashboardSearchParams(
    params: Record<string, string | string[] | undefined>
): DashboardSearchParams {
    return {
        name: typeof params.name === 'string' ? params.name : undefined,
        page: typeof params.page === 'string' ? params.page : "1",
        sort: typeof params.sort === 'string' ? params.sort as DirectoryOrder : 'createdAtDesc'
    };
}

export function stringifyDashboardSearchParams(params: DashboardSearchParams): string {
    const urlParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && (Array.isArray(value) ? value.length : true)) {
            urlParams.append(key, value);
        }
    }
    return urlParams.toString();
}