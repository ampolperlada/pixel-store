'use client';

import { ReactNode } from "react";
import "./globals.css";
import Providers from "./provider";
import { AuthProvider } from './components/context/AuthContext';
import { ModalProvider, useModal } from './components/context/ModalContext';
import LoginModal from './components/LoginModal';
import NavBar from './components/layout/NavBar';

// REMOVE these lines - they don't work in client components
// export const dynamic = 'force-dynamic';
// export const dynamicParams = true;
// export const revalidate = 0;

interface LayoutProps {
  children: ReactNode;
}

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
      </head>
      <body style={{ backgroundColor: 'black', color: 'white' }}>
        <Providers>
          <AuthProvider>
            <ModalProvider>
              <NavBar />
              <LayoutContent>{children}</LayoutContent>
            </ModalProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}