'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('creator');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to join waitlist');
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Waitlist error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4">You are on the List!</h1>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for joining the Pixel Store waitlist. We will notify you as soon as we launch.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h3 className="text-xl font-semibold mb-4">What happens next?</h3>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-pink-400 text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Early Access Invitation</h4>
                  <p className="text-gray-400 text-sm">You will receive an exclusive invite before our public launch</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-400 text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Beta Features</h4>
                  <p className="text-gray-400 text-sm">Get lifetime access to premium features as an early supporter</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-cyan-400 text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Community Updates</h4>
                  <p className="text-gray-400 text-sm">Stay informed about new features and platform developments</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link 
              href="/"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition border border-white/20"
            >
              Back to Home
            </Link>
            <Link 
              href="/explore"
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Explore Gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="text-xl font-bold text-pink-400 hover:text-pink-300 transition">
            Pixel Store
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold mb-6 border border-purple-500/30">
            BETA LAUNCH SPECIAL
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Join the Waitlist
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Be among the first 1,000 creators to get lifetime pro features, early access, and exclusive benefits when we launch.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Early Access</h3>
            <p className="text-gray-400 text-sm">Get exclusive access before public launch</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Pro Features</h3>
            <p className="text-gray-400 text-sm">Lifetime access to premium tools and analytics</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">VIP Community</h3>
            <p className="text-gray-400 text-sm">Join our exclusive Discord for early supporters</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-2xl p-8 border border-pink-500/30 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg focus:border-pink-500 focus:outline-none transition text-white placeholder-gray-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg focus:border-pink-500 focus:outline-none transition text-white placeholder-gray-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-semibold mb-2">
                I am interested as a...
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg focus:border-pink-500 focus:outline-none transition text-white"
              >
                <option value="creator">Creator / Artist</option>
                <option value="collector">Collector / Buyer</option>
                <option value="both">Both Creator & Collector</option>
                <option value="other">Just Exploring</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Joining...' : 'Join the Waitlist'}
            </button>

            <p className="text-center text-gray-400 text-sm">
              By joining, you agree to receive updates about Pixel Store. Unsubscribe anytime.
            </p>
          </form>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-pink-400 mb-1">847</div>
            <div className="text-gray-400 text-sm">People Waiting</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400 mb-1">153</div>
            <div className="text-gray-400 text-sm">Spots Left</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-cyan-400 mb-1">2 weeks</div>
            <div className="text-gray-400 text-sm">Until Launch</div>
          </div>
        </div>
      </div>
    </div>
  );
}