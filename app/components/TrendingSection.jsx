import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  Star, 
  Eye, 
  Heart, 
  Share2, 
  BarChart3,
  Zap,
  Award,
  Users,
  Clock,
  Bookmark,
  ExternalLink,
  RefreshCw,
  Grid,
  List,
  ChevronDown,
  Volume2,
  VolumeX
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const TrendingSection = () => {
  const [activeTab, setActiveTab] = useState('collections');
  const [activePeriod, setActivePeriod] = useState('1d');
  const [activeChain, setActiveChain] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [sortBy, setSortBy] = useState('volume');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [watchlist, setWatchlist] = useState(new Set());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [trendingCollections, setTrendingCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Mock data for demonstration
  const mockCollections = [
    {
      id: 1,
      name: 'Pixel Warriors',
      floorPrice: 2.5,
      floorChange: 15.2,
      volume: 145.8,
      volumeChange: 23.4,
      items: 8888,
      owners: 3245,
      isVerified: true,
      isHot: true,
      category: 'gaming',
      chain: 'eth',
      sales24h: 156,
      avgPrice: 3.2,
      marketCap: 22240,
      rarity: 85
    },
    {
      id: 2,
      name: 'Retro Avatars',
      floorPrice: 1.8,
      floorChange: -5.7,
      volume: 89.2,
      volumeChange: -12.1,
      items: 5000,
      owners: 2100,
      isVerified: true,
      isHot: false,
      category: 'art',
      chain: 'polygon',
      sales24h: 89,
      avgPrice: 2.1,
      marketCap: 9000,
      rarity: 72
    },
    {
      id: 3,
      name: 'Cyber Punks',
      floorPrice: 4.2,
      floorChange: 8.9,
      volume: 234.5,
      volumeChange: 45.2,
      items: 10000,
      owners: 4500,
      isVerified: true,
      isHot: true,
      category: 'pfp',
      chain: 'eth',
      sales24h: 203,
      avgPrice: 5.1,
      marketCap: 42000,
      rarity: 91
    }
  ];

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setTrendingCollections(mockCollections);
      setLoading(false);
      setLastUpdate(new Date());
    }, 1000);
    return () => clearTimeout(timer);
  }, [activePeriod, activeChain]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate minor data changes
      setTrendingCollections(prev => prev.map(item => ({
        ...item,
        floorChange: item.floorChange + (Math.random() - 0.5) * 2,
        volumeChange: item.volumeChange + (Math.random() - 0.5) * 3
      })));
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Filter and sort collections
  const filteredAndSortedCollections = useMemo(() => {
    let filtered = trendingCollections.filter(collection => {
      const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChain = activeChain === 'all' || collection.chain === activeChain;
      return matchesSearch && matchesChain;
    });

    // Sort collections
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [trendingCollections, searchQuery, activeChain, sortBy, sortOrder]);

  const handleFavorite = (collectionId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(collectionId)) {
        newFavorites.delete(collectionId);
      } else {
        newFavorites.add(collectionId);
      }
      return newFavorites;
    });
  };

  const handleWatchlist = (collectionId) => {
    setWatchlist(prev => {
      const newWatchlist = new Set(prev);
      if (newWatchlist.has(collectionId)) {
        newWatchlist.delete(collectionId);
      } else {
        newWatchlist.add(collectionId);
      }
      return newWatchlist;
    });
  };

  const timePeriods = [
    { id: '1h', label: '1H' },
    { id: '1d', label: '1D' },
    { id: '7d', label: '7D' },
    { id: '30d', label: '30D' }
  ];

  const chainFilters = [
    { id: 'all', icon: '🌐', label: 'All chains' },
    { id: 'eth', icon: '⟠', label: 'Ethereum' },
    { id: 'polygon', icon: '⬟', label: 'Polygon' },
    { id: 'sol', icon: '◎', label: 'Solana' }
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'art', label: 'Art' },
    { id: 'pfp', label: 'PFP' },
    { id: 'utility', label: 'Utility' }
  ];

  const CollectionCard = ({ collection, index }) => (
    <div className="bg-[#191B29] rounded-xl p-4 hover:bg-[#1F2332] transition-all duration-300 border border-[#252836] hover:border-[#FF3BC9]/30">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF3BC9] to-[#7C3AED] rounded-lg flex items-center justify-center text-white font-bold">
              {collection.name.charAt(0)}
            </div>
            {collection.isHot && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF3D71] rounded-full flex items-center justify-center">
                <Zap className="w-2 h-2 text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white truncate max-w-32">{collection.name}</h3>
              {collection.isVerified && (
                <Award className="w-4 h-4 text-blue-400" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-[#8A8AA0]">
              <span>{chainFilters.find(c => c.id === collection.chain)?.icon}</span>
              <span>#{index + 1}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleFavorite(collection.id)}
            className={`p-1 rounded ${favorites.has(collection.id) ? 'text-[#FF3BC9]' : 'text-[#8A8AA0] hover:text-[#FF3BC9]'}`}
          >
            <Heart className="w-4 h-4" fill={favorites.has(collection.id) ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => handleWatchlist(collection.id)}
            className={`p-1 rounded ${watchlist.has(collection.id) ? 'text-[#00E096]' : 'text-[#8A8AA0] hover:text-[#00E096]'}`}
          >
            <Bookmark className="w-4 h-4" fill={watchlist.has(collection.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-xs text-[#8A8AA0] mb-1">Floor Price</div>
          <div className="font-semibold text-white">{collection.floorPrice} ETH</div>
          <div className={`text-xs flex items-center gap-1 ${collection.floorChange >= 0 ? 'text-[#00E096]' : 'text-[#FF3D71]'}`}>
            {collection.floorChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(collection.floorChange).toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-xs text-[#8A8AA0] mb-1">Volume</div>
          <div className="font-semibold text-white">{collection.volume} ETH</div>
          <div className={`text-xs flex items-center gap-1 ${collection.volumeChange >= 0 ? 'text-[#00E096]' : 'text-[#FF3D71]'}`}>
            {collection.volumeChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(collection.volumeChange).toFixed(1)}%
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-[#8A8AA0] mb-3">
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {collection.owners} owners
        </div>
        <div className="flex items-center gap-1">
          <BarChart3 className="w-3 h-3" />
          {collection.sales24h} sales
        </div>
      </div>
      
      <div className="flex gap-2">
        <button className="flex-1 bg-[#FF3BC9] hover:bg-[#FF3BC9]/80 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
          View Collection
        </button>
        <button className="p-2 bg-[#252836] hover:bg-[#2A2D3E] rounded-lg transition-colors">
          <ExternalLink className="w-4 h-4 text-[#8A8AA0]" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#0D0F18] text-white font-inter p-6 rounded-xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FF3BC9] to-[#7C3AED] bg-clip-text text-transparent">
            Trending Collections
          </h2>
          <div className="flex items-center gap-2 text-sm text-[#8A8AA0]">
            <Clock className="w-4 h-4" />
            {lastUpdate && `Updated ${lastUpdate.toLocaleTimeString()}`}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 rounded-lg transition-colors ${autoRefresh ? 'bg-[#00E096] text-black' : 'bg-[#252836] text-[#8A8AA0]'}`}
            title="Auto-refresh"
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition-colors ${soundEnabled ? 'bg-[#FF3BC9] text-white' : 'bg-[#252836] text-[#8A8AA0]'}`}
            title="Sound notifications"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <div className="flex bg-[#191B29] rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded ${viewMode === 'table' ? 'bg-[#FF3BC9] text-white' : 'text-[#8A8AA0]'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#FF3BC9] text-white' : 'text-[#8A8AA0]'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center mb-6 border-b border-[#252836]">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('collections')}
            className={`text-base font-semibold pb-4 flex items-center gap-2 ${
              activeTab === 'collections'
                ? 'border-b-3 border-[#FF3BC9] text-white'
                : 'text-[#8A8AA0] hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Collections
          </button>
          <button
            onClick={() => setActiveTab('marketplaces')}
            className={`text-base font-semibold pb-4 flex items-center gap-2 ${
              activeTab === 'marketplaces'
                ? 'border-b-3 border-[#FF3BC9] text-white'
                : 'text-[#8A8AA0] hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            Marketplaces
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8A8AA0]" />
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#191B29] border border-[#252836] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#8A8AA0] focus:border-[#FF3BC9] focus:outline-none"
          />
        </div>

        {/* Time Period */}
        <div className="flex gap-2">
          {timePeriods.map((period) => (
            <button
              key={period.id}
              onClick={() => setActivePeriod(period.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePeriod === period.id 
                  ? 'bg-[#FF3BC9] text-white' 
                  : 'bg-[#191B29] text-[#8A8AA0] hover:bg-[#252836]'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Chain Filter */}
        <div className="flex gap-2">
          {chainFilters.map((chain) => (
            <button
              key={chain.id}
              onClick={() => setActiveChain(chain.id)}
              className={`p-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                activeChain === chain.id 
                  ? 'bg-[#FF3BC9] text-white' 
                  : 'bg-[#191B29] text-[#8A8AA0] hover:bg-[#252836]'
              }`}
              title={chain.label}
            >
              <span className="text-lg">{chain.icon}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-[#191B29] hover:bg-[#252836] px-4 py-3 rounded-lg text-[#8A8AA0] transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filters
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-[#191B29] rounded-lg p-4 mb-6 border border-[#252836]">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm text-[#8A8AA0] mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#252836] border border-[#3A3D4E] rounded-lg px-3 py-2 text-white focus:border-[#FF3BC9] focus:outline-none"
              >
                <option value="volume">Volume</option>
                <option value="floorPrice">Floor Price</option>
                <option value="volumeChange">Volume Change</option>
                <option value="floorChange">Floor Change</option>
                <option value="items">Items</option>
                <option value="owners">Owners</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#8A8AA0] mb-2">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-[#252836] border border-[#3A3D4E] rounded-lg px-3 py-2 text-white focus:border-[#FF3BC9] focus:outline-none"
              >
                <option value="desc">Highest first</option>
                <option value="asc">Lowest first</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF3BC9] mb-4"></div>
          <p className="text-[#8A8AA0]">Loading trending collections...</p>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedCollections.map((collection, index) => (
                <CollectionCard key={collection.id} collection={collection} index={index} />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Table Header */}
              <div className="grid grid-cols-9 gap-4 py-4 border-b border-[#252836] text-sm text-[#8A8AA0] font-medium min-w-[800px]">
                <div>#</div>
                <div className="col-span-2">COLLECTION</div>
                <div>FLOOR PRICE</div>
                <div>FLOOR CHANGE</div>
                <div>VOLUME</div>
                <div>VOLUME CHANGE</div>
                <div>OWNERS</div>
                <div>ACTIONS</div>
              </div>

              {/* Table Rows */}
              {filteredAndSortedCollections.map((collection, index) => (
                <div
                  key={collection.id}
                  className="grid grid-cols-9 gap-4 py-4 border-b border-[#252836] hover:bg-[#1A1C2A] transition-colors items-center min-w-[800px]"
                >
                  <div className="font-semibold flex items-center gap-2">
                    {index + 1}
                    {collection.isHot && <Zap className="w-3 h-3 text-[#FF3D71]" />}
                  </div>
                  
                  <div className="flex items-center col-span-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FF3BC9] to-[#7C3AED] rounded-lg mr-3 flex items-center justify-center text-white font-bold">
                      {collection.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold truncate max-w-32">{collection.name}</span>
                        {collection.isVerified && <Award className="w-4 h-4 text-blue-400" />}
                      </div>
                      <div className="text-xs text-[#8A8AA0] flex items-center gap-1">
                        <span>{chainFilters.find(c => c.id === collection.chain)?.icon}</span>
                        <span>{collection.items} items</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="font-semibold">{collection.floorPrice} ETH</div>
                  
                  <div className={`font-semibold flex items-center gap-1 ${collection.floorChange >= 0 ? 'text-[#00E096]' : 'text-[#FF3D71]'}`}>
                    {collection.floorChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(collection.floorChange).toFixed(1)}%
                  </div>
                  
                  <div className="font-semibold">{collection.volume} ETH</div>
                  
                  <div className={`font-semibold flex items-center gap-1 ${collection.volumeChange >= 0 ? 'text-[#00E096]' : 'text-[#FF3D71]'}`}>
                    {collection.volumeChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(collection.volumeChange).toFixed(1)}%
                  </div>
                  
                  <div className="font-semibold">{collection.owners}</div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFavorite(collection.id)}
                      className={`p-1 rounded transition-colors ${favorites.has(collection.id) ? 'text-[#FF3BC9]' : 'text-[#8A8AA0] hover:text-[#FF3BC9]'}`}
                    >
                      <Heart className="w-4 h-4" fill={favorites.has(collection.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => handleWatchlist(collection.id)}
                      className={`p-1 rounded transition-colors ${watchlist.has(collection.id) ? 'text-[#00E096]' : 'text-[#8A8AA0] hover:text-[#00E096]'}`}
                    >
                      <Bookmark className="w-4 h-4" fill={watchlist.has(collection.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button className="p-1 rounded text-[#8A8AA0] hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && filteredAndSortedCollections.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <div className="text-xl font-semibold text-[#8A8AA0] mb-2">No collections found</div>
          <p className="text-sm text-[#8A8AA0] text-center max-w-md">
            {searchQuery ? `No results for "${searchQuery}". Try adjusting your search or filters.` : 'No trending collections available for the selected criteria.'}
          </p>
        </div>
      )}

      {/* Stats Footer */}
      {!loading && filteredAndSortedCollections.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[#252836] flex items-center justify-between text-sm text-[#8A8AA0]">
          <div>
            Showing {filteredAndSortedCollections.length} collections
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {favorites.size} favorites
            </div>
            <div className="flex items-center gap-1">
              <Bookmark className="w-4 h-4" />
              {watchlist.size} watchlisted
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingSection;