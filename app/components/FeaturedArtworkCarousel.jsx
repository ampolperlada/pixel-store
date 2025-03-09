// app/src/components/FeaturedArtworkCarousel.jsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FeaturedArtworkCarousel({ featuredArt }) {
  // For carousel functionality
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto-sliding functionality with looping
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // Create smooth looping effect
        if (prevIndex >= featuredArt.length - 4) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 3000); // Change slide every 3 seconds
    
    return () => clearInterval(interval);
  }, [featuredArt.length]);

  // Duplicate the items to create the infinite effect
  const displayItems = [...featuredArt, ...featuredArt.slice(0, 4)];

  return (
    <section className="py-12 px-4 md:px-8">
      <h2 className="text-3xl font-bold mb-8 text-cyan-300 border-b-2 border-cyan-500 pb-2 inline-block font-mono">FEATURED ARTWORK</h2>
      
      {/* Fixed Carousel with 4 visible cards */}
      <div className="max-w-6xl mx-auto">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 25}%)` }}
          >
            {displayItems.map((art, index) => (
              <div key={`${art.id}-${index}`} className="w-1/4 px-2 flex-shrink-0">
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
                    {art.gameReady && (
                      <div className="absolute top-2 right-2 bg-cyan-600 text-xs px-2 py-1 rounded-full text-white">
                        Game Ready
                      </div>
                    )}
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
                (currentIndex % featuredArt.length) === index ? 'bg-pink-500' : 'bg-gray-600'
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
  );
}