import React from 'react';
import Image from 'next/image';

const communityData = {
  challenges: [
    {
      id: 1,
      title: "Cyberpunk Characters",
      image: "/challenges/cyberpunk.png",
      entries: 124,
      daysLeft: 3,
      currentWinner: "NeonPixel"
    },
    {
      id: 2,
      title: "Fantasy Landscapes",
      image: "/challenges/fantasy.png",
      entries: 96,
      daysLeft: 5,
      currentWinner: "PixelWorld"
    }
  ],
  collaborations: [
    {
      id: 1,
      title: "Mega Dungeon Tileset",
      contributors: 17,
      image: "/collabs/dungeon.png",
      progress: 85
    },
    {
      id: 2,
      title: "Sci-Fi Character Pack",
      contributors: 12,
      image: "/collabs/scifi.png",
      progress: 60
    }
  ],
  collections: [
    {
      id: 1,
      title: "Retro Game Icons",
      curator: "VintageGamer",
      items: 46,
      images: [
        "/collections/retro1.png",
        "/collections/retro2.png",
        "/collections/retro3.png",
        "/collections/retro4.png",
        "/collections/retro5.png",
        "/collections/retro6.png"
      ]
    },
    {
      id: 2,
      title: "Magical Props & Items",
      curator: "WizardWare",
      items: 32,
      images: [
        "/collections/magic1.png",
        "/collections/magic2.png",
        "/collections/magic3.png",
        "/collections/magic4.png",
        "/collections/magic5.png",
        "/collections/magic6.png"
      ]
    }
  ]
};

const CommunityHighlights = () => {
  return (
    <section className="py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Community Highlights</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Challenges */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 py-3 px-4">
              <h3 className="font-bold text-white text-xl">Active Challenges</h3>
            </div>
            <div className="p-4 space-y-4">
              {communityData.challenges.map(challenge => (
                <div key={challenge.id} className="bg-gray-900 rounded-lg p-3 hover:bg-gray-700 transition-colors">
                  <div className="aspect-w-16 aspect-h-9 mb-3">
                    <div className="w-full h-32 bg-gradient-to-br from-purple-400 to-indigo-600 rounded flex items-center justify-center">
                      <p className="text-white font-bold">{challenge.title}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-medium">{challenge.title}</h4>
                      <p className="text-cyan-300 text-sm">{challenge.entries} entries</p>
                    </div>
                    <div className="bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded">
                      {challenge.daysLeft}d left
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-colors">
                View All Challenges
              </button>
            </div>
          </div>
          
          {/* Collaborative Projects */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 py-3 px-4">
              <h3 className="font-bold text-white text-xl">Collaborative Projects</h3>
            </div>
            <div className="p-4 space-y-4">
              {communityData.collaborations.map(collab => (
                <div key={collab.id} className="bg-gray-900 rounded-lg p-3 hover:bg-gray-700 transition-colors">
                  <div className="flex mb-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-600 rounded flex-shrink-0 flex items-center justify-center">
                      <span className="text-white font-bold">Collab</span>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-white font-medium">{collab.title}</h4>
                      <p className="text-cyan-300 text-sm">{collab.contributors} contributors</p>
                      <div className="mt-2 h-2 bg-gray-700 rounded-full">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                          style={{ width: `${collab.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-right text-xs text-gray-400 mt-1">{collab.progress}% complete</p>
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-colors">
                Join a Collaboration
              </button>
            </div>
          </div>
          
          {/* User Collections */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 py-3 px-4">
              <h3 className="font-bold text-white text-xl">Curated Collections</h3>
            </div>
            <div className="p-4 space-y-4">
              {communityData.collections.map(collection => (
                <div key={collection.id} className="bg-gray-900 rounded-lg p-3 hover:bg-gray-700 transition-colors">
                  <div className="grid grid-cols-3 gap-1 mb-2">
                    {collection.images.map((image, i) => (
                      <div key={i} className="aspect-square relative rounded-sm overflow-hidden">
                        <Image
                          src={image}
                          alt={`${collection.title} item ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{collection.title}</h4>
                    <div className="flex justify-between">
                      <p className="text-cyan-300 text-sm">By {collection.curator}</p>
                      <p className="text-gray-400 text-sm">{collection.items} items</p>
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-colors">
                Browse Collections
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityHighlights;