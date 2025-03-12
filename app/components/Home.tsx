import React from 'react';

// Define the type for featuredArt
interface ArtworkItem {
  id: number;
  title: string;
  imageUrl: string;
}

interface FeaturedArtworkProps {
  featuredArt: ArtworkItem[];
}

const FeaturedArtworkCarousel: React.FC<FeaturedArtworkProps> = ({ featuredArt }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Featured Artwork</h2>
      <div className="flex overflow-x-scroll space-x-4">
        {featuredArt.map((art) => (
          <div key={art.id} className="w-64 bg-gray-800 p-4 rounded-lg">
            <img src={art.imageUrl} alt={art.title} className="w-full h-40 object-cover rounded-lg" />
            <h3 className="text-white mt-2">{art.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedArtworkCarousel;
