// utils/ethereum-utils.ts

/** 
 * Forces MetaMask to show account selection dialog by clearing previous permissions
 * This helps prevent auto-connecting with previously used accounts
 * 
 * @returns Promise<string[]> Array of selected account addresses 
 */
export async function requestAccountsWithPrompt(): Promise<string[]> {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }
  
  try {
    // First try to reset permissions to force the selection dialog
    try {
      // This will clear cached permissions so the user sees the account selection dialog
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      });
    } catch (permissionError) {
      console.warn('Failed to request permissions, will continue with normal account request:', permissionError);
    }
    
    // Now request accounts, which should show the selection dialog
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    
    return accounts || [];
  } catch (error) {
    if (error.code === 4001) {
      // User rejected the request
      throw new Error('User rejected the connection request');
    }
    throw error;
  }
}

/** 
 * Checks if a wallet address is already connected to a user account
 * 
 * @param address Ethereum wallet address to check
 * @returns Promise<boolean> True if wallet is already used, false otherwise
 */
export async function isWalletAlreadyConnected(address: string): Promise<boolean> {
  try {
    if (!address) return false;
    
    // Normalize the address for comparison
    const normalizedAddress = address.toLowerCase();
    
    // Make API call to your backend to check if wallet is already connected
    const response = await fetch('/api/check-wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ walletAddress: normalizedAddress })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      // If error status is 409, that means the wallet is already in use
      if (response.status === 409) {
        return true;
      }
      throw new Error(errorData?.message || 'Error checking wallet status');
    }
    
    const data = await response.json();
    return !!data.isConnected;
  } catch (error) {
    console.error('Error checking wallet connection status:', error);
    // Return false by default - let the actual connection attempt handle errors
    return false;
  }
}