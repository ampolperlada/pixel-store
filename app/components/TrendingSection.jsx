import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const TrendingSection = () => {
  const [activeTab, setActiveTab] = useState('collections');
  const [activePeriod, setActivePeriod] = useState('1d');
  const [trendingCollections, setTrendingCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    // Create the socket connection directly, no need for dynamic import
    const socketInstance = io(API_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    setSocket(socketInstance);
    
    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Setup socket event listeners once socket is initialized
  useEffect(() => {
    if (!socket) return;
    
    // Initial subscription
    socket.emit('subscribe', activePeriod);
    
    // Listen for real-time updates
    socket.on('trendingUpdate', (data) => {
      setTrendingCollections(data);
      setLoading(false);
    });
    
    // Listen for connection errors
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      // Fallback to REST API if socket fails
      fetchTrendingData();
    });
    
    return () => {
      socket.off('trendingUpdate');
      socket.off('connect_error');
    };
  }, [socket]);

  // Handle period changes
  useEffect(() => {
    if (socket && socket.connected) {
      // Update subscription
      socket.emit('subscribe', activePeriod);
    }
    
    // Fetch new data regardless of socket state
    fetchTrendingData();
  }, [activePeriod, socket]);

  // Fetch data from API
  const fetchTrendingData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/collections/trending?period=${activePeriod}`);
      if (response.data && Array.isArray(response.data)) {
        setTrendingCollections(response.data);
      }
    } catch (error) {
      console.error('Error fetching trending data:', error);
    } finally {
      setLoading(false);
    }
  };

  // List of available time periods
  const timePeriods = [
    { id: '1h', label: '1H' },
    { id: '1d', label: '1D' },
    { id: '7d', label: '7D' },
    { id: '30d', label: '30D' }
  ];

  // Chain filters
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
              {/* Placeholder for chain icons */}
              <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs">
                {chain.id.charAt(0).toUpperCase()}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF3BC9]"></div>
        </div>
      )}

      {/* Table Content */}
      {!loading && trendingCollections.length > 0 && (
        <>
          {/* Table Header */}
          <div className="grid grid-cols-8 gap-2 py-4 border-b border-[#252836]">
            <div className="text-sm text-[#8A8AA0] font-medium">#</div>
            <div className="text-sm text-[#8A8AA0] font-medium col-span-2">COLLECTION</div>
            <div className="text-sm text-[#8A8AA0] font-medium">FLOOR PRICE</div>
            <div className="text-sm text-[#8A8AA0] font-medium">FLOOR CHANGE</div>
            <div className="text-sm text-[#8A8AA0] font-medium">VOLUME</div>
            <div className="text-sm text-[#8A8AA0] font-medium">VOLUME CHANGE</div>
            <div className="text-sm text-[#8A8AA0] font-medium">ITEMS</div>
          </div>

          {/* Table Rows */}
          {trendingCollections.map((collection, index) => (
            <div
              key={collection.id}
              className="grid grid-cols-8 gap-2 py-5 border-b border-[#252836] hover:bg-[#1A1C2A] transition-colors items-center"
            >
              <div className="text-base font-semibold">{index + 1}</div>
              <div className="flex items-center col-span-2">
                <div className="w-10 h-10 bg-gray-600 rounded-lg mr-4 relative overflow-hidden">
                  {/* Placeholder for collection image */}
                  <div className="w-10 h-10 flex items-center justify-center text-xs">
                    {collection.name?.charAt(0) || 'C'}
                  </div>
                </div>
                <span className="text-base font-semibold truncate max-w-xs">{collection.name}</span>
                {collection.isVerified && (
                  <div className="w-4 h-4 ml-1 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
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
            </div>
          ))}
        </>
      )}

      {/* Empty State */}
      {!loading && trendingCollections.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-xl font-semibold text-[#8A8AA0] mb-4">No trending collections found</div>
          <p className="text-sm text-[#8A8AA0]">Try changing the time period or check back later</p>
        </div>
      )}
    </div>
  );
};

export default TrendingSection;