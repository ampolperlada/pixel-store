import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ArtworkItem } from "../data/sampleData";
import ArtworkCard from "../components/ArtworkCard";

interface FeaturedArtworkCarouselProps {
  featuredArt: ArtworkItem[];
}

const FeaturedArtworkCarousel: React.FC<FeaturedArtworkCarouselProps> = ({ featuredArt }) => {
  return (
    <section className="py-16 bg-black relative">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-cyan-300">FEATURED ARTWORK</h2>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1} // Show 1 at a time, can be adjusted for responsiveness
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 2 }, // 2 slides for small screens
            1024: { slidesPerView: 3 }, // 3 slides for large screens
          }}
          className="mt-6"
        >
          {featuredArt.map((artwork) => (
            <SwiperSlide key={artwork.id}>
              <ArtworkCard artwork={artwork} onPreview={() => console.log("Previewing:", artwork)} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedArtworkCarousel;
