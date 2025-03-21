"use client";

import React, { useState, useRef, useEffect } from "react";

interface FrameData {
  id: number;
  imageData: ImageData | null;
}

interface AssetItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  owner: string;
  price?: number;
}

const PixelArtStudio: React.FC = () => {
  // Canvas and drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentColor, setCurrentColor] = useState<string>("#000000");
  const [currentTool, setCurrentTool] = useState<string>("pencil");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  const [brushSize, setBrushSize] = useState<number>(1);
  const [canvasSize, setCanvasSize] = useState<number>(32);
  
  // Animation frames
  const [frames, setFrames] = useState<FrameData[]>([{ id: 1, imageData: null }]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(12);
  
  // Project state
  const [projectName, setProjectName] = useState<string>("Untitled Project");
  const [activeTab, setActiveTab] = useState<string>("assets");
  
  // NFT and community
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [showMintModal, setShowMintModal] = useState<boolean>(false);
  const [showProjectModal, setShowProjectModal] = useState<boolean>(false);
  const [showAnimationModal, setShowAnimationModal] = useState<boolean>(false);
  const [communityArtworks, setCommunityArtworks] = useState<any[]>([]);
  
  // Assets library
  const [assetLibrary, setAssetLibrary] = useState<AssetItem[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null);
  const [assetFilter, setAssetFilter] = useState<string>("all");
  const [aiSuggestions, setAiSuggestions] = useState<AssetItem[]>([]);
  const [suggestedPalette, setSuggestedPalette] = useState<string[]>([]);

  // Effects
  const [selectedEffect, setSelectedEffect] = useState<string>("");

  // Initialize canvas and load sample data
  useEffect(() => {
    initializeCanvas();
    loadSampleAssets();
    loadSampleCommunityArtworks();
  }, [canvasSize]);

  // Animation player
  useEffect(() => {
    let animationTimer: NodeJS.Timeout;
    
    if (isPlaying) {
      animationTimer = setInterval(() => {
        setCurrentFrameIndex((prev) => {
          const nextIndex = (prev + 1) % frames.length;
          displayFrame(nextIndex);
          return nextIndex;
        });
      }, 1000 / fps);
    }
    
    return () => {
      if (animationTimer) clearInterval(animationTimer);
    };
  }, [isPlaying, frames, fps]);

  // Initialize canvas
  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Store initial state for undo
        storeCanvasState();
      }
    }
  };

  // Store canvas state for undo/redo
  const storeCanvasState = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setUndoStack((prevStack) => [...prevStack, currentState]);
      setRedoStack([]);
      
      // Update current frame data
      updateCurrentFrameData(currentState);
    }
  };

  // Update current frame data
  const updateCurrentFrameData = (imageData: ImageData) => {
    setFrames(prevFrames => 
      prevFrames.map((frame, index) => 
        index === currentFrameIndex 
          ? { ...frame, imageData: imageData.slice(0) as ImageData } 
          : frame
      )
    );
  };

  // Display frame at index
  const displayFrame = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas && frames[index]?.imageData) {
      ctx.putImageData(frames[index].imageData, 0, 0);
    }
  };

  // Handle drawing on the canvas
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (rect.width / canvas.width));
    const y = Math.floor((e.clientY - rect.top) / (rect.height / canvas.height));

    if (currentTool === "pencil") {
      ctx.fillStyle = currentColor;
      // Draw pixels based on brush size
      for (let i = 0; i < brushSize; i++) {
        for (let j = 0; j < brushSize; j++) {
          const xPos = x - Math.floor(brushSize / 2) + i;
          const yPos = y - Math.floor(brushSize / 2) + j;
          if (xPos >= 0 && xPos < canvas.width && yPos >= 0 && yPos < canvas.height) {
            ctx.fillRect(xPos, yPos, 1, 1);
          }
        }
      }
    } else if (currentTool === "eraser") {
      ctx.fillStyle = "#ffffff";
      // Erase pixels based on brush size
      for (let i = 0; i < brushSize; i++) {
        for (let j = 0; j < brushSize; j++) {
          const xPos = x - Math.floor(brushSize / 2) + i;
          const yPos = y - Math.floor(brushSize / 2) + j;
          if (xPos >= 0 && xPos < canvas.width && yPos >= 0 && yPos < canvas.height) {
            ctx.fillRect(xPos, yPos, 1, 1);
          }
        }
      }
    } else if (currentTool === "eyedropper") {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hexColor = rgbToHex(pixel[0], pixel[1], pixel[2]);
      setCurrentColor(hexColor);
    } else if (currentTool === "fill") {
      floodFill(x, y, currentColor);
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      storeCanvasState();
      generateAiSuggestions();
    }
    setIsDrawing(false);
  };

  // Flood fill implementation
  const floodFill = (x: number, y: number, fillColor: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    // Get target color
    const targetColor = {
      r: data[(y * width + x) * 4],
      g: data[(y * width + x) * 4 + 1],
      b: data[(y * width + x) * 4 + 2],
      a: data[(y * width + x) * 4 + 3]
    };

    // Parse fill color
    const fillRGB = hexToRgb(fillColor);
    if (!fillRGB) return;

    // If target color is the same as fill color, return
    if (
      targetColor.r === fillRGB.r &&
      targetColor.g === fillRGB.g &&
      targetColor.b === fillRGB.b
    ) {
      return;
    }

    // Stack for flood fill
    const stack: [number, number][] = [[x, y]];
    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const pos = (y * width + x) * 4;

      // Check if this pixel matches target color
      if (
        data[pos] === targetColor.r &&
        data[pos + 1] === targetColor.g &&
        data[pos + 2] === targetColor.b &&
        data[pos + 3] === targetColor.a
      ) {
        // Set pixel to fill color
        data[pos] = fillRGB.r;
        data[pos + 1] = fillRGB.g;
        data[pos + 2] = fillRGB.b;
        data[pos + 3] = 255;

        // Add adjacent pixels to stack
        if (x > 0) stack.push([x - 1, y]);
        if (x < width - 1) stack.push([x + 1, y]);
        if (y > 0) stack.push([x, y - 1]);
        if (y < height - 1) stack.push([x, y + 1]);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // Hex to RGB conversion
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  };

  // RGB to Hex conversion
  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // Undo functionality
  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (undoStack.length > 1 && ctx && canvas) {
      const currentState = undoStack.pop();
      if (currentState) {
        setRedoStack([...redoStack, currentState]);
        const previousState = undoStack[undoStack.length - 1];
        ctx.putImageData(previousState, 0, 0);
        
        // Update current frame
        updateCurrentFrameData(previousState);
      }
    }
  };

  // Redo functionality
  const redo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (redoStack.length > 0 && ctx && canvas) {
      const state = redoStack.pop()!;
      setUndoStack([...undoStack, state]);
      ctx.putImageData(state, 0, 0);
      
      // Update current frame
      updateCurrentFrameData(state);
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx && canvas) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        storeCanvasState();
      }
    }
  };

  // Save canvas as PNG
  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // Export as animated GIF
  const exportGif = () => {
    alert("Exporting as GIF... This would connect to a GIF generation library in production.");
    setShowAnimationModal(false);
  };

  // Export as sprite sheet
  const exportSpriteSheet = () => {
    const canvas = canvasRef.current;
    if (canvas && frames.length > 0) {
      const spriteSheetCanvas = document.createElement("canvas");
      const ctx = spriteSheetCanvas.getContext("2d");
      
      if (ctx) {
        spriteSheetCanvas.width = canvas.width * frames.length;
        spriteSheetCanvas.height = canvas.height;
        
        frames.forEach((frame, index) => {
          if (frame.imageData) {
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext("2d");
            
            if (tempCtx) {
              tempCtx.putImageData(frame.imageData, 0, 0);
              ctx.drawImage(tempCanvas, index * canvas.width, 0);
            }
          }
        });
        
        const link = document.createElement("a");
        link.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}-spritesheet.png`;
        link.href = spriteSheetCanvas.toDataURL();
        link.click();
      }
    }
  };

  // Load image onto canvas
  const loadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext("2d");
          if (ctx && canvas) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            storeCanvasState();
            generateAiSuggestions();
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Connect wallet
  const connectWallet = () => {
    setWalletConnected(true);
    alert("Wallet connected successfully! (This is a mock implementation)");
  };

  // Mint NFT
  const mintNFT = () => {
    alert("NFT Minted Successfully! (This is a mock implementation)");
    setShowMintModal(false);
  };

  // Save project
  const saveProject = () => {
    const projectData = {
      name: projectName,
      frames: frames,
      canvasSize: canvasSize,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`pixel-project-${Date.now()}`, JSON.stringify(projectData));
    alert("Project saved successfully!");
    setShowProjectModal(false);
  };

  // Load project
  const loadProject = (projectKey: string) => {
    const projectData = localStorage.getItem(projectKey);
    if (projectData) {
      try {
        const parsedData = JSON.parse(projectData);
        setProjectName(parsedData.name);
        setCanvasSize(parsedData.canvasSize);
        
        // Recreate frames with ImageData objects
        const loadedFrames: FrameData[] = [];
        parsedData.frames.forEach((frame: any) => {
          if (frame.imageData) {
            const canvas = document.createElement("canvas");
            canvas.width = canvasSize;
            canvas.height = canvasSize;
            const ctx = canvas.getContext("2d");
            
            if (ctx) {
              // Convert stored data back to ImageData
              const imageData = new ImageData(
                new Uint8ClampedArray(Object.values(frame.imageData.data)),
                frame.imageData.width,
                frame.imageData.height
              );
              loadedFrames.push({ id: frame.id, imageData });
            }
          }
        });
        
        setFrames(loadedFrames);
        setCurrentFrameIndex(0);
        displayFrame(0);
        
        alert("Project loaded successfully!");
      } catch (error) {
        console.error("Error loading project:", error);
        alert("Failed to load project. The data might be corrupted.");
      }
    }
  };

  // Animation frame management
  const addFrame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    
    if (ctx && canvas) {
      // Save current frame
      updateCurrentFrameData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      
      // Create new frame
      const newFrameId = frames.length + 1;
      setFrames([...frames, { id: newFrameId, imageData: null }]);
      
      // Switch to new frame
      setCurrentFrameIndex(frames.length);
      
      // Clear canvas for new frame
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const deleteFrame = (index: number) => {
    if (frames.length <= 1) {
      alert("You can't delete the only frame.");
      return;
    }
    
    const newFrames = frames.filter((_, i) => i !== index);
    setFrames(newFrames);
    
    // Adjust current frame index if needed
    if (currentFrameIndex >= newFrames.length) {
      setCurrentFrameIndex(newFrames.length - 1);
      displayFrame(newFrames.length - 1);
    } else if (currentFrameIndex === index) {
      displayFrame(currentFrameIndex);
    }
  };

  const duplicateFrame = (index: number) => {
    const frameToDuplicate = frames[index];
    if (frameToDuplicate && frameToDuplicate.imageData) {
      const newFrame = {
        id: frames.length + 1,
        imageData: frameToDuplicate.imageData.slice(0) as ImageData
      };
      
      const newFrames = [...frames];
      newFrames.splice(index + 1, 0, newFrame);
      setFrames(newFrames);
    }
  };

  const selectFrame = (index: number) => {
    if (index !== currentFrameIndex) {
      // Save current frame
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx && canvas) {
        updateCurrentFrameData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      }
      
      // Switch to selected frame
      setCurrentFrameIndex(index);
      displayFrame(index);
    }
  };

  // Generate AI suggestions
  const generateAiSuggestions = () => {
    // This would connect to an AI service in production
    // For demo purposes, we'll use mock data
    
    // Mock asset suggestions based on current color
    const colorHex = currentColor.substring(1).toLowerCase();
    const mockAssets = assetLibrary.filter(asset => 
      asset.category === getCategoryFromColor(colorHex) || 
      Math.random() > 0.7 // Add some randomness
    );
    
    setAiSuggestions(mockAssets.slice(0, 4));
    
    // Generate color palette suggestions
    const baseColor = hexToRgb(currentColor);
    if (baseColor) {
      const palette = [
        currentColor,
        rgbToHex(Math.max(0, baseColor.r - 50), Math.max(0, baseColor.g - 50), Math.max(0, baseColor.b - 50)),
        rgbToHex(Math.min(255, baseColor.r + 50), Math.min(255, baseColor.g + 50), Math.min(255, baseColor.b + 50)),
        rgbToHex(baseColor.r, Math.min(255, baseColor.g + 50), baseColor.b),
        rgbToHex(baseColor.r, baseColor.g, Math.min(255, baseColor.b + 50))
      ];
      setSuggestedPalette(palette);
    }
  };

  // Helper function to mock categorization
  const getCategoryFromColor = (colorHex: string): string => {
    const r = parseInt(colorHex.substr(0, 2), 16);
    const g = parseInt(colorHex.substr(2, 2), 16);
    const b = parseInt(colorHex.substr(4, 2), 16);
    
    if (r > g && r > b) return "Fantasy";
    if (g > r && g > b) return "Cyberpunk";
    if (b > r && b > g) return "Sci-Fi";
    if (r > 200 && g > 200 && b < 100) return "Medieval";
    return "Fantasy";
  };

  // Apply pixel effects
  const applyEffect = (effect: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    switch (effect) {
      case "dithering":
        // Simple ordered dithering
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4;
            
            // Apply threshold matrix
            const threshold = (x % 2) ^ (y % 2) ? 128 : 64;
            
            data[i] = data[i] > threshold ? 255 : 0;      // R
            data[i + 1] = data[i + 1] > threshold ? 255 : 0;  // G
            data[i + 2] = data[i + 2] > threshold ? 255 : 0;  // B
          }
        }
        break;
        
      case "outline":
        // Simple outline detection
        const original = new Uint8ClampedArray(data);
        for (let y = 1; y < canvas.height - 1; y++) {
          for (let x = 1; x < canvas.width - 1; x++) {
            const i = (y * canvas.width + x) * 4;
            const left = ((y) * canvas.width + (x - 1)) * 4;
            const right = ((y) * canvas.width + (x + 1)) * 4;
            const top = ((y - 1) * canvas.width + (x)) * 4;
            const bottom = ((y + 1) * canvas.width + (x)) * 4;
            
            // Check if pixel is different from neighbors
            if (
              original[i] !== original[left] ||
              original[i] !== original[right] ||
              original[i] !== original[top] ||
              original[i] !== original[bottom]
            ) {
              data[i] = data[i + 1] = data[i + 2] = 0; // Black outline
            }
          }
        }
        break;
        
      case "pixelate":
        // Already pixelated, but can enhance the effect
        const pixelSize = 2;
        for (let y = 0; y < canvas.height; y += pixelSize) {
          for (let x = 0; x < canvas.width; x += pixelSize) {
            const i = (y * canvas.width + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Fill the pixel block with the same color
            for (let py = 0; py < pixelSize && y + py < canvas.height; py++) {
              for (let px = 0; px < pixelSize && x + px < canvas.width; px++) {
                const idx = ((y + py) * canvas.width + (x + px)) * 4;
                data[idx] = r;
                data[idx + 1] = g;
                data[idx + 2] = b;
              }
            }
          }
        }
        break;
        
      case "shadow":
        // Add a simple drop shadow
        for (let y = canvas.height - 1; y >= 0; y--) {
          for (let x = canvas.width - 1; x >= 0; x--) {
            const i = (y * canvas.width + x) * 4;
            
            // If pixel is not transparent (alpha > 0)
            if (data[i + 3] > 0 && x < canvas.width - 1 && y < canvas.height - 1) {
              // Add shadow to the pixel below-right
              const shadowIdx = ((y + 1) * canvas.width + (x + 1)) * 4;
              
              // Only add shadow if the target pixel is transparent
              if (data[shadowIdx + 3] === 0) {
                data[shadowIdx] = 0;
                data[shadowIdx + 1] = 0;
                data[shadowIdx + 2] = 0;
                data[shadowIdx + 3] = 128; // Semi-transparent shadow
              }
            }
          }
        }
        break;
    }
    
    ctx.putImageData(imageData, 0, 0);
    storeCanvasState();
  };

  // Load sample assets
  const loadSampleAssets = () => {
    // Mock data for asset library
    const mockAssets: AssetItem[] = [
      {
        id: "asset1",
        name: "Golden Sword",
        category: "Medieval",
        imageUrl: "/assets/sword.png",
        owner: "0x123...abc",
        price: 0.05
      },
      {
        id: "asset2",
        name: "Shield",
        category: "Medieval",
        imageUrl: "/assets/shield.png",
        owner: "0x456...def",
        price: 0.03
      },
      {
        id: "asset3",
        name: "Cyberpunk Helmet",
        category: "Cyberpunk",
        imageUrl: "/assets/helmet.png",
        owner: "0x789...ghi",
        price: 0.08
      },
      {
        id: "asset4",
        name: "Magic Staff",
        category: "Fantasy",
        imageUrl: "/assets/staff.png",
        owner: "0xabc...123",
        price: 0.06
      },
      {
        id: "asset5",
        name: "Sci-Fi Pistol",
        category: "Sci-Fi",
        imageUrl: "/assets/pistol.png",
        owner: "0xdef...456",
        price: 0.04
      },
      {
        id: "asset6",
        name: "Dragon",
        category: "Fantasy",
        imageUrl: "/assets/dragon.png",
        owner: "0xghi...789",
        price: 0.1
      }
    ];
    
    setAssetLibrary(mockAssets);
  };

  // Load sample community artworks
  const loadSampleCommunityArtworks = () => {
    // Mock data for community gallery
    const mockArtworks = [
      {
        id: "art1",
        title: "Pixel Knight",
        creator: "PixelMaster",
        imageUrl: "/community/knight.png",
        likes: 152
      },
      {
        id: "art2",
        title: "Space Explorer",
        creator: "StarGazer",
        imageUrl: "/community/space.png",
        likes: 98
      },
      {
        id: "art3",
        title: "Forest Scene",
        creator: "NatureLover",
        imageUrl: "/community/forest.png",
        likes: 203
      }
    ];
    
    setCommunityArtworks(mockArtworks);
  };

  // Place asset on canvas
  const placeAssetOnCanvas = (asset: AssetItem) => {
    if (!canvasRef.current) return;
    
    // In a real implementation, this would load the asset image
    alert(`Asset "${asset.name}" would be placed on canvas in a real implementation.`);
    
    // Mock implementation
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Draw a placeholder for the asset
      const x = Math.floor(canvas.width / 2);
      const y = Math.floor(canvas.height / 2);
      const size = 8;
      
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(x - size/2, y - size/2, size, size);
      
      // Add a border
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1;
      ctx.strokeRect(x - size/2, y - size/2, size, size);
      
      storeCanvasState();
    }
    
    setSelectedAsset(null);
  };

  // Color palette presets
  const colorPalettes = {
    default: [
      "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
      "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
      "#FFC0CB", "#32CD32", "#4169E1", "#FFFFE0", "#FF69B4",
      "#00FFFF", "#8B4513", "#9400D3", "#A9A9A9", "#D3D3D3"
    ],
    retro: [
      "#2E2E2E", "#FFF38A", "#FD8460", "#FF4273", "#9752E8",
      "#5DA9E9", "#14E75B", "#F5F4EB", "#ED7D3A", "#6D63A3",
      "#7AC74F", "#F0F6F0", "#A33327", "#2E294E", "#1A5E63"
    ]
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-