import React, { useState } from 'react';

const PixelMarketplace = () => {
  const [currentTool, setCurrentTool] = useState('pencil');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [canvasSize, setCanvasSize] = useState('32x32');
  const [showItemsBrowser, setShowItemsBrowser] = useState(false);
  
  // Pre-made pixel items/weapons for the browser
  const premadeItems = [
    { id: 1, name: 'Pixel Sword', thumbnail: '/sword.png', category: 'weapon' },
    { id: 2, name: 'Pixel Shield', thumbnail: '/shield.png', category: 'weapon' },
    { id: 3, name: 'Gold Coin', thumbnail: '/coin.png', category: 'item' },
    { id: 4, name: 'Health Potion', thumbnail: '/potion.png', category: 'item' },
    { id: 5, name: 'Fireball', thumbnail: '/fireball.png', category: 'spell' },
    { id: 6, name: 'Bow', thumbnail: '/bow.png', category: 'weapon' },
    { id: 7, name: 'Axe', thumbnail: '/axe.png', category: 'weapon' },
    { id: 8, name: 'Magic Staff', thumbnail: '/staff.png', category: 'weapon' },
    { id: 9, name: 'Treasure Chest', thumbnail: '/chest.png', category: 'item' },
  ];
  
  const [itemFilter, setItemFilter] = useState('all');
  
  const filteredItems = itemFilter === 'all' 
    ? premadeItems 
    : premadeItems.filter(item => item.category === itemFilter);
  
  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#ADFF2F', '#8A2BE2', '#F0E68C', '#FF69B4',
    '#00FFFF', '#8B4513', '#4B0082', '#808080', '#A9A9A9'
  ];
  
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/pixel-icon.png" alt="Logo" className="h-8 w-8 mr-2" />
          <h1 className="text-cyan-400 text-2xl font-bold">PIXEL MARKETPLACE</h1>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">
          Preview & Publish
        </button>
      </header>
      
      <div className="flex">
        {/* Left sidebar */}
        <div className="w-64 bg-gray-800 p-4">
          <div className="mb-6">
            <h2 className="text-xl mb-2">Tools</h2>
            <p className="text-sm text-gray-400 mb-2">Drawing Tools</p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button 
                className={`p-2 ${currentTool === 'pencil' ? 'bg-pink-600' : 'bg-gray-700'} hover:bg-pink-700 rounded`}
                onClick={() => setCurrentTool('pencil')}
              >
                Pencil
              </button>
              <button 
                className={`p-2 ${currentTool === 'eraser' ? 'bg-pink-600' : 'bg-gray-700'} hover:bg-pink-700 rounded`}
                onClick={() => setCurrentTool('eraser')}
              >
                Eraser
              </button>
              <button 
                className={`p-2 ${currentTool === 'fill' ? 'bg-pink-600' : 'bg-gray-700'} hover:bg-pink-700 rounded`}
                onClick={() => setCurrentTool('fill')}
              >
                Fill
              </button>
              <button 
                className={`p-2 ${currentTool === 'eyedropper' ? 'bg-pink-600' : 'bg-gray-700'} hover:bg-pink-700 rounded`}
                onClick={() => setCurrentTool('eyedropper')}
              >
                Eyedropper
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl mb-2">Canvas Size</h2>
            <select 
              className="w-full bg-gray-700 p-2 rounded"
              value={canvasSize}
              onChange={(e) => setCanvasSize(e.target.value)}
            >
              <option value="16x16">16x16</option>
              <option value="32x32">32x32</option>
              <option value="64x64">64x64</option>
            </select>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl mb-2">Colors</h2>
            <div className="grid grid-cols-5 gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  className={`h-8 w-8 rounded-sm ${currentColor === color ? 'ring-2 ring-white' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                />
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl mb-2">History</h2>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded">
                Undo
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded">
                Redo
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl mb-2">Actions</h2>
            <button className="w-full bg-teal-700 hover:bg-teal-600 p-2 rounded mb-2">
              Clear Canvas
            </button>
            <button className="w-full bg-indigo-700 hover:bg-indigo-600 p-2 rounded mb-2">
              Export PNG
            </button>
            <button className="w-full bg-purple-700 hover:bg-purple-600 p-2 rounded mb-2">
              Export Sprite Sheet
            </button>
            
            {/* New button to toggle pre-made items browser */}
            <button 
              className="w-full bg-pink-600 hover:bg-pink-500 p-2 rounded"
              onClick={() => setShowItemsBrowser(!showItemsBrowser)}
            >
              {showItemsBrowser ? 'Hide Pre-made Items' : 'Browse Pre-made Items'}
            </button>
          </div>
        </div>
        
        {/* Main canvas area */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex-1 flex justify-center items-center">
            {/* Grid canvas */}
            <div 
              className="bg-white rounded border-2 border-gray-600"
              style={{
                width: '480px',
                height: '480px',
                backgroundImage: 'linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)',
                backgroundSize: `${480/parseInt(canvasSize)}px ${480/parseInt(canvasSize)}px`
              }}
            >
              {/* Canvas content would be rendered here */}
            </div>
          </div>
          
          <div className="text-center mt-2 text-gray-400">
            {canvasSize} pixels | {currentTool} tool | {currentColor}
          </div>
        </div>
        
        {/* Pre-made items browser (conditionally rendered) */}
        {showItemsBrowser && (
          <div className="w-72 bg-gray-800 p-4 border-l border-gray-700">
            <h2 className="text-xl mb-4">Pre-made Pixel Art</h2>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Filter by Category:</label>
              <select 
                className="w-full bg-gray-700 p-2 rounded"
                value={itemFilter}
                onChange={(e) => setItemFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="weapon">Weapons</option>
                <option value="item">Items</option>
                <option value="spell">Spells</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  className="bg-gray-700 p-2 rounded hover:bg-gray-600 cursor-pointer transition"
                >
                  <div className="bg-black w-full h-24 mb-2 flex items-center justify-center">
                    {/* Placeholder for item images */}
                    <div className="text-xs text-center text-gray-400">[{item.name} Preview]</div>
                  </div>
                  <p className="text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{item.category}</p>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 p-2 rounded">
              Import Selected Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PixelMarketplace;