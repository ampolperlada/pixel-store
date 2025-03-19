'use client'; // Add this directive at the top

import React, { useState } from 'react';
import Link from 'next/link';
import Slider from 'react-slick'; // For sliders
import 'slick-carousel/slick/slick.css'; // Slider CSS
import 'slick-carousel/slick/slick-theme.css'; // Slider theme CSS
import PixelPlatformer from '../components/PixelPlatformer'; // Import PixelPlatformer
import PixelClicker from '../components/PixelClicker'; // Import PixelClicker

export default function GamesIntegration() {
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);
  const [activeTutorialTab, setActiveTutorialTab] = useState('unity');
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  // Sample asset pack bundles data
  const assetBundles = [
    { id: 1, name: 'Fantasy Starter Kit', image: '/images/FantasyKit.png', items: 35, price: '$19.99' },
    { id: 2, name: 'Sci-Fi Complete Pack', image: '/images/SciFiKit.png', items: 42, price: '$24.99' },
    { id: 3, name: 'Horror Essentials', image: '/images/HorrorKit.png', items: 28, price: '$17.99' },
    { id: 4, name: 'Cyberpunk Collection', image: '/images/CyberpunkKit.png', items: 40, price: '$22.99' },
  ];

  // Engine integration guide data
  const engineGuides = {
    unity: {
      title: 'Unity Integration',
      content: 'Learn how to import, animate, and optimize pixel art sprites in Unity using the 2D sprite system.',
      steps: [
        'Import your pixel art into Unity project panel',
        'Set the Pixel Per Unit value correctly in the texture import settings',
        'Create animation clips using the Animation window',
        'Use the Sprite Atlas feature to optimize rendering',
      ],
      codeExample: 'public class PixelPerfectCamera : MonoBehaviour {\n  public float pixelsPerUnit = 16;\n  public float pixelScale = 1;\n\n  void Start() {\n    Camera.main.orthographicSize = Screen.height / (pixelsPerUnit * pixelScale * 2);\n  }\n}',
    },
    godot: {
      title: 'Godot Integration',
      content: 'Integrate your pixel art assets into Godot with proper scaling and animation.',
      steps: [
        'Import sprites with "Filter" turned off',
        'Set up AnimatedSprite nodes for frame-by-frame animation',
        'Configure the viewport for pixel-perfect rendering',
        'Use the "snapping" feature to align sprites to the grid',
      ],
      codeExample: 'extends Node2D\n\nfunc _ready():\n    $AnimatedSprite.play("idle")\n\nfunc _process(delta):\n    if Input.is_action_pressed("ui_right"):\n        $AnimatedSprite.play("run")\n    else:\n        $AnimatedSprite.play("idle")',
    },
    gamemaker: {
      title: 'GameMaker Integration',
      content: 'Implement pixel art assets in GameMaker Studio with proper scaling and collision detection.',
      steps: [
        'Import sprites with "Remove Background" unchecked',
        'Set origin points carefully for proper rotation and collision',
        'Create sprite animations by setting frames and speed',
        'Use draw_sprite_ext() for scaling and effects',
      ],
      codeExample: '// In Create Event\nimage_speed = 0.2;\n\n// In Step Event\nif (keyboard_check(vk_right)) {\n    sprite_index = spr_player_run;\n    x += 2;\n    image_xscale = 1;\n} else {\n    sprite_index = spr_player_idle;\n}',
    },
    construct: {
      title: 'Construct Integration',
      content: 'Learn how to use pixel art in Construct 3 with animations and behaviors.',
      steps: [
        'Import sprite sheets with "Pixel art" option enabled',
        'Set up animation frames in the Animations Editor',
        'Use the 8-Direction behavior for character movement',
        'Apply the Pin behavior to attach UI elements to the screen',
      ],
      codeExample: '// No code needed for Construct 3 - it uses visual scripting',
    },
  };

  // Featured games data
  const featuredGames = [
    { 
      id: 1, 
      name: 'Dungeon Delver', 
      image: '/images/DungeonDelver.png', 
      developer: 'PixelForge Studios', 
      description: 'A roguelike dungeon crawler featuring assets from our Fantasy Pack',
      link: 'https://example.com/dungeon-delver'
    },
    { 
      id: 2, 
      name: 'Neon Nights', 
      image: '/images/NeonNights.png', 
      developer: 'SynthWave Games', 
      description: 'A cyberpunk adventure using our Neon City tileset and character assets',
      link: 'https://example.com/neon-nights'
    },
  ];

  const categories = ['All', 'Characters', 'Environment', 'UI Elements'];
  
  const filteredAssets = selectedCategory === 'All' 
    ? gameAssets 
    : gameAssets.filter(asset => asset.category === selectedCategory);

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
            Try out these playable demos showcasing our pixel art assets in action. Experience the quality and versatility of our assets firsthand!
          </p>

          {/* Game Selection Buttons */}
          {!activeGame && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div
                className="relative h-48 bg-gray-700 rounded-lg flex items-center justify-center hover:scale-105 transition-transform cursor-pointer overflow-hidden"
                onMouseEnter={() => setHoveredGame('platformer')}
                onMouseLeave={() => setHoveredGame(null)}
                onClick={() => setActiveGame('platformer')}
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
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-3">
                  <h3 className="text-white font-bold">Pixel Platformer</h3>
                  <p className="text-gray-300 text-sm">Use arrow keys to move and jump</p>
                </div>
              </div>
              <div
                className="relative h-48 bg-gray-700 rounded-lg flex items-center justify-center hover:scale-105 transition-transform cursor-pointer overflow-hidden"
                onMouseEnter={() => setHoveredGame('clicker')}
                onMouseLeave={() => setHoveredGame(null)}
                onClick={() => setActiveGame('clicker')}
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
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-3">
                  <h3 className="text-white font-bold">Pixel Clicker</h3>
                  <p className="text-gray-300 text-sm">Click to collect coins and upgrade</p>
                </div>
              </div>
            </div>
          )}

          {/* Render Active Game */}
          <div className="mt-6">
            {activeGame === 'platformer' && <PixelPlatformer />}
            {activeGame === 'clicker' && <PixelClicker />}
          </div>

          {/* Back Button (to return to game selection) */}
          {activeGame && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setActiveGame(null)}
                className="px-4 py-2 bg-purple-600 text-white font-bold rounded hover:bg-purple-700"
              >
                Back to Game Selection
              </button>
            </div>
          )}
        </div>

        {/* Engine Integration Guides */}
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-cyan-500 shadow-lg shadow-cyan-500/30 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">⚙️ Engine Integration Guides</h2>
          <p className="text-gray-300 mb-6">
            Learn how to integrate our pixel art assets into popular game engines with these comprehensive guides.
          </p>

          {/* Tabs for different engines */}
          <div className="flex flex-wrap mb-6">
            {Object.keys(engineGuides).map((engine) => (
              <button
                key={engine}
                className={`px-4 py-2 mr-2 mb-2 rounded-t-lg font-medium ${
                  activeTutorialTab === engine
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setActiveTutorialTab(engine)}
              >
                {engineGuides[engine].title}
              </button>
            ))}
          </div>

          {/* Active tab content */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3 text-white">
              {engineGuides[activeTutorialTab].title}
            </h3>
            <p className="text-gray-300 mb-4">{engineGuides[activeTutorialTab].content}</p>

            <h4 className="text-lg font-semibold mb-2 text-cyan-300">Integration Steps:</h4>
            <ul className="list-disc list-inside mb-6 text-gray-300">
              {engineGuides[activeTutorialTab].steps.map((step, index) => (
                <li key={index} className="mb-1">{step}</li>
              ))}
            </ul>

            <h4 className="text-lg font-semibold mb-2 text-cyan-300">Code Example:</h4>
            <div className="bg-gray-900 p-4 rounded-lg mb-4">
              <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                {engineGuides[activeTutorialTab].codeExample}
              </pre>
            </div>

            <div className="mt-4">
              <Link href="/tutorials" className="inline-flex items-center text-cyan-400 hover:text-cyan-300">
                View full tutorial <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Game Asset Packs */}
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-pink-500 shadow-lg shadow-pink-500/30 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-pink-400">🎨 Game-Ready Asset Packs</h2>
          <p className="text-gray-300 mb-6">
            Browse our curated collection of game-ready asset packs, perfect for indie developers and game jammers.
          </p>

          {/* Asset category filter */}
          <div className="flex flex-wrap mb-6">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 mr-2 mb-2 rounded-lg font-medium ${
                  selectedCategory === category
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Individual Assets Grid */}
          <h3 className="text-xl font-bold mb-3 text-white">Individual Assets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="bg-gray-700 rounded-lg overflow-hidden hover:shadow-md hover:shadow-pink-500/50 transition-shadow">
                <div className="h-40 overflow-hidden">
                  <img src={asset.image} alt={asset.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-white">{asset.name}</h4>
                  <p className="text-gray-400 text-sm">{asset.category}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-pink-400 font-bold">$4.99</span>
                    <button className="px-3 py-1 bg-pink-600 text-white text-sm rounded hover:bg-pink-700">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Asset Bundles Slider */}
          <h3 className="text-xl font-bold mb-3 text-white">Complete Asset Bundles</h3>
          <div className="mb-6">
            <Slider {...sliderSettings}>
              {assetBundles.map((bundle) => (
                <div key={bundle.id} className="px-2">
                  <div className="bg-gray-700 rounded-lg overflow-hidden hover:shadow-md hover:shadow-pink-500/50 transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img src={bundle.image} alt={bundle.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-white">{bundle.name}</h4>
                      <p className="text-gray-400 text-sm">{bundle.items} items included</p>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-pink-400 font-bold">{bundle.price}</span>
                        <button className="px-3 py-1 bg-pink-600 text-white text-sm rounded hover:bg-pink-700">
                          View Bundle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          <div className="text-center mt-6">
            <Link href="/assets" className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-purple-600 shadow-lg shadow-pink-500/30">
              Browse All Assets
            </Link>
          </div>
        </div>

        {/* Featured Games */}
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-purple-500 shadow-lg shadow-purple-500/30 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">🏆 Games Featuring Our Assets</h2>
          <p className="text-gray-300 mb-6">
            Check out these amazing games created by our community using Pixel Forge assets.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredGames.map((game) => (
              <div key={game.id} className="bg-gray-700 rounded-lg overflow-hidden hover:shadow-md hover:shadow-purple-500/50 transition-shadow">
                <div className="h-64 overflow-hidden">
                  <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white">{game.name}</h3>
                  <p className="text-purple-300 text-sm mb-2">by {game.developer}</p>
                  <p className="text-gray-300 mb-4">{game.description}</p>
                  <Link href={game.link} className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                    Play Game
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-700 rounded-lg p-6 mt-8 text-center">
            <h3 className="text-xl font-bold text-white mb-3">Showcase Your Game</h3>
            <p className="text-gray-300 mb-4">
              Have you created a game using our assets? Submit it to be featured on our site!
            </p>
            <Link href="/submit-game" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600">
              Submit Your Game
            </Link>
          </div>
        </div>

        {/* Community & Support */}
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-cyan-500 shadow-lg shadow-cyan-500/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">👥 Developer Community</h2>
              <p className="text-gray-300 mb-4">
                Join our thriving community of pixel game developers. Share tips, get feedback, and collaborate on projects.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Link href="/discord" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  <span className="mr-2">Discord</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 8h6m-6 4h6m-3-8v12m-3 4h6l2-2v-4" />
                  </svg>
                </Link>
                <Link href="/forum" className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <span className="mr-2">Forums</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">💡 Technical Support</h2>
              <p className="text-gray-300 mb-4">
                Need help integrating our assets? Our technical team is ready to assist with any questions.
              </p>
              <Link href="/support" className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">
                <span className="mr-2">Get Support</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}