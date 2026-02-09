'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DesktopOnlyProps {
  children: React.ReactNode;
  pageName?: string;
  showMobileAppMessage?: boolean;
}

export default function DesktopOnly({ 
  children, 
  pageName = "this feature",
  showMobileAppMessage = false 
}: DesktopOnlyProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Less than 1024px = mobile/tablet
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800/50 rounded-xl border border-cyan-500/50 p-8 text-center">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-cyan-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h1 className="text-3xl font-bold text-white mb-3">
              Desktop Required
            </h1>
            <p className="text-gray-300 mb-6">
              {pageName} requires a larger screen for the best creative experience.
            </p>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
            <p className="text-yellow-200 text-sm">
              Please access this page from a desktop or laptop computer (minimum 1024px width).
            </p>
          </div>

          {showMobileAppMessage && (
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h3 className="text-purple-300 font-semibold text-sm">Mobile App Coming Soon</h3>
              </div>
              <p className="text-purple-200 text-xs">
                We're working on a dedicated mobile app with touch-optimized controls for creating pixel art on the go!
              </p>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 text-left">
              <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-gray-300 text-sm">Advanced pixel art editor with precision controls</p>
            </div>
            <div className="flex items-start gap-3 text-left">
              <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-gray-300 text-sm">Keyboard shortcuts for faster workflow</p>
            </div>
            <div className="flex items-start gap-3 text-left">
              <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-gray-300 text-sm">Large canvas workspace for detailed art</p>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-all w-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Homepage
            </Link>

            {showMobileAppMessage && (
              <Link
                href="/waitlist"
                className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-all w-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notify Me When App Launches
              </Link>
            )}
          </div>

          <p className="text-gray-500 text-xs mt-4">
            You can still browse the marketplace and explore galleries on mobile
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}