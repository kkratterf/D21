'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import type { GetStartups, StartupOrder } from '@/types/startup'
import { PAGE_SIZE, } from '@/types/startup'
import { Decimal } from 'decimal.js'
import { revalidatePath } from 'next/cache'
import { checkDirectoryAccess } from './directory'

// Include per i dati utili delle startup
const includeForUsefullDataStartup = {
    teamSize: true,
    fundingStage: true,
    directory: {
        select: {
            id: true,
            name: true,
            slug: true,
        },
    },
};

// Funzione per determinare l'ordinamento
const getOrderBy = (sort: StartupOrder) => {
    switch (sort) {
        case "nameAsc":
            return { name: 'asc' as const };
        case "nameDesc":
            return { name: 'desc' as const };
        case "createdAtAsc":
            return { createdAt: 'asc' as const };
        case "createdAtDesc":
            return { createdAt: 'desc' as const };
        case "foundedAtAsc":
            return { foundedAt: 'asc' as const };
        case "foundedAtDesc":
            return { foundedAt: 'desc' as const };
        default:
            return { name: 'asc' as const };
    }
}

// Funzione principale per ottenere startup con paginazione
export const getStartups = async ({
    name,
    tags,
    fundingStages,
    teamSizes,
    locations,
    isPopular,
    positionForFeatured,
    page = 1,
    sort = "nameAsc"
}: GetStartups) => {
    const fullInclude = {
        ...includeForUsefullDataStartup,
    };

    const query = {
        where: {
            visible: true,
            isPopular: isPopular,
            name: name ? {
                contains: name,
                mode: 'insensitive' as const
            } : undefined,
            tags: tags?.length ? {
                hasSome: tags
            } : undefined,
            fundingStageId: fundingStages?.length ? {
                in: fundingStages
            } : undefined,
            teamSizeId: teamSizes?.length ? {
                in: teamSizes
            } : undefined,
            location: locations?.length ? {
                in: locations
            } : undefined
        },
        orderBy: getOrderBy(sort),
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        include: fullInclude
    };

    // Fetch startups and count in una transazione per efficienza
    const [startups, count] = await prisma.$transaction([
        prisma.startup.findMany(query),
        prisma.startup.count({ where: query.where })
    ]);

    const processedStartups = startups.map(startup => ({
        ...startup,
        amountRaised: startup.amountRaised ? Number(startup.amountRaised) : null
    }));

    // Aggiungi startup in evidenza se necessario
    if (count > 0 && positionForFeatured !== undefined) {
        const featuredStartup = await prisma.startup.findFirst({
            where: {
                visible: true,
                // Qui potresti aggiungere una logica per determinare le startup in evidenza
            },
            include: fullInclude
        });

        if (featuredStartup) {
            const featuredWithAmount = {
                ...featuredStartup,
                amountRaised: featuredStartup.amountRaised ? Number(featuredStartup.amountRaised) : null
            };

            // Inserisci alla posizione specificata
            processedStartups.splice(
                positionForFeatured,
                0,
                featuredWithAmount
            );
        }
    }

    return { startups: processedStartups, count };
}

export async function createStartupAction(formData: FormData) {
    const directoryId = formData.get('directoryId') as string

    const directory = await prisma.directory.findUnique({
        where: {
            slug: directoryId
        }
    })

    if (!directory) {
        throw new Error('Directory not found')
    }

    const name = formData.get('name') as string
    const shortDescription = formData.get('shortDescription') as string
    const longDescription = formData.get('longDescription') ? (formData.get('longDescription') as string) : null
    const websiteUrl = formData.get('websiteUrl') as string
    const logoUrl = formData.get('logoUrl') ? (formData.get('logoUrl') as string) : null
    const foundedAt = formData.get('foundedAt') ? new Date(formData.get('foundedAt') as string) : null
    const location = (formData.get('location') as string) || ''
    const longitude = formData.get('longitude') ? Number.parseFloat(formData.get('longitude') as string) : 0
    const latitude = formData.get('latitude') ? Number.parseFloat(formData.get('latitude') as string) : 0
    const teamSizeId = formData.get('teamSizeId') as string
    const fundingStageId = formData.get('fundingStageId') as string
    const contactEmail = formData.get('contactEmail') ? (formData.get('contactEmail') as string) : null
    const linkedinUrl = formData.get('linkedinUrl') as string
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim())
    const amountRaised = formData.get('amountRaised') ? new Decimal(formData.get('amountRaised') as string) : null
    const currency = formData.get('currency') && (formData.get('currency') as string).trim() ? (formData.get('currency') as string).trim() : null

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    await prisma.startup.create({
        data: {
            name,
            shortDescription,
            longDescription,
            websiteUrl,
            logoUrl,
            slug,
            foundedAt,
            location,
            longitude,
            latitude,
            teamSizeId,
            fundingStageId,
            contactEmail,
            linkedinUrl,
            tags,
            amountRaised,
            currency,
            directoryId: directory.id,
            visible: false
        }
    })

    revalidatePath(`/dashboard/${directory.slug}`)

    return { success: true }
}

