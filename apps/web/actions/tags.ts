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