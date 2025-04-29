'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase'; // adjust this path
import { useRouter } from 'next/navigation';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/update-password', // change in prod
    });

    if (error) {
      console.error('Forgot password error:', error);
      setMessage('Failed to send reset link. Please try again.');
    } else {
      setMessage('Password reset link sent. Check your email.');
    }
  };

  return (
    <form onSubmit={handleForgotPassword} className="space-y-4">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="border p-2 rounded w-full"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Send Reset Link
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
