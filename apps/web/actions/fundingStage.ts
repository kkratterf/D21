'use server'

import { prisma } from "@/lib/prisma"

export async function getFundingStages() {
    return await prisma.fundingStage.findMany({
        orderBy: {
            order: 'asc'
        }
    })
}