// app/page.jsx
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

      <div className="text-center py-8">
        <Link href="/create" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Open Pixel Creator Studio
        </Link>
      </div>  
    </main>
  );
}