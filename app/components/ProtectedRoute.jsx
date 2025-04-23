// components/ProtectedRoute.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

export default function ProtectedRoute({ children }) {
  const { data: session, status } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [requestedPath, setRequestedPath] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Track the protected path when authentication is required
  useEffect(() => {
    if (status === 'unauthenticated') {
      setRequestedPath(pathname);
      setShowLoginModal(true);
    }
  }, [status, pathname]);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    if (requestedPath) {
      router.push(requestedPath);
    } else {
      router.push('/');
    }
  };

  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const handleSignupSuccess = () => {
    setShowSignupModal(false);
    if (requestedPath) {
      router.push(requestedPath);
    } else {
      router.push('/');
    }
  };

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    router.push('/');
  };

  if (status === 'loading') {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (status === 'authenticated') {
    return <>{children}</>;
  }

  return (
    <>
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal}
          onClose={handleCloseModals}
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={handleSwitchToSignup}
          triggerReason={pathname.includes('create') ? 'create content' : 'explore features'}
        />
      )}
      
      {showSignupModal && (
        <SignupModal
          isOpen={showSignupModal}
          onClose={handleCloseModals}
          onSignupSuccess={handleSignupSuccess}
        />
      )}
    </>
  );
}