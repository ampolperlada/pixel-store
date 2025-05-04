"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ArtworkItem } from "../data/sampleData";
import LoginModal from './LoginModal';

interface CartPageProps {
  artwork: ArtworkItem;
  onClose: () => void;
  onCheckout: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ artwork, onClose, onCheckout }) => {
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('crypto');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Simulate authentication check
  const isAuthenticated = false;
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      onCheckout();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Complete Your Purchase</h2>
            <button 
              onClick={onClose}
              className="bg-black/50 hover:bg-black/70 rounded-full p-2 text-white"
              aria-label="Close checkout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Artwork Summary */}
          <div className="flex items-center mb-6 bg-gray-800/50 p-4 rounded-lg">
            <div className="w-20 h-20 relative flex-shrink-0">
              <Image 
                src={artwork.image} 
                alt={artwork.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="ml-4 flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-white">{artwork.title}</h3>
                  <p className="text-sm text-cyan-400">by {artwork.artist}</p>
                </div>
                <p className="text-xl font-bold text-cyan-300">{artwork.price}</p>
              </div>
              {artwork.edition && (
                <p className="text-xs text-gray-400 mt-1">Edition {artwork.edition.current} of {artwork.edition.total}</p>
              )}
            </div>
          </div>
          
          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="text-white font-medium mb-3">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                className={`flex items-center justify-center p-4 rounded-lg border ${
                  paymentMethod === 'crypto' 
                    ? 'border-cyan-500 bg-cyan-900/30' 
                    : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                }`}
                onClick={() => setPaymentMethod('crypto')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-cyan-400">
                  <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m3.94.694-.347 1.969"></path>
                </svg>
                <span className="text-white">Cryptocurrency</span>
              </button>
              <button 
                className={`flex items-center justify-center p-4 rounded-lg border ${
                  paymentMethod === 'card' 
                    ? 'border-cyan-500 bg-cyan-900/30' 
                    : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-cyan-400">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                <span className="text-white">Credit Card</span>
              </button>
            </div>
          </div>
          
          {/* Crypto Payment Details */}
          {paymentMethod === 'crypto' && (
            <div className="mb-6 bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-3">Wallet Details</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Connected Wallet</label>
                  <div className="flex items-center justify-between bg-gray-700/70 p-3 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3 text-white text-xs font-bold">MM</div>
                      <span className="font-mono text-gray-300">0x71C...93a4</span>
                    </div>
                    <button className="text-sm text-cyan-400 hover:text-cyan-300">Change</button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Network</label>
                  <div className="flex items-center justify-between bg-gray-700/70 p-3 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-gray-300">Ethereum Mainnet</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Estimated Gas Fee</label>
                  <div className="bg-gray-700/70 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">~ 0.005 ETH</span>
                      <span className="text-gray-400">($8.75)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Credit Card Payment Details */}
          {paymentMethod === 'card' && (
            <div className="mb-6 bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-3">Card Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Card Number</label>
                  <input 
                    type="text" 
                    placeholder="1234 5678 9012 3456" 
                    className="w-full bg-gray-700/70 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Expiration Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      className="w-full bg-gray-700/70 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">CVV</label>
                    <input 
                      type="text" 
                      placeholder="123" 
                      className="w-full bg-gray-700/70 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Order Summary */}
          <div className="mb-6 bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-white font-medium mb-3">Order Summary</h3>
            
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Item Price</span>
                <span className="text-white">{artwork.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Platform Fee (2.5%)</span>
                <span className="text-white">0.09 ETH</span>
              </div>
              {paymentMethod === 'crypto' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Gas Fee (estimated)</span>
                  <span className="text-white">0.005 ETH</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-700 pt-3">
              <div className="flex justify-between">
                <span className="text-white font-medium">Total</span>
                <span className="text-cyan-300 font-bold text-lg">3.59 ETH</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">≈ $6,324.76 USD</p>
            </div>
          </div>
          
          {/* Terms */}
          <div className="mb-6">
            <div className="flex items-start">
              <input 
                type="checkbox" 
                id="terms" 
                className="mt-1 mr-2"
              />
              <label htmlFor="terms" className="text-sm text-gray-300">
                I agree to the <Link href="#" className="text-cyan-400 hover:text-cyan-300">Terms of Service</Link> and acknowledge that this purchase is final and non-refundable.
              </label>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleCheckout}
              className={`flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  Complete Purchase
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)}
          triggerReason="checkout"
        />
      )}
    </div>
  );
};

export default CartPage;