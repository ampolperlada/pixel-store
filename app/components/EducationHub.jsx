// components/EducationHub.jsx
import React from 'react';
import Link from 'next/link';

// Mock data for tutorials
const tutorials = [
  {
    id: 1,
    title: "Creating Your First Character Sprite",
    duration: "12 min",
    views: 8542,
    level: "Beginner",
    thumbnail: "/tutorials/character-sprite.png"
  },
  {
    id: 2,
    title: "Animation Fundamentals for Pixel Art",
    duration: "18 min",
    views: 6321,
    level: "Intermediate",
    thumbnail: "/tutorials/animation.png"
  },
  {
    id: 3,
    title: "Advanced Shading Techniques",
    duration: "15 min",
    views: 4521,
    level: "Advanced",
    thumbnail: "/tutorials/shading.png"
  }
];

// Creator journey steps
const creatorJourney = [
  {
    step: 1,
    title: "Learn the Basics",
    description: "Master fundamental pixel art techniques and tools",
    icon: "📚"
  },
  {
    step: 2,
    title: "Create Your First Asset",
    description: "Apply your skills to create your first sellable item",
    icon: "✏️"
  },
  {
    step: 3,
    title: "Set Up Your Store",
    description: "Create your profile and upload your first items",
    icon: "🏪"
  },
  {
    step: 4,
    title: "Promote & Grow",
    description: "Market your work and build your reputation",
    icon: "📈"
  },
  {
    step: 5,
    title: "Game Integration",
    description: "Get your art featured in games and grow your income",
    icon: "🎮"
  }
];

const EducationHub = () => {
  return (
    <section className="py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-cyan-400">Pixel Art Academy</h2>
          <p className="text-gray-300 mt-2">Learn, create, and monetize your pixel art skills</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Featured Tutorials */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 py-3 px-4">
              <h3 className="font-bold text-white text-xl">Popular Tutorials</h3>
            </div>
            <div className="p-4 space-y-4">
              {tutorials.map(tutorial => (
                <div key={tutorial.id} className="bg-gray-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-cyan-500 transition-all">
                  <div className="relative">
                    <div className="w-full h-32 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                      <span className="text-xl">🎬</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {tutorial.duration}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-white font-medium">{tutorial.title}</h4>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-400">{tutorial.views.toLocaleString()} views</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        tutorial.level === "Beginner" ? "bg-green-600" : 
                        tutorial.level === "Intermediate" ? "bg-yellow-600" : "bg-red-600"
                      }`}>
                        {tutorial.level}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/tutorials" className="block w-full text-center py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors">
                Browse All Tutorials
              </Link>
            </div>
          </div>
          
          {/* Creator Roadmap */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 py-3 px-4">
              <h3 className="font-bold text-white text-xl">From Beginner to Pro</h3>
            </div>
            <div className="p-4">
              <div className="relative pl-8 pb-8">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-pink-500 to-purple-500"></div>
                
                {/* Journey steps */}
                {creatorJourney.map((journey, index) => (
                  <div key={journey.step} className="mb-6 relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-8 -mt-1 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                      <span className="text-sm">{journey.icon}</span>
                    </div>
                    
                    <div className="bg-gray-900 rounded-lg p-3 ml-4">
                      <h4 className="text-white font-medium flex items-center">
                        <span className="bg-pink-600 text-white text-xs px-2 py-0.5 rounded mr-2">
                          Step {journey.step}
                        </span>
                        {journey.title}
                      </h4>
                      <p className="text-gray-400 text-sm mt-1">{journey.description}</p>
                    </div>
                    
                    {/* Connector arrow except for last item */}
                    {index < creatorJourney.length - 1 && (
                      <div className="absolute -left-1 bottom-0 transform translate-y-1/2 text-pink-500">
                        ↓
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Link href="/creator-journey" className="block w-full text-center py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-colors">
                Start Your Journey
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationHub;