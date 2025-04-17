// app/src/components/StatisticsSection.jsx
import React from 'react';

export default function StatisticsSection() {
  return (
    <section className="py-12 px-4 md:px-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-pink-500 mb-2">5,000+</div>
            <p className="text-gray-300">Pixel Assets</p>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-purple-500 mb-2">120+</div>
            <p className="text-gray-300">Artists</p>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-cyan-500 mb-2">25+</div>
            <p className="text-gray-300">Game Integrations</p>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-500 mb-2">12,500+</div>
            <p className="text-gray-300">Community Members</p>
          </div>
        </div>
      </div>
    </section>
  );
}