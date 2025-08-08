'use client';
import { usePathname } from 'next/navigation';
import BottomNavigationMenu from '@/components/BottomNavigationMenu';
import StellarWallet from '@/components/StellarWallet';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideBottomMenu = pathname.startsWith('/splash');
  const hideStellarWallet = pathname.startsWith('/splash') || pathname.startsWith('/admin');
  
  return (
    <>
      {!hideStellarWallet && <StellarWallet />}
      {children}
      {!hideBottomMenu && <BottomNavigationMenu />}
    </>
  );
} 