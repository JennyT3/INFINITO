'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectPassport() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/profile/passport');
  }, [router]);
  return null;
} 