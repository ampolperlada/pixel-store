// components/UserSuccessStories.jsx
import React, { useState } from 'react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    artist: "PixelMaster",
    avatar: "/avatars/pixelmaster.png",
    testimonial: "Since joining Pixel Marketplace, my artwork has been featured in 3 indie games. I've earned over $12,000 in just 6 months!",
    artworkBefore: "/testimonials/artwork-before-1.png",
    artworkAfter: "/testimonials/artwork-after-1.png",
    game: "Cyber Quest 2099",
    earnings: "$12,450"
  },
  {
    id: 2,
    artist: "8BitQueen",
    avatar: "/avatars/8bitqueen.png",
    testimonial: "The game integration feature helped my pixel characters come to life. Now they're in a popular mobile game with over 500k downloads!",
    artworkBefore: "/testimonials/artwork-before-2.png",
    artworkAfter: "/testimonials/artwork-after-2.png",
    game: "Pixel Warriors",
    earnings: "$8,320"
  },
  {
    id: 3,
    artist: "VoxelViking",
    avatar: "/avatars/voxelviking.png",
    testimonial: "From hobbyist to professional in 3 months. The marketplace connected me with game developers I never would have met otherwise.",
    artworkBefore: "/testimonials/artwork-before-3.png",
    artworkAfter: "/testimonials/artwork-after-3.png",
    game: "Dungeon Crawlers",
    earnings: "$15,780"
  }
];

const UserSuccessStories = () => {
  const [activeStory, setActiveStory] = useState(testimonials[0]);

  return (
    <section className="py-12 bg-gradient-to-r from-purple-900 to-blue-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Success Stories</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Artist Selection */}
          <div className="bg-gray-900 bg-opacity-70 rounded-lg p-4">
            <h3 className="text-xl text-pink-500 font-semibold mb-4">Featured Artists</h3>
            <div className="space-y-4">
              {testimonials.map((story) => (
                <div 
                  key={story.id}
                  onClick={() => setActiveStory(story)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                    activeStory.id === story.id 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500' 
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    {/* Replace with next/image when you have actual images */}
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white">
                      {story.artist.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-white">{story.artist}</h4>
                    <p className="text-sm text-cyan-300">Earnings: {story.earnings}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Artist Story & Testimonial */}
          <div className="bg-gray-900 bg-opacity-70 rounded-lg p-6">
            <div className="flex flex-col h-full">
              <div className="text-lg text-white italic mb-6">
                "{activeStory.testimonial}"
              </div>
              <div className="flex items-center mt-auto">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white">
                    {activeStory.artist.charAt(0)}
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-white">{activeStory.artist}</h4>
                  <p className="text-sm text-cyan-300">Featured in {activeStory.game}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Before/After Showcase */}
          <div className="bg-gray-900 bg-opacity-70 rounded-lg p-4">
            <h3 className="text-xl text-pink-500 font-semibold mb-4">From Art to Game</h3>
            <div className="space-y-4">
              <div className="relative h-40 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                <p className="absolute top-2 left-2 bg-gray-900 px-2 py-1 rounded text-xs font-medium text-white">ORIGINAL ART</p>
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded"></div>
              </div>
              
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              
              <div className="relative h-40 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                <p className="absolute top-2 left-2 bg-gray-900 px-2 py-1 rounded text-xs font-medium text-white">IN-GAME INTEGRATION</p>
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserSuccessStories;