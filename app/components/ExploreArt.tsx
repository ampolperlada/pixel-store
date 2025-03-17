// app/src/components/ExploreArt.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const ExploreArt = () => {
  const [artworks, setArtworks] = useState([
    {
      id: 1,
      title: 'Cyber City',
      artist: 'PixelMaster',
      price: '0.5 ETH',
      rarity: 'Epic',
      image: '/art1.jpg',
      likes: 120,
      views: 450,
      comments: [],
      isOnSale: true,
      isAuction: false,
      category: 'New Arrivals',
      collection: 'Cyberpunk Collection',
    },
    {
      id: 2,
      title: 'Fantasy Castle',
      artist: 'ArtWizard',
      price: '1.2 ETH',
      rarity: 'Legendary',
      image: '/art2.jpg',
      likes: 95,
      views: 320,
      comments: [],
      isOnSale: false,
      isAuction: true,
      category: 'Top Sellers',
      collection: 'Fantasy Heroes',
    },
    // Add more artworks
  ]);

  const [filters, setFilters] = useState({
    category: 'All',
    priceRange: 'All',
    collection: 'All',
  });

  const [commentInput, setCommentInput] = useState('');

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
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

  const filteredArtworks = artworks.filter((artwork) => {
    return (
      (filters.category === 'All' || artwork.category === filters.category) &&
      (filters.priceRange === 'All' || artwork.price === filters.priceRange) &&
      (filters.collection === 'All' || artwork.collection === filters.collection)
    );
  });

  const artists = [
    {
      id: 1,
      name: 'PixelMaster',
      bio: 'Digital artist specializing in cyberpunk themes.',
      avatar: '/artist1.jpg',
      portfolioLink: '/artists/pixelmaster',
    },
    {
      id: 2,
      name: 'ArtWizard',
      bio: 'Master of fantasy and surreal art.',
      avatar: '/artist2.jpg',
      portfolioLink: '/artists/artwizard',
    },
    // Add more artists
  ];

  return (
    <div className="min-h-screen bg-darkBg text-textColor p-8">
      <h1 className="text-4xl font-bold mb-8">Explore Art</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="bg-cardBg p-2 rounded"
        >
          <option value="All">All Categories</option>
          <option value="New Arrivals">New Arrivals</option>
          <option value="Top Sellers">Top Sellers</option>
          <option value="On Sale">On Sale</option>
        </select>

        <select
          name="priceRange"
          value={filters.priceRange}
          onChange={handleFilterChange}
          className="bg-cardBg p-2 rounded"
        >
          <option value="All">All Prices</option>
          <option value="Under $100">Under $100</option>
          <option value="$100 - $500">$100 - $500</option>
          <option value="$500 - $1000">$500 - $1000</option>
          <option value="$1000+">$1000+</option>
        </select>

        <select
          name="collection"
          value={filters.collection}
          onChange={handleFilterChange}
          className="bg-cardBg p-2 rounded"
        >
          <option value="All">All Collections</option>
          <option value="Cyberpunk Collection">Cyberpunk Collection</option>
          <option value="Fantasy Heroes">Fantasy Heroes</option>
          <option value="Space Explorers">Space Explorers</option>
        </select>
      </div>

      {/* Artwork Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredArtworks.map((artwork) => (
          <div key={artwork.id} className="bg-cardBg rounded-lg overflow-hidden">
            <div className="relative h-64">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-purple-600 px-2 py-1 rounded text-sm">
                {artwork.rarity}
              </div>
              {artwork.isOnSale && (
                <div className="absolute top-2 left-2 bg-pink-600 px-2 py-1 rounded text-sm">
                  On Sale
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold">{artwork.title}</h2>
              <p className="text-textSecondary">{artwork.artist}</p>
              <p className="text-accent text-lg font-bold">{artwork.price}</p>
              <div className="flex gap-2 mt-4">
                <button className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700">
                  Add to Cart
                </button>
                <button className="bg-pink-600 px-4 py-2 rounded hover:bg-pink-700">
                  Wishlist
                </button>
                {artwork.isAuction && (
                  <button className="bg-cyan-600 px-4 py-2 rounded hover:bg-cyan-700">
                    Bid
                  </button>
                )}
              </div>

              {/* Comments Section */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Comments</h3>
                <div className="space-y-2">
                  {artwork.comments.map((comment, index) => (
                    <div key={index} className="bg-darkBg/50 p-2 rounded">
                      <p>{comment}</p>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-cardBg p-2 rounded mt-2"
                />
                <button
                  onClick={() => handleAddComment(artwork.id)}
                  className="bg-cyan-600 px-4 py-2 rounded hover:bg-cyan-700 mt-2"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Auction System */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Live Auctions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks
            .filter((artwork) => artwork.isAuction)
            .map((artwork) => (
              <div key={artwork.id} className="bg-cardBg rounded-lg overflow-hidden">
                <div className="relative h-64">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-darkBg/80 px-2 py-1 rounded text-sm">
                    Ends in: 2h 30m
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{artwork.title}</h2>
                  <p className="text-textSecondary">{artwork.artist}</p>
                  <p className="text-accent text-lg font-bold">{artwork.price}</p>
                  <button className="bg-cyan-600 px-4 py-2 rounded hover:bg-cyan-700 mt-4">
                    Place Bid
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Community Favorites */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Community Favorites</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks
            .filter((artwork) => artwork.likes > 100)
            .map((artwork) => (
              <div key={artwork.id} className="bg-cardBg rounded-lg overflow-hidden">
                <div className="relative h-64">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-purple-600 px-2 py-1 rounded text-sm">
                    🔥 {artwork.likes}
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{artwork.title}</h2>
                  <p className="text-textSecondary">{artwork.artist}</p>
                  <p className="text-accent text-lg font-bold">{artwork.price}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Artist Spotlight */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Artist Spotlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <div key={artist.id} className="bg-cardBg rounded-lg p-4">
              <div className="flex items-center gap-4">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold">{artist.name}</h3>
                  <p className="text-textSecondary">{artist.bio}</p>
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
  );
};

export default ExploreArt;