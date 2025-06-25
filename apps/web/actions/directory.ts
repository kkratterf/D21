'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getDirectories(options?: {
    include?: {
        startups?: {
            select?: {
                latitude?: boolean
                longitude?: boolean
            }
        }
    }
}) {
    return await prisma.directory.findMany({
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
        orderBy: {
            featuredOrder: 'asc'
        }
    })
}

export async function getFeaturedDirectories() {
    const directories = await prisma.directory.findMany({
        where: {
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
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim())
    const location = formData.get('location') as string
    const longitude = formData.get('longitude') ? Number.parseFloat(formData.get('longitude') as string) : null
    const latitude = formData.get('latitude') ? Number.parseFloat(formData.get('latitude') as string) : null
    const slug = formData.get('slug') as string

    await prisma.directory.create({
        data: {
            name,
            description,
            imageUrl,
            link,
            tags,
            location,
            longitude,
            latitude,
            userId: user.id,
            slug,
            featured: false
        }
    })

    revalidatePath('/')
    return { success: true }
}

export async function getDirectoryBySlug(slug: string) {
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
    const count = await prisma.directory.count()
    return { value: count }
}
