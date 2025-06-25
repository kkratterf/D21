'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@d21/design-system/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center gap-8'>
      <div className="text-center">
        <h1 className="font-brand text-5xl">404</h1>
        <p className="mt-2 text-description">Page not found</p>
      </div>
      <Button onClick={() => router.back()}>Go back</Button>
    </div>
  );
}
