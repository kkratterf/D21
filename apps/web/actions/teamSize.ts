'use server'

import { prisma } from "@/lib/prisma"

export async function getTeamSizes() {
    return await prisma.teamSize.findMany({
        orderBy: {
            minSize: 'asc'
        }
    })
}