// FeaturedArtworkCarousel.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow, Keyboard } from "swiper/modules";
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

// Enhanced ArtworkItem interface
interface ArtworkItem {
  id: string;
  title: string;
  image: string;
  artist: string;
  price: string;
  description?: string;
  dimensions?: string;
  medium?: string;
  year?: string;
  inStock?: boolean;
}

// ArtworkCard Component
interface ArtworkCardProps {
  artwork: ArtworkItem;
  onPreview: () => void;
  isActive?: boolean;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onPreview, isActive = false }) => {
  return (
    <div 
      className={`
        artwork-card cursor-pointer transition-all duration-300
        ${isActive ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-900/30' : ''}
      `} 
      onClick={onPreview}
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-lg">
        <Image 
          src={artwork.image} 
          alt={artwork.title} 
          fill
          className="object-cover hover:scale-105 transition-transform duration-300" 
        />
        
        {isActive && (
          <div className="absolute top-2 right-2 bg-cyan-500 text-xs text-white px-2 py-1 rounded-full">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="text-white font-medium text-lg truncate">{artwork.title}</h3>
        <p className="text-gray-400 text-sm">{artwork.artist}</p>
        <p className="text-cyan-300 font-bold mt-1">{artwork.price}</p>
      </div>
    </div>
  );
};

// Main Carousel Component
interface FeaturedArtworkCarouselProps {
  featuredArt: ArtworkItem[];
  title?: string;
  autoplayDelay?: number;
}

const FeaturedArtworkCarousel: React.FC<FeaturedArtworkCarouselProps> = ({ 
  featuredArt, 
  title = "FEATURED ARTWORK",
  autoplayDelay = 3000
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Check for mobile screen size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Pause autoplay on hover
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  
  // Handle artwork preview
  const handlePreview = (artwork: ArtworkItem) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArtwork(null);
    // Re-enable body scrolling
    document.body.style.overflow = 'auto';
  };
  
  // Accessibility announcement for screen readers
  useEffect(() => {
    if (featuredArt[activeIndex]) {
      const title = featuredArt[activeIndex].title;
      const liveRegion = document.getElementById('carousel-live-region');
      if (liveRegion) {
        liveRegion.textContent = `Now showing: ${title}`;
      }
    }
  }, [activeIndex, featuredArt]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isModalOpen]);

  return (
    <section className="py-16 bg-black relative overflow-hidden">
      {/* Hidden element for screen readers */}
      <div 
        id="carousel-live-region" 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      ></div>
      
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-cyan-900/10 to-black/0 pointer-events-none"></div>
      
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-2">{title}</h2>
          <p className="text-gray-300">Explore our curated collection of digital masterpieces</p>
        </div>

        {/* Carousel Controls - Custom Navigation */}
        <div className="flex justify-end mb-4 gap-2">
          <button 
            className="swiper-button-prev-custom p-2 rounded-full bg-cyan-800/30 hover:bg-cyan-700/50 transition-colors"
            aria-label="Previous artwork"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button 
            className="swiper-button-next-custom p-2 rounded-full bg-cyan-800/30 hover:bg-cyan-700/50 transition-colors"
            aria-label="Next artwork"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Swiper Carousel */}
        <div 
          className="relative" 
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow, Keyboard]}
            effect={isMobile ? 'slide' : 'coverflow'}
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            spaceBetween={20}
            slidesPerView={1}
            centeredSlides={true}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true
            }}
            autoplay={isHovering ? false : { delay: autoplayDelay, disableOnInteraction: false }}
            loop={true}
            keyboard={{ enabled: true }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="mt-6 !pb-12"
          >
            {featuredArt.map((artwork, index) => (
              <SwiperSlide key={artwork.id} className="h-auto">
                {({ isActive }) => (
                  <div
                    className={`transition-all duration-300 h-full ${isActive ? 'opacity-100 scale-100 -translate-y-2' : 'opacity-70 scale-95 translate-y-0'}`}
                  >
                    <ArtworkCard 
                      artwork={artwork} 
                      onPreview={() => handlePreview(artwork)}
                      isActive={isActive}
                    />
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Current artwork info overlay */}
          {featuredArt[activeIndex] && (
            <div className="absolute bottom-16 left-0 right-0 text-center z-10 pointer-events-none">
              <div className="inline-block bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-cyan-300 font-medium">
                  {activeIndex + 1}/{featuredArt.length}: {featuredArt[activeIndex].title}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg transition-colors shadow-lg hover:shadow-cyan-700/30">
            View All Artwork
          </button>
        </div>
      </div>

      {/* Artwork Detail Modal */}
      {isModalOpen && selectedArtwork && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white z-10"
              aria-label="Close details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="flex flex-col md:flex-row">
              {/* Artwork Image */}
              <div className="md:w-1/2 relative">
                <div className="aspect-square relative">
                  <Image 
                    src={selectedArtwork.image} 
                    alt={selectedArtwork.title}
                    fill
                    className="object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                  />
                </div>
              </div>
              
              {/* Artwork Details */}
              <div className="md:w-1/2 p-6 flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedArtwork.title}</h2>
                <p className="text-cyan-400 text-lg mb-4">by {selectedArtwork.artist}</p>
                
                <div className="bg-black/30 p-4 rounded-lg mb-6">
                  <p className="text-3xl font-bold text-cyan-300 mb-1">{selectedArtwork.price}</p>
                  <p className="text-green-400 text-sm">
                    {selectedArtwork.inStock !== false ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
                
                <div className="space-y-4 mb-6 flex-grow">
                  {selectedArtwork.description && (
                    <div>
                      <h3 className="text-gray-400 text-sm uppercase mb-1">Description</h3>
                      <p className="text-white">{selectedArtwork.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    {selectedArtwork.year && (
                      <div>
                        <h3 className="text-gray-400 text-sm uppercase mb-1">Year</h3>
                        <p className="text-white">{selectedArtwork.year}</p>
                      </div>
                    )}
                    
                    {selectedArtwork.medium && (
                      <div>
                        <h3 className="text-gray-400 text-sm uppercase mb-1">Medium</h3>
                        <p className="text-white">{selectedArtwork.medium}</p>
                      </div>
                    )}
                    
                    {selectedArtwork.dimensions && (
                      <div>
                        <h3 className="text-gray-400 text-sm uppercase mb-1">Dimensions</h3>
                        <p className="text-white">{selectedArtwork.dimensions}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                    Contact Gallery
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedArtworkCarousel;
