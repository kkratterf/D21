'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@d21/design-system/components/ui/button';
import { cn } from '@d21/design-system/lib/utils';

export default function ScrollNavigation({ className, variant }: { className?: string, variant: 'text' | 'link' | 'primary' | 'secondary' | 'danger' }) {
  const router = useRouter();

  return (
    <div className={cn("flex justify-between p-6", className)}>
      <Button variant={variant} onClick={() => router.back()}>
        Back
      </Button>
      <Button variant={variant} asChild>
        <Link href="/">Home</Link>
      </Button>
    </div>
  );
}
