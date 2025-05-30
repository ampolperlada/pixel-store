import React, { useState, useEffect } from 'react';
import { Heart, Eye, Download, Star, TrendingUp, Award, Calendar, Users } from 'lucide-react';

const EnhancedTopArtists = () => {
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'detailed'
  const [sortBy, setSortBy] = useState('earnings');
  const [timeFilter, setTimeFilter] = useState('month');

  const artists = [
    {
      id: 1,
      name: "PixelMaster",
      avatar: "/api/placeholder/200/200",
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
      portfolio: [
        "/api/placeholder/150/150",
        "/api/placeholder/150/150",
        "/api/placeholder/150/150",
        "/api/placeholder/150/150"
      ],
      stats: {
        thisMonth: 28,
        lastMonth: 24,
        avgRating: 4.9,
        totalViews: 15420
      }
    },
    {
      id: 2,
      name: "BitCreator",
      avatar: "/api/placeholder/200/200",
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
      portfolio: [
        "/api/placeholder/150/150",
        "/api/placeholder/150/150",
        "/api/placeholder/150/150",
        "/api/placeholder/150/150"
      ],
      stats: {
        thisMonth: 19,
        lastMonth: 15,
        avgRating: 4.7,
        totalViews: 8960
      }
    },
    {
      id: 3,
      name: "PixelPro",
      avatar: "/api/placeholder/200/200",
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
      portfolio: [
        "/api/placeholder/150/150",
        "/api/placeholder/150/150",
        "/api/placeholder/150/150",
        "/api/placeholder/150/150"
      ],
      stats: {
        thisMonth: 24,
        lastMonth: 22,
        avgRating: 4.8,
        totalViews: 12340
      }
    }
  ];

  const sortedArtists = [...artists].sort((a, b) => {
    switch(sortBy) {
      case 'earnings':
        return b.numericEarnings - a.numericEarnings;
      case 'followers':
        return b.followers - a.followers;
      case 'rating':
        return b.rating - a.rating;
      case 'sales':
        return b.recentSales - a.recentSales;
      default:
        return 0;
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
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-4 py-2 rounded-r-lg transition-all ${viewMode === 'detailed' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:text-white'}`}
              >
                Detailed
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid md:grid-cols-3 gap-8">
            {sortedArtists.map((artist, index) => (
              <div 
                key={artist.id}
                className="group bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                {/* Rank Badge */}
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
                  <div className="relative mx-auto w-20 h-20 mb-3">
                    <img
                      src={artist.avatar}
                      alt={artist.name}
                      className="w-full h-full rounded-full object-cover border-2 border-cyan-400"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-gray-900 flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
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

                {/* Portfolio Preview */}
                <div className="grid grid-cols-4 gap-1 mb-4">
                  {artist.portfolio.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Portfolio ${i + 1}`}
                      className="w-full h-12 object-cover rounded opacity-80 hover:opacity-100 transition-opacity"
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
          /* Detailed List View */
          <div className="space-y-4">
            {sortedArtists.map((artist, index) => (
              <div key={artist.id} className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className={`px-4 py-2 rounded-full text-lg font-bold ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' :
                      index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-black' :
                      index === 2 ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white' :
                      'bg-gray-700 text-white'
                    }`}>
                      #{index + 1}
                    </div>
                    
                    <img
                      src={artist.avatar}
                      alt={artist.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400"
                    />
                    
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {artist.name}
                        <div className="flex gap-1">
                          {artist.badges.map((badge, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-600 text-xs rounded-full">{badge}</span>
                          ))}
                        </div>
                      </h3>
                      <p className="text-cyan-300">{artist.specialty}</p>
                      <p className="text-gray-400 text-sm">Featured in {artist.topGame}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{artist.earnings}</div>
                      <div className="text-sm text-gray-400">Total Earnings</div>
                      <div className="text-sm text-green-400">{artist.trend}</div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{artist.followers}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{artist.downloads}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span>{artist.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{artist.recentSales} sales</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all font-medium">
                        Follow
                      </button>
                      <button 
                        onClick={() => setSelectedArtist(artist)}
                        className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats Bar */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-green-400">$127K+</h3>
                <p className="text-gray-300">Total Earned by Top 10</p>
              </div>
              <Award className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-blue-400">15K+</h3>
                <p className="text-gray-300">Assets Sold This Month</p>
              </div>
              <Download className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-purple-400">4.8★</h3>
                <p className="text-gray-300">Average Rating</p>
              </div>
              <Star className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-orange-400">89%</h3>
                <p className="text-gray-300">Success Rate</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Join the Top Earners?</h3>
            <p className="text-gray-300 mb-6">Start selling your pixel art today and build your creative empire</p>
            <div className="flex justify-center gap-4">
              <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-8 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all font-medium">
                Start Selling
              </button>
              <button className="border border-cyan-400 text-cyan-400 py-3 px-8 rounded-lg hover:bg-cyan-400 hover:text-black transition-all font-medium">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Artist Detail Modal */}
      {selectedArtist && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSelectedArtist(null)}>
          <div className="bg-gray-900 rounded-2xl p-8 m-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedArtist.avatar}
                  alt={selectedArtist.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400"
                />
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedArtist.name}</h3>
                  <p className="text-cyan-300">{selectedArtist.specialty}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedArtist(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Recent Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">This Month:</span>
                      <span className="text-white">{selectedArtist.stats.thisMonth} sales</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Month:</span>
                      <span className="text-white">{selectedArtist.stats.lastMonth} sales</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Views:</span>
                      <span className="text-white">{selectedArtist.stats.totalViews.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Portfolio Highlights</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedArtist.portfolio.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Portfolio ${i + 1}`}
                        className="w-full h-16 object-cover rounded hover:scale-110 transition-transform cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all font-medium">
                Follow Artist
              </button>
              <button className="flex-1 border border-cyan-400 text-cyan-400 py-3 px-6 rounded-lg hover:bg-cyan-400 hover:text-black transition-all font-medium">
                View Full Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EnhancedTopArtists;