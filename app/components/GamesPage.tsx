import React, { useState } from 'react';
import PixelPlatformer from '../components/PixelPlatformer';
import PixelClicker from '../components/PixelClicker';

const GamesPage = () => {
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      {/* Playable Pixel Art Games Section */}
      <div className="bg-gray-800 p-6 rounded-lg border-2 border-purple-500 shadow-lg shadow-purple-500/30 mb-12">
        <h2 className="text-2xl font-bold mb-4 text-purple-400">🎮 Playable Pixel Art Games</h2>
        <p className="text-gray-300 mb-4">
          Add mini browser games directly into the site. Use HTML5 + JavaScript (Phaser.js or Three.js) for interactive retro games.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pixel Platformer */}
          <div
            className="relative h-48 bg-gray-700 rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
            onMouseEnter={() => setHoveredGame('platformer')}
            onMouseLeave={() => setHoveredGame(null)}
          >
            <img
              src="/images/PlatformerDemo.png"
              alt="Platformer Demo"
              className="w-full h-full object-cover rounded-lg"
            />
            {hoveredGame === 'platformer' && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
                <button className="px-4 py-2 bg-cyan-600 text-white font-bold rounded hover:bg-cyan-700">
                  Play Now
                </button>
              </div>
            )}
          </div>

          {/* Pixel Clicker */}
          <div
            className="relative h-48 bg-gray-700 rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
            onMouseEnter={() => setHoveredGame('clicker')}
            onMouseLeave={() => setHoveredGame(null)}
          >
            <img
              src="/images/ClickerDemo.png"
              alt="Clicker Demo"
              className="w-full h-full object-cover rounded-lg"
            />
            {hoveredGame === 'clicker' && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
                <button className="px-4 py-2 bg-cyan-600 text-white font-bold rounded hover:bg-cyan-700">
                  Play Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render the Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-purple-500 shadow-lg shadow-purple-500/30">
          <h3 className="text-xl font-bold mb-4 text-purple-400">Pixel Platformer</h3>
          <PixelPlatformer />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-purple-500 shadow-lg shadow-purple-500/30">
          <h3 className="text-xl font-bold mb-4 text-purple-400">Pixel Clicker</h3>
          <PixelClicker />
        </div>
      </div>
    </div>
  );
};

export default GamesPage;