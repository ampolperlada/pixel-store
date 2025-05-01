'use client';

import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import Link from 'next/link';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerReason?: string;
  onSwitchToSignup?: () => void;
}

const GoogleReCAPTCHA = dynamic(() => import('react-google-recaptcha'), {
  ssr: false,
});

const [serverErrorType, setServerErrorType] = useState<'auth' | 'server' | 'network' | null>(null);

const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  triggerReason,
  onSwitchToSignup 
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const { login } = useAuth();
  
  // Form states
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  // Forgot password states
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [forgotPasswordError, setForgotPasswordError] = useState('');

  // Check for error in URL params (for when users are redirected back after failed auth)
  useEffect(() => {
    const error = searchParams?.get('error');
    if (error === 'CredentialsSignin') {
      handleAuthError('CredentialsSignin');
    }
  }, [searchParams]);

  const handleClose = () => {
    // Reset all states
    setFormData({
      username: '',
      password: '',
      rememberMe: false,
    });
    setFormErrors({});
    setFieldErrors({});
    setCaptchaToken(null);
    setForgotPasswordMode(false);
    setForgotPasswordEmail('');
    setForgotPasswordStatus('idle');
    setForgotPasswordError('');
    
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Also clear field-specific errors
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const field_errors: Record<string, string> = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
      field_errors.username = 'Please enter your username';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
      field_errors.password = 'Please enter your password';
    }
    
    if (!captchaToken && !forgotPasswordMode) {
      errors.captcha = 'Please complete the CAPTCHA';
    }

    setFormErrors(errors);
    setFieldErrors(field_errors);
    return Object.keys(errors).length === 0;
  };


  const handleAuthError = (error: string) => {
    // Map backend errors to user-friendly messages
    const errorMap: Record<string, { 
      message: string, 
      field?: string,
      type: 'auth' | 'server' | 'network'
    }> = {
      'Invalid credentials': { 
        message: 'The username or password you entered is incorrect', 
        field: 'password',
        type: 'auth'
      },
      'User not found': {
        message: 'No account found with this username',
        field: 'username',
        type: 'auth'
      },
      'CredentialsSignin': {
        message: 'Invalid login credentials',
        type: 'auth'
      },
      'Database timeout': { 
        message: 'Our servers are busy right now. Please try again in a moment.', 
        type: 'server'
      },
      'Authentication service unavailable': { 
        message: 'Login service is currently undergoing maintenance', 
        type: 'server'
      },
      'Database service unavailable': { 
        message: 'System maintenance in progress. Please try again later.', 
        type: 'server'
      },
      'Network error': {
        message: 'Unable to connect to our servers. Please check your internet connection.',
        type: 'network'
      }
    };
    
    const errorInfo = errorMap[error] || { 
      message: 'Login failed. Please try again.',
      type: 'server'
    };
    
    setServerErrorType(errorInfo.type);
    setFormErrors({ submit: errorInfo.message });
    
    // Set field-specific error if applicable
    if (errorInfo.field) {
      setFieldErrors({ [errorInfo.field]: errorInfo.message });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFormErrors({});
    setFieldErrors({});

    try {
      const result = await signIn('credentials', {
        username: formData.username.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe.toString(),
        redirect: false,
        callbackUrl: callbackUrl
      });

      if (result?.error) {
        // Map backend errors to user-friendly messages
        const errorMap: Record<string, { message: string, field?: string }> = {
          'Invalid credentials': { 
            message: 'Invalid username or password', 
            field: 'password'  // Highlight the password field specifically
          },
          'Username and password are required': { 
            message: 'Both username and password are required' 
          },
          'Database timeout': { 
            message: 'Service is busy, please try again in a moment' 
          },
          'Authentication service unavailable': { 
            message: 'Login service is currently unavailable' 
          },
          'Database service unavailable': { 
            message: 'System maintenance in progress' 
          }
        };
        
        const errorInfo = errorMap[result.error] || { 
          message: result.error || 'Login failed. Please try again.' 
        };
        
        setFormErrors({ submit: errorInfo.message });
        
        // Set field-specific error if applicable
        if (errorInfo.field) {
          setFieldErrors({ [errorInfo.field]: 'Incorrect password' });
        }
        
        throw new Error(errorInfo.message);
      }

      if (result?.ok) {
        if (result.url) {
          window.location.href = result.url;
        } else {
          router.push(callbackUrl);
          router.refresh();
        }
      }
    } catch (error) {
      // Error is already handled above
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { 
      callbackUrl: callbackUrl !== '/' ? decodeURIComponent(callbackUrl) : window.location.origin 
    });
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    if (token && formErrors.captcha) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.captcha;
        return newErrors;
      });
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError('');
    
    if (!forgotPasswordEmail) {
      setForgotPasswordError('Email is required');
      return;
    }

    setForgotPasswordStatus('sending');
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send reset link');
      }
      
      setForgotPasswordStatus('success');
    } catch (error) {
      console.error('Forgot password error:', error);
      setForgotPasswordStatus('error');
      setForgotPasswordError('Failed to send reset link. Please try again.');
    }
  };

  const handleSwitchToSignup = () => {
    if (onSwitchToSignup) {
      onSwitchToSignup();
    } else {
      router.push('/signup');
    }
  };

  useEffect(() => {
    if (callbackUrl && callbackUrl !== '/') {
      console.log(`User is being redirected from: ${callbackUrl}`);
    }
  }, [callbackUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      ></div>
      
      <div className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-xl border border-cyan-500 shadow-lg shadow-cyan-500/20 flex flex-col md:flex-row">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Side - Branding */}
        <div className="w-full md:w-2/5 flex flex-col justify-center items-center p-4 md:border-r md:border-gray-700">
          <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            {forgotPasswordMode ? 'Reset Password' : 'Welcome Back'}
          </h2>
          
          {triggerReason && (
            <p className="text-sm text-gray-300 mb-4 text-center">
              You need to log in to {triggerReason}.
            </p>
          )}
          
          {!forgotPasswordMode && (
            <>
              <div className="hidden md:block mt-8">
                <div className="w-32 h-32 mx-auto rounded-full border-4 border-cyan-500 flex items-center justify-center">
                  <div className="w-16 h-4 bg-cyan-500 rounded"></div>
                </div>
                <p className="text-gray-400 text-center mt-4">Secure login to access your account</p>
              </div>
              
              <div className="mt-6 md:mt-auto text-center">
                <p className="text-sm text-gray-500">
                  Don't have an account?{' '}
                  <button 
                    onClick={handleSwitchToSignup} 
                    className="text-cyan-400 hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-3/5 p-4">
          {forgotPasswordMode ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyan-300 mb-2">Forgot your password?</h3>
              <p className="text-gray-300 mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              {forgotPasswordStatus === 'success' ? (
                <div className="p-4 bg-green-900/20 border border-green-800/50 rounded-lg">
                  <p className="text-green-400">
                    Password reset link sent! Please check your email.
                  </p>
                  <button
                    onClick={() => {
                      setForgotPasswordMode(false);
                      setForgotPasswordStatus('idle');
                    }}
                    className="mt-4 text-cyan-400 hover:underline"
                  >
                    Back to login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-cyan-300 text-sm font-medium mb-1">EMAIL</label>
                    <input
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Enter your email"
                      disabled={forgotPasswordStatus === 'sending'}
                    />
                    {forgotPasswordError && (
                      <p className="text-red-400 text-xs mt-1">{forgotPasswordError}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordMode(false);
                        setForgotPasswordError('');
                      }}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-all duration-300"
                      disabled={forgotPasswordStatus === 'sending'}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-2 rounded-lg font-medium transition-all duration-300"
                      disabled={forgotPasswordStatus === 'sending'}
                    >
                      {forgotPasswordStatus === 'sending' ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <>
              {/* Show a clear authentication error message at the top if present */}
              {formErrors.submit && (
                <div className="mb-4 text-red-400 text-sm p-3 bg-red-900/20 border border-red-800/50 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                  <span>{formErrors.submit}</span>
                </div>
              )}
            
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-cyan-300 text-sm font-medium mb-1">USERNAME</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-700/50 text-white border ${fieldErrors.username ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                    placeholder="Enter your username"
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
                    className={`w-full bg-gray-700/50 text-white border ${fieldErrors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                    placeholder="••••••••"
                  />
                  {fieldErrors.password && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
                  )}
                  {formErrors.password && !fieldErrors.password && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
                  )}
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 border border-gray-600 rounded bg-gray-700 focus:ring-2 focus:ring-cyan-500"
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-cyan-300">Remember me</label>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setForgotPasswordMode(true)}
                    className="text-cyan-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex justify-center bg-gray-800/50 p-2 rounded-lg">
                    <GoogleReCAPTCHA
                      sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                      onChange={handleCaptchaChange}
                      theme="dark"
                      size="normal"
                    />
                  </div>
                  {formErrors.captcha && (
                    <p className="text-red-400 text-xs text-center mt-1">{formErrors.captcha}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
                >
                  {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
                </button>
              </form>

              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-gray-700"></div>
                <span className="px-3 text-gray-400 text-sm">OR</span>
                <div className="flex-1 border-t border-gray-700"></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-medium transition-all duration-300 border border-gray-600 hover:border-gray-500"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.255H17.92C17.665 15.63 16.89 16.795 15.725 17.575V20.115H19.28C21.36 18.14 22.56 15.42 22.56 12.25Z" fill="#4285F4"/>
                  <path d="M12 23C14.97 23 17.46 21.99 19.28 20.115L15.725 17.575C14.745 18.235 13.48 18.625 12 18.625C9.135 18.625 6.71 16.69 5.845 14.09H2.17V16.66C3.98 20.21 7.7 23 12 23Z" fill="#34A853"/>
                  <path d="M5.845 14.09C5.625 13.43 5.5 12.725 5.5 12C5.5 11.275 5.625 10.57 5.845 9.91V7.34H2.17C1.4 8.735 1 10.32 1 12C1 13.68 1.4 15.265 2.17 16.66L5.845 14.09Z" fill="#FBBC05"/>
                  <path d="M12 5.375C13.615 5.375 15.065 5.93 16.205 7.02L19.36 3.865C17.455 2.09 14.965 1 12 1C7.7 1 3.98 3.79 2.17 7.34L5.845 9.91C6.71 7.31 9.135 5.375 12 5.375Z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
              
              <div className="mt-6 text-center md:hidden">
                <p className="text-sm text-gray-400 text-center mt-4">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={handleSwitchToSignup}
                    className="text-cyan-400 hover:underline hover:text-cyan-300 transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;