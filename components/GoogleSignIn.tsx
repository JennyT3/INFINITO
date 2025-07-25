'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

export default function GoogleSignIn() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;

  if (session) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-gray-700">Signed in as <b>{session.user?.email}</b></p>
        {session.user?.image && (
          <Image 
            src={session.user.image} 
            alt="Profile" 
            width={48}
            height={48}
            className="w-12 h-12 rounded-full border" 
            loading="lazy"
          />
        )}
        <button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded mt-2 font-semibold hover:bg-red-600 transition">Sign out</button>
        <div className="bg-gray-100 rounded p-2 mt-2 w-full text-xs text-left">
          <b>Session (debug):</b>
          <pre className="whitespace-pre-wrap break-all">{JSON.stringify(session, null, 2)}</pre>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={async () => {
        try {
          const result = await signIn('google', { callbackUrl: '/dashboard', redirect: true });
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
          console.error('signIn error:', error);
          }
        }
      }}
      className="bg-white border border-gray-300 rounded-lg py-3 px-6 font-medium text-gray-700 shadow-sm hover:bg-gray-100 w-full text-center"
    >
      Conectar con Gmail
    </button>
  );
} 