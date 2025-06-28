'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import type { DirectoryOrder, GetDirectories } from '@/types/directory'
import { DIRECTORY_PAGE_SIZE, } from '@/types/directory'
import { revalidatePath } from 'next/cache'

const includeForUsefullDataDirectory = {
    _count: {
        select: {
            startups: {
                where: {
                    visible: true
                }
            }
        }
    }
};

const getDirectoryOrderBy = (sort: DirectoryOrder) => {
    switch (sort) {
        case "nameAsc":
            return { name: 'asc' as const };
        case "nameDesc":
            return { name: 'desc' as const };
        case "createdAtAsc":
            return { createdAt: 'asc' as const };
        case "createdAtDesc":
            return { createdAt: 'desc' as const };
        case "featuredOrderAsc":
            return { featuredOrder: 'asc' as const };
        case "featuredOrderDesc":
            return { featuredOrder: 'desc' as const };
        default:
            return { featuredOrder: 'asc' as const };
    }
}

export const getDirectoriesWithPagination = async ({
    name,
    tags,
    locations,
    featured,
    page = 1,
    sort = "featuredOrderAsc"
}: GetDirectories) => {
    const fullInclude = {
        ...includeForUsefullDataDirectory,
    };

    const query = {
        where: {
            visible: true,
            ...(featured !== undefined && { featured: featured }),
            name: name ? {
                contains: name,
                mode: 'insensitive' as const
            } : undefined,
            tags: tags?.length ? {
                hasSome: tags
            } : undefined,
            location: locations?.length ? {
                in: locations
            } : undefined
        },
        orderBy: getDirectoryOrderBy(sort),
        take: DIRECTORY_PAGE_SIZE,
        skip: (page - 1) * DIRECTORY_PAGE_SIZE,
        include: fullInclude
    };

    const [directories, count] = await prisma.$transaction([
        prisma.directory.findMany(query),
        prisma.directory.count({ where: query.where })
    ]);

    return { directories, count };
}

export async function getDirectories(options?: {
    include?: {
        startups?: {
            select?: {
                latitude?: boolean
                longitude?: boolean
            }
        }
    },
    orderBy?: { [key: string]: 'asc' | 'desc' },
    limit?: number,
    page?: number
}) {
    return await prisma.directory.findMany({
        where: {
            visible: true
        },
        include: {
            _count: {
                select: {
                    startups: {
                        where: {
                            visible: true
                        }
                    }
                }
            },
            ...options?.include
        },
        orderBy: options?.orderBy || {
            featuredOrder: 'asc'
        },
        ...(options?.limit && { take: options.limit }),
        ...(options?.page && options?.limit && { skip: (options.page - 1) * options.limit })
    })
}

export async function getFeaturedDirectories() {
    const directories = await prisma.directory.findMany({
        where: {
            visible: true,
            featured: true
        },
        include: {
            _count: {
                select: {
                    startups: true
                }
            }
        },
        orderBy: {
            featuredOrder: 'asc'
        }
    })
    return directories
}

export const getUserDirectoriesWithPagination = async ({
    name,
    page = 1,
    sort = "createdAtDesc"
}: {
    name?: string;
    page?: number;
    sort?: DirectoryOrder;
}) => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { directories: [], count: 0 }
    }

    const fullInclude = {
        ...includeForUsefullDataDirectory,
    };

    const query = {
        where: {
            userId: user.id,
            name: name ? {
                contains: name,
                mode: 'insensitive' as const
            } : undefined,
        },
        orderBy: getDirectoryOrderBy(sort),
        take: DIRECTORY_PAGE_SIZE,
        skip: (page - 1) * DIRECTORY_PAGE_SIZE,
        include: fullInclude
    };

    const [directories, count] = await prisma.$transaction([
        prisma.directory.findMany(query),
        prisma.directory.count({ where: query.where })
    ]);

    return { directories, count };
}

