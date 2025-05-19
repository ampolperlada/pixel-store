"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";

// Types for our pixel art creator
interface Pixel {
  x: number;
  y: number;
  color: string;
  layerId: number;
}

interface Layer {
  id: number;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
}

interface Frame {
  id: number;
  name: string;
  pixels: Pixel[];
  duration: number; // in milliseconds
}

interface PremadeItem {
  id: number;
  name: string;
  thumbnail: string;
  category: string;
  rarity: string;
  color: string;
}

interface RarityTrait {
  name: string;
  type: string;
  value: string | number;
  rarity: number; // 0-100%
}

// For custom brushes
type BrushPattern = boolean[][];

const INITIAL_CANVAS_SIZE = '32x32';
const MAX_LAYERS = 5;
const MAX_FRAMES = 8;
const DEFAULT_BRUSH_SIZE = 1;

const CreatePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [triggerReason] = useState('create pixel art');

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      setShowLoginModal(true);
    }
  }, [status]);

  // Close modals if authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      setShowLoginModal(false);
      setShowSignupModal(false);
    }
  }, [status]);

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    router.push('/'); // Redirect to home when closing login modal
  };

  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const handleCloseSignupModal = () => {
    setShowSignupModal(false);
  };

  // If not authenticated, show loading state or nothing (modals will handle the auth flow)
  if (status !== 'authenticated') {
    return (
      <>
        {showLoginModal && (
          <LoginModal
            isOpen={showLoginModal}
            onClose={handleCloseLoginModal}
            triggerReason={triggerReason}
            onSwitchToSignup={handleSwitchToSignup}
          />
        )}
        {showSignupModal && (
          <SignupModal
            isOpen={showSignupModal}
            onClose={handleCloseSignupModal}
          />
        )}
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="mt-4 text-lg">Checking authentication...</p>
          </div>
        </div>
      </>
    );
  }

  // If authenticated, render the PixelMarketplace component
  return <PixelMarketplace />;
};

