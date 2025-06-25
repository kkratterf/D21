'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import NavMobile from '@/components/layouts/nav-mobile';

import { Button } from '@d21/design-system/components/ui/button';
import { useSidebar } from '@d21/design-system/components/ui/sidebar';
import { Tooltip } from '@d21/design-system/components/ui/tooltip';

const NavStartup = () => {
    const router = useRouter();
    const { isMobile } = useSidebar();
    return (
        <div className='flex w-full items-center justify-between'>
            <Tooltip side='right' content='Back' className='z-50 hidden md:flex'>
                <Button
                    variant='secondary'
                    size={isMobile ? 'default' : 'small'}
                    icon
                    onClick={() => router.back()}
                >
                    <ChevronLeft />
                </Button>
            </Tooltip>
            <NavMobile />
        </div>
    )
}

export default NavStartup;