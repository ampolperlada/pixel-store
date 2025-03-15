'use client';
import React from 'react';
import Link from 'next/link';

export default function GamesIntegration() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 pixel-font">
          GAMES INTEGRATION
        </h1>

        {/* Subheading */}
        <p className="text-xl text-center mb-12 text-cyan-300 font-mono">
          Bring your pixel art to life in games with seamless integration.
        </p>

        {/* Features Section */}
        <div className="space-y-8 max-w-2xl mx-auto">
          {/* Asset Library */}
          <div>
            <h2 className="text-2xl font-bold mb-2 text-purple-400">Asset Library</h2>
            <p className="text-gray-300">
              Access a vast library of pixel art assets for game development.
            </p>
          </div>

          {/* NFT Integration */}
          <div>
            <h2 className="text-2xl font-bold mb-2 text-pink-400">NFT Integration</h2>
            <p className="text-gray-300">
              Use your pixel art NFTs as in-game assets.
            </p>
          </div>

          {/* Developer Tools */}
          <div>
            <h2 className="text-2xl font-bold mb-2 text-cyan-400">Developer Tools</h2>
            <p className="text-gray-300">
              Integrate assets with APIs and plugins for Unity/Unreal.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Link
            href="/games"
            className="px-6 py-3 bg-cyan-600 text-white font-bold hover:bg-cyan-700 transition-all border-2 border-cyan-400 shadow-lg shadow-cyan-500/50"
          >
            Explore Game Integrations
          </Link>
        </div>
      </div>
    </section>
  );
}