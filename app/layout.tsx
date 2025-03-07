import { ReactNode } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import '@/app/globals.css'; // ✅ If using absolute imports (check your tsconfig.json)

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Header />
        <main className="container mx-auto px-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
