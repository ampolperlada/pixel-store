// WalletConnector.tsx
import { useState, useEffect, useCallback } from 'react';
import { connectWallet, disconnectWallet as disconnectWalletUtil } from '../utils/ethereum-utils';

interface WalletConnectorProps {
  onSuccess?: (address: string) => void;
  onError?: (error: Error) => void;
}

const WalletConnector = (props: WalletConnectorProps) => {
  const { onSuccess, onError } = props;
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Reset error state when attempting to connect again
  const resetError = useCallback(() => {
    if (connectionError) {
      setConnectionError(null);
    }
  }, [connectionError]);

  // Check for existing connection on component mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      try {
        if (window.ethereum && window.ethereum.selectedAddress) {
          const address = window.ethereum.selectedAddress;
          setWalletAddress(address);
          setIsWalletConnected(true);
          onSuccess?.(address);
        }
      } catch (error) {
        console.error('Error checking existing wallet connection:', error);
      }
    };

    checkExistingConnection();
  }, [onSuccess]);

  // Handle wallet connect request
  const handleConnect = useCallback(async () => {
    resetError();
    setIsConnecting(true);

    try {
      const address = await connectWallet();
      setWalletAddress(address);
      setIsWalletConnected(true);
      onSuccess?.(address);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setConnectionError(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsConnecting(false);
    }
  }, [resetError, onSuccess, onError]);

  // Handle wallet disconnect
  const disconnectWallet = useCallback(() => {
    try {
      disconnectWalletUtil();
      setWalletAddress(null);
      setIsWalletConnected(false);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }, []);

  // Set up event listeners for wallet changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnectWallet();
      } else {
        // Account changed, update the address
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        onSuccess?.(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      // When chain changes, we should refresh the page
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [disconnectWallet, onSuccess]);

  return {
    handleConnect,
    isConnecting,
    isWalletConnected,
    connectionError,
    walletAddress,
    disconnectWallet
  };
};

export default WalletConnector;