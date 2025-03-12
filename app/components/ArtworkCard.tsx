import React from 'react';
import Image from 'next/image';

interface ArtworkCardProps {
  artwork: {
    title: string;
    image: string;
    artist: string;
    price: string;
  };
  onPreview: () => void;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onPreview }) => {
  return (
    <div className="artwork-card" onClick={onPreview}>
      <Image src={artwork.image} alt={artwork.title} width={300} height={300} className="rounded-lg" />
      <h3 className="text-white mt-2">{artwork.title}</h3>
      <p className="text-gray-400">{artwork.artist}</p>
      <p className="text-cyan-300 font-bold">{artwork.price}</p>
    </div>
  );
};

export default ArtworkCard;
