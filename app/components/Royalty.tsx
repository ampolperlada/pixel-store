import React from 'react';

const RoyaltySystem = () => {
  return (
    <section className="py-16 bg-indigo-900 bg-opacity-70">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Royalty & Credit System</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-pink-400 mb-4">For Artists</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-200">Earn 5-15% royalties on secondary sales</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-200">Get credited whenever your art appears in games</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-200">Track usage across different games and platforms</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-200">Automatic payment distribution for each usage</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">For Game Developers</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-200">Simple integration with our API</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-200">Automatic artist credit implementation</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-200">Access to thousands of game-ready pixel assets</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-200">License verification and management tools</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg">
            Learn More About Our Royalty System
          </button>
        </div>
      </div>
    </section>
  );
};

export default RoyaltySystem;