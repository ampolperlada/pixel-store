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

// NFT Asset categories
const ASSET_CATEGORIES = [
  'All', 'Medieval', 'Cyberpunk', 'Fantasy', 'SciFi', 'Animals', 'Weapons', 'Accessories'
];

// Sample NFT asset data - In a real app, this would come from your blockchain/backend
const NFT_ASSETS = [
  { 
    id: 'asset1', 
    name: 'Golden Sword', 
    category: 'Medieval',
    subcategory: 'Weapons',
    thumbnail: 'sword-thumb.png', 
    pixels: [
      [0,0,0,0,1,0,0,0],
      [0,0,0,0,1,0,0,0],
      [0,0,0,0,1,0,0,0],
      [0,0,0,0,1,0,0,0],
      [0,0,0,0,1,0,0,0],
      [0,0,1,1,1,1,1,0],
      [0,0,0,1,1,1,0,0],
      [0,0,0,0,1,0,0,0]
    ],
    colors: {
      '0': 'transparent',
      '1': '#FFD700',  // Gold color
      '2': '',
      '3': ''
    },
    owner: '0x1234...5678',
    price: 0.05
  },
  { 
    id: 'asset2', 
    name: 'Cyber Helmet', 
    category: 'Cyberpunk',
    subcategory: 'Accessories',
    thumbnail: 'helmet-thumb.png', 
    pixels: [
      [0,1,1,1,1,1,0],
      [1,1,2,2,2,1,1],
      [1,2,2,2,2,2,1],
      [1,2,3,2,3,2,1],
      [1,2,2,2,2,2,1],
      [0,1,1,1,1,1,0]
    ],
    colors: {
      '0': 'transparent',
      '1': '#333333',  // Dark gray
      '2': '#00FFFF',  // Cyan
      '3': '#FF0000'   // Red
    },
    owner: '0x9876...4321',
    price: 0.08
  },
  { 
    id: 'asset3', 
    name: 'Magic Staff', 
    category: 'Fantasy',
    subcategory: 'Weapons',
    thumbnail: 'staff-thumb.png', 
    pixels: [
      [0,0,0,0,1,0,0],
      [0,0,0,1,2,1,0],
      [0,0,1,2,1,0,0],
      [0,0,0,1,0,0,0],
      [0,0,0,1,0,0,0],
      [0,0,0,1,0,0,0],
      [0,0,0,1,0,0,0],
      [0,0,0,1,0,0,0]
    ],
    colors: {
      '0': 'transparent',
      '1': '#8A2BE2',  // Purple
      '2': '#FFFFFF',  // White
      '3': ''
    },
    owner: '0xABCD...EFGH',
    price: 0.12
  },
  { 
    id: 'asset4', 
    name: 'Cyberpunk Visor', 
    category: 'Cyberpunk',
    subcategory: 'Accessories',
    thumbnail: 'visor-thumb.png', 
    pixels: [
      [1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,1]
    ],
    colors: {
      '0': 'transparent',
      '1': '#222222',  // Black
      '2': '#FF00FF',  // Magenta
      '3': ''
    },
    owner: '0x1234...5678',
    price: 0.07
  },
  { 
    id: 'asset5', 
    name: 'Dragon', 
    category: 'Fantasy',
    subcategory: 'Animals',
    thumbnail: 'dragon-thumb.png', 
    pixels: [
      [0,0,0,1,1,0,0,0,0],
      [0,0,1,2,1,0,0,0,0],
      [0,1,2,2,1,0,0,0,0],
      [1,2,2,2,1,1,1,0,0],
      [1,2,2,2,2,2,2,1,0],
      [1,2,2,2,2,2,2,1,1],
      [0,1,1,1,1,1,1,3,1],
      [0,0,0,0,0,1,3,3,1],
      [0,0,0,0,0,0,1,1,0]
    ],
    colors: {
      '0': 'transparent',
      '1': '#8B0000',  // Dark Red
      '2': '#FF6347',  // Tomato Red
      '3': '#FFFF00'   // Yellow
    },
    owner: '0x5566...7788',
    price: 0.15
  },
  { 
    id: 'asset6', 
    name: 'Space Blaster', 
    category: 'SciFi',
    subcategory: 'Weapons',
    thumbnail: 'blaster-thumb.png', 
    pixels: [
      [0,0,0,0,1,1,0],
      [0,0,0,1,2,1,0],
      [0,0,1,2,2,1,0],
      [1,1,2,2,1,0,0],
      [1,3,1,1,0,0,0],
      [1,1,0,0,0,0,0]
    ],
    colors: {
      '0': 'transparent',
      '1': '#444444',  // Dark Gray
      '2': '#1E90FF',  // Dodger Blue
      '3': '#FF0000'   // Red
    },
    owner: '0x9876...4321',
    price: 0.09
  }
];

