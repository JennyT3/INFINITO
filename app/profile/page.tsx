"use client";
import { useRouter } from "next/navigation";
import { User, ArrowRight, Award, BookOpen, CreditCard, Star, ArrowLeft } from 'lucide-react';
import BottomNavigationMenu from '../../components/BottomNavigationMenu';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  const links = [
    { href: '/profile/passport', icon: Award, label: 'Impact Passport' },
    { href: '/profile/contribution-history', icon: BookOpen, label: 'Contributions' },
    { href: '/profile/payment-methods', icon: CreditCard, label: 'Payment Methods' },
    { href: '/profile/my-reviews', icon: Star, label: 'My Reviews' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-4">
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{session?.user?.name || 'User'}</h2>
              <p className="text-gray-600">{session?.user?.email || 'user@example.com'}</p>
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Menu Links */}
        <div className="space-y-3">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => router.push(link.href)}
              className="w-full bg-white rounded-lg p-4 shadow-sm flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <link.icon className="w-6 h-6 text-gray-600" />
                <span className="font-medium">{link.label}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button 
          onClick={() => router.push('/auth/signout')}
          className="w-full mt-6 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600"
        >
          Log out
        </button>
      </div>

      <BottomNavigationMenu />
    </div>
  );
}
