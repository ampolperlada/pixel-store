import React from 'react';
import Image from 'next/image';

const ArtistShowcase = () => {
  // Sample data - replace with your actual data
  const featuredArtists = [
    { 
      id: 1,
      name: "PixelMaster", 
      earnings: "$12,450", 
      followers: 1250,
      topArt: "/images/artist1-work.png"
    },
    { 
      id: 2,
      name: "BitCreator", 
      earnings: "$8,320", 
      followers: 980,
      topArt: "/images/artist2-work.png"
    },
    { 
      id: 3,
      name: "PixelPro", 
      earnings: "$9,650", 
      followers: 1120,
      topArt: "/images/artist3-work.png"
    }
  ];
  
  return (
    <section className="py-12 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Top Earning Artists</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArtists.map((artist) => (
            <div key={artist.id} className="bg-gradient-to-br from-blue-800 via-purple-800 to-pink-800 rounded-lg p-4 hover:shadow-lg transition-all">
              <div className="relative w-full h-48 mb-4">
                <Image 
                  src={artist.topArt} 
                  alt={artist.name} 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold text-cyan-300">{artist.name}</h3>
              <p className="text-green-300 font-medium">{artist.earnings} earned</p>
              <p className="text-gray-200">{artist.followers} followers</p>
              <button className="mt-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white text-sm font-medium py-2 px-4 rounded transition-all">
                View Profile
              </button>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-lg transition-all">
            View All Artists
          </button>
        </div>
      </div>
    </section>
  );
};

export default ArtistShowcase;