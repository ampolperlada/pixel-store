// components/FeaturesTabs.tsx
"use client";
import React, { useState } from 'react';
import { GameItem } from '../data/sampleData'; // Adjust the import path as needed

// Create subcomponents for each tab content
const MarketplaceContent = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Marketplace content */}
  </div>
);

const CreatorContent = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Creator content */}
  </div>
);

interface GamesContentProps {
  featuredGames: GameItem[];
}

const GamesContent = ({ featuredGames = [] }: GamesContentProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Games content */}
      </div>
      
      {/* Featured Games */}
      <h3 className="text-2xl font-bold mb-6 text-white">Featured Games</h3>
      {featuredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredGames.map(game => (
            <div key={game.id} className="bg-gray-900 border-2 border-cyan-800 overflow-hidden group">
              <div className="relative h-40">
                <img src={game.image} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <h4 className="absolute bottom-2 left-3 text-white font-bold text-lg">{game.title}</h4>
              </div>
              <div className="p-4">
                <p className="text-gray-300 text-sm mb-3">{game.description}</p>
                <div className="flex flex-wrap gap-2">
                  {game.assetTypes.map((type, index) => (
                    <span key={index} className="bg-cyan-900 text-cyan-300 text-xs px-2 py-1 rounded-full">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          No featured games available at the moment.
        </div>
      )}
    </div>
  );
};

interface FeaturesTabsProps {
  featuredGames?: GameItem[];
}

export default function FeaturesTabs({ featuredGames = [] }: FeaturesTabsProps) {
  const [activeTab, setActiveTab] = useState('marketplace');
  
  return (
    <section className="py-12 px-4 md:px-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-8">
          <button 
            className={`py-3 px-5 font-bold ${activeTab === 'marketplace' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('marketplace')}
          >
            MARKETPLACE
          </button>
          <button 
            className={`py-3 px-5 font-bold ${activeTab === 'creator' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('creator')}
          >
            CREATOR STUDIO
          </button>
          <button 
            className={`py-3 px-5 font-bold ${activeTab === 'games' ? 'text-cyan-500 border-b-2 border-cyan-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('games')}
          >
            GAME INTEGRATION
          </button>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'marketplace' && <MarketplaceContent />}
        {activeTab === 'creator' && <CreatorContent />}
        {activeTab === 'games' && <GamesContent featuredGames={featuredGames} />}
      </div>
    </section>
  );
}