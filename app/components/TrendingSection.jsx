// TrendingSection.jsx
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const TrendingSection = () => {
  const [activeTab, setActiveTab] = useState('collections');
  const [activePeriod, setActivePeriod] = useState('1d');

  // Sample data - in a real app, you would fetch this from an API
  const trendingCollections = [
    {
      id: 1,
      name: 'Pixel Warriors',
      isVerified: true,
      image: '/images/pixel-warriors.png', // Replace with your actual image path
      floorPrice: 0.082,
      floorChange: -5.2,
      volume: 42.6,
      volumeChange: 126.8,
      items: '10K',
      owners: '4.7K'
    },
    {
      id: 2,
      name: 'Cryptic Pixels',
      isVerified: true,
      image: '/images/cryptic-pixels.png',
      floorPrice: 0.042,
      floorChange: 12.3,
      volume: 28.4,
      volumeChange: 84.2,
      items: '5.6K',
      owners: '2.8K'
    },
    {
      id: 3,
      name: '8Bit Heroes',
      isVerified: true,
      image: '/images/8bit-heroes.png',
      floorPrice: 0.075,
      floorChange: -2.4,
      volume: 15.3,
      volumeChange: -8.6,
      items: '8K',
      owners: '3.9K'
    },
    {
      id: 4,
      name: 'Voxel Legends',
      isVerified: true,
      image: '/images/voxel-legends.png',
      floorPrice: 0.018,
      floorChange: 32.5,
      volume: 9.7,
      volumeChange: 218.4,
      items: '12K',
      owners: '5.2K'
    }
  ];

  // List of available time periods
  const timePeriods = [
    { id: '1h', label: '1H' },
    { id: '1d', label: '1D' },
    { id: '7d', label: '7D' },
    { id: '30d', label: '30D' }
  ];

  // Chain filters - you would customize these based on your supported chains
  const chainFilters = [
    { id: 'all', icon: '/images/all-chains.png', label: 'All chains' },
    { id: 'eth', icon: '/images/eth.png', label: 'Ethereum' },
    { id: 'polygon', icon: '/images/polygon.png', label: 'Polygon' }
  ];

  return (
    <div className="bg-[#0D0F18] text-white font-inter p-5 rounded-xl w-full">
      {/* Trending Header with Tabs */}
      <div className="flex items-center mb-8 border-b border-[#252836]">
        <h2 className="text-2xl font-bold mr-10">Trending</h2>
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('collections')}
            className={`text-base font-semibold pb-4 ${
              activeTab === 'collections'
                ? 'border-b-3 border-[#FF3BC9] text-white'
                : 'text-[#8A8AA0]'
            }`}
          >
            Collections
          </button>
          <button
            onClick={() => setActiveTab('marketplaces')}
            className={`text-base font-semibold pb-4 ${
              activeTab === 'marketplaces'
                ? 'border-b-3 border-[#FF3BC9] text-white'
                : 'text-[#8A8AA0]'
            }`}
          >
            Marketplaces
          </button>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="flex gap-3 mb-5">
        {timePeriods.map((period) => (
          <button
            key={period.id}
            onClick={() => setActivePeriod(period.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium ${
              activePeriod === period.id ? 'bg-[#FF3BC9]' : 'bg-[#191B29]'
            } text-white`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Chain Filter */}
      <div className="flex gap-3 mb-8">
        {chainFilters.map((chain) => (
          <button
            key={chain.id}
            className="bg-[#191B29] p-2 rounded-full flex items-center"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden relative">
              {/* Replace with actual Image component when you have images */}
              <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
              {/* With real images:
              <Image 
                src={chain.icon} 
                alt={chain.label} 
                width={24} 
                height={24}
                className="rounded-full"
              /> */}
            </div>
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-8 gap-2 py-4 border-b border-[#252836]">
        <div className="text-sm text-[#8A8AA0] font-medium">#</div>
        <div className="text-sm text-[#8A8AA0] font-medium col-span-2">COLLECTION</div>
        <div className="text-sm text-[#8A8AA0] font-medium">FLOOR PRICE</div>
        <div className="text-sm text-[#8A8AA0] font-medium">FLOOR CHANGE</div>
        <div className="text-sm text-[#8A8AA0] font-medium">VOLUME</div>
        <div className="text-sm text-[#8A8AA0] font-medium">VOLUME CHANGE</div>
        <div className="text-sm text-[#8A8AA0] font-medium">ITEMS</div>
        <div className="text-sm text-[#8A8AA0] font-medium">OWNERS</div>
      </div>

      {/* Table Rows */}
      {trendingCollections.map((collection) => (
        <div
          key={collection.id}
          className="grid grid-cols-8 gap-2 py-5 border-b border-[#252836] items-center"
        >
          <div className="text-base font-semibold">{collection.id}</div>
          <div className="flex items-center col-span-2">
            <div className="w-10 h-10 bg-gray-600 rounded-lg mr-4 relative overflow-hidden">
              {/* Replace with actual Image component when you have images */}
              {/* <Image 
                src={collection.image} 
                alt={collection.name} 
                layout="fill" 
                objectFit="cover" 
                className="rounded-lg"
              /> */}
            </div>
            <span className="text-base font-semibold">{collection.name}</span>
            {collection.isVerified && (
              <div className="w-4 h-4 ml-1 bg-blue-500 rounded-full"></div>
            )}
          </div>
          <div className="text-base font-semibold">{collection.floorPrice} ETH</div>
          <div className={`text-base font-semibold ${collection.floorChange >= 0 ? 'text-[#00E096]' : 'text-[#FF3D71]'}`}>
            {collection.floorChange >= 0 ? '+' : ''}{collection.floorChange}%
          </div>
          <div className="text-base font-semibold">{collection.volume} ETH</div>
          <div className={`text-base font-semibold ${collection.volumeChange >= 0 ? 'text-[#00E096]' : 'text-[#FF3D71]'}`}>
            {collection.volumeChange >= 0 ? '+' : ''}{collection.volumeChange}%
          </div>
          <div className="text-base font-semibold">{collection.items}</div>
          <div className="text-base font-semibold">{collection.owners}</div>
        </div>
      ))}
    </div>
  );
};

export default TrendingSection;