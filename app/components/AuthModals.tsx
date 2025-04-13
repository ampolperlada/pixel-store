'use client'; // Add this directive at the top

import React, { useState, useEffect } from 'react';
import ReCAPTCHA from "react-google-recaptcha"; // Import ReCAPTCHA

interface AuthModalsProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  // Added trigger reason for the modal
  triggerReason?: 'restricted-feature' | 'pixel-art-studio' | 'marketplace' | 'general';
}

// Expanded interface for the auth context we'll reference
interface AuthContextType {
  isAuthenticated: boolean;
  walletConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<string | null>;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (userData: UserSignupData) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  setupTwoFactorAuth: () => Promise<string>; // For future 2FA implementation
  validateTwoFactorCode: (code: string) => Promise<boolean>; // For future 2FA implementation
}

interface UserSignupData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  walletAddress: string | null;
  agreeToTerms: boolean;
  captchaToken?: string; // Add captcha token
}

interface OAuthProvider {
  name: string;
  icon: string;
  color: string;
  authUrl: string;
}

const AuthModals: React.FC<AuthModalsProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login',
  triggerReason = 'general'
}) => {
  const [mode, setMode] = useState(initialMode);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    agreeToTerms: false
  });
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // New states for added features
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [emailVerificationInstructions, setEmailVerificationInstructions] = useState(false);

  // OAuth providers configuration
  const oauthProviders: OAuthProvider[] = [
    {
      name: 'Google',
      icon: '🔍', // Replace with actual icon in production
      color: 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300',
      authUrl: '/api/auth/google' // Your actual OAuth endpoint
    },
    {
      name: 'GitHub',
      icon: '💻', // Replace with actual icon in production
      color: 'bg-gray-800 hover:bg-gray-900 text-white',
      authUrl: '/api/auth/github' // Your actual OAuth endpoint
    }
  ];

  // Update mode when initialMode changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Animation for modal appearance
  useEffect(() => {
    if (isOpen) {
      // Short delay before showing to allow for animation
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Toggle between login and signup
  const toggleMode = () => {
    setGlitchEffect(true);
    setTimeout(() => {
      setMode(mode === 'login' ? 'signup' : 'login');
      setGlitchEffect(false);
      // Reset form when toggling modes
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
        agreeToTerms: false
      });
      setFormErrors({});
      setCaptchaToken(null);
      setEmailVerificationSent(false);
      setEmailVerificationInstructions(false);
    }, 500);
  };

  // Random glitch effect interval
  useEffect(() => {
    if (!isOpen) return;
    
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 150);
    }, Math.random() * 5000 + 3000);
    
    return () => clearInterval(glitchInterval);
  }, [isOpen]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle CAPTCHA completion
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    if (token) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.captcha;
        return newErrors;
      });
    }
  };

  // Simulate wallet connection
  const connectWallet = async () => {
    setIsConnectingWallet(true);
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful wallet connection
      const mockAddress = '0x' + Math.random().toString(16).substring(2, 12) + '...';
      setWalletAddress(mockAddress);
      return mockAddress;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return null;
    } finally {
      setIsConnectingWallet(false);
    }
  };
  
  // Handle OAuth login
  const handleOAuthLogin = (provider: OAuthProvider) => {
    // In a real implementation, you would redirect to the provider's auth URL
    console.log(`Authenticating with ${provider.name}...`);
    window.location.href = provider.authUrl;
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Common validations
    if (!formData.username) errors.username = 'Username is required';
    if (!formData.password) errors.password = 'Password is required';
    
    // Signup-specific validations
    if (mode === 'signup') {
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email is invalid';
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.agreeToTerms) {
        errors.agreeToTerms = 'You must agree to the Terms and Conditions';
      }
      
      // CAPTCHA validation
      if (!captchaToken) {
        errors.captcha = 'Please complete the CAPTCHA';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Simulate email verification
  const sendVerificationEmail = async (email: string) => {
    // In a real implementation, this would call your API endpoint to send an email
    console.log(`Sending verification email to: ${email}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (mode === 'login') {
        console.log('Login attempted with:', {
          username: formData.username,
          password: formData.password,
          rememberMe: formData.rememberMe
        });
        
        // Simulate successful login
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('User logged in successfully');
        onClose();
        // In real implementation, you would update auth context and redirect
      } else {
        console.log('Signup attempted with:', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          walletAddress,
          agreeToTerms: formData.agreeToTerms,
          captchaToken
        });
        
        // Simulate sending verification email
        const emailSent = await sendVerificationEmail(formData.email);
        
        if (emailSent) {
          setEmailVerificationSent(true);
          setEmailVerificationInstructions(true);
          // Don't close the modal yet - show verification instructions
        }
      }
    } catch (error) {
      console.error('Error during auth process:', error);
      setFormErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get contextual message based on trigger reason
  const getContextMessage = () => {
    switch (triggerReason) {
      case 'restricted-feature':
        return 'Login required to access this feature';
      case 'pixel-art-studio':
        return 'Login required to use the Pixel Art Tool Studio';
      case 'marketplace':
        return 'Login required to buy or sell artwork';
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  // CRT scanline effect
  const ScanLines = () => (
    <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-transparent via-black/5 to-transparent bg-repeat-y" 
         style={{ backgroundSize: '100% 2px' }}></div>
  );

  // Email Verification Instructions Component
  const EmailVerificationInstructionsModal = () => (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setEmailVerificationInstructions(false)}></div>
      <div className="relative bg-gradient-to-br from-green-900 to-blue-900 p-6 rounded-lg border-2 border-green-400 shadow-lg shadow-green-500/50 max-w-md">
        <h3 className="text-2xl font-bold text-center mb-4 text-green-300">Email Verification Sent!</h3>
        
        <div className="text-white space-y-4">
          <p className="text-center">We've sent a verification link to:</p>
          <p className="text-center font-bold text-green-300">{formData.email}</p>
          <p className="text-center">Please check your inbox and click the verification link to activate your account.</p>
          
          <div className="mt-6 bg-blue-900/50 p-4 rounded-md border border-blue-400">
            <h4 className="text-blue-300 font-medium mb-2">Important Notes:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>The verification link is valid for 24 hours</li>
              <li>Check your spam folder if you don't see the email</li>
              <li>You cannot login until your email is verified</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button 
            onClick={() => {
              setEmailVerificationInstructions(false);
              onClose();
            }}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium"
          >
            Got it
          </button>
          <button 
            onClick={() => setEmailVerificationInstructions(false)}
            className="flex-1 bg-transparent border border-green-400 text-green-300 py-2 px-4 rounded-md hover:bg-green-900/30 transition-all duration-300"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );

  // Terms and Conditions Modal
  const TermsModal = () => (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowTerms(false)}></div>
      <div className="relative bg-gradient-to-br from-purple-900 to-blue-900 p-6 rounded-lg border-2 border-cyan-400 shadow-lg shadow-cyan-500/50 max-w-2xl max-h-[80vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-center mb-4 text-cyan-300">Terms & Conditions</h3>
        
        <div className="text-white space-y-4">
          <section>
            <h4 className="text-lg font-semibold text-pink-300">1. Acceptance of Terms</h4>
            <p>By signing up, you agree to these Terms. If you disagree, do not create an account.</p>
          </section>
          
          <section>
            <h4 className="text-lg font-semibold text-pink-300">2. Blockchain & Wallet Responsibility</h4>
            <p>You are solely responsible for securing your crypto wallet (MetaMask, Phantom, etc.). We do not store private keys, and blockchain transactions are irreversible.</p>
          </section>
          
          <section>
            <h4 className="text-lg font-semibold text-pink-300">3. NFTs & In-Game Assets</h4>
            <p>You own all NFTs purchased or received, but we do not guarantee their value or future functionality. If the game changes or shuts down, your NFTs remain in your wallet, and we are not liable for any losses.</p>
          </section>
          
          <section>
            <h4 className="text-lg font-semibold text-pink-300">4. Compliance & Restrictions</h4>
            <p>You must be 18+ and must not engage in illegal activities, fraud, or money laundering. We comply with blockchain regulations and may suspend accounts if required by law.</p>
          </section>
          
          <section>
            <h4 className="text-lg font-semibold text-pink-300">5. Account & Data Usage</h4>
            <p>We securely store your username, email, and wallet address but will never sell or share your data without consent.</p>
          </section>
          
          <section>
            <h4 className="text-lg font-semibold text-pink-300">6. Updates to Terms</h4>
            <p>We may update these Terms anytime, and continued use means you accept the changes.</p>
          </section>
        </div>
        
        <button 
          onClick={() => setShowTerms(false)}
          className="mt-6 mx-auto block bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 rounded-md hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium"
        >
          I Understand
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
        onClick={onClose}
      ></div>
      
      {/* Terms modal */}
      {showTerms && <TermsModal />}
      
      {/* Email verification instructions modal */}
      {emailVerificationInstructions && <EmailVerificationInstructionsModal />}
      
      {/* Modal container */}
      <div 
        className={`relative w-full max-w-md transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} ${glitchEffect ? 'translate-x-1 -translate-y-1' : ''}`}
      >
        {/* Contextual message based on trigger reason */}
        {getContextMessage() && (
          <div className="mb-3 text-center text-cyan-300 font-medium bg-indigo-900/70 py-2 px-4 rounded-md border border-cyan-500">
            {getContextMessage()}
          </div>
        )}
        
        {/* Login Form */}
        {mode === 'login' && (
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 p-8 rounded-lg border-2 border-cyan-400 shadow-lg shadow-cyan-500/50 relative overflow-hidden">
            <ScanLines />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent opacity-50"></div>
            
            <h2 className="text-3xl font-bold text-center mb-6 text-cyan-300 tracking-wide">
              <span className="relative inline-block">
                <span className="absolute -top-1 -left-1 text-red-500 opacity-70">LOGIN</span>
                <span className="absolute -bottom-1 -right-1 text-blue-500 opacity-70">LOGIN</span>
                <span className="relative z-10">LOGIN</span>
              </span>
            </h2>
            
            <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
              <div>
                <label className="block text-cyan-300 text-sm font-medium mb-1">USERNAME</label>
                <input 
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full bg-indigo-900/50 text-white border border-cyan-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                {formErrors.username && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.username}</p>
                )}
              </div>
              
              <div>
                <label className="block text-cyan-300 text-sm font-medium mb-1">PASSWORD</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-indigo-900/50 text-white border border-cyan-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                {formErrors.password && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
                )}
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="border-cyan-500 rounded text-cyan-500" 
                  />
                  <label className="ml-2 text-cyan-300">Remember me</label>
                </div>
                <a href="#" className="text-cyan-300 hover:text-cyan-400">Forgot Password?</a>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-md hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium"
              >
                {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
              </button>
            </form>
            
            {/* OAuth options */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cyan-500/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-indigo-900 text-cyan-300">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              {oauthProviders.map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => handleOAuthLogin(provider)}
                  className={`flex items-center justify-center py-2 px-4 rounded-md transition-colors duration-300 ${provider.color}`}
                >
                  <span className="mr-2">{provider.icon}</span>
                  <span>{provider.name}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-6 text-center text-cyan-300">
              <p>Don't have an account? <button onClick={toggleMode} className="text-pink-400 hover:text-pink-300">Sign Up</button></p>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
          </div>
        )}
        
        {/* Signup Form */}
        {mode === 'signup' && !emailVerificationSent && (
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 p-8 rounded-lg border-2 border-pink-400 shadow-lg shadow-pink-500/50 relative overflow-hidden">
            <ScanLines />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent opacity-50"></div>
            
            <h2 className="text-3xl font-bold text-center mb-6 text-pink-300 tracking-wide">
              <span className="relative inline-block">
                <span className="absolute -top-1 -left-1 text-cyan-500 opacity-70">SIGN UP</span>
                <span className="absolute -bottom-1 -right-1 text-purple-500 opacity-70">SIGN UP</span>
                <span className="relative z-10">SIGN UP</span>
              </span>
            </h2>
            
            <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
              <div>
                <label className="block text-pink-300 text-sm font-medium mb-1">USERNAME</label>
                <input 
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full bg-indigo-900/50 text-white border border-pink-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                {formErrors.username && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.username}</p>
                )}
              </div>
              
              <div>
                <label className="block text-pink-300 text-sm font-medium mb-1">EMAIL</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-indigo-900/50 text-white border border-pink-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                {formErrors.email && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-pink-300 text-sm font-medium mb-1">PASSWORD</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-indigo-900/50 text-white border border-pink-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                {formErrors.password && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
                )}
              </div>
              
              <div>
                <label className="block text-pink-300 text-sm font-medium mb-1">CONFIRM PASSWORD</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-indigo-900/50 text-white border border-pink-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                {formErrors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.confirmPassword}</p>
                )}
              </div>
              
              {/* Wallet Connection Section */}
              <div className="border border-pink-500 rounded-md p-3 bg-indigo-900/30">
                <label className="block text-pink-300 text-sm font-medium mb-2">WALLET CONNECTION</label>
                
                {walletAddress ? (
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm truncate">{walletAddress}</span>
                    <button 
                      type="button"
                      onClick={() => setWalletAddress(null)}
                      className="text-xs bg-pink-700 hover:bg-pink-800 text-white py-1 px-2 rounded"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button 
                    type="button"
                    onClick={connectWallet}
                    disabled={isConnectingWallet}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-md hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 flex items-center justify-center"
                  >
                    {isConnectingWallet ? (
                      <span>Connecting...</span>
                    ) : (
                      <span>Connect Wallet</span>
                    )}
                  </button>
                )}
                <p className="text-pink-200 text-xs mt-2">Connect your wallet to mint and trade NFTs</p>
              </div>
              
              {/* CAPTCHA component */}
              <div className="flex flex-col items-center">
                <ReCAPTCHA
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Replace with your actual site key
                  onChange={handleCaptchaChange}
                  theme="dark"
                />
                {formErrors.captcha && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.captcha}</p>
                )}
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="border-pink-500 rounded text-pink-500" 
                />
                <label className="ml-2 text-pink-300 text-sm">
                  I agree to the <button 
                    type="button" 
                    onClick={() => setShowTerms(true)}
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Terms and Conditions
                  </button>
                </label>
              </div>
              {formErrors.agreeToTerms && (
                <p className="text-red-400 text-xs">{formErrors.agreeToTerms}</p>
              )}
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-md hover:from-pink-600 hover:to-purple-600 transition-all duration-300 font-medium flex items-center justify-center"
              >
                {isSubmitting ? (
                  <span>CREATING ACCOUNT...</span>
                ) : (
                  <span>CREATE ACCOUNT</span>
                )}
              </button>
            </form>
            
            {/* OAuth signup options */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-pink-500/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-indigo-900 text-pink-300">Or sign up with</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              {oauthProviders.map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => handleOAuthLogin(provider)}
                  className={`flex items-center justify-center py-2 px-4 rounded-md transition-colors duration-300 ${provider.color}`}
                >
                  <span className="mr-2">{provider.icon}</span>
                  <span>{provider.name}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-6 text-center text-pink-300">
  <p>Already have an account? <button onClick={toggleMode} className="text-cyan-400 hover:text-cyan-300">Login</button></p>
</div>

{/* Glowing border effect */}
<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>
</div>
)}

{/* Email Verification Success Message */}
{mode === 'signup' && emailVerificationSent && !emailVerificationInstructions && (
  <div className="bg-gradient-to-br from-green-900 to-blue-900 p-8 rounded-lg border-2 border-green-400 shadow-lg shadow-green-500/50 relative overflow-hidden">
    <ScanLines />
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent opacity-50"></div>
    
    <div className="text-center">
      <div className="mb-6 text-green-300 text-6xl">✓</div>
      <h2 className="text-3xl font-bold mb-6 text-green-300">Verification Email Sent!</h2>
      <p className="text-white mb-4">
        We've sent a verification link to <span className="font-bold">{formData.email}</span>
      </p>
      <p className="text-white mb-8">
        Please check your inbox and click the verification link to activate your account.
      </p>
      
      <button 
        onClick={() => setEmailVerificationInstructions(true)}
        className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-md hover:from-green-600 hover:to-blue-600 transition-all duration-300 font-medium"
      >
        View Instructions
      </button>
    </div>
    
    <div className="mt-6 text-center text-green-300">
      <button onClick={() => {
        setEmailVerificationSent(false);
        toggleMode();
      }} className="text-cyan-400 hover:text-cyan-300">
        Back to Login
      </button>
    </div>
    
    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-cyan-500"></div>
  </div>
)}

{/* Close button */}
<button 
  className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
  onClick={onClose}
>
  Close ×
</button>

</div>
</div>
);
};

// Additional Interface for OAuth Providers
interface OAuthProvider {
  name: string;
  icon: string;
  color: string;
  authUrl: string;
}

// Mock CAPTCHA component - Replace with actual ReCAPTCHA in production
const ReCAPTCHA: React.FC<{
  sitekey: string;
  onChange: (token: string | null) => void;
  theme?: 'light' | 'dark';
}> = ({ sitekey, onChange, theme = 'light' }) => {
  return (
    <div className={`captcha-container border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-100'} rounded-md p-3 w-full`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>I'm not a robot</span>
        <span className="text-xl">🤖</span>
      </div>
      <button 
        type="button"
        onClick={() => onChange('mock-captcha-token-' + Math.random().toString(36).substring(2, 12))}
        className={`w-full py-1 px-3 text-xs rounded ${theme === 'dark' ? 'bg-blue-800 text-white hover:bg-blue-700' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
      >
        Verify
      </button>
      <div className="text-xs text-center mt-2">
        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
          Powered by ReCAPTCHA (sitekey: {sitekey})
        </span>
      </div>
    </div>
  );
};

// For future 2FA implementation
// This is just the skeleton for the 2FA setup process
// You'll need to implement the actual 2FA logic later

// 2FA setup component for future implementation
const TwoFactorSetup: React.FC<{
  onComplete: (setupComplete: boolean) => void;
  onSkip: () => void;
}> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState<'intro' | 'qr' | 'verify'>('intro');
  const [verificationCode, setVerificationCode] = useState('');
  const [secretKey, setSecretKey] = useState(''); // Would be generated by backend

  // Mock function to simulate generating a secret key
  const generateSecretKey = async () => {
    // In a real implementation, this would call your API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSecretKey('ABCDEFGHIJKLMNOP'); // Example key
    setStep('qr');
  };

  // Mock function to verify the code
  const verifyTwoFactorCode = async () => {
    // In a real implementation, this would call your API
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simple validation to simulate verification
    if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
      onComplete(true);
      return true;
    }
    return false;
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-violet-900 p-6 rounded-lg border-2 border-violet-400 shadow-lg">
      {step === 'intro' && (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-violet-300">Set Up Two-Factor Authentication</h3>
          <p className="text-white mb-6">
            Enhance your account security with two-factor authentication. This adds an extra layer of protection beyond your password.
          </p>
          
          <div className="flex space-x-4">
            <button 
              onClick={generateSecretKey}
              className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white py-2 rounded-md hover:from-violet-600 hover:to-purple-600 transition-all"
            >
              Set Up Now
            </button>
            <button 
              onClick={() => onSkip()}
              className="flex-1 bg-transparent border border-violet-400 text-violet-300 py-2 rounded-md hover:bg-violet-900/30 transition-all"
            >
              Set Up Later
            </button>
          </div>
        </div>
      )}
      
      {step === 'qr' && (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-violet-300">Scan QR Code</h3>
          <p className="text-white mb-4">
            Scan this QR code with your authenticator app.
          </p>
          
          <div className="flex justify-center mb-4">
            {/* Placeholder for QR code - in a real app, generate this from the secret key */}
            <div className="w-48 h-48 bg-white p-2 rounded-md flex items-center justify-center">
              <div className="text-black">QR Code Placeholder</div>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-white text-sm mb-2">Or enter this code manually:</p>
            <div className="bg-gray-800 p-2 rounded text-violet-300 font-mono">
              {secretKey}
            </div>
          </div>
          
          <button 
            onClick={() => setStep('verify')}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white py-2 rounded-md hover:from-violet-600 hover:to-purple-600 transition-all"
          >
            Continue
          </button>
        </div>
      )}
      
      {step === 'verify' && (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-violet-300">Verify Setup</h3>
          <p className="text-white mb-4">
            Enter the 6-digit code from your authenticator app to verify setup.
          </p>
          
          <div className="mb-6">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="w-full bg-indigo-900/50 text-white border border-violet-500 rounded px-3 py-2 text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          
          <button 
            onClick={verifyTwoFactorCode}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white py-2 rounded-md hover:from-violet-600 hover:to-purple-600 transition-all"
          >
            Verify and Complete
          </button>
          
          <button 
            onClick={() => setStep('qr')}
            className="mt-3 text-violet-300 hover:text-violet-200"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthModals;              