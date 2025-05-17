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
}

declare global {
  interface Ethereum {
    isMetaMask?: boolean;
    request: (request: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
  }
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<any>;
      isMetaMask?: boolean;
      // Add any other properties you need here
    } & Ethereum;
  }
}

const WalletConnector = ({ onSuccess, onError }: WalletConnectorProps): WalletConnectorHook => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [conflictingUser, setConflictingUser] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

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
    
    if (ethereum && typeof (ethereum as any).on === 'function') {
      // Add event listener for account changes
      (ethereum as any).on('accountsChanged', handleAccountsChanged);
      
      // Clean up when component unmounts
      return () => {
        (ethereum as any).removeListener('accountsChanged', handleAccountsChanged);
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

  // Connect wallet function
  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionError(null);
    setConflictingUser(null);
    
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        throw new Error('MetaMask is not installed');
      }
      
      // Request accounts from MetaMask
      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }
      
      const address = accounts[0];
      
      // Validate if this wallet is already registered to another user
      try {
        // This would be where you check with your backend if this wallet address is already taken
        // Mock API call - replace with actual API call
        const isWalletAlreadyRegistered = false;
        const existingUsername = null;
        
        if (isWalletAlreadyRegistered) {
          setConflictingUser(existingUsername);
          setConnectionError('This wallet is already linked to another account');
          setIsWalletConnected(false);
          return;
        }
        
        // If we get here, the wallet is available to connect
        setWalletAddress(address);
        setIsWalletConnected(true);
        
        if (onSuccess) {
          onSuccess(address);
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
      console.error('Wallet connection error:', error);
      let errorMessage = 'Failed to connect wallet';
      
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
  };

  return {
    handleConnect,
    isConnecting,
    isWalletConnected,
    connectionError,
    walletAddress,
    disconnectWallet,
    isMetaMaskInstalled,
    conflictingUser
  };
};

export default WalletConnector;