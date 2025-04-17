"use client";

import React from "react";
import Slider from "react-slick";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const featuredArt = [
  { id: 1, title: "Neon City", artist: "PixelMaster", price: "0.05 ETH", image: "/images/neon-city.png" },
  { id: 2, title: "Cyber Samurai", artist: "RetroArtist", price: "0.08 ETH", image: "/images/cyber-samurai.png" },
  { id: 3, title: "Digital Dreams", artist: "VoxelQueen", price: "0.03 ETH", image: "/images/digital-dreams.png" },
  { id: 4, title: "Glitch Landscape", artist: "ByteCrafter", price: "0.07 ETH", image: "/images/glitch-landscape.png" },
];

export default function Carousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="py-12 px-4 md:px-8">
      <h2 className="text-3xl font-bold mb-8 text-cyan-300 border-b-2 border-cyan-500 pb-2 inline-block font-mono">
        FEATURED ARTWORK
      </h2>

      <Slider {...settings}>
        {featuredArt.map((art) => (
          <div key={art.id} className="p-4">
            <div className="bg-gray-900 border-2 border-purple-500 hover:border-pink-500 transition-all p-4 group">
              <div className="relative aspect-square mb-3 overflow-hidden">
                <img 
                  src={art.image} 
                  alt={art.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-pink-400 font-bold">{art.price}</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">{art.title}</h3>
              <p className="text-cyan-400">by {art.artist}</p>
            </div>
          </div>
        ))}
      </Slider>

      <div className="mt-8 text-center">
        <Link href="/shop" className="px-6 py-3 bg-purple-700 text-white font-bold hover:bg-purple-800 transition-all border-2 border-purple-500 inline-block">
          VIEW ALL ARTWORK
        </Link>
      </div>
    </section>
  );
}
