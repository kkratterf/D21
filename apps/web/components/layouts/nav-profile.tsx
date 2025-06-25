'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@d21/design-system/components/ui/navigation-menu";
import { Tag } from "@d21/design-system/components/ui/tag";

export default function NavProfile() {
    const pathname = usePathname();
    return (
        <NavigationMenu className='flex py-2 lg:sticky lg:top-0 lg:py-6'>
            <NavigationMenuList orientation="vertical" className='w-full lg:w-48'>
                <NavigationMenuItem className="w-full">
                    <Link href="/profile" legacyBehavior passHref>
                        <NavigationMenuLink
                            size="small"
                            active={pathname === '/profile'}
                            className='w-full justify-start'
                        >
                            Overview
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="w-full">
                    <Link href="/profile/team" legacyBehavior passHref>
                        <NavigationMenuLink
                            size="small"
                            active={pathname === '/profile/team'}
                            className='w-full justify-start'
                        >
                            Team
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="w-full">
                    <Link href="/profile/investors" legacyBehavior passHref>
                        <NavigationMenuLink
                            size="small"
                            active={pathname === '/profile/investors'}
                            className='w-full justify-start'
                        >
                            Investors
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="w-full">
                    <Link href="/profile/pitch-deck" legacyBehavior passHref>
                        <NavigationMenuLink
                            size="small"
                            active={pathname === '/profile/pitch-deck'}
                            className='w-full justify-start'
                        >
                            Pitch Deck
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="w-full">
                    <Link href="/profile/jobs" legacyBehavior passHref>
                        <NavigationMenuLink
                            size="small"
                            disabled
                            className='w-full justify-start gap-3'
                        >
                            Jobs
                            <Tag variant="neutral" className='rounded-full opacity-50'>Soon</Tag>
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}