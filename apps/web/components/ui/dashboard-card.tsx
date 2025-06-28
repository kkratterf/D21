'use client';

import type { Directory } from '@prisma/client';
import Link from 'next/link';
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
import { CheckIcon, LinkIcon, MoreHorizontal } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@d21/design-system/components/ui/dropdown-menu';
import { toast } from '@d21/design-system/components/ui/toast';
import { Tooltip } from '@d21/design-system/components/ui/tooltip';
import { DeleteDirectoryButton } from '../modules/dashboard/delete-directory-button';
import { DirectoryVisibilitySwitch } from '../modules/dashboard/directory-visibility-switch';
import { EditDirectoryButton } from '../modules/dashboard/edit-directory-button';
import { EditDirectorySheet } from '../modules/dashboard/edit-directory-sheet';

interface DashboardCardProps {
    item: Directory & {
        _count: {
            startups: number;
        };
    };
}

const DashboardCard = ({ item }: DashboardCardProps) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const directoryUrl = `https://www.d21.so/${item.slug}`;
        await navigator.clipboard.writeText(directoryUrl);
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
            target.closest('[data-radix-popper-content-wrapper]');

        if (isControl) {
            e.preventDefault();
            return;
        }
    };

    return (
        <Link
            key={item.id}
            href={`/dashboard/${item.slug}`}
            className={cn('rounded-xl', focusRing)}
            onClick={handleCardClick}
        >
            <div className='group flew-row flex items-center gap-3 rounded-xl py-2 pr-3.5 pl-3 hover:bg-item-hover'>
                <div className='flex flex-1 items-center gap-3'>
                    <Avatar className='size-10 rounded-xl border border-border'>
                        <AvatarImage
                            className='transition-all duration-400 group-hover:scale-105'
                            src={item.imageUrl || ""}
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

                </div>
                <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-0.5'>
                        {item._count.startups > 0 && (
                            <Tag variant="neutral" className='rounded-full border-border bg-background text-description'>
                                {item._count.startups} {item._count.startups === 1 ? 'startup' : 'startups'}
                            </Tag>
                        )}
                        {!item.visible &&
                            <Tag variant="neutral" className='rounded-full border-border bg-background text-description'>
                                Hidden
                            </Tag>
                        }
                    </div>
                    <div className='flex items-center gap-0.5' data-control>
                        <DirectoryVisibilitySwitch
                            directoryId={item.id}
                            isVisible={item.visible}
                        />
                    </div>
                    <div className='flex items-center gap-0' data-control>
                        <Tooltip content={copied ? "Url copied" : "Copy url"}>
                            <Button
                                icon
                                variant="secondary"
                                size="small"
                                className='hidden rounded-r-none border-r-0 sm:flex'
                                onClick={copyToClipboard}
                            >
                                {copied ? <CheckIcon /> : <LinkIcon />}
                            </Button>
                        </Tooltip>
                        <DropdownMenu>
                            <DropdownMenuTrigger className={cn("rounded-r-lg", focusRing)}>
                                <div className='relative flex size-8 cursor-pointer items-center justify-center whitespace-nowrap rounded-r-lg rounded-l-none border border-item bg-item px-2 text-sm shadow-sm transition-all duration-100 ease-in-out hover:bg-item-hover focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:bg-item-active disabled:pointer-events-none disabled:border-disabled disabled:bg-neutral-disabled disabled:text-disabled disabled:shadow-none'>
                                    <MoreHorizontal className='h-4 w-4' />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <EditDirectoryButton
                                    onEditClick={() => setIsEditOpen(true)}
                                />
                                <DeleteDirectoryButton
                                    directoryId={item.id}
                                    directoryName={item.name}
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            <EditDirectorySheet
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
                directory={item}
            />
        </Link>
    );
};

export default DashboardCard;

export const DashboardCardSkeleton = () => {
    return (
        <div className='group flew-row flex items-center gap-3 rounded-xl py-2 pr-4 pl-3'>
            <Skeleton className='size-10 rounded-xl' />
            <div className='flex w-full flex-row items-center gap-2'>
                <Skeleton className='h-5 w-full rounded-md' />
            </div>
        </div>);
}; 