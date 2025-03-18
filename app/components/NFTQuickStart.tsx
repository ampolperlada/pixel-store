import React from 'react';
// this is the learn button on sticky navbar
const NFTQuickStart = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-purple-900 to-indigo-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-8">NFT Quick Start Guide</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-pink-400 mb-4">Buying NFTs</h3>
            <ol className="list-decimal ml-5 space-y-3 text-gray-200">
              <li>Connect your wallet to our marketplace</li>
              <li>Browse our collection of unique pixel art</li>
              <li>Purchase your favorite pieces using crypto</li>
              <li>Display your collection or use in supported games</li>
            </ol>
            <button className="mt-6 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-lg">
              Start Collecting
            </button>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Selling NFTs</h3>
            <ol className="list-decimal ml-5 space-y-3 text-gray-200">
              <li>Create your pixel art (or use our editor)</li>
              <li>Mint your creation as an NFT on our platform</li>
              <li>Set your price and royalty preferences</li>
              <li>Earn income whenever your art sells</li>
            </ol>
            <button className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg">
              Start Creating
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NFTQuickStart;