'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const [hoveredTile, setHoveredTile] = useState(null);
  const [rockets, setRockets] = useState([]);
  const [particles, setParticles] = useState([]);
  const [meteorites, setMeteorites] = useState([]);
  const [pulseRings, setPulseRings] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client before rendering random elements
  useEffect(() => {
    setIsClient(true);
    
    // Generate floating particles
    const generatedParticles = Array(30).fill(0).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 5,
      animationDuration: 3 + Math.random() * 4,
      size: Math.random() > 0.8 ? 'big' : Math.random() > 0.5 ? 'medium' : 'small',
      color: ['cyan', 'pink', 'purple', 'yellow', 'green'][Math.floor(Math.random() * 5)]
    }));
    
    setParticles(generatedParticles);

    // Generate meteorites
    const generatedMeteorites = Array(5).fill(0).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20,
      speed: 2 + Math.random() * 3,
      angle: 20 + Math.random() * 40,
      trail: []
    }));
    
    setMeteorites(generatedMeteorites);
  }, []);

  // Generate flying rockets periodically
  useEffect(() => {
    if (!isClient) return;
    
    const spawnRocket = () => {
      const newRocket = {
        id: Math.random(),
        x: -80,
        y: 80 + Math.random() * 240,
        speed: 2 + Math.random() * 2,
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
          trail: [...rocket.trail.slice(-12), { x: rocket.x, y: rocket.y }]
        }))
        .filter(rocket => rocket.x < 1500)
      );
    };

    const animationFrame = setInterval(animateRockets, 50);
    return () => clearInterval(animationFrame);
  }, [isClient]);

  // Animate meteorites
  useEffect(() => {
    if (!isClient) return;
    
    const animateMeteorites = () => {
      setMeteorites(prev => prev.map(meteorite => ({
        ...meteorite,
        x: meteorite.x + Math.cos(meteorite.angle * Math.PI / 180) * meteorite.speed,
        y: meteorite.y + Math.sin(meteorite.angle * Math.PI / 180) * meteorite.speed,
        trail: [...meteorite.trail.slice(-8), { x: meteorite.x, y: meteorite.y }]
      })).filter(meteorite => meteorite.y < 500));
    };

    const meteoriteInterval = setInterval(animateMeteorites, 80);
    
    // Respawn meteorites
    const respawnInterval = setInterval(() => {
      setMeteorites(prev => {
        if (prev.length < 3) {
          return [...prev, {
            id: Math.random(),
            x: Math.random() * 100,
            y: -20,
            speed: 2 + Math.random() * 3,
            angle: 20 + Math.random() * 40,
            trail: []
          }];
        }
        return prev;
      });
    }, 4000);

    return () => {
      clearInterval(meteoriteInterval);
      clearInterval(respawnInterval);
    };
  }, [isClient]);

  // Generate pulse rings on click
  const createPulseRing = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRing = {
      id: Math.random(),
      x,
      y,
      startTime: Date.now()
    };
    
    setPulseRings(prev => [...prev, newRing]);
    
    setTimeout(() => {
      setPulseRings(prev => prev.filter(ring => ring.id !== newRing.id));
    }, 1000);
  };

  const getTileColor = (index) => {
    if (hoveredTile === index) {
      const colors = [
        'bg-pink-400/30 border-pink-200/60 shadow-pink-400/40',
        'bg-purple-400/30 border-purple-200/60 shadow-purple-400/40',
        'bg-cyan-400/30 border-cyan-200/60 shadow-cyan-400/40',
        'bg-yellow-400/30 border-yellow-200/60 shadow-yellow-400/40',
        'bg-green-400/30 border-green-200/60 shadow-green-400/40',
        'bg-blue-400/30 border-blue-200/60 shadow-blue-400/40'
      ];
      return `${colors[index % colors.length]} border shadow-lg transform scale-110 transition-all duration-200`;
    }
    return 'border-blue-500/10 hover:border-blue-300/20 hover:bg-blue-500/10 transition-all duration-300';
  };

  const getParticleStyles = (particle) => {
    const baseClasses = 'absolute rounded-full animate-bounce';
    const colorClasses = {
      cyan: 'bg-cyan-400 shadow-cyan-400/80',
      pink: 'bg-pink-400 shadow-pink-400/80',
      purple: 'bg-purple-400 shadow-purple-400/80',
      yellow: 'bg-yellow-400 shadow-yellow-400/80',
      green: 'bg-green-400 shadow-green-400/80'
    };
    
    const sizeClasses = {
      big: 'w-3 h-3',
      medium: 'w-2 h-2',
      small: 'w-1 h-1'
    };
    
    return `${baseClasses} ${colorClasses[particle.color]} ${sizeClasses[particle.size]} shadow-lg`;
  };

  return (
    <section 
      className="relative h-96 overflow-hidden border-b-4 border-pink-500 border-dotted cursor-crosshair"
      onClick={createPulseRing}
    >
      {/* Animated background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-purple-800/30 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
      
      {/* Subtle grid that doesn't interfere */}
      <div className="absolute inset-0 grid grid-cols-20 grid-rows-12 opacity-10">
        {Array(240).fill(0).map((_, i) => (
          <div 
            key={i} 
            className={`border cursor-pointer ${getTileColor(i)}`}
            onMouseEnter={() => setHoveredTile(i)}
            onMouseLeave={() => setHoveredTile(null)}
          />
        ))}
      </div>

      {/* Pulse rings from clicks */}
      {pulseRings.map(ring => (
        <div
          key={ring.id}
          className="absolute pointer-events-none"
          style={{ left: ring.x, top: ring.y }}
        >
          <div className="absolute w-0 h-0 border-4 border-cyan-400/60 rounded-full animate-ping" style={{ animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
          <div className="absolute w-0 h-0 border-2 border-pink-400/40 rounded-full animate-ping" style={{ animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) 0.2s infinite' }} />
        </div>
      ))}

      {/* Flying meteorites */}
      {isClient && meteorites.map(meteorite => (
        <div key={meteorite.id} className="absolute pointer-events-none z-20">
          {/* Meteorite trail */}
          {meteorite.trail.map((point, idx) => (
            <div
              key={idx}
              className="absolute w-1 h-6 bg-gradient-to-b from-orange-400 to-red-500 rounded-full blur-sm"
              style={{
                left: `${point.x}%`,
                top: `${point.y}px`,
                opacity: Math.max(0.1, (meteorite.trail.length - idx) / meteorite.trail.length * 0.9),
                transform: `rotate(${meteorite.angle}deg) scale(${Math.max(0.2, (meteorite.trail.length - idx) / meteorite.trail.length)})`
              }}
            />
          ))}
          
          {/* Meteorite */}
          <div
            className="absolute text-lg animate-pulse"
            style={{ left: `${meteorite.x}%`, top: `${meteorite.y}px` }}
          >
            ⭐
          </div>
          
          {/* Meteorite glow */}
          <div
            className="absolute w-8 h-8 bg-orange-400/50 rounded-full blur-lg animate-pulse"
            style={{ left: `${meteorite.x}%`, top: `${meteorite.y - 4}px` }}
          />
        </div>
      ))}

      {/* Flying rockets */}
      {isClient && rockets.map(rocket => (
        <div key={rocket.id} className="absolute pointer-events-none z-25">
          {/* Enhanced rocket trail */}
          {rocket.trail.map((point, idx) => (
            <div
              key={idx}
              className="absolute w-3 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-sm"
              style={{
                left: point.x - idx * 5,
                top: point.y + 2,
                opacity: Math.max(0.1, (rocket.trail.length - idx) / rocket.trail.length * 0.9),
                transform: `scale(${Math.max(0.3, (rocket.trail.length - idx) / rocket.trail.length)})`
              }}
            />
          ))}
          
          {/* Rocket */}
          <div
            className="absolute text-3xl animate-pulse transform hover:scale-125 transition-transform"
            style={{ left: rocket.x, top: rocket.y }}
          >
            🚀
          </div>
          
          {/* Enhanced rocket glow */}
          <div
            className="absolute w-16 h-16 bg-gradient-radial from-orange-400/60 to-transparent rounded-full blur-xl animate-pulse"
            style={{ left: rocket.x - 8, top: rocket.y - 8 }}
          />
        </div>
      ))}

      {/* Enhanced floating particles */}
      {isClient && (
        <div className="absolute inset-0 z-20">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={getParticleStyles(particle)}
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.animationDelay}s`,
                animationDuration: `${particle.animationDuration}s`,
                filter: `drop-shadow(0 0 ${particle.size === 'big' ? '8px' : '4px'} currentColor)`
              }}
            />
          ))}
          
          {/* Twinkling stars */}
          {Array(25).fill(0).map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${2 + Math.random() * 4}s`
              }}
            />
          ))}

          {/* Floating orbs */}
          {Array(8).fill(0).map((_, i) => (
            <div
              key={`orb-${i}`}
              className="absolute w-4 h-4 bg-gradient-to-br from-cyan-400/60 to-purple-400/60 rounded-full blur-sm animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Main content */}
      <div className="relative z-40 h-full flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 font-mono animate-pulse drop-shadow-2xl">
          PIXEL FORGE
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-cyan-300 font-mono animate-fade-in drop-shadow-lg">
          Create • Collect • Play
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/explore"
            className="group px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-500 text-white font-bold hover:from-pink-700 hover:to-pink-600 transition-all duration-300 border-2 border-pink-400 shadow-lg shadow-pink-500/50 hover:shadow-pink-500/80 hover:scale-105 active:scale-95 transform backdrop-blur-sm"
          >
            <span className="group-hover:animate-pulse">EXPLORE ART</span>
          </Link>
          
          <Link 
            href="/create"
            className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold hover:from-purple-700 hover:to-purple-600 transition-all duration-300 border-2 border-purple-400 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/80 hover:scale-105 active:scale-95 transform backdrop-blur-sm"
          >
            <span className="group-hover:animate-pulse">CREATE PIXEL ART</span>
          </Link>
          
          <Link 
            href="/games"
            className="group px-6 py-3 bg-transparent text-cyan-300 font-bold hover:text-cyan-100 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 transition-all duration-300 border-2 border-cyan-500 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/60 hover:scale-105 active:scale-95 transform backdrop-blur-sm"
          >
            <span className="group-hover:animate-pulse">GAMES INTEGRATION</span>
          </Link>
        </div>

        {/* Enhanced cyberpunk elements */}
        <div className="absolute top-4 right-4 text-xs text-cyan-400 font-mono opacity-70 animate-pulse backdrop-blur-sm bg-black/20 px-2 py-1 rounded">
          &gt; SYSTEM_ONLINE
        </div>
        
        <div className="absolute bottom-4 left-4 text-xs text-green-400 font-mono opacity-70 backdrop-blur-sm bg-black/20 px-2 py-1 rounded">
          <div className="animate-pulse">[STATUS: CONNECTED]</div>
          <div className="animate-bounce mt-1 text-center">▲ ▼ ▶ ◀</div>
        </div>

        {/* Energy bars */}
        <div className="absolute top-1/4 left-4 w-2 h-16 bg-gradient-to-t from-red-500 via-yellow-500 to-green-500 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-1/4 right-4 w-2 h-20 bg-gradient-to-t from-purple-500 via-pink-500 to-cyan-500 rounded-full opacity-60 animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .cursor-crosshair {
          cursor: crosshair;
        }
      `}</style>
    </section>
  );
}