'use client';

import {
  Copyright,
  FolderOpenIcon,
  GithubIcon,
  HelpCircle,
  Hexagon,
  LinkedinIcon,
  type LucideIcon,
  MapIcon,
  MessageCircle,
  Monitor,
  MoonIcon,
  Scroll,
  Slack,
  SunIcon,
} from 'lucide-react';
import type React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@d21/design-system/components/ui/sidebar';

import { MobileContent } from '@/components/layout/mobile-content';
import { MobileTitle } from '@/components/layout/mobile-title';
import { NavHeader } from '@/components/layout/nav-header';
import { NavMain } from '@/components/layout/nav-main';
import { NavSecondary } from '@/components/layout/nav-secondary';

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isExternal?: boolean;
  tooltip?: string;
  children?: (NavItem | NavDivider)[];
};

type NavDivider = {
  type: 'divider';
};

type NavSecondaryItem = NavItem | NavDivider;

const data = {
  navMain: [
    {
      title: 'Directories',
      url: '/directories',
      icon: FolderOpenIcon,
    },
  ],
  navSecondary: [
    {
      title: 'Manifesto',
      url: '/manifesto',
      icon: Scroll,
      tooltip: 'Manifesto',
    },
    {
      title: 'Help',
      url: '/about',
      icon: HelpCircle,
      tooltip: 'Help, contact & more',
      children: [
        {
          title: 'Share your thoughts',
          url: 'https://d21.featurebase.app/en',
          icon: MessageCircle,
          isExternal: true,
          tooltip: 'Share your feedback and suggestions',
        },
        {
          title: "What's next?",
          url: 'https://d21.featurebase.app/en/roadmap',
          icon: MapIcon,
          isExternal: true,
          tooltip: 'Check out our roadmap and upcoming features',
        },
        {
          type: 'divider',
        },
        {
          title: 'Join our community',
          url: 'https://join.slack.com/t/d21dotso/shared_invite/zt-36o6emmb7-4IMnrcgvLz1bXy6X1f_OuQ',
          isExternal: true,
          icon: Slack,
          tooltip: 'Join our community',
        },
        {
          title: 'Follow us',
          url: 'https://www.linkedin.com/company/d21dotso',
          icon: LinkedinIcon,
          isExternal: true,
          tooltip: 'Follow us on Linkedin',
        },
        {
          title: 'View source code',
          url: 'https://github.com/kkratterf/D21',
          icon: GithubIcon,
          isExternal: true,
          tooltip: 'View source code',
        },
        {
          title: 'Federico Kratter Thaler',
          url: 'https://www.linkedin.com/in/kkratter/',
          icon: Copyright,
          isExternal: true,
          tooltip: 'Designed by Federico Kratter Thaler',
        },
        {
          type: 'divider',
        },
        {
          title: 'Explore C14',
          url: "https://www.c14.so",
          icon: Hexagon,
          isExternal: true,
          tooltip: 'Explore C14',
        },
      ],
    },
    {
      title: 'Theme',
      url: '#',
      icon: Monitor,
      tooltip: 'Change theme',
      children: [
        {
          title: 'Light',
          url: '#',
          icon: SunIcon,
          tooltip: 'Light theme',
        },
        {
          title: 'Dark',
          url: '#',
          icon: MoonIcon,
          tooltip: 'Dark theme',
        },
        {
          title: 'System',
          url: '#',
          icon: Monitor,
          tooltip: 'System theme',
        },
      ],
    },
  ] as NavSecondaryItem[],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      variant="inset" {...props}
      collapsible="icon" {...props}
      mobileTitle={<MobileTitle />}
      mobileContent={<MobileContent mainItems={data.navMain} secondaryItems={data.navSecondary.filter(item => !('type' in item && item.type === 'divider')) as NavItem[]} />}
    >
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarFooter>
    </Sidebar>
  );
}
