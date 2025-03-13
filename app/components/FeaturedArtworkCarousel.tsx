import React from 'react';
import { ArtworkItem } from '../data/sampleData';
import ArtworkCard from '../components/ArtworkCard';

interface FeaturedArtworkCarouselProps {
  featuredArt: ArtworkItem[];
}

const FeaturedArtworkCarousel: React.FC<FeaturedArtworkCarouselProps> = ({ featuredArt }) => {
  const handlePreview = (artwork: ArtworkItem) => {
    console.log('Previewing:', artwork); // Replace this with your preview function
  };

  return (
    <section className="py-16 bg-black relative">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-cyan-300">FEATURED ARTWORK</h2>

        <div className="artwork-grid mt-6">
          {featuredArt.map(artwork => (
            <ArtworkCard
              key={artwork.id}
              artwork={{ ...artwork, image: artwork.image || `/public/${artwork.title}.png` }}
              onPreview={() => handlePreview(artwork)} // ✅ Pass onPreview function
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtworkCarousel;