export async function createDirectoryAction(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const imageUrl = formData.get('imageUrl') as string
    const link = formData.get('link') as string
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    const location = formData.get('location') as string
    const longitude = formData.get('longitude') ? Number.parseFloat(formData.get('longitude') as string) : null
    const latitude = formData.get('latitude') ? Number.parseFloat(formData.get('latitude') as string) : null
    const slug = formData.get('slug') as string

    // Verifica che lo slug sia univoco
    const isSlugUnique = await checkSlugUniqueness(slug)
    if (!isSlugUnique) {
        throw new Error('Slug già esistente. Scegli un altro slug.')
    }

    await prisma.directory.create({
        data: {
            name,
            description,
            imageUrl: imageUrl || null,
            link: link || null,
            tags,
            location: location || null,
            longitude,
            latitude,
            userId: user.id,
            slug,
            featured: false,
            visible: false
        }
    })

    revalidatePath('/')
    revalidatePath('/dashboard')
    return { success: true }
}

export async function getDirectoryBySlug(slug: string) {
    const directory = await prisma.directory.findUnique({
        where: {
            slug,
            visible: true
        },
        include: {
            _count: {
                select: {
                    startups: true
                }
            },
            startups: {
                where: {
                    visible: true
                },
                include: {
                    teamSize: true,
                    fundingStage: true,
                    directory: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                }
            }
        }
    })

    if (!directory) return null

    return {
        ...directory,
        startups: directory.startups.map(startup => ({
            ...startup,
            amountRaised: startup.amountRaised ? Number(startup.amountRaised) : null
        }))
    }
}

export async function getDirectoryBySlugForAdmin(slug: string) {
    const directory = await prisma.directory.findUnique({
        where: {
            slug
        },
        include: {
            _count: {
                select: {
                    startups: true
                }
            },
            startups: {
                include: {
                    teamSize: true,
                    fundingStage: true,
                    directory: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                }
            }
        }
    })

    if (!directory) return null

    return {
        ...directory,
        startups: directory.startups.map(startup => ({
            ...startup,
            amountRaised: startup.amountRaised ? Number(startup.amountRaised) : null
        }))
    }
}

export async function checkDirectoryAccess(slug: string, userId: string) {
    const directory = await prisma.directory.findUnique({
        where: {
            slug
        }
    })

    return directory?.userId === userId
}

export async function checkSlugUniqueness(slug: string) {
    const existingDirectory = await prisma.directory.findUnique({
        where: { slug }
    })
    return !existingDirectory
}

export async function getDirectoriesCount() {
    const count = await prisma.directory.count({
        where: {
            visible: true
        }
    })
    return { value: count }
}

export async function getDirectoryTags() {
    const directories = await prisma.directory.findMany({
        where: {
            visible: true
        },
        select: {
            tags: true
        }
    });

    // Estrai tutti i tag e rimuovi duplicati
    const allTags = directories
        .flatMap(directory => directory.tags)
        .filter((tag): tag is string => tag !== null && tag !== undefined)
        .filter((tag, index, self) => self.indexOf(tag) === index)
        .sort();

    return allTags.map(tag => ({
        label: tag,
        value: tag
    }));
}

