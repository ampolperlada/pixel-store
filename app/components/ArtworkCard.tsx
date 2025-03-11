import React from 'react';
import './FeaturedArtwork.css';

interface ArtworkCardProps {
  artwork: {
    id: number | string;
    title: string;
    image: string;
    price?: string;
    artist: string;
    isGameReady?: boolean;
    category?: string;
  };
  onPreview: () => void;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onPreview }) => {
  const { title, image, price, artist, isGameReady } = artwork;

  return (
    <div className="artwork-card">
      <div className="artwork-image-container">
        <img src={image} alt={title} className="artwork-image" />
        
        <div className="artwork-overlay">
          <button className="preview-button" onClick={onPreview}>
            Quick Preview
          </button>
          <button className="details-button">
            View Details
          </button>
        </div>
        
        {isGameReady && (
          <div className="game-ready-badge">
            Game Ready
          </div>
        )}
        
        {price && (
          <div className="artwork-price">
            {price} ETH
          </div>
        )}
      </div>
      
      <div className="artwork-info">
        <h3 className="artwork-title">{title}</h3>
        <p className="artwork-artist">by {artist}</p>
      </div>
    </div>
  );
};

export default ArtworkCard;