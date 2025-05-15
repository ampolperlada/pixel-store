// Updated SignupForm.tsx to work with your WalletConnector
import { useState, useEffect } from 'react';
import { useAuth } from '../components/context/AuthContext';
import WalletConnector from './WalletConnector';

interface SignupFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

const SignupForm = ({ onSuccess, onError }: SignupFormProps) => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  
  // Use your WalletConnector hook
  const { 
    handleConnect, 
    isConnecting, 
    isWalletConnected, 
    connectionError, 
    walletAddress,
    disconnectWallet,
    isMetaMaskInstalled,
    conflictingUser
  } = WalletConnector({
    onError: (err) => onError(err.message),
    onSuccess: (address) => {
      console.log(`Wallet successfully connected: ${address}`);
    }
  });

  // Ensure no wallet is auto-connected on component mount
  useEffect(() => {
    // Your WalletConnector's useEffect should already handle this
    console.log('SignupForm mounted - ensuring no auto-connected wallets');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return;
    }

    if (password !== confirmPassword) {
      onError('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      onError('You must agree to the Terms and Conditions');
      return;
    }

    if (!captchaToken) {
      onError('Please complete the CAPTCHA verification');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Only include wallet address if it's actually connected
      const registrationData = {
        username,
        email,
        password,
        agreedToTerms,
        captchaToken
      };
      
      // Add wallet address only if it's connected successfully
      if (isWalletConnected && walletAddress) {
        console.log(`Including wallet address in registration: ${walletAddress}`);
        Object.assign(registrationData, { walletAddress });
      } else {
        console.log('No wallet address to include in registration');
      }
      
      await register(registrationData);
      onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        onError(err.message);
      } else {
        onError('An error occurred during registration');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username input */}
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      {/* Email input */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      {/* Password input */}
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      {/* Confirm Password input */}
      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      {/* Wallet Connection section */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Wallet Connection (Optional)</label>
        
        {isWalletConnected ? (
          <div className="p-4 bg-green-50 text-green-700 rounded">
            <div className="flex items-center">
              <CheckIcon className="w-5 h-5 mr-2" />
              <span>Wallet Connected</span>
            </div>
            <p className="text-sm mt-1">
              Wallet will be linked to your account: 
              <span className="font-mono text-sm block mt-1 truncate">{walletAddress}</span>
            </p>
            <div className="flex mt-2 space-x-2">
              <button
                type="button"
                className="px-3 py-1 text-sm bg-green-100 hover:bg-green-200 rounded"
                onClick={() => handleConnect()}
              >
                Change Wallet
              </button>
              <button
                type="button"
                className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded"
                onClick={() => disconnectWallet()}
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : connectionError ? (
          <div className="p-4 bg-red-50 text-red-700 rounded mb-4">
            <div className="flex items-center">
              <ExclamationIcon className="w-5 h-5 mr-2" />
              <span>Connection Error</span>
            </div>
            <p className="text-sm mt-1">{connectionError}</p>
            {conflictingUser && (
              <p className="text-sm mt-1">
                This wallet is already linked to user: <strong>{conflictingUser}</strong>
              </p>
            )}
            <button
              type="button"
              className="mt-2 px-3 py-1 text-sm bg-red-100 hover:bg-red-200 rounded"
              onClick={() => handleConnect()}
            >
              Try Again
            </button>
          </div>
        ) : !isMetaMaskInstalled ? (
          <div className="p-4 bg-yellow-50 text-yellow-700 rounded mb-4">
            <div className="flex items-center">
              <ExclamationIcon className="w-5 h-5 mr-2" />
              <span>MetaMask Not Detected</span>
            </div>
            <p className="text-sm mt-1">
              To connect a wallet, please install the MetaMask browser extension.
            </p>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-3 py-1 text-sm bg-yellow-100 hover:bg-yellow-200 rounded inline-block"
            >
              Download MetaMask
            </a>
          </div>
        ) : (
          <div>
            <p className="text-sm mb-2 text-gray-600">
              Connect your wallet to access advanced features (optional)
            </p>
            <button
              type="button"
              className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded flex items-center justify-center"
              onClick={() => handleConnect()}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <SpinnerIcon className="w-5 h-5 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <WalletIcon className="w-5 h-5 mr-2" />
                  Connect Wallet
                </>
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* Terms and Conditions */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mr-2"
          />
          <span>I agree to the <a href="/terms" className="text-blue-500">Terms and Conditions</a></span>
        </label>
      </div>
      
      {/* reCAPTCHA component would go here */}
      <div className="mb-4">
        {/* Placeholder for CAPTCHA component */}
        <p className="text-sm text-gray-500">CAPTCHA verification component here</p>
      </div>
      
      {/* Submit button */}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <SpinnerIcon className="w-5 h-5 mr-2 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
};

// Icons
const CheckIcon = (props: any) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ExclamationIcon = (props: any) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const WalletIcon = (props: any) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const SpinnerIcon = (props: any) => (
  <svg {...props} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default SignupForm;