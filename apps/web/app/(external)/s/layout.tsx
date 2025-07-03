import { cookies } from 'next/headers';
import type React from 'react';

import { SidebarProvider } from '@d21/design-system/components/ui/sidebar';
import Link from 'next/link';

export default async function MainLayout({
    children,
}: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const sidebarCookie = cookieStore.get('sidebar:state');
    const defaultOpen = sidebarCookie === undefined ? true : sidebarCookie.value === 'true';

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <main className='!ml-1.5 mt-2 h-[calc(100dvh-8px)] w-full overflow-auto rounded-tl-3xl border border-t border-l bg-background shadow-sm md:ml-0'>
                {children}
            </main>
            <div className='fixed bottom-[72px] left-7 z-50 w-fit rounded-[10px] border border-default bg-elevated p-px shadow-lg'>
                <div className='flex h-6 items-center rounded-lg border border-default bg-background px-1.5 py-1'>
                    <span className='text-description text-xs'>Designed by <Link className='text h-4 hover:text-brand' href='https://www.linkedin.com/in/kkratter/' target='_blank'>Federico</Link></span>
                </div>
            </div>
        </SidebarProvider>
    );
}
