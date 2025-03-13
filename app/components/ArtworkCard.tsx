import React from "react";
import Image from "next/image";
import { ArtworkItem } from "../data/sampleData";

interface ArtworkCardProps {
  artwork: ArtworkItem;
  onPreview: () => void; // ✅ Add this
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onPreview }) => {
  return (
    <div className="artwork-card" onClick={onPreview}>
      <div className="relative w-full h-48">
        <Image src={artwork.image} alt={artwork.title} layout="fill" className="object-cover rounded-lg" />
      </div>
      <h3 className="text-lg font-bold text-white mt-2">{artwork.title}</h3>
      <p className="text-sm text-gray-400">By {artwork.artist}</p>
      <p className="text-cyan-300 font-bold">{artwork.price}</p>
    </div>
  );
};

export default ArtworkCard;
