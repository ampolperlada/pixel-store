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
  const [historyMaxLength] = useState<number>(30);
  
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
  const [colorPalettes] = useState<{ [key: string]: string[] }>({
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

  // Add current frames state to history
  const addToHistory = (newFrames: Frame[]) => {
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
  };

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

    const newFrameId = Math.max(...frames.map(f => f.id), 0) + 1;

    // Create new frame based on currently active frame
    const activeFrame = frames.find(f => f.id === activeFrameId);

    // Option to duplicate current frame pixels or start fresh
// Option to duplicate current frame pixels or start fresh
    let newFramePixels: Pixel[] = [];
    
    // Ask user if they want to duplicate the current frame
    const shouldDuplicate = window.confirm("Do you want to duplicate the current frame? Click OK to duplicate, Cancel to start with empty frame.");
    
    if (shouldDuplicate && activeFrame) {
      newFramePixels = [...activeFrame.pixels];
    }
    
    const newFrame: Frame = {
      id: newFrameId,
      name: `Frame ${newFrameId + 1}`,
      pixels: newFramePixels,
      duration: 200
    };
    
    setFrames([...frames, newFrame]);
    setActiveFrameId(newFrameId);
    addToHistory([...frames, newFrame]);
  };

  // Delete frame
  const deleteFrame = (frameId: number) => {
    if (frames.length <= 1) {
      alert("Cannot delete the last frame");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this frame?")) {
      const newFrames = frames.filter(f => f.id !== frameId);
      setFrames(newFrames);
      
      // Set active frame to the first one if the active frame was deleted
      if (activeFrameId === frameId) {
        setActiveFrameId(newFrames[0].id);
      }
      
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
    const sourceFrame = frames[frameIndex];
    
    const newFrame: Frame = {
      id: newFrameId,
      name: `${sourceFrame.name} Copy`,
      pixels: [...sourceFrame.pixels],
      duration: sourceFrame.duration
    };
    
    // Insert after the source frame
    const newFrames = [
      ...frames.slice(0, frameIndex + 1),
      newFrame,
      ...frames.slice(frameIndex + 1)
    ];
    
    setFrames(newFrames);
    setActiveFrameId(newFrameId);
    addToHistory(newFrames);
  };

  // Update frame name
  const updateFrameName = (frameId: number, newName: string) => {
    const frameIndex = frames.findIndex(f => f.id === frameId);
    if (frameIndex < 0) return;
    
    const newFrames = [...frames];
    newFrames[frameIndex] = {
      ...newFrames[frameIndex],
      name: newName
    };
    
    setFrames(newFrames);
  };

  // Update frame duration
  const updateFrameDuration = (frameId: number, duration: number) => {
    const frameIndex = frames.findIndex(f => f.id === frameId);
    if (frameIndex < 0) return;
    
    const newFrames = [...frames];
    newFrames[frameIndex] = {
      ...newFrames[frameIndex],
      duration: Math.max(50, Math.min(2000, duration)) // Clamp between 50ms and 2s
    };
    
    setFrames(newFrames);
    addToHistory(newFrames);
  };

  // Export functions
  const exportAsPNG = () => {
    const canvas = document.createElement('canvas');
    const pixelCount = parseInt(canvasSize.split('x')[0]);
    const exportSize = 512; // Fixed export size
    const pixelSize = exportSize / pixelCount;
    
    canvas.width = exportSize;
    canvas.height = exportSize;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas with transparent background
    ctx.clearRect(0, 0, exportSize, exportSize);
    
    // Get current pixels
    const currentPixels = getCurrentPixels();
    
    // Draw pixels
    currentPixels.forEach(pixel => {
      const layer = layers.find(l => l.id === pixel.layerId);
      if (layer) {
        ctx.globalAlpha = layer.opacity;
        ctx.fillStyle = pixel.color;
        ctx.fillRect(
          pixel.x * pixelSize,
          pixel.y * pixelSize,
          pixelSize,
          pixelSize
        );
      }
    });
    
    // Download
    const link = document.createElement('a');
    link.download = `pixel-art-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const exportAsGIF = () => {
    // This is a placeholder - actual GIF export would require additional libraries
    alert("GIF export feature coming soon! For now, you can export individual frames as PNG.");
  };

  // Import image function
  const importImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const pixelCount = parseInt(canvasSize.split('x')[0]);
        canvas.width = pixelCount;
        canvas.height = pixelCount;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Draw and scale image to fit canvas
        ctx.drawImage(img, 0, 0, pixelCount, pixelCount);
        
        // Convert to pixels
        const imageData = ctx.getImageData(0, 0, pixelCount, pixelCount);
        const newPixels: Pixel[] = [];
        
        for (let y = 0; y < pixelCount; y++) {
          for (let x = 0; x < pixelCount; x++) {
            const index = (y * pixelCount + x) * 4;
            const r = imageData.data[index];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];
            const a = imageData.data[index + 3];
            
            // Only add non-transparent pixels
            if (a > 0) {
              const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
              newPixels.push({
                x,
                y,
                color,
                layerId: activeLayerId
              });
            }
          }
        }
        
        // Update current frame with imported pixels
        const frameIndex = frames.findIndex(f => f.id === activeFrameId);
        if (frameIndex >= 0) {
          const newFrames = [...frames];
          // Remove existing pixels on current layer
          newFrames[frameIndex].pixels = newFrames[frameIndex].pixels.filter(
            p => p.layerId !== activeLayerId
          );
          // Add imported pixels
          newFrames[frameIndex].pixels.push(...newPixels);
          
          setFrames(newFrames);
          addToHistory(newFrames);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Save/Load project functions
  const saveProject = () => {
    const projectData = {
      version: '1.0',
      canvasSize,
      layers,
      frames,
      timestamp: Date.now()
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `pixel-art-project-${Date.now()}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const loadProject = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const projectData = JSON.parse(e.target?.result as string);
        
        if (projectData.version && projectData.layers && projectData.frames) {
          setCanvasSize(projectData.canvasSize || INITIAL_CANVAS_SIZE);
          setLayers(projectData.layers);
          setFrames(projectData.frames);
          setActiveLayerId(projectData.layers[0]?.id || 0);
          setActiveFrameId(projectData.frames[0]?.id || 0);
          
          // Reset history
          setHistory([]);
          setHistoryIndex(-1);
          addToHistory(projectData.frames);
          
          alert('Project loaded successfully!');
        } else {
          alert('Invalid project file format.');
        }
      } catch (error) {
        alert('Error loading project file.');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  // Custom brush functions
  const createCustomBrush = () => {
    // Simple 3x3 brush creator - could be expanded to larger sizes
    const brushSize = 3;
    const newBrush: BrushPattern = Array(brushSize).fill(null).map(() => Array(brushSize).fill(false));
    
    // Default to center pixel active
    newBrush[1][1] = true;
    
    setCustomBrush(newBrush);
  };

  const toggleBrushPixel = (row: number, col: number) => {
    if (!customBrush) return;
    
    const newBrush = customBrush.map((r, i) => 
      r.map((c, j) => i === row && j === col ? !c : c)
    );
    
    setCustomBrush(newBrush);
  };

  const applyCustomBrush = (centerX: number, centerY: number) => {
    if (!customBrush) return;
    
    const pixelCount = parseInt(canvasSize.split('x')[0]);
    const frameIndex = frames.findIndex(f => f.id === activeFrameId);
    if (frameIndex < 0) return;
    
    const newFrames = [...frames];
    const brushCenter = Math.floor(customBrush.length / 2);
    
    customBrush.forEach((row, i) => {
      row.forEach((active, j) => {
        if (active) {
          const x = centerX + (j - brushCenter);
          const y = centerY + (i - brushCenter);
          
          if (x >= 0 && x < pixelCount && y >= 0 && y < pixelCount) {
            // Apply the same logic as the pencil tool
            const pixelIndex = newFrames[frameIndex].pixels.findIndex(
              p => p.x === x && p.y === y && p.layerId === activeLayerId
            );
            
            if (pixelIndex >= 0) {
              newFrames[frameIndex].pixels[pixelIndex].color = currentColor;
            } else {
              newFrames[frameIndex].pixels.push({
                x,
                y,
                color: currentColor,
                layerId: activeLayerId
              });
            }
          }
        }
      });
    });
    
    setFrames(newFrames);
  };

  // File input handlers
  const handleImageImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      importImage(file);
    }
    e.target.value = ''; // Reset input
  };

  const handleProjectLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/json') {
      loadProject(file);
    }
    e.target.value = ''; // Reset input
  };

  // Color management
  const addToRecentColors = (color: string) => {
    if (!recentColors.includes(color)) {
      const newRecentColors = [color, ...recentColors.slice(0, 9)];
      setRecentColors(newRecentColors);
    }
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    addToRecentColors(color);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 's':
            e.preventDefault();
            saveProject();
            break;
          case 'e':
            e.preventDefault();
            exportAsPNG();
            break;
        }
      } else {
        switch (e.key) {
          case 'p':
            setCurrentTool('pencil');
            break;
          case 'e':
            setCurrentTool('eraser');
            break;
          case 'f':
            setCurrentTool('fill');
            break;
          case 'i':
            setCurrentTool('eyedropper');
            break;
          case ' ':
            e.preventDefault();
            setIsAnimating(!isAnimating);
            break;
          case 'g':
            setShowGrid(!showGrid);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [historyIndex, history, currentTool, isAnimating, showGrid]);

  // Main render
  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Pixel Art Creator
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => setMintPreviewVisible(!mintPreviewVisible)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Preview NFT
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left Sidebar - Tools and Options */}
          <div className="col-span-3 space-y-4">
            {/* Tool Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'pencil', icon: '✏️', label: 'Pencil (P)' },
                  { id: 'eraser', icon: '🧹', label: 'Eraser (E)' },
                  { id: 'fill', icon: '🪣', label: 'Fill (F)' },
                  { id: 'eyedropper', icon: '💧', label: 'Eyedropper (I)' }
                ].map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setCurrentTool(tool.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      currentTool === tool.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    title={tool.label}
                  >
                    <div className="text-2xl mb-1">{tool.icon}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {tool.id.charAt(0).toUpperCase() + tool.id.slice(1)}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Brush Size */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Brush Size: {brushSize}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Symmetry Mode */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Symmetry
                </label>
                <select
                  value={symmetryMode}
                  onChange={(e) => setSymmetryMode(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="none">None</option>
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>

            {/* Color Picker */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Colors</h3>
              
              {/* Current Color */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={currentColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-mono text-sm"
                  />
                </div>
              </div>

              {/* Color Palettes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Palette
                </label>
                <select
                  value={currentPalette}
                  onChange={(e) => setCurrentPalette(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-2"
                >
                  <option value="basic">Basic</option>
                  <option value="pastel">Pastel</option>
                  <option value="vibrant">Vibrant</option>
                  <option value="retro">Retro</option>
                </select>
                
                <div className="grid grid-cols-5 gap-1">
                  {colorPalettes[currentPalette].map((color, index) => (
                    <button
                      key={`${currentPalette}-${index}`}
                      onClick={() => handleColorChange(color)}
                      className={`w-8 h-8 rounded border-2 transition-all ${
                        currentColor === color
                          ? 'border-gray-800 dark:border-white scale-110'
                          : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Recent Colors */}
              {recentColors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recent Colors
                  </label>
                  <div className="grid grid-cols-5 gap-1">
                    {recentColors.map((color, index) => (
                      <button
                        key={`recent-${index}`}
                        onClick={() => handleColorChange(color)}
                        className={`w-8 h-8 rounded border-2 transition-all ${
                          currentColor === color
                            ? 'border-gray-800 dark:border-white scale-110'
                            : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Canvas Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Canvas</h3>
              
              <div className="space-y-3">
                {/* Canvas Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Size
                  </label>
                  <select
                    value={canvasSize}
                    onChange={(e) => setCanvasSize(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  >
                    <option value="16x16">16×16</option>
                    <option value="32x32">32×32</option>
                    <option value="64x64">64×64</option>
                    <option value="128x128">128×128</option>
                  </select>
                </div>

                {/* Zoom Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Zoom: {Math.round(zoomLevel * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="4"
                    step="0.1"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Grid Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showGrid"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="showGrid" className="text-sm text-gray-700 dark:text-gray-300">
                    Show Grid (G)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Canvas */}
          <div className="col-span-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              {/* Canvas Controls */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Undo (Ctrl+Z)"
                  >
                    ↶
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Redo (Ctrl+Shift+Z)"
                  >
                    ↷
                  </button>
                  <button
                    onClick={clearCanvas}
                    className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                    title="Clear Canvas"
                  >
                    🗑️
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageImport}
                    className="hidden"
                    id="imageImport"
                  />
                  <label
                    htmlFor="imageImport"
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer transition-colors"
                  >
                    Import Image
                  </label>
                  
                  <button
                    onClick={exportAsPNG}
                    className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    title="Export as PNG (Ctrl+E)"
                  >
                    Export PNG
                  </button>
                </div>
              </div>

              {/* Canvas Container */}
              <div className="flex justify-center">
                <div className="relative inline-block border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <div
                    ref={canvasRef}
                    className="relative cursor-crosshair bg-white"
                    style={{
                      width: getCanvasDimensions().width,
                      height: getCanvasDimensions().height,
                      backgroundImage: showGrid 
                        ? `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`
                        : undefined,
                      backgroundSize: showGrid 
                        ? `${getPixelSize()}px ${getPixelSize()}px`
                        : undefined,
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {/* Render pixels */}
                    {getCurrentPixels().map((pixel, index) => {
                      const layer = layers.find(l => l.id === pixel.layerId);
                      const pixelSize = getPixelSize();
                      
                      return (
                        <div
                          key={`${pixel.x}-${pixel.y}-${pixel.layerId}-${index}`}
                          className="absolute"
                          style={{
                            left: pixel.x * pixelSize,
                            top: pixel.y * pixelSize,
                            width: pixelSize,
                            height: pixelSize,
                            backgroundColor: pixel.color,
                            opacity: layer?.opacity || 1,
                          }}
                        />
                      );
                    })}

                    {/* Hover indicator */}
                    {hoveredPixel && (
                      <div
                        className="absolute border-2 border-blue-500 pointer-events-none"
                        style={{
                          left: hoveredPixel.x * getPixelSize(),
                          top: hoveredPixel.y * getPixelSize(),
                          width: getPixelSize(),
                          height: getPixelSize(),
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Canvas Info */}
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                {canvasSize} canvas • {getCurrentPixels().length} pixels drawn
                {hoveredPixel && ` • Cursor: (${hoveredPixel.x}, ${hoveredPixel.y})`}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Layers, Animation, Browser */}
          <div className="col-span-3 space-y-4">
            {/* Panel Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="flex border-b border-gray-200 dark:border-gray-600">
                {[
                  { id: 'layers', label: 'Layers', icon: '🏠' },
                  { id: 'animation', label: 'Animation', icon: '🎬' },
                  { id: 'browser', label: 'Browser', icon: '🛍️' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActivePanel(tab.id)}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                      activePanel === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                  <span className="mr-1">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Layers Panel */}
              {activePanel === 'layers' && (
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Layers</h3>
                    <button
                      onClick={addLayer}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
                    >
                      + Add Layer
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {[...layers].reverse().map(layer => (
                      <div
                        key={layer.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          activeLayerId === layer.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                        onClick={() => setActiveLayerId(layer.id)}
                      >
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={layer.name}
                            onChange={(e) => updateLayerName(layer.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-transparent text-sm font-medium text-gray-800 dark:text-white border-none outline-none flex-1"
                          />
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLayerVisibility(layer.id);
                              }}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            >
                              {layer.visible ? '👁️' : '🙈'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteLayer(layer.id);
                              }}
                              className="p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded text-red-600"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Opacity: {Math.round(layer.opacity * 100)}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={layer.opacity}
                            onChange={(e) => updateLayerOpacity(layer.id, parseFloat(e.target.value))}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Animation Panel */}
              {activePanel === 'animation' && (
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Animation</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsAnimating(!isAnimating)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          isAnimating
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {isAnimating ? '⏸️ Stop' : '▶️ Play'}
                      </button>
                      <button
                        onClick={exportAsGIF}
                        className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm transition-colors"
                      >
                        Export GIF
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <button
                      onClick={addFrame}
                      className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                    >
                      + Add Frame
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {frames.map((frame, index) => (
                      <div
                        key={frame.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          activeFrameId === frame.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                        onClick={() => setActiveFrameId(frame.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <input
                            type="text"
                            value={frame.name}
                            onChange={(e) => updateFrameName(frame.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-transparent text-sm font-medium text-gray-800 dark:text-white border-none outline-none flex-1"
                          />
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateFrame(frame.id);
                              }}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                              title="Duplicate Frame"
                            >
                              📋
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteFrame(frame.id);
                              }}
                              className="p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded text-red-600"
                              title="Delete Frame"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Duration: {frame.duration}ms
                          </label>
                          <input
                            type="range"
                            min="50"
                            max="2000"
                            step="50"
                            value={frame.duration}
                            onChange={(e) => updateFrameDuration(frame.id, parseInt(e.target.value))}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Browser Panel */}
              {activePanel === 'browser' && (
                <div className="pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Template Browser</h3>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />

                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    >
                      <option value="all">All Categories</option>
                      <option value="characters">Characters</option>
                      <option value="objects">Objects</option>
                      <option value="nature">Nature</option>
                      <option value="abstract">Abstract</option>
                    </select>

                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                      {filteredTemplates.map(template => (
                        <div
                          key={template.id}
                          className="border border-gray-200 dark:border-gray-600 rounded-lg p-2 cursor-pointer hover:border-blue-500 transition-colors"
                          onClick={() => loadTemplate(template)}
                        >
                          <div className="w-full h-20 bg-gray-100 dark:bg-gray-700 rounded mb-2 flex items-center justify-center">
                            <span className="text-2xl">{template.preview}</span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                            {template.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Brush Creator */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Custom Brush</h3>
              
              <button
                onClick={createCustomBrush}
                className="w-full px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded mb-3 transition-colors"
              >
                Create Brush
              </button>

              {customBrush && (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-1 max-w-24 mx-auto">
                    {customBrush.map((row, i) =>
                      row.map((active, j) => (
                        <button
                          key={`${i}-${j}`}
                          onClick={() => toggleBrushPixel(i, j)}
                          className={`w-6 h-6 border rounded transition-all ${
                            active
                              ? 'bg-blue-500 border-blue-600'
                              : 'bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500'
                          }`}
                        />
                      ))
                    )}
                  </div>
                  <label className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={currentTool === 'custom'}
                      onChange={(e) => setCurrentTool(e.target.checked ? 'custom' : 'pencil')}
                      className="mr-2"
                    />
                    Use Custom Brush
                  </label>
                </div>
              )}
            </div>

            {/* Project Management */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Project</h3>
              
              <div className="space-y-2">
                <button
                  onClick={saveProject}
                  className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                >
                  Save Project (Ctrl+S)
                </button>
                
                <input
                  type="file"
                  accept=".json"
                  onChange={handleProjectLoad}
                  className="hidden"
                  id="projectLoad"
                />
                <label
                  htmlFor="projectLoad"
                  className="block w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-center cursor-pointer transition-colors"
                >
                  Load Project
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* NFT Preview Modal */}
        {mintPreviewVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">NFT Preview</h2>
                <button
                  onClick={() => setMintPreviewVisible(false)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  ✕
                </button>
              </div>
              
              <div className="text-center mb-4">
                <div className="inline-block border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden mb-4">
                  <div
                    className="bg-white"
                    style={{
                      width: 200,
                      height: 200,
                      backgroundImage: showGrid 
                        ? `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`
                        : undefined,
                      backgroundSize: showGrid 
                        ? `${200 / parseInt(canvasSize.split('x')[0])}px ${200 / parseInt(canvasSize.split('x')[0])}px`
                        : undefined,
                      position: 'relative'
                    }}
                  >
                    {getCurrentPixels().map((pixel, index) => {
                      const layer = layers.find(l => l.id === pixel.layerId);
                      const pixelSize = 200 / parseInt(canvasSize.split('x')[0]);
                      
                      return (
                        <div
                          key={`preview-${pixel.x}-${pixel.y}-${pixel.layerId}-${index}`}
                          style={{
                            position: 'absolute',
                            left: pixel.x * pixelSize,
                            top: pixel.y * pixelSize,
                            width: pixelSize,
                            height: pixelSize,
                            backgroundColor: pixel.color,
                            opacity: layer?.opacity || 1,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Pixel Art #{Date.now() % 10000}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {canvasSize} • {getCurrentPixels().length} pixels • {frames.length} frame{frames.length !== 1 ? 's' : ''}
                </p>
                
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
                    Mint as NFT
                  </button>
                  <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                    Share to Gallery
                  </button>
                  <button 
                    onClick={exportAsPNG}
                    className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    Download PNG
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Help */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Tools</h4>
              <div className="space-y-1 text-gray-600 dark:text-gray-400">
                <div>P - Pencil tool</div>
                <div>E - Eraser tool</div>
                <div>F - Fill tool</div>
                <div>I - Eyedropper tool</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Actions</h4>
              <div className="space-y-1 text-gray-600 dark:text-gray-400">
                <div>Ctrl+Z - Undo</div>
                <div>Ctrl+Shift+Z - Redo</div>
                <div>Ctrl+S - Save project</div>
                <div>Ctrl+E - Export PNG</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">View</h4>
              <div className="space-y-1 text-gray-600 dark:text-gray-400">
                <div>G - Toggle grid</div>
                <div>Space - Play/pause animation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixelArtCreator;
