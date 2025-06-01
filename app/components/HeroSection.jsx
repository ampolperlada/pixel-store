'use client';
import React, { useState, useEffect } from 'react';

export default function HeroSection() {
  const [hoveredTile, setHoveredTile] = useState(null);
  const [rockets, setRockets] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate flying rockets periodically
  useEffect(() => {
    if (!isClient) return;

    const spawnRocket = () => {
      const newRocket = {
        id: Math.random(),
        x: -50,
        y: Math.random() * 300, // Reduced height to stay within section
        speed: 2 + Math.random() * 3,
        trail: []
      };
      setRockets(prev => [...prev, newRocket]);
    };

    const interval = setInterval(spawnRocket, 3000);
    return () => clearInterval(interval);
  }, [isClient]);

  // Animate rockets
  useEffect(() => {
    if (!isClient) return;

    const animateRockets = () => {
      setRockets(prev => prev
        .map(rocket => ({
          ...rocket,
          x: rocket.x + rocket.speed,
          trail: [...rocket.trail.slice(-8), { x: rocket.x, y: rocket.y }]
        }))
        .filter(rocket => rocket.x < 1400) // Fixed width instead of window.innerWidth
      );
    };

    const animationFrame = setInterval(animateRockets, 50);
    return () => clearInterval(animationFrame);
  }, [isClient]);

  const getTileColor = (index) => {
    if (hoveredTile === index) {
      const colors = ['bg-pink-500/70', 'bg-purple-500/70', 'bg-cyan-500/70', 'bg-yellow-500/70'];
      return `${colors[index % colors.length]} border-2 border-white/80 shadow-2xl scale-110 relative z-30`;
    }
    return 'hover:bg-blue-400/30 hover:border-blue-300/50 hover:shadow-lg';
  };

  if (!isClient) {
    // Return a simpler version for SSR
    return (
      <section className="relative h-96 overflow-hidden border-b-4 border-pink-500 border-dotted">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900 opacity-70"></div>
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-20">
          {Array(144).fill(0).map((_, i) => (
            <div key={i} className="border border-blue-500/20"></div>
          ))}
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 font-mono">
            PIXEL FORGE
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-cyan-300 font-mono">Create • Collect • Play</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-pink-600 text-white font-bold border-2 border-pink-400">
              EXPLORE ART
            </button>
            <button className="px-6 py-3 bg-purple-600 text-white font-bold border-2 border-purple-400">
              CREATE PIXEL ART
            </button>
            <button className="px-6 py-3 bg-transparent text-cyan-300 font-bold border-2 border-cyan-500">
              GAMES INTEGRATION
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-96 overflow-hidden border-b-4 border-pink-500 border-dotted">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900 opacity-70"></div>
      
      {/* Animated pixel grid */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-40">
        {Array(144).fill(0).map((_, i) => (
          <div 
            key={i} 
            className={`border border-blue-500/30 transition-all duration-300 cursor-pointer relative ${getTileColor(i)}`}
            onMouseEnter={() => setHoveredTile(i)}
            onMouseLeave={() => setHoveredTile(null)}
            style={{ 
              transformOrigin: 'center',
              willChange: 'transform, background-color, border-color'
            }}
          >
            {hoveredTile === i && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent animate-pulse pointer-events-none" />
            )}
          </div>
        ))}
      </div>

      {/* Flying rockets */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {rockets.map(rocket => (
          <div key={rocket.id} className="absolute">
            {/* Rocket trail */}
            {rocket.trail.map((point, idx) => (
              <div
                key={idx}
                className="absolute w-2 h-2 bg-orange-400/80 rounded-full"
                style={{
                  left: point.x - idx * 4,
                  top: point.y,
                  opacity: Math.max(0.1, (idx + 1) / rocket.trail.length * 0.8),
                  transform: `scale(${Math.max(0.3, (idx + 1) / rocket.trail.length)})`
                }}
              />
            ))}
            
            {/* Rocket */}
            <div
              className="absolute text-3xl filter drop-shadow-lg"
              style={{ left: rocket.x, top: rocket.y }}
            >
              🚀
            </div>
            
            {/* Rocket glow */}
            <div
              className="absolute w-12 h-12 bg-orange-400/40 rounded-full blur-md"
              style={{ left: rocket.x - 6, top: rocket.y - 6 }}
            />
          </div>
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {Array(15).fill(0).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-300/80 rounded-full animate-bounce"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-40 h-full flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 font-mono animate-pulse drop-shadow-2xl">
          PIXEL FORGE
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-cyan-300 font-mono drop-shadow-lg">
          Create • Collect • Play
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button className="group px-6 py-3 bg-pink-600 text-white font-bold hover:bg-pink-700 transition-all duration-300 border-2 border-pink-400 shadow-lg shadow-pink-500/50 hover:shadow-pink-500/80 hover:scale-105 active:scale-95 transform">
            <span className="group-hover:animate-pulse">EXPLORE ART</span>
          </button>
          
          <button className="group px-6 py-3 bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all duration-300 border-2 border-purple-400 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/80 hover:scale-105 active:scale-95 transform">
            <span className="group-hover:animate-pulse">CREATE PIXEL ART</span>
          </button>
          
          <button className="group px-6 py-3 bg-transparent text-cyan-300 font-bold hover:text-cyan-100 hover:bg-cyan-500/10 transition-all duration-300 border-2 border-cyan-500 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/60 hover:scale-105 active:scale-95 transform">
            <span className="group-hover:animate-pulse">GAMES INTEGRATION</span>
          </button>
        </div>

        {/* Animated cyberpunk elements */}
        <div className="absolute top-4 right-4 text-xs text-cyan-400 font-mono opacity-70 animate-pulse">
          &gt; SYSTEM_ONLINE
        </div>
        
        <div className="absolute bottom-4 left-4 text-xs text-green-400 font-mono opacity-70">
          <div className="animate-pulse">[STATUS: CONNECTED]</div>
          <div className="animate-bounce mt-1">▲ ▼ ▶ ◀</div>
        </div>
      </div>
    </section>
  );
}