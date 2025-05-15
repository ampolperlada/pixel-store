// Updated WalletConnector.tsx with disconnectWallet function
import { useState, useEffect, useCallback } from 'react';

// Import the utility functions you provided
import { requestAccountsWithPrompt, isWalletAlreadyConnected } from '../components/utils/ethereum-utils';

interface WalletConnectorProps {
  onError?: (error: Error) => void;
  onSuccess?: (address: string) => void;
}

const WalletConnector = ({ onError, onSuccess }: WalletConnectorProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [conflictingUser, setConflictingUser] = useState<string | null>(null);

  // Function to handle wallet connection
  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      // Use the function that forces the account selection prompt
      const accounts = await requestAccountsWithPrompt();
      
      if (accounts && accounts.length > 0) {
        const selectedAddress = accounts[0];
        
        // Check if wallet is already in use before setting it as connected
        const walletAlreadyInUse = await isWalletAlreadyConnected(selectedAddress);
        
        if (walletAlreadyInUse) {
          // Extract the username of the conflicting user if available
          let errorMessage = 'This wallet is already connected to another account';
          let conflictingUsername = null;
          
          try {
            const response = await fetch('/api/check-wallet', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ walletAddress: selectedAddress })
            });
            
            if (response.ok) {
              const data = await response.json();
              conflictingUsername = data.conflictingUser;
            } else if (response.status === 409) {
              const data = await response.json();
              conflictingUsername = data.conflictingUser;
              errorMessage = data.message || errorMessage;
            }
          } catch (error) {
            console.error('Error fetching wallet conflict details:', error);
          }
          
          setConflictingUser(conflictingUsername);
          throw new Error(errorMessage);
        }
        
        // Wallet is available, set it as connected
        setWalletAddress(selectedAddress);
        setIsWalletConnected(true);
        
        if (onSuccess) {
          onSuccess(selectedAddress);
        }
      } else {
        throw new Error('No accounts returned from wallet');
      }
    } catch (error) {
      setIsWalletConnected(false);
      
      if (error instanceof Error) {
        setConnectionError(error.message);
        if (onError) {
          onError(error);
        }
      } else {
        const genericError = new Error('Failed to connect wallet');
        setConnectionError(genericError.message);
        if (onError) {
          onError(genericError);
        }
      }
    } finally {
      setIsConnecting(false);
    }
  }, [onError, onSuccess]);

  // Function to disconnect wallet
  const disconnectWallet = useCallback(() => {
    // Clear the wallet state in our application
    setWalletAddress(null);
    setIsWalletConnected(false);
    setConnectionError(null);
    setConflictingUser(null);
    
    // Note: MetaMask doesn't have a true "disconnect" function,
    // so we're just clearing our application state
    console.log('Wallet disconnected from application');
    
    // Dispatch a custom event to notify other components if needed
    window.dispatchEvent(new Event('walletDisconnected'));
  }, []);

  // Check if MetaMask is installed
  const checkMetaMaskInstalled = useCallback(() => {
    return Boolean(window.ethereum);
  }, []);

  // Check for existing wallet connection on component mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (window.ethereum) {
        // Check if there are any connected accounts
        try {
          const accounts: string[] = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            // This means MetaMask is connected to the site, but we may still want
            // to check if it's linked to another user account before allowing connection
            // For signup form, we probably want to start disconnected anyway
            disconnectWallet();
          }
        } catch (error) {
          console.error('Error checking existing wallet connection:', error);
        }
      }
    };
    
    checkExistingConnection();
  }, [disconnectWallet]);

  return {
    handleConnect,
    isConnecting,
    isWalletConnected,
    connectionError,
    walletAddress,
    isMetaMaskInstalled: checkMetaMaskInstalled(),
    conflictingUser,
    disconnectWallet
  };
};

export default WalletConnector;