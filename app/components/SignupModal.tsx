'use client';

import React, { useState } from 'react';
import GoogleReCAPTCHA from 'react-google-recaptcha';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
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

    if (!formData.username) errors.username = 'Username is required';
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the Terms and Conditions';
    }
    if (!captchaToken) {
      errors.captcha = 'Please complete the CAPTCHA';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      console.log('Signup attempted with:', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        agreeToTerms: formData.agreeToTerms,
        captchaToken,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('User signed up successfully');
      onClose();
    } catch (error) {
      console.error('Error during signup process:', error);
      setFormErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
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

  const handleGoogleSignup = () => {
    console.log('Sign up with Google clicked');
    // Add your Google OAuth logic here
  };

  const handleConnectWallet = () => {
    console.log('Connect Wallet clicked');
    // Add your wallet connection logic here
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-lg border border-cyan-500 shadow-lg shadow-cyan-500/20">
        <h2 className="text-2xl font-bold text-center mb-4 text-cyan-400">SIGN UP</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Form Section */}
          <form className="space-y-4 flex-1" onSubmit={handleSubmit}>
            <div>
              <label className="block text-cyan-300 text-sm font-medium mb-1">USERNAME</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white border border-cyan-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              {formErrors.username && (
                <p className="text-red-400 text-xs mt-1">{formErrors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-cyan-300 text-sm font-medium mb-1">EMAIL</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white border border-cyan-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              {formErrors.email && (
                <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-cyan-300 text-sm font-medium mb-1">PASSWORD</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white border border-cyan-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              {formErrors.password && (
                <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-cyan-300 text-sm font-medium mb-1">CONFIRM PASSWORD</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white border border-cyan-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              {formErrors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{formErrors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="border-cyan-500 rounded text-cyan-500"
              />
              <label className="ml-2 text-cyan-300 text-sm">
                I agree to the Terms and Conditions
              </label>
            </div>
            {formErrors.agreeToTerms && (
              <p className="text-red-400 text-xs -mt-2">{formErrors.agreeToTerms}</p>
            )}

            <div className="flex justify-center w-full">
              <div className="transform scale-90 origin-top">
                <GoogleReCAPTCHA
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                  onChange={handleCaptchaChange}
                  theme="dark"
                />
              </div>
            </div>
            {formErrors.captcha && (
              <p className="text-red-400 text-xs text-center -mt-2">{formErrors.captcha}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-md hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium"
            >
              {isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          {/* Additional Options */}
          <div className="flex-1 flex flex-col justify-center items-center space-y-4">
            <button
              onClick={handleGoogleSignup}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-2 rounded-md transition-all duration-300 font-medium"
            >
              Sign Up with Google
            </button>
            <button
              onClick={handleConnectWallet}
              className="w-full bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600 text-white py-2 rounded-md transition-all duration-300 font-medium"
            >
              Connect Wallet for NFT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;