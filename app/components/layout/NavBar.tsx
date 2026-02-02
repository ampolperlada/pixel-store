import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = ({ transparent = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mockConnect = () => {
    setIsConnected(true);
    setIsWalletOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !transparent
          ? "bg-black/90 backdrop-blur-lg shadow-lg shadow-pink-500/10"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-transparent bg-clip-text">
              PIXEL MARKETPLACE
            </span>
          </Link>

         {/* Desktop Navigation */}
<div className="hidden md:flex items-center space-x-8">
  <NavLink href="/explore">EXPLORE ART</NavLink>
  <NavLink href="/create">CREATE PIXEL ART</NavLink>
  <NavLink href="/games">GAMES INTEGRATION</NavLink>
</div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button className="p-2 text-gray-300 hover:text-white" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Wallet Button */}
            <div className="relative">
              <button
                onClick={() => setIsWalletOpen((prev) => !prev)}
                className={`hidden md:flex items-center space-x-2 py-2 px-4 rounded-full ${
                  isConnected
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                    : "bg-gray-800 text-gray-200 hover:bg-gray-700"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{isConnected ? "0x7a...3f4a" : "Connect"}</span>
              </button>

              {/* Wallet Dropdown */}
              <AnimatePresence>
                {isWalletOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-xl py-2 z-50"
                  >
                    {!isConnected ? (
                      <div className="p-4">
                        <h3 className="text-lg font-bold mb-3">Connect Wallet</h3>
                        <button onClick={mockConnect} className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg">
                          MetaMask
                        </button>
                      </div>
                    ) : (
                      <div className="p-4">
                        <h3 className="text-lg font-bold mb-3">Wallet</h3>
                        <button onClick={() => setIsConnected(false)} className="w-full text-left p-3 text-red-400 hover:bg-gray-800 rounded">
                          Disconnect
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
              aria-label="Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-gray-900">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <MobileNavLink href="/explore">Explore</MobileNavLink>
              <MobileNavLink href="/create">Create</MobileNavLink>
              <MobileNavLink href="/games">Games</MobileNavLink>
              <MobileNavLink href="/community">Community</MobileNavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// Placeholder components for missing NavLink and MobileNavLink
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => <Link href={href} className="text-gray-300 hover:text-white">{children}</Link>;
interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
}

const MobileNavLink = ({ href, children }: MobileNavLinkProps) => <Link href={href} className="block text-gray-300 hover:text-white">{children}</Link>;

export default NavBar;
