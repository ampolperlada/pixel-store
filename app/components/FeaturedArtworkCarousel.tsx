"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow, Keyboard } from "swiper/modules";
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import ArtworkCard from './ArtworkCard';
import ArtworkDetailModal from './ArtworkDetailModal';
import type { ArtworkItem } from "../data/sampleData";

interface FeaturedArtworkCarouselProps {
  featuredArt: ArtworkItem[];
  title?: string;
  autoplayDelay?: number;
}

// The rest of the component remains unchanged
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
  
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  
  const handlePreview = (artwork: ArtworkItem) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArtwork(null);
    document.body.style.overflow = 'auto';
  };
  
  useEffect(() => {
    if (featuredArt[activeIndex]) {
      const title = featuredArt[activeIndex].title;
      const liveRegion = document.getElementById('carousel-live-region');
      if (liveRegion) {
        liveRegion.textContent = `Now showing: ${title}`;
      }
    }
  }, [activeIndex, featuredArt]);

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
      <div 
        id="carousel-live-region" 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      ></div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-cyan-900/10 to-black/0 pointer-events-none"></div>
      
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-2">{title}</h2>
          <p className="text-gray-300">Explore our curated collection of digital masterpieces</p>
        </div>

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
        
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg transition-colors shadow-lg hover:shadow-cyan-700/30">
            View All Artwork
          </button>
        </div>
      </div>

      {selectedArtwork && (
        <ArtworkDetailModal
          artwork={selectedArtwork}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </section>
  );
};

export default FeaturedArtworkCarousel;