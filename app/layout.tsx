'use client';

import { ReactNode, useState } from "react";
import "./globals.css";

// Global context providers
import Providers from "./provider";
import { AuthProvider } from './components/context/AuthContext';
import { ModalProvider, useModal } from './components/context/ModalContext';
import { SessionProvider } from 'next-auth/react';

// Import your LoginModal component
import LoginModal from './components/LoginModal';


interface LayoutProps {
  children: ReactNode;
}


// Wrap this separately so we can access hooks
function LayoutContent({ children }: { children: ReactNode }) {
  const { showLoginModal, setShowLoginModal } = useModal();

  return (
    <>
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          triggerReason="protected-route"
        />
      )}
      <main>{children}</main>
    </>
  );
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>Pixel Store - Digital Art Marketplace for Creators</title>
        <meta name="description" content="Buy, sell, and create unique pixel art NFTs. Join thousands of artists and collectors in the future of digital art." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Pixel Store - Digital Art Marketplace" />
        <meta property="og:description" content="Join 10,000+ creators building the future of digital art" />
        <meta property="og:type" content="website" />
      </head>
      <body style={{ backgroundColor: 'black', color: 'white' }}>
        <SessionProvider>
          <Providers>
            <AuthProvider>
              <ModalProvider>
                <LayoutContent>{children}</LayoutContent>
              </ModalProvider>
            </AuthProvider>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}