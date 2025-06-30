import { ChevronDown, ChevronRight, LayoutGrid, LogIn, type LucideIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Separator } from '@d21/design-system/components/ui/separator';
import { SheetClose } from "@d21/design-system/components/ui/sheet";
import { SidebarGroup, SidebarMenu, SidebarMenuButton } from "@d21/design-system/components/ui/sidebar"
import { toast } from "@d21/design-system/components/ui/toast";

import { signInWithGoogle } from "@/lib/supabase/actions";
import { createClient } from '@/lib/supabase/client';

type MenuItem = {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    isExternal?: boolean;
    children?: (MenuItem | { type: 'divider' })[];
};

export const MobileContent = ({ mainItems, secondaryItems,
}: {
    mainItems: MenuItem[];
    secondaryItems: MenuItem[];
}) => {
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const { setTheme } = useTheme();
    const isActive = (isLoggedIn && pathname.startsWith('/dashboard'));

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle()
        } catch (error) {
            toast.error(error as string)
        }
    }

    const handleThemeChange = (theme: string) => {
        setTheme(theme);
    };

    const toggleExpanded = (itemKey: string) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemKey)) {
                newSet.delete(itemKey);
            } else {
                newSet.add(itemKey);
            }
            return newSet;
        });
    };

    useEffect(() => {
        const handle = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setIsLoggedIn(user !== null);
        }
        handle();
    }, []);

    const renderMenuItem = (item: MenuItem, isSubItem = false, index = 0, isSecondary = false) => {
        const isActive = pathname === item.url ||
            (item.children?.some((subItem) => 'url' in subItem && pathname === subItem.url));

        // Create a unique key by combining title and URL, or using index as fallback
        const uniqueKey = item.url === '#' ? `${item.title}-${index}` : item.url;
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.has(uniqueKey);

        return (
            <div key={uniqueKey}>
                {isSecondary && hasChildren ? (
                    // Secondary item with children - render as accordion
                    <div>
                        <SidebarMenuButton
                            data-active={isActive}
                            onClick={() => toggleExpanded(uniqueKey)}
                            className="cursor-pointer"
                        >
                            {item.icon && <item.icon />}
                            {item.title}
                            {isExpanded ? <ChevronDown className='ml-auto h-4 w-4' /> : <ChevronRight className='ml-auto h-4 w-4' />}
                        </SidebarMenuButton>
                        {isExpanded && item.children && (
                            <div className="ml-2">
                                {item.children.map((child, childIndex) => {
                                    if ('type' in child && child.type === 'divider') {
                                        return <Separator key={`divider-${uniqueKey}-${childIndex}`} className="my-2" />;
                                    }
                                    return renderMenuItem(child as MenuItem, true, childIndex, false);
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    // Regular item or sub-item - render as link or theme button
                    <>
                        {item.url === '#' && isSubItem && item.title.toLowerCase() in ['light', 'dark', 'system'] ? (
                            // Theme item - render as button (matching nav-secondary.tsx logic)
                            <SidebarMenuButton
                                data-active={isActive}
                                className={isSubItem ? "ml-4" : ""}
                                onClick={() => handleThemeChange(item.title.toLowerCase())}
                            >
                                {item.icon && <item.icon />}
                                {item.title}
                            </SidebarMenuButton>
                        ) : (
                            // Regular item - render as link
                            <SheetClose asChild>
                                <Link href={item.url} target={item.isExternal ? "_blank" : undefined}>
                                    <SidebarMenuButton
                                        data-active={isActive}
                                        className={isSubItem ? "ml-4" : ""}
                                    >
                                        {item.icon && <item.icon />}
                                        {item.title}
                                    </SidebarMenuButton>
                                </Link>
                            </SheetClose>
                        )}
                    </>
                )}
            </div >
        );
    };

    return (
        <SidebarGroup className='flex flex-col gap-4 pt-4'>
            <SidebarMenu>
                {mainItems.map((item, index) => renderMenuItem(item, false, index, false))}
            </SidebarMenu>
            <Separator />
            <SidebarMenu>
                {secondaryItems
                    .filter(item => item.title !== 'Theme')
                    .map((item, index) => renderMenuItem(item, false, index, true))}
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