import React, { useEffect, useRef, useState } from 'react';

const PixelPlatformer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [gems, setGems] = useState(0);
  const [lives, setLives] = useState(3);
  
  // Game state managed with refs to avoid re-renders during gameplay
  const gameStateRef = useRef({
    player: {
      x: 50,
      y: 200,
      width: 32,
      height: 32,
      velocityX: 0,
      velocityY: 0,
      jumping: false,
      facingRight: true,
      frame: 0,
      frameCount: 0,
      invulnerable: false
    },
    platforms: [
      { x: 0, y: 280, width: 200, height: 40 },
      { x: 250, y: 280, width: 230, height: 40 },
      { x: 150, y: 200, width: 100, height: 20 },
      { x: 300, y: 150, width: 80, height: 20 },
      { x: 100, y: 120, width: 80, height: 20 },
      { x: 0, y: 80, width: 50, height: 20 },
      { x: 400, y: 80, width: 80, height: 20 },
    ],
    gems: [
      { x: 50, y: 50, width: 20, height: 20, collected: false },
      { x: 150, y: 170, width: 20, height: 20, collected: false },
      { x: 300, y: 120, width: 20, height: 20, collected: false },
      { x: 400, y: 50, width: 20, height: 20, collected: false },
      { x: 320, y: 250, width: 20, height: 20, collected: false }
    ],
    keys: {
      left: false,
      right: false,
      up: false
    },
    animationFrame: null as number | null
  });

  // Constants
  const GRAVITY = 0.5;
  const JUMP_FORCE = -12;
  const MOVEMENT_SPEED = 5;
  const FRICTION = 0.8;
  const CANVAS_WIDTH = 480;
  const CANVAS_HEIGHT = 320;

  // Color palette
  const colors = {
    sky: '#0f2027',
    platform: '#4a4e69',
    player: '#9d4edd',
    gem: '#00f5d4'
  };

  const startGame = () => {
    // Reset game state
    const gameState = gameStateRef.current;
    
    gameState.player = {
      x: 50,
      y: 200,
      width: 32,
      height: 32,
      velocityX: 0,
      velocityY: 0,
      jumping: false,
      facingRight: true,
      frame: 0,
      frameCount: 0,
      invulnerable: false
    };
    
    gameState.gems.forEach(gem => gem.collected = false);
    
    setGems(0);
    setLives(3);
    setGameRunning(true);
    
    // Start game loop
    gameLoop();
  };

  const endGame = (win = false) => {
    if (gameStateRef.current.animationFrame) {
      cancelAnimationFrame(gameStateRef.current.animationFrame);
    }
    setGameRunning(false);
    alert(win ? 'You collected all gems! You win!' : 'Game Over!');
  };

  const gameLoop = () => {
    update();
    render();
    gameStateRef.current.animationFrame = requestAnimationFrame(gameLoop);
  };

  const update = () => {
    const { player, platforms, gems, keys } = gameStateRef.current;
    
    // Player movement
    if (keys.left) {
      player.velocityX = -MOVEMENT_SPEED;
      player.facingRight = false;
    }
    if (keys.right) {
      player.velocityX = MOVEMENT_SPEED;
      player.facingRight = true;
    }
    
    // Apply friction
    if (!keys.left && !keys.right) {
      player.velocityX *= FRICTION;
    }
    
    // Jump if on ground
    if (keys.up && !player.jumping) {
      player.velocityY = JUMP_FORCE;
      player.jumping = true;
    }
    
    // Apply gravity
    player.velocityY += GRAVITY;
    
    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;
    
    // Animation frame
    player.frameCount++;
    if (player.frameCount > 5) {
      player.frame = (player.frame + 1) % 4;
      player.frameCount = 0;
    }
    
    // Check for platform collisions
    let onGround = false;
    platforms.forEach(platform => {
      if (collideWithPlatform(player, platform)) {
        onGround = true;
      }
    });
    
    if (onGround) {
      player.jumping = false;
    }
    
    // Check for gem collection
    let gemCount = 0;
    gems.forEach(gem => {
      if (!gem.collected && collideWithGem(player, gem)) {
        gem.collected = true;
        gemCount = gems.filter(g => g.collected).length;
        setGems(gemCount);
        
        // Win condition
        if (gemCount === gems.length) {
          setTimeout(() => endGame(true), 100);
        }
      }
    });
    
    // Check for falling off screen
    if (player.y > CANVAS_HEIGHT) {
      const newLives = lives - 1;
      setLives(newLives);
      
      if (newLives <= 0) {
        setTimeout(() => endGame(false), 100);
      } else {
        player.x = 50;
        player.y = 200;
        player.velocityY = 0;
      }
    }
    
    // Keep player on screen
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > CANVAS_WIDTH) {
      player.x = CANVAS_WIDTH - player.width;
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { player, platforms, gems } = gameStateRef.current;
    
    // Clear canvas
    ctx.fillStyle = colors.sky;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw platforms
    ctx.fillStyle = colors.platform;
    platforms.forEach(platform => {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
    
    // Draw gems
    ctx.fillStyle = colors.gem;
    gems.forEach(gem => {
      if (!gem.collected) {
        // Draw gem with simple animation
        const gemHeight = gem.height + Math.sin(Date.now() / 200) * 2;
        ctx.fillRect(gem.x, gem.y - (gemHeight - gem.height) / 2, gem.width, gemHeight);
      }
    });
    
    // Draw player
    ctx.fillStyle = player.invulnerable && Math.floor(Date.now() / 100) % 2 === 0 ? 
      'rgba(157, 78, 221, 0.5)' : colors.player;
    
    // Draw player with simple animation
    const frameOffset = player.frame * 2;
    ctx.fillRect(
      player.x, 
      player.y + frameOffset, 
      player.width, 
      player.height - frameOffset
    );
    
    // Draw player eyes
    ctx.fillStyle = 'white';
    const eyeOffset = player.facingRight ? 18 : 8;
    ctx.fillRect(player.x + eyeOffset, player.y + 8, 6, 6);
  };

  const collideWithPlatform = (player: { x: number, y: number, width: number, height: number, velocityX: number, velocityY: number }, platform: { x: number, y: number, width: number, height: number }) => {
    // Check if player is falling
    if (player.velocityY > 0) {
      // Check if player's bottom is at or slightly below platform top
      // And player's top is above platform top
      if (player.y + player.height >= platform.y &&
          player.y < platform.y &&
          player.x + player.width > platform.x &&
          player.x < platform.x + platform.width) {
          
        // Place player on top of platform
        player.y = platform.y - player.height;
        player.velocityY = 0;
        return true;
      }
    }
    
    // Check horizontal collision
    if (player.x + player.width > platform.x &&
        player.x < platform.x + platform.width &&
        player.y + player.height > platform.y &&
        player.y < platform.y + platform.height) {
        
      // Check if coming from left or right
      if (player.velocityX > 0 && player.x < platform.x) {
        player.x = platform.x - player.width;
        player.velocityX = 0;
      } else if (player.velocityX < 0 && player.x + player.width > platform.x + platform.width) {
        player.x = platform.x + platform.width;
        player.velocityX = 0;
      }
      
      // Check if hitting from below
      if (player.velocityY < 0 && player.y + player.height > platform.y + platform.height) {
        player.y = platform.y + platform.height;
        player.velocityY = 0;
      }
    }
    
    return false;
  };

  const collideWithGem = (player: { x: number, y: number, width: number, height: number }, gem: { x: number, y: number, width: number, height: number }) => {
    return player.x < gem.x + gem.width &&
           player.x + player.width > gem.x &&
           player.y < gem.y + gem.height &&
           player.y + player.height > gem.y;
  };

  // Set up event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { keys } = gameStateRef.current;
      if (e.key === 'ArrowLeft') keys.left = true;
      if (e.key === 'ArrowRight') keys.right = true;
      if (e.key === 'ArrowUp') keys.up = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const { keys } = gameStateRef.current;
      if (e.key === 'ArrowLeft') keys.left = false;
      if (e.key === 'ArrowRight') keys.right = false;
      if (e.key === 'ArrowUp') keys.up = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameStateRef.current.animationFrame) {
        cancelAnimationFrame(gameStateRef.current.animationFrame);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 min-h-full">
      <div className="relative w-480 h-320 border-2 border-purple-500 shadow-lg shadow-purple-500/30">
        <canvas 
          ref={canvasRef} 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT} 
          className="bg-gray-900"
        />
        
        {!gameRunning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">PIXEL PLATFORMER</h2>
            <button 
              onClick={startGame} 
              className="px-4 py-2 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition duration-200"
            >
              START GAME
            </button>
          </div>
        )}
        
        {gameRunning && (
          <>
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 p-1 rounded text-xs">
              <div>GEMS: <span className="font-bold text-cyan-400">{gems}</span></div>
              <div>LIVES: <span className="font-bold text-cyan-400">{lives}</span></div>
            </div>
            
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 p-1 rounded text-xs">
              Controls: ← → to move, ↑ to jump
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PixelPlatformer;