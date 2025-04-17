import React from 'react';
import './FeaturedArtwork.css';

interface CollectionHighlightProps {
  collection: {
    name: string;
    description: string;
    artworkCount: number;
    creator: string;
    image: string;
  };
  onClick: () => void;
}

const CollectionHighlight: React.FC<CollectionHighlightProps> = ({ collection, onClick }) => {
  const { name, description, artworkCount, creator, image } = collection;
  
  return (
    <div className="collection-highlight" onClick={onClick}>
      <div className="collection-image-container">
        <img src={image} alt={name} className="collection-image" />
      </div>
      
      <div className="collection-info">
        <div className="collection-badge">Featured Collection</div>
        <h3 className="collection-name">{name}</h3>
        <p className="collection-description">{description}</p>
        <div className="collection-meta">
          <span>{artworkCount} artworks</span>
          <span>by {creator}</span>
        </div>
        <button className="view-collection-button">
          View Collection
        </button>
      </div>
    </div>
  );
};

export default CollectionHighlight;