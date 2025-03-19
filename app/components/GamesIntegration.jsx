'use client'; // Add this directive at the top

import React, { useState } from 'react';
import Link from 'next/link';
import Slider from 'react-slick'; // For sliders
import 'slick-carousel/slick/slick.css'; // Slider CSS
import 'slick-carousel/slick/slick-theme.css'; // Slider theme CSS
import PixelPlatformer from '../components/PixelPlatformer'; // Import PixelPlatformer
import PixelClicker from '../components/PixelClicker'; // Import PixelClicker

export default function GamesIntegration() {
  const [hoveredGame, setHoveredGame] = useState(null);
  const [activeTutorialTab, setActiveTutorialTab] = useState('unity');
  const [activeGame, setActiveGame] = useState(null);
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
                  src="/images/games/Game1.png"
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
                  src="/images/games/Game2.png"
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
{/* Game Engine Integration Guides */}
<div className="bg-gray-800 p-6 rounded-lg border-2 border-purple-500 shadow-lg shadow-purple-500/30 mb-12">
  <h2 className="text-2xl font-bold mb-4 text-purple-400">🛠️ Engine Integration Guides</h2>
  <p className="text-gray-300 mb-4">
    Follow these technical guides to seamlessly integrate Pixel-Forge assets into your favorite game engines.
  </p>
  
  {/* Engine Tab Navigation */}
  <div className="flex flex-wrap border-b border-gray-700 mb-6">
    {Object.keys(engineGuides).map((engine) => (
      <button
        key={engine}
        className={`px-4 py-2 font-medium rounded-t-lg mr-2 transition-colors ${
          activeTutorialTab === engine
            ? 'bg-purple-700 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        onClick={() => setActiveTutorialTab(engine)}
      >
        {engineGuides[engine].title}
      </button>
    ))}
  </div>
  
  {/* Engine Content */}
  <div className="bg-gray-700 rounded-lg p-6">
    <h3 className="text-xl font-bold text-cyan-300 mb-4">
      {engineGuides[activeTutorialTab].title}
    </h3>
    <p className="text-gray-300 mb-4">
      {engineGuides[activeTutorialTab].content}
    </p>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Step-by-step guide */}
      <div>
        <h4 className="text-lg font-bold text-purple-300 mb-3">Implementation Steps:</h4>
        <ol className="list-decimal pl-5 space-y-2 text-gray-300">
          {engineGuides[activeTutorialTab].steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
      
      {/* Code example */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <h4 className="text-lg font-bold text-purple-300 mb-3">Code Example:</h4>
        <pre className="text-cyan-300 font-mono text-sm overflow-x-auto">
          {engineGuides[activeTutorialTab].codeExample}
        </pre>
      </div>
    </div>
  </div>
</div>



{/* Technical Integration Best Practices */}
<div className="bg-gray-800 p-6 rounded-lg border-2 border-purple-500 shadow-lg shadow-purple-500/30 mb-12">
  <h2 className="text-2xl font-bold mb-4 text-purple-400">⚙️ Technical Best Practices</h2>
  <p className="text-gray-300 mb-4">
    Follow these technical guidelines to get the most out of your Pixel-Forge assets in game development.
  </p>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left column - Sprite Animation */}
    <div className="bg-gray-700 p-5 rounded-lg">
      <h3 className="text-xl font-bold text-cyan-300 mb-3">Sprite Animation</h3>
      <p className="text-gray-300 mb-3">
        Optimize your animation workflow by implementing sprite sheets correctly:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-gray-300">
        <li>Use sprite sheet dimensions that are powers of two (e.g., 512×512, 1024×1024)</li>
        <li>Group similar animations together on the same sprite sheet</li>
        <li>Maintain consistent frame dimensions for smoother transitions</li>
        <li>Use appropriate frame rates (8-12 FPS for most pixel art animations)</li>
      </ul>
      <div className="mt-4 bg-gray-800 p-3 rounded-lg">
        <h4 className="text-md font-bold text-purple-300 mb-2">Sample Animation Controller:</h4>
        <pre className="text-cyan-300 font-mono text-sm overflow-x-auto">
{`class PixelAnimator {
  constructor(spriteSheet, frameWidth, frameHeight, fps) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameTime = 1000 / fps;
    this.animations = {};
  }

  addAnimation(name, startFrame, endFrame) {
    this.animations[name] = {
      startFrame,
      endFrame,
      currentFrame: startFrame
    };
  }

  update(dt, currentAnim) {
    // Animation update logic
  }
}`}
        </pre>
      </div>
    </div>
    
    {/* Right column - Pixel Perfect Rendering */}
    <div className="bg-gray-700 p-5 rounded-lg">
      <h3 className="text-xl font-bold text-cyan-300 mb-3">Pixel-Perfect Rendering</h3>
      <p className="text-gray-300 mb-3">
        Maintain crispness and prevent visual artifacts with these techniques:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-gray-300">
        <li>Disable texture filtering/anti-aliasing for pixel art assets</li>
        <li>Align sprites to the pixel grid (avoid fractional positions)</li>
        <li>Use integer scaling values to prevent pixel distortion</li>
        <li>Implement a dedicated pixel-perfect camera system</li>
      </ul>
      <div className="mt-4 bg-gray-800 p-3 rounded-lg">
        <h4 className="text-md font-bold text-purple-300 mb-2">Pixel-Perfect Camera Implementation:</h4>
        <pre className="text-cyan-300 font-mono text-sm overflow-x-auto">
{`// JavaScript/TypeScript implementation
function createPixelPerfectCamera(pixelsPerUnit = 16, zoom = 1) {
  // Calculate orthographic size based on screen height
  const height = window.innerHeight;
  const orthographicSize = Math.floor(height / (pixelsPerUnit * zoom * 2));
  
  // Set camera properties
  camera.orthographicSize = orthographicSize;
  
  // Round position values to prevent subpixel rendering
  function updatePosition(position) {
    return {
      x: Math.round(position.x * pixelsPerUnit) / pixelsPerUnit,
      y: Math.round(position.y * pixelsPerUnit) / pixelsPerUnit
    };
  }
  
  return {
    updatePosition,
    setZoom(newZoom) {
      zoom = newZoom;
      camera.orthographicSize = Math.floor(height / (pixelsPerUnit * zoom * 2));
    }
  };
}`}
        </pre>
      </div>
    </div>
  </div>
</div>

{/* NFT Integration Section */}
<div className="bg-gray-800 p-6 rounded-lg border-2 border-purple-500 shadow-lg shadow-purple-500/30 mb-12">
  <h2 className="text-2xl font-bold mb-4 text-purple-400">🔗 NFT Integration</h2>
  <p className="text-gray-300 mb-4">
    Pixel-Forge makes it easy to connect your in-game assets to blockchain technology.
  </p>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left column - NFT Implementation */}
    <div className="bg-gray-700 p-5 rounded-lg">
      <h3 className="text-xl font-bold text-cyan-300 mb-3">Game-to-NFT Implementation</h3>
      <p className="text-gray-300 mb-3">
        Learn how to make your in-game assets tradable as NFTs:
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-gray-300">
        <li>Create unique identifiers for each game asset</li>
        <li>Implement the Pixel-Forge NFT SDK in your game</li>
        <li>Configure metadata to reflect in-game properties</li>
        <li>Allow players to mint their earned/created assets</li>
      </ol>
      <div className="mt-4 bg-gray-800 p-3 rounded-lg">
        <h4 className="text-md font-bold text-purple-300 mb-2">NFT Integration Code:</h4>
        <pre className="text-cyan-300 font-mono text-sm overflow-x-auto">
{`// Initialize the Pixel-Forge NFT SDK
import { PixelForgeNFT } from 'pixel-forge-nft';

const nftClient = new PixelForgeNFT({
  apiKey: 'YOUR_API_KEY',
  network: 'ethereum' // or 'polygon', 'solana', etc.
});

// Create NFT from game asset
async function mintGameAsset(assetId, playerAddress) {
  // Get asset metadata from your game
  const assetData = gameAssets.getAssetById(assetId);
  
  // Create NFT metadata
  const metadata = {
    name: assetData.name,
    description: assetData.description,
    image: assetData.imageUrl,
    attributes: [
      { trait_type: 'Rarity', value: assetData.rarity },
      { trait_type: 'Level', value: assetData.level },
      // More game-specific attributes
    ]
  };
  
  // Mint the NFT
  const result = await nftClient.mintNFT({
    recipient: playerAddress,
    metadata,
    royalty: 5 // 5% royalty to Pixel-Forge
  });
  
  return result.tokenId;
}`}
        </pre>
      </div>
    </div>
    
    {/* Right column - NFT Benefits */}
    <div className="bg-gray-700 p-5 rounded-lg">
      <h3 className="text-xl font-bold text-cyan-300 mb-3">Benefits for Developers</h3>
      <ul className="list-disc pl-5 space-y-2 text-gray-300">
        <li><span className="text-purple-300 font-bold">Monetization:</span> Create new revenue streams through NFT sales and royalties</li>
        <li><span className="text-purple-300 font-bold">Player Retention:</span> Increase engagement by giving real ownership of in-game items</li>
        <li><span className="text-purple-300 font-bold">Cross-Game Assets:</span> Enable players to use assets across multiple compatible games</li>
        <li><span className="text-purple-300 font-bold">Community Building:</span> Foster dedicated collectors and traders around your game</li>
        <li><span className="text-purple-300 font-bold">Secondary Markets:</span> Generate ongoing royalties from secondary sales</li>
      </ul>
      
      <div className="mt-6 p-4 bg-purple-900/30 border border-purple-500 rounded-lg">
        <h4 className="text-lg font-bold text-purple-300 mb-2">Pixel-Forge NFT Requirements</h4>
        <p className="text-gray-300">
          When integrating with our NFT marketplace, please ensure:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
          <li>Include attribution in metadata (e.g., "Created with Pixel-Forge assets")</li>
          <li>Set a minimum 5% royalty for Pixel-Forge</li>
          <li>Maintain asset quality standards when tokenizing</li>
          <li>Respect the terms of the asset license</li>
        </ul>
      </div>
    </div>
  </div>
</div>

{/* Featured Games */}
<div className="bg-gray-800 p-6 rounded-lg border-2 border-purple-500 shadow-lg shadow-purple-500/30 mb-12">
  <h2 className="text-2xl font-bold mb-4 text-purple-400">🏆 Success Stories</h2>
  <p className="text-gray-300 mb-4">
    Check out these amazing games created with Pixel-Forge assets:
  </p>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {featuredGames.map((game) => (
      <div key={game.id} className="bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all hover:-translate-y-1">
        <img src={game.image} alt={game.name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="font-bold text-xl text-white">{game.name}</h3>
          <p className="text-cyan-300 text-sm">By {game.developer}</p>
          <p className="text-gray-300 mt-2">{game.description}</p>
          
          <a
            href={game.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full mt-4 px-4 py-2 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 text-center"
          >
            View Game
          </a>
        </div>
      </div>
    ))}
  </div>
</div>

{/* Creator Resources */}
<div className="bg-gray-800 p-6 rounded-lg border-2 border-purple-500 shadow-lg shadow-purple-500/30 mb-12">
  <h2 className="text-2xl font-bold mb-4 text-purple-400">🔧 Creator Resources</h2>
  <p className="text-gray-300 mb-4">
    Whether you're using our assets or creating your own to sell on Pixel-Forge, these resources will help you succeed:
  </p>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-gray-700 p-5 rounded-lg">
      <h3 className="text-xl font-bold text-cyan-300 mb-3">Developer Documentation</h3>
      <p className="text-gray-300 mb-3">
        Comprehensive guides for integrating Pixel-Forge assets into your games.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-gray-300">
        <li>Technical integration guides</li>
        <li>API documentation</li>
        <li>SDK implementation examples</li>
        <li>Performance optimization tips</li>
      </ul>
      <button className="w-full mt-4 px-4 py-2 bg-cyan-600 text-white font-bold rounded hover:bg-cyan-700">
        View Documentation
      </button>
    </div>
    
    <div className="bg-gray-700 p-5 rounded-lg">
      <h3 className="text-xl font-bold text-cyan-300 mb-3">Asset Creator Guides</h3>
      <p className="text-gray-300 mb-3">
        Learn how to create, package, and sell your pixel art on our marketplace.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-gray-300">
        <li>Asset creation guidelines</li>
        <li>Marketplace submission process</li>
        <li>Pricing and licensing tips</li>
        <li>Marketing your pixel art assets</li>
      </ul>
      <button className="w-full mt-4 px-4 py-2 bg-cyan-600 text-white font-bold rounded hover:bg-cyan-700">
        Start Creating
      </button>
    </div>
    
    <div className="bg-gray-700 p-5 rounded-lg">
      <h3 className="text-xl font-bold text-cyan-300 mb-3">Community & Support</h3>
      <p className="text-gray-300 mb-3">
        Join our community of game developers and pixel artists.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-gray-300">
        <li>Discord community</li>
        <li>Technical support forums</li>
        <li>Asset request board</li>
        <li>Showcase your games</li>
      </ul>
      <button className="w-full mt-4 px-4 py-2 bg-cyan-600 text-white font-bold rounded hover:bg-cyan-700">
        Join Community
      </button>
    </div>
  </div>
</div>

{/* Attribution Requirements */}
<div className="bg-gray-900 p-6 rounded-lg border border-purple-500 mb-12">
  <h2 className="text-xl font-bold mb-4 text-purple-400">📝 Attribution Requirements</h2>
  <p className="text-gray-300 mb-4">
    When using Pixel-Forge assets in your games, please include the following attribution:
  </p>
  
  <div className="bg-gray-800 p-4 rounded-lg font-mono text-sm text-white">
    <p>Asset(s): [Asset Name]</p>
    <p>Created by: [Original Artist] via Pixel-Forge</p>
    <p>Website: www.pixel-forge.com</p>
  </div>
  
  <p className="text-gray-300 mt-4">
    Attribution helps support our artists and allows us to continue providing high-quality pixel art assets.
    For commercial games, please review our licensing terms for specific requirements.
  </p>
</div>
        
      </div>
    </section>
  );
}