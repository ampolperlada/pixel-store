"use client";

import React, { useState } from 'react';

const NFTTechnicalLearnPage = () => {
  const [activeTab, setActiveTab] = useState('fundamentals');

  return (
    <section className="py-16 bg-gradient-to-b from-purple-900 to-indigo-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-8">NFT Technical Guide</h2>
        <p className="text-xl text-center text-gray-300 mb-12 max-w-3xl mx-auto">
          Understand the technical aspects of NFTs, blockchain integration, and pixel art development
        </p>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 border-b border-gray-700">
          <button 
            className={`px-6 py-3 font-medium text-lg transition-colors duration-300 ${activeTab === 'fundamentals' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('fundamentals')}
          >
            Blockchain Fundamentals
          </button>
          <button 
            className={`px-6 py-3 font-medium text-lg transition-colors duration-300 ${activeTab === 'standards' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('standards')}
          >
            NFT Standards
          </button>
          <button 
            className={`px-6 py-3 font-medium text-lg transition-colors duration-300 ${activeTab === 'pixelart' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('pixelart')}
          >
            Pixel Art Technology
          </button>
          <button 
            className={`px-6 py-3 font-medium text-lg transition-colors duration-300 ${activeTab === 'gamedev' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('gamedev')}
          >
            Game Integration
          </button>
          <button 
            className={`px-6 py-3 font-medium text-lg transition-colors duration-300 ${activeTab === 'advanced' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('advanced')}
          >
            Advanced Techniques
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-8">
          {/* Blockchain Fundamentals */}
          {activeTab === 'fundamentals' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Understanding Blockchain Technology</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">What is a Blockchain?</h4>
                  <p className="text-gray-300 mb-4">
                    A blockchain is a distributed digital ledger that records transactions across many computers. 
                    This technology enables NFTs by creating permanent, immutable records of ownership that can't 
                    be altered or deleted.
                  </p>
                  
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Key Concepts</h4>
                  <ul className="space-y-2 text-gray-300 mb-4">
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      <span><strong>Decentralization:</strong> No single entity controls the network</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      <span><strong>Immutability:</strong> Records cannot be altered once confirmed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      <span><strong>Transparency:</strong> All transactions are publicly viewable</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      <span><strong>Smart Contracts:</strong> Self-executing code that runs on the blockchain</span>
                    </li>
                  </ul>
                  
                  <div className="bg-gray-900 bg-opacity-50 p-4 rounded-md text-gray-300">
                    <p className="text-sm italic">
                      "Smart contracts are what make NFTs possible. They enforce the rules of ownership
                      and transfer without requiring a central authority."
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Blockchain Networks for NFTs</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-700 bg-opacity-50 rounded-md">
                      <h5 className="font-semibold text-white mb-2">Ethereum</h5>
                      <p className="text-gray-300 text-sm">
                        The most popular blockchain for NFTs. Uses the ERC-721 and ERC-1155 token standards.
                        High security but can have high gas fees during network congestion.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-700 bg-opacity-50 rounded-md">
                      <h5 className="font-semibold text-white mb-2">Polygon</h5>
                      <p className="text-gray-300 text-sm">
                        Layer 2 scaling solution for Ethereum. Offers lower gas fees and faster transactions
                        while maintaining compatibility with Ethereum.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-700 bg-opacity-50 rounded-md">
                      <h5 className="font-semibold text-white mb-2">Solana</h5>
                      <p className="text-gray-300 text-sm">
                        High-performance blockchain with very low fees and fast transactions.
                        Growing ecosystem for NFTs and gaming applications.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-700 bg-opacity-50 rounded-md">
                      <h5 className="font-semibold text-white mb-2">Tezos</h5>
                      <p className="text-gray-300 text-sm">
                        Energy-efficient blockchain using proof-of-stake. Popular for art NFTs due to
                        lower environmental impact compared to proof-of-work chains.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-5 bg-indigo-900 bg-opacity-50 rounded-lg border border-indigo-700">
                <h4 className="text-xl font-semibold text-white mb-3">Gas Fees Explained</h4>
                <p className="text-gray-300 mb-4">
                  Gas fees are payments made by users to compensate for the computing energy required to process 
                  and validate transactions on the blockchain. When minting or transferring NFTs, you'll need to pay gas fees.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-gray-800 rounded-md">
                    <h5 className="font-semibold text-pink-400 mb-2">Gas Price</h5>
                    <p className="text-gray-300">
                      The amount you're willing to pay per unit of gas, measured in gwei (1 gwei = 0.000000001 ETH).
                      Higher gas prices mean faster transaction processing.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-800 rounded-md">
                    <h5 className="font-semibold text-pink-400 mb-2">Gas Limit</h5>
                    <p className="text-gray-300">
                      The maximum amount of gas units you're willing to use for a transaction.
                      Complex operations like minting an NFT require more gas than simple transfers.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-800 rounded-md">
                    <h5 className="font-semibold text-pink-400 mb-2">Total Fee</h5>
                    <p className="text-gray-300">
                      Gas Price × Gas Used = Total Fee
                      Our platform helps optimize gas usage to minimize costs without sacrificing transaction speed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* NFT Standards */}
          {activeTab === 'standards' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">NFT Standards & Protocols</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-cyan-400 mb-4">ERC-721: The Original NFT Standard</h4>
                  
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-md mb-6">
                    <pre className="text-xs text-gray-300 overflow-auto">
{`// Simplified ERC-721 Interface
interface IERC721 {
    // Core functions
    function balanceOf(address owner) external view returns (uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function approve(address to, uint256 tokenId) external;
    function getApproved(uint256 tokenId) external view returns (address);
    function setApprovalForAll(address operator, bool approved) external;
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
}`}
                    </pre>
                  </div>
                  
                  <p className="text-gray-300 mb-4">
                    ERC-721 introduced the concept of non-fungible tokens to Ethereum. Each token has unique 
                    properties and is indivisible, making it perfect for representing digital collectibles.
                  </p>
                  
                  <h5 className="text-lg font-semibold text-white mb-2">Key ERC-721 Functions</h5>
                  <ul className="space-y-2 text-gray-300 mb-6">
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      <span><code className="bg-gray-800 px-1 py-0.5 rounded text-xs">ownerOf(tokenId)</code>: Returns the owner of a specific token</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      <span><code className="bg-gray-800 px-1 py-0.5 rounded text-xs">transferFrom(from, to, tokenId)</code>: Transfers token ownership</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      <span><code className="bg-gray-800 px-1 py-0.5 rounded text-xs">approve(to, tokenId)</code>: Gives permission to transfer a token</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-cyan-400 mb-4">ERC-1155: Multi-Token Standard</h4>
                  
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-md mb-6">
                    <pre className="text-xs text-gray-300 overflow-auto">
{`// Simplified ERC-1155 Interface
interface IERC1155 {
    // Core functions
    function balanceOf(address account, uint256 id) external view returns (uint256);
    function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids) 
        external view returns (uint256[] memory);
    function setApprovalForAll(address operator, bool approved) external;
    function isApprovedForAll(address account, address operator) external view returns (bool);
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;
    function safeBatchTransferFrom(address from, address to, uint256[] calldata ids, 
        uint256[] calldata amounts, bytes calldata data) external;
    
    // Events
    event TransferSingle(address indexed operator, address indexed from, address indexed to, 
        uint256 id, uint256 value);
    event TransferBatch(address indexed operator, address indexed from, address indexed to, 
        uint256[] ids, uint256[] values);
    event ApprovalForAll(address indexed account, address indexed operator, bool approved);
    event URI(string value, uint256 indexed id);
}`}
                    </pre>
                  </div>
                  
                  <p className="text-gray-300 mb-4">
                    ERC-1155 improves on ERC-721 by allowing a single contract to manage multiple token types, 
                    both fungible and non-fungible. This makes it ideal for gaming assets.
                  </p>
                  
                  <h5 className="text-lg font-semibold text-white mb-2">Advantages for Gaming NFTs</h5>
                  <ul className="space-y-2 text-gray-300 mb-4">
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      <span><strong>Batch Operations:</strong> Transfer multiple items in a single transaction</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      <span><strong>Gas Efficiency:</strong> Lower costs for transferring multiple assets</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      <span><strong>Mixed Asset Types:</strong> Handle both unique items and quantities of identical items</span>
                    </li>
                  </ul>
                  
                  <div className="p-4 bg-indigo-900 bg-opacity-50 rounded-md border border-indigo-700 mt-6">
                    <h5 className="font-semibold text-white mb-2">Which Standard Should You Choose?</h5>
                    <p className="text-gray-300 text-sm">
                      Our platform supports both standards. Use <strong>ERC-721</strong> for unique 1/1 artwork
                      and <strong>ERC-1155</strong> for gaming assets or editions with multiple copies.
                      Our technical team can help you decide which is best for your specific use case.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-xl font-semibold text-cyan-400 mb-4">Metadata & URI Standards</h4>
                <p className="text-gray-300 mb-4">
                  NFT metadata is crucial for storing information about your digital assets. Our platform follows 
                  industry best practices for metadata structure and storage.
                </p>
                
                <div className="bg-gray-700 bg-opacity-50 p-4 rounded-md mb-6">
                  <h5 className="font-semibold text-white mb-2">Sample Metadata JSON</h5>
                  <pre className="text-xs text-gray-300 overflow-auto">
{`{
  "name": "Pixel Hero #123",
  "description": "A legendary pixel art hero with special abilities",
  "image": "ipfs://QmZ9vQ1T2XZCzUZDFcXdFVmkFxmXLpa8Vzq9yS5o1rmPUH",
  "animation_url": "ipfs://QmS5S5zugCNaZ3MEzQbEZm9c6qqmm74VHFt1DCGVMg7GBF",
  "external_url": "https://yourplatform.com/pixelhero/123",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Night Sky"
    },
    {
      "trait_type": "Weapon",
      "value": "Pixel Sword"
    },
    {
      "trait_type": "Rarity",
      "value": "Legendary",
      "display_type": "boost_percentage"
    },
    {
      "trait_type": "Attack Power",
      "value": 90,
      "max_value": 100,
      "display_type": "number"
    },
    {
      "trait_type": "Generation",
      "value": 1
    },
    {
      "trait_type": "Level",
      "value": 5,
      "max_value": 10
    }
  ],
  "game_data": {
    "spawn_rate": 0.05,
    "speed_multiplier": 1.2,
    "special_ability": "Teleport",
    "compatible_games": ["PixelQuest", "CryptoAdventure"]
  }
}`}
                  </pre>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-800 bg-opacity-50 rounded-md">
                    <h5 className="font-semibold text-pink-400 mb-2">On-Chain vs. Off-Chain Storage</h5>
                    <p className="text-gray-300 text-sm">
                      <strong>On-chain storage</strong> keeps all metadata directly on the blockchain. 
                      This provides maximum permanence but is expensive for large files.
                    </p>
                    <p className="text-gray-300 text-sm mt-2">
                      <strong>Off-chain storage</strong> (like IPFS) stores links on the blockchain that
                      point to the metadata. More cost-effective but requires proper pinning to ensure availability.
                    </p>
                    <p className="text-gray-300 text-sm mt-2">
                      Our platform uses a hybrid approach: critical information on-chain with IPFS integration
                      for larger files, all properly pinned for long-term preservation.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-800 bg-opacity-50 rounded-md">
                    <h5 className="font-semibold text-pink-400 mb-2">NFT Metadata Best Practices</h5>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">1.</span>
                        <span>Include comprehensive attributes for marketplace filtering</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">2.</span>
                        <span>Add game-specific properties in a nested object</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">3.</span>
                        <span>Use proper display_type values for numeric properties</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">4.</span>
                        <span>Include both static image and animation_url for dynamic NFTs</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">5.</span>
                        <span>Always use content-addressable storage like IPFS for immutability</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pixel Art Technology */}
          {activeTab === 'pixelart' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Pixel Art Technology & Creation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Pixel Art Fundamentals</h4>
                  <p className="text-gray-300 mb-4">
                    Pixel art is a digital art form where images are created at the pixel level. Each pixel is placed
                    deliberately, making it ideal for retro-styled games and collectibles.
                  </p>
                  
                  <div className="p-4 bg-gray-700 bg-opacity-50 rounded-md mb-6">
                    <h5 className="font-semibold text-white mb-2">Technical Characteristics</h5>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start">
                        <span className="text-pink-400 mr-2">•</span>
                        <span><strong>Resolution:</strong> Typically low-resolution (8×8 to 128×128 pixels)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-pink-400 mr-2">•</span>
                        <span><strong>Color Palettes:</strong> Limited color sets (16-256 colors)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-pink-400 mr-2">•</span>
                        <span><strong>Antialiasing:</strong> Manual pixel placement for smooth transitions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-pink-400 mr-2">•</span>
                        <span><strong>File Formats:</strong> PNG for lossless compression with transparency</span>
                      </li>
                    </ul>
                  </div>
                  
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Technical Techniques</h4>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-gray-800 rounded-md">
                      <h5 className="font-semibold text-white text-sm mb-1">Dithering</h5>
                      <p className="text-gray-300 text-xs">
                        Creates the illusion of additional colors by alternating pixels in patterns
                      </p>
                    </div>
                    <div className="p-3 bg-gray-800 rounded-md">
                      <h5 className="font-semibold text-white text-sm mb-1">Pixel Hinting</h5>
                      <p className="text-gray-300 text-xs">
                        Adding single pixels to suggest details without fully drawing them
                      </p>
                    </div>
                    <div className="p-3 bg-gray-800 rounded-md">
                      <h5 className="font-semibold text-white text-sm mb-1">Tiling</h5>
                      <p className="text-gray-300 text-xs">
                        Creating patterns that can be repeated seamlessly for backgrounds
                      </p>
                    </div>
                    <div className="p-3 bg-gray-800 rounded-md">
                      <h5 className="font-semibold text-white text-sm mb-1">Outlines</h5>
                      <p className="text-gray-300 text-xs">
                        Using contrasting pixel borders to define shapes clearly
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-indigo-900 bg-opacity-50 rounded-md border border-indigo-700">
                    <h5 className="font-semibold text-white mb-2">Our Platform's Pixel Editor</h5>
                    <p className="text-gray-300 text-sm">
                      Our built-in editor supports multiple canvas sizes (8×8 to 128×128), custom color palettes, 
                      layers, animation frames, and specialized pixel art tools. All with a simple, intuitive interface
                      designed for both beginners and experts.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Optimizing for NFTs & Games</h4>
                  
                  <div className="p-4 bg-gray-700 bg-opacity-50 rounded-md mb-6">
                    <h5 className="font-semibold text-white mb-2">Sprite Sheets & Animation</h5>
                    <p className="text-gray-300 text-sm mb-3">
                      Game-ready pixel art is often organized into sprite sheets - single images containing 
                      multiple animation frames or character states.
                    </p>
                    
                    <pre className="text-xs text-gray-300 overflow-auto bg-gray-800 p-2 rounded-md">
{`// Example CSS sprite animation
.character {
  width: 32px;
  height: 32px;
  background-image: url('spritesheet.png');
  animation: walkAnimation 0.6s steps(8) infinite;
}

@keyframes walkAnimation {
  from { background-position: 0px 0px; }
  to { background-position: -256px 0px; } /* 8 frames at 32px width */
}`}
                    </pre>
                  </div>
                  
                  <div className="p-4 bg-gray-700 bg-opacity-50 rounded-md mb-6">
                    <h5 className="font-semibold text-white mb-2">Generative Pixel Art</h5>
                    <p className="text-gray-300 text-sm mb-3">
                      Generative techniques allow for creating large NFT collections with randomized attributes,
                      each with a unique combination of traits.
                    </p>
                    
                    <pre className="text-xs text-gray-300 overflow-auto bg-gray-800 p-2 rounded-md">
{`// Pseudocode for generative layer-based pixel art
function generatePixelCharacter() {
  const layers = {
    background: ['forest.png', 'desert.png', 'mountain.png'],
    body: ['human.png', 'elf.png', 'orc.png'],
    armor: ['leather.png', 'chain.png', 'plate.png'],
    weapon: ['sword.png', 'bow.png', 'staff.png'],
    accessory: ['hat.png', 'earring.png', 'necklace.png']
  };
  
  let character = new Canvas(32, 32);
  
  // Select random element from each layer
  for (const layer in layers) {
    const options = layers[layer];
    const selectedOption = options[Math.floor(Math.random() * options.length)];
    character.drawLayer(selectedOption);
  }
  
  return character;
}`}
                    </pre>
                  </div>
                  
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">File Structure Standards</h4>
                  <p className="text-gray-300 mb-4">
                    Our platform supports standardized file structures for game-ready pixel art assets:
                  </p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-gray-800 rounded-md">
                      <h5 className="font-semibold text-white text-sm mb-1">JSON-based Texture Atlas</h5>
                      <pre className="text-xs text-gray-300 overflow-auto">
{`{
  "frames": {
    "character_idle_0": {
      "frame": {"x": 0, "y": 0, "w": 32, "h": 32},
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {"x": 0, "y": 0, "w": 32, "h": 32},
      "sourceSize": {"w": 32, "h": 32}
    },
    "character_idle_1": {
      "frame": {"x": 32, "y": 0, "w": 32, "h": 32},
      "rotated": false,
      "trimmed": false,
      "spriteSourceSize": {"x": 0, "y": 0, "w": 32, "h": 32},
      "sourceSize": {"w": 32, "h": 32}
    }
    // Additional frames...
  },
  "meta": {
    "app": "PixelNFT Platform",
    "version": "1.0",
    "image": "character_sheet.png",
    "format": "RGBA8888",
    "size": {"w": 256, "h": 32},
    "scale": "1"
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Game Integration */}
          {activeTab === 'gamedev' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Game Integration & Development</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">NFT Integration in Games</h4>
                  <p className="text-gray-300 mb-4">
                    Integrating NFTs into games allows players to own, trade, and use unique in-game assets. Our platform provides
                    tools and APIs to seamlessly integrate NFTs into your game, whether it's a web-based or native application.
                  </p>
                  
                  <div className="p-4 bg-gray-700 bg-opacity-50 rounded-md mb-6">
                    <h5 className="font-semibold text-white mb-2">Key Features for Game Developers</h5>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start">
                        <span className="text-pink-400 mr-2">•</span>
                        <span><strong>Wallet Integration:</strong> Connect player wallets using Web3.js or Ethers.js</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-pink-400 mr-2">•</span>
                        <span><strong>Asset Loading:</strong> Load NFT metadata and images dynamically</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-pink-400 mr-2">•</span>
                        <span><strong>Smart Contract Interaction:</strong> Read and write to NFT contracts</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-pink-400 mr-2">•</span>
                        <span><strong>Cross-Platform Support:</strong> Works with Unity, Unreal Engine, and web-based games</span>
                      </li>
                    </ul>
                  </div>
                  
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">API Endpoints</h4>
                  <div className="p-4 bg-gray-800 bg-opacity-50 rounded-md">
                    <h5 className="font-semibold text-white mb-2">Get Player NFTs</h5>
                    <pre className="text-xs text-gray-300 overflow-auto">
{`GET /api/v1/nfts?wallet=0x123...
Response:
{
  "nfts": [
    {
      "tokenId": "123",
      "name": "Pixel Hero #123",
      "image": "ipfs://QmZ9vQ1T2XZCzUZDFcXdFVmkFxmXLpa8Vzq9yS5o1rmPUH",
      "attributes": [
        { "trait_type": "Weapon", "value": "Pixel Sword" }
      ]
    }
  ]
}`}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Unity Integration</h4>
                  <p className="text-gray-300 mb-4">
                    Our platform provides a Unity SDK for easy integration of NFTs into Unity games. The SDK handles wallet
                    connections, NFT loading, and smart contract interactions.
                  </p>
                  
                  <div className="p-4 bg-gray-700 bg-opacity-50 rounded-md mb-6">
                    <h5 className="font-semibold text-white mb-2">Unity SDK Example</h5>
                    <pre className="text-xs text-gray-300 overflow-auto">
{`using PixelNFT.SDK;

public class NFTLoader : MonoBehaviour {
    public string walletAddress;
    public string contractAddress;

    async void Start() {
        var nfts = await PixelNFT.GetNFTs(walletAddress, contractAddress);
        foreach (var nft in nfts) {
            Debug.Log($"Loaded NFT: {nft.Name}");
            var texture = await PixelNFT.LoadTexture(nft.ImageUrl);
            GetComponent<Renderer>().material.mainTexture = texture;
        }
    }
}`}
                    </pre>
                  </div>
                  
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Web3.js Integration</h4>
                  <p className="text-gray-300 mb-4">
                    For web-based games, you can use Web3.js to interact with the blockchain and load NFTs directly into your game.
                  </p>
                  
                  <div className="p-4 bg-gray-800 bg-opacity-50 rounded-md">
                    <h5 className="font-semibold text-white mb-2">Web3.js Example</h5>
                    <pre className="text-xs text-gray-300 overflow-auto">
{`const web3 = new Web3(Web3.givenProvider);
const contract = new web3.eth.Contract(abi, contractAddress);

async function loadNFTs(wallet) {
    const balance = await contract.methods.balanceOf(wallet).call();
    for (let i = 0; i < balance; i++) {
        const tokenId = await contract.methods.tokenOfOwnerByIndex(wallet, i).call();
        const metadata = await contract.methods.tokenURI(tokenId).call();
        const response = await fetch(metadata);
        const nft = await response.json();
        console.log("Loaded NFT:", nft);
    }
}`}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-xl font-semibold text-cyan-400 mb-4">Best Practices for Game Integration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-800 bg-opacity-50 rounded-md">
                    <h5 className="font-semibold text-pink-400 mb-2">Optimize Asset Loading</h5>
                    <p className="text-gray-300 text-sm">
                      Use IPFS gateways or CDNs to load NFT assets quickly. Cache metadata locally to reduce API calls.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800 bg-opacity-50 rounded-md">
                    <h5 className="font-semibold text-pink-400 mb-2">Handle Wallet Disconnects</h5>
                    <p className="text-gray-300 text-sm">
                      Ensure your game gracefully handles wallet disconnections and reconnects without breaking the experience.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800 bg-opacity-50 rounded-md">
                    <h5 className="font-semibold text-pink-400 mb-2">Gas Fee Optimization</h5>
                    <p className="text-gray-300 text-sm">
                      Use Layer 2 solutions like Polygon to reduce gas fees for in-game transactions.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800 bg-opacity-50 rounded-md">
                    <h5 className="font-semibold text-pink-400 mb-2">Cross-Platform Compatibility</h5>
                    <p className="text-gray-300 text-sm">
                      Ensure your game works across desktop, mobile, and web platforms with consistent NFT functionality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
{/* Advanced Techniques */}
{activeTab === 'advanced' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Advanced NFT Techniques</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Dynamic NFTs</h4>
                  <p className="text-gray-300 mb-4">
                    Dynamic NFTs (dNFTs) can change their appearance or properties based on external data or user interactions.
                    This opens up possibilities for evolving characters, reactive artwork, and game items that level up.
                  </p>
                  
                  <div className="p-4 bg-gray-700 bg-opacity-50 rounded-md mb-6">
                    <h5 className="font-semibold text-white mb-2">Smart Contract Example</h5>
                    <pre className="text-xs text-gray-300 overflow-auto">
{`// Simplified Dynamic NFT Contract
contract DynamicPixelNFT is ERC721 {
    // Mapping from token ID to character level
    mapping(uint256 => uint8) private _levels;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    function levelUp(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Only owner can level up");
        require(_levels[tokenId] < 10, "Max level reached");
        
        _levels[tokenId]++;
        
        // Emit event for off-chain tracking
        emit LevelUp(tokenId, _levels[tokenId]);
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        // Return different URI based on level
        return string(abi.encodePacked(
            _baseTokenURI,
            Strings.toString(tokenId),
            "/level/",
            Strings.toString(_levels[tokenId])
        ));
    }
    
    event LevelUp(uint256 indexed tokenId, uint8 newLevel);
}`}
                    </pre>
                  </div>
                  
                  <div className="p-4 bg-indigo-900 bg-opacity-50 rounded-md border border-indigo-700">
                    <h5 className="font-semibold text-white mb-2">Implementation Approaches</h5>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start">
                        <span className="text-pink-400 mr-2">•</span>
                        <span><strong>On-Chain Evolution:</strong> Store character states directly in the contract</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-pink-400 mr-2">•</span>
                        <span><strong>Metadata URI Modification:</strong> Update the tokenURI to point to different metadata</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-pink-400 mr-2">•</span>
                        <span><strong>Oracles:</strong> Use Chainlink or other oracles to respond to real-world data</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Interactive NFTs</h4>
                  <p className="text-gray-300 mb-4">
                    Interactive NFTs go beyond static images to create engaging experiences. Our platform supports
                    HTML5/JavaScript-based NFTs that function as mini-applications.
                  </p>
                  
                  <div className="p-4 bg-gray-700 bg-opacity-50 rounded-md mb-6">
                    <h5 className="font-semibold text-white mb-2">Interactive Pixel Pet Example</h5>
                    <pre className="text-xs text-gray-300 overflow-auto">
{`<!DOCTYPE html>
<html>
<head>
  <style>
    #pet { image-rendering: pixelated; width: 128px; height: 128px; }
    .button { background: #4CAF50; color: white; border: none; padding: 5px 10px; margin: 5px; }
  </style>
</head>
<body>
  <h2>My Pixel Pet</h2>
  <canvas id="pet" width="32" height="32"></canvas>
  <div>
    <button class="button" onclick="feed()">Feed</button>
    <button class="button" onclick="play()">Play</button>
    <button class="button" onclick="sleep()">Sleep</button>
  </div>
  <div>Happiness: <span id="happiness">50</span>%</div>
  
  <script>
    // Pet state
    let state = { 
      happiness: 50,
      lastInteraction: Date.now(),
      frame: 0
    };
    
    // Load pet state from local storage
    function loadState() {
      const saved = localStorage.getItem('pixelPet_' + window.tokenId);
      if (saved) state = JSON.parse(saved);
      updateUI();
    }
    
    // Save pet state
    function saveState() {
      localStorage.setItem('pixelPet_' + window.tokenId, JSON.stringify(state));
    }
    
    // Pet interactions
    function feed() {
      state.happiness = Math.min(100, state.happiness + 10);
      state.lastInteraction = Date.now();
      updateUI();
      saveState();
    }
    
    // Animation loop and other functions...
  </script>
</body>
</html>`}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-xl font-semibold text-cyan-400 mb-4">Cross-Chain NFTs</h4>
                <p className="text-gray-300 mb-4">
                  Cross-chain functionality allows your NFTs to be used across multiple blockchain networks,
                  expanding their utility and market reach.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-800 bg-opacity-50 rounded-md">
                    <h5 className="font-semibold text-pink-400 mb-2">Bridging Solutions</h5>
                    <p className="text-gray-300 text-sm">
                      Our platform integrates with leading bridge protocols like Polygon Bridge, enabling
                      seamless transfer of NFTs between Ethereum and other compatible networks.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800 bg-opacity-50 rounded-md">
                    <h5 className="font-semibold text-pink-400 mb-2">Multi-Chain Deployment</h5>
                    <p className="text-gray-300 text-sm">
                      Deploy the same NFT collection on multiple chains simultaneously, with our tools
                      for synchronizing metadata and ensuring consistent properties across networks.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 p-5 bg-indigo-900 bg-opacity-50 rounded-lg border border-indigo-700">
                  <h4 className="text-xl font-semibold text-white mb-3">Fractional NFTs</h4>
                  <p className="text-gray-300 mb-4">
                    Fractional NFTs (F-NFTs) allow multiple people to share ownership of a single NFT, making
                    high-value assets more accessible to a wider audience.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-pink-400 mb-2">Implementation</h5>
                      <p className="text-gray-300 text-sm">
                        Our platform uses a vault-based approach where the original NFT is locked in a smart contract,
                        and ERC-20 tokens representing shares are minted to owners.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-pink-400 mb-2">Use Cases</h5>
                      <ul className="space-y-1 text-gray-300 text-sm">
                        <li className="flex items-start">
                          <span className="text-cyan-400 mr-2">•</span>
                          <span>Shared ownership of rare game assets</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-cyan-400 mr-2">•</span>
                          <span>Community ownership of generative art</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-cyan-400 mr-2">•</span>
                          <span>Investment in high-value digital collectibles</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-gray-700 bg-opacity-50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-cyan-400 mb-4">Advanced Security Considerations</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-800 bg-opacity-50 rounded-md">
                    <h5 className="font-semibold text-white mb-2">Smart Contract Audits</h5>
                    <p className="text-gray-300 text-sm">
                      Always have your NFT contracts audited by reputable security firms before deployment.
                      Our platform provides pre-audited templates and custom audit services.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-800 bg-opacity-50 rounded-md">
                    <h5 className="font-semibold text-white mb-2">Access Control</h5>
                    <p className="text-gray-300 text-sm">
                      Implement proper access controls to prevent unauthorized modifications.
                      Use OpenZeppelin's Ownable or AccessControl contracts as a foundation.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-800 bg-opacity-50 rounded-md">
                    <h5 className="font-semibold text-white mb-2">Metadata Security</h5>
                    <p className="text-gray-300 text-sm">
                      Ensure that metadata is stored on immutable systems like IPFS and properly pinned.
                      Consider on-chain metadata storage for critical properties.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NFTTechnicalLearnPage;