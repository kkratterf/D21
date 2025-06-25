import type { ReactNode } from 'react';

import { DesignSystemProvider } from '@d21/design-system';
import { fonts } from '@d21/design-system/lib/fonts';

import '@d21/design-system/styles/shared-globals.css';
import './globals.css';
import { AuthProvider } from '@/providers/auth-provider'

export { metadata } from '@/lib/metadata';

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html lang="en" className={fonts} suppressHydrationWarning>
    <body>
      <AuthProvider>
        <DesignSystemProvider>
          {children}
        </DesignSystemProvider>
      </AuthProvider>
    </body>
  </html>
);

export default RootLayout;
