import React, { useState } from 'react';
import { Heart, Eye, Star, TrendingUp, Award, Download, Users } from 'lucide-react';

const EnhancedTopArtists = () => {
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'detailed'
  const [sortBy, setSortBy] = useState('earnings');
  const [timeFilter, setTimeFilter] = useState('month');

  const artists = [
    {
      id: 1,
      name: "PixelMaster",
      initials: "PM",
      color: "bg-cyan-500",
      earnings: "$12,450",
      numericEarnings: 12450,
      followers: 1250,
      artworks: 45,
      downloads: 2840,
      rating: 4.9,
      specialty: "Character Design",
      joinDate: "Jan 2024",
      recentSales: 28,
      topGame: "Cyber Quest 2099",
      badges: ["Top Seller", "Featured Artist"],
      trend: "+15%",
      portfolio: ["#F87171","#FBBF24","#34D399","#60A5FA"], // colors instead of images
      stats: { thisMonth: 28, lastMonth: 24, avgRating: 4.9, totalViews: 15420 }
    },
    {
      id: 2,
      name: "BitCreator",
      initials: "BC",
      color: "bg-purple-500",
      earnings: "$8,320",
      numericEarnings: 8320,
      followers: 980,
      artworks: 32,
      downloads: 1950,
      rating: 4.7,
      specialty: "Environment Art",
      joinDate: "Mar 2024",
      recentSales: 19,
      topGame: "Pixel Warriors",
      badges: ["Rising Star"],
      trend: "+22%",
      portfolio: ["#FBBF24","#F472B6","#60A5FA","#34D399"],
      stats: { thisMonth: 19, lastMonth: 15, avgRating: 4.7, totalViews: 8960 }
    },
    {
      id: 3,
      name: "PixelPro",
      initials: "PP",
      color: "bg-pink-500",
      earnings: "$9,650",
      numericEarnings: 9650,
      followers: 1120,
      artworks: 38,
      downloads: 2200,
      rating: 4.8,
      specialty: "UI/UX Elements",
      joinDate: "Feb 2024",
      recentSales: 24,
      topGame: "Dungeon Masters",
      badges: ["Quality Creator"],
      trend: "+8%",
      portfolio: ["#34D399","#F87171","#60A5FA","#FBBF24"],
      stats: { thisMonth: 24, lastMonth: 22, avgRating: 4.8, totalViews: 12340 }
    }
  ];

  const sortedArtists = [...artists].sort((a, b) => {
    switch(sortBy) {
      case 'earnings': return b.numericEarnings - a.numericEarnings;
      case 'followers': return b.followers - a.followers;
      case 'rating': return b.rating - a.rating;
      case 'sales': return b.recentSales - a.recentSales;
      default: return 0;
    }
  });

  return (
    <section className="py-12 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4">
        {/* Header with Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-2">
              Top Earning Artists
            </h2>
            <p className="text-gray-300">Discover the most successful creators on our platform</p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-cyan-400 focus:outline-none"
            >
              <option value="earnings">Sort by Earnings</option>
              <option value="followers">Sort by Followers</option>
              <option value="rating">Sort by Rating</option>
              <option value="sales">Sort by Recent Sales</option>
            </select>

            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-cyan-400 focus:outline-none"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>

            <div className="flex bg-gray-800 rounded-lg border border-gray-600">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-l-lg transition-all ${viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:text-white'}`}
              >Grid</button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-4 py-2 rounded-r-lg transition-all ${viewMode === 'detailed' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:text-white'}`}
              >Detailed</button>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-3 gap-8">
            {sortedArtists.map((artist, index) => (
              <div
                key={artist.id}
                className="group bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                {/* Rank & Badges */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' :
                    index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-black' :
                    index === 2 ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white' :
                    'bg-gray-700 text-white'
                  }`}>
                    #{index + 1}
                  </div>
                  <div className="flex gap-1">
                    {artist.badges.map((badge, i) => (
                      <span key={i} className="px-2 py-1 bg-purple-600 text-xs rounded-full">{badge}</span>
                    ))}
                  </div>
                </div>

                {/* Artist Info */}
                <div className="text-center mb-4">
                  <div className={`mx-auto w-20 h-20 mb-3 flex items-center justify-center rounded-full text-xl font-bold text-white ${artist.color}`}>
                    {artist.initials}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{artist.name}</h3>
                  <p className="text-cyan-300 text-sm">{artist.specialty}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-400">{artist.earnings}</div>
                    <div className="text-xs text-gray-400">Earned</div>
                    <div className="text-xs text-green-400">{artist.trend}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-400">{artist.followers}</div>
                    <div className="text-xs text-gray-400">Followers</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center text-yellow-400">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span className="font-bold">{artist.rating}</span>
                    </div>
                    <div className="text-xs text-gray-400">Rating</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-400">{artist.recentSales}</div>
                    <div className="text-xs text-gray-400">Sales</div>
                  </div>
                </div>

                {/* Portfolio Preview (Colored Blocks) */}
                <div className="grid grid-cols-4 gap-1 mb-4">
                  {artist.portfolio.map((color, i) => (
                    <div
                      key={i}
                      className={`w-full h-12 rounded opacity-80 hover:opacity-100 transition-transform cursor-pointer ${color}`}
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all font-medium">
                    Follow
                  </button>
                  <button
                    onClick={() => setSelectedArtist(artist)}
                    className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-white">Detailed View Not Implemented in This Example</div>
        )}
      </div>
    </section>
  );
};

export default EnhancedTopArtists;
