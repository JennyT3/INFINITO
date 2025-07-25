"use client";

import { useRouter } from "next/navigation";
import { useLanguage, useUser } from '../../components/theme-provider';
import { User, ArrowRight, ArrowLeft, Star, Package, CreditCard, Settings, BookOpen, Award, Heart } from 'lucide-react';
import BottomNavigationMenu from '../../components/BottomNavigationMenu';
import { useSession } from 'next-auth/react';
import { useRef, useState, useEffect } from 'react';

const translations = {
  pt: { title: 'Meu Perfil', collectibles: 'Colecionáveis', sales: 'Painel de Vendedor', passport: 'Passaporte', orders: 'Encomendas', reviews: 'Avaliações', payment: 'Pagamentos', favorites: 'Favoritos', settings: 'Definições', back: 'Voltar', change: 'Alterar', logout: 'Sair', avatar: 'Alterar Avatar', email: 'Email', save: 'Guardar', edit: 'Editar', delete: 'Eliminar', confirm: 'Confirmar', cancel: 'Cancelar', success: 'Perfil atualizado com sucesso!', error: 'Erro ao atualizar perfil.' },
  en: { title: 'My Profile', collectibles: 'Collectibles', sales: 'Seller Panel', passport: 'Impact Passport', orders: 'My Orders', reviews: 'My Reviews', payment: 'Payment Methods', favorites: 'Favorites', settings: 'Settings', back: 'Back', change: 'Change', logout: 'Log out', avatar: 'Change Avatar', email: 'Email', save: 'Save', edit: 'Edit', delete: 'Delete', confirm: 'Confirm', cancel: 'Cancel', success: 'Profile updated successfully!', error: 'Error updating profile.' },
  es: { title: 'Mi Perfil', collectibles: 'Coleccionables', sales: 'Panel de Vendedor', passport: 'Pasaporte', orders: 'Mis Pedidos', reviews: 'Mis Reseñas', payment: 'Métodos de Pago', favorites: 'Favoritos', settings: 'Configuración', back: 'Volver', change: 'Cambiar', logout: 'Cerrar sesión', avatar: 'Cambiar Avatar', email: 'Correo', save: 'Guardar', edit: 'Editar', delete: 'Eliminar', confirm: 'Confirmar', cancel: 'Cancelar', success: '¡Perfil actualizado con éxito!', error: 'Error al actualizar el perfil.' },
};

const links = [
  { href: '/profile/impact-passport', icon: Award, key: 'passport' },
  { href: '/profile/contribution-history', icon: BookOpen, key: 'sales' },
  { href: '/profile/payment-methods', icon: CreditCard, key: 'payment' },
  { href: '/profile/my-reviews', icon: Star, key: 'reviews' },
  { href: '/profile/my-orders', icon: Package, key: 'orders' },
  { href: '/profile/collectibles', icon: Award, key: 'collectibles' },
  { href: '/profile/favorites', icon: Heart, key: 'favorites' },
  { href: '/profile/settings', icon: Settings, key: 'settings' },
];

