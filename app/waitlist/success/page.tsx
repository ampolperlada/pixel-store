'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function WaitlistSuccessPage() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('pixel-forge-waitlist');
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4 py-20">
      <div className="max-w-3xl w-full bg-gray-800/50 rounded-xl border border-cyan-500/50 shadow-2xl shadow-cyan-500/10 p-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-4 border-green-500">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
          You are on the List
        </h1>
        
        <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-yellow-200 text-sm font-semibold mb-1">
                Demo Mode Active
              </p>
              <p className="text-yellow-100/80 text-xs">
                This is a portfolio demonstration. Your information is stored locally in your browser for demo purposes only.
              </p>
            </div>
          </div>
        </div>
        
        {userData && (
          <div className="bg-gray-700/30 rounded-lg p-6 mb-6 border border-gray-600">
            <h3 className="text-cyan-400 font-semibold mb-4 text-lg">Your Waitlist Entry:</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-600">
                <span className="text-gray-400 text-sm">Username</span>
                <span className="text-white font-medium">{userData.username}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-600">
                <span className="text-gray-400 text-sm">Email</span>
                <span className="text-white font-medium">{userData.email}</span>
              </div>
              {userData.walletAddress && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-600">
                  <span className="text-gray-400 text-sm">Wallet Address</span>
                  <span className="text-white font-mono text-xs break-all">{userData.walletAddress}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Joined</span>
                <span className="text-gray-300 text-sm">{new Date(userData.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white text-center mb-6">Explore the Demo Features</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-700/50 p-5 rounded-lg text-center hover:border-cyan-500/50 transition-all">
              <div className="text-3xl mb-3">
                <svg className="w-8 h-8 mx-auto text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-300 text-sm font-medium">Browse Marketplace</p>
              <p className="text-gray-500 text-xs mt-1">Explore pixel art collections</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50 p-5 rounded-lg text-center hover:border-purple-500/50 transition-all">
              <div className="text-3xl mb-3">
                <svg className="w-8 h-8 mx-auto text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <p className="text-gray-300 text-sm font-medium">Create Art</p>
              <p className="text-gray-500 text-xs mt-1">Try the pixel art editor</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-700/50 p-5 rounded-lg text-center hover:border-green-500/50 transition-all">
              <div className="text-3xl mb-3">
                <svg className="w-8 h-8 mx-auto text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-300 text-sm font-medium">View Tech Stack</p>
              <p className="text-gray-500 text-xs mt-1">See implementation details</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-cyan-500/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Explore Demo
          </Link>
          
          <Link
            href="https://github.com/ampolperlada/pixel-forge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            View Source Code
          </Link>
        </div>
      </div>
    </div>
  );
}