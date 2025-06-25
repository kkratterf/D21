import { LogIn, } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { signInWithGoogle } from "@/lib/supabase/actions";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@d21/design-system/components/ui/avatar";
import { SidebarMenuButton, SidebarMenuItem } from "@d21/design-system/components/ui/sidebar";
import { toast } from "@d21/design-system/components/ui/toast";

const NavAccess = () => {
    const pathname = usePathname();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [session, setSession] = useState<any>(null);
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
            setSession(user ? { user } : null);
            setIsLoggedIn(user !== null);
        }
        handle();
    }, []);

    return (
        <SidebarMenuItem>
            {isLoggedIn ? (
                <SidebarMenuButton
                    asChild
                    size="sm"
                    tooltip="Dashboard"
                    data-active={isActive}
                >
                    <Link
                        href="/dashboard"
                        scroll={false}
                    >
                        <Avatar className='size-6 overflow-hidden rounded-lg border border-default'>
                            <AvatarImage src={session?.user?.user_metadata.avatar_url} alt={session?.user?.user_metadata.name || session?.user?.email} />
                            <AvatarFallback>
                                {session?.user?.user_metadata.name?.charAt(0) || session?.user?.email?.charAt(0) || ''}
                            </AvatarFallback>
                        </Avatar>
                        <span>Dashboard</span>
                    </Link>
                </SidebarMenuButton>
            ) : (
                <SidebarMenuButton
                    size="sm"
                    tooltip="Get access"
                    onClick={handleGoogleLogin}
                >
                    <LogIn />
                    <span>Get access</span>
                </SidebarMenuButton>
            )}
        </SidebarMenuItem>
    )
}

export default NavAccess;