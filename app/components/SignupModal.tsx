'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<any>;
    };
  }
}
import GoogleReCAPTCHA from 'react-google-recaptcha';
import { useRouter } from 'next/navigation';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletState, setWalletState] = useState<{
    address: string | null;
    status: 'disconnected' | 'connecting' | 'connected' | 'error';
  }>({
    address: null,
    status: 'disconnected'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (isGoogleSignup = false): boolean => {
    const errors: Record<string, string> = {};
  
    // Only validate username and email for regular signup
    if (!isGoogleSignup) {
      if (!formData.username) errors.username = 'Username is required';
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email is invalid';
      }
    }
  
    // Always validate password for regular signup
    if (!isGoogleSignup && !formData.password) errors.password = 'Password is required';
    if (!isGoogleSignup && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  
    // Always validate terms and conditions
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the Terms and Conditions';
    }
  
    // Only validate captcha for regular signup
    if (!isGoogleSignup && !captchaToken) {
      errors.captcha = 'Please complete the CAPTCHA';
    }
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConnectWallet = async () => {
    try {
      setWalletState({ address: null, status: 'connecting' });
      
      // Check if Ethereum provider is available
      if (window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        // Update wallet state with the first account
        setWalletState({
          address: accounts[0], // Now accounts is properly defined
          status: 'connected'
        });
      } else {
        throw new Error('Ethereum wallet not detected');
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setWalletState({
        address: null,
        status: 'error'
      });
      setFormErrors({
        ...formErrors,
        wallet: 'Wallet connection failed. Please try again or skip this step.'
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (!validateForm()) return;
  
    setIsSubmitting(true);
  
    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        wallet_address: walletState.address,
        agreedToTerms: formData.agreeToTerms,
        profile_image_url: undefined,
        captchaToken: captchaToken
      };
  
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || result.error || 'Signup failed');
      }
      
      console.log('User signed up successfully', result);
      onClose();
      router.refresh();
    } catch (error) {
      console.error('Error during signup process:', error);
      setFormErrors({ 
        submit: error instanceof Error ? error.message : 'An error occurred. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      // Only validate the terms agreement for Google signup
      if (!formData.agreeToTerms) {
        setFormErrors({
          agreeToTerms: 'You must agree to the Terms and Conditions'
        });
        return;
      }

        // 2. Check CAPTCHA
    if (!captchaToken) {
      setFormErrors({
        captcha: 'Please complete the CAPTCHA before continuing.'
      });
      return;
    }
      
      setIsSubmitting(true);
      
      // This redirects to Google OAuth flow
      await signIn('google', { 
        callbackUrl: '/api/auth/google-callback',
        redirect: false
      });
      
      // The rest of the process will be handled by NextAuth.js in the callback
    } catch (error) {
      console.error('Error initiating Google signup:', error);
      setFormErrors({ 
        submit: error instanceof Error ? error.message : 'Google signup failed. Please try again.' 
      });
      setIsSubmitting(false);
    }
  };
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    if (token) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.captcha;
        return newErrors;
      });
    }
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
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter your username"
                />
                {formErrors.username && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
                {formErrors.email && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  {formErrors.password && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  {formErrors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Wallet Connection Button */}
              <button
                type="button"
                onClick={handleConnectWallet}
                disabled={walletState.status === 'connecting'}
                className={`w-full py-3 rounded-lg font-medium transition-all border ${
                  walletState.status === 'connected'
                    ? 'bg-green-600/20 border-green-500 text-green-400'
                    : walletState.status === 'connecting'
                    ? 'bg-gray-600/50 border-gray-500 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/50 hover:border-purple-500/70'
                }`}
              >
                {walletState.status === 'connecting' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </span>
                ) : walletState.status === 'connected' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Wallet Connected
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Connect Wallet (Optional)
                  </span>
                )}
              </button>

              {walletState.status === 'connected' && (
                <p className="text-xs text-green-400">
                  Wallet will be linked to your account: {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
                </p>
              )}

              {formErrors.wallet && (
                <p className="text-red-400 text-xs mt-1">{formErrors.wallet}</p>
              )}

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 border border-gray-600 rounded bg-gray-700 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <label className="ml-3 text-sm text-gray-300">
                  I agree to the <a href="#" className="text-cyan-400 hover:underline">Terms and Conditions</a>
                </label>
              </div>
              {formErrors.agreeToTerms && (
                <p className="text-red-400 text-xs mt-1">{formErrors.agreeToTerms}</p>
              )}

              <div className="flex justify-center mt-4">
                <GoogleReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={handleCaptchaChange}
                  theme="dark"
                />
              </div>
              {formErrors.captcha && (
                <p className="text-red-400 text-xs text-center mt-1">{formErrors.captcha}</p>
              )}

              {formErrors.submit && (
                <p className="text-red-400 text-sm text-center mt-1 p-2 bg-red-900/20 border border-red-800/50 rounded">
                  {formErrors.submit}
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
                  <path d="M12 23C14.97 23 17.46 21.99 19.28 20.115L15.725 17.575C14.745 18.235 13.48 18.625 12 18.625C9.135 18.625 6.71 16.69 5.845 14.09H2.17V16.66C3.98 20.21 7.7 23 12 23Z" fill="#34A853"/>
                  <path d="M5.845 14.09C5.625 13.43 5.5 12.725 5.5 12C5.5 11.275 5.625 10.57 5.845 9.91V7.34H2.17C1.4 8.735 1 10.32 1 12C1 13.68 1.4 15.265 2.17 16.66L5.845 14.09Z" fill="#FBBC05"/>
                  <path d="M12 5.375C13.615 5.375 15.065 5.93 16.205 7.02L19.36 3.865C17.455 2.09 14.965 1 12 1C7.7 1 3.98 3.79 2.17 7.34L5.845 9.91C6.71 7.31 9.135 5.375 12 5.375Z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Already have an account?{' '}
                  <button className="text-cyan-400 hover:underline font-medium">Sign in</button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;