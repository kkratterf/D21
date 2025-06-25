'use client';

import {
  ChartColumn,
  ChartNoAxesCombined,
  Folder,
  GithubIcon,
  HelpCircle,
  LinkedinIcon,
  type LucideIcon,
  MapIcon,
  MessageCircle,
  Monitor,
  MoonIcon,
  PlusCircle,
  Rocket,
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

import { MobileContent } from '@/components/layouts/mobile-content';
import { MobileTitle } from '@/components/layouts/mobile-title';
import { NavHeader } from '@/components/layouts/nav-header';
import { NavMain } from '@/components/layouts/nav-main';
import { NavSecondary } from '@/components/layouts/nav-secondary';

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
      title: 'Startups',
      url: '/startups',
      icon: Rocket,
    },
    {
      title: 'Benchmark',
      url: '/benchmark',
      icon: ChartColumn,
    },
    {
      title: 'Funding Report',
      url: '/funding-report',
      icon: ChartNoAxesCombined,
    },
  ],
  navSecondary: [
    {
      title: 'Add a startup',
      url: 'https://tally.so/r/3lKZEW',
      icon: PlusCircle,
      isExternal: true,
      tooltip: 'Add a startup',
    },
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
          url: 'https://c14.featurebase.app/en',
          icon: MessageCircle,
          isExternal: true,
          tooltip: 'Share your feedback and suggestions',
        },
        {
          title: "What's next?",
          url: 'https://c14.featurebase.app/en/roadmap',
          icon: MapIcon,
          isExternal: true,
          tooltip: 'Check out our roadmap and upcoming features',
        },
        {
          type: 'divider',
        },
        {
          title: 'Join our community',
          url: 'https://join.slack.com/t/c14dotso/shared_invite/zt-2wsuiiiis-2bBr9Rj7BY7GGq3zfmhu8g',
          isExternal: true,
          icon: Slack,
          tooltip: 'Join our community',
        },
        {
          title: 'Follow us',
          url: 'https://www.linkedin.com/company/c14dotso',
          icon: LinkedinIcon,
          isExternal: true,
          tooltip: 'Follow us on Linkedin',
        },
        {
          title: 'View source code',
          url: 'https://github.com/kkratterf/C14',
          icon: GithubIcon,
          isExternal: true,
          tooltip: 'View source code',
        },
        {
          type: 'divider',
        },
        {
          title: 'Explore D21',
          url: "https://www.d21.so",
          icon: Folder,
          isExternal: true,
          tooltip: 'Explore D21',
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
