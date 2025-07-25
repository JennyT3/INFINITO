"use client";
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '../../components/theme-provider';
import Image from 'next/image';
import * as React from "react"

const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
const shareText = encodeURIComponent('¡Mira esta app de impacto ambiental!');

export default function SharePage() {
  const router = useRouter();
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const [isSharing, setIsSharing] = useState(false);
  const { userName } = useUser();

  const profileLink = `https://infinito.me/${userName ? userName.replace(/\s+/g, '') : 'User'}`;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const nftImageUrl = typeof window !== 'undefined' ? `${window.location.origin}/NFT/3.png` : '';
  const shareMessage = `Descobre o meu impacto na moda circular com INFINITO! Veja meu NFT: ${nftImageUrl}`;
  const instagramStoryMessage = `Moda circular, impacto real! 🌱 Veja meu NFT: ${nftImageUrl}`;

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      setIsSharing(true);
      await navigator.share({
        title: 'INFINITO.me',
        text: 'Veja meu perfil e impacto ambiental!',
        url,
      });
    } catch (e) {
      // Silenciar error
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen font-raleway flex flex-col items-center justify-center bg-gradient-to-br from-[#F9F6F2] via-[#f3ede6] to-[#e7e1d8] px-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-8 mt-4 px-2">
          <button onClick={() => router.back()} className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow-sm border border-gray-200">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 flex justify-center">
            <Image src="/LOGO2.png" alt="INFINITO logo" width={180} height={180} className="rounded-full shadow-lg" />
          </div>
          <div className="w-10"></div>
        </div>
        <div className="bg-white/95 rounded-3xl shadow-2xl p-8 flex flex-col gap-6 border border-gray-100" style={{boxShadow:'0 8px 32px 0 rgba(60,60,60,0.10)'}}>
          <div className="flex justify-center mb-2">
            <Image src="/NFT/3.png" alt="NFT" width={128} height={128} className="rounded-2xl shadow-lg" />
          </div>
          <button
            className="w-full flex items-center gap-3 bg-green-600 text-white py-3 rounded-xl font-semibold justify-center hover:bg-green-700 transition-colors text-base shadow"
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank')}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-6 h-6" />
            Partilhar no WhatsApp
          </button>
          <button
            className="w-full flex items-center gap-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white py-3 rounded-xl font-semibold justify-center hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 transition-colors text-base shadow"
            onClick={() => window.open(`https://www.instagram.com/?text=${encodeURIComponent(instagramStoryMessage)}`, '_blank')}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="w-6 h-6 rounded" />
            Partilhar no Instagram Stories
          </button>
          <button
            className="w-full flex items-center gap-3 bg-black text-white py-3 rounded-xl font-semibold justify-center hover:bg-gray-900 transition-colors text-base shadow"
            onClick={() => window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`, '_blank')}
          >
            <Image src="/logo x.webp" alt="X" width={24} height={24} className="rounded" />
            Partilhar no X
          </button>
          <button
            className="w-full flex items-center gap-3 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold justify-center hover:bg-gray-300 transition-colors text-base shadow"
            onClick={() => {navigator.clipboard.writeText(shareMessage); alert('Mensagem copiada!')}}
          >
            <Share2 className="w-5 h-5" />
            Copiar mensagem
          </button>
        </div>
      </div>
    </div>
  );
} 