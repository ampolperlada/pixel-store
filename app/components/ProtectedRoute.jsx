// src/components/ProtectedRoute.jsx

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(router.asPath)}`);
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg font-semibold">Checking credentials...</span>
      </div>
    );
  }

  if (!session) {
    return null; // Or fallback content
  }

  return children;
}
