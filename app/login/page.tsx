// app/login/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoginModal from '../components/LoginModal';

// Add this to disable static generation
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(true);

  const handleClose = () => {
    setShowLoginModal(false);
    router.push('/');
  };

  const handleSwitchToSignup = () => {
    router.push('/signup');
  };

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