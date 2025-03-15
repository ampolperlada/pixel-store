import React from 'react';
import Link from 'next/link';

const NotificationBar: React.FC = () => {
  return (
    <>
      {/* Limited Time Events Banner */}
      <div className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 p-2 text-center relative overflow-hidden">
        <div className="animate-pulse absolute -left-10 top-0 h-full w-20 bg-white opacity-20 skew-x-12"></div>
        <p className="font-mono text-sm">
          🔥 LIMITED EVENT: Cyberpunk Collection Drop - Ends in <span className="font-bold">12:24:45</span>
        </p>
      </div>
      
      {/* Notification & User Profile */}
      <div className="absolute top-4 right-4 flex items-center space-x-4 z-10">
        <div className="relative">
          <button className="text-cyan-400 hover:text-cyan-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-cyan-400"></span>
          </button>
        </div>
        <Link href="/profile" className="px-4 py-1 bg-gradient-to-r from-pink-600 to-cyan-500 rounded text-sm font-bold hover:from-pink-500 hover:to-cyan-400 transition duration-300">
          My Profile
        </Link>
      </div>
    </>
  );
};

export default NotificationBar;