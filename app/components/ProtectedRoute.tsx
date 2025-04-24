"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return <div>Loading...</div>; // Add a loading indicator
  }

  // Don't render children until we confirm authentication
  if (status === "authenticated") {
    return <>{children}</>;
  }

  // Return null for unauthenticated users (they'll be redirected)
  return null;
}