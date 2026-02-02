'use client';

import Link from 'next/link';

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-pink-400 hover:text-pink-300 transition">
            Pixel Store
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white transition">
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold mb-6 border border-purple-500/30">
          COMING SOON
        </div>
        <h1 className="text-5xl font-bold mb-6">Explore Artwork Gallery</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Browse thousands of unique pixel art creations from talented artists worldwide. 
          This feature will be available when the platform launches.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Curated Collections</h3>
            <p className="text-gray-400 text-sm">Discover handpicked artwork collections</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Advanced Filters</h3>
            <p className="text-gray-400 text-sm">Find exactly what you're looking for</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Live Auctions</h3>
            <p className="text-gray-400 text-sm">Bid on exclusive limited editions</p>
          </div>
        </div>

        <Link 
          href="/waitlist"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105"
        >
          Join Waitlist for Early Access
        </Link>
      </div>
    </div>
  );
}