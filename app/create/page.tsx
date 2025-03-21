"use client"; // Mark this component as a client component

import React, { useState, useRef, useEffect } from "react";

const PixelArtStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentColor, setCurrentColor] = useState<string>("#000000");
  const [currentTool, setCurrentTool] = useState<string>("pencil");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  const [canvasSize, setCanvasSize] = useState<number>(32);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [showMintModal, setShowMintModal] = useState<boolean>(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [canvasSize]);

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
      ctx.fillRect(x, y, 1, 1);
    } else if (currentTool === "eraser") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x, y, 1, 1);
    } else if (currentTool === "eyedropper") {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hexColor = rgbToHex(pixel[0], pixel[1], pixel[2]);
      setCurrentColor(hexColor);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Undo and Redo functionality
  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (undoStack.length > 0 && ctx && canvas) {
      const state = undoStack.pop();
      if (state) {
        redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        ctx.putImageData(state, 0, 0);
      }
    }
  };

  const redo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (redoStack.length > 0 && ctx && canvas) {
      const state = redoStack.pop();
      if (state) {
        undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        ctx.putImageData(state, 0, 0);
      }
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
        setUndoStack([]);
        setRedoStack([]);
      }
    }
  };

  // Save canvas as PNG
  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = "pixel-art.png";
      link.href = canvas.toDataURL();
      link.click();
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
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // Connect wallet
  const connectWallet = () => {
    setWalletConnected(true);
  };

  // Mint NFT
  const mintNFT = () => {
    alert("NFT Minted Successfully!");
    setShowMintModal(false);
  };

  return (
    <div className="container">
      <header>
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Logo SVG */}
          </svg>
          NFT Pixel Art Studio
        </div>
        <div className="header-actions">
          <button id="connect-wallet-btn" className="action-btn" onClick={connectWallet}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Wallet SVG */}
            </svg>
            Connect Wallet
          </button>
        </div>
      </header>

      <div className="main-content">
        {/* Tools Panel */}
        <div className="tools-panel">
          <div className="panel-title">Tools</div>
          {/* Tools and color picker */}
        </div>

        {/* Canvas Container */}
        <div className="canvas-container">
          <div className="canvas-info">
            <div className="canvas-coords">{canvasSize}×{canvasSize}</div>
          </div>
          <canvas
            ref={canvasRef}
            id="pixelCanvas"
            width={512}
            height={512}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
          />
          <div className="canvas-actions">
            <button id="save-btn" className="action-btn" onClick={saveCanvas}>
              Save as PNG
            </button>
            <button id="load-btn" className="action-btn" onClick={() => document.getElementById("file-input")?.click()}>
              Import Image
            </button>
            <input type="file" id="file-input" accept="image/*" style={{ display: "none" }} onChange={loadImage} />
          </div>
        </div>

        {/* Library Panel */}
        <div className="library-panel">
          <div className="tabs">
            <div className="tab active" data-tab="assets">Assets</div>
            <div className="tab" data-tab="community">Community</div>
          </div>
          {/* Asset grid and community gallery */}
        </div>
      </div>

      {/* Mint Modal */}
      {showMintModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-title">Mint Your Art as NFT</div>
            <button className="modal-close" onClick={() => setShowMintModal(false)}>&times;</button>
            <div className="form-group">
              <label htmlFor="nft-name">NFT Name</label>
              <input type="text" id="nft-name" placeholder="Enter NFT name" />
            </div>
            <div className="form-group">
              <label htmlFor="nft-description">Description</label>
              <textarea id="nft-description" placeholder="Describe your NFT"></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="royalty-percentage">Royalty Percentage</label>
              <input type="text" id="royalty-percentage" placeholder="Enter royalty percentage" />
            </div>
            <button id="confirm-mint-btn" className="primary-btn" onClick={mintNFT}>
              Mint NFT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PixelArtStudio;