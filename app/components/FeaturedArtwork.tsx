"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const artworkData = [
  { id: 1, title: "Ariza", artist: "John Doe", price: "$200", image: "/art1.jpg" },
  { id: 2, title: "Cyber Samurai", artist: "Jane Doe", price: "$250", image: "/art2.jpg" },
  { id: 3, title: "Neo Ronin", artist: "Jane Doe", price: "$250", image: "/art3.jpg" },
  { id: 4, title: "Neo Oni", artist: "Jane Doe", price: "$250", image: "/art4.jpg" },
  { id: 5, title: "Shadow Hacker", artist: "Jane Doe", price: "$250", image: "/art5.jpg" },
  { id: 6, title: "Cyber Zombie", artist: "Jane Doe", price: "$250", image: "/art6.jpg" },
];

const FeaturedArtwork = () => {
  return (
    <div className="w-full max-w-5xl mx-auto py-10">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">
        FEATURED ARTWORK
      </h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="w-full"
      >
        {artworkData.map((art) => (
          <SwiperSlide key={art.id}>
            <div className="bg-gray-900 p-4 rounded-lg shadow-lg text-center">
              <img src={art.image} alt={art.title} className="w-full h-60 object-cover rounded-md" />
              <h3 className="text-lg font-semibold text-white mt-3">{art.title}</h3>
              <p className="text-sm text-gray-400">{art.artist}</p>
              <p className="text-cyan-400 font-bold">{art.price}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturedArtwork;
