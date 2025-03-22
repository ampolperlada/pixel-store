"use client";

import React, { useState, useRef, useEffect } from 'react';

interface Pixel {
  x: number;
  y: number;
  color: string;
}

interface PremadeItem {
  id: number;
  name: string;
  thumbnail: string;
  category: string;
  color: string;
}

const PixelMarketplace: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<string>('pencil');
  const [currentColor, setCurrentColor] = useState<string>('#000000');
  const [canvasSize, setCanvasSize] = useState<string>('32x32');
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [history, setHistory] = useState<Pixel[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hoveredPixel, setHoveredPixel] = useState<{ x: number; y: number } | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  // Pre-made pixel items/weapons for the browser
  const premadeItems: PremadeItem[] = [
    { id: 1, name: 'Pixel Sword', thumbnail: '/sword.png', category: 'weapon', color: '#FF5722' },
    { id: 2, name: 'Pixel Shield', thumbnail: '/shield.png', category: 'weapon', color: '#2196F3' },
    { id: 3, name: 'Gold Coin', thumbnail: '/coin.png', category: 'item', color: '#FFC107' },
    { id: 4, name: 'Health Potion', thumbnail: '/potion.png', category: 'item', color: '#E91E63' },
    { id: 5, name: 'Fireball', thumbnail: '/fireball.png', category: 'spell', color: '#FF9800' },
    { id: 6, name: 'Bow', thumbnail: '/bow.png', category: 'weapon', color: '#8BC34A' },
    { id: 7, name: 'Axe', thumbnail: '/axe.png', category: 'weapon', color: '#795548' },
    { id: 8, name: 'Magic Staff', thumbnail: '/staff.png', category: 'weapon', color: '#9C27B0' },
    { id: 9, name: 'Treasure Chest', thumbnail: '/chest.png', category: 'item', color: '#FFEB3B' },
  ];
  
  const [itemFilter, setItemFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<PremadeItem | null>(null);
  
  const filteredItems = itemFilter === 'all' 
    ? premadeItems 
    : premadeItems.filter(item => item.category === itemFilter);
  
  // Color palettes with unique keys
  const colorPalettes: { [key: string]: string[] } = {
    basic: [
      '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
      '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    ],
    pastel: [
      '#FFD1DC', '#FFABAB', '#FFC3A0', '#FF677D', '#D4A5A5',
      '#F0E68C', '#77DD77', '#AEC6CF', '#B39EB5', '#FDFD96',
    ],
    vibrant: [
      '#FF5722', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
      '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
    ],
    dark: [
      '#263238', '#37474F', '#455A64', '#546E7A', '#607D8B',
      '#78909C', '#90A4AE', '#B0BEC5', '#CFD8DC', '#ECEFF1',
    ]
  };
  
  const [currentPalette, setCurrentPalette] = useState<string>('basic');
  const colors = colorPalettes[currentPalette];
  
  // Initialize canvas
  useEffect(() => {
    initializeCanvas();
  }, [canvasSize]);

  // Add to history whenever pixels change
  useEffect(() => {
    if (pixels.length > 0) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push([...pixels]);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [pixels]);

  const initializeCanvas = () => {
    const pixelCount = parseInt(canvasSize.split('x')[0]);
    const newPixels: Pixel[] = [];
    setPixels(newPixels);
    setHistory([[...newPixels]]);
    setHistoryIndex(0);
  };

  const getPixelSize = (): number => {
    const pixelCount = parseInt(canvasSize.split('x')[0]);
    // Increased canvas size
    return 600 / pixelCount;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const pixelSize = getPixelSize();
    const pixelCount = parseInt(canvasSize.split('x')[0]);
    
    const x = Math.floor((e.clientX - rect.left) / pixelSize);
    const y = Math.floor((e.clientY - rect.top) / pixelSize);
    
    if (x >= 0 && x < pixelCount && y >= 0 && y < pixelCount) {
      const pixelIndex = y * pixelCount + x;
      
      if (currentTool === 'pencil') {
        const newPixels = [...pixels];
        newPixels[pixelIndex] = {
          x,
          y,
          color: currentColor
        };
        setPixels(newPixels);
      } else if (currentTool === 'eraser') {
        const newPixels = [...pixels];
        delete newPixels[pixelIndex];
        setPixels(newPixels);
      } else if (currentTool === 'eyedropper') {
        const pixel = pixels[pixelIndex];
        if (pixel && pixel.color) {
          setCurrentColor(pixel.color);
        }
      } else if (currentTool === 'fill') {
        // Simple flood fill
        const targetColor = pixels[pixelIndex]?.color || null;
        if (targetColor !== currentColor) {
          const newPixels = [...pixels];
          floodFill(newPixels, x, y, targetColor, currentColor, pixelCount);
          setPixels(newPixels);
        }
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDrawing(true);
    handleCanvasClick(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const pixelSize = getPixelSize();
    const pixelCount = parseInt(canvasSize.split('x')[0]);
    
    const x = Math.floor((e.clientX - rect.left) / pixelSize);
    const y = Math.floor((e.clientY - rect.top) / pixelSize);
    
    if (x >= 0 && x < pixelCount && y >= 0 && y < pixelCount) {
      setHoveredPixel({ x, y });
      
      if (isDrawing) {
        handleCanvasClick(e);
      }
    } else {
      setHoveredPixel(null);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const floodFill = (pixelsArray: Pixel[], x: number, y: number, targetColor: string | null, replacementColor: string, pixelCount: number) => {
    const stack = [{x, y}];
    const visited = new Set<string>();
    
    while (stack.length > 0) {
      const current = stack.pop();
      if (!current) continue;
      const cx = current.x;
      const cy = current.y;
      const pixelIndex = cy * pixelCount + cx;
      const key = `${cx},${cy}`;
      
      if (
        cx < 0 || cx >= pixelCount || 
        cy < 0 || cy >= pixelCount || 
        visited.has(key)
      ) {
        continue;
      }
      
      visited.add(key);
      
      const currentPixel = pixelsArray[pixelIndex];
      const currentColor = currentPixel?.color || null;
      
      if (currentColor === replacementColor) continue;
      if (targetColor !== null && currentColor !== targetColor) continue;
      
      // Replace color
      pixelsArray[pixelIndex] = {
        x: cx,
        y: cy,
        color: replacementColor
      };
      
      // Add neighbors to stack
      stack.push({x: cx + 1, y: cy});
      stack.push({x: cx - 1, y: cy});
      stack.push({x: cx, y: cy + 1});
      stack.push({x: cx, y: cy - 1});
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPixels([...history[historyIndex - 1]]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPixels([...history[historyIndex + 1]]);
    }
  };

  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      setPixels([]);
    }
  };

  const exportAsPNG = () => {
    const canvas = document.createElement('canvas');
    const pixelCount = parseInt(canvasSize.split('x')[0]);
    canvas.width = pixelCount;
    canvas.height = pixelCount;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Fill with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw pixels
    pixels.forEach(pixel => {
      if (pixel && pixel.color) {
        ctx.fillStyle = pixel.color;
        ctx.fillRect(pixel.x, pixel.y, 1, 1);
      }
    });
    
    // Convert to data URL and download
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `pixel-art-${canvasSize}.png`;
    link.href = dataURL;
    link.click();
  };

  const exportSpriteSheet = () => {
    alert('Sprite sheet export functionality would go here');
  };

  const importSelectedItem = () => {
    if (selectedItem) {
      alert(`Importing ${selectedItem.name}`);
      // In a full implementation, we would add pixel data from the selected item
    } else {
      alert('Please select an item first');
    }
  };

  const getToolIcon = (tool: string): string => {
    switch(tool) {
      case 'pencil': return '✏️';
      case 'eraser': return '🧹';
      case 'fill': return '🪣';
      case 'eyedropper': return '👁️';
      default: return '✏️';
    }
  };
  
  const themeClass = darkMode ? 
    'bg-gray-900 text-white' : 
    'bg-gray-100 text-gray-900';
  
  const sidebarClass = darkMode ? 
    'bg-gray-800 border-gray-700' : 
    'bg-white border-gray-300';
    
  const buttonClass = darkMode ?
    'bg-indigo-600 hover:bg-indigo-700 text-white' :
    'bg-indigo-500 hover:bg-indigo-600 text-white';
    
  const secondaryButtonClass = darkMode ?
    'bg-gray-700 hover:bg-gray-600 text-white' :
    'bg-gray-200 hover:bg-gray-300 text-gray-700';
    
  const selectedButtonClass = darkMode ?
    'bg-pink-600 hover:bg-pink-700 text-white' :
    'bg-pink-500 hover:bg-pink-600 text-white';
  
  return (
    <div className={`${themeClass} min-h-screen transition-colors duration-300`}>
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white border-b border-gray-300'} p-4 flex justify-between items-center shadow-md`}>
        <div className="flex items-center">
          <div className="h-10 w-10 mr-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-xl">
            🎮
          </div>
          <h1 className={`${darkMode ? 'text-cyan-400' : 'text-indigo-600'} text-2xl font-bold`}>PIXEL MARKETPLACE</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className={`${secondaryButtonClass} px-3 py-2 rounded-md flex items-center`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button className={`${buttonClass} px-4 py-2 rounded-md font-medium`}>
            Preview & Publish
          </button>
        </div>
      </header>
      
      <div className="flex">
        {/* Left sidebar */}
        <div className={`w-64 ${sidebarClass} p-5 shadow-md ${darkMode ? '' : 'border-r'}`}>
          <div className="mb-7">
            <h2 className="text-xl font-bold mb-3 flex items-center">
              <span className="mr-2">🖌️</span> Tools
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {['pencil', 'eraser', 'fill', 'eyedropper'].map(tool => (
                <button 
                  key={tool}
                  className={`p-3 ${currentTool === tool ? selectedButtonClass : secondaryButtonClass} rounded-lg flex items-center justify-center transition-colors`}
                  onClick={() => setCurrentTool(tool)}
                >
                  <span className="mr-2">{getToolIcon(tool)}</span>
                  <span className="capitalize">{tool}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-7">
            <h2 className="text-xl font-bold mb-3 flex items-center">
              <span className="mr-2">📐</span> Canvas Size
            </h2>
            <select 
              className={`w-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} p-3 rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
              value={canvasSize}
              onChange={(e) => setCanvasSize(e.target.value)}
            >
              <option value="16x16">16x16 - Small</option>
              <option value="32x32">32x32 - Medium</option>
              <option value="64x64">64x64 - Large</option>
            </select>
          </div>
          
          <div className="mb-7">
            <h2 className="text-xl font-bold mb-3 flex items-center">
              <span className="mr-2">🎨</span> Colors
            </h2>
            
            <div className="flex mb-3 overflow-x-auto space-x-2 pb-1">
              {Object.keys(colorPalettes).map(palette => (
                <button
                  key={palette}
                  className={`px-3 py-1 rounded-full whitespace-nowrap text-sm ${
                    currentPalette === palette 
                      ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white') 
                      : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')
                  }`}
                  onClick={() => setCurrentPalette(palette)}
                >
                  {palette.charAt(0).toUpperCase() + palette.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  className={`h-10 w-full rounded-md ${currentColor === color ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                />
              ))}
            </div>
            
            <div className="mt-3">
              <input
                type="color"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="w-full h-10 rounded-md cursor-pointer"
              />
            </div>
          </div>
          
          <div className="mb-7">
            <h2 className="text-xl font-bold mb-3 flex items-center">
              <span className="mr-2">⏱️</span> History
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button 
                className={`${secondaryButtonClass} p-3 rounded-lg ${historyIndex <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleUndo}
                disabled={historyIndex <= 0}
              >
                ↩️ Undo
              </button>
              <button 
                className={`${secondaryButtonClass} p-3 rounded-lg ${historyIndex >= history.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
              >
                ↪️ Redo
              </button>
            </div>
          </div>
          
          <div className="mb-7">
            <h2 className="text-xl font-bold mb-3 flex items-center">
              <span className="mr-2">🔄</span> Actions
            </h2>
            <div className="space-y-3">
              <button 
                className={`w-full ${darkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'} text-white p-3 rounded-lg font-medium`}
                onClick={clearCanvas}
              >
                🧹 Clear Canvas
              </button>
              <button 
                className={`w-full ${buttonClass} p-3 rounded-lg font-medium`}
                onClick={exportAsPNG}
              >
                💾 Export PNG
              </button>
              <button 
                className={`w-full ${buttonClass} p-3 rounded-lg font-medium`}
                onClick={exportSpriteSheet}
              >
                🗃️ Export Sprite Sheet
              </button>
            </div>
          </div>
        </div>
        
        {/* Main canvas area - ENLARGED */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="relative">
            {/* Canvas border and background */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow-lg`}>
              {/* Grid canvas - ENLARGED */}
              <div 
                ref={canvasRef}
                className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg overflow-hidden shadow-inner`}
                style={{
                  width: '600px',
                  height: '600px',
                  backgroundImage: `linear-gradient(to right, ${darkMode ? '#444' : '#ddd'} 1px, transparent 1px), linear-gradient(to bottom, ${darkMode ? '#444' : '#ddd'} 1px, transparent 1px)`,
                  backgroundSize: `${600/parseInt(canvasSize.split('x')[0])}px ${600/parseInt(canvasSize.split('x')[0])}px`,
                  position: 'relative'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Rendered pixels */}
                {pixels.map((pixel, index) => (
                  pixel && pixel.color && (
                    <div
                      key={`${pixel.x}-${pixel.y}`}
                      style={{
                        position: 'absolute',
                        left: pixel.x * getPixelSize(),
                        top: pixel.y * getPixelSize(),
                        width: getPixelSize(),
                        height: getPixelSize(),
                        backgroundColor: pixel.color
                      }}
                    />
                  )
                ))}
                
                {/* Hover indicator */}
                {hoveredPixel && (
                  <div
                    style={{
                      position: 'absolute',
                      left: hoveredPixel.x * getPixelSize(),
                      top: hoveredPixel.y * getPixelSize(),
                      width: getPixelSize(),
                      height: getPixelSize(),
                      border: `1px solid ${darkMode ? 'white' : 'black'}`,
                      pointerEvents: 'none',
                      opacity: 0.5
                    }}
                  />
                )}
              </div>
            </div>
            
            {/* Canvas info overlay */}
            <div className={`${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} py-2 px-4 rounded-lg shadow absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-4`}>
              <div className="flex items-center">
                <span className="text-sm">Size:</span>
                <span className="ml-1 font-medium">{canvasSize}</span>
              </div>
              <div className="h-4 border-r border-gray-500"></div>
              <div className="flex items-center">
                <span className="text-sm">Tool:</span>
                <span className="ml-1 font-medium flex items-center">
                  <span className="mr-1">{getToolIcon(currentTool)}</span>
                  <span className="capitalize">{currentTool}</span>
                </span>
              </div>
              <div className="h-4 border-r border-gray-500"></div>
              <div className="flex items-center">
                <span className="text-sm">Color:</span>
                <div 
                  className="ml-1 w-4 h-4 rounded-sm" 
                  style={{ backgroundColor: currentColor }}
                ></div>
                <span className="ml-1 font-mono text-xs">{currentColor.toUpperCase()}</span>
              </div>
            </div>
          </div>
          
          {hoveredPixel && (
            <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-3 text-sm`}>
              Position: x={hoveredPixel.x}, y={hoveredPixel.y}
            </div>
          )}
        </div>
        
        {/* Always visible pre-made items browser */}
        <div className={`w-80 ${sidebarClass} p-5 shadow-md ${darkMode ? '' : 'border-l'}`}>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">🏆</span> Pre-made Pixel Art
          </h2>
          
          <div className="mb-4">
            <label className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Filter by Category:</label>
            <select 
              className={`w-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} p-3 rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
              value={itemFilter}
              onChange={(e) => setItemFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="weapon">Weapons</option>
              <option value="item">Items</option>
              <option value="spell">Spells</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} p-3 rounded-xl cursor-pointer transition border-2 ${selectedItem?.id === item.id ? (darkMode ? 'border-cyan-500' : 'border-indigo-500') : 'border-transparent'}`}
                onClick={() => setSelectedItem(item)}
              >
                <div 
                  className="w-full h-24 mb-2 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: item.color + '33' }} // Adding transparency
                >
                  <div className="text-3xl">{
                    item.category === 'weapon' ? '⚔️' : 
                    item.category === 'item' ? '🎁' : '✨'
                  }</div>
                </div>
                <p className={`${darkMode ? 'text-white' : 'text-gray-800'} text-sm font-medium truncate`}>{item.name}</p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs capitalize flex items-center`}>
                  <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: item.color }}></span>
                  {item.category}
                </p>
              </div>
            ))}
          </div>
          
          <button 
            className={`w-full mt-4 ${buttonClass} p-3 rounded-lg font-medium ${!selectedItem ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={importSelectedItem}
            disabled={!selectedItem}
          >
            📥 Import {selectedItem ? selectedItem.name : 'Selected Item'}
          </button>
        </div>
      </div>
      
      {/* Status bar */}
      <div className={`${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600 border-t border-gray-300'} py-2 px-4 text-sm flex justify-between`}>
        <div>
          Pixels: {pixels.filter(Boolean).length} / {parseInt(canvasSize.split('x')[0]) * parseInt(canvasSize.split('x')[0])}
        </div>
        <div>
          History: {historyIndex + 1} / {history.length}
        </div>
        <div>
          Made with ❤️ in Pixel Marketplace
        </div>
      </div>
    </div>
  );
};

export default PixelMarketplace;