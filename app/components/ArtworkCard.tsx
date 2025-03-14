// ArtworkCard.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import type { ArtworkItem } from "../data/sampleData";

interface ArtworkCardProps {
  artwork: ArtworkItem;
  onPreview: () => void;
  isActive?: boolean;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onPreview, isActive = false }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div 
      className={`
        artwork-card cursor-pointer transition-all duration-300 relative
        ${isActive ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-900/30' : ''}
      `} 
      onClick={onPreview}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-lg">
        <Image 
          src={artwork.image} 
          alt={artwork.title} 
          fill
          className="object-cover hover:scale-105 transition-transform duration-300" 
        />
        
        {/* Universe Indicator */}
        {artwork.universe && (
          <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-cyan-400 ring-2 ring-cyan-400/30"></div>
        )}
        
        {/* Featured Badge */}
        {artwork.featured && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 rounded-full">
            <span className="text-white text-xs font-bold">Featured</span>
          </div>
        )}
        
        {/* Lore Preview on Hover */}
        {isHovering && artwork.lore && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm p-3 flex flex-col justify-end transform transition-opacity duration-200 opacity-100">
            <p className="text-white text-xs line-clamp-4">{artwork.lore}</p>
            <p className="text-cyan-400 text-xs mt-2">Click to view details</p>
          </div>
        )}
        
        {/* Rarity Badge */}
        {artwork.rarity && (
          <div className={`absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs font-bold ${
            artwork.rarity === 'Legendary' ? 'bg-amber-500/80 text-white' :
            artwork.rarity === 'Epic' ? 'bg-purple-500/80 text-white' :
            artwork.rarity === 'Rare' ? 'bg-blue-500/80 text-white' :
            'bg-gray-500/80 text-white'
          }`}>
            {artwork.rarity}
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="text-white font-medium text-lg truncate">{artwork.title}</h3>
        <p className="text-gray-400 text-sm">{artwork.artist}</p>
        <div className="flex justify-between items-center mt-1">
          <p className="text-cyan-300 font-bold">{artwork.price}</p>
          {artwork.edition && (
            <p className="text-gray-500 text-xs">{artwork.edition.current}/{artwork.edition.total}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
