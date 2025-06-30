import type { } from '@prisma/client';

import ShareButtons from '@/components/ui/share-buttons';
import type { Startup } from '@/types/startup';
import { Card } from "@d21/design-system/components/ui/card";

interface RightProps {
    startup: Startup;
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
                        <p className="font-mono text-description">Foundation date</p>
                        <p className="font-mono">{startup.foundedAt ? startup.foundedAt.getFullYear() : 'Unknown'}</p>
                    </div>
                    {startup.contactEmail && (
                        <div className='flex flex-row items-center justify-between'>
                            <p className="font-mono text-description">Contact email</p>
                            <p className="font-mono">{startup.contactEmail}</p>
                        </div>
                    )}
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
                                {startup.amountRaised.toLocaleString('it-IT')} {startup.currency}
                            </p>
                        ) : (
                            <p className="text-heading-body">Unknown</p>
                        )}
                    </div>
                </Card>
                <div className='flex w-full flex-row items-center justify-between px-6 py-3 pb-12'>
                    <p className="font-mono text-description text-sm">Share</p>
                    <ShareButtons
                        directorySlug={startup.directory.slug}
                        startupId={startup.id}
                    />
                </div>
            </div>
        </div>
    );
};

export default RightPanel; 