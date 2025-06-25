import { cookies } from 'next/headers';
import type React from 'react';

import { SidebarProvider } from '@d21/design-system/components/ui/sidebar';

import { AppSidebar } from '@/components/layouts/app-sidebar';

export default async function MainLayout({
  children,
}: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sidebarCookie = cookieStore.get('sidebar:state');
  const defaultOpen = sidebarCookie === undefined ? true : sidebarCookie.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className='mt-2 ml-1 h-[calc(100dvh-8px)] w-full overflow-auto rounded-tl-3xl border border-t border-l bg-background shadow-sm md:ml-0'>
        {children}
      </main>
    </SidebarProvider>
  );
}
