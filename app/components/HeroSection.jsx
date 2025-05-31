import React, { useState, useEffect } from 'react';

export default function HeroSection() {
  const [hoveredTile, setHoveredTile] = useState(null);
  const [rockets, setRockets] = useState([]);

  // Generate flying rockets periodically
  useEffect(() => {
    const spawnRocket = () => {
      const newRocket = {
        id: Math.random(),
        x: -50,
        y: Math.random() * 400,
        speed: 2 + Math.random() * 3,
        trail: []
      };
      setRockets(prev => [...prev, newRocket]);
    };

    const interval = setInterval(spawnRocket, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animate rockets
  useEffect(() => {
    const animateRockets = () => {
      setRockets(prev => prev
        .map(rocket => ({
          ...rocket,
          x: rocket.x + rocket.speed,
          trail: [...rocket.trail.slice(-8), { x: rocket.x, y: rocket.y }]
        }))
        .filter(rocket => rocket.x < window.innerWidth + 100)
      );
    };

    const animationFrame = setInterval(animateRockets, 50);
    return () => clearInterval(animationFrame);
  }, []);

  const getTileColor = (index) => {
    if (hoveredTile === index) {
      const colors = ['bg-pink-500/40', 'bg-purple-500/40', 'bg-cyan-500/40', 'bg-yellow-500/40'];
      return colors[index % colors.length];
    }
    return 'hover:bg-blue-500/30';
  };

  return (
    <section className="relative h-96 overflow-hidden border-b-4 border-pink-500 border-dotted">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900 opacity-70"></div>
      
      {/* Animated pixel grid */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-20">
        {Array(144).fill(0).map((_, i) => (
          <div 
            key={i} 
            className={`border border-blue-500/20 transition-all duration-300 cursor-pointer ${getTileColor(i)}`}
            onMouseEnter={() => setHoveredTile(i)}
            onMouseLeave={() => setHoveredTile(null)}
          />
        ))}
      </div>

      {/* Flying rockets */}
      {rockets.map(rocket => (
        <div key={rocket.id} className="absolute pointer-events-none z-5">
          {/* Rocket trail */}
          {rocket.trail.map((point, idx) => (
            <div
              key={idx}
              className="absolute w-1 h-1 bg-orange-400 rounded-full opacity-60"
              style={{
                left: point.x - idx * 3,
                top: point.y,
                opacity: (idx + 1) / rocket.trail.length * 0.6
              }}
            />
          ))}
          
          {/* Rocket */}
          <div
            className="absolute text-2xl animate-pulse"
            style={{ left: rocket.x, top: rocket.y }}
          >
            🚀
          </div>
          
          {/* Rocket glow */}
          <div
            className="absolute w-8 h-8 bg-orange-400/30 rounded-full blur-sm"
            style={{ left: rocket.x - 4, top: rocket.y - 4 }}
          />
        </div>
      ))}

      {/* Floating particles */}
      <div className="absolute inset-0 z-5">
        {Array(20).fill(0).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-300/60 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
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
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </section>
  );
}