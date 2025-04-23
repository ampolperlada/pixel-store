'use client';

import { ReactNode } from "react";
import "./globals.css";

// Global context providers
import Providers from "./provider";
import { AuthProvider } from './components/context/AuthContext';
import { ModalProvider } from './components/context/ModalContext'; // ✅ Make sure this path matches your project structure

// NextAuth session provider
import { SessionProvider } from 'next-auth/react';

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>My App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ backgroundColor: 'black', color: 'white' }}>
        <SessionProvider>
          <Providers>
            <AuthProvider>
              <ModalProvider> {/* ✅ Inject ModalProvider here */}
                <main>{children}</main>
              </ModalProvider>
            </AuthProvider>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
