"use client";
import { useLanguage } from '../../../components/theme-provider';
import { useUser } from '../../../components/theme-provider';
import { ArrowLeft, User, Mail, Phone, Globe, Camera, Eye, Lock, Bell, CreditCard, FileText, Trash2, Download, LogOut, HelpCircle, MessageCircle, Info, Shield, Euro } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import BottomNavigationMenu from '../../../components/BottomNavigationMenu';
import { Language } from '../../../components/theme-provider';

const languages = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'Inglês' },
  { code: 'es', label: 'Espanhol' },
];

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  lang: Language;
}

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const { userName } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData>({
    name: userName || 'Usuário',
    email: 'jenny@email.com',
    phone: '',
    avatar: '/avatar1.svg',
    lang: language,
  });
  const [privacy, setPrivacy] = useState({
    public: true,
    showHistory: false,
    notifications: true,
  });
  const [seller, setSeller] = useState({
    bank: '',
    method: '',
    policy: '',
  });
  const [notifs, setNotifs] = useState({
    marketing: false,
    sms: true,
    push: true,
    reports: false,
  });

  return (
    <div className="min-h-screen font-raleway bg-[#EDE4DA] flex flex-col items-center pb-12" style={{
      backgroundImage: `
        radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px),
        radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px),
        radial-gradient(circle at 40% 80%, rgba(120, 119, 108, 0.08) 1px, transparent 1px),
        radial-gradient(circle at 0% 100%, rgba(120, 119, 108, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(120, 119, 108, 0.02) 1px, transparent 1px),
        linear-gradient(0deg, rgba(120, 119, 108, 0.02) 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px, 25px 25px, 30px 30px, 35px 35px, 15px 15px, 15px 15px',
    }}>
      <div className="w-full max-w-md mx-auto px-4 pt-6 pb-2">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.push('/profile')} className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow-sm border border-gray-200">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-4 border-green-300 bg-white flex items-center justify-center mb-1 overflow-hidden">
              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-lg text-gray-800">Configurações da Conta</span>
          </div>
        </div>
        {/* Perfil */}
        <div className="bg-white/95 rounded-2xl shadow p-5 mb-5 border border-gray-200 flex flex-col gap-3 animate-fade-in">
          <div className="font-bold text-green-700 mb-2 flex items-center gap-2"><User className="w-5 h-5" /> Perfil</div>
          <label className="flex items-center gap-2 text-sm"><User className="w-4 h-4 text-gray-500" />
            <input className="flex-1 border-b border-gray-200 bg-transparent px-2 py-1" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="Nome" />
          </label>
          <label className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-gray-500" />
            <input className="flex-1 border-b border-gray-200 bg-transparent px-2 py-1" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} placeholder="Email" />
          </label>
          <label className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-gray-500" />
            <input className="flex-1 border-b border-gray-200 bg-transparent px-2 py-1" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="Telefone" />
          </label>
          <label className="flex items-center gap-2 text-sm"><Camera className="w-4 h-4 text-gray-500" />
            <input type="file" className="hidden" id="avatar-upload" accept="image/*" onChange={e => {
              const file = e.target.files?.[0];
              if (file) setProfile(p => ({ ...p, avatar: URL.createObjectURL(file) }));
            }} />
            <span className="flex-1">
              <label htmlFor="avatar-upload" className="underline text-blue-600 cursor-pointer">Alterar foto</label>
            </span>
          </label>
          <label className="flex items-center gap-2 text-sm"><Globe className="w-4 h-4 text-gray-500" />
            <select className="flex-1 border-b border-gray-200 bg-transparent px-2 py-1" value={profile.lang} onChange={e => {
              const lang = e.target.value as Language;
              setProfile(p => ({ ...p, lang }));
              setLanguage(lang);
            }}>
              {languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </label>
        </div>
        {/* Privacidade */}
        <div className="bg-white/95 rounded-2xl shadow p-5 mb-5 border border-gray-200 flex flex-col gap-3 animate-fade-in">
          <div className="font-bold text-blue-700 mb-2 flex items-center gap-2"><Lock className="w-5 h-5" /> Privacidade</div>
          <label className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2"><Eye className="w-4 h-4 text-gray-500" /> Perfil público</span>
            <input type="checkbox" checked={privacy.public} onChange={e => setPrivacy(p => ({ ...p, public: e.target.checked }))} className="ios-switch" />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-500" /> Mostrar histórico contribuições</span>
            <input type="checkbox" checked={privacy.showHistory} onChange={e => setPrivacy(p => ({ ...p, showHistory: e.target.checked }))} className="ios-switch" />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2"><Bell className="w-4 h-4 text-gray-500" /> Receber notificações</span>
            <input type="checkbox" checked={privacy.notifications} onChange={e => setPrivacy(p => ({ ...p, notifications: e.target.checked }))} className="ios-switch" />
          </label>
        </div>
        {/* Vendedor */}
        <div className="bg-white/95 rounded-2xl shadow p-5 mb-5 border border-gray-200 flex flex-col gap-3 animate-fade-in">
          <div className="font-bold text-purple-700 mb-2 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Vendedor</div>
          <label className="flex items-center gap-2 text-sm"><CreditCard className="w-4 h-4 text-gray-500" />
            <input className="flex-1 border-b border-gray-200 bg-transparent px-2 py-1" value={seller.bank} onChange={e => setSeller(s => ({ ...s, bank: e.target.value }))} placeholder="Dados bancários" />
          </label>
          <label className="flex items-center gap-2 text-sm"><Euro className="w-4 h-4 text-gray-500" />
            <input className="flex-1 border-b border-gray-200 bg-transparent px-2 py-1" value={seller.method} onChange={e => setSeller(s => ({ ...s, method: e.target.value }))} placeholder="Método pagamento preferido" />
          </label>
          <label className="flex items-center gap-2 text-sm"><FileText className="w-4 h-4 text-gray-500" />
            <input className="flex-1 border-b border-gray-200 bg-transparent px-2 py-1" value={seller.policy} onChange={e => setSeller(s => ({ ...s, policy: e.target.value }))} placeholder="Política devolução" />
          </label>
        </div>
        {/* Notificações */}
        <div className="bg-white/95 rounded-2xl shadow p-5 mb-5 border border-gray-200 flex flex-col gap-3 animate-fade-in">
          <div className="font-bold text-green-700 mb-2 flex items-center gap-2"><Bell className="w-5 h-5" /> Notificações</div>
          <label className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" /> Email marketing</span>
            <input type="checkbox" checked={notifs.marketing} onChange={e => setNotifs(n => ({ ...n, marketing: e.target.checked }))} className="ios-switch" />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /> SMS pedidos</span>
            <input type="checkbox" checked={notifs.sms} onChange={e => setNotifs(n => ({ ...n, sms: e.target.checked }))} className="ios-switch" />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2"><Bell className="w-4 h-4 text-gray-500" /> Push app</span>
            <input type="checkbox" checked={notifs.push} onChange={e => setNotifs(n => ({ ...n, push: e.target.checked }))} className="ios-switch" />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-500" /> Relatórios mensais</span>
            <input type="checkbox" checked={notifs.reports} onChange={e => setNotifs(n => ({ ...n, reports: e.target.checked }))} className="ios-switch" />
          </label>
        </div>
        {/* Dados */}
        <div className="bg-white/95 rounded-2xl shadow p-5 mb-5 border border-gray-200 flex flex-col gap-3 animate-fade-in">
          <div className="font-bold text-blue-700 mb-2 flex items-center gap-2"><FileText className="w-5 h-5" /> Dados</div>
          <button className="w-full flex items-center gap-2 justify-center py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"><Download className="w-4 h-4" /> Baixar meus dados</button>
          <button className="w-full flex items-center gap-2 justify-center py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition"><Trash2 className="w-4 h-4" /> Eliminar conta</button>
          <button className="w-full flex items-center gap-2 justify-center py-2 rounded-lg bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition"><FileText className="w-4 h-4" /> Exportar certificados</button>
        </div>
        {/* Suporte */}
        <div className="bg-white/95 rounded-2xl shadow p-5 mb-5 border border-gray-200 flex flex-col gap-3 animate-fade-in">
          <div className="font-bold text-purple-700 mb-2 flex items-center gap-2"><HelpCircle className="w-5 h-5" /> Suporte</div>
          <button onClick={() => router.push('/profile/help')} className="flex items-center gap-2 text-blue-700 hover:underline text-left"><MessageCircle className="w-4 h-4" /> Ajuda</button>
          <button onClick={() => window.open('mailto:support@infinito.me', '_blank')} className="flex items-center gap-2 text-blue-700 hover:underline text-left"><User className="w-4 h-4" /> Contactar suporte</button>
          <button onClick={() => router.push('/profile/faq')} className="flex items-center gap-2 text-blue-700 hover:underline text-left"><Info className="w-4 h-4" /> FAQ</button>
          <button onClick={() => router.push('/profile/privacy')} className="flex items-center gap-2 text-blue-700 hover:underline text-left"><Shield className="w-4 h-4" /> Política privacidade</button>
        </div>
      </div>
      {/* Switch iOS-style */}
      <style jsx global>{`
        .ios-switch {
          appearance: none;
          width: 40px;
          height: 22px;
          background: #e5e7eb;
          border-radius: 9999px;
          position: relative;
          outline: none;
          transition: background 0.2s;
        }
        .ios-switch:checked {
          background: linear-gradient(90deg, #3CB371 0%, #E94E8A 100%);
        }
        .ios-switch::before {
          content: '';
          position: absolute;
          left: 2px;
          top: 2px;
          width: 18px;
          height: 18px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          transition: transform 0.2s;
        }
        .ios-switch:checked::before {
          transform: translateX(18px);
        }
      `}</style>
      <BottomNavigationMenu />
    </div>
  );
} 