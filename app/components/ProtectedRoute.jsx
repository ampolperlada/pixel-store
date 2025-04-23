'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [status, pathname, router]);

  if (status === 'loading') {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (status === 'authenticated') {
    return <>{children}</>;
  }

  // Return null or a loading spinner while redirecting
  return null;
}