// Enhanced PixelMarketplace component
const PixelMarketplace: React.FC = () => {
  // Drawing tools
  const [currentTool, setCurrentTool] = useState<string>('pencil');
  const [currentColor, setCurrentColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(DEFAULT_BRUSH_SIZE);
  const [customBrush, setCustomBrush] = useState<BrushPattern | null>(null);
  const [symmetryMode, setSymmetryMode] = useState<string>('none'); // 'none', 'horizontal', 'vertical', 'both'
  
  // Canvas settings
  const [canvasSize, setCanvasSize] = useState<string>(INITIAL_CANVAS_SIZE);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  
  // Layers
  const [layers, setLayers] = useState<Layer[]>([
    { id: 0, name: 'Background', visible: true, locked: false, opacity: 1 }
  ]);
  const [activeLayerId, setActiveLayerId] = useState<number>(0);
  
  // Frames for animation
  const [frames, setFrames] = useState<Frame[]>([
    { id: 0, name: 'Frame 1', pixels: [], duration: 200 }
  ]);
  const [activeFrameId, setActiveFrameId] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animationPreviewFps, setAnimationPreviewFps] = useState<number>(12);
  
  // History for undo/redo
  const [history, setHistory] = useState<Frame[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [historyMaxLength, setHistoryMaxLength] = useState<number>(30);
  
  // UI state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hoveredPixel, setHoveredPixel] = useState<{ x: number; y: number } | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activePanel, setActivePanel] = useState<string>('draw');
  const [mintPreviewVisible, setMintPreviewVisible] = useState<boolean>(false);
  const [panelCollapsed, setPanelCollapsed] = useState<Record<string, boolean>>({
    tools: false,
    layers: false,
    colors: false,
    animation: false,
    history: false
  });
  
  // DOM references
  const canvasRef = useRef<HTMLDivElement>(null);
  const animationTimerRef = useRef<number | null>(null);
  const animationFrameIndexRef = useRef<number>(0);
  
  // Color palettes with unique keys
  const [colorPalettes, setColorPalettes] = useState<{ [key: string]: string[] }>({
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
    retro: [
      '#8F974A', '#4D533C', '#1F1F1F', '#52646E', '#041C31',
      '#C6CAC9', '#898D96', '#33312F', '#BEB5A4', '#5A5A5A',
    ],
  });
  const [currentPalette, setCurrentPalette] = useState<string>('basic');
  const [recentColors, setRecentColors] = useState<string[]>([]);
  
  // Pre-made pixel items for the browser - with enhanced categories and rarities
  const premadeItems: PremadeItem[] = [
    { id: 1, name: 'Epic Sword', thumbnail: '/sword.png', category: 'weapon', rarity: 'rare', color: '#FF5722' },
    { id: 2, name: 'Crystal Shield', thumbnail: '/shield.png', category: 'weapon', rarity: 'epic', color: '#2196F3' },
    { id: 3, name: 'Gold Coin', thumbnail: '/coin.png', category: 'item', rarity: 'common', color: '#FFC107' },
    { id: 4, name: 'Health Potion', thumbnail: '/potion.png', category: 'item', rarity: 'uncommon', color: '#E91E63' },
    { id: 5, name: 'Fireball Spell', thumbnail: '/fireball.png', category: 'spell', rarity: 'rare', color: '#FF9800' },
    { id: 6, name: 'Elven Bow', thumbnail: '/bow.png', category: 'weapon', rarity: 'uncommon', color: '#8BC34A' },
    { id: 7, name: 'Dwarven Axe', thumbnail: '/axe.png', category: 'weapon', rarity: 'rare', color: '#795548' },
    { id: 8, name: 'Wizard Staff', thumbnail: '/staff.png', category: 'weapon', rarity: 'epic', color: '#9C27B0' },
    { id: 9, name: 'Treasure Chest', thumbnail: '/chest.png', category: 'item', rarity: 'uncommon', color: '#FFEB3B' },
    { id: 10, name: 'Diamond Gem', thumbnail: '/gem.png', category: 'item', rarity: 'legendary', color: '#00BCD4' },
    { id: 11, name: 'Pixel Warrior', thumbnail: '/warrior.png', category: 'character', rarity: 'epic', color: '#607D8B' },
    { id: 12, name: 'Pixel Mage', thumbnail: '/mage.png', category: 'character', rarity: 'epic', color: '#9C27B0' },
  ];
  
  const [itemFilter, setItemFilter] = useState<string>('all');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<PremadeItem | null>(null);
  
  const filteredItems = premadeItems
    .filter(item => itemFilter === 'all' || item.category === itemFilter)
    .filter(item => rarityFilter === 'all' || item.rarity === rarityFilter);

  // Initialize canvas when component mounts or canvas size changes
  useEffect(() => {
    // Reset pixels, frames, and layers
    const newLayers = [
      { id: 0, name: 'Background', visible: true, locked: false, opacity: 1 }
    ];
    
    const newFrames = [
      { id: 0, name: 'Frame 1', pixels: [], duration: 200 }
    ];
    
    setLayers(newLayers);
    setActiveLayerId(0);
    
    setFrames(newFrames);
    setActiveFrameId(0);
    
    // Reset history
    setHistory([]);
    setHistoryIndex(-1);
    
    // Add first history entry
    addToHistory(newFrames);
  }, [canvasSize]);

  // Setup animation preview
  useEffect(() => {
    if (isAnimating && frames.length > 1) {
      animationFrameIndexRef.current = 0;
      const timer = window.setInterval(() => {
        animationFrameIndexRef.current = (animationFrameIndexRef.current + 1) % frames.length;
  // (This useEffect is now inside PixelMarketplace, so remove this duplicate from outside)

  // Setup animation preview
  useEffect(() => {
    if (isAnimating && frames.length > 1) {
      animationFrameIndexRef.current = 0;
      const timer = window.setInterval(() => {
        animationFrameIndexRef.current = (animationFrameIndexRef.current + 1) % frames.length;
        // Force a re-render
        setActiveFrameId(animationFrameIndexRef.current);
      }, 1000 / animationPreviewFps);
      
      animationTimerRef.current = timer;
    } else {
      if (animationTimerRef.current) {
        window.clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    }
    
    return () => {
      if (animationTimerRef.current) {
        window.clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };
  }, [isAnimating, frames, animationPreviewFps]);

  // Initialize canvas
  const initializeCanvas = () => {
    // Reset pixels, frames, and layers
    const newLayers = [
      { id: 0, name: 'Background', visible: true, locked: false, opacity: 1 }
    ];
    
    const newFrames = [
      { id: 0, name: 'Frame 1', pixels: [], duration: 200 }
    ];
    
    setLayers(newLayers);
    setActiveLayerId(0);
    
    setFrames(newFrames);
    setActiveFrameId(0);
    
    // Reset history
    setHistory([]);
    setHistoryIndex(-1);
    
    // Add first history entry
    addToHistory(newFrames);
  };

  // Add current frames state to history
  // (removed duplicate definition)

  // Get pixels for the current frame and all visible layers
  const getCurrentPixels = () => {
    const activeFrame = frames.find(f => f.id === activeFrameId);
    if (!activeFrame) return [];
    
    return activeFrame.pixels.filter(p => {
      const layer = layers.find(l => l.id === p.layerId);
      return layer?.visible;
    });
  };

  // Get the size of each pixel based on canvas size
  const getPixelSize = (): number => {
    const pixelCount = parseInt(canvasSize.split('x')[0]);
    return (600 / pixelCount) * zoomLevel;
  };

  // Get the actual dimensions of the canvas in pixels
  const getCanvasDimensions = () => {
    const pixelCount = parseInt(canvasSize.split('x')[0]);
    const pixelSize = getPixelSize();
    return {
      width: pixelCount * pixelSize,
      height: pixelCount * pixelSize
    };
  };

  // Convert mouse position to canvas coordinates (pixel indices)
  const getCanvasCoordinates = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: -1, y: -1 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const pixelSize = getPixelSize();
    const pixelCount = parseInt(canvasSize.split('x')[0]);
    
    const x = Math.floor((clientX - rect.left) / pixelSize);
    const y = Math.floor((clientY - rect.top) / pixelSize);
    
    if (x >= 0 && x < pixelCount && y >= 0 && y < pixelCount) {
      return { x, y };
    }
    
    return { x: -1, y: -1 };
  };

  // Apply a drawing operation to the canvas
  const applyDrawing = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return;
    
    const { x, y } = getCanvasCoordinates(clientX, clientY);
    if (x < 0 || y < 0) return;
    
    const pixelCount = parseInt(canvasSize.split('x')[0]);
    
    // Find the active layer
    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer || activeLayer.locked) return;
    
    // Get the active frame
    const frameIndex = frames.findIndex(f => f.id === activeFrameId);
    if (frameIndex < 0) return;
    
    // Make a copy of the frames
    const newFrames = [...frames];
    
    // Applying drawing based on the current tool
    if (currentTool === 'pencil') {
      // For brush size > 1, draw multiple pixels
      const pixelsToUpdate = [];
      
      // Calculate brush pixels
      const startX = x - Math.floor(brushSize / 2);
      const startY = y - Math.floor(brushSize / 2);
      
      for (let dx = 0; dx < brushSize; dx++) {
        for (let dy = 0; dy < brushSize; dy++) {
          const newX = startX + dx;
          const newY = startY + dy;
          
          // Skip if out of bounds
          if (newX < 0 || newX >= pixelCount || newY < 0 || newY >= pixelCount) continue;
          
          // Add pixel to update list
          pixelsToUpdate.push({ x: newX, y: newY });
          
          // Apply symmetry if enabled
          if (symmetryMode === 'horizontal' || symmetryMode === 'both') {
            const symmetricX = pixelCount - 1 - newX;
            pixelsToUpdate.push({ x: symmetricX, y: newY });
          }
          
          if (symmetryMode === 'vertical' || symmetryMode === 'both') {
            const symmetricY = pixelCount - 1 - newY;
            pixelsToUpdate.push({ x: newX, y: symmetricY });
          }
          
          if (symmetryMode === 'both') {
            const symmetricX = pixelCount - 1 - newX;
            const symmetricY = pixelCount - 1 - newY;
            pixelsToUpdate.push({ x: symmetricX, y: symmetricY });
          }
        }
      }
      
      // Apply all pixel updates
      for (const pixel of pixelsToUpdate) {
        const pixelIndex = newFrames[frameIndex].pixels.findIndex(
          p => p.x === pixel.x && p.y === pixel.y && p.layerId === activeLayerId
        );
        
        if (pixelIndex >= 0) {
          // Update existing pixel
          newFrames[frameIndex].pixels[pixelIndex].color = currentColor;
        } else {
          // Add new pixel
          newFrames[frameIndex].pixels.push({
            x: pixel.x,
            y: pixel.y,
            color: currentColor,
            layerId: activeLayerId
          });
        }
      }
    } 
    else if (currentTool === 'eraser') {
      // Similar to pencil but removes pixels
      interface PixelToErase {
        x: number;
        y: number;
      }
      const pixelsToErase: PixelToErase[] = [];
      
      const startX = x - Math.floor(brushSize / 2);
      const startY = y - Math.floor(brushSize / 2);
      
      for (let dx = 0; dx < brushSize; dx++) {
        for (let dy = 0; dy < brushSize; dy++) {
          const newX = startX + dx;
          const newY = startY + dy;
          
          if (newX < 0 || newX >= pixelCount || newY < 0 || newY >= pixelCount) continue;
          
          pixelsToErase.push({ x: newX, y: newY });
          
          if (symmetryMode === 'horizontal' || symmetryMode === 'both') {
            const symmetricX = pixelCount - 1 - newX;
            pixelsToErase.push({ x: symmetricX, y: newY });
          }
          
          if (symmetryMode === 'vertical' || symmetryMode === 'both') {
            const symmetricY = pixelCount - 1 - newY;
            pixelsToErase.push({ x: newX, y: symmetricY });
          }
          
          if (symmetryMode === 'both') {
            const symmetricX = pixelCount - 1 - newX;
            const symmetricY = pixelCount - 1 - newY;
            pixelsToErase.push({ x: symmetricX, y: symmetricY });
          }
        }
      }
      
      // Filter out pixels that need to be erased
      newFrames[frameIndex].pixels = newFrames[frameIndex].pixels.filter(
        p => !pixelsToErase.some(pe => pe.x === p.x && pe.y === p.y && p.layerId === activeLayerId)
      );
    }
    else if (currentTool === 'eyedropper') {
      // Find the pixel at this position in any visible layer (top to bottom)
      const visibleLayers = layers.filter(l => l.visible).reverse();
      
      for (const layer of visibleLayers) {
        const pixel = newFrames[frameIndex].pixels.find(
          p => p.x === x && p.y === y && p.layerId === layer.id
        );
        
        if (pixel) {
          setCurrentColor(pixel.color);
          
          // Add to recent colors if not already there
          if (!recentColors.includes(pixel.color)) {
            const newRecentColors = [pixel.color, ...recentColors.slice(0, 9)];
            setRecentColors(newRecentColors);
          }
          
          break;
        }
      }
    }
    else if (currentTool === 'fill') {
      // Find the target color to replace
      const targetPixel = newFrames[frameIndex].pixels.find(
        p => p.x === x && p.y === y && p.layerId === activeLayerId
      );
      
      const targetColor = targetPixel?.color || null;
      
      if (targetColor !== currentColor) {
        // Perform flood fill
        floodFill(newFrames[frameIndex].pixels, x, y, targetColor, currentColor, pixelCount, activeLayerId);
      }
    }
    else if (currentTool === 'line') {
      // Implement line drawing logic
    }
    else if (currentTool === 'rectangle') {
      // Implement rectangle drawing logic
    }
    else if (currentTool === 'ellipse') {
      // Implement ellipse drawing logic
    }
    
    // Update the state with the new frames
    setFrames(newFrames);
    
    // Store a snapshot in history if this is a new action (not continuous drawing)
    if (!isDrawing) {
      addToHistory(newFrames);
    }
  };

  // Handle mouse down event
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDrawing(true);
    applyDrawing(e.clientX, e.clientY);
  };

  // Handle mouse move event
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    
    const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);
    
    if (x >= 0 && y >= 0) {
      setHoveredPixel({ x, y });
      
      if (isDrawing) {
        applyDrawing(e.clientX, e.clientY);
      }
    } else {
      setHoveredPixel(null);
    }
  };

  // Handle mouse up event
  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      // Add to history if not already done
      addToHistory(frames);
    }
  };

  // Flood fill algorithm
  const floodFill = (
    pixelsArray: Pixel[], 
    x: number, 
    y: number, 
    targetColor: string | null, 
    replacementColor: string, 
    pixelCount: number,
    layerId: number
  ) => {
    const stack = [{x, y}];
    const visited = new Set<string>();
    
    while (stack.length > 0) {
      const current = stack.pop();
      if (!current) continue;
      const cx = current.x;
      const cy = current.y;
      const key = `${cx},${cy}`;
      
      if (
        cx < 0 || cx >= pixelCount || 
        cy < 0 || cy >= pixelCount || 
        visited.has(key)
      ) {
        continue;
      }
      
      visited.add(key);
      
      // Find the pixel at this position
      const pixelIndex = pixelsArray.findIndex(
        p => p.x === cx && p.y === cy && p.layerId === layerId
      );
      
      const currentColor = pixelIndex >= 0 ? pixelsArray[pixelIndex].color : null;
      
      if (currentColor === replacementColor) continue;
      if (targetColor !== null && currentColor !== targetColor) continue;
      
      if (pixelIndex >= 0) {
        // Update existing pixel
        pixelsArray[pixelIndex].color = replacementColor;
      } else {
        // Add new pixel
        pixelsArray.push({
          x: cx,
          y: cy,
          color: replacementColor,
          layerId: layerId
        });
      }
      
      // Expand in 4 directions
      stack.push({x: cx + 1, y: cy});
      stack.push({x: cx - 1, y: cy});
      stack.push({x: cx, y: cy + 1});
      stack.push({x: cx, y: cy - 1});
    }
  };

  // Handle undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setFrames(JSON.parse(JSON.stringify(history[newIndex])));
    }
  };

  // Handle redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setFrames(JSON.parse(JSON.stringify(history[newIndex])));
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      const newFrames = frames.map(frame => ({
        ...frame,
        pixels: frame.pixels.filter(pixel => pixel.layerId !== activeLayerId)
      }));
      
      setFrames(newFrames);
      addToHistory(newFrames);
    }
  };

  // Add a new layer
  const addLayer = () => {
    if (layers.length >= MAX_LAYERS) {
      alert(`Maximum of ${MAX_LAYERS} layers reached`);
      return;
    }
    
    const newLayerId = Math.max(...layers.map(l => l.id), 0) + 1;
    const newLayer = {
      id: newLayerId,
      name: `Layer ${newLayerId + 1}`,
      visible: true,
      locked: false,
      opacity: 1
    };
    
    setLayers([...layers, newLayer]);
    setActiveLayerId(newLayerId);
  };

  // Delete a layer
  const deleteLayer = (layerId: number) => {
    if (layers.length <= 1) {
      alert("Cannot delete the last layer");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this layer? This action cannot be undone.")) {
      // Remove the layer
      const newLayers = layers.filter(l => l.id !== layerId);
      setLayers(newLayers);
      
      // Set active layer to the first one if the active layer was deleted
      if (activeLayerId === layerId) {
        setActiveLayerId(newLayers[0].id);
      }
      
      // Remove all pixels from this layer in all frames
      const newFrames = frames.map(frame => ({
        ...frame,
        pixels: frame.pixels.filter(p => p.layerId !== layerId)
      }));
      
      setFrames(newFrames);
      addToHistory(newFrames);
    }
  };

  // Toggle layer visibility
  const toggleLayerVisibility = (layerId: number) => {
    const layerIndex = layers.findIndex(l => l.id === layerId);
    if (layerIndex < 0) return;
    
    const newLayers = [...layers];
    newLayers[layerIndex] = {
      ...newLayers[layerIndex],
      visible: !newLayers[layerIndex].visible
    };
    
    setLayers(newLayers);
  };

  // Toggle layer lock
  const toggleLayerLock = (layerId: number) => {
    const layerIndex = layers.findIndex(l => l.id === layerId);
    if (layerIndex < 0) return;
    
    const newLayers = [...layers];
    newLayers[layerIndex] = {
      ...newLayers[layerIndex],
      locked: !newLayers[layerIndex].locked
    };
    
    setLayers(newLayers);
  };

  // Update layer opacity
  const updateLayerOpacity = (layerId: number, opacity: number) => {
    const layerIndex = layers.findIndex(l => l.id === layerId);
    if (layerIndex < 0) return;
    
    const newLayers = [...layers];
    newLayers[layerIndex] = {
      ...newLayers[layerIndex],
      opacity: opacity
    };
    
    setLayers(newLayers);
  };

  // Move layer up or down
  const moveLayer = (layerId: number, direction: 'up' | 'down') => {
    const layerIndex = layers.findIndex(l => l.id === layerId);
    if (layerIndex < 0) return;
    
    if (direction === 'up' && layerIndex > 0) {
      const newLayers = [...layers];
      [newLayers[layerIndex], newLayers[layerIndex - 1]] = 
        [newLayers[layerIndex - 1], newLayers[layerIndex]];
      setLayers(newLayers);
    } else if (direction === 'down' && layerIndex < layers.length - 1) {
      const newLayers = [...layers];
      [newLayers[layerIndex], newLayers[layerIndex + 1]] = 
        [newLayers[layerIndex + 1], newLayers[layerIndex]];
      setLayers(newLayers);
    }
  };

  // Rename layer
  const renameLayer = (layerId: number, newName: string) => {
    const layerIndex = layers.findIndex(l => l.id === layerId);
    if (layerIndex < 0) return;
    
    const newLayers = [...layers];
    newLayers[layerIndex] = {
      ...newLayers[layerIndex],
      name: newName
    };
    
    setLayers(newLayers);
  };

  // Add new frame
  // Add new frame
  const addFrame = () => {
    if (frames.length >= MAX_FRAMES) {
      alert(`Maximum of ${MAX_FRAMES} frames reached`);
      return;
    }

    const newFrameId = Math.max(...frames.map(f => f.id), 0) + 1;

    // Create new frame based on currently active frame
    const activeFrame = frames.find(f => f.id === activeFrameId);

    // Option to duplicate current frame pixels or start fresh
    let newFramePixels: Pixel[] = [];
    if (window.confirm("Do you want to duplicate the current frame?")) {
      newFramePixels = JSON.parse(JSON.stringify(activeFrame?.pixels || []));
    }

    const newFrame: Frame = {
      id: newFrameId,
      name: `Frame ${newFrameId + 1}`,
      pixels: newFramePixels,
      duration: 200  // Default duration in milliseconds
    };

    setFrames([...frames, newFrame]);
    setActiveFrameId(newFrameId);

    // Add to history
    addToHistory([...frames, newFrame]);
  };

  // Add current frames state to history
  function addToHistory(newFrames: Frame[]) {
    // If the new state is the same as the current, do not add
    if (
      historyIndex >= 0 &&
      JSON.stringify(newFrames) === JSON.stringify(history[historyIndex])
    ) {
      return;
    }

    // Copy history up to the current index
    const newHistory = history.slice(0, historyIndex + 1);

    // Deep copy to avoid reference issues
    const framesCopy = JSON.parse(JSON.stringify(newFrames));
    newHistory.push(framesCopy);

    // Trim history if it exceeds max length
    if (newHistory.length > historyMaxLength) {
      newHistory.shift();
    }

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }

      }
