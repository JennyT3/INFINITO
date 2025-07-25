'use client';
import { usePathname } from 'next/navigation';
import BottomNavigationMenu from '@/components/BottomNavigationMenu';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideBottomMenu = pathname.startsWith('/splash');
  return (
    <>
      {children}
      {!hideBottomMenu && <BottomNavigationMenu />}
    </>
  );
} 