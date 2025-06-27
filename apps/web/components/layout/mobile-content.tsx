import { LayoutGrid, LogIn, type LucideIcon } from 'lucide-react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Separator } from '@d21/design-system/components/ui/separator';
import { SheetClose } from "@d21/design-system/components/ui/sheet";
import { SidebarGroup, SidebarMenu, SidebarMenuButton } from "@d21/design-system/components/ui/sidebar"
import { toast } from "@d21/design-system/components/ui/toast";

import { signInWithGoogle } from "@/lib/supabase/actions";
import { createClient } from '@/lib/supabase/client';

export const MobileContent = ({ mainItems, secondaryItems,
}: {
    mainItems: {
        title: string;
        url: string;
        icon: LucideIcon;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
    secondaryItems: {
        title: string;
        url: string;
        icon: LucideIcon;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
}) => {
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const isActive = (isLoggedIn && pathname.startsWith('/dashboard'));

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle()
        } catch (error) {
            toast.error(error as string)
        }
    }

    useEffect(() => {
        const handle = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setIsLoggedIn(user !== null);
        }
        handle();
    }, []);

    return (
        <SidebarGroup className='flex flex-col gap-4 pt-4'>
            <SidebarMenu>
                {mainItems.map((item) => {
                    const isActive = pathname === item.url ||
                        (item.items?.some(subItem => pathname === subItem.url));
                    return (
                        <SheetClose asChild key={item.url}>
                            <Link href={item.url}>
                                <SidebarMenuButton data-active={isActive}>
                                    <item.icon />
                                    {item.title}
                                </SidebarMenuButton>
                            </Link>
                        </SheetClose>
                    );
                })}
            </SidebarMenu>
            <Separator />
            <SidebarMenu>
                {secondaryItems.map((item) => {
                    const isActive = pathname === item.url ||
                        (item.items?.some(subItem => pathname === subItem.url));
                    return (
                        <SheetClose asChild key={item.url}>
                            <Link href={item.url}>
                                <SidebarMenuButton data-active={isActive}>
                                    <item.icon />
                                    {item.title}
                                </SidebarMenuButton>
                            </Link>
                        </SheetClose>
                    );
                })}
                {isLoggedIn ? (
                    <SheetClose asChild>
                        <Link href="/dashboard">
                            <SidebarMenuButton data-active={isActive}>
                                <LayoutGrid />
                                Dashboard
                            </SidebarMenuButton>
                        </Link>
                    </SheetClose>
                ) : (
                    <SheetClose asChild>
                        <SidebarMenuButton onClick={handleGoogleLogin}>
                            <LogIn />
                            Get access
                        </SidebarMenuButton>
                    </SheetClose>
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
};