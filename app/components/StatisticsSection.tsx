"use client"; // Mark as a client component

import React from 'react';

const StatisticsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
          Pixel Forge in Numbers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {/* Pixel Assets */}
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-purple-500 shadow-lg shadow-purple-500/30">
            <h3 className="text-4xl font-bold text-cyan-400">5,000+</h3>
            <p className="text-gray-300">Pixel Assets</p>
          </div>

          {/* Artists */}
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-pink-500 shadow-lg shadow-pink-500/30">
            <h3 className="text-4xl font-bold text-pink-400">120+</h3>
            <p className="text-gray-300">Artists</p>
          </div>

          {/* Game Integrations */}
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-cyan-500 shadow-lg shadow-cyan-500/30">
            <h3 className="text-4xl font-bold text-cyan-400">25+</h3>
            <p className="text-gray-300">Game Integrations</p>
          </div>

          {/* Community Members */}
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-purple-500 shadow-lg shadow-purple-500/30">
            <h3 className="text-4xl font-bold text-purple-400">12,500+</h3>
            <p className="text-gray-300">Community Members</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;