export default function ProfilePage() {
  const { language } = useLanguage();
  const router = useRouter();
  const { userName, setUserName, email, setEmail } = useUser();
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('userAvatar') : null
  );
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  if (!hydrated) return null;

  // Prioridad: avatar subido > avatar de Google > avatar por defecto
  const displayAvatar = avatarUrl || session?.user?.image || null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarUrl(ev.target?.result as string);
        if (typeof window !== 'undefined') {
          localStorage.setItem('userAvatar', ev.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogout = () => {
    setUserName('');
    setEmail('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
    }
    router.replace('/splash');
  };

  const t = translations[language] || translations.pt;

  const getLabel = (key: string) => t[key as keyof typeof t] || key;

  return (
    <>
      <style jsx>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes glow-avatar {
          0%, 100% { box-shadow: 0 0 20px rgba(67,178,210,0.3); }
          50% { box-shadow: 0 0 30px rgba(67,178,210,0.6); }
        }
        
        @keyframes float-card {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
      
      <div 
        className="min-h-screen font-raleway relative pb-24"
        style={{
          backgroundColor: "#EDE4DA",
          backgroundImage: "url('/fondo.png'), radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px)",
          backgroundSize: "cover, 20px 20px, 25px 25px",
          backgroundRepeat: "no-repeat, repeat, repeat"
        }}
      >
        {/* Header futurista con glassmorphism */}
        <div 
          className="bg-white/20 backdrop-blur-md border-b border-white/30 px-6 py-4 sticky top-0 z-10"
          style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))" }}
        >
          <div className="flex items-center justify-between max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl">
            <button 
              onClick={() => { router.push('/dashboard'); }} 
              className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105"
              style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            </button>
            <h1 className="font-bold text-lg md:text-xl text-gray-800 tracking-wider">{t.title}</h1>
            <div className="w-10 md:w-12"></div>
          </div>
        </div>

        <div className="max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl p-6">
          {/* Layout responsivo */}
          <div className="md:flex md:gap-8 md:items-start">
            {/* Sección del perfil - izquierda en desktop */}
            <div className="md:w-1/3 md:sticky md:top-24">
              <div 
                className="bg-white/25 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/30 text-center relative overflow-hidden"
                style={{ 
                  filter: "drop-shadow(0 8px 16px rgba(67,178,210,0.2))",
                  animation: "float-card 4s ease-in-out infinite"
                }}
              >
                {/* Avatar futurista */}
                <div className="flex flex-col items-center mb-6">
                  <div 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/30 flex items-center justify-center mb-4 overflow-hidden cursor-pointer relative group border-2 border-white/40"
                    onClick={handleAvatarClick} 
                    title="Cambiar avatar"
                    style={{ 
                      animation: "glow-avatar 3s ease-in-out infinite",
                      filter: "drop-shadow(0 4px 12px rgba(67,178,210,0.3))"
                    }}
                  >
                    {displayAvatar ? (
                      <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 md:w-16 md:h-16 text-gray-500" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white text-xs text-center py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-b-full font-medium">
                      {t.change}
                    </div>
                  </div>
                  
                  {/* Nombre editable */}
                  <input
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    className="font-bold text-lg md:text-xl text-gray-800 mb-2 text-center bg-transparent outline-none border-b-2 border-white/30 focus:border-white/60 transition-all duration-300 w-full px-2 py-1 rounded-none tracking-wider"
                    placeholder="User Name"
                  />
                  
                  {/* Email */}
                  <div className="text-gray-600 text-sm md:text-base font-light tracking-wide">
                    {email || 'user@email.com'}
                  </div>
                </div>

                {/* Estadísticas del usuario */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/30">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800" style={{ color: "#689610" }}>12</div>
                      <div className="text-xs text-gray-600">Contribuições</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800" style={{ color: "#D42D66" }}>5</div>
                      <div className="text-xs text-gray-600">Recompensas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800" style={{ color: "#43B2D2" }}>8.5</div>
                      <div className="text-xs text-gray-600">Pegada</div>
                    </div>
                  </div>
                                 </div>
               </div>
               
               {/* Botón de logout futurista - Solo visible en desktop */}
               <div className="hidden md:flex justify-center">
                 <button
                   onClick={() => { handleLogout(); }}
                   className="px-8 py-4 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30 flex items-center gap-2"
                   style={{ 
                     background: "linear-gradient(135deg, #D42D66 0%, #813684 100%)",
                     filter: "drop-shadow(0 6px 12px rgba(212,45,102,0.3))"
                   }}
                 >
                   <span className="tracking-wider">{t.logout}</span>
                   <ArrowRight className="w-5 h-5" />
                 </button>
               </div>
             </div>

             {/* Botones del perfil - derecha en desktop */}
             <div className="md:w-2/3">
              <div 
                className="bg-white/25 backdrop-blur-md rounded-2xl p-6 border border-white/30 mb-8 relative overflow-hidden"
                style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {links.map((link, index) => {
                    const colors = [
                      "#689610", "#3E88FF", "#D42D66", "#EAB308", 
                      "#F47802", "#43B2D2", "#813684", "#689610"
                    ];
                    const currentColor = colors[index % colors.length];
                    
                    return (
                      <button
                        key={link.href}
                        onClick={() => { router.push(link.href); }}
                        className="group bg-white/20 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 flex items-center gap-3 text-left relative overflow-hidden"
                        style={{ filter: `drop-shadow(0 4px 8px ${currentColor}20)` }}
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent to-white/10 pointer-events-none" />
                        <div 
                          className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border border-white/40 flex-shrink-0"
                          style={{ backgroundColor: currentColor }}
                        >
                          <link.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <span className="font-bold text-gray-800 text-sm md:text-base tracking-wider">
                            {getLabel(link.key)}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>

                             {/* Botón de logout futurista - Solo visible en móvil */}
               <div className="flex justify-center md:hidden">
                 <button
                   onClick={() => { handleLogout(); }}
                   className="px-8 py-4 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30 flex items-center gap-2"
                   style={{ 
                     background: "linear-gradient(135deg, #D42D66 0%, #813684 100%)",
                     filter: "drop-shadow(0 6px 12px rgba(212,45,102,0.3))"
                   }}
                 >
                   <span className="tracking-wider">{t.logout}</span>
                   <ArrowRight className="w-5 h-5" />
                 </button>
               </div>
            </div>
          </div>
        </div>

        {/* Efectos de fondo con colores INFINITO */}
        <div className="absolute top-32 left-8 w-3 h-3 rounded-full opacity-30 animate-pulse" style={{ backgroundColor: "#689610" }}></div>
        <div className="absolute bottom-40 right-10 w-2 h-2 rounded-full opacity-40 animate-pulse delay-1000" style={{ backgroundColor: "#3E88FF" }}></div>
        <div className="absolute top-1/2 right-6 w-2.5 h-2.5 rounded-full opacity-35 animate-pulse delay-500" style={{ backgroundColor: "#F47802" }}></div>
        <div className="absolute bottom-1/3 left-4 w-2 h-2 rounded-full opacity-30 animate-pulse delay-700" style={{ backgroundColor: "#D42D66" }}></div>
        <div className="absolute top-2/3 left-1/4 w-1.5 h-1.5 rounded-full opacity-25 animate-pulse delay-300" style={{ backgroundColor: "#EAB308" }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full opacity-35 animate-pulse delay-800" style={{ backgroundColor: "#43B2D2" }}></div>
        <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full opacity-20 animate-pulse delay-400" style={{ backgroundColor: "#813684" }}></div>
        
        <BottomNavigationMenu />
      </div>
    </>
  );
} 