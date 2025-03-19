"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthModals from './AuthModals'; // Import the AuthModals component

const NotificationBar = () => {
  return (
    <>
      {/* Limited Time Events Banner */}
      <div className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 p-2 text-center relative overflow-hidden">
        <div className="animate-pulse absolute -left-10 top-0 h-full w-20 bg-white opacity-20 skew-x-12"></div>
        <p className="font-mono text-sm">
          🔥 LIMITED EVENT: Cyberpunk Collection Drop - Ends in <span className="font-bold">12:24:45</span>
        </p>
      </div>
    </>
  );
};

const StickyNavbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // State for AuthModal

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`w-full py-3 z-10 transition-all duration-300 ${
          isSticky
            ? 'fixed top-0 shadow-lg bg-gray-900 bg-opacity-95 backdrop-blur-sm'
            : 'relative bg-gray-900'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <div className="w-8 h-8 mr-2">
                  <Image
                    src="/images/coin.png"
                    alt="Pixel Marketplace"
                    width={32}
                    height={32}
                  />
                </div>
                <span className="font-bold text-lg text-white">PIXEL MARKETPLACE</span>
              </div>
            </Link>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/explore" className="text-white hover:text-pink-400 transition-colors">
                Explore
              </Link>
              <Link href="/create" className="text-white hover:text-pink-400 transition-colors">
                Create
              </Link>
              <Link href="/games" className="text-white hover:text-pink-400 transition-colors">
                Games
              </Link>
              <Link href="/learn" className="text-white hover:text-pink-400 transition-colors">
                Learn
              </Link>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* Notification Bell */}
              <div className="relative">
                <button className="text-cyan-400 hover:text-cyan-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-cyan-400"></span>
                </button>
              </div>

              {/* My Profile Button */}
              <Link
                href="/profile"
                className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-pink-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
              >
                My Profile
              </Link>

              {/* Sign In and Sign Up Buttons */}
              <button
                onClick={() => setIsAuthModalOpen(true)} // Open the AuthModal
                className="text-white hover:text-pink-400 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setIsAuthModalOpen(true)} // Open the AuthModal
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button (implementation would require additional state) */}
            <button className="md:hidden text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModals
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)} // Close the AuthModal
      />
    </>
  );
};

const Header = () => {
  return (
    <header className="relative">
      <NotificationBar />
      <StickyNavbar />
    </header>
  );
};

export default Header;