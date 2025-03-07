// components/Header.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 border-b-2 border-cyan-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {/* You can replace this with your own logo */}
              <div className="w-10 h-10 bg-pink-600 border-2 border-pink-400 mr-2 flex items-center justify-center text-white font-bold">P</div>
              <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 pixel-font">PIXEL STORE</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-pink-400 transition-colors px-3 py-2 font-medium">
              Home
            </Link>
            <Link href="/shop" className="text-white hover:text-pink-400 transition-colors px-3 py-2 font-medium">
              Shop
            </Link>
            <Link href="/artists" className="text-white hover:text-pink-400 transition-colors px-3 py-2 font-medium">
              Artists
            </Link>
            <Link href="/about" className="text-white hover:text-pink-400 transition-colors px-3 py-2 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-white hover:text-pink-400 transition-colors px-3 py-2 font-medium">
              Contact
            </Link>
          </nav>
          
          {/* User Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/search" className="text-gray-300 hover:text-white p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link href="/cart" className="text-gray-300 hover:text-white p-1 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-pink-600 rounded-full">0</span>
            </Link>
            <Link href="/login" className="px-4 py-2 bg-transparent border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white transition-colors font-medium rounded-sm">
              Sign In
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 py-2">
          <div className="space-y-1 px-4">
            <Link href="/" className="block text-white hover:bg-gray-700 px-3 py-2">
              Home
            </Link>
            <Link href="/shop" className="block text-white hover:bg-gray-700 px-3 py-2">
              Shop
            </Link>
            <Link href="/artists" className="block text-white hover:bg-gray-700 px-3 py-2">
              Artists
            </Link>
            <Link href="/about" className="block text-white hover:bg-gray-700 px-3 py-2">
              About
            </Link>
            <Link href="/contact" className="block text-white hover:bg-gray-700 px-3 py-2">
              Contact
            </Link>
            <div className="pt-2 pb-1 border-t border-gray-700 flex items-center space-x-4">
              <Link href="/search" className="text-gray-300 hover:text-white p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
              <Link href="/cart" className="text-gray-300 hover:text-white p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </Link>
              <Link href="/login" className="block text-center w-full px-4 py-2 bg-pink-600 text-white font-medium">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;