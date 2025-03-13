import React from 'react';
import ArtworkCard from '../components/ArtworkCard';
import { ArtworkItem } from '../data/sampleData'; // ✅ Ensure the correct import

interface FeaturedArtworkProps {
  featuredArt: ArtworkItem[]; // ✅ Define the expected prop
}

const FeaturedArtwork: React.FC<FeaturedArtworkProps> = ({ featuredArt }) => {
  return (
    <section className="py-16 bg-black relative">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-cyan-300">FEATURED ARTWORK</h2>

        <div className="artwork-grid mt-6">
          {featuredArt.map(artwork => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtwork;
