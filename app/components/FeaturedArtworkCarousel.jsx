import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Sample data for testing if none is provided
const sampleArt = [
  {
    id: '1',
    title: 'Neo Ronin',
    artist: 'PixelMaster',
    imageUrl: '/path/to/image1.jpg',
    category: 'cyberpunk',
    gameReady: true,
    price: '0.05 ETH'
  },
  {
    id: '2',
    title: 'Cyber Samurai',
    artist: 'RetroArtist',
    imageUrl: '/path/to/image2.jpg',
    category: 'cyberpunk',
    gameReady: true,
    price: '0.08 ETH'
  },
  {
    id: '3',
    title: 'Glitch Ninja',
    artist: 'VoxelQueen',
    imageUrl: '/path/to/image3.jpg',
    category: 'cyberpunk',
    price: '0.03 ETH'
  },
  {
    id: '4',
    title: 'Cyber Zombie',
    artist: 'ByteCrafter',
    imageUrl: '/path/to/image4.jpg',
    category: 'cyberpunk',
    gameReady: true,
    price: '0.07 ETH'
  }
];

const FeaturedArtworkCarousel = ({ featuredArt = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [filteredArt, setFilteredArt] = useState([]);
  const [filter, setFilter] = useState('all');

  // Initialize filtered art when component mounts or featuredArt changes
  useEffect(() => {
    setFilteredArt(featuredArt);
  }, [featuredArt]);

  // Auto-advance carousel
  useEffect(() => {
    if (!autoplay || filteredArt.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredArt.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay, filteredArt.length]);

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
    if (filteredArt.length <= 1) return;
    
    setCurrentIndex((prevIndex) => {
      if (direction === 'prev') {
        return prevIndex === 0 ? filteredArt.length - 1 : prevIndex - 1;
      } else {
        return (prevIndex + 1) % filteredArt.length;
      }
    });
  };

  // Use sample data if no artwork is provided
  const artworkToDisplay = filteredArt.length > 0 ? filteredArt : sampleArt;

  return (
    <section className="py-16 bg-black relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-300">FEATURED ARTWORK</h2>
          
          {/* Category filters */}
          <div className="hidden md:flex space-x-4">
            <button 
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-1 rounded-full ${filter === 'all' ? 'bg-pink-600' : 'bg-gray-800'} text-white`}
            >
              All
            </button>
            <button 
              onClick={() => handleFilterChange('cyberpunk')}
              className={`px-4 py-1 rounded-full ${filter === 'cyberpunk' ? 'bg-pink-600' : 'bg-gray-800'} text-white`}
            >
              Cyberpunk
            </button>
            <button 
              onClick={() => handleFilterChange('fantasy')}
              className={`px-4 py-1 rounded-full ${filter === 'fantasy' ? 'bg-pink-600' : 'bg-gray-800'} text-white`}
            >
              Fantasy
            </button>
          </div>
        </div>

        {/* Carousel container */}
        <div className="relative">
          {/* Previous button */}
          <button 
            onClick={() => navigate('prev')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full text-white"
            aria-label="Previous artwork"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Artwork display */}
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
              {artworkToDisplay.map((art, index) => {
                const isCurrentItem = index === currentIndex % artworkToDisplay.length;
                const nextIndex = (currentIndex + 1) % artworkToDisplay.length;
                const nextNextIndex = (currentIndex + 2) % artworkToDisplay.length;
                const nextNextNextIndex = (currentIndex + 3) % artworkToDisplay.length;
                
                if (index === currentIndex || index === nextIndex || index === nextNextIndex || index === nextNextNextIndex) {
                  return (
                    <div 
                      key={art.id} 
                      className={`relative overflow-hidden rounded-lg border-2 ${isCurrentItem ? 'border-pink-500' : 'border-gray-700'} transition-all duration-300 hover:scale-[1.02]`}
                    >
                      <div className="aspect-square relative bg-gray-800">
                        <Image src={art.imageUrl} alt={art.title} layout="fill" objectFit="cover" />
                        {art.gameReady && (
                          <div className="absolute top-3 right-3 bg-cyan-500 text-xs text-white px-2 py-1 rounded">
                            Game Ready
                          </div>
                        )}
                        {art.price && (
                          <div className="absolute bottom-3 left-3 bg-black/70 text-xs text-white px-2 py-1 rounded">
                            {art.price}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3 bg-gray-900 text-white">
                        <h3 className="font-bold text-lg">{art.title}</h3>
                        <p className="text-cyan-300 text-sm">by {art.artist}</p>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* Next button */}
          <button 
            onClick={() => navigate('next')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full text-white"
            aria-label="Next artwork"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Pagination dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {artworkToDisplay.map((_, index) => (
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