// components/ProtectedRoute.tsx
'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useModal } from '../context/ModalContext';

export default function ProtectedRoute({ children }) {
  const { data: session, status } = useSession();
  const { setShowLoginModal } = useModal();

  useEffect(() => {
    if (status === 'unauthenticated') {
      setShowLoginModal(true);
    }
  }, [status, setShowLoginModal]);

  if (status === 'loading') {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (status === 'authenticated') {
    return <>{children}</>;
  }

  return null; // while modal is open, show nothing
}
