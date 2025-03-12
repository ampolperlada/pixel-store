import React, { useState, useEffect } from 'react';
import ArtworkCard from '../ArtworkCard';
import CollectionHighlight from '../CollectionHighlight';
import ArtworkPreview from '../ArtworkPreview';
import { ArtworkItem } from '../../data/sampleData'; // ✅ Use ArtworkItem from sampleData
import '../../layout/FeaturedArtwork.css';

interface Collection {
  name: string;
  description: string;
  artworkCount: number;
  creator: string;
  image: string;
}

interface FeaturedArtworkProps {
  artworks?: ArtworkItem[];
}

const FeaturedArtwork: React.FC<FeaturedArtworkProps> = ({ artworks = [] }) => {
  const [filter, setFilter] = useState<string>('All');
  const [previewArtwork, setPreviewArtwork] = useState<ArtworkItem | null>(null);
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
      image: '/path/to/collection-thumbnail.jpg',
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

  const openPreview = (artwork: ArtworkItem) => {
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
        <CollectionHighlight collection={featuredCollection} onClick={() => console.log('Navigate to collection')} />
      )}

      <div className="artwork-grid">
        {displayedArtworks.map(artwork => (
          <ArtworkCard key={artwork.id} artwork={{ ...artwork, image: artwork.imageUrl }} onPreview={() => openPreview(artwork)} />
        ))}
      </div>

      <div className="navigation-controls">
        <button className="nav-button prev" onClick={goToPrevPage} disabled={totalPages <= 1}>
          &lt;
        </button>
        <div className="pagination-dots">
          {Array.from({ length: totalPages }).map((_, index) => (
            <span key={index} className={`dot ${currentPage === index ? 'active' : ''}`} onClick={() => setCurrentPage(index)} />
          ))}
        </div>
        <button className="nav-button next" onClick={goToNextPage} disabled={totalPages <= 1}>
          &gt;
        </button>
      </div>

      {previewArtwork && <ArtworkPreview artwork={previewArtwork} onClose={closePreview} />}
    </div>
  );
};

export default FeaturedArtwork;
