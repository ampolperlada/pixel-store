import React from 'react';
import './FeaturedArtwork.css';

interface ArtworkPreviewProps {
  artwork: {
    title: string;
    image: string;
    description?: string;
    price?: string;
    artist: string;
    isGameReady?: boolean;
    category?: string;
  };
  onClose: () => void;
}

const ArtworkPreview: React.FC<ArtworkPreviewProps> = ({ artwork, onClose }) => {
  const { title, image, description, price, artist, isGameReady, category } = artwork;
  
  return (
    <div className="preview-overlay">
      <div className="preview-modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        
        <div className="preview-content">
          <div className="preview-image-container">
            <img src={image} alt={title} className="preview-image" />
            {isGameReady && (
              <div className="preview-badge game-ready">
                Game Ready
              </div>
            )}
          </div>
          
          <div className="preview-details">
            <h2 className="preview-title">{title}</h2>
            <p className="preview-artist">by {artist}</p>
            {category && <p className="preview-category">{category}</p>}
            {description && <p className="preview-description">{description}</p>}
            
            {price && (
              <div className="preview-price-section">
                <span className="preview-price-label">Price:</span>
                <span className="preview-price-value">{price} ETH</span>
              </div>
            )}
            
            <div className="preview-buttons">
              <button className="preview-buy-button">
                Buy Now
              </button>
              <button className="preview-details-button">
                View Full Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkPreview;