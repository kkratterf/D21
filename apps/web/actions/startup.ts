'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { Decimal } from 'decimal.js'
import { checkDirectoryAccess } from './directory'

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
    const description = formData.get('description') as string
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

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    await prisma.startup.create({
        data: {
            name,
            description,
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
            directoryId: directory.id,
            visible: false
        }
    })

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
            description: true,
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
            description: true,
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
            message: 'Startup deleted successfully'
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
        amountRaised: startup.amountRaised ? Number(startup.amountRaised) : null
    }
}