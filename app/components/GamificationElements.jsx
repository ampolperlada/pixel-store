// components/GamificationElements.jsx
import React from 'react';

// Mock data for trending styles
const trendingStyles = [
  { id: 1, name: "Cyberpunk", heatIndex: 98, growth: "+12%" },
  { id: 2, name: "Fantasy RPG", heatIndex: 85, growth: "+7%" },
  { id: 3, name: "Retro 8-Bit", heatIndex: 92, growth: "+15%" },
  { id: 4, name: "Vaporwave", heatIndex: 76, growth: "+5%" },
  { id: 5, name: "Isometric", heatIndex: 82, growth: "+9%" },
  { id: 6, name: "Roguelike", heatIndex: 79, growth: "+6%" },
];

// Mock data for achievements
const achievements = [
  { id: 1, name: "Pixel Pioneer", desc: "First artwork uploaded", icon: "🎨", unlocked: true },
  { id: 2, name: "Game Ready", desc: "Art used in a game", icon: "🎮", unlocked: true },
  { id: 3, name: "Trending Artist", desc: "Featured on homepage", icon: "🌟", unlocked: false },
  { id: 4, name: "Collaboration King", desc: "Join 5 collabs", icon: "👥", unlocked: false },
];

// Mock data for marketplace stats
const marketplaceStats = [
  { id: 1, label: "Artworks Sold", value: "12,450", change: "+14% this month", positive: true },
  { id: 2, label: "New Artists", value: "326", change: "+8% this month", positive: true },
  { id: 3, label: "Avg. Sale Price", value: "$75", change: "+5% this month", positive: true },
  { id: 4, label: "Game Integrations", value: "95", change: "+19% this month", positive: true },
];

const GamificationElements = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Pixel Marketplace Trends</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trending Styles Heat Map */}
          <div className="bg-gray-900 bg-opacity-70 rounded-lg p-5">
            <h3 className="text-xl text-pink-500 font-bold mb-4 flex items-center">
              <span className="mr-2">🔥</span> Trending Art Styles
            </h3>
            <div className="space-y-3">
              {trendingStyles.map(style => {
                // Calculate color based on heat index
                const r = Math.floor(255 * (style.heatIndex / 100));
                const g = Math.floor(100 * ((100 - style.heatIndex) / 100));
                const b = 255 - r;
                
                return (
                  <div key={style.id} className="bg-gray-800 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{style.name}</span>
                      <span className="text-green-400 text-sm">{style.growth}</span>
                    </div>
                    <div className="mt-2 h-2 w-full bg-gray-700 rounded-full">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${style.heatIndex}%`,
                          background: `linear-gradient(90deg, rgb(${r}, ${g}, ${b}), rgb(${r-20}, ${g}, ${b+50}))`
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="mt-4 w-full py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium hover:from-red-600 hover:to-pink-600 transition-colors">
              Explore Trending Styles
            </button>
          </div>
          
          {/* Achievement Badges */}
          <div className="bg-gray-900 bg-opacity-70 rounded-lg p-5">
            <h3 className="text-xl text-purple-500 font-bold mb-4 flex items-center">
              <span className="mr-2">🏆</span> Creator Achievements
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`rounded-lg p-3 flex flex-col items-center text-center ${
                    achievement.unlocked ? 'bg-gradient-to-br from-purple-600 to-indigo-700' : 'bg-gray-800 opacity-70'
                  }`}
                >
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <h4 className="font-medium text-white">{achievement.name}</h4>
                  <p className="text-xs text-gray-300">{achievement.desc}</p>
                  <div className={`mt-2 text-xs px-2 py-1 rounded-full ${
                    achievement.unlocked ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {achievement.unlocked ? 'Unlocked' : 'Locked'}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 transition-colors">
              View All Achievements
            </button>
          </div>
          
          {/* Marketplace Statistics */}
          <div className="bg-gray-900 bg-opacity-70 rounded-lg p-5">
            <h3 className="text-xl text-cyan-500 font-bold mb-4 flex items-center">
              <span className="mr-2">📊</span> Marketplace Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {marketplaceStats.map(stat => (
                <div key={stat.id} className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <h4 className="text-2xl font-bold text-white">{stat.value}</h4>
                  <p className={`text-xs ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-gray-800 rounded-lg p-3">
              <h4 className="text-white font-medium mb-2">Weekly Trading Volume</h4>
              <div className="h-20 flex items-end space-x-1">
                {[35, 45, 55, 40, 60, 75, 65].map((height, index) => (
                  <div 
                    key={index} 
                    className="flex-1 bg-gradient-to-t from-cyan-600 to-blue-400 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamificationElements;