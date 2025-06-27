import type { FundingStage, Startup, TeamSize } from '@prisma/client'
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

import { Avatar, AvatarFallback, AvatarImage } from "@d21/design-system/components/ui/avatar";
import { Button } from "@d21/design-system/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@d21/design-system/components/ui/dropdown-menu';
import { Separator } from "@d21/design-system/components/ui/separator";
import { Tag } from "@d21/design-system/components/ui/tag";
import { Ellipsis, MessageCircleWarning, OctagonX } from 'lucide-react';

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
        <div className='mb-0 flex h-full w-full flex-col gap-6 p-0 lg:mb-10 lg:w-3/5 lg:p-4'>
            <div className='flex w-full flex-col gap-3'>
                <div className='flex w-full flex-row items-center gap-3'>
                    <Avatar className='size-12 rounded-xl border border-border'>
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
                    <h1 className='w-full font-brand text-3xl'>{startup.name}</h1>
                </div>
                <p className="text-description">{startup.description}</p>
            </div>
            {startup.tags && startup.tags.length > 0 && (
                <div className="flex flex-row gap-1">
                    {startup.tags.map((tag, index) => (
                        <Tag
                            variant="neutral"
                            key={index}
                        >
                            {tag}
                        </Tag>
                    ))}
                </div>
            )}
            <div className='flex flex-row items-center justify-between gap-3'>
                <div className="flex flex-row gap-2">
                    {startup.websiteUrl && (
                        <Button asChild>
                            <Link target="_blank" href={addUtmParameters(startup.websiteUrl)}>
                                Visit website
                            </Link>
                        </Button>
                    )}
                    {startup.linkedinUrl && (
                        <Button variant="secondary" asChild>
                            <Link target="_blank" href={startup.linkedinUrl}>
                                Linkedin
                            </Link>
                        </Button>
                    )}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" icon size="small">
                            <Ellipsis />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className="w-48">
                        <DropdownMenuGroup>
                            <Link target="_blank" href="https://tally.so/r/wLyl4l">
                                <DropdownMenuItem>
                                    <OctagonX />
                                    Not a startup
                                </DropdownMenuItem>
                            </Link>
                            <Link target="_blank" href="https://tally.so/r/n05XWB">
                                <DropdownMenuItem>
                                    <MessageCircleWarning />
                                    Incorrect data
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Separator />
            <ReactMarkdown className='prose prose-sm max-w-none prose-headings:font-brand prose-headings:text-foreground prose-p:text-description text-description text-sm leading-6'>
                {startup.description}
            </ReactMarkdown>
            <Separator className='lg:hidden' />
        </div>
    );
}

export default LeftPanel; 