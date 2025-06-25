export type StartupOrder = "nameAsc" | "nameDesc" | "createdAtAsc" | "createdAtDesc" | "foundedAtAsc" | "foundedAtDesc";

export const PAGE_SIZE = 25;
export const defaultSorting: StartupOrder = "nameAsc";

export interface GetStartups {
    name?: string;
    tags?: string[];
    fundingStages?: string[];
    teamSizes?: string[];
    locations?: string[];
    isPopular?: boolean;
    positionForFeatured?: number;
    page?: number;
    sort?: StartupOrder;
} 