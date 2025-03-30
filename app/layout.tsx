import { ReactNode } from "react";
import "./globals.css";
import Providers from "./provider";
import { AuthProvider } from '@/context/AuthContext'; // Import the AuthProvider

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: 'black', color: 'white' }}>
        <Providers> {/* Your existing providers */}
          <AuthProvider> {/* New auth provider */}
            <main>{children}</main>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}