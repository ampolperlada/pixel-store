import React, { useState, useRef, useEffect } from 'react';
import { Download, Upload, Undo, Redo, Grid, Palette, Brush, Eye, Save, Folder, Settings, Play, Square, User, UserCheck, Layers, HelpCircle, BookOpen, Zap, Target, Ruler, Lock, Unlock, RotateCcw, Copy, Trash2, Move, ZoomIn, ZoomOut, Lightbulb, Star, X, Monitor, FilePlus, Edit3, AlertTriangle, Copy as CopyIcon, RefreshCw } from 'lucide-react';

const PixelForgeCreator = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasSize] = useState({ width: 512, height: 512 });
  const [pixelSize, setPixelSize] = useState(8);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [selectedTool, setSelectedTool] = useState('pencil');
  const [brushSize, setBrushSize] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showGuides, setShowGuides] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [activeSection, setActiveSection] = useState('head');
  const [characterGender, setCharacterGender] = useState('male');
  const [layers, setLayers] = useState([
    { id: 1, name: 'Background', visible: true, locked: false, opacity: 100 },
    { id: 2, name: 'Body Base', visible: true, locked: false, opacity: 100 },
    { id: 3, name: 'Clothing', visible: true, locked: false, opacity: 100 },
    { id: 4, name: 'Accessories', visible: true, locked: false, opacity: 100 },
    { id: 5, name: 'Hair/Hat', visible: true, locked: false, opacity: 100 }
  ]);
  const [activeLayer, setActiveLayer] = useState(2);
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [savedProjects, setSavedProjects] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [symmetryEnabled, setSymmetryEnabled] = useState(false);
  const [symmetryAxis, setSymmetryAxis] = useState('vertical'); // 'vertical', 'horizontal', 'both'
  const [showUIPanel, setShowUIPanel] = useState('tools'); // 'tools', 'layers', 'animation'
  const [showAnimationTimeline, setShowAnimationTimeline] = useState(false);
  const [frames, setFrames] = useState([{ id: 1, name: 'Frame 1', duration: 100 }]);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mintPreview, setMintPreview] = useState(false);
  const [rarityLevel, setRarityLevel] = useState<'common' | 'rare' | 'legendary'>('common'); // 'common', 'rare', 'legendary'

  // NFT Character Sections with exact measurements
  const characterSections = [
    { id: 'head', name: 'Head', icon: '👤', area: { x: 176, y: 32, width: 160, height: 160 }, color: '#FF6B6B' },
    { id: 'hair', name: 'Hair', icon: '🦱', area: { x: 160, y: 32, width: 192, height: 96 }, color: '#4ECDC4' },
    { id: 'eyes', name: 'Eyes', icon: '👁️', area: { x: 192, y: 80, width: 128, height: 32 }, color: '#45B7D1' },
    { id: 'mouth', name: 'Mouth', icon: '👄', area: { x: 208, y: 128, width: 96, height: 32 }, color: '#FFA07A' },
    { id: 'torso', name: 'Torso', icon: '👕', area: { x: 176, y: 192, width: 160, height: 128 }, color: '#98D8C8' },
    { id: 'arms', name: 'Arms', icon: '💪', area: { x: 96, y: 192, width: 320, height: 128 }, color: '#F7DC6F' },
    { id: 'hands', name: 'Hands', icon: '✋', area: { x: 96, y: 288, width: 320, height: 48 }, color: '#BB8FCE' },
    { id: 'legs', name: 'Legs', icon: '🦵', area: { x: 176, y: 320, width: 160, height: 128 }, color: '#85C1E9' },
    { id: 'feet', name: 'Feet', icon: '👟', area: { x: 160, y: 448, width: 192, height: 32 }, color: '#F8C471' },
    { id: 'accessories', name: 'Accessories', icon: '⚔️', area: { x: 32, y: 192, width: 448, height: 256 }, color: '#D7BDE2' },
    { id: 'hat', name: 'Hat/Helmet', icon: '🎩', area: { x: 144, y: 16, width: 224, height: 96 }, color: '#AED6F1' }
  ];

  // Enhanced brush sizes
  const brushSizes = [
    { id: 1, size: 1, label: '1px' },
    { id: 2, size: 2, label: '2px' },
    { id: 3, size: 4, label: '4px' },
  ];

  // Advanced professional tools
  const advancedTools = [
    { id: 'pencil', name: 'Pencil', icon: '✏️', hotkey: 'P', description: 'Draw pixel by pixel' },
    { id: 'brush', name: 'Brush', icon: '🖌️', hotkey: 'B', description: 'Paint with various sizes' },
    { id: 'eraser', name: 'Eraser', icon: '🧹', hotkey: 'E', description: 'Erase pixels' },
    { id: 'fill', name: 'Bucket Fill', icon: '🪣', hotkey: 'F', description: 'Fill an area with color' },
    { id: 'eyedropper', name: 'Color Picker', icon: '💧', hotkey: 'I', description: 'Pick a color from canvas' },
    { id: 'line', name: 'Line Tool', icon: '📏', hotkey: 'L', description: 'Draw straight lines' },
    { id: 'rectangle', name: 'Rectangle', icon: '⬜', hotkey: 'R', description: 'Draw rectangles' },
    { id: 'circle', name: 'Circle', icon: '⭕', hotkey: 'C', description: 'Draw circles' },
    { id: 'select', name: 'Selection', icon: '⭐', hotkey: 'S', description: 'Select and move parts' },
    { id: 'move', name: 'Move', icon: '🔄', hotkey: 'M', description: 'Move selection or layer' }
  ];

  // Professional color palettes
  const professionalPalettes = {
    skin: {
      name: 'Skin Tones',
      colors: ['#FDBCB4', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#654321', '#4A4A4A', '#2D2D2D']
    },
    hair: {
      name: 'Hair Colors',
      colors: ['#000000', '#4A3C28', '#8B4513', '#DAA520', '#FF8C00', '#DC143C', '#4B0082', '#87CEEB']
    },
    clothing: {
      name: 'Clothing',
      colors: ['#FF0000', '#0000FF', '#008000', '#FFFF00', '#800080', '#FFA500', '#FF69B4', '#00CED1']
    },
    metal: {
      name: 'Metals/Armor',
      colors: ['#C0C0C0', '#FFD700', '#CD7F32', '#708090', '#2F4F4F', '#000000', '#800000', '#4B0082']
    },
    nature: {
      name: 'Nature/Magic',
      colors: ['#228B22', '#32CD32', '#00FF7F', '#00FA9A', '#20B2AA', '#008B8B', '#8A2BE2', '#FF1493']
    }
  };

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Pixel Forge Creator",
      content: "This professional pixel art tool is designed specifically for creating consistent NFT characters. Let's start with the basics!",
      highlight: "canvas"
    },
    {
      title: "Character Sections",
      content: "Your canvas is divided into precise sections for different body parts. Click on any section to focus your edits.",
      highlight: "sections"
    },
    {
      title: "Tools & Brushes",
      content: "Use advanced tools like brush, line, and shape tools. Each tool has keyboard shortcuts for faster workflow.",
      highlight: "tools"
    },
    {
      title: "Professional Layers",
      content: "Work with multiple layers to organize your artwork. Lock layers to prevent accidental edits.",
      highlight: "layers"
    },
    {
      title: "NFT Standards",
      content: "Your art follows strict NFT standards: 512×512px canvas with 32px margins for perfect consistency.",
      highlight: "standards"
    }
  ];

  // Character Templates
  const characterTemplates = {
    male: [
      { name: 'Warrior', preview: '/api/placeholder/64/64', data: null },
      { name: 'Wizard', preview: '/api/placeholder/64/64', data: null },
      { name: 'Rogue', preview: '/api/placeholder/64/64', data: null },
      { name: 'Paladin', preview: '/api/placeholder/64/64', data: null }
    ],
    female: [
      { name: 'Archer', preview: '/api/placeholder/64/64', data: null },
      { name: 'Mage', preview: '/api/placeholder/64/64', data: null },
      { name: 'Assassin', preview: '/api/placeholder/64/64', data: null },
      { name: 'Healer', preview: '/api/placeholder/64/64', data: null }
    ]
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!canvas) return;
    if (!canvas) return;
    if (!canvas) return;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas with transparent background for NFT
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    
    // Draw NFT guidelines
    if (showGuides) {
      drawNFTGuidelines(ctx);
    }
    
    if (showGrid) {
      drawProfessionalGrid(ctx);
    }

    // Draw section highlights
    if (showGuides) {
      drawSectionHighlights(ctx);
    }
  }, [canvasSize, pixelSize, showGrid, showGuides, activeSection]);

  interface NFTGuidelinesContext extends CanvasRenderingContext2D {}

  const drawNFTGuidelines = (ctx: NFTGuidelinesContext): void => {
    ctx.save();
    
    // Main character boundary (480x480 with 32px margins)
    ctx.strokeStyle = '#00FF41';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(32, 32, 448, 448);
    
    // Center guidelines
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(256, 32);
    ctx.lineTo(256, 480);
    ctx.moveTo(32, 256);
    ctx.lineTo(480, 256);
    ctx.stroke();
    
    // Character proportion guidelines
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    
    // Head area
    ctx.strokeRect(176, 32, 160, 160);
    
    // Body area
    ctx.strokeRect(176, 192, 160, 160);
    
    // Legs area
    ctx.strokeRect(176, 352, 160, 128);
    
    ctx.restore();
  };

  const drawProfessionalGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;
    
    // Major grid lines (every 32 pixels)
    for (let x = 0; x <= canvasSize.width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasSize.height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= canvasSize.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasSize.width, y);
      ctx.stroke();
    }
    
    // Minor grid lines
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.25;
    
    for (let x = 0; x <= canvasSize.width; x += pixelSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasSize.height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= canvasSize.height; y += pixelSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasSize.width, y);
      ctx.stroke();
    }
    
    ctx.restore();
  };

  interface CharacterSection {
    id: string;
    name: string;
    icon: string;
    area: { x: number; y: number; width: number; height: number };
    color: string;
  }

  interface DrawSectionHighlightsContext extends CanvasRenderingContext2D {}

  const drawSectionHighlights = (
    ctx: DrawSectionHighlightsContext
  ): void => {
    const activeAreaSection: CharacterSection | undefined = characterSections.find(
      (s: CharacterSection) => s.id === activeSection
    );
    if (!activeAreaSection) return;

    ctx.save();
    ctx.strokeStyle = activeAreaSection.color;
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.8;

    const { x, y, width, height } = activeAreaSection.area;
    ctx.strokeRect(x, y, width, height);

    // Add corner indicators
    const cornerSize = 8;
    ctx.fillStyle = activeAreaSection.color;
    ctx.fillRect(x - cornerSize / 2, y - cornerSize / 2, cornerSize, cornerSize);
    ctx.fillRect(x + width - cornerSize / 2, y - cornerSize / 2, cornerSize, cornerSize);
    ctx.fillRect(x - cornerSize / 2, y + height - cornerSize / 2, cornerSize, cornerSize);
    ctx.fillRect(x + width - cornerSize / 2, y + height - cornerSize / 2, cornerSize, cornerSize);

    ctx.restore();
  };

  interface PixelPosition {
    x: number;
    y: number;
  }

  const getPixelPosition = (e: React.MouseEvent<HTMLCanvasElement>): PixelPosition => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor(((e.clientX - rect.left) * scaleX) / pixelSize);
    const y = Math.floor(((e.clientY - rect.top) * scaleY) / pixelSize);
    
    return { x, y };
  };

  interface DrawPixelOptions {
    x: number;
    y: number;
    color: string;
    tool?: string;
  }

  const drawPixel = (
    x: number,
    y: number,
    color: string,
    tool: string = selectedTool
  ): void => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    
    const pixelX = x * pixelSize;
    const pixelY = y * pixelSize;
    
    if (tool === 'eraser') {
      ctx.clearRect(pixelX, pixelY, pixelSize * brushSize, pixelSize * brushSize);
    } else if (tool === 'brush') {
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(pixelX, pixelY, pixelSize * brushSize, pixelSize * brushSize);
      ctx.globalAlpha = 1.0;
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
    }
    
    // Handle symmetry if enabled
    if (symmetryEnabled) {
      const centerX = Math.floor(canvasSize.width / pixelSize / 2);
      const centerY = Math.floor(canvasSize.height / pixelSize / 2);
      
      if (symmetryAxis === 'vertical' || symmetryAxis === 'both') {
        const mirrorX = 2 * centerX - x;
        if (tool === 'eraser') {
          ctx.clearRect(mirrorX * pixelSize, pixelY, pixelSize * brushSize, pixelSize * brushSize);
        } else if (tool === 'brush') {
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.8;
          ctx.fillRect(mirrorX * pixelSize, pixelY, pixelSize * brushSize, pixelSize * brushSize);
          ctx.globalAlpha = 1.0;
        } else {
          ctx.fillStyle = color;
          ctx.fillRect(mirrorX * pixelSize, pixelY, pixelSize, pixelSize);
        }
      }
      
      if (symmetryAxis === 'horizontal' || symmetryAxis === 'both') {
        const mirrorY = 2 * centerY - y;
        if (tool === 'eraser') {
          ctx.clearRect(pixelX, mirrorY * pixelSize, pixelSize * brushSize, pixelSize * brushSize);
        } else if (tool === 'brush') {
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.8;
          ctx.fillRect(pixelX, mirrorY * pixelSize, pixelSize * brushSize, pixelSize * brushSize);
          ctx.globalAlpha = 1.0;
        } else {
          ctx.fillStyle = color;
          ctx.fillRect(pixelX, mirrorY * pixelSize, pixelSize, pixelSize);
        }
      }
      
      if (symmetryAxis === 'both') {
        const mirrorX = 2 * centerX - x;
        const mirrorY = 2 * centerY - y;
        if (tool === 'eraser') {
          ctx.clearRect(mirrorX * pixelSize, mirrorY * pixelSize, pixelSize * brushSize, pixelSize * brushSize);
        } else if (tool === 'brush') {
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.8;
          ctx.fillRect(mirrorX * pixelSize, mirrorY * pixelSize, pixelSize * brushSize, pixelSize * brushSize);
          ctx.globalAlpha = 1.0;
        } else {
          ctx.fillStyle = color;
          ctx.fillRect(mirrorX * pixelSize, mirrorY * pixelSize, pixelSize, pixelSize);
        }
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const { x, y } = getPixelPosition(e);
    
    if (selectedTool === 'eyedropper') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const imageData = ctx.getImageData(x * pixelSize + pixelSize/2, y * pixelSize + pixelSize/2, 1, 1);
      const data = imageData.data;
      if (data[3] > 0) {
        const color = `#${((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1)}`;
        setCurrentColor(color);
      }
      return;
    }
    
    drawPixel(x, y, currentColor);
    saveToHistory();
  };

  interface MouseEventWithClient extends React.MouseEvent<HTMLCanvasElement> {
    clientX: number;
    clientY: number;
  }

  const handleMouseMove = (e: MouseEventWithClient) => {
    if (!isDrawing) return;
    const { x, y } = getPixelPosition(e);
    drawPixel(x, y, currentColor);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imageData = canvas.toDataURL();
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

 const undo = () => {
  if (historyStep > 0) {
    setHistoryStep(historyStep - 1);
    const canvas = canvasRef.current;
    
    // Add null check for canvas
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Add null check for ctx
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = history[historyStep - 1];
  }
};

  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[historyStep + 1];
    }
  };

  const exportNFT = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `nft-character-${characterGender}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    saveToHistory();
  };

  const saveProject = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();
    const projectData = {
      id: Date.now(),
      name: `NFT Character ${characterGender}`,
      imageData,
      canvasSize,
      pixelSize,
      characterGender,
      activeSection,
      layers,
      timestamp: Date.now()
    };
    
    const saved = JSON.parse(localStorage.getItem('pixel-projects') || '[]');
    saved.push(projectData);
    localStorage.setItem('pixel-projects', JSON.stringify(saved));
    setSavedProjects(saved);
    alert('Project saved successfully!');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const nextTutorialStep = () => {
    if (currentTutorialStep < tutorialSteps.length - 1) {
      setCurrentTutorialStep(currentTutorialStep + 1);
    } else {
      setShowTutorial(false);
      setCurrentTutorialStep(0);
    }
  };

  const previousTutorialStep = () => {
    if (currentTutorialStep > 0) {
      setCurrentTutorialStep(currentTutorialStep - 1);
    }
  };

  const addLayer = () => {
    const newLayer = {
      id: layers.length + 1,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      locked: false,
      opacity: 100
    };
    setLayers([...layers, newLayer]);
    setActiveLayer(newLayer.id);
  };

  interface DeleteLayer {
    (id: number): void;
  }

  const deleteLayer: DeleteLayer = (id) => {
    if (layers.length <= 1) return; // Prevent deleting the last layer
    const newLayers = layers.filter((layer: Layer) => layer.id !== id);
    setLayers(newLayers);
    if (activeLayer === id) {
      setActiveLayer(newLayers[0].id);
    }
  };

  interface Layer {
    id: number;
    name: string;
    visible: boolean;
    locked: boolean;
    opacity: number;
  }

  const toggleLayerVisibility = (id: number) => {
    setLayers(layers.map((layer: Layer) => 
      layer.id === id ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  interface ToggleLayerLock {
    (id: number): void;
  }

  const toggleLayerLock: ToggleLayerLock = (id) => {
    setLayers(layers.map((layer: Layer) => 
      layer.id === id ? { ...layer, locked: !layer.locked } : layer
    ));
  };

  interface UpdateLayerOpacity {
    (id: number, opacity: number): void;
  }

  const updateLayerOpacity: UpdateLayerOpacity = (id, opacity) => {
    setLayers(layers.map((layer: Layer) => 
      layer.id === id ? { ...layer, opacity } : layer
    ));
  };

  const detectRarity = () => {
    // In a real app, this would analyze the artwork complexity and details
    // Here we'll just simulate it with a random selection
    const rarities = ['common', 'rare', 'legendary'];
    const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
    setRarityLevel(randomRarity as 'common' | 'rare' | 'legendary');
    return randomRarity;
  };

  const addFrame = () => {
    const newFrame = {
      id: frames.length + 1,
      name: `Frame ${frames.length + 1}`,
      duration: 100
    };
    setFrames([...frames, newFrame]);
  };

  const toggleSymmetry = () => {
    setSymmetryEnabled(!symmetryEnabled);
  };

  interface ChangeSymmetryAxis {
    (axis: 'vertical' | 'horizontal' | 'both'): void;
  }

  const changeSymmetryAxis: ChangeSymmetryAxis = (axis) => {
    setSymmetryAxis(axis);
  };

  // Tutorial Overlay Component
  const TutorialOverlay = () => {
    if (!showTutorial) return null;
    
    const currentStep = tutorialSteps[currentTutorialStep];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-4 border border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-blue-400">{currentStep.title}</h3>
            <span className="text-sm text-gray-400">
              {currentTutorialStep + 1} / {tutorialSteps.length}
            </span>
          </div>
          <p className="text-gray-300 mb-6">{currentStep.content}</p>
          <div className="flex justify-between">
            <button
              onClick={previousTutorialStep}
              disabled={currentTutorialStep === 0}
              className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setShowTutorial(false)}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Skip Tutorial
            </button>
            <button
              onClick={nextTutorialStep}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {currentTutorialStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Templates Panel Component
  const TemplatesPanel = () => {
    if (!showTemplates) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 border border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-purple-400">Character Templates</h3>
            <button
              onClick={() => setShowTemplates(false)}
              className="p-1 rounded-full bg-gray-700 hover:bg-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-4">
            <div className="flex space-x-4 mb-2">
              <button 
                className={`px-4 py-2 rounded ${characterGender === 'male' ? 'bg-blue-600' : 'bg-gray-700'}`}
                onClick={() => setCharacterGender('male')}
              >
                Male Characters
              </button>
              <button 
                className={`px-4 py-2 rounded ${characterGender === 'female' ? 'bg-pink-600' : 'bg-gray-700'}`}
                onClick={() => setCharacterGender('female')}
              >
                Female Characters
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {characterTemplates[characterGender as 'male' | 'female'].map((template) => (
              <div key={template.name} className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 cursor-pointer">
<div className="w-full h-32 bg-gray-600 flex items-center justify-center mb-2">
                  <img src={template.preview} alt={template.name} className="max-h-full" />
                </div>
                <p className="text-center font-semibold">{template.name}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded"
              onClick={() => setShowTemplates(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Mint Preview Panel Component
  const MintPreviewPanel = () => {
    if (!mintPreview) return null;
    
    const rarityColor = {
      'common': 'text-gray-300',
      'rare': 'text-blue-400',
      'legendary': 'text-yellow-400'
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">NFT Preview</h3>
            <button
              onClick={() => setMintPreview(false)}
              className="p-1 rounded-full bg-gray-700 hover:bg-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="bg-gray-900 p-4 rounded-lg mb-4">
            <div className="bg-gray-800 rounded-lg p-2 mb-4">
              <canvas 
                ref={canvasRef} 
                width={canvasSize.width} 
                height={canvasSize.height}
                className="w-full border border-gray-700 rounded"
              />
            </div>
            
            <div className="flex justify-center mb-2">
              <span className={`text-2xl font-bold uppercase ${rarityColor[rarityLevel]}`}>
                {rarityLevel}
              </span>
            </div>
            
            <div className="flex justify-between text-sm text-gray-400">
              <span>Created by: You</span>
              <span>Collection: Pixel Forge</span>
            </div>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Estimated Value:</span>
              <span className="font-bold text-white">
                {rarityLevel === 'common' ? '0.01-0.05 ETH' : 
                 rarityLevel === 'rare' ? '0.05-0.2 ETH' : '0.2-1.0 ETH'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Gas Fee (est.):</span>
              <span className="font-bold text-white">0.002 ETH</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={exportNFT}
            >
              Export PNG
            </button>
            <button 
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded"
              onClick={() => setMintPreview(false)}
            >
              Continue Editing
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Animation Timeline Component
  const AnimationTimeline = () => {
    if (!showAnimationTimeline) return null;
    
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold">Animation Frames</h3>
          <div className="flex space-x-2">
            <button
              className="p-1 bg-blue-600 rounded hover:bg-blue-700"
              onClick={addFrame}
              title="Add Frame"
            >
              <FilePlus size={16} />
            </button>
            <button
              className={`p-1 rounded ${isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Stop Animation' : 'Play Animation'}
            >
              {isPlaying ? <Square size={16} /> : <Play size={16} />}
            </button>
          </div>
        </div>
        
        <div className="flex space-x-2 overflow-x-auto py-2">
          {frames.map((frame) => (
            <div 
              key={frame.id}
              className={`flex-shrink-0 w-16 h-16 border-2 cursor-pointer ${currentFrame === frame.id ? 'border-blue-500' : 'border-gray-600'} bg-gray-700 flex items-center justify-center`}
              onClick={() => setCurrentFrame(frame.id)}
            >
              <p className="text-xs text-center text-gray-300">{frame.name}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-gray-400">Frame {currentFrame}</span>
          <div className="flex items-center">
            <span className="text-gray-400 mr-2">Duration:</span>
            <input 
              type="range" 
              min="50" 
              max="500" 
              value={frames.find(f => f.id === currentFrame)?.duration || 100}
              onChange={(e) => {
                const newFrames = frames.map(f => 
                  f.id === currentFrame ? {...f, duration: parseInt(e.target.value)} : f
                );
                setFrames(newFrames);
              }}
              className="w-24"
            />
            <span className="text-gray-400 ml-1">
              {frames.find(f => f.id === currentFrame)?.duration || 100}ms
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Main Component Render
  return (
    <div className={`flex flex-col h-screen bg-gray-900 text-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-blue-400 mr-2">Pixel Forge Creator</h1>
          <span className="bg-purple-700 text-xs px-2 py-1 rounded">NFT Edition</span>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowTutorial(true)}
            className="flex items-center px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
            title="Help & Tutorial"
          >
            <HelpCircle size={16} className="mr-1" />
            <span className="text-sm">Tutorial</span>
          </button>
          
          <button 
            onClick={saveProject}
            className="flex items-center px-3 py-1 bg-green-600 rounded hover:bg-green-700"
            title="Save Project"
          >
            <Save size={16} className="mr-1" />
            <span className="text-sm">Save</span>
          </button>
          
          <button 
            onClick={() => setMintPreview(true)}
            className="flex items-center px-3 py-1 bg-purple-600 rounded hover:bg-purple-700"
            title="Preview NFT"
          >
            <Zap size={16} className="mr-1" />
            <span className="text-sm">Preview NFT</span>
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="flex items-center px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            <Monitor size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col p-2">
          <div className="flex flex-col space-y-3 mb-4">
            <button 
              className={`p-2 rounded ${showUIPanel === 'tools' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setShowUIPanel('tools')}
              title="Drawing Tools"
            >
              <Brush size={20} />
            </button>
            <button 
              className={`p-2 rounded ${showUIPanel === 'layers' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setShowUIPanel('layers')}
              title="Layers"
            >
              <Layers size={20} />
            </button>
            <button 
              className={`p-2 rounded ${showUIPanel === 'animation' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => {
                setShowUIPanel('animation');
                setShowAnimationTimeline(true);
              }}
              title="Animation"
            >
              <Play size={20} />
            </button>
          </div>
          
          <div className="flex flex-col space-y-2 items-center mb-4">
            <div className="h-0.5 w-full bg-gray-700 my-1"></div>
            <button 
              className={`p-2 rounded ${showGrid ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setShowGrid(!showGrid)}
              title="Toggle Grid"
            >
              <Grid size={20} />
            </button>
            <button 
              className={`p-2 rounded ${showGuides ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setShowGuides(!showGuides)}
              title="Toggle Guidelines"
            >
              <Target size={20} />
            </button>
            <button 
              className={`p-2 rounded ${symmetryEnabled ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={toggleSymmetry}
              title="Toggle Symmetry"
            >
              <RefreshCw size={20} />
            </button>
          </div>
          
          <div className="flex flex-col space-y-2 items-center mt-auto">
            <button 
              className="p-2 rounded bg-gray-700 hover:bg-gray-600"
              onClick={undo}
              title="Undo"
              disabled={historyStep <= 0}
            >
              <Undo size={20} className={historyStep <= 0 ? 'opacity-50' : ''} />
            </button>
            <button 
              className="p-2 rounded bg-gray-700 hover:bg-gray-600"
              onClick={redo}
              title="Redo"
              disabled={historyStep >= history.length - 1}
            >
              <Redo size={20} className={historyStep >= history.length - 1 ? 'opacity-50' : ''} />
            </button>
            <button 
              className="p-2 rounded bg-red-700 hover:bg-red-600"
              onClick={clearCanvas}
              title="Clear Canvas"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
        
        {/* Right Panel Based on Active Panel */}
        <div className="w-64 bg-gray-800 border-l border-gray-700 p-3 overflow-y-auto">
          {showUIPanel === 'tools' && (
            <div>
              <h3 className="text-lg font-bold mb-3">Drawing Tools</h3>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {advancedTools.map((tool) => (
                  <button
                    key={tool.id}
                    className={`p-2 flex flex-col items-center justify-center rounded ${selectedTool === tool.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => setSelectedTool(tool.id)}
                    title={`${tool.name} (${tool.hotkey})`}
                  >
                    <span className="text-lg mb-1">{tool.icon}</span>
                    <span className="text-xs">{tool.name}</span>
                  </button>
                ))}
              </div>
              
              {(selectedTool === 'brush' || selectedTool === 'eraser') && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Brush Size</h4>
                  <div className="flex justify-between space-x-2">
                    {brushSizes.map((size) => (
                      <button
                        key={size.id}
                        className={`flex-1 py-1 text-center rounded ${brushSize === size.size ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                        onClick={() => setBrushSize(size.size)}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {symmetryEnabled && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Symmetry Axis</h4>
                  <div className="flex justify-between space-x-2">
                    <button
                      className={`flex-1 p-1 text-center rounded ${symmetryAxis === 'vertical' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                      onClick={() => changeSymmetryAxis('vertical')}
                    >
                      Vertical
                    </button>
                    <button
                      className={`flex-1 p-1 text-center rounded ${symmetryAxis === 'horizontal' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                      onClick={() => changeSymmetryAxis('horizontal')}
                    >
                      Horizontal
                    </button>
                    <button
                      className={`flex-1 p-1 text-center rounded ${symmetryAxis === 'both' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                      onClick={() => changeSymmetryAxis('both')}
                    >
                      Both
                    </button>
                  </div>
                </div>
              )}
              
              {/* Color Palette Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold">Color Palette</h4>
                  <button
                    className="text-xs p-1 bg-gray-700 rounded hover:bg-gray-600"
                    title="Color Picker"
                  >
                    <Palette size={16} />
                  </button>
                </div>
                
                <div className="mb-3">
                  <label className="block text-xs text-gray-400 mb-1">Current Color</label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded border border-gray-600" 
                      style={{ backgroundColor: currentColor }}
                    ></div>
                    <input
                      type="color"
                      value={currentColor}
                      onChange={(e) => setCurrentColor(e.target.value)}
                      className="w-full bg-gray-700 rounded p-1 h-8 cursor-pointer"
                    />
                  </div>
                </div>
                
                {/* Professional Color Palettes */}
                <div className="space-y-3">
                  {Object.entries(professionalPalettes).map(([key, palette]) => (
                    <div key={key}>
                      <label className="block text-xs text-gray-400 mb-1">{palette.name}</label>
                      <div className="grid grid-cols-8 gap-1">
                        {palette.colors.map((color, index) => (
                          <button
                            key={index}
                            className="w-6 h-6 rounded border border-gray-600 hover:border-white"
                            style={{ backgroundColor: color }}
                            onClick={() => setCurrentColor(color)}
                          ></button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Zoom Controls */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Zoom</h4>
                <div className="flex items-center justify-between">
                  <button 
                    className="p-1 bg-gray-700 rounded hover:bg-gray-600" 
                    onClick={() => setZoom(Math.max(25, zoom - 25))}
                    disabled={zoom <= 25}
                  >
                    <ZoomOut size={16} />
                  </button>
                  <span className="text-sm">{zoom}%</span>
                  <button 
                    className="p-1 bg-gray-700 rounded hover:bg-gray-600" 
                    onClick={() => setZoom(Math.min(400, zoom + 25))}
                    disabled={zoom >= 400}
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>
              </div>
              
              {/* Pixel Size Controls */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Pixel Size</h4>
                <div className="flex items-center justify-between">
                  <button 
                    className="p-1 bg-gray-700 rounded hover:bg-gray-600" 
                    onClick={() => setPixelSize(Math.max(1, pixelSize - 1))}
                    disabled={pixelSize <= 1}
                  >
                    <ZoomOut size={16} />
                  </button>
                  <span className="text-sm">{pixelSize}px</span>
                  <button 
                    className="p-1 bg-gray-700 rounded hover:bg-gray-600" 
                    onClick={() => setPixelSize(Math.min(16, pixelSize + 1))}
                    disabled={pixelSize >= 16}
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {showUIPanel === 'layers' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">Layers</h3>
                <button 
                  className="p-1 bg-blue-600 rounded hover:bg-blue-700"
                  onClick={addLayer}
                  title="Add Layer"
                >
                  <FilePlus size={16} />
                </button>
              </div>
              
              <div className="space-y-2 mb-4">
                {layers.map((layer) => (
                  <div 
                    key={layer.id}
                    className={`bg-gray-700 p-2 rounded flex items-center ${activeLayer === layer.id ? 'border border-blue-500' : ''}`}
                    onClick={() => setActiveLayer(layer.id)}
                  >
                    <button 
                      className="mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLayerVisibility(layer.id);
                      }}
                    >
                      <Eye size={16} className={!layer.visible ? 'opacity-30' : ''} />
                    </button>
                    
                    <span className="flex-1 text-sm truncate">{layer.name}</span>
                    
                    <button 
                      className="ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLayerLock(layer.id);
                      }}
                    >
                      {layer.locked ? <Lock size={16} /> : <Unlock size={16} className="opacity-30" />}
                    </button>
                    
                    <button 
                      className="ml-1 text-red-400 hover:text-red-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLayer(layer.id);
                      }}
                      disabled={layers.length <= 1}
                    >
                      <Trash2 size={16} className={layers.length <= 1 ? 'opacity-30' : ''} />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Character Sections */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Character Sections</h4>
                <div className="grid grid-cols-2 gap-2">
                  {characterSections.map((section) => (
                    <button
                      key={section.id}
                      className={`p-2 flex items-center rounded text-left ${activeSection === section.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                      onClick={() => setActiveSection(section.id)}
                      style={{ borderLeft: `3px solid ${section.color}` }}
                    >
                      <span className="mr-1">{section.icon}</span>
                      <span className="text-xs">{section.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Character Type</h4>
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 p-2 rounded flex items-center justify-center ${characterGender === 'male' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => setCharacterGender('male')}
                  >
                    <User size={16} className="mr-1" />
                    <span className="text-xs">Male</span>
                  </button>
                  <button
                    className={`flex-1 p-2 rounded flex items-center justify-center ${characterGender === 'female' ? 'bg-pink-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => setCharacterGender('female')}
                  >
                    <UserCheck size={16} className="mr-1" />
                    <span className="text-xs">Female</span>
                  </button>
                  <button
                    className="p-2 rounded bg-purple-700 hover:bg-purple-600"
                    onClick={() => setShowTemplates(true)}
                  >
                    <Folder size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {showUIPanel === 'animation' && (
            <div>
              <h3 className="text-lg font-bold mb-3">Animation</h3>
              
              <div className="bg-gray-700 p-3 rounded mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold">Animation Settings</h4>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Speed:</span>
                  <div className="flex items-center">
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      defaultValue="5"
                      className="w-24"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Frames:</span>
                  <span className="text-xs">{frames.length}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <button
                  className={`w-full p-2 rounded bg-green-600 hover:bg-green-700 flex items-center justify-center ${showAnimationTimeline ? 'mb-3' : ''}`}
                  onClick={() => setShowAnimationTimeline(!showAnimationTimeline)}
                >
                  <span className="mr-1">{showAnimationTimeline ? 'Hide' : 'Show'} Timeline</span>
                  {showAnimationTimeline ? <Eye size={16} /> : <Play size={16} />}
                </button>
              </div>
              
              <div className="bg-gray-700 p-3 rounded">
                <h4 className="text-sm font-semibold mb-2">Animation Tips</h4>
                <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                  <li>Add frames for character animations</li>
                  <li>Use onion skinning for smoother animations</li>
                  <li>Animations can increase rarity level</li>
                  <li>Export as sprite sheet or animated GIF</li>
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {/* Main Content Area - Canvas */}
        <div className="flex-1 relative flex flex-col bg-gray-900 overflow-hidden">
          {showAnimationTimeline && (
            <div className="px-4 py-2">
              <AnimationTimeline />
            </div>
          )}
          
          <div className="flex-1 flex items-center justify-center overflow-auto p-4">
            <div 
              style={{ 
                transform: `scale(${zoom/100})`, 
                transformOrigin: 'center',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)'
              }}
              className="bg-gray-300 relative"
            >
              <canvas 
                ref={canvasRef} 
                width={canvasSize.width} 
                height={canvasSize.height}
                className="bg-transparent cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="bg-gray-800 border-t border-gray-700 px-4 py-1 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <div>
                Canvas: {canvasSize.width}×{canvasSize.height}px
              </div>
              <div>
                Zoom: {zoom}%
              </div>
              <div>
                Tool: {advancedTools.find(t => t.id === selectedTool)?.name || selectedTool}
              </div>
              <div>
                Section: {characterSections.find(s => s.id === activeSection)?.name}
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded mr-1" style={{ backgroundColor: currentColor }}></div>
                <span>{currentColor.toUpperCase()}</span>
              </div>
            </div>
            <div>
              Rarity Level: <span className="font-semibold">{rarityLevel.charAt(0).toUpperCase() + rarityLevel.slice(1)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals and Overlays */}
      {showTutorial && <TutorialOverlay />}
      {showTemplates && <TemplatesPanel />}
      {mintPreview && <MintPreviewPanel />}
    </div>
  );
};

export default PixelForgeCreator;