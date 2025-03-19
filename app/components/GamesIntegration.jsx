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
  const [activeGame, setActiveGame] = useState<string | null>(null); // Add activeGame state

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

          {/* Game Selection Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div
              className="relative h-48 bg-gray-700 rounded-lg flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
              onMouseEnter={() => setHoveredGame('platformer')}
              onMouseLeave={() => setHoveredGame(null)}
              onClick={() => setActiveGame('platformer')} // Set activeGame to 'platformer'
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
              className="relative h-48 bg-gray-700 rounded-lg flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
              onMouseEnter={() => setHoveredGame('clicker')}
              onMouseLeave={() => setHoveredGame(null)}
              onClick={() => setActiveGame('clicker')} // Set activeGame to 'clicker'
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

          {/* Render Active Game */}
          <div className="mt-6">
            {activeGame === 'platformer' && <PixelPlatformer />}
            {activeGame === 'clicker' && <PixelClicker />}
          </div>

          {/* Back Button (to return to game selection) */}
          {activeGame && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setActiveGame(null)} // Reset activeGame to null
                className="px-4 py-2 bg-purple-600 text-white font-bold rounded hover:bg-purple-700"
              >
                Back to Game Selection
              </button>
            </div>
          )}
        </div>

        {/* Rest of your code... */}
      </div>
    </section>
  );
}