'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const DEFAULT_CANVAS_SIZE = 32;
const DEFAULT_PIXEL_SIZE = 16;
const COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
  '#FFFF00', '#FF00FF', '#00FFFF', '#FF9900', '#9900FF',
  '#FF6666', '#66FF66', '#6666FF', '#FFFF66', '#FF66FF',
  '#66FFFF', '#996633', '#663399', '#999999', '#CCCCCC'
];

export default function CreatorStudio() {
  const [canvasSize, setCanvasSize] = useState(DEFAULT_CANVAS_SIZE);
  const [pixelSize, setPixelSize] = useState(DEFAULT_PIXEL_SIZE);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [currentTool, setCurrentTool] = useState('pencil');
  const [isDrawing, setIsDrawing] = useState(false);
  const [pixels, setPixels] = useState(Array(canvasSize * canvasSize).fill('#FFFFFF'));
  const [history, setHistory] = useState([Array(canvasSize * canvasSize).fill('#FFFFFF')]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [artworkName, setArtworkName] = useState('Untitled Artwork');
  const [artworkDescription, setArtworkDescription] = useState('');
  const [artworkPrice, setArtworkPrice] = useState('0.05');
  const [artworkTags, setArtworkTags] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  const canvasRef = useRef(null);
  
  useEffect(() => {
    // Initialize empty canvas
    resetCanvas();
  }, [canvasSize]);
  
  const resetCanvas = () => {
    const newPixels = Array(canvasSize * canvasSize).fill('#FFFFFF');
    setPixels(newPixels);
    setHistory([newPixels]);
    setHistoryIndex(0);
  };
  
  const handlePixelClick = (index) => {
    if (currentTool === 'pencil') {
      const newPixels = [...pixels];
      newPixels[index] = selectedColor;
      setPixels(newPixels);
      addToHistory(newPixels);
    } else if (currentTool === 'eraser') {
      const newPixels = [...pixels];
      newPixels[index] = '#FFFFFF';
      setPixels(newPixels);
      addToHistory(newPixels);
    } else if (currentTool === 'eyedropper') {
      setSelectedColor(pixels[index]);
      setCurrentTool('pencil');
    }
  };
  
  const handleMouseDown = (index) => {
    setIsDrawing(true);
    handlePixelClick(index);
  };
  
  const handleMouseOver = (index) => {
    if (isDrawing) {
      handlePixelClick(index);
    }
  };
  
  const handleMouseUp = () => {
    setIsDrawing(false);
  };
  
  const addToHistory = (newPixels) => {
    // Remove any future history if we're in the middle of the history array
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newPixels);
    
    // Limit history to 50 states to prevent memory issues
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPixels(history[historyIndex - 1]);
    }
  };
  
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPixels(history[historyIndex + 1]);
    }
  };
  
  const fillBucket = (startIndex, targetColor, newColor) => {
    if (targetColor === newColor) return;
    
    const stack = [startIndex];
    const newPixels = [...pixels];
    const width = canvasSize;
    
    while (stack.length > 0) {
      const currentIndex = stack.pop();
      if (currentIndex < 0 || currentIndex >= pixels.length) continue;
      if (newPixels[currentIndex] !== targetColor) continue;
      
      newPixels[currentIndex] = newColor;
      
      const row = Math.floor(currentIndex / width);
      const col = currentIndex % width;
      
      // Check neighbors (up, down, left, right)
      if (row > 0) stack.push(currentIndex - width); // up
      if (row < width - 1) stack.push(currentIndex + width); // down
      if (col > 0) stack.push(currentIndex - 1); // left
      if (col < width - 1) stack.push(currentIndex + 1); // right
    }
    
    setPixels(newPixels);
    addToHistory(newPixels);
  };
  
  const handleFill = (index) => {
    fillBucket(index, pixels[index], selectedColor);
  };
  
  const exportAsPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d');
    
    // Draw pixels to canvas
    for (let i = 0; i < pixels.length; i++) {
      const row = Math.floor(i / canvasSize);
      const col = i % canvasSize;
      ctx.fillStyle = pixels[i];
      ctx.fillRect(col, row, 1, 1);
    }
    
    // Convert to data URL and download
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${artworkName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = dataURL;
    link.click();
  };
  
  const exportAsSpriteSheet = () => {
    // Simplified for demo - in production this would create a proper sprite sheet
    exportAsPNG();
  };
  
  const saveArtwork = () => {
    // In a real implementation, this would save to your backend/database
    alert(`Artwork "${artworkName}" saved successfully! In a real implementation, this would connect to your backend.`);
    setShowPreview(false);
  };
  
  const publishToMarketplace = () => {
    // In a real implementation, this would publish to your marketplace
    alert(`Artwork "${artworkName}" published to marketplace for ${artworkPrice} ETH! In a real implementation, this would connect to your backend and blockchain.`);
    setShowPreview(false);
  };
  
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 py-4 px-6 border-b border-pink-500 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-cyan-300">PIXEL MARKETPLACE</Link>
        <div className="flex items-center space-x-4">
          <button 
            className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-600 transition"
            onClick={() => setShowPreview(true)}
          >
            Preview & Publish
          </button>
        </div>
      </header>
      
      <div className="flex">
        {/* Toolbox Sidebar */}
        <div className="w-64 bg-gray-900 p-4 h-screen border-r border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-cyan-300">Tools</h2>
          
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2 text-gray-300">Drawing Tools</h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button 
                className={`p-2 transition ${currentTool === 'pencil' ? 'bg-pink-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                onClick={() => setCurrentTool('pencil')}
              >
                Pencil
              </button>
              <button 
                className={`p-2 transition ${currentTool === 'eraser' ? 'bg-pink-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                onClick={() => setCurrentTool('eraser')}
              >
                Eraser
              </button>
              <button 
                className={`p-2 transition ${currentTool === 'fill' ? 'bg-pink-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                onClick={() => setCurrentTool('fill')}
              >
                Fill
              </button>
              <button 
                className={`p-2 transition ${currentTool === 'eyedropper' ? 'bg-pink-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                onClick={() => setCurrentTool('eyedropper')}
              >
                Eyedropper
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2 text-gray-300">Canvas Size</h3>
            <select 
              className="w-full p-2 bg-gray-800 rounded"
              value={canvasSize}
              onChange={(e) => setCanvasSize(parseInt(e.target.value))}
            >
              <option value="16">16x16</option>
              <option value="32">32x32</option>
              <option value="64">64x64</option>
            </select>
          </div>
          
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2 text-gray-300">Colors</h3>
            <div className="grid grid-cols-5 gap-2">
              {COLORS.map((color, index) => (
                <button 
                  key={index} 
                  className={`w-8 h-8 rounded-sm ${selectedColor === color ? 'ring-2 ring-white' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2 text-gray-300">History</h3>
            <div className="flex space-x-2">
              <button 
                className="p-2 bg-gray-800 hover:bg-gray-700 flex-1"
                onClick={undo}
                disabled={historyIndex === 0}
              >
                Undo
              </button>
              <button 
                className="p-2 bg-gray-800 hover:bg-gray-700 flex-1"
                onClick={redo}
                disabled={historyIndex === history.length - 1}
              >
                Redo
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2 text-gray-300">Actions</h3>
            <div className="grid grid-cols-1 gap-2">
              <button 
                className="p-2 bg-cyan-800 hover:bg-cyan-700 transition"
                onClick={resetCanvas}
              >
                Clear Canvas
              </button>
              <button 
                className="p-2 bg-purple-800 hover:bg-purple-700 transition"
                onClick={exportAsPNG}
              >
                Export PNG
              </button>
              <button 
                className="p-2 bg-purple-800 hover:bg-purple-700 transition"
                onClick={exportAsSpriteSheet}
              >
                Export Sprite Sheet
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Canvas Area */}
        <div className="flex-1 p-8 bg-gray-800 flex flex-col items-center justify-center">
          <div 
            className="bg-white shadow-xl border border-gray-900"
            style={{ 
              display: 'grid',
              gridTemplateColumns: `repeat(${canvasSize}, ${pixelSize}px)`,
              width: canvasSize * pixelSize,
              height: canvasSize * pixelSize
            }}
            ref={canvasRef}
            onMouseLeave={handleMouseUp}
          >
            {pixels.map((color, index) => (
              <div
                key={index}
                style={{ 
                  backgroundColor: color,
                  width: pixelSize,
                  height: pixelSize,
                  boxSizing: 'border-box',
                  border: '1px solid rgba(0,0,0,0.1)'
                }}
                onMouseDown={() => handleMouseDown(index)}
                onMouseOver={() => handleMouseOver(index)}
                onMouseUp={handleMouseUp}
                onClick={() => {
                  if (currentTool === 'fill') {
                    handleFill(index);
                  }
                }}
              />
            ))}
          </div>
          
          <div className="mt-4 text-gray-400 text-sm">
            {canvasSize}x{canvasSize} pixels | {currentTool} tool | {selectedColor}
          </div>
        </div>
      </div>
      
      {/* Preview and Publish Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-cyan-300">Preview & Publish</h2>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setShowPreview(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="flex mb-6">
              <div className="w-1/3 bg-gray-800 p-4 flex items-center justify-center">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${canvasSize}, 1px)`,
                    width: canvasSize,
                    height: canvasSize,
                    transform: 'scale(4)',
                    transformOrigin: 'top left'
                  }}
                >
                  {pixels.map((color, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: color,
                        width: '1px',
                        height: '1px'
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="w-2/3 pl-6">
                <div className="mb-4">
                  <label className="block text-gray-300 mb-1">Artwork Name</label>
                  <input
                    type="text"
                    className="w-full p-2 bg-gray-800 border border-gray-700"
                    value={artworkName}
                    onChange={(e) => setArtworkName(e.target.value)}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 mb-1">Description</label>
                  <textarea
                    className="w-full p-2 bg-gray-800 border border-gray-700 h-20"
                    value={artworkDescription}
                    onChange={(e) => setArtworkDescription(e.target.value)}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 mb-1">Price (ETH)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full p-2 bg-gray-800 border border-gray-700"
                    value={artworkPrice}
                    onChange={(e) => setArtworkPrice(e.target.value)}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="w-full p-2 bg-gray-800 border border-gray-700"
                    value={artworkTags}
                    onChange={(e) => setArtworkTags(e.target.value)}
                    placeholder="pixel, cyberpunk, character, etc."
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 transition"
                onClick={() => setShowPreview(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 transition"
                onClick={saveArtwork}
              >
                Save Draft
              </button>
              <button
                className="px-4 py-2 bg-pink-600 hover:bg-pink-500 transition"
                onClick={publishToMarketplace}
              >
                Publish to Marketplace
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}