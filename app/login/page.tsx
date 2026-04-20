// app/login/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import LoginModal from '../components/LoginModal';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const error = searchParams.get('error');

  const [showLoginModal, setShowLoginModal] = useState(true);

  const handleClose = () => {
    setShowLoginModal(false);
    router.push('/'); // Navigate back to home
  };

  const handleSwitchToSignup = () => {
    router.push('/signup');
  };

  // If modal is closed → go home
  useEffect(() => {
    if (!showLoginModal) {
      router.push('/');
    }
  }, [showLoginModal, router]);

  return (
    <>
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={handleClose}
        onSwitchToSignup={handleSwitchToSignup}
      />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}