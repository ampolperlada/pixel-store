'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  // Sample featured pixel art data
  const featuredArt = [
    { id: 1, title: 'Neo Ronin', artist: 'PixelMaster', price: '0.05 ETH', image: '/api/placeholder/300/300', gameReady: true },
    { id: 2, title: 'Cyber Samurai', artist: 'RetroArtist', price: '0.08 ETH', image: '/api/placeholder/300/300', gameReady: true },
    { id: 3, title: 'Glitch Ninja', artist: 'VoxelQueen', price: '0.03 ETH', image: '/api/placeholder/300/300', gameReady: false },
    { id: 4, title: 'Cyber Zombie', artist: 'ByteCrafter', price: '0.07 ETH', image: '/api/placeholder/300/300', gameReady: true },
    { id: 5, title: 'Cyber Shogun', artist: 'ByteCrafter', price: '0.07 ETH', image: '/api/placeholder/300/300', gameReady: true },
    { id: 6, title: 'Mecha Ronin', artist: 'ByteCrafter', price: '0.07 ETH', image: '/api/placeholder/300/300', gameReady: false },
    { id: 7, title: 'Neon Oni', artist: 'ByteCrafter', price: '0.07 ETH', image: '/api/placeholder/300/300', gameReady: true },
    { id: 8, title: 'Digital Creator', artist: 'ByteCrafter', price: '0.07 ETH', image: '/api/placeholder/300/300', gameReady: true },
    { id: 9, title: 'Shadow Hacker', artist: 'ByteCrafter', price: '0.07 ETH', image: '/api/placeholder/300/300', gameReady: true },
  ];

  // Featured games that integrate with the marketplace
  const featuredGames = [
    { id: 1, title: 'Pixel Legends', image: '/api/placeholder/600/300', description: 'Battle RPG using collectible pixel characters', assetTypes: ['Characters', 'Weapons'] },
    { id: 2, title: 'Crypto Worlds', image: '/api/placeholder/600/300', description: 'Build your own metaverse with ownable pixel assets', assetTypes: ['Environments', 'Buildings'] },
    { id: 3, title: 'Retro Racers', image: '/api/placeholder/600/300', description: 'Racing game with customizable pixel vehicles', assetTypes: ['Vehicles', 'Tracks'] },
  ];

  // For carousel functionality
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('marketplace');
  
  // Auto-sliding functionality with looping
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // Create smooth looping effect
        if (prevIndex >= featuredArt.length - 4) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 3000); // Change slide every 3 seconds
    
    return () => clearInterval(interval);
  }, [featuredArt.length]);

  // Duplicate the items to create the infinite effect
  const displayItems = [...featuredArt, ...featuredArt.slice(0, 4)];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section with Pixel Art Styling */}
      <section className="relative h-96 overflow-hidden border-b-4 border-pink-500 border-dotted">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900 opacity-70"></div>
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-20">
          {/* This creates a pixel grid effect in the background */}
          {Array(144).fill(0).map((_, i) => (
            <div key={i} className="border border-blue-500/20"></div>
          ))}
        </div>
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 pixel-font">
            PIXEL MARKETPLACE
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-cyan-300 font-mono">Create • Collect • Play</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/shop" className="px-6 py-3 bg-pink-600 text-white font-bold hover:bg-pink-700 transition-all border-2 border-pink-400 shadow-lg shadow-pink-500/50">
              EXPLORE ART
            </Link>
            <Link href="/creator-studio" className="px-6 py-3 bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all border-2 border-purple-400 shadow-lg shadow-purple-500/50">
              CREATE PIXEL ART
            </Link>
            <Link href="/games" className="px-6 py-3 bg-transparent text-cyan-300 font-bold hover:text-cyan-100 transition-all border-2 border-cyan-500 shadow-lg shadow-cyan-500/30">
              GAMES INTEGRATION
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Pixel Art Auto-Sliding Carousel */}
      <section className="py-12 px-4 md:px-8">
        <h2 className="text-3xl font-bold mb-8 text-cyan-300 border-b-2 border-cyan-500 pb-2 inline-block font-mono">FEATURED ARTWORK</h2>
        
        {/* Fixed Carousel with 4 visible cards */}
        <div className="max-w-6xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 25}%)` }}
            >
              {displayItems.map((art, index) => (
                <div key={`${art.id}-${index}`} className="w-1/4 px-2 flex-shrink-0">
                  <div className="bg-gray-900 border-2 border-purple-500 hover:border-pink-500 transition-all p-3 group">
                    <div className="relative aspect-square mb-2 overflow-hidden">
                      <img 
                        src={art.image} 
                        alt={art.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-pink-400 font-bold text-sm">{art.price}</p>
                      </div>
                      {art.gameReady && (
                        <div className="absolute top-2 right-2 bg-cyan-600 text-xs px-2 py-1 rounded-full text-white">
                          Game Ready
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white truncate">{art.title}</h3>
                    <p className="text-cyan-400 text-xs">by {art.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Indicator Dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {featuredArt.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  (currentIndex % featuredArt.length) === index ? 'bg-pink-500' : 'bg-gray-600'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/shop" className="px-6 py-3 bg-purple-700 text-white font-bold hover:bg-purple-800 transition-all border-2 border-purple-500 inline-block">
            VIEW ALL ARTWORK
          </Link>
        </div>
      </section>

      {/* Features Tabs Section */}
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
          {activeTab === 'marketplace' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-900 p-6 border-l-4 border-pink-500">
                <div className="text-pink-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">NFT Integration</h3>
                <p className="text-gray-300">Secure ownership with blockchain technology. Earn royalties on secondary sales.</p>
              </div>
              
              <div className="bg-gray-900 p-6 border-l-4 border-purple-500">
                <div className="text-purple-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Exclusive Collections</h3>
                <p className="text-gray-300">Limited edition drops and collections from top pixel artists around the world.</p>
              </div>
              
              <div className="bg-gray-900 p-6 border-l-4 border-cyan-500">
                <div className="text-cyan-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Community Trading</h3>
                <p className="text-gray-300">Trade pixel art with other collectors. Join events and earn exclusive rewards.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'creator' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-900 p-6 border-l-4 border-pink-500">
                <div className="text-pink-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Pixel Editor</h3>
                <p className="text-gray-300">Powerful in-browser editor with advanced tools for creating game-ready pixel art.</p>
              </div>
              
              <div className="bg-gray-900 p-6 border-l-4 border-purple-500">
                <div className="text-purple-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Animation Tools</h3>
                <p className="text-gray-300">Create sprite sheets and animations for your game characters and assets.</p>
              </div>
              
              <div className="bg-gray-900 p-6 border-l-4 border-cyan-500">
                <div className="text-cyan-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Templates & Packs</h3>
                <p className="text-gray-300">Start with pre-built templates or asset packs to accelerate your creation process.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'games' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-gray-900 p-6 border-l-4 border-pink-500">
                  <div className="text-pink-500 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Developer SDK</h3>
                  <p className="text-gray-300">Integration toolkit for game developers to connect with the marketplace.</p>
                </div>
                
                <div className="bg-gray-900 p-6 border-l-4 border-purple-500">
                  <div className="text-purple-500 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Asset Previewer</h3>
                  <p className="text-gray-300">Preview how your pixel art will look and function within supported games.</p>
                </div>
                
                <div className="bg-gray-900 p-6 border-l-4 border-cyan-500">
                  <div className="text-cyan-500 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Cross-Game Support</h3>
                  <p className="text-gray-300">Use your purchased pixel art across multiple supported games and platforms.</p>
                </div>
              </div>
              
              {/* Featured Games */}
              <h3 className="text-2xl font-bold mb-6 text-white">Featured Games</h3>
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
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 px-4 md:px-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-pink-500 mb-2">5,000+</div>
              <p className="text-gray-300">Pixel Assets</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-500 mb-2">120+</div>
              <p className="text-gray-300">Artists</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-cyan-500 mb-2">25+</div>
              <p className="text-gray-300">Game Integrations</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-500 mb-2">12,500+</div>
              <p className="text-gray-300">Community Members</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 text-center bg-gradient-to-r from-pink-900/50 to-purple-900/50">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white font-mono">JOIN THE PIXEL REVOLUTION</h2>
        <p className="text-xl text-cyan-300 mb-8 max-w-2xl mx-auto">Sign up today and get exclusive access to limited edition pixel art drops, game integrations, and creator tools.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold hover:from-pink-700 hover:to-purple-700 transition-all border-2 border-pink-400 shadow-lg shadow-pink-500/30 uppercase tracking-wider">
            Sign Up Now
          </button>
          <button className="px-8 py-4 bg-transparent text-white font-bold hover:text-cyan-300 transition-all border-2 border-cyan-500 shadow-lg shadow-cyan-500/20 uppercase tracking-wider">
            Learn More
          </button>
        </div>
      </section>
    </main>
  );
}