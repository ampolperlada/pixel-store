"use client"; // Mark as a client component

import React from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="profile-header bg-black bg-opacity-30 rounded-lg p-6 mb-8">
          <div className="profile-info flex items-center">
            {/* Avatar */}
            <div className="avatar w-24 h-24 rounded-full bg-pink-600 flex items-center justify-center text-4xl font-bold">
              UP
            </div>
            {/* User Details */}
            <div className="user-details ml-6">
              <h1 className="text-3xl font-bold">Username_Pixel</h1>
              <p className="text-gray-400">Member since January 2025</p>
              <p className="text-gray-400">Pixel Artist • Collector • Gamer</p>
            </div>
          </div>
          {/* Stats */}
          <div className="stats flex gap-6 mt-6">
            <div className="stat-box bg-black bg-opacity-20 rounded-lg p-4 text-center">
              <div className="number text-2xl font-bold text-cyan-400">12</div>
              <div className="label text-gray-400">Creations</div>
            </div>
            <div className="stat-box bg-black bg-opacity-20 rounded-lg p-4 text-center">
              <div className="number text-2xl font-bold text-cyan-400">8</div>
              <div className="label text-gray-400">Owned</div>
            </div>
            <div className="stat-box bg-black bg-opacity-20 rounded-lg p-4 text-center">
              <div className="number text-2xl font-bold text-cyan-400">47</div>
              <div className="label text-gray-400">Followers</div>
            </div>
          </div>
        </div>

        {/* Dashboard Actions */}
        <div className="dashboard-actions flex gap-4 mb-8">
          <button className="action-button bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-lg font-bold">
            Edit Profile
          </button>
          <button className="action-button outline border-2 border-pink-600 text-pink-600 px-6 py-2 rounded-lg font-bold">
            Connect Wallet
          </button>
          <button className="action-button outline border-2 border-pink-600 text-pink-600 px-6 py-2 rounded-lg font-bold">
            Share Profile
          </button>
        </div>

        {/* Wallet Section */}
        <div className="section bg-black bg-opacity-30 rounded-lg p-6 mb-8">
          <div className="wallet-section flex justify-between items-center mb-6">
            <h2 className="section-title text-2xl font-bold">Wallet</h2>
            <div className="wallet-balance text-2xl font-bold text-cyan-400">1,240 PXL</div>
          </div>
          <div className="dashboard-actions flex gap-4">
            <button className="action-button bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-lg font-bold">
              Add Funds
            </button>
            <button className="action-button outline border-2 border-pink-600 text-pink-600 px-6 py-2 rounded-lg font-bold">
              Withdraw
            </button>
            <button className="action-button outline border-2 border-pink-600 text-pink-600 px-6 py-2 rounded-lg font-bold">
              Transaction History
            </button>
          </div>
        </div>

        {/* My Creations Section */}
        <div className="section bg-black bg-opacity-30 rounded-lg p-6 mb-8">
          <div className="section-header flex justify-between items-center mb-6">
            <h2 className="section-title text-2xl font-bold">My Creations</h2>
            <div className="tabs flex gap-4">
              <div className="tab active text-pink-600 border-b-2 border-pink-600">All</div>
              <div className="tab text-gray-400">For Sale</div>
              <div className="tab text-gray-400">Sold</div>
              <div className="tab text-gray-400">Drafts</div>
            </div>
          </div>
          <div className="gallery grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Artwork Cards */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="artwork bg-black bg-opacity-20 rounded-lg overflow-hidden hover:transform hover:-translate-y-2 transition-transform">
                <div className="artwork-image w-full h-40 bg-gray-800 flex items-center justify-center text-gray-400">
                  Artwork Image
                </div>
                <div className="artwork-details p-4">
                  <h3 className="artwork-title text-lg font-bold">Space Explorer</h3>
                  <p className="artwork-price text-cyan-400 font-bold">320 PXL</p>
                  <p className="artwork-status text-gray-400 text-sm">For Sale</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Collection Section */}
        <div className="section bg-black bg-opacity-30 rounded-lg p-6 mb-8">
          <div className="section-header flex justify-between items-center mb-6">
            <h2 className="section-title text-2xl font-bold">My Collection</h2>
            <div className="tabs flex gap-4">
              <div className="tab active text-pink-600 border-b-2 border-pink-600">All</div>
              <div className="tab text-gray-400">Rare</div>
              <div className="tab text-gray-400">Common</div>
              <div className="tab text-gray-400">Recent</div>
            </div>
          </div>
          <div className="gallery grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Artwork Cards */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="artwork bg-black bg-opacity-20 rounded-lg overflow-hidden hover:transform hover:-translate-y-2 transition-transform">
                <div className="artwork-image w-full h-40 bg-gray-800 flex items-center justify-center text-gray-400">
                  Artwork Image
                </div>
                <div className="artwork-details p-4">
                  <h3 className="artwork-title text-lg font-bold">Clown Zombie</h3>
                  <p className="artwork-price text-cyan-400 font-bold">Purchased: 1,200 PXL</p>
                  <p className="artwork-status text-gray-400 text-sm">Owned • Legendary</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed Section */}
        <div className="section bg-black bg-opacity-30 rounded-lg p-6">
          <div className="section-header mb-6">
            <h2 className="section-title text-2xl font-bold">Activity Feed</h2>
          </div>
          <div className="activity-feed">
            {[
              "Today - Your artwork 'Space Explorer' was liked by PixelFan42",
              "Yesterday - You purchased 'Demon Slayer' for 1,100 PXL",
              "3 days ago - Your artwork 'Pixel Forest' was sold for 600 PXL",
              "1 week ago - You created 'Neon Warrior'",
            ].map((activity, index) => (
              <div key={index} className="activity-item mb-4 text-gray-400">
                {activity}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}