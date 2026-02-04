'use client';

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
import Footer from "./components/Footer";

// ADD THIS LINE RIGHT HERE
export const dynamic = 'force-dynamic';

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

      <TrendingSection /> 

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
      <div className="text-center py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-block px-4 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold mb-4 border border-purple-500/30">
            ✨ BETA - Now Open to All Creators
          </div>
          <h2 className="text-4xl font-bold mb-4 text-cyan-300">Launch Your Art Career Today</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
            Join 500+ artists already creating and selling on Pixel Store. Our intuitive creator studio makes it easy to design, mint, and monetize your pixel art—no coding required.
          </p>
          <Link href="/create" className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105">
            Start Creating (Free)
            <span>→</span>
          </Link>
          <p className="text-gray-500 text-sm mt-4">No credit card required • Launch in minutes</p>
        </div>
      </div>

      {/* About Platform Section - NEW */}
      <div className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-semibold mb-4 border border-cyan-500/30">
                🚀 About Pixel Store
              </div>
              <h2 className="text-4xl font-bold mb-6">Building the Future of Digital Art</h2>
              <p className="text-gray-300 mb-4 leading-relaxed text-lg">
                Pixel Store is a next-generation marketplace where artists and collectors come together to create, trade, and discover unique pixel art NFTs.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Built with cutting-edge web3 technology, we're making digital art ownership accessible, secure, and rewarding for everyone—from first-time creators to professional artists.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-gray-300">Instant minting with low gas fees</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-gray-300">Automated royalties for creators</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-300">Vibrant community of 10,000+ members</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-300 mb-6">
                  To empower digital artists worldwide by providing the tools, community, and marketplace they need to thrive in the web3 era.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 rounded-lg p-4">
                    <div className="text-2xl font-bold text-pink-400 mb-1">$2M+</div>
                    <div className="text-gray-400 text-sm">Volume Traded</div>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">15K+</div>
                    <div className="text-gray-400 text-sm">Artworks Created</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <CallToAction />

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Signup Modal */}
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </main>
  );
}