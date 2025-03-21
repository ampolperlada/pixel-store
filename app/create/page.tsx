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
      '1': '#FFD700'  // Gold color
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
      [0,0,0,1,0,0,0],
      [0,0,0,1,0,0,0]
    ],
    colors: {
      '0': 'transparent',
      '1': '#8A2BE2',  // Purple
      '2': '#FFFFFF'   // White
    },
    owner: '0xABCD...EFGH',
    price: 0.12
  },
  // Additional assets
  { 
    id: 'asset4', 
    name: 'Cyberpunk Visor', 
    category: 'Cyberpunk',
    subcategory: 'Accessories',
    thumbnail: 'visor-thumb.png', 
    pixels: [
      [1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,1],
      [1,0,2,2,2,2,0,1],
      [1,1,1,1,1,1,1,1]
    ],
    colors: {
      '0': 'transparent',
      '1': '#222222',  // Black
      '2': '#FF00FF',  // Magenta
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
  
  // New state for NFT Asset Integration feature
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
  
  useEffect(() => {
    // Initialize empty canvas
    resetCanvas();
  }, [canvasSize]);
  
  // New effect for AI suggestions
  useEffect(() => {
    // In a real implementation, this would use image recognition or ML
    // to detect what the user is drawing and suggest relevant assets
    const analyzeCanvas = () => {
      // Simple mock implementation - in reality this would be much more sophisticated
      // Counting colors to make simple suggestions
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
      
      // Mock AI logic for suggestions based on colors
      let suggestedCategory = '';
      
      // Red/brown tones might suggest medieval
      if (dominantColors.some(c => c.match(/#(8B4513|A52A2A|CD853F|D2691E|8B0000|800000)/i))) {
        suggestedCategory = 'Medieval';
      }
      // Blue/cyan might suggest sci-fi
      else if (dominantColors.some(c => c.match(/#(00FFFF|00CED1|1E90FF|4169E1|0000FF)/i))) {
        suggestedCategory = 'Cyberpunk';
      }
      // Purple/pink might suggest fantasy
      else if (dominantColors.some(c => c.match(/#(FF00FF|DA70D6|9370DB|8A2BE2|9400D3)/i))) {
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
    
    // Only run analysis if there are a significant number of colored pixels
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
      
      // Check neighbors (up, down, left, right)
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
    
    // Fix for 'ctx' is possibly 'null'
    if (!ctx) {
      alert('Your browser does not support canvas operations');
      return;
    }
    
    // Draw pixels to canvas
    for (let i = 0; i < pixels.length; i++) {
      const row = Math.floor(i / canvasSize);
      const col = i % canvasSize;
      ctx.fillStyle = pixels[i];
      ctx.fillRect(col, row, 1, 1);
    }
    
    // Add placed NFT assets
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
              
              // Check bounds
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
  
  // NFT Asset handling methods
  const selectAsset = (asset: NFTAsset) => {
    setSelectedAsset(asset);
  };
  
  const placeSelectedAsset = () => {
    if (selectedAsset) {
      // Place in center by default
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
    // Get asset position and dimensions
    const asset = placedAssets.find(a => a.id === assetId);
    if (!asset) return;
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    // Calculate relative position in canvas
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
      
      // Calculate new position
      const canvasX = (e.clientX - canvasRect.left) / pixelSize;
      const canvasY = (e.clientY - canvasRect.top) / pixelSize;
      
      const newX = Math.floor(canvasX - dragState.offsetX);
      const newY = Math.floor(canvasY - dragState.offsetY);
      
      // Update position
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
        // Add/subtract 90 degrees, ensure value stays between 0-360
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
        // Limit scale between 0.5 and 3
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
    // Create a copy of the current pixels
    const newPixels = [...pixels];
    
    // Draw each asset onto the canvas
    placedAssets.forEach(placedAsset => {
      const asset = NFT_ASSETS.find(a => a.id === placedAsset.assetId);
      if (asset) {
        // For simplicity in this implementation, we're ignoring rotation and scale
        // In a real implementation you would apply these transformations
        for (let y = 0; y < asset.pixels.length; y++) {
          for (let x = 0; x < asset.pixels[y].length; x++) {
            const colorKey = asset.pixels[y][x].toString();
            const color = asset.colors[colorKey as keyof typeof asset.colors];
            
            if (color !== 'transparent') {
              const targetX = placedAsset.x + x;
              const targetY = placedAsset.y + y;
              
              // Check bounds
              if (targetX >= 0 && targetX < canvasSize && targetY >= 0 && targetY < canvasSize) {
                const index = targetY * canvasSize + targetX;
                newPixels[index] = color || '#FFFFFF';
              }
            }
          }
        }
      }
    });
    
    // Update canvas
    setPixels(newPixels);
    addToHistory(newPixels);
    
    // Clear placed assets
    setPlacedAssets([]);
  };
  
  const purchaseAsset = (asset: NFTAsset) => {
    // In a real implementation, this would connect to the blockchain
    alert(`Purchasing ${asset.name} for ${asset.price} ETH! In a real implementation, this would open a blockchain transaction.`);
  };
  
  const mintAsNFT = () => {
    // In a real implementation, this would connect to the blockchain
    alert(`Minting artwork "${artworkName}" as an NFT! In a real implementation, this would connect to your wallet and the blockchain.`);
    setShowPreview(false);
  };
  
  const connectWallet = () => {
    // In a real implementation, this would use Web3 to connect to a wallet
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
  
  // Filter assets based on category and search
  const filteredAssets = NFT_ASSETS.filter(asset => {
    const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory || asset.subcategory === selectedCategory;
    const matchesSearch = assetSearchTerm === '' || 
      asset.name.toLowerCase().includes(assetSearchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(assetSearchTerm.toLowerCase()) ||
      asset.subcategory.toLowerCase().includes(assetSearchTerm.toLowerCase());
    
    const matchesOwnership = !showOwnedAssets || asset.owner === userWallet;
    
    return matchesCategory && matchesSearch && matchesOwnership;
  });
  
  return (
    <main className="min-h-screen bg-black text-white">
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 py-4 px-6 border-b border-pink-500 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-cyan-300">PIXEL MARKETPLACE</Link>
        <div className="flex items-center space-x-4">
          {!walletConnected ? (
            <button 
              onClick={connectWallet}
              className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-600 transition"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="text-sm text-gray-300">
              Wallet: {userWallet}
            </div>
          )}
          <button 
            className="px-4 py-2 bg-pink-700 text-white rounded hover:bg-pink-600 transition"
            onClick={() => setShowPreview(true)}
          >
            Preview & Publish
          </button>
        </div>
      </header>
      
      <div className="flex">
        {/* Toolbox Sidebar */}
        <div className="w-64 bg-gray-900 p-4 h-screen border-r border-gray-700 overflow-y-auto">
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
            
            {/* NFT asset integration button */}
            <button 
              className={`p-2 transition w-full mt-2 ${showAssetLibrary ? 'bg-pink-600' : 'bg-gray-800 hover:bg-gray-700'}`}
              onClick={() => setShowAssetLibrary(!showAssetLibrary)}
            >
              {showAssetLibrary ? 'Close Asset Library' : 'Open NFT Asset Library'}
                            </button>
                          </div>
                          
                          <div className="mt-4">
                            <h3 className="text-md font-semibold mb-2 text-gray-300">Color Palette</h3>
                            <div className="grid grid-cols-5 gap-1">
                              {COLORS.map((color, index) => (
                                <div
                                  key={index}
                                  className={`w-full aspect-square cursor-pointer ${selectedColor === color ? 'ring-2 ring-white' : ''}`}
                                  style={{ backgroundColor: color }}
                                  onClick={() => setSelectedColor(color)}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h3 className="text-md font-semibold mb-2 text-gray-300">Canvas Controls</h3>
                            <div className="grid grid-cols-2 gap-2">
                              <button 
                                className="p-2 bg-gray-800 hover:bg-gray-700 transition"
                                onClick={undo}
                                disabled={historyIndex === 0}
                              >
                                Undo
                              </button>
                              <button 
                                className="p-2 bg-gray-800 hover:bg-gray-700 transition"
                                onClick={redo}
                                disabled={historyIndex === history.length - 1}
                              >
                                Redo
                              </button>
                              <button 
                                className="p-2 bg-gray-800 hover:bg-gray-700 transition"
                                onClick={resetCanvas}
                              >
                                Reset
                              </button>
                              <button 
                                className="p-2 bg-gray-800 hover:bg-gray-700 transition"
                                onClick={exportAsPNG}
                              >
                                Export PNG
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </main>
                );
              }