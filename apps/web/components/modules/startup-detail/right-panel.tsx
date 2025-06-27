import type { FundingStage, Startup, TeamSize } from '@prisma/client';

import { Card } from "@d21/design-system/components/ui/card";

interface StartupWithRelations extends Omit<Startup, 'amountRaised'> {
    amountRaised: number | null;
    teamSize: TeamSize | null;
    fundingStage: FundingStage | null;
    directory: {
        id: string;
        name: string;
        slug: string;
    };
}

interface RightProps {
    startup: StartupWithRelations;
}

const RightPanel = ({ startup }: RightProps) => {
    return (
        <div className='flex w-full flex-col gap-3 pt-4 lg:sticky lg:top-6 lg:h-fit lg:w-2/5 lg:pt-0'>
            <div className='flex w-full flex-col gap-3'>
                <Card className='flex w-full flex-col gap-3'>
                    <div className='flex flex-row items-center justify-between'>
                        <p className="font-mono text-description">Team size</p>
                        {startup.teamSize ? (
                            <p className="font-mono">{startup.teamSize.name}</p>
                        ) : (
                            <p className="font-mono">Unknown</p>
                        )}
                    </div>
                    <div className='flex flex-row items-center justify-between'>
                        <p className="font-mono text-description">Location</p>
                        <p className="font-mono">{startup.location}</p>
                    </div>
                    <div className='flex flex-row items-center justify-between'>
                        <p className="font-mono text-description">Foundation date</p>
                        <p className="font-mono">{startup.foundedAt ? startup.foundedAt.getFullYear() : 'Unknown'}</p>
                    </div>
                </Card>
                <Card className='flex flex-col gap-4 xl:flex-row'>
                    <div className='flex w-full flex-col gap-1'>
                        <p className="font-mono text-description">Funding stage</p>
                        {startup.fundingStage ? (
                            <p className="text-heading-body">{startup.fundingStage.name}</p>
                        ) : (
                            <p className="text-heading-body">Unknown</p>
                        )}
                    </div>
                    <div className='flex w-full flex-col gap-1'>
                        <p className="font-mono text-description">Amount raised</p>
                        {startup.amountRaised !== null && startup.amountRaised !== undefined ? (
                            <p className="text-heading-body">
                                {startup.amountRaised.toLocaleString('it-IT')} €
                            </p>
                        ) : (
                            <p className="text-heading-body">Unknown</p>
                        )}
                    </div>
                </Card>
                <div className='flex w-full flex-row items-center justify-between px-6 py-3 pb-12'>
                    <p className="font-mono text-description text-sm">Share</p>
                    <div className="flex gap-2">
                        {/* Share buttons placeholder */}
                        <span className="text-description text-sm">Share functionality</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightPanel; 