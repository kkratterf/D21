import type React from 'react';
import { Suspense } from 'react';

import NavMobile from '@/components/layout/nav-mobile';
import DashboardFilters from '@/components/modules/dashboard/filters';
import ScrollToTop from '@/components/scrollToTopClient';
import Loading from './loading';

export default function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col pt-6">
      <div className='flex items-center justify-between px-7'>
        <h1 className="font-brand text-3xl">Dashboard</h1>
        <NavMobile />
      </div>
      <Suspense fallback={<Loading />}>
        <div className='sticky top-0 z-20 flex w-full flex-col border-default border-b bg-background px-3 py-2.5'>
          <DashboardFilters />
        </div>
        <ScrollToTop />
        {children}
      </Suspense>
    </div>
  );
}
