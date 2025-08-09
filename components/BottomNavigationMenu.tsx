"use client";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Share2, Tag, ShoppingBag, User } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from '../hooks/useTranslation';

export default function BottomNavigationMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const handleClick = (path: string) => {
    router.push(path);
  };

  const navItems = [
    {
      id: 'share',
      icon: <Share2 className="w-5 h-5" />,
      label: 'Share',
      path: '/share',
      color: '#43B2D2'
    },
    {
      id: 'sell',
      icon: <Tag className="w-5 h-5" />,
      label: 'Sell',
      path: '/profile/sell-products',
      color: '#F47802'
    },
    {
      id: 'home',
      icon: null,
      label: 'Home',
      path: '/dashboard',
      color: '#689610',
      isLogo: true
    },
    {
      id: 'marketplace',
      icon: <ShoppingBag className="w-5 h-5" />,
      label: 'Buy',
      path: '/marketplace',
      color: '#813684'
    },
    {
      id: 'profile',
      icon: <User className="w-5 h-5" />,
      label: 'Profile',
      path: '/profile',
      color: '#D42D66'
    }
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div 
        className="infinito-glass-strong border-t border-white/30 px-4 py-2 shadow-2xl"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)'
        }}
      >
        <div className="flex items-center justify-around max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.path)}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg transition-all duration-300 ${
                isActiveRoute(item.path) 
                  ? 'bg-white/40 backdrop-blur-sm' 
                  : 'hover:bg-white/20 backdrop-blur-sm'
              }`}
              style={{
                filter: isActiveRoute(item.path) 
                  ? "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" 
                  : "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
              }}
            >
              {item.isLogo ? (
                <div className="relative">
                  <Image
                    src="/LOGO1.svg"
                    alt="INFINITO"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                    priority
                    style={{
                      filter: isActiveRoute(item.path) 
                        ? "drop-shadow(0 2px 4px rgba(104,150,16,0.6))" 
                        : "drop-shadow(0 1px 2px rgba(104,150,16,0.3))"
                    }}
                  />
                  {isActiveRoute(item.path) && (
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{ 
                        background: "radial-gradient(circle at center, rgba(104,150,16,0.3) 0%, transparent 70%)"
                      }}
                    />
                  )}
                </div>
              ) : (
                <div 
                  className="flex items-center justify-center"
                  style={{ color: isActiveRoute(item.path) ? item.color : '#6B7280' }}
                >
                  {item.icon}
                </div>
              )}
              
              <span 
                className={`text-xs font-medium tracking-wider ${
                  isActiveRoute(item.path) 
                    ? 'text-gray-800 font-bold' 
                    : 'text-gray-600'
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
