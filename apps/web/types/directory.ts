export type DirectoryOrder = "nameAsc" | "nameDesc" | "createdAtAsc" | "createdAtDesc" | "featuredOrderAsc" | "featuredOrderDesc";

export const DIRECTORY_PAGE_SIZE = 25;
export const defaultDirectorySorting: DirectoryOrder = "featuredOrderAsc";

export interface GetDirectories {
    name?: string;
    tags?: string[];
    locations?: string[];
    featured?: boolean | undefined;
    page?: number;
    sort?: DirectoryOrder;
} 