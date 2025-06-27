import type { Directory } from '@prisma/client';
import Link from 'next/link';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@d21/design-system/components/ui/avatar';
import { Skeleton } from '@d21/design-system/components/ui/skeleton';
import { Tag } from '@d21/design-system/components/ui/tag';
import { cn, focusRing } from '@d21/design-system/lib/utils';

interface DirectoryWithCount extends Directory {
  _count: {
    startups: number;
  };
}

interface DirectoryCardProps {
  item: DirectoryWithCount;
  selectedTags?: string[];
}

const DirectoryCard = ({ item, selectedTags = [] }: DirectoryCardProps) => {
  return (
    <Link
      key={item.name}
      href={item.slug}
      className={cn('rounded-xl', focusRing)}
    >
      <div className='group group flex items-center gap-3 hover:bg-item-hover px-3 py-2 rounded-xl flew-row'>
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
            <Tag
              variant="neutral"
              className='bg-background border-border rounded-full text-description'
            >
              {item._count.startups} startup
            </Tag>
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

export default DirectoryCard;

export const DirectoryCardSkeleton = () => {
  return (
    <div className='group flex items-center gap-3 py-2 pr-4 pl-3 rounded-xl flew-row'>
      <Skeleton className='rounded-xl size-10' />
      <div className='flex flex-row items-center gap-2 w-full'>
        <Skeleton className='rounded-md w-full h-5' />
      </div>
    </div>);
};
