"use client";
import SessionProvider from '../../components/SessionProvider';
import SplashContent from './SplashContent';

export default function SplashPage() {
  return (
    <SessionProvider>
      <SplashContent />
    </SessionProvider>
  );
}