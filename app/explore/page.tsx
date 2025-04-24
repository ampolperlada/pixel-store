'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ExploreArt from '../components/ExploreArt';
import ProtectedRoute from '../components/ProtectedRoute';

export default function ExplorePage() {
  return (
    <ProtectedRoute>
      <ExploreArt />
    </ProtectedRoute>
  );
}