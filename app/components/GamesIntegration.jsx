'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Slider from 'react-slick'; // For sliders
import 'slick-carousel/slick/slick.css'; // Slider CSS
import 'slick-carousel/slick/slick-theme.css'; // Slider theme CSS

export default function GamesIntegration() {
  const [hoveredGame, setHoveredGame] = useState(null);

  // Slider settings for game assets
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Sample game assets data
  const gameAssets = [
    { id: 1, name: 'Cyber Samurai', image: '/images/CyberSamurai.png', category: 'Characters' },
    { id: 2, name: 'Axe Girl', image: '/images/AxeGirl.png', category: 'Characters' },
    { id: 3, name: 'Pixel Dungeon', image: '/images/Dungeon.png', category: 'Environment' },
    { id: 4, name: 'Neon UI Kit', image: '/images/NeonUI.png', category: 'UI Elements' },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 pixel-font">
          GAME INTEGRATION
        </h1>

        {/* Subheading */}
        <p className="text-xl text-center mb-12 text-cyan-300 font-mono">
          Bring your pixel art to life in games with seamless integration. 🎮✨
        </p>

        {/* Playable Pixel Art Games */}
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-purple-500 shadow-lg shadow-purple-500/30 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">🎮 Playable Pixel Art Games</h2>
          <p className="text-gray-300 mb-4">
            Add mini browser games directly into the site. Use HTML5 + JavaScript (Phaser.js or Three.js) for interactive retro games.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Pixel Art Game Assets Hub */}
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-pink-500 shadow-lg shadow-pink-500/30 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-pink-400">🖼️ Pixel Art Game Assets Hub</h2>
          <p className="text-gray-300 mb-4">
            Provide free or paid pixel art assets for indie game developers.
          </p>
          <Slider {...sliderSettings}>
            {gameAssets.map((asset) => (
              <div key={asset.id} className="px-2">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <img
                    src={asset.image}
                    alt={asset.name}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-bold text-white">{asset.name}</h3>
                  <p className="text-gray-300">{asset.category}</p>
                  <button className="mt-2 px-4 py-2 bg-pink-600 text-white font-bold rounded hover:bg-pink-700">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* User Submissions */}
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-cyan-500 shadow-lg shadow-cyan-500/30 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">📤 User Submissions</h2>
          <p className="text-gray-300 mb-4">
            Submit your pixel art assets or game prototypes for feedback and showcase.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://itch.io"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-purple-600 text-white font-bold rounded hover:bg-purple-700"
            >
              Submit via Itch.io
            </a>
            <a
              href="https://discord.gg/your-invite-link"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
            >
              Join Discord for Feedback
            </a>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Link
            href="/games"
            className="px-6 py-3 bg-cyan-600 text-white font-bold rounded hover:bg-cyan-700"
          >
            Explore Game Integrations
          </Link>
        </div>
      </div>
    </section>
  );
}