"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/splash");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return null; // O un loader visual si prefieres
  return <>{children}</>;
} 