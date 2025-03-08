// app/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  // Sample featured pixel art data
  const featuredArt = [
    { id: 1, title: 'Neon City', artist: 'PixelMaster', price: '0.05 ETH', image: '/api/placeholder/300/300' },
    { id: 2, title: 'Cyber Samurai', artist: 'RetroArtist', price: '0.08 ETH', image: '/api/placeholder/300/300' },
    { id: 3, title: 'Digital Dreams', artist: 'VoxelQueen', price: '0.03 ETH', image: '/api/placeholder/300/300' },
    { id: 4, title: 'Glitch Landscape', artist: 'ByteCrafter', price: '0.07 ETH', image: '/api/placeholder/300/300' },
    { id: 4, title: 'Glitch Landscape', artist: 'ByteCrafter', price: '0.07 ETH', image: '/api/placeholder/300/300' },
    { id: 4, title: 'Glitch Landscape', artist: 'ByteCrafter', price: '0.07 ETH', image: '/api/placeholder/300/300' },

  ];

  // For carousel functionality
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto-sliding functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === featuredArt.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change slide every 3 seconds
    
    return () => clearInterval(interval);
  }, [featuredArt.length]);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section with Pixel Art Styling */}
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
          <p className="text-xl md:text-2xl mb-8 text-cyan-300 font-mono">Collect • Trade • Create</p>
          <div className="space-x-4">
            <Link href="/shop" className="px-6 py-3 bg-pink-600 text-white font-bold hover:bg-pink-700 transition-all border-2 border-pink-400 shadow-lg shadow-pink-500/50">
              EXPLORE ART
            </Link>
            <Link href="/about" className="px-6 py-3 bg-transparent text-cyan-300 font-bold hover:text-cyan-100 transition-all border-2 border-cyan-500 shadow-lg shadow-cyan-500/30">
              LEARN MORE
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Pixel Art Auto-Sliding Carousel */}
      <section className="py-12 px-4 md:px-8">
        <h2 className="text-3xl font-bold mb-8 text-cyan-300 border-b-2 border-cyan-500 pb-2 inline-block font-mono">FEATURED ARTWORK</h2>
        
        {/* Smaller Auto-Sliding Carousel */}
        <div className="max-w-5xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 25}%)` }}
            >
              {featuredArt.map((art) => (
                <div key={art.id} className="min-w-[25%] px-2">
                  <div className="bg-gray-900 border-2 border-purple-500 hover:border-pink-500 transition-all p-3 group">
                    <div className="relative aspect-square mb-2 overflow-hidden">
                      <img 
                        src={art.image} 
                        alt={art.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-pink-400 font-bold text-sm">{art.price}</p>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-white truncate">{art.title}</h3>
                    <p className="text-cyan-400 text-xs">by {art.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Indicator Dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {featuredArt.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === index ? 'bg-pink-500' : 'bg-gray-600'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/shop" className="px-6 py-3 bg-purple-700 text-white font-bold hover:bg-purple-800 transition-all border-2 border-purple-500 inline-block">
            VIEW ALL ARTWORK
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-4 md:px-8 bg-gradient-to-b from-gray-900 to-black">
        <h2 className="text-3xl font-bold mb-8 text-cyan-300 border-b-2 border-cyan-500 pb-2 inline-block font-mono">HOW IT WORKS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-6 border-l-4 border-pink-500">
            <div className="text-4xl font-bold text-pink-500 mb-3">01</div>
            <h3 className="text-xl font-bold text-white mb-2">Create or Purchase</h3>
            <p className="text-gray-300">Browse our marketplace for pixel art or list your own creations for others to enjoy.</p>
          </div>
          
          <div className="bg-gray-900 p-6 border-l-4 border-purple-500">
            <div className="text-4xl font-bold text-purple-500 mb-3">02</div>
            <h3 className="text-xl font-bold text-white mb-2">Secure Ownership</h3>
            <p className="text-gray-300">Each piece of art comes with verified ownership and transaction history.</p>
          </div>
          
          <div className="bg-gray-900 p-6 border-l-4 border-cyan-500">
            <div className="text-4xl font-bold text-cyan-500 mb-3">03</div>
            <h3 className="text-xl font-bold text-white mb-2">Trade & Collect</h3>
            <p className="text-gray-300">Build your collection or trade with other enthusiasts in our community.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 text-center bg-gradient-to-r from-pink-900/50 to-purple-900/50">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white font-mono">JOIN THE PIXEL REVOLUTION</h2>
        <p className="text-xl text-cyan-300 mb-8 max-w-2xl mx-auto">Sign up today and get exclusive access to limited edition pixel art drops and community events.</p>
        <button className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold hover:from-pink-700 hover:to-purple-700 transition-all border-2 border-pink-400 shadow-lg shadow-pink-500/30 uppercase tracking-wider">
          Sign Up Now
        </button>
      </section>
    </main>
  );
}