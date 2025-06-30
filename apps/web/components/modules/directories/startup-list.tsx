import Empty from '@/components/ui/empty'
import StartupCard from '@/components/ui/startup-card'
import type { FundingStage, Startup, TeamSize } from '@prisma/client'

interface StartupWithRelations extends Omit<Startup, 'amountRaised' | 'description'> {
    amountRaised: number | null;
    shortDescription: string;
    longDescription: string | null;
    teamSize: TeamSize | null;
    fundingStage: FundingStage | null;
    directory: {
        id: string;
        name: string;
        slug: string;
    };
}

interface StartupListProps {
    startups: StartupWithRelations[]
    tags?: string[]
    fundingStages?: string[]
    teamSizes?: string[]
    shared?: boolean
}

export function StartupList({ startups, tags = [], fundingStages = [], teamSizes = [], shared = false }: StartupListProps) {
    if (startups.length === 0) {
        return (
            <Empty
                title="No startups found"
                description="No startups found. But hey, don't give up! Try again later."
            />
        )
    }

    return (
        <div className='flex flex-col gap-1 px-3 py-4 w-full h-full'>
            {startups.map((startup) => (
                <StartupCard
                    key={startup.id}
                    item={startup}
                    selectedTags={tags}
                    selectedFundingStages={fundingStages}
                    selectedTeamSizes={teamSizes}
                    shared={shared}
                />
            ))}
        </div>
    )
} 