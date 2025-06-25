'use client';

import {
  SidebarTrigger,
  useSidebar,
} from '@d21/design-system/components/ui/sidebar';

interface NavMobileProps {
  className?: string;
}

const NavMobile = ({ className }: NavMobileProps) => {
  const { isMobile } = useSidebar();
  return (
    <>
      {isMobile && <SidebarTrigger className={className} />}
    </>
  );
};

export default NavMobile;
