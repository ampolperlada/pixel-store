import React from 'react';
import Link from 'next/link';

const ArtistShowcase = () => {
  const featuredArtists = [
    { 
      id: 1,
      name: "PixelMaster", 
      specialty: "Character Design",
      earnings: "$12,450", 
      change: "+15%",
      followers: 1250,
      rating: 4.9,
      sales: 28,
      badges: ["Top Seller", "Featured Artist"],
      initials: "PM",
      color: "from-pink-500 to-purple-500"
    },
    { 
      id: 2,
      name: "PixelPro", 
      specialty: "UI/UX Elements",
      earnings: "$9,650", 
      change: "+8%",
      followers: 1120,
      rating: 4.8,
      sales: 24,
      badges: ["Quality Creator"],
      initials: "PP",
      color: "from-cyan-500 to-blue-500"
    },
    { 
      id: 3,
      name: "BitCreator", 
      specialty: "Environment Art",
      earnings: "$8,320", 
      change: "+22%",
      followers: 980,
      rating: 4.7,
      sales: 19,
      badges: ["Rising Star"],
      initials: "BC",
      color: "from-purple-500 to-pink-500"
    }
  ];
  
  return (
    <section className="py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Top Earning Artists
          </h2>
          <p className="text-gray-300">
            Discover the most successful creators on our platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredArtists.map((artist, index) => (
            <div 
              key={artist.id} 
              className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/10"
            >
              {/* Artist Avatar/Header */}
              <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${artist.color} flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
                  {artist.initials}
                </div>
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold">
                  #{index + 1}
                </div>
                <div className="absolute top-4 right-4 flex flex-col gap-1">
                  {artist.badges.map((badge, idx) => (
                    <span key={idx} className="bg-yellow-500/20 backdrop-blur-sm text-yellow-300 px-2 py-1 rounded-full text-xs border border-yellow-500/30">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Artist Info */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-white">{artist.name}</h3>
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm mb-4">{artist.specialty}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-2xl font-bold text-emerald-400">{artist.earnings}</div>
                    <div className="text-xs text-gray-400">Earned</div>
                    <div className="text-green-400 text-xs font-semibold">{artist.change}</div>
                  </div>
                  
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">{artist.followers}</div>
                    <div className="text-xs text-gray-400">Followers</div>
                  </div>
                  
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-2xl font-bold text-yellow-400">{artist.rating}</div>
                    <div className="text-xs text-gray-400">Rating</div>
                  </div>
                  
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-2xl font-bold text-cyan-400">{artist.sales}</div>
                    <div className="text-xs text-gray-400">Sales</div>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/artists"
            className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:translate-y-px"
          >
            View All Artists
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArtistShowcase;