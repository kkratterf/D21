import { Banner } from '@/components/modules/homepage/banner';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { Suspense } from 'react';
import { LoadingBanner } from './loading';

export async function DirectoryBlock() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let hasDirectory = false;

  if (user) {
    const directory = await prisma.directory.findFirst({
      where: {
        userId: user.id
      }
    });
    hasDirectory = !!directory;
  }

  return <Banner hasDirectory={hasDirectory} isLoggedIn={!!user} />;
}

export function CreateDirectoryBlock() {
  return (
    <Suspense fallback={<LoadingBanner />}>
      <DirectoryBlock />
    </Suspense>
  )
}

