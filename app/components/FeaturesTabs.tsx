"use client";
import React, { useState } from "react";
import { GameItem } from "../data/sampleData"; // Adjust the import path as needed

// Marketplace Content
const MarketplaceContent = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* NFT Integration */}
    <div className="bg-gray-900 p-6 border-l-4 border-pink-500 hover:scale-105 transition-transform">
      <div className="text-pink-500 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">NFT Integration</h3>
      <p className="text-gray-300">
        Secure ownership with blockchain technology. Earn royalties on secondary sales.
      </p>
    </div>

    {/* Exclusive Collections */}
    <div className="bg-gray-900 p-6 border-l-4 border-purple-500 hover:scale-105 transition-transform">
      <div className="text-purple-500 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Exclusive Collections</h3>
      <p className="text-gray-300">
        Limited edition drops and collections from top pixel artists around the world.
      </p>
    </div>

    {/* Community Trading */}
    <div className="bg-gray-900 p-6 border-l-4 border-cyan-500 hover:scale-105 transition-transform">
      <div className="text-cyan-500 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Community Trading</h3>
      <p className="text-gray-300">
        Trade pixel art with other collectors. Join events and earn exclusive rewards.
      </p>
    </div>
  </div>
);

// Creator Studio Content
const CreatorContent = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Pixel Editor */}
    <div className="bg-gray-900 p-6 border-l-4 border-pink-500 hover:scale-105 transition-transform">
      <div className="text-pink-500 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Pixel Editor</h3>
      <p className="text-gray-300">
        Powerful in-browser editor with advanced tools for creating game-ready pixel art.
      </p>
    </div>

    {/* Animation Tools */}
    <div className="bg-gray-900 p-6 border-l-4 border-purple-500 hover:scale-105 transition-transform">
      <div className="text-purple-500 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Animation Tools</h3>
      <p className="text-gray-300">
        Create sprite sheets and animations for your game characters and assets.
      </p>
    </div>

    {/* Templates & Packs */}
    <div className="bg-gray-900 p-6 border-l-4 border-cyan-500 hover:scale-105 transition-transform">
      <div className="text-cyan-500 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Templates & Packs</h3>
      <p className="text-gray-300">
        Start with pre-built templates or asset packs to accelerate your creation process.
      </p>
    </div>
  </div>
);

// Game Integration Content
interface GamesContentProps {
  featuredGames: GameItem[];
}

const GamesContent = ({ featuredGames = [] }: GamesContentProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Developer SDK */}
        <div className="bg-gray-900 p-6 border-l-4 border-pink-500 hover:scale-105 transition-transform">
          <div className="text-pink-500 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Developer SDK</h3>
          <p className="text-gray-300">
            Integration toolkit for game developers to connect with the marketplace.
          </p>
        </div>

        {/* Asset Previewer */}
        <div className="bg-gray-900 p-6 border-l-4 border-purple-500 hover:scale-105 transition-transform">
          <div className="text-purple-500 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Asset Previewer</h3>
          <p className="text-gray-300">
            Preview how your pixel art will look and function within supported games.
          </p>
        </div>

        {/* Cross-Game Support */}
        <div className="bg-gray-900 p-6 border-l-4 border-cyan-500 hover:scale-105 transition-transform">
          <div className="text-cyan-500 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Cross-Game Support</h3>
          <p className="text-gray-300">
            Use your purchased pixel art across multiple supported games and platforms.
          </p>
        </div>
      </div>

      {/* Featured Games */}
      <h3 className="text-2xl font-bold mb-6 text-white">Featured Games</h3>
      {featuredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredGames.map((game) => (
            <div
              key={game.id}
              className="bg-gray-900 border-2 border-cyan-800 overflow-hidden group hover:scale-105 transition-transform"
            >
              <div className="relative h-40">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <h4 className="absolute bottom-2 left-3 text-white font-bold text-lg">
                  {game.title}
                </h4>
              </div>
              <div className="p-4">
                <p className="text-gray-300 text-sm mb-3">{game.description}</p>
                <div className="flex flex-wrap gap-2">
                  {(game.assetTypes || []).map((type, index) => (
                    <span
                      key={index}
                      className="bg-cyan-900 text-cyan-300 text-xs px-2 py-1 rounded-full"
                    >
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
  const [activeTab, setActiveTab] = useState("marketplace");

  return (
    <section className="py-12 px-4 md:px-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-8">
          <button
            className={`py-3 px-5 font-bold ${
              activeTab === "marketplace"
                ? "text-pink-500 border-b-2 border-pink-500"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("marketplace")}
          >
            MARKETPLACE
          </button>
          <button
            className={`py-3 px-5 font-bold ${
              activeTab === "creator"
                ? "text-purple-500 border-b-2 border-purple-500"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("creator")}
          >
            CREATOR STUDIO
          </button>
          <button
            className={`py-3 px-5 font-bold ${
              activeTab === "games"
                ? "text-cyan-500 border-b-2 border-cyan-500"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("games")}
          >
            GAME INTEGRATION
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "marketplace" && <MarketplaceContent />}
        {activeTab === "creator" && <CreatorContent />}
        {activeTab === "games" && <GamesContent featuredGames={featuredGames} />}
      </div>
    </section>
  );
}