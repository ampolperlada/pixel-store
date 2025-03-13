import React, { useState } from "react";
import ArtworkCard from "../components/ArtworkCard";
import ArtworkDetailModal from "../components/ArtworkDetailModal"; // ✅ Use this instead of ArtworkPreview
import { ArtworkItem } from "../data/sampleData";

interface FeaturedArtworkProps {
  featuredArt: ArtworkItem[];
}

const FeaturedArtwork: React.FC<FeaturedArtworkProps> = ({ featuredArt }) => {
  const [previewArtwork, setPreviewArtwork] = useState<ArtworkItem | null>(null);

  return (
    <section className="py-16 bg-black relative">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-cyan-300">FEATURED ARTWORK</h2>

        <div className="artwork-grid mt-6">
          {featuredArt.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} onPreview={() => setPreviewArtwork(artwork)} />
          ))}
        </div>
      </div>

      {/* ✅ Use ArtworkDetailModal for previews */}
      {previewArtwork && <ArtworkDetailModal artwork={previewArtwork} onClose={() => setPreviewArtwork(null)} />}
    </section>
  );
};

export default FeaturedArtwork;
