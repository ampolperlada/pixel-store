"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "./context/AuthContext";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import { useSession } from 'next-auth/react';

// Toast Context
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function Toast({ message, type }: { message: string; type: ToastType }) {
  const backgroundColor = 
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' :
    type === 'warning' ? 'bg-yellow-500' : 
    'bg-blue-500';
  
  return (
    <div className={`${backgroundColor} text-white px-4 py-2 rounded-md shadow-lg max-w-md transform transition-all duration-300 ease-out translate-y-0 opacity-100`}>
      <p>{message}</p>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  
  const showToast = (message: string, type: ToastType = 'success', duration: number = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };
  
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// WalletStatus Component
function WalletStatus() {
  const { data: session } = useSession();
  const [walletConnected, setWalletConnected] = useState(false);
  const { showToast } = useToast();
  
  useEffect(() => {
    const fetchWalletStatus = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch('/api/user_wallets');
        const { success, data } = await res.json();
        if (success) {
          setWalletConnected(data.isConnected);
        }
      } catch (error) {
        console.error('Failed to fetch wallet status:', error);
      }
    };
    fetchWalletStatus();
  }, [session]);

  const handleConnectWallet = async () => {
    try {
      if (!window.ethereum) {
        showToast('Ethereum wallet not detected. Please install MetaMask or another Ethereum wallet.', 'error');
        return;
      }
      
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }).catch((err) => {
        if (err.code === 4001) {
          showToast('Wallet connection rejected by user', 'warning');
        } else {
          showToast('Failed to connect wallet: ' + err.message, 'error');
        }
        throw err;
      });

      if (!session?.user?.id) {
        showToast('You must be logged in to connect a wallet', 'warning');
        return;
      }

      const response = await fetch("/api/connect-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet_address: accounts[0], user_id: session.user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        showToast(errorData.message || 'Failed to save wallet address', 'error');
        return;
      }
      
      setWalletConnected(true);
      showToast('Wallet connected successfully!', 'success');
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };
  
  if (!session) return <p className="text-white">Please log in</p>;
  
  return walletConnected ? (
    <div className="px-4 py-2 bg-gray-800 text-green-400 rounded-lg font-mono text-sm flex items-center">
      <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-2"></span>
      <p>Wallet Connected</p>
    </div>
  ) : (
    <button
      onClick={handleConnectWallet}
      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105"
    >
      Connect Wallet
    </button>
  );
}

// Notification Bar Component
const NotificationBar = () => {
  return (
    <div className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 p-2 text-center relative overflow-hidden">
      <div className="animate-pulse absolute -left-10 top-0 h-full w-20 bg-white opacity-20 skew-x-12"></div>
      <p className="font-mono text-sm">
        🔥 LIMITED EVENT: Cyberpunk Collection Drop - Ends in{" "}
        <span className="font-bold">12:24:45</span>
      </p>
    </div>
  );
};

// Sticky Navbar Component
const StickyNavbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const { user, loading, logout, refreshUser } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const { showToast } = useToast(); // Use the toast hook

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleConnectWallet = async () => {
    try {
      setWalletConnecting(true);
  
      if (!window.ethereum) {
        showToast('Ethereum wallet not detected. Please install MetaMask or another Ethereum wallet.', 'error');
        setWalletConnecting(false);
        return;
      }
      
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }).catch((err) => {
        // Handle case where user rejects the connection request
        if (err.code === 4001) {
          showToast('Wallet connection rejected by user', 'warning');
        } else {
          showToast('Failed to connect wallet: ' + err.message, 'error');
        }
        throw err;
      });
  
      if (!user) {
        showToast('You must be logged in to connect a wallet', 'warning');
        setWalletConnecting(false);
        return;
      }
  
      const response = await fetch("/api/connect-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet_address: accounts[0], user_id: user.id }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        showToast(errorData.message || 'Failed to save wallet address', 'error');
        setWalletConnecting(false);
        return;
      }
      
      // Refresh user data after successful wallet connection
      if (refreshUser) {
        await refreshUser();
        showToast('Wallet connected successfully!', 'success');
      } else {
        // If you don't have a refreshUser function, reload the page as a fallback
        window.location.reload();
      }
    } catch (error: any) {
      // Skip logging user-rejected errors since we already showed a toast
      if (error?.code !== 4001) {
        console.error("Wallet connection error:", error);
      }
    } finally {
      setWalletConnecting(false);
    }
  };

  if (!hasMounted) return null;

  return (
    <>
      <nav
        className={`w-full py-3 z-10 transition-all duration-300 ${
          isSticky
            ? "fixed top-0 shadow-lg bg-gray-900 bg-opacity-95 backdrop-blur-sm"
            : "relative bg-gray-900"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <div className="w-8 h-8 mr-2">
                  <Image src="/images/coin.png" alt="Pixel Marketplace" width={32} height={32} />
                </div>
                <span className="font-bold text-lg text-white">PIXEL MARKETPLACE</span>
              </div>
            </Link>

            {/* Main Nav */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/explore" className="text-white hover:text-pink-400 transition-colors">Explore</Link>
              <Link href="/create" className="text-white hover:text-pink-400 transition-colors">Create</Link>
              <Link href="/games" className="text-white hover:text-pink-400 transition-colors">Games</Link>
              <Link href="/learn" className="text-white hover:text-pink-400 transition-colors">Learn</Link>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {/* Notification Icon */}
              <div className="relative">
                <button 
                  className="text-cyan-400 hover:text-cyan-300"
                  onClick={() => showToast('You have 3 new notifications', 'info')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-cyan-400"></span>
                </button>
              </div>

              {/* Auth Buttons */}
              {loading ? (
                <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse" />
              ) : user ? (
                <>
                  {/* Use the WalletStatus component instead of the old wallet display */}
                  <WalletStatus />

                  <Link
                    href="/profile"
                    className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-pink-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
                  >
                    My Profile
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      showToast('Logged out successfully', 'success');
                    }}
                    className="text-white hover:text-pink-400 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="text-white hover:text-pink-400 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsSignupOpen(true)}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Nav Button */}
            <button className="md:hidden text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Auth Modals */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
      <SignupModal 
        isOpen={isSignupOpen} 
        onClose={() => setIsSignupOpen(false)} 
      />
    </>
  );
};

// Main Header Component
const Header = () => (
  <ToastProvider>
    <header className="relative">
      <NotificationBar />
      <StickyNavbar />
    </header>
  </ToastProvider>
);

export default Header;