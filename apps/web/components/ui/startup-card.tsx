import type { FundingStage, Startup, TeamSize } from '@prisma/client';
import Link from 'next/link';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@d21/design-system/components/ui/avatar';
import { Skeleton } from '@d21/design-system/components/ui/skeleton';
import { Tag } from '@d21/design-system/components/ui/tag';
import { cn, focusRing } from '@d21/design-system/lib/utils';

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

interface StartupCardProps {
    item: StartupWithRelations;
    selectedTags?: string[];
    selectedFundingStages?: string[];
    selectedTeamSizes?: string[];
}

const StartupCard = ({
    item,
    selectedTags = [],
    selectedFundingStages = [],
    selectedTeamSizes = []
}: StartupCardProps) => {
    return (
        <Link
            key={item.name}
            href={`/${item.directory.slug}/${item.id}`}
            className={cn('rounded-xl', focusRing)}
        >
            <div className='group group flew-row flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-item-hover'>
                <Avatar className='size-10 rounded-xl border border-border'>
                    <AvatarImage
                        className='transition-all duration-400 group-hover:scale-105'
                        src={item.logoUrl || ""}
                        alt={item.name}
                        width={40}
                        height={40}
                    />
                    <AvatarFallback>
                        {item.name.slice(0, 2)}
                    </AvatarFallback>
                </Avatar>
                <div className='flex w-full flex-row items-center gap-2'>
                    <p className='whitespace-nowrap font-semibold text-base'>{item.name}</p>
                    <p className='line-clamp-1 text-description text-sm'>
                        {item.description}
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='hidden flex-row gap-[2px] lg:flex'>
                        {item.fundingStage && (
                            <Tag
                                variant="neutral"
                                className={cn('rounded-full',
                                    selectedFundingStages.includes(item.fundingStage.id)
                                        ? 'text border-item bg-item-hover'
                                        : 'border-border bg-background text-description'
                                )}
                            >
                                {item.fundingStage.name}
                            </Tag>
                        )}
                        {item.teamSize && (
                            <Tag
                                variant="neutral"
                                className={cn('rounded-full',
                                    selectedTeamSizes.includes(item.teamSize.id)
                                        ? 'text border-item bg-item-hover'
                                        : 'border-border bg-background text-description'
                                )}
                            >
                                {item.teamSize.name}
                            </Tag>
                        )}
                        {item.tags?.map((tag: string, index: number) => (
                            <Tag
                                variant="neutral"
                                className={cn('rounded-full',
                                    selectedTags.includes(tag)
                                        ? 'text border-item bg-item-hover'
                                        : 'border-border bg-background text-description'
                                )}
                                key={index}
                            >
                                {tag}
                            </Tag>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default StartupCard;

export const StartupCardSkeleton = () => {
    return (
        <div className='group flew-row flex items-center gap-3 rounded-xl py-2 pr-4 pl-3'>
            <Skeleton className='size-10 rounded-xl' />
            <div className='flex w-full flex-row items-center gap-2'>
                <Skeleton className='h-5 w-full rounded-md' />
            </div>
        </div>);
}; 