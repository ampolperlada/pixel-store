import { ReactNode } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <div className="bg-black text-white">
      <Header />
      <main className="container mx-auto px-4">{children}</main>
      <Footer />
    </div>
  );
}
