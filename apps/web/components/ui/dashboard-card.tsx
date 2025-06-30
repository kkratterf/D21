'use client';

import type { Directory } from '@prisma/client';
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
        const directoryUrl = `https://www.d21.so/s/${item.slug}`;
        await navigator.clipboard.writeText(directoryUrl);
        setCopied(true);
        toast("📣 Copied to clipboard. Ready to share!");
        setTimeout(() => setCopied(false), 5000);
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // If the click is on a control, do not navigate
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

    return (
        <Link
            key={item.id}
            href={isEditOpen ? '#' : `/dashboard/${item.slug}`}
            className={cn('rounded-xl', focusRing)}
            onClick={handleCardClick}
        >
            <div className='group flex items-center gap-3 hover:bg-item-hover py-2 pr-3.5 pl-3 rounded-xl flew-row'>
                <div className='flex flex-1 items-center gap-3'>
                    <Avatar className='border border-border rounded-xl size-10'>
                        <AvatarImage
                            className='group-hover:scale-105 transition-all duration-400'
                            src={item.imageUrl || ""}
                            alt={item.name}
                            width={40}
                            height={40}
                        />
                        <AvatarFallback>
                            {item.name.slice(0, 1)}
                        </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-row items-center gap-2 w-full'>
                        <p className='font-semibold text-base whitespace-nowrap'>{item.name}</p>
                        <p className='text-description text-sm line-clamp-1'>
                            {item.description}
                        </p>
                    </div>

                </div>
                <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-0.5'>
                        {item._count.startups > 0 && (
                            <Tag variant="neutral" className='bg-background border-border rounded-full text-description'>
                                {item._count.startups} {item._count.startups === 1 ? 'startup' : 'startups'}
                            </Tag>
                        )}
                        {!item.visible &&
                            <Tag variant="neutral" className='bg-background border-border rounded-full text-description'>
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
                        <Tooltip content="Preview">
                            <Button
                                icon
                                disabled={!item.visible}
                                variant="secondary"
                                size="small"
                                className='hidden sm:flex border-r-0 rounded-r-none'
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (item.visible) {
                                        window.open(`/s/${item.slug}`, '_blank');
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
                                className='hidden sm:flex border-r-0 rounded-none'
                                onClick={copyToClipboard}
                            >
                                {copied ? <CheckIcon /> : <LinkIcon />}
                            </Button>
                        </Tooltip>
                        <DropdownMenu>
                            <DropdownMenuTrigger className={cn('rounded-r-lg rounded-l-lg sm:rounded-l-none', focusRing)}>
                                <div className='relative flex justify-center items-center bg-item hover:bg-item-hover active:bg-item-active disabled:bg-neutral-disabled shadow-sm disabled:shadow-none px-2 border border-item disabled:border-disabled rounded-r-lg rounded-l-lg sm:rounded-l-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 size-8 disabled:text-disabled text-sm whitespace-nowrap transition-all duration-100 ease-in-out cursor-pointer disabled:pointer-events-none'>
                                    <MoreHorizontal className='w-4 h-4' />
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
        <div className='group flex items-center gap-3 py-2 pr-4 pl-3 rounded-xl flew-row'>
            <Skeleton className='rounded-xl size-10' />
            <div className='flex flex-row items-center gap-2 w-full'>
                <Skeleton className='rounded-md w-full h-5' />
            </div>
        </div>);
}; 