export async function updateStartupAction(formData: FormData) {
    const startupId = formData.get('startupId') as string
    const directoryId = formData.get('directoryId') as string

    const directory = await prisma.directory.findUnique({
        where: {
            slug: directoryId
        }
    })

    if (!directory) {
        throw new Error('Directory not found')
    }

    // Verifica che la startup esista
    const existingStartup = await prisma.startup.findUnique({
        where: { id: startupId }
    })

    if (!existingStartup) {
        throw new Error('Startup not found')
    }

    const name = formData.get('name') as string
    const shortDescription = formData.get('shortDescription') as string
    const longDescription = formData.get('longDescription') ? (formData.get('longDescription') as string) : null
    const websiteUrl = formData.get('websiteUrl') as string
    const logoUrl = formData.get('logoUrl') ? (formData.get('logoUrl') as string) : null
    const foundedAt = formData.get('foundedAt') ? new Date(formData.get('foundedAt') as string) : null
    const location = (formData.get('location') as string) || ''
    const longitude = formData.get('longitude') ? Number.parseFloat(formData.get('longitude') as string) : 0
    const latitude = formData.get('latitude') ? Number.parseFloat(formData.get('latitude') as string) : 0
    const teamSizeId = formData.get('teamSizeId') as string
    const fundingStageId = formData.get('fundingStageId') as string
    const contactEmail = formData.get('contactEmail') ? (formData.get('contactEmail') as string) : null
    const linkedinUrl = formData.get('linkedinUrl') as string
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim())
    const amountRaised = formData.get('amountRaised') ? new Decimal(formData.get('amountRaised') as string) : null
    const currency = formData.get('currency') && (formData.get('currency') as string).trim() ? (formData.get('currency') as string).trim() : null

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    await prisma.startup.update({
        where: { id: startupId },
        data: {
            name,
            shortDescription,
            longDescription,
            websiteUrl,
            logoUrl,
            slug,
            foundedAt,
            location,
            longitude,
            latitude,
            teamSizeId,
            fundingStageId,
            contactEmail,
            linkedinUrl,
            tags,
            amountRaised,
            currency,
        }
    })

    // Revalidate the dashboard page to update the UI
    revalidatePath(`/dashboard/${directoryId}`)

    return { success: true }
}

export async function toggleStartupVisibility(startupId: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, message: 'Not authenticated' }
        }

        // Get the startup to check directory access
        const startup = await prisma.startup.findUnique({
            where: { id: startupId },
            include: { directory: true }
        })

        if (!startup) {
            return { success: false, message: 'Startup not found' }
        }

        // Check if user has access to the directory
        const hasAccess = await checkDirectoryAccess(startup.directory.slug, user.id)
        if (!hasAccess) {
            return { success: false, message: 'You do not have access to this directory' }
        }

        // Toggle visibility
        const updatedStartup = await prisma.startup.update({
            where: { id: startupId },
            data: { visible: !startup.visible }
        })

        // Revalidate the dashboard page to update the UI
        revalidatePath(`/dashboard/${startup.directory.slug}`)

        return {
            success: true,
            message: updatedStartup.visible ? '👀 Startup visible' : '🙈 Startup hidden',
            visible: updatedStartup.visible,
            startupId: updatedStartup.id
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
    }
}

