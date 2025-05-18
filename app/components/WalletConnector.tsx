import { useState, useEffect, useCallback } from 'react';

interface WalletConnectorProps {
  onSuccess?: (address: string) => void;
  onError?: (error: Error) => void;
}

interface WalletConnectorHook {
  handleConnect: () => Promise<void>;
  isConnecting: boolean;
  isWalletConnected: boolean;
  connectionError: string | null;
  walletAddress: string | null;
  disconnectWallet: () => void;
  isMetaMaskInstalled: boolean;
  conflictingUser: string | null;
  availableAccounts: string[];
  selectAccount: (address: string) => Promise<void>;
}

declare global {
  interface Ethereum {
    isMetaMask?: boolean;
    request: (request: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    selectedAddress?: string;
  }
  interface Window {
    ethereum?: Ethereum;
  }
}

const WalletConnector = ({ onSuccess, onError }: WalletConnectorProps): WalletConnectorHook => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [conflictingUser, setConflictingUser] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = () => {
      const isInstalled = typeof window !== 'undefined' && 
        typeof window.ethereum !== 'undefined' && 
        !!window.ethereum.isMetaMask;
      setIsMetaMaskInstalled(isInstalled);
    };
    
    checkMetaMask();
  }, []);

  // Handler for account changes
  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      setIsWalletConnected(false);
      setWalletAddress(null);
    } else {
      // User switched to a different account
      const newAddress = accounts[0];
      setWalletAddress(newAddress);
      setIsWalletConnected(true);
    }
  }, []);

  // Clean up event listeners when component unmounts
  useEffect(() => {
    const { ethereum } = window;
    
    if (ethereum && typeof ethereum.on === 'function') {
      // Add event listener for account changes
      ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Clean up when component unmounts
      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [handleAccountsChanged]);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { ethereum } = window;
        if (!ethereum) return;
        
        // Don't auto-connect on component mount - just check if already connected
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length > 0) {
          const address = accounts[0];
          // Validate if this wallet is already registered to another user
          try {
            // This would be where you check with your backend if this wallet address is already taken
            // For now, we'll assume it's not
            const isWalletAlreadyRegistered = false;
            const existingUsername = null;
            
            if (isWalletAlreadyRegistered) {
              setConflictingUser(existingUsername);
              setConnectionError('This wallet is already linked to another account');
              setIsWalletConnected(false);
              return;
            }
            
            setWalletAddress(address);
            setIsWalletConnected(true);
            setConnectionError(null);
          } catch (validationError) {
            console.error('Wallet validation error:', validationError);
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };
    
    checkConnection();
  }, []);

  // Get all available accounts
  const getAvailableAccounts = async (): Promise<string[]> => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        throw new Error('MetaMask is not installed');
      }
      
      // This will prompt the user to unlock their wallet if it's locked
      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts'
      });
      
      return accounts as string[];
    } catch (error) {
      console.error('Error getting accounts:', error);
      return [];
    }
  };

  // Connect wallet function with explicit account selection
  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionError(null);
    setConflictingUser(null);
    
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        throw new Error('MetaMask is not installed');
      }
      
      // Get all available accounts first
      const accounts = await getAvailableAccounts();
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }
      
      setAvailableAccounts(accounts);
      
      // If there's only one account, use it directly
      if (accounts.length === 1) {
        await selectAccount(accounts[0]);
      } else {
        // Multiple accounts available - let user select
        // Note: We're storing the accounts in state, and the UI will show selection options
        console.log('Multiple accounts available:', accounts);
        // Don't set any account as connected yet - wait for user selection
        setIsConnecting(false);
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      let errorMessage = 'Failed to connect wallet';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setConnectionError(errorMessage);
      if (onError && error instanceof Error) {
        onError(error);
      }
      setIsConnecting(false);
    }
  };

  // Function to select a specific account 
  const selectAccount = async (address: string) => {
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        throw new Error('MetaMask is not installed');
      }
      
      // Try to switch to the specified account
      // Note: ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] })
      // doesn't allow selecting a specific account, so we need to handle this differently
      
      // First attempt: Try to switch manually by requesting account again
      await ethereum.request({ 
        method: 'eth_requestAccounts'
      });
      
      // Force a wallet switch with a popup by using wallet_switchEthereumChain
      // This triggers the MetaMask UI which allows account switching
      try {
        // Get current chain ID
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        // Switch to the same chain (this forces a popup)
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        });
      } catch (switchError) {
        // Ignore switch errors, we're just trying to trigger the UI
      }
      
      // Now check which account is selected
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      const currentAddress = accounts[0];
      
      // Validate the address
      try {
        // This would be a backend call to check if the wallet is already registered
        // Mock API call for now
        const response = await fetch('/api/connect-wallet/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: currentAddress })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          setConflictingUser(data.conflictingUser || null);
          setConnectionError(data.message || 'This wallet is already linked to another account');
          setIsWalletConnected(false);
          setIsConnecting(false);
          return;
        }
        
        // If we get here, the wallet is available to connect
        setWalletAddress(currentAddress);
        setIsWalletConnected(true);
        
        if (onSuccess) {
          onSuccess(currentAddress);
        }
      } catch (validationError) {
        console.error('Wallet validation error:', validationError);
        if (validationError instanceof Error) {
          setConnectionError(validationError.message);
        } else {
          setConnectionError('Failed to validate wallet address');
        }
        
        if (onError && validationError instanceof Error) {
          onError(validationError);
        }
      }
    } catch (error) {
      console.error('Account selection error:', error);
      let errorMessage = 'Failed to select account';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setConnectionError(errorMessage);
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress(null);
    setConnectionError(null);
    setConflictingUser(null);
    setAvailableAccounts([]);
  };

  return {
    handleConnect,
    isConnecting,
    isWalletConnected,
    connectionError,
    walletAddress,
    disconnectWallet,
    isMetaMaskInstalled,
    conflictingUser,
    availableAccounts,
    selectAccount
  };
};

export default WalletConnector;