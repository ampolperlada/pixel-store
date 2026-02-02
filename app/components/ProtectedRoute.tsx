"use client";
import { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  // BYPASS: Always show content, no auth check
  return <>{children}</>;
}