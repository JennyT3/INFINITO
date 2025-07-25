'use client'
import { useRouter } from 'next/navigation'
import * as React from "react"
import { useEffect } from 'react'

export default function HomeRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/splash');
  }, [router]);
  return null;
}
