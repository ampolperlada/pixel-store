'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Ensure Supabase picks up the access token from URL
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setMessage('No active session. Try again from the email link.');
      }
    });
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      console.error('Update password error:', error);
      setMessage('Failed to update password.');
    } else {
      setMessage('Password updated! Redirecting...');
      setTimeout(() => router.push('/signin'), 2000);
    }
  };

  return (
    <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold">Set a New Password</h2>
      <input
        type="password"
        required
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Update Password
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
