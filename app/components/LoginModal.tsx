'use client';

import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from './context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerReason?: string;
  onSwitchToSignup?: () => void;
}

const GoogleReCAPTCHA = dynamic(() => import('react-google-recaptcha'), {
  ssr: false,
});

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
  const [formData, setFormData] = useState({
    username: '', // Changed from email to username
    password: '',
    rememberMe: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleClose = () => {
    router.push(callbackUrl);
  };

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

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate username instead of email
    if (!formData.username) {
      errors.username = 'Username is required';
    }
    
    if (!formData.password) errors.password = 'Password is required';
    if (!captchaToken) {
      errors.captcha = 'Please complete the CAPTCHA';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Modified handleSubmit to use username/password login
  // In your handleSubmit function:
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;
  
    setIsSubmitting(true);
    setFormErrors({});
  
    try {
      const result = await signIn('credentials', {
        username: formData.username.trim(),
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        console.error("Actual error from server:", result.error);
        // Your existing error handling code...
      }
  
      if (result?.error) {
        // Handle specific error cases
        const errorMap: Record<string, string> = {
          'Invalid credentials': 'Invalid username or password',
          'Database timeout': 'Service is busy, please try again',
          'Authentication service unavailable': 'Login service is currently unavailable',
          'Database service unavailable': 'System maintenance in progress'
        };
        
        throw new Error(errorMap[result.error] || 'Login failed. Please try again.');
      }
  
      if (result?.ok) {
        handleClose();
        router.refresh();
      }
    } catch (error) {
      setFormErrors({
        submit: error instanceof Error ? error.message : 'Login failed'
      });
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

        <div className="w-full md:w-2/5 flex flex-col justify-center items-center p-4 md:border-r md:border-gray-700">
          <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            Welcome Back
          </h2>
          
          {triggerReason && (
            <p className="text-sm text-gray-300 mb-4 text-center">
              You need to log in to {triggerReason}.
            </p>
          )}
          
          {callbackUrl && callbackUrl !== '/' && !triggerReason && (
            <p className="text-sm text-gray-300 mb-4 text-center">
              You need to log in to access this page.
            </p>
          )}
          
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
                onClick={onSwitchToSignup} 
                className="text-cyan-400 hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        <div className="w-full md:w-3/5 p-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-cyan-300 text-sm font-medium mb-1">USERNAME</label>
              <input
                type="text"  // Changed from email to text type
                name="username"  // Changed from email to username
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Enter your username"  // Updated placeholder text
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
                className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="••••••••"
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
                  className="w-4 h-4 border border-gray-600 rounded bg-gray-700 focus:ring-2 focus:ring-cyan-500"
                />
                <label className="ml-2 text-cyan-300">Remember me</label>
              </div>
              <a href="#" className="text-cyan-400 hover:underline">
                Forgot Password?
              </a>
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
            
            {formErrors.submit && (
              <p className="text-red-400 text-sm text-center p-2 bg-red-900/20 border border-red-800/50 rounded">
                {formErrors.submit}
              </p>
            )}
            
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
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <button 
                onClick={onSwitchToSignup} 
                className="text-cyan-400 hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;