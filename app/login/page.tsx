// app/login/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoginModal from '../components/LoginModal';

export default function LoginPage() {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(true);

  const handleClose = () => {
    setShowLoginModal(false);
    router.push('/'); // Navigate back to home
  };

  const handleSwitchToSignup = () => {
    router.push('/signup'); // Navigate to signup page
  };

  // If modal is closed, navigate back
  useEffect(() => {
    if (!showLoginModal) {
      router.push('/');
    }
  }, [showLoginModal, router]);

  return (
    <LoginModal
      isOpen={showLoginModal}
      onClose={handleClose}
      onSwitchToSignup={handleSwitchToSignup}
    />
  );
}