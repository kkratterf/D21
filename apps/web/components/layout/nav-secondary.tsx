import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type * as React from 'react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@d21/design-system/components/ui/sidebar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@d21/design-system/components/ui/dropdown-menu';

import { cn } from '@d21/design-system/lib/utils';

import NavAccess from '@/components/layout/nav-access';

type NavDivider = {
  type: 'divider';
};

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isExternal?: boolean;
  tooltip?: string;
  children?: (NavItem | NavDivider)[];
};

type NavSecondaryItem = NavItem | NavDivider;

export function NavSecondary({
  items,
  ...props
}: {
  items: NavSecondaryItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();
  const { isMobile, state } = useSidebar();
  const { setTheme } = useTheme();
  const isCollapsed = state === 'collapsed';

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
  };

  const renderNavItem = (item: NavSecondaryItem) => {
    if ('type' in item && item.type === 'divider') {
      return <SidebarSeparator key={`divider-${Math.random()}`} />;
    }

    const navItem = item as NavItem;
    const isActive = !navItem.isExternal && pathname === navItem.url;

    if (navItem.children) {
      return (
        <SidebarMenuItem key={navItem.title}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="sm"
                tooltip={navItem.tooltip || navItem.title}
                data-active={isActive}
                className='rounded-lg data-[state=open]:bg-item-hover'
              >
                <navItem.icon />
                <span className={cn(
                  'transition-all duration-200',
                  isCollapsed ? 'invisible opacity-0' : 'visible opacity-100'
                )}>
                  {navItem.title}
                </span>
                <ChevronRight className='ml-auto size-4 stroke-icon' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
            >
              {navItem.children.map((child, index) => {
                if ('type' in child && child.type === 'divider') {
                  return <DropdownMenuSeparator key={`${navItem.title}-divider-${index}`} />;
                }

                const navChild = child as NavItem;

                // Gestione speciale per i temi
                if (navItem.title === 'Theme') {
                  const themeValue = navChild.title.toLowerCase();
                  return (
                    <DropdownMenuItem
                      key={`${navItem.title}-${navChild.title}`}
                      onClick={() => handleThemeChange(themeValue)}
                    >
                      <div className="flex items-center gap-2">
                        <navChild.icon className="size-4" />
                        <span>{navChild.title}</span>
                      </div>
                    </DropdownMenuItem>
                  );
                }

                return (
                  <DropdownMenuItem key={`${navItem.title}-${navChild.title}`}>
                    <Link
                      href={navChild.url}
                      target={navChild.isExternal ? '_blank' : undefined}
                      className="flex items-center gap-2"
                    >
                      <navChild.icon className="size-4" />
                      <span>{navChild.title}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={navItem.title}>
        <SidebarMenuButton
          asChild
          size="sm"
          tooltip={navItem.tooltip || navItem.title}
          data-active={isActive}
        >
          <Link
            href={navItem.url}
            target={navItem.isExternal ? '_blank' : undefined}
          >
            <navItem.icon />
            <span>{navItem.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => renderNavItem(item))}
          <SidebarSeparator />
          <NavAccess />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
