import type { FundingStage, Startup, TeamSize } from '@prisma/client'
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

import NavMobile from '@/components/layout/nav-mobile';
import { BackButton } from '@/components/ui/back-button';
import { Avatar, AvatarFallback, AvatarImage } from "@d21/design-system/components/ui/avatar";
import { Button } from "@d21/design-system/components/ui/button";
import { } from '@d21/design-system/components/ui/dropdown-menu';
import { Separator } from "@d21/design-system/components/ui/separator";
import { Tag } from "@d21/design-system/components/ui/tag";
import { Tooltip } from '@d21/design-system/components/ui/tooltip';
import { Globe, } from 'lucide-react';

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

interface LeftProps {
    startup: StartupWithRelations;
}

const addUtmParameters = (url: string): string => {
    try {
        const urlObj = new URL(url);
        urlObj.searchParams.append('utm_source', 'D21');
        return urlObj.toString();
    } catch (_) {
        return url;
    }
};

const LeftPanel = async ({ startup }: LeftProps) => {
    return (
        <div className='mb-0 flex h-full w-full flex-col gap-5 p-0 lg:mb-10 lg:w-3/5 lg:p-4'>
            <div className='flex w-full flex-row items-center justify-between'>
                <BackButton />
                <NavMobile />
            </div>
            <div className='flex w-full flex-col gap-5'>
                <div className='flex w-full flex-col gap-3'>
                    <div className='flex flex-row items-start justify-between gap-3'>
                        <Avatar className='size-16 rounded-xl border border-border'>
                            <AvatarImage
                                className='transition-all duration-400 group-hover:scale-105'
                                src={startup.logoUrl || ""}
                                alt={startup.name}
                                width={48}
                                height={48}
                            />
                            <AvatarFallback>
                                {startup.name.slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-row gap-1.5">
                            {startup.websiteUrl && (
                                <Tooltip content="Visit website">
                                    <Button variant="secondary" icon asChild>
                                        <Link target="_blank" href={startup.websiteUrl}>
                                            <Globe />
                                        </Link>
                                    </Button>
                                </Tooltip>
                            )}
                            {startup.linkedinUrl && (
                                <Button variant="secondary" asChild>
                                    <Link target="_blank" href={startup.linkedinUrl}>
                                        Linkedin
                                    </Link>
                                </Button>
                            )}

                        </div>
                    </div>
                    <h1 className='w-full font-brand text-3xl'>{startup.name}</h1>
                    <p className='text-base'>{startup.shortDescription}</p>
                </div>
                {startup.tags && startup.tags.length > 0 && (
                    <div className="flex flex-row gap-1">
                        {startup.tags.map((tag, index) => (
                            <Tag
                                variant="neutral"
                                className='rounded-full border-border bg-background text-description'
                                key={index}
                            >
                                {tag}
                            </Tag>
                        ))}
                    </div>
                )}
            </div>
            <ReactMarkdown className='prose prose-sm prose-headings:text max-w-none pt-4 prose-headings:font-brand prose-p:text-description text-base text-description leading-6'>
                {startup.longDescription}
            </ReactMarkdown>
            <Separator className='lg:hidden' />
        </div>
    );
}

export default LeftPanel; 