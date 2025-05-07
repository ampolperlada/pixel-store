// lib/walletUtils.ts

/**
 * Connect to a crypto wallet
 * This is a simplified implementation - replace with your actual wallet connection logic
 */
export async function connectWallet() {
    try {
      // Check if the wallet extension is available (e.g., MetaMask)
      if (typeof window !== 'undefined' && window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Get the first account
        const address = accounts[0];
        
        console.log('Wallet connected:', address);
        return address;
      } else {
        throw new Error('No wallet extension found. Please install MetaMask or another compatible wallet.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }
  
  /**
   * Disconnect from the crypto wallet
   * This is a simplified implementation - replace with your actual wallet disconnection logic
   */
  export async function disconnectWallet() {
    try {
      // For most wallets like MetaMask, there's no direct "disconnect" method
      // We just need to clear our app's state
      
      console.log('Wallet disconnected');
      return true;
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  }
  
  /**
   * Get the current connected wallet address, if any
   */
  export async function getCurrentWalletAddress() {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        return accounts.length > 0 ? accounts[0] : null;
      }
      return null;
    } catch (error) {
      console.error('Error getting current wallet address:', error);
      return null;
    }
  }
  
 