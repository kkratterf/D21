import type { Directory } from '@prisma/client';
import Link from 'next/link';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@d21/design-system/components/ui/avatar';
import { Badge } from '@d21/design-system/components/ui/badge';
import { Button } from '@d21/design-system/components/ui/button';
import { Skeleton } from '@d21/design-system/components/ui/skeleton';
import { Tag } from '@d21/design-system/components/ui/tag';
import { cn, focusRing } from '@d21/design-system/lib/utils';
import { Eye, EyeOff, Settings } from 'lucide-react';

import { DirectoryVisibilitySwitch } from '../modules/dashboard/directory-visibility-switch';
import { EditDirectoryButton } from '../modules/dashboard/edit-directory-button';

interface DashboardCardProps {
    item: Directory & {
        _count: {
            startups: number;
        };
    };
}

const DashboardCard = ({ item }: DashboardCardProps) => {
    return (
        <div className='group flex items-center gap-3 hover:bg-item-hover px-3 py-2 rounded-xl flew-row'>
            <Link
                key={item.name}
                href={`/dashboard/${item.slug}`}
                className={cn('flex flex-1 items-center gap-3', focusRing)}
            >
                <Avatar className='border border-border rounded-xl size-10'>
                    <AvatarImage
                        className='group-hover:scale-105 transition-all duration-400'
                        src={item.imageUrl || ""}
                        alt={item.name}
                        width={40}
                        height={40}
                    />
                    <AvatarFallback>
                        {item.name.slice(0, 2)}
                    </AvatarFallback>
                </Avatar>
                <div className='flex flex-row items-center gap-2 w-full'>
                    <p className='font-semibold text-base whitespace-nowrap'>{item.name}</p>
                    <p className='text-description text-sm line-clamp-1'>
                        {item.description}
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='hidden lg:flex flex-row gap-[2px]'>
                        <Tag variant="neutral" className='bg-background border-border rounded-full text-description'>
                            {item._count.startups} startup
                        </Tag>
                    </div>
                </div>
            </Link>
            <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                <Badge variant={item.visible ? "default" : "warning"} className="flex items-center gap-1">
                    {item.visible ? (
                        <>
                            <Eye className='w-3 h-3' />
                            Visibile
                        </>
                    ) : (
                        <>
                            <EyeOff className='w-3 h-3' />
                            Nascosta
                        </>
                    )}
                </Badge>
                <DirectoryVisibilitySwitch
                    directoryId={item.id}
                    isVisible={item.visible}
                />
                <EditDirectoryButton directory={item} />
                <Button
                    asChild
                    variant="text"
                    size="small"
                >
                    <Link href={`/dashboard/${item.slug}`}>
                        <Settings className='w-4 h-4' />
                        <span className="sr-only">Gestisci Startup</span>
                    </Link>
                </Button>
            </div>
        </div>
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