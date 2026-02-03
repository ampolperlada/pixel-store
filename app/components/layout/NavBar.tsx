import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = ({ transparent = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animated scrolling text
  const scrollingTexts = [
    "PIXEL STORE",
    "DIGITAL ART MARKETPLACE",
    "CREATE • COLLECT • TRADE",
    "NFT REVOLUTION",
    "WEB3 PLATFORM",
    "JOIN 10,000+ CREATORS",
    "BETA NOW LIVE",
  ];

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
              PIXEL STORE
            </span>
          </Link>

          {/* Animated Text Banner - Desktop */}
          <div className="hidden md:block flex-1 mx-8 overflow-hidden">
            <div className="relative h-8 flex items-center">
              <div className="animate-scroll-left whitespace-nowrap">
                {scrollingTexts.map((text, index) => (
                  <span
                    key={index}
                    className="inline-block mx-8 text-sm font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text"
                  >
                    ✦ {text}
                  </span>
                ))}
                {scrollingTexts.map((text, index) => (
                  <span
                    key={`duplicate-${index}`}
                    className="inline-block mx-8 text-sm font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text"
                  >
                    ✦ {text}
                  </span>
                ))}
              </div>
            </div>
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

            {/* Join Waitlist Button */}
            <Link
              href="/waitlist"
              className="hidden md:flex items-center space-x-2 py-2 px-4 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-500 hover:to-purple-500 transition"
            >
              <span>Join Waitlist</span>
            </Link>

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
              <Link href="/" className="block text-gray-300 hover:text-white py-2">Home</Link>
              <Link href="/explore" className="block text-gray-300 hover:text-white py-2">Explore</Link>
              <Link href="/create" className="block text-gray-300 hover:text-white py-2">Create</Link>
              <Link href="/games" className="block text-gray-300 hover:text-white py-2">Games</Link>
              <Link href="/waitlist" className="block w-full text-center bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 rounded-lg">
                Join Waitlist
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for scrolling animation */}
      <style jsx>{`
        @keyframes scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
        
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </header>
  );
};

export default NavBar;