// WalletConnector.tsx - A component to handle wallet connections
import { useState, useEffect } from 'react';
import { useAuth } from '../components/context/AuthContext';

interface WalletConnectorProps {
  onConnected?: (address: string) => void;
  onError?: (error: Error) => void;
  onConnectionStart?: () => void;
  onConnectionComplete?: () => void;
}

const WalletConnector = ({
  onConnected,
  onError,
  onConnectionStart,
  onConnectionComplete
}: WalletConnectorProps) => {
  const { user, connectWallet } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Clear previous connection errors when the component mounts
  useEffect(() => {
    setConnectionError(null);
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionError(null);
    
    if (onConnectionStart) {
      onConnectionStart();
    }

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to connect your wallet.');
      }

      // Request account access and get accounts
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts'
        // This forces MetaMask to show the account selection UI
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your MetaMask wallet and try again.');
      }

      // Use the first account
      const address = accounts[0];
      
      // Verify the wallet is not already connected to another account
      await connectWallet(address);
      
      // Call the success callback
      if (onConnected) {
        onConnected(address);
      }
    } catch (err) {
      // Handle specific errors
      if (err instanceof Error) {
        // Handle wallet already connected error specifically
        if (err.message.includes('already connected to another account')) {
          setConnectionError('This wallet is already connected to another account. Please use a different wallet.');
        } else {
          setConnectionError(err.message);
        }
        
        if (onError) {
          onError(err);
        }
      } else {
        setConnectionError('An unknown error occurred while connecting wallet');
        if (onError) {
          onError(new Error('Unknown wallet connection error'));
        }
      }
    } finally {
      setIsConnecting(false);
      if (onConnectionComplete) {
        onConnectionComplete();
      }
    }
  };

  // Check if the wallet is already connected
  const isWalletConnected = user?.wallet_address && user?.is_wallet_connected;

  return {
    handleConnect,
    isConnecting,
    isWalletConnected,
    connectionError,
    walletAddress: user?.wallet_address || null
  };
};

export default WalletConnector;