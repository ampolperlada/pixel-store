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
      topArt: "/images/artist/Artist 1.png"
    },
    { 
      id: 2,
      name: "BitCreator", 
      earnings: "$8,320", 
      followers: 980,
      topArt: "/images/artist/Artist 2.png"
    },
    { 
      id: 3,
      name: "PixelPro", 
      earnings: "$9,650", 
      followers: 1120,
      topArt: "/images/artist/Artist 3.png"
    }
  ];
  
  return (
    <section className="py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl font-bold text-center text-white mb-12 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-pink-300">
            Top Earning Artists
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredArtists.map((artist) => (
            <div 
              key={artist.id} 
              className="bg-gradient-to-br from-indigo-800/60 to-purple-800/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/10"
            >
              <div className="relative w-full h-64">
                <Image 
                  src={artist.topArt} 
                  alt={artist.name} 
                  layout="fill" 
                  objectFit="cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
              
              <div className="p-6 relative -mt-12">
                <div className="bg-gradient-to-r from-indigo-600/70 to-purple-600/70 backdrop-blur-md rounded-lg p-4 border border-white/20 shadow-lg">
                  <h3 className="text-2xl font-bold text-white mb-1">{artist.name}</h3>
                  <p className="text-emerald-300 font-medium text-lg mb-1">{artist.earnings} earned</p>
                  <div className="flex items-center text-gray-300 mb-4">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                    </svg>
                    <span>{artist.followers.toLocaleString()} followers</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:translate-y-px focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:translate-y-px focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50">
            View All Artists
          </button>
        </div>
      </div>
    </section>
  );
};

export default ArtistShowcase;