// ArtworkCard.tsx
import React from "react";
import Image from "next/image"; // Make sure this import is correct
import type { ArtworkItem } from "../data/sampleData"; // Import the type

interface ArtworkCardProps {
  artwork: ArtworkItem;
  onPreview: () => void;
  isActive?: boolean;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onPreview, isActive = false }) => {
  return (
    <div 
      className={`
        artwork-card cursor-pointer transition-all duration-300 relative group
        ${isActive ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-900/30' : ''}
      `} 
      onClick={onPreview}
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-lg">
        <Image 
          src={artwork.image} 
          alt={artwork.title} 
          fill // Next.js 13+ uses fill instead of layout="fill"
          className="object-cover hover:scale-105 transition-transform duration-300" 
        />
        
        {isActive && (
          <div className="absolute top-2 right-2 bg-cyan-500 text-xs text-white px-2 py-1 rounded-full">
            Featured
          </div>
        )}
        
        {/* Hover overlay with lore preview */}
        {artwork.lore && (
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
            <div>
              <p className="text-cyan-300 text-lg mb-2">📖</p>
              <p className="text-white text-sm font-medium line-clamp-3">{artwork.lore}</p>
              <p className="text-cyan-400 text-xs mt-2">Click for details</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="text-white font-medium text-lg truncate">{artwork.title}</h3>
        <p className="text-gray-400 text-sm">{artwork.artist}</p>
        <p className="text-cyan-300 font-bold mt-1">{artwork.price}</p>
        
        {/* Universe indicator */}
        {artwork.universe && (
          <div className="flex items-center mt-2">
            <span className="text-cyan-300 text-sm mr-1">⚔️</span>
            <p className="text-gray-400 text-xs truncate">{artwork.universe.split('!')[0]}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworkCard;