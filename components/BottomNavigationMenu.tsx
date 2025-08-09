"use client";
import { useRouter, usePathname } from 'next/navigation';
import { Share2, Tag, ShoppingBag, User } from 'lucide-react';
import Image from 'next/image';

export default function BottomNavigationMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: <Share2 className="w-5 h-5" />, label: 'Share', path: '/share' },
    { icon: <Tag className="w-5 h-5" />, label: 'Sell', path: '/profile/sell-products' },
    { icon: null, label: 'Home', path: '/dashboard', isLogo: true },
    { icon: <ShoppingBag className="w-5 h-5" />, label: 'Buy', path: '/marketplace' },
    { icon: <User className="w-5 h-5" />, label: 'Profile', path: '/profile' }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/' || pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 infinito-glass-strong border-t border-white/30 px-4 py-2">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-all ${
              isActive(item.path) ? 'bg-white/40' : 'hover:bg-white/20'
            }`}
          >
            {item.isLogo ? (
              <Image
                src="/LOGO1.svg"
                alt="INFINITO"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            ) : (
              <div className={isActive(item.path) ? 'text-gray-800' : 'text-gray-600'}>
                {item.icon}
              </div>
            )}
            <span className={`text-xs ${isActive(item.path) ? 'text-gray-800 font-bold' : 'text-gray-600'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
