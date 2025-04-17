import React from "react";

interface ArtworkItem {
  title: string;
  imageUrl: string;
  description: string;
  artist: string;
}

interface ArtworkDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  artwork: ArtworkItem | null;
}

const ArtworkDetailModal: React.FC<ArtworkDetailModalProps> = ({ isOpen, onClose, artwork }) => {
  if (!isOpen || !artwork) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>
          ✖
        </button>
        <h2 className="text-2xl font-bold">{artwork.title}</h2>
        <img src={artwork.imageUrl} alt={artwork.title} className="mt-4 w-full h-auto rounded" />
        <p className="mt-2 text-gray-600">{artwork.description}</p>
        <p className="mt-2 text-gray-800 font-semibold">Artist: {artwork.artist}</p>
      </div>
    </div>
  );
};

export default ArtworkDetailModal;
