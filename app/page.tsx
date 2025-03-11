'use client';
import React from 'react';
import HeroSection from './components/HeroSection';
import FeaturedArtworkCarousel from './components/FeaturedArtworkCarousel';
import FeaturesTabs from './components/FeaturesTabs'; 
import StatisticsSection from './components/StatisticsSection';
import CallToAction from './components/CallToAction';
import { featuredArt, featuredGames } from './data/sampleData';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <HeroSection />
      <FeaturedArtworkCarousel featuredArt={featuredArt} />
      <FeaturesTabs featuredGames={featuredGames} />
      <StatisticsSection />
      <CallToAction />

      <div className="text-center py-12 bg-gray-900">
        <h2 className="text-3xl font-bold mb-4 text-cyan-300">Ready to Create?</h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Launch our pixel art creator studio and start making your own digital masterpieces.
          Create, mint, and sell your artwork directly on our marketplace.
        </p>
        <Link 
          href="/create" 
          className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 px-8 rounded-md transition-colors"
        >
          Open Pixel Creator Studio
        </Link>
      </div>  
    </main>
  );
}