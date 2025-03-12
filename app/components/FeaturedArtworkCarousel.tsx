// FeaturedArtwork.tsx - Main component
import React, { useState, useEffect } from 'react';
import ArtworkCard from '../components/ArtworkCard';
import CollectionHighlight from '../components/CollectionHighlight';
import ArtworkPreview from '../components/ArtworkPreview';
import { featuredArt } from '../data/sampleData';
//import { Artwork, Collection } from '../types';
import './FeaturedArtwork.css';



type Artwork = {
  id: number;
  title: string;
  image: string;
  price?: string;
  artist: string;
  isGameReady?: boolean;
  category: string;
  description?: string;
};

type Collection = {
  name: string;
  description: string;
  artworkCount: number;
  creator: string;
  image: string;
};

type FeaturedArtworkProps = {
  artworks?: Artwork[];
};

const FeaturedArtwork: React.FC<FeaturedArtworkProps> = ({ artworks = [] }) => {
  const [filter, setFilter] = useState<string>('All');
  const [previewArtwork, setPreviewArtwork] = useState<Artwork | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [featuredCollection, setFeaturedCollection] = useState<Collection | null>(null);
  const itemsPerPage = 4;

  const categories: string[] = ['All', 'Cyberpunk', 'Fantasy', 'SciFi', 'Retro'];
  
  useEffect(() => {
    setFeaturedCollection({
      name: 'Cyber Warriors',
      description: 'Limited edition cyberpunk warrior collection',
      artworkCount: 12,
      creator: 'RetroArtist',
      image: '/path/to/collection-thumbnail.jpg'
    });
  }, []);

  const filteredArtworks = artworks.filter(artwork => 
    filter === 'All' || artwork.category === filter
  );

  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
  const displayedArtworks = filteredArtworks.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  );

  const goToNextPage = () => {
    setCurrentPage(prev => (prev + 1) % totalPages);
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => (prev - 1 + totalPages) % totalPages);
  };

  const openPreview = (artwork: Artwork) => {
    setPreviewArtwork(artwork);
  };

  const closePreview = () => {
    setPreviewArtwork(null);
  };

  return (
    <div className="featured-artwork-container">
      <div className="featured-header">
        <h2 className="featured-title">FEATURED ARTWORK</h2>
        <div className="filter-tabs">
          {categories.map(category => (
            <button 
              key={category}
              className={`filter-tab ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {featuredCollection && (
        <CollectionHighlight 
          collection={featuredCollection} 
          onClick={() => console.log('Navigate to collection')}
        />
      )}

      <div className="artwork-grid">
        {displayedArtworks.map(artwork => (
          <ArtworkCard 
            key={artwork.id} 
            artwork={artwork} 
            onPreview={() => openPreview(artwork)}
          />
        ))}
      </div>

      <div className="navigation-controls">
        <button 
          className="nav-button prev" 
          onClick={goToPrevPage}
          disabled={totalPages <= 1}
        >
          &lt;
        </button>
        <div className="pagination-dots">
          {Array.from({ length: totalPages }).map((_, index) => (
            <span 
              key={index} 
              className={`dot ${currentPage === index ? 'active' : ''}`}
              onClick={() => setCurrentPage(index)}
            />
          ))}
        </div>
        <button 
          className="nav-button next" 
          onClick={goToNextPage}
          disabled={totalPages <= 1}
        >
          &gt;
        </button>
      </div>

      {previewArtwork && (
        <ArtworkPreview 
          artwork={previewArtwork} 
          onClose={closePreview}
        />
      )}
    </div>
  );
};

export default FeaturedArtwork;