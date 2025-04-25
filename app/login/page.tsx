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
    router.push('/'); // or router.back() if you want to return to previous page
  };

  return (
    <LoginModal
      isOpen={showLoginModal}
      onClose={handleClose}
      triggerReason="auth"
      onSwitchToSignup={() => {}}
    />
  );
}
