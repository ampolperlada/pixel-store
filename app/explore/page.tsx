// app/explore/page.tsx
'use client'; // Add this since we're using client-side protection
import ExploreArt from '../components/ExploreArt';
import ProtectedRoute from '../components/ProtectedRoute';

export default function ExplorePage() {
  return (
    <ProtectedRoute>
      <ExploreArt />
    </ProtectedRoute>
  );
}