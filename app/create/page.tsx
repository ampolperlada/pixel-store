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
    initializeCanvas();
  }, [canvasSize]);

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
  const addToHistory = (newFrames: Frame[]) => {
    if (historyIndex >= 0 && JSON.stringify(newFrames) === JSON.stringify(history[historyIndex])) {
      return;
    }
    
    const newHistory = history.slice(0, historyIndex + 1);
    
    // Create deep copy of frames to prevent shared references
    const framesCopy = JSON.parse(JSON.stringify(newFrames));
    
    newHistory.push(framesCopy);
    
    // If history exceeds max length, trim it
    if (newHistory.length > historyMaxLength) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

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
      const pixelsToErase = [];
      
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
  const addFrame = () => {
    if (frames.length >= MAX_FRAMES) {
      alert(`Maximum of ${MAX_FRAMES} frames reached`);
      return;
    }
    
// Continuation of the PixelMarketplace component

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

  // Delete frame
  const deleteFrame = (frameId: number) => {
    if (frames.length <= 1) {
      alert("Cannot delete the last frame");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this frame? This action cannot be undone.")) {
      const newFrames = frames.filter(f => f.id !== frameId);
      setFrames(newFrames);
      
      // Set active frame to the first one if the active frame was deleted
      if (activeFrameId === frameId) {
        setActiveFrameId(newFrames[0].id);
      }
      
      // Add to history
      addToHistory(newFrames);
    }
  };

  // Duplicate frame
  const duplicateFrame = (frameId: number) => {
    if (frames.length >= MAX_FRAMES) {
      alert(`Maximum of ${MAX_FRAMES} frames reached`);
      return;
    }
    
    const frameIndex = frames.findIndex(f => f.id === frameId);
    if (frameIndex < 0) return;
    
    const newFrameId = Math.max(...frames.map(f => f.id), 0) + 1;
    const newFrame: Frame = {
      ...JSON.parse(JSON.stringify(frames[frameIndex])),
      id: newFrameId,
      name: `Frame ${newFrameId + 1}`
    };
    
    const newFrames = [...frames];
    newFrames.splice(frameIndex + 1, 0, newFrame);
    
    setFrames(newFrames);
    setActiveFrameId(newFrameId);
    
    // Add to history
    addToHistory(newFrames);
  };

  // Move frame order
  const moveFrame = (frameId: number, direction: 'left' | 'right') => {
    const frameIndex = frames.findIndex(f => f.id === frameId);
    if (frameIndex < 0) return;
    
    if (direction === 'left' && frameIndex > 0) {
      const newFrames = [...frames];
      [newFrames[frameIndex], newFrames[frameIndex - 1]] = 
        [newFrames[frameIndex - 1], newFrames[frameIndex]];
      setFrames(newFrames);
    } else if (direction === 'right' && frameIndex < frames.length - 1) {
      const newFrames = [...frames];
      [newFrames[frameIndex], newFrames[frameIndex + 1]] = 
        [newFrames[frameIndex + 1], newFrames[frameIndex]];
      setFrames(newFrames);
    }
  };

  // Update frame duration
  const updateFrameDuration = (frameId: number, duration: number) => {
    const frameIndex = frames.findIndex(f => f.id === frameId);
    if (frameIndex < 0) return;
    
    const newFrames = [...frames];
    newFrames[frameIndex] = {
      ...newFrames[frameIndex],
      duration: duration
    };
    
    setFrames(newFrames);
  };

  // Rename frame
  const renameFrame = (frameId: number, newName: string) => {
    const frameIndex = frames.findIndex(f => f.id === frameId);
    if (frameIndex < 0) return;
    
    const newFrames = [...frames];
    newFrames[frameIndex] = {
      ...newFrames[frameIndex],
      name: newName
    };
    
    setFrames(newFrames);
  };

  // Toggle animation preview
  const toggleAnimationPreview = () => {
    setIsAnimating(!isAnimating);
  };

  // Export PNG
  const exportPNG = () => {
    if (!canvasRef.current) return;

    // Create a temporary canvas for export
    const tempCanvas = document.createElement('canvas');
    const pixelCount = parseInt(canvasSize.split('x')[0]);
    tempCanvas.width = pixelCount;
    tempCanvas.height = pixelCount;
    const ctx = tempCanvas.getContext('2d');
    
    if (!ctx) {
      alert("Unable to export PNG. Canvas context is not available.");
      return;
    }

    // Fill background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, pixelCount, pixelCount);

    // Draw pixels from all visible layers, bottom to top
    const sortedLayers = [...layers].sort((a, b) => layers.indexOf(a) - layers.indexOf(b));
    const activeFrame = frames.find(f => f.id === activeFrameId);
    
    if (activeFrame) {
      for (const layer of sortedLayers) {
        if (!layer.visible) continue;
        
        // Apply layer opacity
        ctx.globalAlpha = layer.opacity;
        
        // Draw pixels from this layer
        activeFrame.pixels
          .filter(p => p.layerId === layer.id)
          .forEach(pixel => {
            ctx.fillStyle = pixel.color;
            ctx.fillRect(pixel.x, pixel.y, 1, 1);
          });
      }
    }

    // Reset opacity
    ctx.globalAlpha = 1.0;

    // Create download link
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
  };

  // Export sprite sheet
  const exportSpriteSheet = () => {
    if (frames.length === 0) return;

    // Create a temporary canvas for export
    const tempCanvas = document.createElement('canvas');
    const pixelCount = parseInt(canvasSize.split('x')[0]);
    tempCanvas.width = pixelCount * frames.length;
    tempCanvas.height = pixelCount;
    const ctx = tempCanvas.getContext('2d');
    
    if (!ctx) {
      alert("Unable to export sprite sheet. Canvas context is not available.");
      return;
    }

    // Fill background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, pixelCount * frames.length, pixelCount);

    // Draw each frame
    frames.forEach((frame, frameIndex) => {
      // Draw pixels from all visible layers, bottom to top
      const sortedLayers = [...layers].sort((a, b) => layers.indexOf(a) - layers.indexOf(b));
      
      for (const layer of sortedLayers) {
        if (!layer.visible) continue;
        
        // Apply layer opacity
        ctx.globalAlpha = layer.opacity;
        
        // Draw pixels from this layer
        frame.pixels
          .filter(p => p.layerId === layer.id)
          .forEach(pixel => {
            ctx.fillStyle = pixel.color;
            ctx.fillRect(pixel.x + frameIndex * pixelCount, pixel.y, 1, 1);
          });
      }
    });

    // Reset opacity
    ctx.globalAlpha = 1.0;

    // Create download link
    const link = document.createElement('a');
    link.download = 'sprite-sheet.png';
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
  };

  // Create custom brush
  const createCustomBrush = () => {
    // Show a modal to create a custom brush pattern
    // For simplicity, we can create a few preset brushes
    setCustomBrush([
      [false, true, false],
      [true, true, true],
      [false, true, false]
    ]);
  };

  // Calculate rarity score for the current artwork
  const calculateRarityScore = (): number => {
    // This is a placeholder for rarity calculation
    // In a real implementation, you would consider various factors:
    // - Complexity (number of pixels, colors used)
    // - Animation frames
    // - Use of layers
    // - Uniqueness compared to other artwork
    
    let score = 0;
    
    // Count unique colors in the active frame
    const activeFrame = frames.find(f => f.id === activeFrameId);
    if (activeFrame) {
      const uniqueColors = new Set(activeFrame.pixels.map(p => p.color));
      score += uniqueColors.size * 5;
    }
    
    // Add points for multiple frames (animations are more rare)
    score += (frames.length - 1) * 25;
    
    // Add points for using multiple layers
    score += (layers.length - 1) * 15;
    
    // Complexity based on pixel count
    const pixelDensity = activeFrame ? activeFrame.pixels.length / (parseInt(canvasSize.split('x')[0]) ** 2) : 0;
    score += pixelDensity * 100;
    
    return Math.min(Math.round(score), 100); // Cap at 100
  };

  // Get rarity tier based on score
  const getRarityTier = (score: number): string => {
    if (score >= 85) return 'legendary';
    if (score >= 65) return 'epic';
    if (score >= 45) return 'rare';
    if (score >= 25) return 'uncommon';
    return 'common';
  };

  // Preview mint
  const previewMint = () => {
    const rarityScore = calculateRarityScore();
    const rarityTier = getRarityTier(rarityScore);
    
    // Show mint preview modal
    setMintPreviewVisible(true);
    
    // In a real implementation, you would show a preview of how this NFT
    // would look on a marketplace like OpenSea, with rarity information
  };

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Toggle panel collapse
  const togglePanelCollapse = (panel: string) => {
    setPanelCollapsed({
      ...panelCollapsed,
      [panel]: !panelCollapsed[panel]
    });
  };
  
  // Calculate traits for NFT metadata
  const calculateTraits = (): RarityTrait[] => {
    const traits: RarityTrait[] = [];
    const activeFrame = frames.find(f => f.id === activeFrameId);
    
    if (activeFrame) {
      // Count pixels
      traits.push({
        name: 'Pixel Count',
        type: 'number',
        value: activeFrame.pixels.length,
        rarity: Math.min(activeFrame.pixels.length / 100, 100)
      });
      
      // Count unique colors
      const uniqueColors = new Set(activeFrame.pixels.map(p => p.color));
      traits.push({
        name: 'Color Palette',
        type: 'number',
        value: uniqueColors.size,
        rarity: Math.min(uniqueColors.size * 5, 100)
      });
      
      // Animation frames
      traits.push({
        name: 'Animation Frames',
        type: 'number',
        value: frames.length,
        rarity: Math.min(frames.length * 10, 100)
      });
      
      // Layers used
      traits.push({
        name: 'Layers',
        type: 'number',
        value: layers.length,
        rarity: Math.min(layers.length * 15, 100)
      });
    }
    
    return traits;
  };

  // Import selected item from premade collection
  const importSelectedItem = () => {
    if (!selectedItem) {
      alert("Please select an item to import");
      return;
    }
    
    // In a real implementation, you would load the pixel data for the selected item
    // For this example, we'll just create a placeholder with the item's color
    const pixelCount = parseInt(canvasSize.split('x')[0]);
    const halfSize = Math.floor(pixelCount / 4);
    const centerOffset = Math.floor(pixelCount / 2 - halfSize / 2);
    
    // Create a simple square with the item's color
    const newPixels: Pixel[] = [];
    for (let x = centerOffset; x < centerOffset + halfSize; x++) {
      for (let y = centerOffset; y < centerOffset + halfSize; y++) {
        newPixels.push({
          x,
          y,
          color: selectedItem.color,
          layerId: activeLayerId
        });
      }
    }
    
    // Add pixels to the current frame
    const frameIndex = frames.findIndex(f => f.id === activeFrameId);
    if (frameIndex >= 0) {
      const newFrames = [...frames];
      newFrames[frameIndex] = {
        ...newFrames[frameIndex],
        pixels: [...newFrames[frameIndex].pixels, ...newPixels]
      };
      
      setFrames(newFrames);
      addToHistory(newFrames);
    }
  };

  // Render the canvas
  const renderCanvas = () => {
    const currentPixels = getCurrentPixels();
    const pixelSize = getPixelSize();
    const pixelCount = parseInt(canvasSize.split('x')[0]);
    const gridColor = darkMode ? '#333333' : '#CCCCCC';
    
    return (
      <div 
        ref={canvasRef}
        className={`relative border-2 ${darkMode ? 'border-gray-700' : 'border-gray-300'} overflow-hidden`}
        style={{ 
          width: `${pixelCount * pixelSize}px`, 
          height: `${pixelCount * pixelSize}px`,
          backgroundColor: darkMode ? '#222222' : '#FFFFFF'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid lines */}
        {showGrid && (
          <div className="absolute inset-0">
            {Array.from({ length: pixelCount + 1 }).map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute top-0 bottom-0"
                style={{
                  left: `${i * pixelSize}px`,
                  width: '1px',
                  backgroundColor: gridColor
                }}
              />
            ))}
            {Array.from({ length: pixelCount + 1 }).map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute left-0 right-0"
                style={{
                  top: `${i * pixelSize}px`,
                  height: '1px',
                  backgroundColor: gridColor
                }}
              />
            ))}
          </div>
        )}
        
        {/* Render pixels */}
        {currentPixels.map((pixel, index) => {
          const layer = layers.find(l => l.id === pixel.layerId);
          if (!layer || !layer.visible) return null;
          
          return (
            <div
              key={`p-${pixel.x}-${pixel.y}-${pixel.layerId}`}
              className="absolute"
              style={{
                left: `${pixel.x * pixelSize}px`,
                top: `${pixel.y * pixelSize}px`,
                width: `${pixelSize}px`,
                height: `${pixelSize}px`,
                backgroundColor: pixel.color,
                opacity: layer.opacity
              }}
            />
          );
        })}
        
        {/* Hover preview */}
        {hoveredPixel && (
          <div
            className="absolute border-2 border-white pointer-events-none"
            style={{
              left: `${hoveredPixel.x * pixelSize}px`,
              top: `${hoveredPixel.y * pixelSize}px`,
              width: `${pixelSize}px`,
              height: `${pixelSize}px`,
              boxShadow: '0 0 0 1px black',
              zIndex: 10
            }}
          />
        )}
        
        {/* Brush size preview */}
        {hoveredPixel && brushSize > 1 && (
          <div
            className="absolute border border-dashed border-white pointer-events-none"
            style={{
              left: `${(hoveredPixel.x - Math.floor(brushSize / 2)) * pixelSize}px`,
              top: `${(hoveredPixel.y - Math.floor(brushSize / 2)) * pixelSize}px`,
              width: `${brushSize * pixelSize}px`,
              height: `${brushSize * pixelSize}px`,
              zIndex: 9
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className="bg-cyan-800 shadow-lg p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-cyan-600 p-2 rounded-lg mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">PIXEL MARKETPLACE</h1>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={toggleDarkMode}
            className="px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d={darkMode 
                ? "M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" 
                : "M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
              } />
            </svg>
            {darkMode ? 'Light' : 'Dark'}
          </button>
          <button 
            onClick={previewMint}
            className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Preview & Publish
          </button>
        </div>
      </header>

      <div className="container mx-auto p-4 flex flex-wrap">
        {/* Left sidebar - Tools */}
        <div className="w-full md:w-64 space-y-6 mr-6">
          {/* Drawing Tools Panel */}
          <div className={`bg-gray-800 rounded-lg shadow overflow-hidden`}>
            <div 
              className="bg-gray-700 p-3 flex justify-between items-center cursor-pointer"
              onClick={() => togglePanelCollapse('tools')}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <h2 className="text-lg font-semibold">Tools</h2>
              </div>
              <svg 
                className={`w-5 h-5 transition-transform ${panelCollapsed.tools ? 'transform rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {!panelCollapsed.tools && (
              <div className="p-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCurrentTool('pencil')}
                    className={`flex items-center justify-center p-3 rounded ${
                      currentTool === 'pencil' 
                        ? 'bg-cyan-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Pencil
                  </button>
                  
                  <button
                    onClick={() => setCurrentTool('eraser')}
                    className={`flex items-center justify-center p-3 rounded ${
                      currentTool === 'eraser' 
                        ? 'bg-cyan-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eraser
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCurrentTool('fill')}
                    className={`flex items-center justify-center p-3 rounded ${
                      currentTool === 'fill' 
                        ? 'bg-cyan-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                    Fill
                  </button>
                  
                  <button
                    onClick={() => setCurrentTool('eyedropper')}
                    className={`flex items-center justify-center p-3 rounded ${
                      currentTool === 'eyedropper' 
                        ? 'bg-cyan-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Eyedropper
                  </button>
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-medium mb-1">Brush Size</label>
                  <div className="flex justify-between">
                    <button 
                      onClick={() => setBrushSize(1)} 
                      className={`px-3 py-1 rounded ${brushSize === 1 ? 'bg-cyan-600' : 'bg-gray-700'}`}
                    >
                      1px
                    </button>
                    <button 
                      onClick={() => setBrushSize(2)} 
                      className={`px-3 py-1 rounded ${brushSize === 2 ? 'bg-cyan-600' : 'bg-gray-700'}`}
                    >
                      2px
                    </button>
                    <button 
                      onClick={() => setBrushSize(4)} 
                      className={`px-3 py-1 rounded ${brushSize === 4 ? 'bg-cyan-600' : 'bg-gray-700'}`}
                    >
                      4px
                    </button>
                    <button 
                      onClick={createCustomBrush}
                      className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
                    >
                      Custom
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-medium mb-1">Symmetry</label>
                  <div className="flex justify-between">
                    <button 
                      onClick={() => setSymmetryMode('none')} 
                      className={`px-3 py-1 rounded ${symmetryMode === 'none