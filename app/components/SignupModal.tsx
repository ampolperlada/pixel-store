'use client';

import React, { useState, useRef, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import GoogleReCAPTCHA from 'react-google-recaptcha';

// Updated and consolidated ethereum type definition
declare global {
  interface Ethereum {
    isMetaMask?: boolean;
    request: (request: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
  }
  
  interface Window {
    ethereum?: Ethereum;
  }
}

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
  onSuccess?: (user: any) => void;
  toast?: {
    showToast: (message: string, type: string) => void;
  };
}

// Helper function to format Ethereum addresses
const formatEthereumAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSwitchToLogin, onSuccess, toast }) => {
  const router = useRouter();
  const captchaRef = useRef<GoogleReCAPTCHA>(null);
  
  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Error state
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
    terms: '',
    general: '',
    wallet: ''
  });
  
  // Enhanced wallet connection state
  const [walletState, setWalletState] = useState({
    isConnecting: false,
    isConnected: false,
    address: null as string | null,
    error: null as string | null,
    conflictingUser: null as string | null,
    isMetaMaskInstalled: false
  });

  // Check for MetaMask on component mount
  useEffect(() => {
    setWalletState(prev => ({
      ...prev,
      isMetaMaskInstalled: typeof window !== 'undefined' && 
        typeof window.ethereum !== 'undefined' && 
        !!window.ethereum.isMetaMask
    }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // Clear error for this field
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    
    // Update the appropriate state
    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      case 'agreeToTerms':
        setAgreedToTerms(checked);
        break;
    }
  };

  const handleConnectWallet = async () => {
    try {
      setWalletState({
        isConnecting: true,
        isConnected: false,
        address: null,
        error: null,
        conflictingUser: null,
        isMetaMaskInstalled: walletState.isMetaMaskInstalled
      });
      
      // Check if Ethereum provider is available
      if (!window.ethereum) {
        throw new Error('MetaMask not detected. Please install the extension.');
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (!accounts?.[0]) {
        throw new Error('No accounts found or user rejected the request');
      }
      
      // Ensure the address is properly formatted
      const formattedAddress = accounts[0].toLowerCase();
      
      // Validate the address format
      if (!/^0x[a-f0-9]{40}$/i.test(formattedAddress)) {
        throw new Error('Invalid wallet address format');
      }
      
      // Check if wallet is already connected to another account
      const res = await fetch('/api/check-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: formattedAddress })
      });
      
      if (!res.ok) {
        const data = await res.json();
        if (res.status === 409) {
          throw new Error(data.error || 'Wallet already connected', {
            cause: { conflictingUser: data.conflictingUser }
          });
        }
        throw new Error(data.error || 'Wallet check failed');
      }

      // Update wallet state
      setWalletState({
        isConnecting: false,
        isConnected: true,
        address: formattedAddress,
        error: null,
        conflictingUser: null,
        isMetaMaskInstalled: true
      });

    } catch (error) {
      setWalletState({
        isConnecting: false,
        isConnected: false,
        address: null,
        error: error instanceof Error ? error.message : 'Connection failed',
        conflictingUser:
          error instanceof Error && typeof (error as any).cause === 'object'
            ? (error as any).cause?.conflictingUser || null
            : null,
        isMetaMaskInstalled: walletState.isMetaMaskInstalled
      });
      
      // Also set the error in the form errors
      setErrors(prev => ({
        ...prev,
        wallet: error instanceof Error ? error.message : 'Wallet connection failed'
      }));
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      isConnecting: false,
      isConnected: false,
      address: null,
      error: null,
      conflictingUser: null,
      isMetaMaskInstalled: walletState.isMetaMaskInstalled
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Clear previous errors
    setErrors({
      username: '',
      email: '',
      password: '',
      confirm: '',
      terms: '',
      general: '',
      wallet: ''
    });

    // Client-side validation
    let hasErrors = false;
    const newErrors = { ...errors };

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      hasErrors = true;
    } else if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      newErrors.username = 'Username must be 3-30 characters (letters, numbers, underscores)';
      hasErrors = true;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      hasErrors = true;
    }

    if (!isGoogleSignup) {
      if (!password) {
        newErrors.password = 'Password is required';
        hasErrors = true;
      } else if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
        hasErrors = true;
      }

      if (password !== confirmPassword) {
        newErrors.confirm = 'Passwords do not match';
        hasErrors = true;
      }
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // Captcha validation
    if (!isGoogleSignup && !captchaToken) {
      try {
        const token = await captchaRef.current?.executeAsync();
        setCaptchaToken(token || '');
        if (!token) {
          setErrors({ ...errors, general: 'CAPTCHA verification failed' });
          return;
        }
      } catch (error) {
        console.error('CAPTCHA error:', error);
        setErrors({ ...errors, general: 'CAPTCHA verification failed' });
        return;
      }
    }

    // Proceed with form submission
    setIsSubmitting(true);

    try {
      // 1. First create the user account
      const signupResponse = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          wallet_address: walletState.address || null,
          agreedToTerms,
          profile_image_url: '',
          captchaToken,
          isGoogleSignup
        }),
      });

      const signupData = await signupResponse.json();

      if (!signupResponse.ok) {
        throw new Error(signupData.error || 'Signup failed. Please try again.');
      }

      // 2. Attempt auto sign-in for email/password signup
      if (!isGoogleSignup) {
        console.log('Attempting auto sign-in...');
        const signInResult = await signIn('credentials', {
          redirect: false,
          email,
          password,
          callbackUrl: '/dashboard'
        });

        if (signInResult?.error) {
          throw new Error(`Auto sign-in failed: ${signInResult.error}`);
        }

        // 3. If wallet was connected, link it to the account
        if (walletState.address) {
          try {
            const walletResponse = await fetch('/api/connect-wallet', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                // If you need an Authorization header, obtain a token after sign-in
              },
              body: JSON.stringify({
                walletAddress: walletState.address
              }),
            });

            if (!walletResponse.ok) {
              console.warn('Wallet connection failed (non-critical)');
            }
          } catch (walletError) {
            console.warn('Wallet connection error:', walletError);
          }
        }

        // Success handling
        if (toast) {
          toast.showToast('Account created successfully!', 'success');
          if (walletState.address) {
            toast.showToast('Wallet connected successfully!', 'success');
          }
        }

        // Close modal and redirect
        onClose();
        router.push(signInResult?.url || '/dashboard');
      } else {
        // For Google signup, just close the modal
        onClose();
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({
        ...errors,
        general: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      if (!agreedToTerms) {
        setErrors({
          ...errors,
          terms: 'You must agree to the Terms and Conditions'
        });
        return;
      }
      
      setIsGoogleSignup(true);
      setIsSubmitting(true);
      
      // Sign in with Google via NextAuth
      const result = await signIn('google', { 
        redirect: false,
        callbackUrl: window.location.origin 
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      // Close the modal if successful
      if (!result?.error) {
        onClose();
      }
    } catch (error) {
      console.error('Error initiating Google signup:', error);
      setErrors({ 
        ...errors,
        general: error instanceof Error ? error.message : 'Google signup failed. Please try again.' 
      });
      setIsGoogleSignup(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    if (!token) {
      setErrors(prev => ({
        ...prev,
        general: 'Please complete the CAPTCHA verification'
      }));
    }
  };

  const handleSwitchToLogin = () => {
    // Reset form state before switching
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setAgreedToTerms(false);
    setCaptchaToken(null);
    setErrors({
      username: '',
      email: '',
      password: '',
      confirm: '',
      terms: '',
      general: '',
      wallet: ''
    });
    
    // Reset wallet state
    setWalletState({
      isConnecting: false,
      isConnected: false,
      address: null,
      error: null,
      conflictingUser: null,
      isMetaMaskInstalled: walletState.isMetaMaskInstalled
    });
    
    // If onSwitchToLogin is provided, call it
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      console.warn("No onSwitchToLogin callback provided");
    }
    
    // Close this modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-5xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-xl border border-cyan-500/50 shadow-2xl shadow-cyan-500/10 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
          Create Your Account
        </h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Form */}
          <div className="flex-1">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="text-red-400 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  {errors.confirm && (
                    <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>
                  )}
                </div>
              </div>

              {/* Enhanced Wallet Connection Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Wallet Connection (Optional)
                </label>
                
                {walletState.isConnected ? (
                  <div className="p-4 bg-green-900/20 text-green-400 rounded-lg border border-green-800/50">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Wallet Connected</span>
                    </div>
                    <p className="text-sm mt-1">
                      Wallet will be linked to your account: 
                      <span className="font-mono text-sm block mt-1">
                        {formatEthereumAddress(walletState.address || '')}
                      </span>
                    </p>
                    <div className="flex mt-2 space-x-2">
                      <button
                        type="button"
                        className="px-3 py-1 text-sm bg-green-900/30 hover:bg-green-800/50 rounded"
                        onClick={handleConnectWallet}
                      >
                        Change Wallet
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1 text-sm bg-red-900/30 hover:bg-red-800/50 text-red-400 rounded"
                        onClick={disconnectWallet}
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                ) : walletState.error ? (
                  <div className="p-4 bg-red-900/20 text-red-400 rounded-lg border border-red-800/50 mb-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                      </svg>
                      <span>Connection Error</span>
                    </div>
                    <p className="text-sm mt-1">{walletState.error}</p>
                    {walletState.conflictingUser && (
                      <p className="text-sm mt-1">
                        This wallet is already linked to user: <strong>{walletState.conflictingUser}</strong>
                      </p>
                    )}
                    <button
                      type="button"
                      className="mt-2 px-3 py-1 text-sm bg-red-900/30 hover:bg-red-800/50 rounded"
                      onClick={handleConnectWallet}
                    >
                      Try Again
                    </button>
                  </div>
                ) : !walletState.isMetaMaskInstalled ? (
                  <div className="p-4 bg-yellow-900/20 text-yellow-400 rounded-lg border border-yellow-800/50 mb-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                      </svg>
                      <span>MetaMask Not Detected</span>
                    </div>
                    <p className="text-sm mt-1">
                      To connect a wallet, please install the MetaMask browser extension.
                    </p>
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 px-3 py-1 text-sm bg-yellow-900/30 hover:bg-yellow-800/50 rounded inline-block"
                    >
                      Download MetaMask
                    </a>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm mb-2 text-gray-400">
                      Connect your wallet to access advanced features (optional)
                    </p>
                    <button
                      type="button"
                      className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded flex items-center justify-center"
                      onClick={handleConnectWallet}
                      disabled={walletState.isConnecting}
                    >
                      {walletState.isConnecting ? (
                        <>
                          <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Connecting...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                          </svg>
                          Connect Wallet
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={agreedToTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 border border-gray-600 rounded bg-gray-700 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <label className="ml-3 text-sm text-gray-300">
                  I agree to the <a href="#" className="text-cyan-400 hover:underline">Terms and Conditions</a>
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-400 text-xs mt-1">{errors.terms}</p>
              )}

              <div className="flex justify-center mt-4">
                <GoogleReCAPTCHA
                  ref={captchaRef}
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                  onChange={handleCaptchaChange}
                  theme="dark"
                />
              </div>
              {errors.general && (
                <p className="text-red-400 text-sm text-center mt-1 p-2 bg-red-900/20 border border-red-800/50 rounded">
                  {errors.general}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : 'Create Account'}
              </button>
            </form>
          </div>

          {/* Right Column - Social/Alternative Options */}
          <div className="flex-1 flex flex-col lg:border-l lg:border-gray-700/50 lg:pl-8">
            <div className="h-full flex flex-col justify-center space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-400">Or sign up with</p>
              </div>
              
              <button
                onClick={handleGoogleSignup}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-medium transition-all duration-300 border border-gray-600 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.255H17.92C17.665 15.63 16.89 16.795 15.725 17.575V20.115H19.28C21.36 18.14 22.56 15.42 22.56 12.25Z" fill="#4285F4"/>
 <path d="M12 23C14.97 23 17.46 21.99 19.28 20.115L15.725 17.575C14.745 18.235 13.48 18.625 12 18.625C9.135 18.625 6.71 16.69 5.845 14.09H2.17V16.695C3.98 20.375 7.7 23 12 23Z" fill="#34A853"/>
                  <path d="M5.845 14.09C5.625 13.43 5.505 12.725 5.505 12C5.505 11.275 5.625 10.57 5.845 9.91V7.305H2.17C1.4 8.76 0.975 10.35 0.975 12C0.975 13.65 1.4 15.24 2.17 16.695L5.845 14.09Z" fill="#FBBC05"/>
                  <path d="M12 5.375C13.615 5.375 15.065 5.93 16.205 7.02L19.36 3.865C17.455 2.09 14.965 1 12 1C7.7 1 3.98 3.625 2.17 7.305L5.845 9.91C6.71 7.31 9.135 5.375 12 5.375Z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div className="text-center my-4">
                <p className="text-sm text-gray-400">Already have an account?</p>
              </div>

              <button
                onClick={handleSwitchToLogin}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-indigo-500/20"
              >
                Sign In Instead
              </button>

              <div className="border-t border-gray-700/50 mt-6 pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-4">Why Create an Account?</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-cyan-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-sm text-gray-300">Access exclusive content and features</p>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-cyan-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-sm text-gray-300">Participate in community discussions</p>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-cyan-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-sm text-gray-300">Connect your wallet for blockchain features</p>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-cyan-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-sm text-gray-300">Track your progress and achievements</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;