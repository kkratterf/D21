import { cookies } from 'next/headers';
import type React from 'react';

import { SidebarProvider } from '@d21/design-system/components/ui/sidebar';

import { AppSidebar } from '@/components/layout/app-sidebar';

export default async function MainLayout({
  children,
}: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sidebarCookie = cookieStore.get('sidebar:state');
  const defaultOpen = sidebarCookie === undefined ? true : sidebarCookie.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className='bg-background shadow-sm mt-2 ml-1 md:ml-0 border border-t border-l rounded-tl-3xl w-full h-[calc(100dvh-8px)] overflow-auto'>
        {children}
      </main>
    </SidebarProvider>
  );
}
