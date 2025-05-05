"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ArtworkItem } from "../data/sampleData";

import LoginModal from './LoginModal'; // Import the LoginModal component
import SignupModal from './SignupModal'; // Import the SignupModal component

interface ArtworkDetailModalProps {
  artwork: ArtworkItem;
  isOpen: boolean;
  onClose: () => void;
}

// Tab options
type TabType = 'details' | 'lore' | 'nft';

const ArtworkDetailModal: React.FC<ArtworkDetailModalProps> = ({ artwork, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [showLoginModal, setShowLoginModal] = useState(false); // State to manage login modal visibility
  const [showSignupModal, setShowSignupModal] = useState(false); // State to manage signup modal visibility

  // Handle Add to Cart action
  const handleAddToCart = () => {
    const isAuthenticated = false; // Replace with actual authentication check
    if (!isAuthenticated) {
      setShowLoginModal(true); // Show login modal if not authenticated
    } else {
      // Proceed with adding to cart
      console.log("Adding to cart:", artwork.title);
    }
  };

  // Handle Contact Gallery action
  const handleContactGallery = () => {
    const isAuthenticated = false; // Replace with actual authentication check
    if (!isAuthenticated) {
      setShowLoginModal(true); // Show login modal if not authenticated
    } else {
      // Proceed with contacting gallery
      console.log("Contacting gallery for:", artwork.title);
    }
  };

  // Close login modal
  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  // Open signup modal from login
  const openSignupFromLogin = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  // Close signup modal
  const closeSignupModal = () => {
    setShowSignupModal(false);
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white z-10"
          aria-label="Close details"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="flex flex-col md:flex-row">
          {/* Artwork Image */}
          <div className="md:w-2/5 relative">
            <div className="aspect-square relative">
              <Image 
                src={artwork.image} 
                alt={artwork.title}
                fill
                className="object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
              />
              
              {/* Universe Badge */}
              {artwork.universe && (
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></span>
                  <span className="text-white text-xs font-medium">{artwork.universe}</span>
                </div>
              )}
              
              {/* Featured Badge */}
              {artwork.featured && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 rounded-full">
                  <span className="text-white text-xs font-bold">Featured</span>
                </div>
              )}
              
              {/* Collection Badge */}
              {artwork.collection && (
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <span className="text-white text-xs">Part of <span className="font-bold text-cyan-400">{artwork.collection}</span></span>
                </div>
              )}
            </div>
          </div>
          
          {/* Artwork Details */}
          <div className="md:w-3/5 p-6 flex flex-col">
            {/* Title and Artist */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{artwork.title}</h2>
                {artwork.rarity && (
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    artwork.rarity === 'Legendary' ? 'bg-amber-500/20 text-amber-400' :
                    artwork.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-400' :
                    artwork.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {artwork.rarity}
                  </span>
                )}
              </div>
              <p className="text-cyan-400 text-lg">by {artwork.artist}</p>
            </div>
            
            {/* Price and Availability */}
            <div className="bg-black/30 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <p className="text-3xl font-bold text-cyan-300">{artwork.price}</p>
                <div className="flex flex-col items-end">
                  <p className={`text-sm ${artwork.inStock !== false ? "text-green-400" : "text-red-400"}`}>
                    {artwork.inStock !== false ? "In Stock" : "Out of Stock"}
                  </p>
                  {artwork.edition && (
                    <p className="text-xs text-gray-400">Edition {artwork.edition.current} of {artwork.edition.total}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-700 mb-4">
              <button 
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'details' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              <button 
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'lore' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('lore')}
              >
                Lore & Universe
              </button>
              <button 
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'nft' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('nft')}
              >
                NFT Info
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="flex-grow overflow-y-auto pr-2 mb-6">
              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-4">
                  {artwork.description && (
                    <div>
                      <h3 className="text-gray-400 text-sm uppercase mb-1">Description</h3>
                      <p className="text-white">{artwork.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    {artwork.year && (
                      <div>
                        <h3 className="text-gray-400 text-sm uppercase mb-1">Year</h3>
                        <p className="text-white">{artwork.year}</p>
                      </div>
                    )}
                    
                    {artwork.medium && (
                      <div>
                        <h3 className="text-gray-400 text-sm uppercase mb-1">Medium</h3>
                        <p className="text-white">{artwork.medium}</p>
                      </div>
                    )}
                    
                    {artwork.dimensions && (
                      <div>
                        <h3 className="text-gray-400 text-sm uppercase mb-1">Dimensions</h3>
                        <p className="text-white">{artwork.dimensions}</p>
                      </div>
                    )}
                    
                    {artwork.style && (
                      <div>
                        <h3 className="text-gray-400 text-sm uppercase mb-1">Style</h3>
                        <p className="text-white">{artwork.style}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {artwork.tags && artwork.tags.length > 0 && (
                    <div>
                      <h3 className="text-gray-400 text-sm uppercase mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {artwork.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Lore & Universe Tab */}
              {activeTab === 'lore' && (
                <div className="space-y-6">
                  {/* Character Lore */}
                  {artwork.lore && (
                    <div className="bg-gray-800/50 rounded-lg p-4 border-l-2 border-cyan-500">
                      <h3 className="text-cyan-400 font-medium mb-2">Character Lore</h3>
                      <p className="text-white text-sm leading-relaxed">{artwork.lore}</p>
                    </div>
                  )}
                  
                  {/* Universe Information */}
                  {artwork.universeDescription && (
                    <div>
                      <h3 className="text-gray-400 text-sm uppercase mb-2">Universe</h3>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 rounded-full bg-cyan-400 mr-2"></div>
                          <h4 className="text-white font-medium">{artwork.universe}</h4>
                        </div>
                        <p className="text-gray-300 text-sm">{artwork.universeDescription}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Related Characters */}
                  {artwork.relatedCharacters && artwork.relatedCharacters.length > 0 && (
                    <div>
                      <h3 className="text-gray-400 text-sm uppercase mb-2">Related Characters</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {artwork.relatedCharacters.map((character, index) => (
                          <div key={index} className="bg-gray-800/30 rounded p-2 flex items-center">
                            {character.image && (
                              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                                <Image 
                                  src={character.image} 
                                  alt={character.name} 
                                  width={40} 
                                  height={40} 
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <p className="text-white text-sm font-medium">{character.name}</p>
                              <p className="text-gray-400 text-xs">{character.relation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* NFT Info Tab */}
              {activeTab === 'nft' && (
                <div className="space-y-6">
                  {/* Blockchain Info */}
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-gray-400 text-sm uppercase mb-3">Blockchain Information</h3>
                    <div className="space-y-3">
                      {artwork.blockchain && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Blockchain</span>
                          <span className="text-white font-medium">{artwork.blockchain}</span>
                        </div>
                      )}
                      {artwork.tokenId && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Token ID</span>
                          <span className="text-white font-mono text-sm">{artwork.tokenId}</span>
                        </div>
                      )}
                      {artwork.contract && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Contract</span>
                          <span className="text-white font-mono text-sm truncate max-w-[200px]">{artwork.contract}</span>
                        </div>
                      )}
                      {artwork.mintDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Minted</span>
                          <span className="text-white">{artwork.mintDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Ownership History */}
                  {artwork.ownershipHistory && artwork.ownershipHistory.length > 0 && (
                    <div>
                      <h3 className="text-gray-400 text-sm uppercase mb-2">Ownership History</h3>
                      <div className="bg-gray-800/30 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-800">
                            <tr>
                              <th className="text-left p-3 text-gray-300">Owner</th>
                              <th className="text-left p-3 text-gray-300">Date</th>
                              <th className="text-right p-3 text-gray-300">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {artwork.ownershipHistory.map((record, index) => (
                              <tr key={index} className="border-t border-gray-700">
                                <td className="p-3 text-white">{record.owner}</td>
                                <td className="p-3 text-gray-400">{record.date}</td>
                                <td className="p-3 text-right text-cyan-300">{record.price}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  {/* Royalties */}
                  {artwork.royalties && (
                    <div className="bg-gray-800/30 rounded-lg p-4">
                      <h3 className="text-gray-400 text-sm uppercase mb-2">Royalties</h3>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-cyan-500 h-2.5 rounded-full" 
                            style={{ width: `${artwork.royalties.percentage}%` }}
                          ></div>
                        </div>
                        <span className="ml-3 text-white font-medium">{artwork.royalties.percentage}%</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-2">
                        {artwork.royalties.description || `${artwork.royalties.percentage}% of secondary sales go to the original creator`}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Explore More Link */}
            <Link 
              href="/explore" 
              className="flex items-center justify-end text-cyan-400 hover:text-cyan-300 transition-colors mb-4 text-sm"
            >
              Explore more artworks
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Buy Now
              </button>
              <button 
                onClick={handleContactGallery}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Contact Artist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
          isOpen={showLoginModal} 
          onClose={closeLoginModal} 
          onSignupClick={openSignupFromLogin}
        />

      {/* Signup Modal */}
      <SignupModal 
          isOpen={showSignupModal} 
          onClose={closeSignupModal} 
        />
    </div>
  );
};

export default ArtworkDetailModal;