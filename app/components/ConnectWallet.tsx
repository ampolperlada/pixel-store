// components/ConnectWallet.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../components/context/AuthContext'; // Adjust the import path as necessary

interface WalletAccount {
  id: string;
  address: string;
  name?: string;
  balance?: string;
}

interface ConnectWalletProps {
  onSuccess?: (address: string) => void;
  onError?: (error: string) => void;
}

export default function ConnectWallet({ onSuccess, onError }: ConnectWalletProps) {
  const { connectWallet } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflictingUser, setConflictingUser] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [showAccountSelector, setShowAccountSelector] = useState(false);

  // Function to request wallet accounts from MetaMask or other providers
  const requestAccounts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error("No wallet found. Please install MetaMask or another web3 wallet.");
      }
      
      // Request accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please unlock your wallet and try again.");
      }
      
      // Format accounts with additional info if available
      const formattedAccounts: WalletAccount[] = await Promise.all(
        accounts.map(async (address: string, index: number) => {
          // Try to get balance (optional)
          let balance = "0";
          try {
            let balanceHex = "0x0";
            if (window.ethereum) {
              balanceHex = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [address, 'latest'],
              });
            }
            balance = parseInt(balanceHex, 16) / 1e18 + " ETH"; // Convert from wei to ETH
          } catch (e) {
            console.warn("Could not fetch balance for", address);
          }
          
          return {
            id: `account-${index}`,
            address: address,
            name: `Account ${index + 1}`,
            balance
          };
        })
      );
      
      setAccounts(formattedAccounts);
      
      // If only one account, select it automatically
      if (formattedAccounts.length === 1) {
        await checkAndConnectWallet(formattedAccounts[0].address);
      } else {
        // Show account selector for multiple accounts
        setShowAccountSelector(true);
      }
      
    } catch (err) {
      console.error("Error connecting wallet:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to connect wallet";
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to check if wallet is available and connect it
  const checkAndConnectWallet = async (address: string) => {
    setLoading(true);
    setError(null);
    setConflictingUser(null);
    
    try {
      // First check if wallet is already connected to another account
      const response = await fetch("/api/check-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 409) {
          setConflictingUser(data.conflictingUser || "another user");
          setShowAccountSelector(true); // Show account selector to choose a different wallet
          throw new Error(`This wallet is already linked to user: ${data.conflictingUser}`);
        } else {
          throw new Error(data.error || "Failed to check wallet availability");
        }
      }
      
      // If wallet is available, connect it
      await connectWallet(address);
      
      // On success
      if (onSuccess) onSuccess(address);
      
      // Reset states
      setShowAccountSelector(false);
      setSelectedAccount(null);
      
    } catch (err) {
      console.error("Error checking/connecting wallet:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to connect wallet";
      setError(errorMessage);
      if (onError) onError(errorMessage);
      
      // Don't hide account selector if there was an error
      if (accounts.length > 1) {
        setShowAccountSelector(true);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle account selection
  const handleAccountSelect = async (address: string) => {
    setSelectedAccount(address);
    await checkAndConnectWallet(address);
  };
  
  // Handle try again button click (clear error and try with same or different account)
  const handleTryAgain = () => {
    setError(null);
    setConflictingUser(null);
    
    if (accounts.length > 0) {
      // Show account selector again if we have accounts
      setShowAccountSelector(true);
    } else {
      // Otherwise start from scratch
      requestAccounts();
    }
  };
  
  return (
    <div className="wallet-connect-container">
      {/* Initial connect button */}
      {!showAccountSelector && !loading && !error && (
        <button 
          onClick={requestAccounts}
          className="connect-wallet-btn"
          disabled={loading}
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div className="loading-indicator">
          <span>Connecting wallet...</span>
        </div>
      )}
      
      {/* Error display */}
      {error && (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-message">
            <strong>Connection Error</strong>
            <p>{error}</p>
            {conflictingUser && (
              <p>Wallet already connected to user: {conflictingUser}</p>
            )}
          </div>
          <button 
            onClick={handleTryAgain}
            className="try-again-btn"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Account selector */}
      {showAccountSelector && accounts.length > 0 && (
        <div className="account-selector">
          <h3>Select an account</h3>
          <div className="account-list">
            {accounts.map((account) => (
              <div 
                key={account.id}
                className={`account-item ${selectedAccount === account.address ? 'selected' : ''}`}
                onClick={() => handleAccountSelect(account.address)}
              >
                <div className="account-name">{account.name}</div>
                <div className="account-address">{account.address}</div>
                {account.balance && (
                  <div className="account-balance">{account.balance}</div>
                )}
              </div>
            ))}
          </div>
          <div className="account-actions">
            <button 
              onClick={() => requestAccounts()}
              className="secondary-btn"
            >
              Add account or hardware wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}