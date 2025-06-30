import type { Startup as PrismaStartup } from '@prisma/client';

export type StartupOrder = "nameAsc" | "nameDesc" | "createdAtAsc" | "createdAtDesc" | "foundedAtAsc" | "foundedAtDesc";

export const PAGE_SIZE = 25;
export const defaultSorting: StartupOrder = "nameAsc";

// Tipo Startup esteso con le relazioni e gestione dei tipi null/undefined
export type Startup = Omit<PrismaStartup, 'logoUrl' | 'websiteUrl' | 'contactEmail' | 'linkedinUrl' | 'longDescription' | 'foundedAt' | 'teamSizeId' | 'fundingStageId' | 'amountRaised' | 'currency'> & {
    logoUrl?: string | null;
    websiteUrl?: string | null;
    contactEmail?: string | null;
    linkedinUrl?: string | null;
    longDescription?: string | null;
    foundedAt?: Date | null;
    teamSizeId?: string | null;
    fundingStageId?: string | null;
    amountRaised?: number | null;
    currency?: string | null;
    teamSize?: { name: string } | null;
    fundingStage?: { name: string } | null;
    directory: {
        id: string;
        name: string;
        slug: string;
    };
};

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