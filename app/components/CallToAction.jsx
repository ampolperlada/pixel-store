"use client"; // Mark as a client component

import React from 'react';
import Link from 'next/link';

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
          Join the Pixel Revolution
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Sign up today and get exclusive access to limited edition pixel art drops, game integrations, and creator tools.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 bg-cyan-600 text-white font-bold rounded hover:bg-cyan-700 transition duration-300"
          >
            Sign Up Now
          </Link>
          <Link
            href="/learn-more"
            className="px-6 py-3 bg-transparent text-cyan-300 font-bold border-2 border-cyan-500 rounded hover:bg-cyan-500 hover:text-white transition duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;