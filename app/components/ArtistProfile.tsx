import React, { useState } from 'react';
import { Star, Heart, Eye, Share2, MessageCircle, Calendar, MapPin, Award, TrendingUp, Users } from 'lucide-react';


interface ArtistProfileProps {
  artistName?: string;
  specialization?: string;
  earned?: number;
  followers?: number;
  rating?: number;
  sales?: number;
}

interface PortfolioItem {
  id: number;
  title: string;
  image: string;
  price: number;
  likes: number;
  views: number;
  category: string;
}

const ArtistProfile: React.FC<ArtistProfileProps> = ({
  artistName = "PixelMaster",
  specialization = "Character Design",
  earned = 12450,
  followers = 1250,
  rating = 4.9,
  sales = 28
}) => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [isFollowing, setIsFollowing] = useState(false);

  const portfolioItems: PortfolioItem[] = [
    { id: 1, title: "Cyberpunk Warrior", image: "/api/placeholder/300/300", price: 0.5, likes: 124, views: 1250, category: "Character" },
    { id: 2, title: "Pixel Dragon", image: "/api/placeholder/300/300", price: 0.8, likes: 89, views: 890, category: "Creature" },
    { id: 3, title: "Space Explorer", image: "/api/placeholder/300/300", price: 0.6, likes: 156, views: 1450, category: "Character" },
    { id: 4, title: "Medieval Knight", image: "/api/placeholder/300/300", price: 0.7, likes: 203, views: 1850, category: "Character" },
    { id: 5, title: "Neon City", image: "/api/placeholder/300/300", price: 1.2, likes: 78, views: 720, category: "Environment" },
    { id: 6, title: "Robot Guardian", image: "/api/placeholder/300/300", price: 0.9, likes: 167, views: 1320, category: "Character" },
  ];

  const achievements = [
    { title: "Top Seller", description: "Ranked #1 this month", icon: <Award className="w-5 h-5" /> },
    { title: "Featured Artist", description: "Selected by community", icon: <Star className="w-5 h-5" /> },
    { title: "Rising Star", description: "Fast growing creator", icon: <TrendingUp className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800/50 backdrop-blur-md border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🎨</span>
            </div>
            <span className="text-xl font-bold text-white">PIXEL MARKETPLACE</span>
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors">Explore</button>
            <button className="text-gray-300 hover:text-white transition-colors">Create</button>
            <button className="text-gray-300 hover:text-white transition-colors">Games</button>
            <button className="text-gray-300 hover:text-white transition-colors">Learn</button>
            <button className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-lg text-white font-medium transition-colors">
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 p-1">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">{artistName.charAt(0)}</span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-grow text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{artistName}</h1>
                <div className="flex space-x-1">
                  <span className="bg-purple-500 px-2 py-1 rounded-full text-xs text-white">Top Seller</span>
                  <span className="bg-blue-500 px-2 py-1 rounded-full text-xs text-white">Featured Artist</span>
                </div>
              </div>
              <p className="text-gray-300 text-lg mb-4">{specialization}</p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">${earned.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Earned</div>
                  <div className="text-xs text-green-400">+15%</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{followers.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold text-white">{rating}</span>
                  </div>
                  <div className="text-sm text-gray-400">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{sales}</div>
                  <div className="text-sm text-gray-400">Sales</div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-300 mb-6 max-w-2xl">
                Passionate pixel artist specializing in character design and game assets. 
                Creating unique digital art that brings stories to life, one pixel at a time.
              </p>

              {/* Location & Join Date */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-400 mb-6">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined March 2023</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  isFollowing
                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors">
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Message
              </button>
              <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors">
                <Share2 className="w-4 h-4 inline mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {achievements.map((achievement, index) => (
            <div key={index} className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-md rounded-xl border border-white/10 p-4">
              <div className="flex items-center space-x-3">
                <div className="text-yellow-400">{achievement.icon}</div>
                <div>
                  <div className="font-semibold text-white">{achievement.title}</div>
                  <div className="text-sm text-gray-400">{achievement.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-white/10">
          {['portfolio', 'reviews', 'activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        {activeTab === 'portfolio' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="group bg-slate-800/50 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:border-cyan-400/50 transition-all duration-300 hover:scale-105"
              >
                <div className="relative aspect-square bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl">
                    🎨
                  </div>
                  <div className="absolute top-3 right-3 bg-black/50 rounded-lg px-2 py-1">
                    <span className="text-green-400 font-semibold">{item.price} ETH</span>
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                    <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                      <Heart className="w-5 h-5 text-white" />
                    </button>
                    <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                      <Eye className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span className="bg-purple-500/20 px-2 py-1 rounded text-purple-300">
                      {item.category}
                    </span>
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{item.likes}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{item.views}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((review) => (
              <div key={review} className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-white/10 p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">U</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-semibold text-white">User{review}</span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">2 days ago</span>
                    </div>
                    <p className="text-gray-300">
                      Amazing work! The attention to detail is incredible and the delivery was super fast. 
                      Highly recommend working with this artist.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((activity) => (
              <div key={activity} className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-white/10 p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-white">
                      <span className="font-semibold">Created new artwork</span>
                      <span className="text-gray-400"> - "Cyberpunk Warrior"</span>
                    </p>
                    <p className="text-sm text-gray-400">3 hours ago</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistProfile;