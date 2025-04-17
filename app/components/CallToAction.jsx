// app/src/components/CallToAction.jsx
import React from 'react';

export default function CallToAction() {
  return (
    <section className="py-16 px-4 text-center bg-gradient-to-r from-pink-900/50 to-purple-900/50">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white font-mono">JOIN THE PIXEL REVOLUTION</h2>
      <p className="text-xl text-cyan-300 mb-8 max-w-2xl mx-auto">Sign up today and get exclusive access to limited edition pixel art drops, game integrations, and creator tools.</p>
      <div className="flex flex-wrap justify-center gap-4">
        <button className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold hover:from-pink-700 hover:to-purple-700 transition-all border-2 border-pink-400 shadow-lg shadow-pink-500/30 uppercase tracking-wider">
          Sign Up Now
        </button>
        <button className="px-8 py-4 bg-transparent text-white font-bold hover:text-cyan-300 transition-all border-2 border-cyan-500 shadow-lg shadow-cyan-500/20 uppercase tracking-wider">
          Learn More
        </button>
      </div>
    </section>
  );
}