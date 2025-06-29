'use client';

import type { FundingStage, Startup, TeamSize } from '@prisma/client';
import Link from 'next/link';
import type React from 'react';
import { useState } from 'react';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@d21/design-system/components/ui/avatar';
import { Button } from '@d21/design-system/components/ui/button';
import { Skeleton } from '@d21/design-system/components/ui/skeleton';
import { Tag } from '@d21/design-system/components/ui/tag';
import { cn, focusRing } from '@d21/design-system/lib/utils';
import { CheckIcon, ExternalLink, LinkIcon, MoreHorizontal } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@d21/design-system/components/ui/dropdown-menu';
import { toast } from '@d21/design-system/components/ui/toast';
import { Tooltip } from '@d21/design-system/components/ui/tooltip';
import { StartupVisibilitySwitch } from '../modules/admin/startup-visibility-switch';
import { DeleteStartupButton } from '../modules/dashboard/delete-startup-button';
import { EditStartupButton } from '../modules/dashboard/edit-startup-button';
import { EditStartupSheet } from '../modules/startups/edit-startup-sheet';

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

interface DashboardStartupCardProps {
    item: StartupWithRelations;
    selectedTags?: string[];
    selectedFundingStages?: string[];
    selectedTeamSizes?: string[];
}

const DashboardStartupCard = ({
    item,
    selectedTags = [],
    selectedFundingStages = [],
    selectedTeamSizes = []
}: DashboardStartupCardProps) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const startupUrl = `https://www.d21.so/${item.directory.slug}/${item.id}`;
        await navigator.clipboard.writeText(startupUrl);
        setCopied(true);
        toast("📣 Copied to clipboard. Ready to share!");
        setTimeout(() => setCopied(false), 5000);
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // Se il click è su un controllo, non navigare
        const target = e.target as HTMLElement;
        const isControl = target.closest('[data-control]') ||
            target.closest('button') ||
            target.closest('[role="switch"]') ||
            target.closest('[data-radix-dropdown-trigger]') ||
            target.closest('[data-radix-dropdown-item]') ||
            target.closest('[role="menuitem"]') ||
            target.closest('[data-radix-popper-content-wrapper]') ||
            target.closest('[data-radix-sheet-content]') ||
            target.closest('[data-radix-sheet-overlay]') ||
            target.closest('[role="dialog"]');

        if (isControl) {
            e.preventDefault();
            return;
        }

        if (isEditOpen) {
            e.preventDefault();
            return;
        }
    };

    // Convert the item to the format expected by EditStartupSheet
    const startupForEdit = {
        id: item.id,
        name: item.name,
        shortDescription: item.shortDescription,
        longDescription: item.longDescription,
        websiteUrl: item.websiteUrl,
        logoUrl: item.logoUrl,
        foundedAt: item.foundedAt,
        location: item.location,
        latitude: item.latitude,
        longitude: item.longitude,
        teamSizeId: item.teamSizeId || '',
        fundingStageId: item.fundingStageId || '',
        contactEmail: item.contactEmail,
        linkedinUrl: item.linkedinUrl,
        tags: item.tags,
        amountRaised: item.amountRaised,
    };

    return (
        <Link
            key={item.id}
            href={isEditOpen ? '#' : `/${item.directory.slug}/${item.id}`}
            className={cn('rounded-xl', focusRing)}
            onClick={handleCardClick}
        >
            <div className='group flew-row flex items-center gap-3 rounded-xl py-2 pr-3.5 pl-3 hover:bg-item-hover'>
                <div className='flex flex-1 items-center gap-3'>
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
                            {item.shortDescription}
                        </p>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='items-center gap-0.5'>
                        {!item.visible &&
                            <Tag variant="neutral" className='rounded-full border-border bg-background text-description'>
                                Hidden
                            </Tag>
                        }
                    </div>
                    <div className='flex items-center gap-0.5' data-control>
                        <StartupVisibilitySwitch
                            startupId={item.id}
                            isVisible={item.visible}
                        />
                    </div>
                    <div className='flex items-center gap-0' data-control>
                        <Tooltip content="Preview">
                            <Button
                                icon
                                disabled={!item.visible}
                                variant="secondary"
                                size="small"
                                className='hidden rounded-r-none border-r-0 sm:flex'
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (item.visible) {
                                        window.open(`/${item.directory.slug}/${item.id}`, '_blank');
                                    }
                                }}
                            >
                                <ExternalLink />
                            </Button>
                        </Tooltip>
                        <Tooltip content={copied ? "Url copied" : "Copy url"}>
                            <Button
                                icon
                                disabled={!item.visible}
                                variant="secondary"
                                size="small"
                                className='hidden rounded-none border-r-0 sm:flex'
                                onClick={copyToClipboard}
                            >
                                {copied ? <CheckIcon /> : <LinkIcon />}
                            </Button>
                        </Tooltip>
                        <DropdownMenu>
                            <DropdownMenuTrigger className={cn('rounded-r-lg rounded-l-lg sm:rounded-l-none', focusRing)}>
                                <div className='relative flex size-8 cursor-pointer items-center justify-center whitespace-nowrap rounded-r-lg rounded-l-lg border border-item bg-item px-2 text-sm shadow-sm transition-all duration-100 ease-in-out hover:bg-item-hover focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:bg-item-active disabled:pointer-events-none disabled:border-disabled disabled:bg-neutral-disabled disabled:text-disabled disabled:shadow-none sm:rounded-l-none'>
                                    <MoreHorizontal className='h-4 w-4' />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <EditStartupButton
                                    onEditClick={() => setIsEditOpen(true)}
                                />
                                <DeleteStartupButton
                                    startupId={item.id}
                                    startupName={item.name}
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            <EditStartupSheet
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
                directorySlug={item.directory.slug}
                startup={startupForEdit}
            />
        </Link>
    );
};

export default DashboardStartupCard;

export const DashboardStartupCardSkeleton = () => {
    return (
        <div className='group flew-row flex items-center gap-3 rounded-xl py-2 pr-4 pl-3'>
            <Skeleton className='size-10 rounded-xl' />
            <div className='flex w-full flex-row items-center gap-2'>
                <Skeleton className='h-5 w-full rounded-md' />
            </div>
        </div>);
}; 