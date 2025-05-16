import { useEffect } from 'react';

/**
 * Utility functions for Ethereum wallet interactions
 */

/**
 * Checks if a wallet address is valid
 * @param address Ethereum wallet address to validate
 * @returns boolean indicating if the address is valid
 */
export const isValidEthereumAddress = (address: string): boolean => {
  // Basic validation - should be 42 chars long and start with 0x
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Formats an Ethereum address for display (shortens it)
 * @param address Full Ethereum address
 * @returns Shortened address with ellipsis in the middle
 */
export const formatEthereumAddress = (address: string): string => {
  if (!address) return '';
  if (!isValidEthereumAddress(address)) return address;
  
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Hook to detect MetaMask or other Ethereum providers
 * @returns Boolean indicating if MetaMask is installed
 */
export const useEthereumDetection = (): boolean => {
  let isEthereumAvailable = false;
  
  if (typeof window !== 'undefined') {
    isEthereumAvailable = window.ethereum !== undefined;
  }
  
  return isEthereumAvailable;
};

/**
 * Function to check if a wallet address is already registered
 * This would typically make an API call to your backend
 * 
 * @param address Ethereum wallet address to check
 * @returns Promise resolving to validation result
 */
export const checkWalletAvailability = async (address: string): Promise<{
  available: boolean;
  existingUser?: string;
}> => {
  try {
    // Mock API call - replace with actual API call to your backend
    // const response = await fetch(`/api/wallet/check?address=${address}`);
    // const data = await response.json();
    
    // Placeholder response
    const mockResult = {
      available: true,
      existingUser: undefined
    };
    
    return mockResult;
  } catch (error) {
    console.error('Error checking wallet availability:', error);
    throw new Error('Failed to check wallet availability');
  }
};