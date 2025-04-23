'use client'; // Ensure this is a Client Component

import { useState } from "react";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";
import UserSuccessStories from "./components/UserSuccessStories";
import HeroSection from "./components/HeroSection";
import FeaturedArtworkCarousel from "./components/FeaturedArtworkCarousel";
import CommunityHighlights from "./components/CommunityHighlights";
import FeaturesTabs from "./components/FeaturesTabs";
import StatisticsSection from "./components/StatisticsSection";
import CallToAction from "./components/CallToAction";
import { featuredArt } from "./data/sampleData";
import Link from "next/link";
import NotificationBar from "./components/NotificationBar";
import GamificationElements from "./components/GamificationElements";
import EducationHub from "./components/EducationHub";
import ArtistShowcase from "./components/ArtistShowcase";
import HowItWorks from "./components/HowItWorks";
import RoyaltySystem from "./components/Royalty";
import TrendingSection from './components/TrendingSection';
import ProtectedRoute from './components/ProtectedRoute';


export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Notification Bar */}
      <NotificationBar />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Artwork Carousel */}
      <FeaturedArtworkCarousel featuredArt={featuredArt} />

      <ArtistShowcase />

      {/* <TrendingSection /> */}

      <HowItWorks />

      <RoyaltySystem />

      {/* Features Tabs (Games if I do have games, I will import it here) */}
      {/* <FeaturesTabs featuredGames={featuredGames} /> */}

      {/* Statistics Section */}
      <StatisticsSection />

      {/* User Success Stories Section */}
      <UserSuccessStories />

      {/* Community Highlights */}
      <CommunityHighlights />

      {/* Gamification Elements */}
      <GamificationElements />

      {/* Education Hub */}
      <EducationHub />

      {/* Creator Studio Section */}
      <div className="text-center py-12 bg-gray-900">
        <h2 className="text-3xl font-bold mb-4 text-cyan-300">Ready to Create?</h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Launch our pixel art creator studio and start making your own digital masterpieces.
          Create, mint, and sell your artwork directly on our marketplace.
        </p>
        <Link href="/create" className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 px-8 rounded-md transition-colors">
          Open Pixel Creator Studio
        </Link>
      </div>

      {/* Call to Action */}
      <CallToAction />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Signup Modal */}
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </main>
  );
}