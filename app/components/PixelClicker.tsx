import React, { useState, useEffect, useRef } from 'react';

const PixelClicker = () => {
  // Game state
  const [pixels, setPixels] = useState(0);
  const [clickValue, setClickValue] = useState(1);
  const [autoClickValue, setAutoClickValue] = useState(0);
  const [shopItems, setShopItems] = useState([
    {
      id: 'better-click',
      name: 'Pixel Brush',
      baseCost: 10,
      cost: 10,
      description: 'Collect more pixels per click',
      count: 0,
      maxCount: 10,
    },
    {
      id: 'auto-click',
      name: 'Auto Painter',
      baseCost: 25,
      cost: 25,
      description: 'Automatically collects pixels',
      count: 0,
      maxCount: 10,
    },
    {
      id: 'double-click',
      name: 'Double Pixel',
      baseCost: 100,
      cost: 100,
      description: 'Doubles your click value',
      count: 0,
      maxCount: 5,
    },
    {
      id: 'rainbow-pixels',
      name: 'Rainbow Pixels',
      baseCost: 500,
      cost: 500,
      description: 'Makes pixels much more valuable',
      count: 0,
      maxCount: 1,
    }
  ]);
  
  // Refs for animation elements
  const clickerRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [clickIndicators, setClickIndicators] = useState([]);
  const [rainbowMode, setRainbowMode] = useState(false);
  
  // Auto-clicker effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoClickValue > 0) {
        setPixels(prev => prev + autoClickValue);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [autoClickValue]);
  
  // Click handler
  const handleClick = () => {
    // Add pixels
    setPixels(prev => prev + clickValue);
    
    // Create click indicator
    const newIndicator = {
      id: Date.now() + Math.random(),
      value: clickValue,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10
    };
    
    setClickIndicators(prev => [...prev, newIndicator]);
    
    // Remove indicator after animation
    setTimeout(() => {
      setClickIndicators(prev => prev.filter(indicator => indicator.id !== newIndicator.id));
    }, 1000);
    
    // Create particles
    const newParticles = [];
    for (let i = 0; i < 5; i++) {
      const xPos = Math.random() * 100;
      const yPos = Math.random() * 100;
      const xDirection = Math.random() > 0.5 ? 1 : -1;
      const yDirection = Math.random() > 0.5 ? 1 : -1;
      
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x: xPos,
        y: yPos,
        xDest: xPos + (Math.random() * 50 + 20) * xDirection,
        yDest: yPos + (Math.random() * 50 + 20) * yDirection,
        color: getRandomColor()
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
    
    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(particle => !newParticles.includes(particle)));
    }, 1000);
  };
  
  // Buy upgrade handler
  const buyUpgrade = (item) => {
    if (pixels >= item.cost && item.count < item.maxCount) {
      // Deduct cost
      setPixels(prev => prev - item.cost);
      
      // Update shop item
      setShopItems(prev => prev.map(shopItem => {
        if (shopItem.id === item.id) {
          const newCount = shopItem.count + 1;
          const newCost = Math.floor(shopItem.baseCost * Math.pow(1.5, newCount));
          
          return {
            ...shopItem,
            count: newCount,
            cost: newCost
          };
        }
        return shopItem;
      }));
      
      // Apply effects
      switch (item.id) {
        case 'better-click':
          setClickValue(prev => prev + 1);
          break;
        case 'auto-click':
          setAutoClickValue(prev => prev + 1);
          break;
        case 'double-click':
          setClickValue(prev => prev * 2);
          break;
        case 'rainbow-pixels':
          setClickValue(prev => prev * 5);
          setRainbowMode(true);
          break;
        default:
          break;
      }
    }
  };
  
  // Get random color for particles
  const getRandomColor = () => {
    const colors = ['#9d4edd', '#00f5d4', '#ff9e00', '#ff5e5b', '#7b2cbf'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 min-h-full">
      <div className="w-full max-w-lg border-2 border-purple-500 shadow-lg shadow-purple-500/30 bg-gray-800">
        {/* Game header */}
        <div className="flex justify-between p-2 bg-black bg-opacity-50">
          <div>
            <div className="text-sm font-bold">PIXELS: <span className="text-cyan-400">{Math.floor(pixels)}</span></div>
            <div className="text-sm font-bold">PER CLICK: <span className="text-cyan-400">{clickValue}</span></div>
          </div>
          <div>
            <div className="text-sm font-bold">PER SECOND: <span className="text-cyan-400">{autoClickValue}</span></div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex flex-row">
          {/* Clicker area */}
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div 
              ref={clickerRef}
              className="w-32 h-32 relative overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              onClick={handleClick}
              style={{
                background: rainbowMode 
                  ? 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)'
                  : '#9d4edd'
              }}
            >
              {/* Pixel parts */}
              <div className="absolute inset-0">
                {Array(100).fill(0).map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-3 h-3 bg-purple-500"
                    style={{
                      left: `${Math.floor(i % 10) * 12 + 6}px`,
                      top: `${Math.floor(i / 10) * 12 + 6}px`,
                      opacity: Math.random() * 0.5 + 0.5
                    }}
                  />
                ))}
              </div>
              
              {/* Click indicators */}
              {clickIndicators.map(indicator => (
                <div
                  key={indicator.id}
                  className="absolute text-sm font-bold text-cyan-400 animate-float-up"
                  style={{
                    left: `${indicator.x}%`,
                    top: `${indicator.y}%`,
                  }}
                >
                  +{indicator.value}
                </div>
              ))}
              
              {/* Particles */}
              {particles.map(particle => (
                <div
                  key={particle.id}
                  className="absolute w-1 h-1"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    backgroundColor: particle.color,
                    transform: `translate(0, 0)`,
                    animation: 'particle-animation 1s ease-out forwards'
                  }}
                />
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-300">Click to collect pixels!</div>
          </div>
          
          {/* Shop area */}
          <div className="w-48 bg-black bg-opacity-30 p-2 max-h-64 overflow-y-auto">
            <h3 className="text-sm font-bold mb-2">PIXEL SHOP</h3>
            {shopItems.map(item => {
              const disabled = pixels < item.cost || item.count >= item.maxCount;
              
              return (
                <div
                  key={item.id}
                  className={`p-2 mb-2 rounded cursor-pointer transition-colors ${
                    disabled 
                      ? 'bg-purple-900 bg-opacity-30 opacity-50 cursor-not-allowed' 
                      : 'bg-purple-800 bg-opacity-30 hover:bg-purple-700 hover:bg-opacity-50'
                  }`}
                  onClick={() => !disabled && buyUpgrade(item)}
                >
                  <div className="text-xs font-bold">
                    {item.name} {item.count > 0 && `(${item.count})`}
                  </div>
                  <div className="text-xs text-cyan-400">{item.cost} pixels</div>
                  <div className="text-xs text-gray-400">{item.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-50px);
            opacity: 0;
          }
        }
        
        @keyframes particle-animation {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(${props => props.x}px, ${props => props.y}px);
            opacity: 0;
          }
        }
        
        .animate-float-up {
          animation: float-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PixelClicker;