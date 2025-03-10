import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const FeaturedArtworkCarousel = ({ featuredArt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [filteredArt, setFilteredArt] = useState(featuredArt);
  const [filter, setFilter] = useState('all');

  // Auto-advance carousel
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredArt.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay, filteredArt]);

  // Handle filtering artwork
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === 'all') {
      setFilteredArt(featuredArt);
    } else {
      setFilteredArt(featuredArt.filter(art => art.category === newFilter));
    }
    setCurrentIndex(0);
  };

  // Navigate to previous or next artwork
  const navigate = (direction) => {
    setAutoplay(false);
    setCurrentIndex((prevIndex) => {
      if (direction === 'prev') {
        return prevIndex === 0 ? filteredArt.length - 1 : prevIndex - 1;
      } else {
        return (prevIndex + 1) % filteredArt.length;
      }
    });
  };

  return (
    <section className="py-16 bg-black relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-300">FEATURED ARTWORK</h2>
          
          {/* Category filters */}
          <div className="hidden md:flex space-x-4">
            <button 
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-1 rounded-full ${filter === 'all' ? 'bg-pink-600' : 'bg-gray-800'}`}
            >
              All
            </button>
            <button 
              onClick={() => handleFilterChange('cyberpunk')}
              className={`px-4 py-1 rounded-full ${filter === 'cyberpunk' ? 'bg-pink-600' : 'bg-gray-800'}`}
            >
              Cyberpunk
            </button>
            <button 
              onClick={() => handleFilterChange('fantasy')}
              className={`px-4 py-1 rounded-full ${filter === 'fantasy' ? 'bg-pink-600' : 'bg-gray-800'}`}
            >
              Fantasy
            </button>
          </div>
        </div>

        {/* Carousel container */}
        <div className="relative">
          <button 
            onClick={() => navigate('prev')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full"
            aria-label="Previous artwork"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="overflow-hidden">
            <div className="flex">
              <AnimatePresence initial={false}>
                <motion.div 
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full"
                >
                  {filteredArt.map((art, index) => {
                    const isCurrentItem = index === currentIndex % filteredArt.length;
                    const nextIndex = (currentIndex + 1) % filteredArt.length;
                    const nextNextIndex = (currentIndex + 2) % filteredArt.length;
                    const nextNextNextIndex = (currentIndex + 3) % filteredArt.length;
                    
                    if (index === currentIndex || index === nextIndex || index === nextNextIndex || index === nextNextNextIndex) {
                      return (
                        <div 
                          key={art.id} 
                          className={`relative overflow-hidden rounded-lg border-2 ${isCurrentItem ? 'border-pink-500' : 'border-gray-700'} group transition-all duration-300 hover:scale-[1.02]`}
                        >
                          <div className="aspect-square relative">
                            <Image 
                              src={art.imageUrl} 
                              alt={art.title}
                              layout="fill"
                              objectFit="cover"
                              priority={isCurrentItem}
                              sizes="(max-width: 768px) 100vw, 25vw"
                            />
                            {art.gameReady && (
                              <div className="absolute top-3 right-3 bg-cyan-500 text-xs text-white px-2 py-1 rounded">
                                Game Ready
                              </div>
                            )}
                            {art.price && (
                              <div className="absolute bottom-3 left-3 bg-black/70 text-xs text-white px-2 py-1 rounded">
                                {art.price} ETH
                              </div>
                            )}
                          </div>
                          
                          <div className="p-3 bg-gray-900">
                            <h3 className="font-bold text-lg">{art.title}</h3>
                            <p className="text-cyan-300 text-sm">by {art.artist}</p>
                            
                            {/* Hover overlay with action buttons */}
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="space-y-3 text-center">
                                <button className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
                                  View Details
                                </button>
                                <button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
                                  Quick Buy
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <button 
            onClick={() => navigate('next')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full"
            aria-label="Next artwork"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Pagination dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {filteredArt.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setAutoplay(false);
              }}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-pink-500' : 'bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <div className="text-center mt-8">
          <button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-8 rounded-md transition-colors">
            VIEW ALL ARTWORK
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtworkCarousel;