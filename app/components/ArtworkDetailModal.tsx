// ArtworkDetailModal.tsx
"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import type { ArtworkItem } from "../data/sampleData";

interface ArtworkDetailModalProps {
  artwork: ArtworkItem;
  isOpen: boolean;
  onClose: () => void;
}

const ArtworkDetailModal: React.FC<ArtworkDetailModalProps> = ({ artwork, isOpen, onClose }) => {
  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
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
                src={artwork.image} 
                alt={artwork.title}
                fill
                className="object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
              />
            </div>
          </div>
          
          {/* Artwork Details */}
          <div className="md:w-1/2 p-6 flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-2">{artwork.title}</h2>
            <p className="text-cyan-400 text-lg mb-4">by {artwork.artist}</p>
            
            <div className="bg-black/30 p-4 rounded-lg mb-6">
              <p className="text-3xl font-bold text-cyan-300 mb-1">{artwork.price}</p>
              <p className="text-green-400 text-sm">
                {artwork.inStock !== false ? "In Stock" : "Out of Stock"}
              </p>
            </div>
            
            <div className="space-y-4 mb-6 flex-grow">
              {artwork.description && (
                <div>
                  <h3 className="text-gray-400 text-sm uppercase mb-1">Description</h3>
                  <p className="text-white">{artwork.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                {artwork.year && (
                  <div>
                    <h3 className="text-gray-400 text-sm uppercase mb-1">Year</h3>
                    <p className="text-white">{artwork.year}</p>
                  </div>
                )}
                
                {artwork.medium && (
                  <div>
                    <h3 className="text-gray-400 text-sm uppercase mb-1">Medium</h3>
                    <p className="text-white">{artwork.medium}</p>
                  </div>
                )}
                
                {artwork.dimensions && (
                  <div>
                    <h3 className="text-gray-400 text-sm uppercase mb-1">Dimensions</h3>
                    <p className="text-white">{artwork.dimensions}</p>
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
  );
};

export default ArtworkDetailModal;
