'use client';
import { SessionProvider, signIn, useSession } from 'next-auth/react';

function TestContent() {
  const { data: session, status } = useSession();

  const testGoogleAuth = async () => {
    try {
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/dashboard',
      });
      if (process.env.NODE_ENV === 'development') {
      console.log('Auth result:', result);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
      console.error('Auth error:', error);
      }
    }
  };

  return (
    <div className="p-8">
      <h1>Auth Test Page</h1>
      <div className="mt-4">
        <p>Status: {status}</p>
        {session && <p>User: {session.user?.email}</p>}
      </div>
      <button
        onClick={testGoogleAuth}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Test Google Auth
      </button>
      <div className="mt-4">
        <a href="/api/auth/signin" className="text-blue-500 underline">
          Go to NextAuth signin page
        </a>
      </div>
    </div>
  );
}

export default function TestAuth() {
  return (
    <SessionProvider>
      <TestContent />
    </SessionProvider>
  );
} 