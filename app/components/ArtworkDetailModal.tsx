import React from "react";

interface ArtworkDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  artwork: {
    title: string;
    imageUrl: string;
    description: string;
    artist: string;
  } | null;
}

const ArtworkDetailModal: React.FC<ArtworkDetailModalProps> = ({ isOpen, onClose, artwork }) => {
  if (!isOpen || !artwork) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={onClose}>
          ✖
        </button>
        <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-auto rounded-lg" />
        <h2 className="text-xl font-bold mt-4">{artwork.title}</h2>
        <p className="text-gray-600">By {artwork.artist}</p>
        <p className="mt-2">{artwork.description}</p>
      </div>
    </div>
  );
};

export default ArtworkDetailModal;
