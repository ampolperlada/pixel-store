import { ReactNode } from "react";
import "./globals.css";
import Providers from "./provider"; // Import the new provider

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: 'black', color: 'white' }}>
        <Providers> {/* Wrap with the client-side provider */}
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}