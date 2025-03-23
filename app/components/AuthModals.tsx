'use client'; // Add this directive at the top

import React, { useState, useEffect } from 'react';

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
}

interface UserSignupData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  walletAddress: string | null;
  agreeToTerms: boolean;
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
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    if (mode === 'login') {
      console.log('Login attempted with:', {
        username: formData.username,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
      
      // Simulate successful login
      setTimeout(() => {
        console.log('User logged in successfully');
        onClose();
        // In real implementation, you would update auth context and redirect
      }, 1000);
    } else {
      console.log('Signup attempted with:', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        walletAddress,
        agreeToTerms: formData.agreeToTerms
      });
      
      // Simulate successful signup
      setTimeout(() => {
        console.log('User registered successfully');
        onClose();
        // In real implementation, you would update auth context and redirect
      }, 1000);
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
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-md hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium"
              >
                LOGIN
              </button>
            </form>
            
            <div className="mt-6 text-center text-cyan-300">
              <p>Don't have an account? <button onClick={toggleMode} className="text-pink-400 hover:text-pink-300">Sign Up</button></p>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
          </div>
        )}
        
        {/* Signup Form */}
        {mode === 'signup' && (
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
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-md hover:from-pink-600 hover:to-purple-600 transition-all duration-300 font-medium"
              >
                CREATE ACCOUNT
              </button>
            </form>
            
            <div className="mt-6 text-center text-pink-300">
              <p>Already have an account? <button onClick={toggleMode} className="text-cyan-400 hover:text-cyan-300">Login</button></p>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>
          </div>
        )}
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300 shadow-lg z-20"
        >
          ✕
        </button>
        
        {/* Decorative pixel corners */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-400"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-400"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-400"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-400"></div>
      </div>
    </div>
  );
};

// Here's a sample implementation of a route guard for protected pages
const withAuth = (Component: React.ComponentType) => {
  const AuthGuard = (props: any) => {
    // This would use your actual auth context in a real implementation
    const isAuthenticated = false; // Replace with actual auth check
    const [showAuthModal, setShowAuthModal] = useState(false);
    
    // If not authenticated, show auth modal
    useEffect(() => {
      if (!isAuthenticated) {
        setShowAuthModal(true);
      }
    }, [isAuthenticated]);
    
    // For server-side use in Next.js, you would also add a getServerSideProps
    // function to redirect on the server
    
    return (
      <>
        {isAuthenticated ? (
          <Component {...props} />
        ) : (
          <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="text-center text-gray-400">
              <p>This content requires authentication</p>
            </div>
            {showAuthModal && (
              <AuthModals 
                isOpen={showAuthModal} 
                onClose={() => setShowAuthModal(false)}
                triggerReason="restricted-feature"
              />
            )}
          </div>
        )}
      </>
    );
  };
  
  return AuthGuard;
};

export default AuthModals;
export { withAuth };