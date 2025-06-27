'use server'

import { prisma } from "@/lib/prisma"

export async function getTags(directoryId: string) {
    if (!directoryId) {
        throw new Error("Directory ID is required")
    }

    // First check if the directory exists
    const directory = await prisma.directory.findUnique({
        where: { slug: directoryId }
    })

    if (!directory) {
        throw new Error("Directory not found")
    }

    // Get all startups from the current directory and extract unique tags
    const startups = await prisma.startup.findMany({
        where: {
            directoryId: directory.id
        },
        select: {
            id: true,
            name: true,
            tags: true
        }
    })

    // Extract and deduplicate tags
    const allTags = startups
        .flatMap(startup => startup.tags)
        .filter((tag): tag is string => tag !== null && tag !== undefined)
        .filter((tag, index, self) => self.indexOf(tag) === index)
        .sort()

    return allTags
}

export async function getStartupTags(directorySlug: string) {
    if (!directorySlug) {
        throw new Error("Directory slug is required")
    }

    // First check if the directory exists
    const directory = await prisma.directory.findUnique({
        where: { slug: directorySlug }
    })

    if (!directory) {
        throw new Error("Directory not found")
    }

    // Get all visible startups from the current directory and extract unique tags
    const startups = await prisma.startup.findMany({
        where: {
            directoryId: directory.id,
            visible: true
        },
        select: {
            id: true,
            name: true,
            tags: true
        }
    })

    // Extract and deduplicate tags
    const allTags = startups
        .flatMap(startup => startup.tags)
        .filter((tag): tag is string => tag !== null && tag !== undefined)
        .filter((tag, index, self) => self.indexOf(tag) === index)
        .sort()

    return allTags.map(tag => ({
        label: tag,
        value: tag
    }));
}

export async function getStartupFundingStages(directorySlug: string) {
    if (!directorySlug) {
        throw new Error("Directory slug is required")
    }

    // First check if the directory exists
    const directory = await prisma.directory.findUnique({
        where: { slug: directorySlug }
    })

    if (!directory) {
        throw new Error("Directory not found")
    }

    // Get all visible startups from the current directory with their funding stages
    const startups = await prisma.startup.findMany({
        where: {
            directoryId: directory.id,
            visible: true,
            fundingStageId: {
                not: null
            }
        },
        include: {
            fundingStage: true
        }
    })

    // Extract and deduplicate funding stages
    const allFundingStages = startups
        .map(startup => startup.fundingStage)
        .filter((stage): stage is NonNullable<typeof stage> => stage !== null)
        .filter((stage, index, self) => self.findIndex(s => s.id === stage.id) === index)
        .sort((a, b) => a.order - b.order)

    return allFundingStages.map(stage => ({
        label: stage.name,
        value: stage.id
    }));
}

export async function getStartupTeamSizes(directorySlug: string) {
    if (!directorySlug) {
        throw new Error("Directory slug is required")
    }

    // First check if the directory exists
    const directory = await prisma.directory.findUnique({
        where: { slug: directorySlug }
    })

    if (!directory) {
        throw new Error("Directory not found")
    }

    // Get all visible startups from the current directory with their team sizes
    const startups = await prisma.startup.findMany({
        where: {
            directoryId: directory.id,
            visible: true,
            teamSizeId: {
                not: null
            }
        },
        include: {
            teamSize: true
        }
    })

    // Extract and deduplicate team sizes
    const allTeamSizes = startups
        .map(startup => startup.teamSize)
        .filter((size): size is NonNullable<typeof size> => size !== null)
        .filter((size, index, self) => self.findIndex(s => s.id === size.id) === index)
        .sort((a, b) => a.minSize - b.minSize)

    return allTeamSizes.map(size => ({
        label: size.name,
        value: size.id
    }));
}

// Funzioni per l'admin che includono tutte le startup (visibili e non)
export async function getStartupTagsForAdmin(directorySlug: string) {
    if (!directorySlug) {
        throw new Error("Directory slug is required")
    }

    // First check if the directory exists
    const directory = await prisma.directory.findUnique({
        where: { slug: directorySlug }
    })

    if (!directory) {
        throw new Error("Directory not found")
    }

    // Get all startups from the current directory and extract unique tags (include both visible and hidden)
    const startups = await prisma.startup.findMany({
        where: {
            directoryId: directory.id
        },
        select: {
            id: true,
            name: true,
            tags: true
        }
    })

    // Extract and deduplicate tags
    const allTags = startups
        .flatMap(startup => startup.tags)
        .filter((tag): tag is string => tag !== null && tag !== undefined)
        .filter((tag, index, self) => self.indexOf(tag) === index)
        .sort()

    return allTags.map(tag => ({
        label: tag,
        value: tag
    }));
}

export async function getStartupFundingStagesForAdmin(directorySlug: string) {
    if (!directorySlug) {
        throw new Error("Directory slug is required")
    }

    // First check if the directory exists
    const directory = await prisma.directory.findUnique({
        where: { slug: directorySlug }
    })

    if (!directory) {
        throw new Error("Directory not found")
    }

    // Get all startups from the current directory with their funding stages (include both visible and hidden)
    const startups = await prisma.startup.findMany({
        where: {
            directoryId: directory.id,
            fundingStageId: {
                not: null
            }
        },
        include: {
            fundingStage: true
        }
    })

    // Extract and deduplicate funding stages
    const allFundingStages = startups
        .map(startup => startup.fundingStage)
        .filter((stage): stage is NonNullable<typeof stage> => stage !== null)
        .filter((stage, index, self) => self.findIndex(s => s.id === stage.id) === index)
        .sort((a, b) => a.order - b.order)

    return allFundingStages.map(stage => ({
        label: stage.name,
        value: stage.id
    }));
}

export async function getStartupTeamSizesForAdmin(directorySlug: string) {
    if (!directorySlug) {
        throw new Error("Directory slug is required")
    }

    // First check if the directory exists
    const directory = await prisma.directory.findUnique({
        where: { slug: directorySlug }
    })

    if (!directory) {
        throw new Error("Directory not found")
    }

    // Get all startups from the current directory with their team sizes (include both visible and hidden)
    const startups = await prisma.startup.findMany({
        where: {
            directoryId: directory.id,
            teamSizeId: {
                not: null
            }
        },
        include: {
            teamSize: true
        }
    })

    // Extract and deduplicate team sizes
    const allTeamSizes = startups
        .map(startup => startup.teamSize)
        .filter((size): size is NonNullable<typeof size> => size !== null)
        .filter((size, index, self) => self.findIndex(s => s.id === size.id) === index)
        .sort((a, b) => a.minSize - b.minSize)

    return allTeamSizes.map(size => ({
        label: size.name,
        value: size.id
    }));
} 