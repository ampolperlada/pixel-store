// utils/ethereum-utils.ts
declare global {
  interface Window {
    ethereum?: any;
  }
}

/**
 * Connects to a wallet using MetaMask or other Web3 providers
 * @returns {Promise<string>} The connected wallet address
 */
export const connectWallet = async (): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('No Ethereum wallet detected. Please install MetaMask or another Web3 wallet.');
  }

  try {
    // Request wallet connection
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts returned from wallet.');
    }

    // Return the first account address
    return accounts[0];
  } catch (error: any) {
    // Handle specific error cases from MetaMask
    if (error.code === 4001) {
      throw new Error('Connection rejected by user.');
    } else if (error.code === -32002) {
      throw new Error('Request already pending. Please check your wallet.');
    }
    
    // Handle other errors
    throw error;
  }
};

/**
 * Disconnects the wallet
 * Note: There is no standard way to disconnect wallets in Web3.
 * This function is mostly for state management within the app.
 */
export const disconnectWallet = (): void => {
  // MetaMask doesn't have a "logout" function, so we just
  // update our application state to reflect disconnection
  console.log('Wallet disconnected from application');
  
  // Some apps trigger this event to notify components about disconnection
  window.dispatchEvent(new Event('walletDisconnected'));
};

/**
 * Checks if a wallet is already connected
 * @returns {Promise<string|null>} The connected wallet address or null
 */
export const checkWalletConnection = async (): Promise<string | null> => {
  if (!window.ethereum) {
    return null;
  }

  try {
    // This is a non-intrusive way to check if the user is already connected
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });

    return accounts && accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return null;
  }
};

/**
 * Gets the current network ID from the connected wallet
 * @returns {Promise<number>} The network ID (e.g., 1 for Ethereum mainnet)
 */
export const getNetworkId = async (): Promise<number> => {
  if (!window.ethereum) {
    throw new Error('No Ethereum wallet detected');
  }

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return parseInt(chainId, 16);
  } catch (error) {
    console.error('Error getting network ID:', error);
    throw error;
  }
};

/**
 * Requests a wallet to switch to a specific network
 * @param {number} chainId The network ID to switch to
 * @returns {Promise<void>}
 */
export const switchNetwork = async (chainId: number): Promise<void> => {
  if (!window.ethereum) {
    throw new Error('No Ethereum wallet detected');
  }

  const chainIdHex = `0x${chainId.toString(16)}`;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      throw new Error('This network is not available in your wallet. Please add it first.');
    }
    throw error;
  }
};

/**
 * Signs a message with the connected wallet
 * @param {string} address The address to sign with
 * @param {string} message The message to sign
 * @returns {Promise<string>} The signature
 */
export const signMessage = async (address: string, message: string): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('No Ethereum wallet detected');
  }

  try {
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address],
    });
    
    return signature;
  } catch (error) {
    console.error('Error signing message:', error);
    throw error;
  }
};