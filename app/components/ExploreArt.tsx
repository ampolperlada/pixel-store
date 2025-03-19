'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const ExploreArt = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [artworks, setArtworks] = useState([
    {
      id: 1,
      title: 'Soqzal',
      artist: 'PixelMaster',
      price: '0.5 ETH',
      rarity: 'Epic',
      image: 'images/Bug Ninja.png',
      likes: 120,
      views: 450,
      comments: [] as string[],
      isOnSale: true,
      isAuction: false,
      category: 'New Arrivals',
      collection: 'Cyberpunk Collection',
      origin: 'Cyber City', // Added origin field
    },
    {
      id: 2,
      title: 'Chiu',
      artist: 'ArtWizard',
      price: '1.2 ETH',
      rarity: 'Legendary',
      image: '/images/Chiu.png',
      likes: 95,
      views: 320,
      comments: [],
      isOnSale: false,
      isAuction: true,
      category: 'Top Sellers',
      collection: 'Fantasy Heroes',
      origin: 'Pixel Wasteland', // Added origin field
    },
    {
      id: 3,
      title: 'Ryuski',
      artist: 'PixelMaster',
      price: '0.75 ETH',
      rarity: 'Rare',
      image: '/images/Ryuski.png',
      likes: 85,
      views: 290,
      comments: [],
      isOnSale: true,
      isAuction: false,
      category: 'On Sale',
      collection: 'Cyberpunk Collection',
      origin: 'Mystic Pixel Isles', // Added origin field
    },
    {
      id: 4,
      title: 'Rian',
      artist: 'ArtWizard',
      price: '0.9 ETH',
      rarity: 'Epic',
      image: '/images/CubeHead Girl.png',
      likes: 110,
      views: 380,
      comments: [],
      isOnSale: false,
      isAuction: true,
      category: 'New Arrivals',
      collection: 'Fantasy Heroes',
      origin: 'Eldoria', // Added origin field
    },
    
  
    // Add more artworks
  ]);

  const [filters, setFilters] = useState({
    category: 'All',
    priceRange: 'All',
    collection: 'All',
    origin: 'All', // Added origin filter
  });

  const [commentInput, setCommentInput] = useState('');
  const [activeCommentCard, setActiveCommentCard] = useState<number | null>(null);

  // Simulate loading data
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleLike = (artworkId: number) => {
    setArtworks((prev) =>
      prev.map((artwork) =>
        artwork.id === artworkId
          ? {
              ...artwork,
              likes: artwork.likes + 1,
            }
          : artwork
      )
    );
  };

  const handleAddComment = (artworkId: number) => {
    if (commentInput.trim()) {
      setArtworks((prev) =>
        prev.map((artwork) =>
          artwork.id === artworkId
            ? {
                ...artwork,
                comments: [...artwork.comments, commentInput],
              }
            : artwork
        )
      );
      setCommentInput('');
    }
  };

  const toggleCommentSection = (artworkId: number) => {
    setActiveCommentCard(activeCommentCard === artworkId ? null : artworkId);
  };

  const filteredArtworks = artworks.filter((artwork) => {
    return (
      (filters.category === 'All' || artwork.category === filters.category) &&
      (filters.priceRange === 'All' || artwork.price === filters.priceRange) &&
      (filters.collection === 'All' || artwork.collection === filters.collection) &&
      (filters.origin === 'All' || artwork.origin === filters.origin) // Added origin filter
    );
  });

  // Get unique origin values for the filter
  const originOptions = ['All', ...new Set(artworks.map(artwork => artwork.origin))];

  const artists = [
    {
      id: 1,
      name: 'Zumi',
      bio: 'Digital artist specializing in cyberpunk themes.',
      avatar: '/images/Killua.png',
      portfolioLink: '/artists/pixelmaster',
    },
    {
      id: 2,
      name: 'Ampoloppa',
      bio: 'Master of fantasy and surreal art.',
      avatar: '/images/Sunraku.png',
      portfolioLink: '/artists/artwizard',
    },
    // Add more artists
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Explore Art
        </h1>

        {/* Enhanced Filters */}
        <div className="bg-gray-800 rounded-lg p-4 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Collection</h2>
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium mb-1 text-gray-400">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 border border-gray-600 text-white p-2 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="All">All Categories</option>
                <option value="New Arrivals">New Arrivals</option>
                <option value="Top Sellers">Top Sellers</option>
                <option value="On Sale">On Sale</option>
              </select>
            </div>

            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium mb-1 text-gray-400">Price Range</label>
              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 border border-gray-600 text-white p-2 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="All">All Prices</option>
                <option value="Under $100">Under $100</option>
                <option value="$100 - $500">$100 - $500</option>
                <option value="$500 - $1000">$500 - $1000</option>
                <option value="$1000+">$1000+</option>
              </select>
            </div>

            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium mb-1 text-gray-400">Collection</label>
              <select
                name="collection"
                value={filters.collection}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 border border-gray-600 text-white p-2 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="All">All Collections</option>
                <option value="Cyberpunk Collection">Cyberpunk Collection</option>
                <option value="Fantasy Heroes">Fantasy Heroes</option>
                <option value="Space Explorers">Space Explorers</option>
              </select>
            </div>

            {/* Added Origin Filter */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium mb-1 text-gray-400">Origin</label>
              <select
                name="origin"
                value={filters.origin}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 border border-gray-600 text-white p-2 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {originOptions.map(origin => (
                  <option key={origin} value={origin}>{origin}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
{/* Origin Categories Section */}
<div className="mb-12">
  <h2 className="text-2xl font-bold mb-6 text-purple-400">Browse by Origin</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {[
      { name: 'Cyber City', image: '/images/Cyber City.png', color: 'from-blue-500 to-purple-600' },
      { name: 'Pixel Wasteland', image: '/images/Wasteland.png', color: 'from-red-500 to-orange-600' },
      { name: 'Eldoria', image: '/images/Eldoria.png', color: 'from-green-500 to-teal-600' },
      { name: 'Mystic Pixel Isles', image: '/images/Mystic Island.png', color: 'from-indigo-500 to-purple-600' }
    ].map(({ name, image, color }) => (
      <div 
        key={name}
        onClick={() => setFilters({ ...filters, origin: name })}
        className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 border border-gray-700 hover:border-purple-500/50"
      >
        <div className="h-32 relative">
          {/* Gradient Background as Fallback */}
          <div className={`absolute inset-0 bg-gradient-to-br ${color}`}></div>
          
          {/* Image Section (with error handling) */}
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover opacity-70"
            onError={(e) => {
              // Hide the broken image
              e.currentTarget.style.display = 'none';
            }}
          />
          
          {/* Overlay Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white">{name}</h3>
            <p className="text-sm text-gray-300">
              {artworks.filter(art => art.origin === name).length} artworks
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


        {/* Artwork Grid with loading state */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Artworks</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-10 bg-gray-700 rounded flex-1"></div>
                      <div className="h-10 bg-gray-700 rounded flex-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArtworks.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-xl text-gray-400">No artworks match your current filters</p>
                  <button
                    onClick={() => setFilters({ category: 'All', priceRange: 'All', collection: 'All', origin: 'All' })}
                    className="mt-4 bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                filteredArtworks.map((artwork) => (
                  <div
                    key={artwork.id}
                    className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/50"
                  >
                    <div className="relative h-64 group">
                      <img
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-2 right-2 bg-purple-600 px-2 py-1 rounded text-sm font-medium">
                        {artwork.rarity}
                      </div>
                      {artwork.isOnSale && (
                        <div className="absolute top-2 left-2 bg-pink-600 px-2 py-1 rounded text-sm font-medium">
                          On Sale
                        </div>
                      )}
                      {/* Added Origin Badge */}
                      <div className="absolute bottom-2 left-2 bg-indigo-600 px-2 py-1 rounded text-sm font-medium">
                        {artwork.origin}
                      </div>
                      <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handleLike(artwork.id)}
                          className="bg-gray-800/80 p-2 rounded-full hover:bg-pink-600 transition-colors"
                        >
                          ♥ {artwork.likes}
                        </button>
                        <button
                          onClick={() => toggleCommentSection(artwork.id)}
                          className="bg-gray-800/80 p-2 rounded-full hover:bg-blue-600 transition-colors"
                        >
                          💬 {artwork.comments.length}
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h2 className="text-xl font-semibold">{artwork.title}</h2>
                      <p className="text-gray-400">by {artwork.artist}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-purple-400 text-lg font-bold">{artwork.price}</p>
                        <span className="text-gray-400 text-sm">{artwork.views} views</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition-colors flex-1 text-center">
                          Add to Cart
                        </button>
                        <button className="bg-pink-600 px-4 py-2 rounded hover:bg-pink-700 transition-colors flex-1 text-center">
                          Wishlist
                        </button>
                        {artwork.isAuction && (
                          <button className="bg-cyan-600 px-4 py-2 rounded hover:bg-cyan-700 transition-colors flex-1 text-center">
                            Bid
                          </button>
                        )}
                      </div>

                      {/* Enhanced Comments Section */}
                      {activeCommentCard === artwork.id && (
                        <div className="mt-6 border-t border-gray-700 pt-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <span>Comments</span>
                            <span className="text-sm bg-gray-700 px-2 py-1 rounded">
                              {artwork.comments.length}
                            </span>
                          </h3>
                          <div className="max-h-60 overflow-y-auto space-y-2 my-2">
                            {artwork.comments.length === 0 ? (
                              <p className="text-gray-500 text-sm italic">Be the first to comment!</p>
                            ) : (
                              artwork.comments.map((comment, index) => (
                                <div key={index} className="bg-gray-700 p-3 rounded">
                                  <p className="text-sm">{comment}</p>
                                </div>
                              ))
                            )}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <input
                              type="text"
                              value={commentInput}
                              onChange={(e) => setCommentInput(e.target.value)}
                              placeholder="Add a comment..."
                              className="flex-1 bg-gray-700 p-2 rounded border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <button
                              onClick={() => handleAddComment(artwork.id)}
                              className="bg-cyan-600 px-4 py-2 rounded hover:bg-cyan-700 transition-colors whitespace-nowrap"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Enhanced Auction System */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Live Auctions
            </span>
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map((n) => (
                <div key={n} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
                    <div className="h-10 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks
                .filter((artwork) => artwork.isAuction)
                .map((artwork) => (
                  <div
                    key={artwork.id}
                    className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-500/50"
                  >
                    <div className="relative h-64">
                      <img
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-darkBg/80 px-2 py-1 rounded text-sm">
                        Ends in: 2h 30m
                      </div>
                      {/* Added Origin Badge */}
                      <div className="absolute top-2 left-2 bg-indigo-600 px-2 py-1 rounded text-sm font-medium">
                        {artwork.origin}
                      </div>
                    </div>
                    <div className="p-4">
                      <h2 className="text-xl font-semibold">{artwork.title}</h2>
                      <p className="text-gray-400">by {artwork.artist}</p>
                      <p className="text-cyan-400 text-lg font-bold">{artwork.price}</p>
                      <button className="bg-cyan-600 px-4 py-2 rounded hover:bg-cyan-700 mt-4 w-full">
                        Place Bid
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

      {/* Artist Spotlight */}
<div className="mb-12">
  <h2 className="text-3xl font-bold mb-6">
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
      Artist Spotlights
    </span>
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {artists.map((artist) => (
      <div key={artist.id} className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-4">
          {/* Artist Image */}
          <img
            src={artist.avatar}
            alt={artist.name}
            className="w-16 h-16 rounded-full"
            onError={(e) => { (e.target as HTMLImageElement).src = ""; }} // Fallback
          />
          <div>
            <h3 className="text-xl font-semibold">{artist.name}</h3>
            <p className="text-gray-400">{artist.bio}</p>
          </div>
        </div>
        <Link
          href={artist.portfolioLink}
          className="text-cyan-500 hover:text-cyan-400 mt-2 block"
        >
          View Portfolio
        </Link>
      </div>
    ))}
  </div>
</div>

      </div>
    </div>
  );
};

export default ExploreArt;