// Interface for NFT asset structure
interface NFTAsset {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  thumbnail: string;
  pixels: number[][];
  colors: {[key: string]: string};
  owner: string;
  price: number;
}

// Interface for drag state
interface DragState {
  isDragging: boolean;
  assetId: string | null;
  offsetX: number;
  offsetY: number;
  currentX: number;
  currentY: number;
}

// Interface for placed asset
interface PlacedAsset {
  id: string;
  assetId: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export default function CreatorStudio() {
  const [draggingAssetId, setDraggingAssetId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{x: number, y: number} | null>(null);
  const [canvasSize, setCanvasSize] = useState(DEFAULT_CANVAS_SIZE);
  const [pixelSize, setPixelSize] = useState(DEFAULT_PIXEL_SIZE);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [currentTool, setCurrentTool] = useState('pencil');
  const [isDrawing, setIsDrawing] = useState(false);
  const [pixels, setPixels] = useState<string[]>(Array(canvasSize * canvasSize).fill('#FFFFFF'));
  const [history, setHistory] = useState<string[][]>([Array(canvasSize * canvasSize).fill('#FFFFFF')]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [artworkName, setArtworkName] = useState('Untitled Artwork');
  const [artworkDescription, setArtworkDescription] = useState('');
  const [artworkPrice, setArtworkPrice] = useState('0.05');
  const [artworkTags, setArtworkTags] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [assetSearchTerm, setAssetSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<NFTAsset | null>(null);
  const [assetSuggestions, setAssetSuggestions] = useState<NFTAsset[]>([]);
  const [placedAssets, setPlacedAssets] = useState<PlacedAsset[]>([]);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    assetId: null,
    offsetX: 0,
    offsetY: 0,
    currentX: 0, 
    currentY: 0
  });
  const [showOwnedAssets, setShowOwnedAssets] = useState(false);
  const [isEditingAsset, setIsEditingAsset] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('browse');
  const [userWallet, setUserWallet] = useState('0x1234...5678'); // Mock wallet address
  const [walletConnected, setWalletConnected] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');

  const canvasRef = useRef<HTMLDivElement>(null);
  const assetLibraryRef = useRef<HTMLDivElement>(null);

  // Function to handle asset dragging
  const handleAssetDrag = (e: MouseEvent) => {
    if (!draggingAssetId || !dragOffset) return;

    const dx = (e.clientX - dragOffset.x) / pixelSize;
    const dy = (e.clientY - dragOffset.y) / pixelSize;

    setPlacedAssets(prev => prev.map(asset => 
      asset.id === draggingAssetId
        ? { ...asset, x: asset.x + dx, y: asset.y + dy }
        : asset
    ));

    setDragOffset({
      x: e.clientX,
      y: e.clientY
    });
  };

  // Function to handle finishing dragging an asset
  const handleAssetDragEnd = () => {
    setDraggingAssetId(null);
    setDragOffset(null);
  };

  // Set up event listeners for drag operations
  useEffect(() => {
    if (draggingAssetId) {
      window.addEventListener('mousemove', handleAssetDrag);
      window.addEventListener('mouseup', handleAssetDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleAssetDrag);
      window.removeEventListener('mouseup', handleAssetDragEnd);
    };
  }, [draggingAssetId, dragOffset]);

  useEffect(() => {
    // Initialize empty canvas
    resetCanvas();
  }, [canvasSize]);

  // New effect for AI suggestions
  useEffect(() => {
    const analyzeCanvas = () => {
      const colorCounts: {[key: string]: number} = {};
      pixels.forEach(color => {
        if (color !== '#FFFFFF') {
          colorCounts[color] = (colorCounts[color] || 0) + 1;
        }
      });
      
      const dominantColors = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);
      
      let suggestedCategory = '';
      
      if (dominantColors.some(c => c.match(/#(8B4513|A52A2A|CD853F|D2691E|8B0000|800000)/i))) {
        suggestedCategory = 'Medieval';
      } else if (dominantColors.some(c => c.match(/#(00FFFF|00CED1|1E90FF|4169E1|0000FF)/i))) {
        suggestedCategory = 'Cyberpunk';
      } else if (dominantColors.some(c => c.match(/#(FF00FF|DA70D6|9370DB|8A2BE2|9400D3)/i))) {
        suggestedCategory = 'Fantasy';
      }
      
      if (suggestedCategory) {
        const suggestions = NFT_ASSETS.filter(asset => 
          asset.category === suggestedCategory || asset.subcategory === suggestedCategory
        );
        setAssetSuggestions(suggestions);
      } else {
        setAssetSuggestions([]);
      }
    };
    
    const coloredPixels = pixels.filter(p => p !== '#FFFFFF').length;
    if (coloredPixels > canvasSize * 2) {
      analyzeCanvas();
    }
  }, [pixels, canvasSize]);

  const resetCanvas = () => {
    const newPixels = Array(canvasSize * canvasSize).fill('#FFFFFF');
    setPixels(newPixels);
    setHistory([newPixels]);
    setHistoryIndex(0);
    setPlacedAssets([]);
  };

  const handlePixelClick = (index: number) => {
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
    } else if (currentTool === 'fill') {
      handleFill(index);
    }
  };

  const handleMouseDown = (index: number) => {
    setIsDrawing(true);
    handlePixelClick(index);
  };

  const handleMouseOver = (index: number) => {
    if (isDrawing) {
      handlePixelClick(index);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const addToHistory = (newPixels: string[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newPixels);
    
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

  const fillBucket = (startIndex: number, targetColor: string, newColor: string) => {
    if (targetColor === newColor) return;
    
    const stack: number[] = [startIndex];
    const newPixels = [...pixels];
    const width = canvasSize;
    
    while (stack.length > 0) {
      const currentIndex = stack.pop();
      if (currentIndex === undefined || currentIndex < 0 || currentIndex >= pixels.length) continue;
      if (newPixels[currentIndex] !== targetColor) continue;
      
      newPixels[currentIndex] = newColor;
      
      const row = Math.floor(currentIndex / width);
      const col = currentIndex % width;
      
      if (row > 0) stack.push(currentIndex - width); // up
      if (row < width - 1) stack.push(currentIndex + width); // down
      if (col > 0) stack.push(currentIndex - 1); // left
      if (col < width - 1) stack.push(currentIndex + 1); // right
    }
    
    setPixels(newPixels);
    addToHistory(newPixels);
  };

  const handleFill = (index: number) => {
    fillBucket(index, pixels[index], selectedColor);
  };

  const exportAsPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      alert('Your browser does not support canvas operations');
      return;
    }
    
    for (let i = 0; i < pixels.length; i++) {
      const row = Math.floor(i / canvasSize);
      const col = i % canvasSize;
      ctx.fillStyle = pixels[i];
      ctx.fillRect(col, row, 1, 1);
    }
    
    placedAssets.forEach(asset => {
      const nftAsset = NFT_ASSETS.find(a => a.id === asset.assetId);
      if (nftAsset) {
        for (let y = 0; y < nftAsset.pixels.length; y++) {
          for (let x = 0; x < nftAsset.pixels[y].length; x++) {
            const colorKey = nftAsset.pixels[y][x].toString();
            const color = nftAsset.colors[colorKey as keyof typeof nftAsset.colors];
            
            if (color !== 'transparent') {
              const targetX = asset.x + x;
              const targetY = asset.y + y;
              
              if (targetX >= 0 && targetX < canvasSize && targetY >= 0 && targetY < canvasSize) {
                if (color) {
                  ctx.fillStyle = color;
                  ctx.fillRect(targetX, targetY, 1, 1);
                }
              }
            }
          }
        }
      }
    });
    
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${artworkName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = dataURL;
    link.click();
  };

  const exportAsSpriteSheet = () => {
    exportAsPNG();
  };

  const saveArtwork = () => {
    alert(`Artwork "${artworkName}" saved successfully! In a real implementation, this would connect to your backend.`);
    setShowPreview(false);
  };

  const publishToMarketplace = () => {
    alert(`Artwork "${artworkName}" published to marketplace for ${artworkPrice} ETH! In a real implementation, this would connect to your backend and blockchain.`);
    setShowPreview(false);
  };

  const selectAsset = (asset: NFTAsset) => {
    setSelectedAsset(asset);
  };

  const placeSelectedAsset = () => {
    if (selectedAsset) {
      const centerX = Math.floor(canvasSize / 2) - Math.floor(selectedAsset.pixels[0].length / 2);
      const centerY = Math.floor(canvasSize / 2) - Math.floor(selectedAsset.pixels.length / 2);
      
      const newAsset: PlacedAsset = {
        id: `placed-${Date.now()}-${selectedAsset.id}`,
        assetId: selectedAsset.id,
        x: centerX,
        y: centerY,
        rotation: 0,
        scale: 1
      };
      
      setPlacedAssets([...placedAssets, newAsset]);
      setSelectedAsset(null);
    }
  };

  const handleAssetDragStart = (e: React.MouseEvent, assetId: string) => {
    const asset = placedAssets.find(a => a.id === assetId);
    if (!asset) return;
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    const canvasX = (e.clientX - canvasRect.left) / pixelSize;
    const canvasY = (e.clientY - canvasRect.top) / pixelSize;
    
    setDragState({
      isDragging: true,
      assetId: assetId,
      offsetX: canvasX - asset.x,
      offsetY: canvasY - asset.y,
      currentX: asset.x,
      currentY: asset.y
    });
    
    setIsEditingAsset(assetId);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (dragState.isDragging && dragState.assetId) {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;
      
      const canvasX = (e.clientX - canvasRect.left) / pixelSize;
      const canvasY = (e.clientY - canvasRect.top) / pixelSize;
      
      const newX = Math.floor(canvasX - dragState.offsetX);
      const newY = Math.floor(canvasY - dragState.offsetY);
      
      setPlacedAssets(placedAssets.map(asset => 
        asset.id === dragState.assetId 
          ? { ...asset, x: newX, y: newY } 
          : asset
      ));
      
      setDragState({
        ...dragState,
        currentX: newX,
        currentY: newY
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setDragState({
      isDragging: false,
      assetId: null,
      offsetX: 0,
      offsetY: 0,
      currentX: 0,
      currentY: 0
    });
  };

  const rotateAsset = (assetId: string, direction: 'cw' | 'ccw') => {
    setPlacedAssets(placedAssets.map(asset => {
      if (asset.id === assetId) {
        const newRotation = (asset.rotation + (direction === 'cw' ? 90 : -90)) % 360;
        return { 
          ...asset, 
          rotation: newRotation < 0 ? newRotation + 360 : newRotation 
        };
      }
      return asset;
    }));
  };

  const scaleAsset = (assetId: string, factor: number) => {
    setPlacedAssets(placedAssets.map(asset => {
      if (asset.id === assetId) {
        const newScale = Math.max(0.5, Math.min(3, asset.scale * factor));
        return { ...asset, scale: newScale };
      }
      return asset;
    }));
  };

  const removeAsset = (assetId: string) => {
    setPlacedAssets(placedAssets.filter(asset => asset.id !== assetId));
    if (isEditingAsset === assetId) {
      setIsEditingAsset(null);
    }
  };

  const commitAssetsToCanvas = () => {
    const newPixels = [...pixels];
    
    placedAssets.forEach(placedAsset => {
      const asset = NFT_ASSETS.find(a => a.id === placedAsset.assetId);
      if (asset) {
        for (let y = 0; y < asset.pixels.length; y++) {
          for (let x = 0; x < asset.pixels[y].length; x++) {
            const colorKey = asset.pixels[y][x].toString();
            const color = asset.colors[colorKey as keyof typeof asset.colors];
            
            if (color !== 'transparent') {
              const targetX = placedAsset.x + x;
              const targetY = placedAsset.y + y;
              
              if (targetX >= 0 && targetX < canvasSize && targetY >= 0 && targetY < canvasSize) {
                const index = targetY * canvasSize + targetX;
                newPixels[index] = color || '#FFFFFF';
              }
            }
          }
        }
      }
    });
    
    setPixels(newPixels);
    addToHistory(newPixels);
    setPlacedAssets([]);
  };

  const purchaseAsset = (asset: NFTAsset) => {
    alert(`Purchasing ${asset.name} for ${asset.price} ETH! In a real implementation, this would open a blockchain transaction.`);
  };

  const mintAsNFT = () => {
    alert(`Minting artwork "${artworkName}" as an NFT! In a real implementation, this would connect to your wallet and the blockchain.`);
    setShowPreview(false);
  };

  const connectWallet = () => {
    setWalletConnected(true);
    alert("Wallet connected! In a real implementation, this would use Web3 to connect to MetaMask or another wallet provider.");
  };

  const inviteCollaborator = () => {
    if (inviteEmail && !collaborators.includes(inviteEmail)) {
      setCollaborators([...collaborators, inviteEmail]);
      setInviteEmail('');
      alert(`Invitation sent to ${inviteEmail}! In a real implementation, this would send an email invitation.`);
    }
  };

  const filteredAssets = NFT_ASSETS.filter(asset => {
    const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory || asset.subcategory === selectedCategory;
    const matchesSearch = assetSearchTerm === '' || 
      asset.name.toLowerCase().includes(assetSearchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(assetSearchTerm.toLowerCase()) ||
      asset.subcategory.toLowerCase().includes(assetSearchTerm.toLowerCase());
    
    const matchesOwnership = !showOwnedAssets || asset.owner === userWallet;
    
    return matchesCategory && matchesSearch && matchesOwnership;
  });

  const renderAssetPixels = (asset: NFTAsset, scale: number = 1) => {
    return (
      <div className="relative">
        {asset.pixels.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, cellIndex) => {
              const colorKey = cell.toString();
              const color = asset.colors[colorKey as keyof typeof asset.colors] || 'transparent';
              return (
                <div
                  key={`${rowIndex}-${cellIndex}`}
                  className="w-4 h-4"
                  style={{ 
                    backgroundColor: color,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left'
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderPlacedAsset = (placedAsset: PlacedAsset) => {
    const asset = NFT_ASSETS.find(a => a.id === placedAsset.assetId);
    if (!asset) return null;

    const isSelected = isEditingAsset === placedAsset.id;

    return (
      <div
        key={placedAsset.id}
        className={`absolute ${isSelected ? 'ring-2 ring-pink-500' : ''}`}
        style={{
          left: `${placedAsset.x * pixelSize}px`,
          top: `${placedAsset.y * pixelSize}px`,
          transform: `rotate(${placedAsset.rotation}deg) scale(${placedAsset.scale})`,
          transformOrigin: 'top left',
          cursor: 'move',
          zIndex: isSelected ? 10 : 1
        }}
        onMouseDown={(e) => handleAssetDragStart(e, placedAsset.id)}
        onClick={() => setIsEditingAsset(placedAsset.id)}
      >
        {renderAssetPixels(asset, pixelSize / 4)}

        {isSelected && (
          <div className="absolute -top-10 left-0 flex space-x-1 bg-gray-800 p-1 rounded z-20">
            <button 
              className="p-1 bg-gray-700 hover:bg-gray-600 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                rotateAsset(placedAsset.id, 'ccw');
              }}
            >
              ↺
            </button>
            <button 
              className="p-1 bg-gray-700 hover:bg-gray-600 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                rotateAsset(placedAsset.id, 'cw');
              }}
            >
              ↻
            </button>
            <button 
              className="p-1 bg-gray-700 hover:bg-gray-600 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                scaleAsset(placedAsset.id, 0.9);
              }}
            >
              -
            </button>
            <button 
              className="p-1 bg-gray-700 hover:bg-gray-600 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                scaleAsset(placedAsset.id, 1.1);
              }}
            >
              +
            </button>
            <button 
              className="p-1 bg-gray-700 hover:bg-gray-600 text-xs text-red-400"
              onClick={(e) => {
                e.stopPropagation();
                removeAsset(placedAsset.id);
                setIsEditingAsset(null);
              }}
            >
              ×
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="creator-studio-container">
      <div className="toolbar">
        <div className="color-picker">
          {COLORS.map(color => (
            <div
              key={color}
              className="color-swatch"
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={exportAsPNG}>Export as PNG</button>
        <button onClick={saveArtwork}>Save Artwork</button>
        <button onClick={publishToMarketplace}>Publish to Marketplace</button>
        <button onClick={() => setShowAssetLibrary(true)}>Asset Library</button>
        <button onClick={connectWallet}>
          {walletConnected ? 'Wallet Connected' : 'Connect Wallet'}
        </button>
      </div>

      <div className="main-content">
        <div
          className="canvas-container"
          ref={canvasRef}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
        >
          <div className="canvas-grid">
            {pixels.map((color, index) => (
              <div
                key={index}
                className="pixel"
                style={{
                  width: pixelSize,
                  height: pixelSize,
                  backgroundColor: color
                }}
                onMouseDown={() => handleMouseDown(index)}
                onMouseOver={() => handleMouseOver(index)}
                onMouseUp={handleMouseUp}
              />
            ))}
          </div>
          {placedAssets.map(placedAsset => renderPlacedAsset(placedAsset))}
        </div>

        {showAssetLibrary && (
          <div className="asset-library" ref={assetLibraryRef}>
            <div className="asset-library-header">
              <h2>Asset Library</h2>
              <button onClick={() => setShowAssetLibrary(false)}>Close</button>
            </div>
            <div className="asset-library-content">
              <div className="asset-categories">
                {ASSET_CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Search assets..."
                value={assetSearchTerm}
                onChange={e => setAssetSearchTerm(e.target.value)}
              />
              <div className="asset-grid">
                {filteredAssets.map(asset => (
                  <div
                    key={asset.id}
                    className="asset-item"
                    onClick={() => selectAsset(asset)}
                  >
                    {renderAssetPixels(asset)}
                    <div className="asset-info">
                      <h3>{asset.name}</h3>
                      <p>{asset.category} - {asset.subcategory}</p>
                      <p>Price: {asset.price} ETH</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedAsset && (
          <div className="asset-preview">
            <h3>Selected Asset: {selectedAsset.name}</h3>
            {renderAssetPixels(selectedAsset)}
            <button onClick={placeSelectedAsset}>Place Asset</button>
            <button onClick={() => setSelectedAsset(null)}>Cancel</button>
          </div>
        )}

        {showCollaborators && (
          <div className="collaboration-panel">
            <h3>Collaborators</h3>
            <div className="collaborator-list">
              {collaborators.map((email, index) => (
                <div key={index} className="collaborator-item">
                  {email}
                </div>
              ))}
            </div>
            <input
              type="email"
              placeholder="Enter email to invite"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
            />
            <button onClick={inviteCollaborator}>Invite</button>
          </div>
        )}
      </div>
    </div>
  );
}