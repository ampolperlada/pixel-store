// balikan to pag may artist nako for them to create the missing artwork and the featured categories
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Slider from 'react-slick'; // For sliders
import 'slick-carousel/slick/slick.css'; // Slider CSS
import 'slick-carousel/slick/slick-theme.css'; // Slider theme CSS

export default function GamesIntegration() {
  const [hoveredGame, setHoveredGame] = useState(null);
  const [activeTutorialTab, setActiveTutorialTab] = useState('unity');

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
        'Import your pixel art into Unity  project panel',
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

        {/* NEW COMPONENT: Game Engine Integration Guides */}
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-green-500 shadow-lg shadow-green-500/30 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-green-400">🔧 Game Engine Integration Guides</h2>
          <p className="text-gray-300 mb-4">
            Step-by-step tutorials for integrating pixel art assets into popular game engines.
          </p>
          
          {/* Engine tabs */}
          <div className="flex flex-wrap mb-4 border-b border-gray-700">
            {Object.keys(engineGuides).map((engine) => (
              <button
                key={engine}
                className={`px-4 py-2 font-semibold rounded-t-lg mr-2 ${
                  activeTutorialTab === engine
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setActiveTutorialTab(engine)}
              >
                {engineGuides[engine].title}
              </button>
            ))}
          </div>
          
          {/* Active engine content */}
          <div className="p-4 bg-gray-700 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-2">{engineGuides[activeTutorialTab].title}</h3>
            <p className="text-gray-300 mb-4">{engineGuides[activeTutorialTab].content}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-green-300 mb-2">Integration Steps</h4>
                <ul className="list-disc list-inside text-gray-300">
                  {engineGuides[activeTutorialTab].steps.map((step, index) => (
                    <li key={index} className="mb-2">{step}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-300 mb-2">Example Code</h4>
                <pre className="bg-gray-800 p-4 rounded text-gray-300 overflow-x-auto text-sm">
                  {engineGuides[activeTutorialTab].codeExample}
                </pre>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <button className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700">
                Download Full {engineGuides[activeTutorialTab].title} Guide (PDF)
              </button>
            </div>
          </div>
        </div>

        {/* NEW COMPONENT: Asset Pack Bundles */}
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-yellow-500 shadow-lg shadow-yellow-500/30 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">📦 Asset Pack Bundles</h2>
          <p className="text-gray-300 mb-4">
            Complete themed collections of pixel art assets at discounted prices.
          </p>
          <Slider {...sliderSettings}>
            {assetBundles.map((bundle) => (
              <div key={bundle.id} className="px-2">
                <div className="bg-gray-700 p-4 rounded-lg hover:shadow-md hover:shadow-yellow-400/20 transition-shadow">
                  <div className="relative">
                    <img
                      src={bundle.image}
                      alt={bundle.name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <span className="absolute top-2 right-2 bg-yellow-500 text-black text-sm font-bold px-2 py-1 rounded">
                      {bundle.items} items
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{bundle.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-yellow-300 font-bold">{bundle.price}</span>
                    <button className="px-4 py-2 bg-yellow-600 text-white font-bold rounded hover:bg-yellow-700">
                      View Bundle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* NEW COMPONENT: Implementation Case Studies */}
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-blue-500 shadow-lg shadow-blue-500/30 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">🏆 Featured Games Using Our Assets</h2>
          <p className="text-gray-300 mb-4">
            Success stories from developers who built amazing games with our pixel art.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredGames.map((game) => (
              <div key={game.id} className="bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white">{game.name}</h3>
                  <p className="text-blue-300 mb-2">by {game.developer}</p>
                  <p className="text-gray-300 mb-4">{game.description}</p>
                  <a
                    href={game.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 inline-block"
                  >
                    View Case Study
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
              Submit Your Game
            </button>
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

        {/* NEW COMPONENT: Interactive Pixel Art Editor */}
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-red-500 shadow-lg shadow-red-500/30 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-red-400">🎨 Interactive Pixel Art Editor</h2>
          <p className="text-gray-300 mb-4">
            Try creating your own pixel art directly in your browser. Modify existing assets or start from scratch!
          </p>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="h-64 bg-gray-800 rounded-lg mb-4 flex items-center justify-center border border-gray-600">
              <p className="text-gray-400">Pixel Editor Canvas (Coming Soon)</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <button className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">Pencil</button>
              <button className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">Eraser</button>
              <button className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">Fill</button>
              <button className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">Line</button>
              <button className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">Rectangle</button>
              <button className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">Circle</button>
            </div>
            <div className="flex justify-center gap-4">
              <button className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700">
                Clear Canvas
              </button>
              <button className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700">
                Export PNG
              </button>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-300 mb-2">Want the full pixel art creation experience?</p>
            <button className="px-6 py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700">
              Try Our Advanced Editor
            </button>
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