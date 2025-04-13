'use client';

import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
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
    if (!formData.password) errors.password = 'Password is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      console.log('Login attempted with:', {
        username: formData.username,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('User logged in successfully');
      onClose();
    } catch (error) {
      console.error('Error during login process:', error);
      setFormErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-md bg-gradient-to-br from-purple-900 to-blue-900 p-8 rounded-lg border-2 border-cyan-400 shadow-lg shadow-cyan-500/50">
        <h2 className="text-3xl font-bold text-center mb-6 text-cyan-300">LOGIN</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
            <a href="#" className="text-cyan-300 hover:text-cyan-400">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-md hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium"
          >
            {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;