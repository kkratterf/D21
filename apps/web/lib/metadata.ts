import type { Directory, Startup } from '@prisma/client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'D21 - Open-source startup directories',
  description:
    'A growing, open-source database of startup directories 📁 Designed to make the ecosystem more transparent and accessible.',
  keywords: [
    'D21',
    'Open-source',
    'Open source',
    'Open source startup directories',
    'Open source startup directory',
    'Open source startup directory database',
    'Startups',
    'Directories',
    'Startup directories',
  ],
  metadataBase: new URL('https://www.d21.so'),
  alternates: {
    canonical: 'https://www.d21.so',
  },
  openGraph: {
    title: 'D21 - Open-source startup directories',
    description:
      'A growing, open-source database of startup directories 📁 Designed to make the ecosystem more transparent and accessible.',
    url: 'https://www.d21.so',
    siteName: 'D21',
    locale: 'en',
    alternateLocale: 'it',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const emptyMetadata: Metadata = {
  title: "D21 - Startup not found",
  description: "The startup you are looking for does not exist.",
  openGraph: {
    title: "D21 - Startup not found",
    description: "The startup you are looking for does not exist.",
    url: 'https://www.d21.so',
    siteName: 'D21',
    locale: 'en',
    alternateLocale: 'it',
    type: 'website',
  }
};

export const directoryMetadata = (directory: Directory): Metadata => ({
  title: `D21 - ${directory.name}`,
  description: directory.description === null ? undefined : directory.description,
  alternates: {
    canonical: `https://www.d21.so/s/${directory.slug}`,
  },
  openGraph: {
    title: `D21 - ${directory.name}`,
    description: directory.description === null ? undefined : directory.description,
    url: `https://www.d21.so/s/${directory.slug}`,
    type: 'website',
    locale: 'en',
    alternateLocale: 'it',
    siteName: 'D21',
    images: [
      {
        url: 'https://www.d21.so/opengraph-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
});

type StartupWithNumberAmount = Omit<Startup, 'amountRaised' | 'description'> & {
  amountRaised: number | null;
  shortDescription: string;
  longDescription: string | null;
  directory: Directory;
};

export const startupMetadata = (startup: StartupWithNumberAmount): Metadata => ({
  title: `D21 - ${startup.name}`,
  description: startup.shortDescription === null ? undefined : startup.shortDescription,
  alternates: {
    canonical: `https://www.d21.so/s/${startup.directory.slug}/${startup.id}`,
  },
  openGraph: {
    title: `D21 - ${startup.name}`,
    description: startup.shortDescription === null ? undefined : startup.shortDescription,
    url: `https://www.d21.so/s/${startup.directory.slug}/${startup.id}`,
    type: 'website',
    locale: 'en',
    alternateLocale: 'it',
    siteName: 'D21',
    images: startup.logoUrl ? [
      {
        url: startup.logoUrl,
        width: 1200,
        height: 630,
      }
    ] : [
      {
        url: 'https://www.d21.so/opengraph-image.png',
        width: 1200,
        height: 630,
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: startup.name,
    description: startup.shortDescription || undefined,
    images: startup.logoUrl ? [startup.logoUrl] : undefined,
  },
});