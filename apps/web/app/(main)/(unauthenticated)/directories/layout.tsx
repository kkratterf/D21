import type React from 'react';
import { Suspense } from 'react';

import { getDirectoryTags } from '@/actions/directory';
import NavMobile from '@/components/layout/nav-mobile';
import { DirectoryFiltersClient } from '@/components/modules/directories/directory-filters-client';
import { DirectoryFiltersSkeleton } from '@/components/modules/directories/filters';
import ScrollToTop from '@/components/scrollToTopClient';
import Loading from './loading';

async function DirectoryFiltersWrapper() {
  const availableTags = await getDirectoryTags();
  return <DirectoryFiltersClient tags={availableTags} />;
}

export default function DirectoriesLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col pt-6">
      <div className='flex items-center justify-between px-7'>
        <h1 className="font-brand text-3xl">Directories</h1>
        <NavMobile />
      </div>
      <Suspense fallback={<DirectoryFiltersSkeleton />}>
        <DirectoryFiltersWrapper />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <ScrollToTop />
        {children}
      </Suspense>
    </div>
  );
}
