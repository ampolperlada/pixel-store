// ArtworkCard.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import type { ArtworkItem } from "../data/sampleData";

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

export default ArtworkCard;
