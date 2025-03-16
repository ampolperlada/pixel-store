// app/src/components/HeroSection.jsx
'use client';
import React from 'react';
import Link from 'next/link';

// Inside your component JSX:
<Link href="/create" className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-600 transition">
  Create Pixel Art
</Link>

export default function HeroSection() {
  return (
    <section className="relative h-96 overflow-hidden border-b-4 border-pink-500 border-dotted">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900 opacity-70"></div>
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-20">
        {/* This creates a pixel grid effect in the background */}
        {Array(144).fill(0).map((_, i) => (
          <div key={i} className="border border-blue-500/20"></div>
        ))}
      </div>
      
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 pixel-font">
          PIXEL MARKETPLACE
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-cyan-300 font-mono">Create • Collect • Play</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/shop" className="px-6 py-3 bg-pink-600 text-white font-bold hover:bg-pink-700 transition-all border-2 border-pink-400 shadow-lg shadow-pink-500/50">
            EXPLORE ART
          </Link>
          <Link href="/create" className="px-6 py-3 bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all border-2 border-purple-400 shadow-lg shadow-purple-500/50">
            CREATE PIXEL ART
          </Link>
          <Link href="/games" className="px-6 py-3 bg-transparent text-cyan-300 font-bold hover:text-cyan-100 transition-all border-2 border-cyan-500 shadow-lg shadow-cyan-500/30">
            GAMES INTEGRATION
          </Link>
        </div>
      </div>
    </section>
  );
}