'use client';

import { ReactNode } from "react";
import "./globals.css";
import Providers from "./provider";
import { AuthProvider } from './components/context/AuthContext';
import { SessionProvider } from 'next-auth/react';

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: 'black', color: 'white' }}>
        <SessionProvider>
          <Providers>
            <AuthProvider>
              <main>{children}</main>
            </AuthProvider>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}