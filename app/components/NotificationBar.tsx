"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "./context/AuthContext";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import { signIn, signOut, useSession } from 'next-auth/react';

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

// Sticky Navbar Component with improved wallet connection
const StickyNavbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const { user, loading, logout, refreshUser } = useAuth();
  const { data: session } = useSession();
  const [hasMounted, setHasMounted] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const { showToast } = useToast();

  async function refreshSession() {
    try {
      const response = await signIn('credentials', { 
        redirect: false,
        callbackUrl: window.location.href
      });
      
      if (response?.error) {
        console.error('Session refresh error:', response.error);
      }
    } catch (error) {
      console.error('Session refresh error:', error);
    }
  }

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
  if (walletConnecting) {
    showToast('Already processing wallet connection. Please wait.', 'warning');
    return;
  }
  
  setWalletConnecting(true);
  
  try {
    if (!user) {
      showToast('You must be logged in to connect a wallet', 'warning');
      setIsLoginOpen(true);
      return;
    }
    
    if (!window.ethereum) {
      showToast('MetaMask or compatible wallet not detected. Please install MetaMask first.', 'error');
      return;
    }
    
    // First check if MetaMask is locked
    let accounts = [];
    try {
      // Get current accounts without requesting new permissions
      accounts = await window.ethereum.request({ 
        method: "eth_accounts" 
      });
      
      // If no accounts, then we need to request access
      if (!accounts || accounts.length === 0) {
        try {
          showToast('Please select an account in your wallet', 'info');
          
          // Request access to accounts
          accounts = await window.ethereum.request({ 
            method: "eth_requestAccounts" 
          });
        } catch (requestError) {
          if ((requestError as { code?: number }).code === 4001) { // User rejected request
            showToast('You rejected the connection request', 'info');
          } else {
            if (requestError instanceof Error) {
              showToast(`Wallet error: ${requestError.message}`, 'error');
            } else {
              showToast('Wallet error: Unknown error', 'error');
            }
          }
          return;
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      showToast(`Failed to connect to wallet: ${errorMessage}`, 'error');
      return;
    }
    
    if (!accounts || accounts.length === 0) {
      showToast('No wallet accounts found or authorized.', 'error');
      return;
    }
    
    // If multiple accounts, let user choose one
    let selectedAccount = accounts[0];
    if (accounts.length > 1) {
      // Simple account selection UI (you could replace this with a modal)
      const accountIndex = window.prompt(
        `Select an account number (1-${accounts.length}):\n\n${
          accounts.map((acc, i) => `${i+1}: ${acc}`).join('\n')
        }`
      );
      
      if (!accountIndex || isNaN(Number(accountIndex)) || Number(accountIndex) < 1 || Number(accountIndex) > accounts.length) {
        showToast('Invalid account selection', 'error');
        return;
      }
      
      selectedAccount = accounts[Number(accountIndex) - 1];
    }
    
    // User selected a wallet, now save it to database
    const response = await fetch("/api/connect-wallet", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.user?.id || ""}` 
      },
      body: JSON.stringify({ walletAddress: selectedAccount.toLowerCase() }),
      credentials: 'include'
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      // Handle specific errors from the API
      if (response.status === 409) {
        showToast(`This wallet is already connected to user: ${responseData.conflictingUser}`, 'error');
      } else {
        showToast(responseData.error || `Failed to save wallet address (Status: ${response.status})`, 'error');
      }
      return;
    }
    
    // Ensure we refresh everything properly
    if (refreshUser) await refreshUser();
    await refreshSession();
    
    showToast('Wallet connected successfully!', 'success');
    
    // Update UI without forcing page refresh
    setTimeout(() => {
      if (responseData.user) {
        // Update local user state if available
        // This is better than forcing a page reload
      } else {
        window.location.reload();
      }
    }, 1000);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error connecting wallet';
    console.error('Wallet connection error:', error);
    showToast(`Wallet connection failed: ${errorMessage}`, 'error');
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
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <div className="w-8 h-8 mr-2">
                  <Image src="/images/coin.png" alt="Pixel Marketplace" width={32} height={32} />
                </div>
                <span className="font-bold text-lg text-white">PIXEL MARKETPLACE</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link href="/explore" className="text-white hover:text-pink-400 transition-colors">Explore</Link>
              <Link href="/create" className="text-white hover:text-pink-400 transition-colors">Create</Link>
              <Link href="/games" className="text-white hover:text-pink-400 transition-colors">Games</Link>
              <Link href="/learn" className="text-white hover:text-pink-400 transition-colors">Learn</Link>
            </div>

            <div className="flex items-center space-x-3">
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

              {loading ? (
                <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse" />
              ) : user ? (
                <>
                  {user.wallet_address && (
                    <div className="px-4 py-2 bg-gray-800 text-green-400 rounded-lg font-mono text-sm flex items-center">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                      {user.wallet_address.slice(0, 6)}...{user.wallet_address.slice(-4)}
                    </div>
                  )}

                  {!user.wallet_address && (
                    <button
                      onClick={handleConnectWallet}
                      disabled={walletConnecting}
                      className={`px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 ${
                        walletConnecting ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      {walletConnecting ? "Connecting..." : "Connect Wallet"}
                    </button>
                  )}

                  <Link
                    href="/profile"
                    className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-pink-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
                  >
                    My Profile
                  </Link>

                  <button
                    onClick={() => {
                      signOut({ redirect: false });
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

            <button className="md:hidden text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
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