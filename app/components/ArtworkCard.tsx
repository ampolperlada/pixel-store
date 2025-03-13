// ArtworkCard.tsx
"use client";

import React from 'react';
import Image from 'next/image';

interface ArtworkCardProps {
  artwork: {
    id?: string;
    title: string;
    image: string;
    artist: string;
    price: string;
  };
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
      <div className="relative overflow-hidden rounded-lg">
        <Image 
          src={artwork.image} 
          alt={artwork.title} 
          width={300} 
          height={300} 
          className="rounded-lg hover:scale-105 transition-transform duration-300" 
        />
        
        {isActive && (
          <div className="absolute top-2 right-2 bg-cyan-500 text-xs text-white px-2 py-1 rounded-full">
            Featured
          </div>
        )}
      </div>
      
      <h3 className="text-white mt-2 font-medium">{artwork.title}</h3>
      <p className="text-gray-400">{artwork.artist}</p>
      <p className="text-cyan-300 font-bold">{artwork.price}</p>
    </div>
  );
};

export default ArtworkCard;
