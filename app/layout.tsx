'use client';

import { ReactNode, useState } from "react";
import "./globals.css";

// Global context providers
import Providers from "./provider";
import { AuthProvider } from './components/context/AuthContext';
import { ModalProvider, useModal } from './components/context/ModalContext'; // ✅ modal context
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
        <title>My App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ backgroundColor: 'black', color: 'white' }}>
        <SessionProvider>
          <Providers>
            <AuthProvider>
              <ModalProvider>
                <LayoutContent>{children}</LayoutContent> {/* ✅ Main content with modal support */}
              </ModalProvider>
            </AuthProvider>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