export async function getVisibleStartups(directoryId?: string) {
    const startups = await prisma.startup.findMany({
        where: {
            visible: true,
            ...(directoryId ? { directoryId } : {}),
        },
        select: {
            id: true,
            name: true,
            shortDescription: true,
            longDescription: true,
            slug: true,
            tags: true,
            createdAt: true,
            updatedAt: true,
            location: true,
            longitude: true,
            latitude: true,
            metadata: true,
            logoUrl: true,
            teamSize: true,
            fundingStage: true,
            visible: true,
            directoryId: true,
            websiteUrl: true,
            foundedAt: true,
            teamSizeId: true,
            fundingStageId: true,
            contactEmail: true,
            linkedinUrl: true,
            amountRaised: true,
            currency: true,
            directory: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });

    return startups.map(startup => ({
        ...startup,
        amountRaised: startup.amountRaised ? Number(startup.amountRaised) : null
    }));
}

export async function getSubmittedStartups(directoryId: string) {
    const startups = await prisma.startup.findMany({
        where: {
            directoryId,
            visible: false
        },
        select: {
            id: true,
            name: true,
            shortDescription: true,
            longDescription: true,
            slug: true,
            tags: true,
            createdAt: true,
            updatedAt: true,
            location: true,
            longitude: true,
            latitude: true,
            metadata: true,
            logoUrl: true,
            teamSize: true,
            fundingStage: true,
            visible: true,
            directoryId: true,
            websiteUrl: true,
            foundedAt: true,
            teamSizeId: true,
            fundingStageId: true,
            contactEmail: true,
            linkedinUrl: true,
            amountRaised: true,
            currency: true,
            directory: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return startups.map(startup => ({
        ...startup,
        amountRaised: startup.amountRaised ? Number(startup.amountRaised) : null
    }))
}

export async function deleteStartup(startupId: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, message: 'Not authenticated' }
        }

        // Get the startup to check directory access
        const startup = await prisma.startup.findUnique({
            where: { id: startupId },
            include: { directory: true }
        })

        if (!startup) {
            return { success: false, message: 'Startup not found' }
        }

        // Check if user has access to the directory
        const hasAccess = await checkDirectoryAccess(startup.directory.slug, user.id)
        if (!hasAccess) {
            return { success: false, message: 'You do not have access to this directory' }
        }

        // Delete the startup
        await prisma.startup.delete({
            where: { id: startupId }
        })

        return {
            success: true,
            message: '🗑️ Startup deleted successfully'
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
    }
}

export async function getStartupById(id: string) {
    const startup = await prisma.startup.findUnique({
        where: {
            id
        },
        include: {
            teamSize: true,
            fundingStage: true,
            directory: true
        }
    })

    if (!startup) return null

    return {
        ...startup,
        shortDescription: startup.shortDescription,
        longDescription: startup.longDescription,
        amountRaised: startup.amountRaised ? Number(startup.amountRaised) : null
    }
}

export async function getStartupsByDirectory({
    directorySlug,
    name,
    tags,
    fundingStages,
    teamSizes,
    page = 1,
    sort = "nameAsc"
}: {
    directorySlug: string;
    name?: string;
    tags?: string[];
    fundingStages?: string[];
    teamSizes?: string[];
    page?: number;
    sort?: StartupOrder;
}) {
    // First check if the directory exists
    const directory = await prisma.directory.findUnique({
        where: { slug: directorySlug }
    });

    if (!directory) {
        return { startups: [], count: 0 };
    }

    const fullInclude = {
        ...includeForUsefullDataStartup,
    };

    const query = {
        where: {
            visible: true,
            directoryId: directory.id,
            name: name ? {
                contains: name,
                mode: 'insensitive' as const
            } : undefined,
            tags: tags?.length ? {
                hasSome: tags
            } : undefined,
            fundingStageId: fundingStages?.length ? {
                in: fundingStages
            } : undefined,
            teamSizeId: teamSizes?.length ? {
                in: teamSizes
            } : undefined,
        },
        orderBy: getOrderBy(sort),
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        include: fullInclude
    };

    // Fetch startups and count in una transazione per efficienza
    const [startups, count] = await prisma.$transaction([
        prisma.startup.findMany(query),
        prisma.startup.count({ where: query.where })
    ]);

    const processedStartups = startups.map(startup => ({
        ...startup,
        amountRaised: startup.amountRaised ? Number(startup.amountRaised) : null
    }));

    return { startups: processedStartups, count };
}

export async function getVisibleStartupsBySlug(directorySlug: string) {
    // First check if the directory exists
    const directory = await prisma.directory.findUnique({
        where: { slug: directorySlug }
    });

    if (!directory) {
        return [];
    }

    const startups = await prisma.startup.findMany({
        where: {
            visible: true,
            directoryId: directory.id,
        },
        select: {
            id: true,
            name: true,
            shortDescription: true,
            longDescription: true,
            slug: true,
            tags: true,
            createdAt: true,
            updatedAt: true,
            location: true,
            longitude: true,
            latitude: true,
            metadata: true,
            logoUrl: true,
            teamSize: true,
            fundingStage: true,
            visible: true,
            directoryId: true,
            websiteUrl: true,
            foundedAt: true,
            teamSizeId: true,
            fundingStageId: true,
            contactEmail: true,
            linkedinUrl: true,
            amountRaised: true,
            currency: true,
            directory: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });

    return startups.map(startup => ({
        ...startup,
        amountRaised: startup.amountRaised ? Number(startup.amountRaised) : null
    }));
}

export async function getSubmittedStartupsBySlug(directorySlug: string) {
    // First check if the directory exists
    const directory = await prisma.directory.findUnique({
        where: { slug: directorySlug }
    });

    if (!directory) {
        return [];
    }

    const startups = await prisma.startup.findMany({
        where: {
            directoryId: directory.id,
            visible: false
        },
        select: {
            id: true,
            name: true,
            shortDescription: true,
            longDescription: true,
            slug: true,
            tags: true,
            createdAt: true,
            updatedAt: true,
            location: true,
            longitude: true,
            latitude: true,
            metadata: true,
            logoUrl: true,
            teamSize: true,
            fundingStage: true,
            visible: true,
            directoryId: true,
            websiteUrl: true,
            foundedAt: true,
            teamSizeId: true,
            fundingStageId: true,
            contactEmail: true,
            linkedinUrl: true,
            amountRaised: true,
            currency: true,
            directory: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return startups.map(startup => ({
        ...startup,
        amountRaised: startup.amountRaised ? Number(startup.amountRaised) : null
    }))
}

export async function approveStartup(startupId: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, message: 'Not authenticated' }
        }

        // Get the startup to check directory access
        const startup = await prisma.startup.findUnique({
            where: { id: startupId },
            include: { directory: true }
        })

        if (!startup) {
            return { success: false, message: 'Startup not found' }
        }

        // Check if user has access to the directory
        const hasAccess = await checkDirectoryAccess(startup.directory.slug, user.id)
        if (!hasAccess) {
            return { success: false, message: 'You do not have access to this directory' }
        }

        // Approve the startup
        const updatedStartup = await prisma.startup.update({
            where: { id: startupId },
            data: { visible: true }
        })

        return {
            success: true,
            message: '✅ Startup approvata con successo!',
            startupId: updatedStartup.id
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
    }
}

export async function rejectStartup(startupId: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, message: 'Not authenticated' }
        }

        // Get the startup to check directory access
        const startup = await prisma.startup.findUnique({
            where: { id: startupId },
            include: { directory: true }
        })

        if (!startup) {
            return { success: false, message: 'Startup not found' }
        }

        // Check if user has access to the directory
        const hasAccess = await checkDirectoryAccess(startup.directory.slug, user.id)
        if (!hasAccess) {
            return { success: false, message: 'You do not have access to this directory' }
        }

        // Delete the startup
        await prisma.startup.delete({
            where: { id: startupId }
        })

        return {
            success: true,
            message: '❌ Startup rifiutata e rimossa',
            startupId: startupId
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
    }
}

export async function getStartupsByDirectoryForAdmin({
    directorySlug,
    name,
    tags,
    fundingStages,
    teamSizes,
    page = 1,
    sort = "nameAsc",
    includeHidden = true
}: {
    directorySlug: string;
    name?: string;
    tags?: string[];
    fundingStages?: string[];
    teamSizes?: string[];
    page?: number;
    sort?: StartupOrder;
    includeHidden?: boolean;
}) {
    // First check if the directory exists
    const directory = await prisma.directory.findUnique({
        where: { slug: directorySlug }
    });

    if (!directory) {
        return { startups: [], count: 0 };
    }

    const fullInclude = {
        ...includeForUsefullDataStartup,
    };

    const query = {
        where: {
            directoryId: directory.id,
            // Se includeHidden è true, mostra tutte le startup (visibili e non)
            // Altrimenti mostra solo quelle visibili
            ...(includeHidden ? {} : { visible: true }),
            name: name ? {
                contains: name,
                mode: 'insensitive' as const
            } : undefined,
            tags: tags?.length ? {
                hasSome: tags
            } : undefined,
            fundingStageId: fundingStages?.length ? {
                in: fundingStages
            } : undefined,
            teamSizeId: teamSizes?.length ? {
                in: teamSizes
            } : undefined,
        },
        orderBy: getOrderBy(sort),
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        include: fullInclude
    };

    // Fetch startups and count in una transazione per efficienza
    const [startups, count] = await prisma.$transaction([
        prisma.startup.findMany(query),
        prisma.startup.count({ where: query.where })
    ]);

    const processedStartups = startups.map(startup => ({
        ...startup,
        amountRaised: startup.amountRaised ? Number(startup.amountRaised) : null
    }));

    return { startups: processedStartups, count };
}

export async function getStartupsCount() {
    const count = await prisma.startup.count({
        where: {
            visible: true
        }
    })
    return { value: count }
}