'use client';

import React, { useState, useEffect } from 'react';

export default function HeroSection() {
  const [hoveredTile, setHoveredTile] = useState(null);
  const [rockets, setRockets] = useState([]);
  const [particles, setParticles] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client before rendering random elements
  useEffect(() => {
    setIsClient(true);
    
    // Generate particles only on client
    const generatedParticles = Array(25).fill(0).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 3,
      animationDuration: 1.5 + Math.random() * 2.5,
      size: Math.random() > 0.7 ? 'big' : 'small'
    }));
    
    setParticles(generatedParticles);
  }, []);

  // Generate flying rockets periodically
  useEffect(() => {
    if (!isClient) return;
    
    const spawnRocket = () => {
      const newRocket = {
        id: Math.random(),
        x: -50,
        y: 50 + Math.random() * 300,
        speed: 1.5 + Math.random() * 2.5,
        trail: []
      };
      setRockets(prev => [...prev, newRocket]);
    };

    const interval = setInterval(spawnRocket, 2500);
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
          trail: [...rocket.trail.slice(-10), { x: rocket.x, y: rocket.y }]
        }))
        .filter(rocket => rocket.x < 1400)
      );
    };

    const animationFrame = setInterval(animateRockets, 40);
    return () => clearInterval(animationFrame);
  }, [isClient]);

  const getTileColor = (index) => {
    if (hoveredTile === index) {
      const colors = [
        'bg-pink-500/70 border-pink-300/80 shadow-pink-500/60',
        'bg-purple-500/70 border-purple-300/80 shadow-purple-500/60',
        'bg-cyan-500/70 border-cyan-300/80 shadow-cyan-500/60',
        'bg-yellow-500/70 border-yellow-300/80 shadow-yellow-500/60',
        'bg-green-500/70 border-green-300/80 shadow-green-500/60',
        'bg-red-500/70 border-red-300/80 shadow-red-500/60'
      ];
      return `${colors[index % colors.length]} border-2 shadow-lg transform scale-110 z-20 transition-all duration-200`;
    }
    return 'bg-blue-900/10 border-blue-500/20 hover:bg-blue-500/30 hover:border-blue-300/50 transition-all duration-300 hover:scale-105';
  };

  return (
    <section className="relative h-96 overflow-hidden border-b-4 border-pink-500 border-dotted">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
      
      {/* Animated pixel grid */}
      <div className="absolute inset-0 grid grid-cols-16 grid-rows-12 opacity-40">
        {Array(192).fill(0).map((_, i) => (
          <div 
            key={i} 
            className={`border cursor-pointer relative ${getTileColor(i)}`}
            onMouseEnter={() => setHoveredTile(i)}
            onMouseLeave={() => setHoveredTile(null)}
          >
            {hoveredTile === i && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent animate-pulse" />
            )}
          </div>
        ))}
      </div>

      {/* Flying rockets - only render on client */}
      {isClient && rockets.map(rocket => (
        <div key={rocket.id} className="absolute pointer-events-none z-30">
          {/* Rocket trail */}
          {rocket.trail.map((point, idx) => (
            <div
              key={idx}
              className="absolute w-2 h-1 bg-orange-400 rounded-full"
              style={{
                left: point.x - idx * 4,
                top: point.y + 2,
                opacity: Math.max(0.1, (rocket.trail.length - idx) / rocket.trail.length * 0.8),
                transform: `scale(${Math.max(0.3, (rocket.trail.length - idx) / rocket.trail.length)})`
              }}
            />
          ))}
          
          {/* Rocket */}
          <div
            className="absolute text-2xl animate-pulse transform hover:scale-110 transition-transform"
            style={{ left: rocket.x, top: rocket.y }}
          >
            🚀
          </div>
          
          {/* Rocket glow */}
          <div
            className="absolute w-12 h-12 bg-orange-400/40 rounded-full blur-md animate-pulse"
            style={{ left: rocket.x - 6, top: rocket.y - 6 }}
          />
        </div>
      ))}

      {/* Floating particles - only render on client with enhanced animation */}
      {isClient && (
        <div className="absolute inset-0 z-20">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute rounded-full animate-bounce ${
                particle.size === 'big' 
                  ? 'w-2 h-2 bg-cyan-300/80 shadow-lg shadow-cyan-300/50' 
                  : 'w-1 h-1 bg-cyan-400/60'
              }`}
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.animationDelay}s`,
                animationDuration: `${particle.animationDuration}s`,
                filter: particle.size === 'big' ? 'drop-shadow(0 0 4px rgba(103, 232, 249, 0.8))' : 'none'
              }}
            />
          ))}
          
          {/* Additional twinkling stars */}
          {Array(15).fill(0).map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Main content */}
      <div className="relative z-40 h-full flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 font-mono animate-pulse">
          PIXEL FORGE
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-cyan-300 font-mono animate-fade-in">
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
        <div className="absolute top-4 right-4 text-xs text-cyan-400 font-mono opacity-60 animate-pulse">
          &gt; SYSTEM_ONLINE
        </div>
        
        <div className="absolute bottom-4 left-4 text-xs text-green-400 font-mono opacity-60">
          <div className="animate-pulse">[STATUS: CONNECTED]</div>
          <div className="animate-bounce mt-1">▲ ▼ ▶ ◀</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }