import { LogIn, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { SidebarMenuButton, SidebarMenuItem } from "@d21/design-system/components/ui/sidebar";

const NavAccess = () => {
    const pathname = usePathname();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const isActive = (isLoggedIn && pathname.startsWith('/profile'));

    useEffect(() => {
        const handle = async () => {
            const supabase = createClient();
            const session = await supabase.auth.getUser();
            setIsLoggedIn(session.data.user !== null);
        }
        handle();
    }, []);
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                size="sm"
                tooltip={isLoggedIn ? 'Profile' : 'Get access'}
                data-active={isActive}
            >
                <Link
                    href={isLoggedIn ? '/profile' : '/login'}
                    scroll={false}
                >
                    {isLoggedIn ? <User /> : <LogIn />}
                    <span>{isLoggedIn ? 'Profile' : 'Get access'}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

export default NavAccess;