export async function getUserDirectories() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    return prisma.directory.findMany({
        where: {
            userId: user.id
        },
        include: {
            _count: {
                select: {
                    startups: {
                        where: {
                            visible: true
                        }
                    }
                }
            },
            startups: {
                select: {
                    latitude: true,
                    longitude: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}

export async function getUserDirectoryTags() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const directories = await prisma.directory.findMany({
        where: {
            userId: user.id
        },
        select: {
            tags: true
        }
    });

    // Estrai tutti i tag e rimuovi duplicati
    const allTags = directories
        .flatMap(directory => directory.tags)
        .filter((tag): tag is string => tag !== null && tag !== undefined)
        .filter((tag, index, self) => self.indexOf(tag) === index)
        .sort();

    return allTags;
}

export async function setDirectoryVisibility(slug: string, visible: boolean) {
    const directory = await prisma.directory.update({
        where: { slug },
        data: { visible }
    })

    revalidatePath('/')
    revalidatePath('/dashboard')
    return directory
}

export async function updateDirectoryAction(formData: FormData) {
    const directoryId = formData.get('directoryId') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const imageUrl = formData.get('imageUrl') ? (formData.get('imageUrl') as string) : null
    const link = formData.get('link') ? (formData.get('link') as string) : null
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim())
    const location = formData.get('location') ? (formData.get('location') as string) : null
    const longitude = formData.get('longitude') ? Number.parseFloat(formData.get('longitude') as string) : null
    const latitude = formData.get('latitude') ? Number.parseFloat(formData.get('latitude') as string) : null
    const slug = formData.get('slug') as string

    // Verifica che la directory esista e che l'utente abbia accesso
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    // Verifica che la directory esista e che l'utente abbia accesso
    const existingDirectory = await prisma.directory.findUnique({
        where: { id: directoryId }
    })

    if (!existingDirectory) {
        throw new Error('Directory not found')
    }

    // Verifica che l'utente abbia accesso alla directory usando l'ID
    if (existingDirectory.userId !== user.id) {
        throw new Error('You do not have access to this directory')
    }

    await prisma.directory.update({
        where: { id: directoryId },
        data: {
            name,
            description,
            imageUrl,
            link,
            tags,
            location,
            longitude,
            latitude,
            slug,
        }
    })

    // Revalidate le pagine che potrebbero essere influenzate
    revalidatePath('/')
    revalidatePath('/dashboard')
    revalidatePath(`/dashboard/${existingDirectory.slug}`)
    revalidatePath(`/dashboard/${slug}`)
    revalidatePath(`/${existingDirectory.slug}`)
    revalidatePath(`/${slug}`)

    return { success: true }
}

export async function toggleDirectoryVisibility(directoryId: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, message: 'Not authenticated' }
        }

        // Get the directory to check access
        const directory = await prisma.directory.findUnique({
            where: { id: directoryId }
        })

        if (!directory) {
            return { success: false, message: 'Directory not found' }
        }

        // Check if user has access to the directory
        if (directory.userId !== user.id) {
            return { success: false, message: 'You do not have access to this directory' }
        }

        // Toggle visibility
        const updatedDirectory = await prisma.directory.update({
            where: { id: directoryId },
            data: { visible: !directory.visible }
        })

        // Revalidate the dashboard page to update the UI
        revalidatePath('/dashboard')
        revalidatePath(`/dashboard/${directory.slug}`)
        revalidatePath(`/${directory.slug}`)
        revalidatePath('/')

        return {
            success: true,
            message: updatedDirectory.visible ? '👀 Directory visible' : '🙈 Directory hidden',
            visible: updatedDirectory.visible,
            directoryId: updatedDirectory.id
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
    }
}

export async function deleteDirectory(directoryId: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, message: 'Not authenticated' }
        }

        // Get the directory to check access
        const directory = await prisma.directory.findUnique({
            where: { id: directoryId },
            include: {
                _count: {
                    select: {
                        startups: true
                    }
                }
            }
        })

        if (!directory) {
            return { success: false, message: 'Directory not found' }
        }

        // Check if user has access to the directory (is the owner/admin)
        if (directory.userId !== user.id) {
            return { success: false, message: 'You do not have access to this directory' }
        }

        // Delete the directory and all its startups in a transaction
        await prisma.$transaction(async (tx) => {
            // First delete all startups in the directory
            await tx.startup.deleteMany({
                where: { directoryId: directoryId }
            })

            // Then delete the directory
            await tx.directory.delete({
                where: { id: directoryId }
            })
        })

        // Revalidate the dashboard page to update the UI
        revalidatePath('/dashboard')
        revalidatePath('/')

        return {
            success: true,
            message: '🗑️ Directory deleted successfully',
            directoryId: directory.id
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
    }
}
