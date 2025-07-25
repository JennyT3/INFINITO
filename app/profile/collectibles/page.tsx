"use client";
import { useLanguage } from '../../../components/theme-provider';
import { useUser } from '../../../components/theme-provider';
import { Share2, ArrowLeft, Star, Lock, Sparkles, Trophy, Crown, Zap, X, Filter, Grid, List, Search, Award, Download, Eye, Calendar, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import BottomNavigationMenu from '../../../components/BottomNavigationMenu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const collectiblesList = [
  { 
    img: '/NFT/1.png', 
    label: 'Primeira contribuição', 
    desc: 'Receba este colecionável ao fazer sua primeira contribuição sustentável na plataforma.', 
    unlocked: true,
    rarity: 'comum',
    icon: Star,
    unlockedDate: '2024-01-15',
    category: 'Contribuição',
    points: 100,
    level: 1
  },
  { 
    img: '/NFT/2.png', 
    label: 'Sou membro', 
    desc: 'Seja reconhecido como membro ativo da comunidade INFINITO.', 
    unlocked: true,
    rarity: 'raro',
    icon: Crown,
    unlockedDate: '2024-01-10',
    category: 'Comunidade',
    points: 250,
    level: 2
  },
  { 
    img: '/NFT/3.png', 
    label: 'Voluntário', 
    desc: 'Participe como voluntário em um evento oficial INFINITO.', 
    unlocked: false, 
    unlockMsg: 'Participe de um evento para desbloquear.',
    rarity: 'épico',
    icon: Trophy,
    category: 'Evento',
    points: 500,
    level: 3
  },
  { 
    img: '/NFT/4.png', 
    label: 'Primeira compra', 
    desc: 'Realize sua primeira compra sustentável no marketplace INFINITO.', 
    unlocked: true,
    rarity: 'comum',
    icon: Sparkles,
    unlockedDate: '2024-01-05',
    category: 'Marketplace',
    points: 150,
    level: 1
  },
  { 
    img: '/NFT/1.png', 
    label: 'Primeira Troca', 
    desc: 'Troque um item com outro usuário da comunidade.', 
    unlocked: false, 
    unlockMsg: 'Troque um item para desbloquear.',
    rarity: 'raro',
    icon: Zap,
    category: 'Troca',
    points: 300,
    level: 2
  },
  { 
    img: '/NFT/2.png', 
    label: 'Estudante Sustentável', 
    desc: 'Complete um curso de sustentabilidade na plataforma.', 
    unlocked: false, 
    unlockMsg: 'Complete um curso para desbloquear.',
    rarity: 'épico',
    icon: Award,
    category: 'Educação',
    points: 400,
    level: 3
  },
  { 
    img: '/NFT/3.png', 
    label: 'Explorador Local', 
    desc: 'Visite uma loja física parceira do INFINITO.', 
    unlocked: true,
    rarity: 'comum',
    icon: Star,
    unlockedDate: '2024-01-01',
    category: 'Experiência',
    points: 200,
    level: 1
  },
  { 
    img: '/NFT/4.png', 
    label: 'Caixa Misteriosa', 
    desc: 'Colecionável surpresa! Continue participando para descobrir.', 
    unlocked: false, 
    unlockMsg: 'Complete 10 contribuições para desbloquear.',
    rarity: 'lendário',
    icon: Crown,
    category: 'Especial',
    points: 1000,
    level: 5
  },
  { 
    img: '/NFT/1.png', 
    label: 'Artista Colaborador', 
    desc: 'Seja reconhecido como artista colaborador do INFINITO.', 
    unlocked: false, 
    unlockMsg: 'Seja artista colaborador para desbloquear.',
    rarity: 'épico',
    icon: Sparkles,
    category: 'Arte',
    points: 750,
    level: 4
  },
  { 
    img: '/NFT/2.png', 
    label: 'Vendedor Sustentável', 
    desc: 'Realize 5 vendas bem-sucedidas no marketplace.', 
    unlocked: true,
    rarity: 'raro',
    icon: Trophy,
    unlockedDate: '2023-12-20',
    category: 'Marketplace',
    points: 350,
    level: 2
  },
  { 
    img: '/NFT/3.png', 
    label: 'Influenciador Verde', 
    desc: 'Compartilhe 20 posts sobre sustentabilidade.', 
    unlocked: false, 
    unlockMsg: 'Compartilhe mais conteúdo sustentável.',
    rarity: 'épico',
    icon: Share2,
    category: 'Social',
    points: 600,
    level: 3
  },
  { 
    img: '/NFT/4.png', 
    label: 'Colecionador Elite', 
    desc: 'Desbloqueie 15 colecionáveis diferentes.', 
    unlocked: false, 
    unlockMsg: 'Desbloqueie mais colecionáveis.',
    rarity: 'lendário',
    icon: Crown,
    category: 'Coleção',
    points: 2000,
    level: 6
  },
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'comum': return 'from-green-500 to-green-600';
    case 'raro': return 'from-blue-500 to-blue-600';
    case 'épico': return 'from-purple-500 to-purple-600';
    case 'lendário': return 'from-yellow-500 to-orange-500';
    default: return 'from-gray-500 to-gray-600';
  }
};

const getRarityBadgeColor = (rarity: string) => {
  switch (rarity) {
    case 'comum': return 'bg-green-100 text-green-800';
    case 'raro': return 'bg-blue-100 text-blue-800';
    case 'épico': return 'bg-purple-100 text-purple-800';
    case 'lendário': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function CollectiblesPage() {
  const { language } = useLanguage();
  let userName = '';
  try {
    userName = useUser().userName;
  } catch (err) {
    console.error('Error in useUser:', err);
    userName = '';
  }
  const router = useRouter();
  const [modal, setModal] = useState<{ open: boolean, idx: number | null }>({ open: false, idx: null });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rarity' | 'points' | 'name'>('date');
  const [filteredCollectibles, setFilteredCollectibles] = useState(collectiblesList);
  const [avatar, setAvatar] = useState('/avatar1.svg');
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(typeof window !== 'undefined');
    try {
      if (typeof window !== 'undefined') {
        const storedAvatar = localStorage.getItem('userAvatar');
        if (storedAvatar) setAvatar(storedAvatar);
      }
    } catch (err) {
      console.error('Error accessing localStorage for avatar:', err);
    }
  }, []);

  useEffect(() => {
    try {
      applyFilters();
    } catch (err) {
      console.error('Error in applyFilters:', err);
      setError('Ocurrió un error al filtrar los coleccionables.');
    }
  }, [searchTerm, filterRarity, filterCategory, filterStatus, sortBy]);

  const applyFilters = () => {
    let filtered = [...collectiblesList];
    try {
      if (searchTerm) {
        filtered = filtered.filter(item => 
          item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (filterRarity !== 'all') {
        filtered = filtered.filter(item => item.rarity === filterRarity);
      }
      if (filterCategory !== 'all') {
        filtered = filtered.filter(item => item.category === filterCategory);
      }
      if (filterStatus !== 'all') {
        filtered = filtered.filter(item => 
          filterStatus === 'unlocked' ? item.unlocked : !item.unlocked
        );
      }
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'date':
            if (!a.unlockedDate && !b.unlockedDate) return 0;
            if (!a.unlockedDate) return 1;
            if (!b.unlockedDate) return -1;
            return new Date(b.unlockedDate).getTime() - new Date(a.unlockedDate).getTime();
          case 'rarity':
            const rarityOrder = { 'comum': 1, 'raro': 2, 'épico': 3, 'lendário': 4 };
            return (rarityOrder[b.rarity as keyof typeof rarityOrder] || 0) - (rarityOrder[a.rarity as keyof typeof rarityOrder] || 0);
          case 'points':
            return (b.points || 0) - (a.points || 0);
          case 'name':
            return a.label.localeCompare(b.label);
          default:
            return 0;
        }
      });
      setFilteredCollectibles(filtered);
    } catch (err) {
      console.error('Error in applyFilters inner:', err);
      setError('Ocurrió un error al filtrar los coleccionables.');
    }
  };

  const playSuccessSound = () => {
    try {
      if (typeof window !== 'undefined') {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    } catch (err) {
      console.error('Error in playSuccessSound:', err);
    }
  };

  const handleCollectibleClick = (idx: number) => {
    try {
      const collectible = collectiblesList[idx];
      if (collectible.unlocked) {
        playSuccessSound();
        if (typeof window !== 'undefined') {
          const button = document.querySelector(`[data-collectible="${idx}"]`) as HTMLElement;
          if (button) {
            button.classList.add('animate-pulse');
            setTimeout(() => {
              button.classList.remove('animate-pulse');
            }, 600);
          }
        }
      }
      setModal({ open: true, idx });
    } catch (err) {
      console.error('Error in handleCollectibleClick:', err);
      setError('Ocurrió un error al abrir el coleccionable.');
    }
  };

  const handleShare = () => {
    try {
      if (typeof window !== 'undefined') {
        const url = window.location.href;
        const shareText = `Confira minha coleção INFINITO! Já desbloqueei ${unlockedCount} de ${totalCount} colecionáveis 🏆`;
        if (navigator.share) {
          navigator.share({ title: 'Minha Coleção INFINITO', text: shareText, url });
        } else {
          navigator.clipboard.writeText(`${shareText}\n\n${url}`);
          alert('Link copiado!');
        }
      }
    } catch (err) {
      console.error('Error in handleShare:', err);
      setError('Ocurrió un error al compartir.');
    }
  };

  const handleShareCollectible = (collectible: any) => {
    try {
      if (typeof window !== 'undefined') {
        const shareText = `Conquistei o colecionável "${collectible.label}" no INFINITO! 🎉\n\n${collectible.desc}`;
        const url = window.location.href;
        if (navigator.share) {
          navigator.share({ 
            title: `Colecionável: ${collectible.label}`, 
            text: shareText,
            url: url 
          });
        } else {
          navigator.clipboard.writeText(`${shareText}\n\n${url}`);
          alert('Colecionável copiado para compartilhar!');
        }
      }
    } catch (err) {
      console.error('Error in handleShareCollectible:', err);
      setError('Ocurrió un error al compartir o copiar el coleccionable.');
    }
  };

  const handleDownloadCollectible = (collectible: any) => {
    try {
      if (typeof window !== 'undefined') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = 400;
          canvas.height = 400;
          const gradient = ctx.createLinearGradient(0, 0, 400, 400);
          gradient.addColorStop(0, '#689610');
          gradient.addColorStop(1, '#3E88FF');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 400, 400);
          ctx.fillStyle = 'white';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(collectible.label, 200, 350);
          const link = document.createElement('a');
          link.download = `${collectible.label}.png`;
          link.href = canvas.toDataURL();
          link.click();
        }
      }
    } catch (err) {
      console.error('Error in handleDownloadCollectible:', err);
      setError('Ocurrió un error al descargar el coleccionable.');
    }
  };

  const unlockedCount = collectiblesList.filter(item => item.unlocked).length;
  const totalCount = collectiblesList.length;
  const totalPoints = collectiblesList.filter(item => item.unlocked).reduce((sum, item) => sum + (item.points || 0), 0);

  const categories = [...new Set(collectiblesList.map(item => item.category))];
  const rarities = [...new Set(collectiblesList.map(item => item.rarity))];

  const getStats = () => {
    const byRarity = {
      comum: collectiblesList.filter(item => item.rarity === 'comum' && item.unlocked).length,
      raro: collectiblesList.filter(item => item.rarity === 'raro' && item.unlocked).length,
      épico: collectiblesList.filter(item => item.rarity === 'épico' && item.unlocked).length,
      lendário: collectiblesList.filter(item => item.rarity === 'lendário' && item.unlocked).length,
    };
    
    const byCategory = categories.map(category => ({
      name: category,
      count: collectiblesList.filter(item => item.category === category && item.unlocked).length,
      total: collectiblesList.filter(item => item.category === category).length
    }));

    return { byRarity, byCategory };
  };

  const stats = getStats();

  return (
    <div 
      className="min-h-screen pb-20 relative overflow-hidden font-raleway"
      style={{
        backgroundColor: "#EDE4DA",
        backgroundImage: "url('/fondo.png'), radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px)",
        backgroundSize: "cover, 20px 20px, 25px 25px",
        backgroundRepeat: "no-repeat, repeat, repeat"
      }}
    >
      {/* Header futurista con glassmorphism */}
      <div 
        className="bg-white/60 backdrop-blur-xl border-b border-white/70 px-6 py-5 sticky top-0 z-10"
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}
      >
        <div className="flex items-center justify-between max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl">
          <button 
            onClick={() => router.push('/profile')} 
            className="w-12 h-12 md:w-14 md:h-14 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/70 hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg"
            style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.15))" }}
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
          </button>
          <div 
            className="bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 border border-white/70 shadow-lg"
            style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.15))" }}
          >
            <span className="text-lg md:text-xl font-bold text-gray-800 tracking-wider">
              Colecionáveis
            </span>
          </div>
          <button
            onClick={handleShare}
            className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center border border-white/70 hover:from-pink-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 shadow-lg"
            style={{ filter: "drop-shadow(0 6px 12px rgba(212,45,102,0.3))" }}
          >
            <Share2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl p-6">
        {/* Layout responsive para web y móvil */}
        <div className="md:flex md:gap-8 md:items-start">
          {/* Perfil lateral en desktop */}
          <div className="md:w-1/3 md:sticky md:top-32">
            <div 
              className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/70 shadow-xl mb-8"
              style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))" }}
            >
              {/* Logo + Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-3">
                  <Image src="/LOGO3.png" alt="INFINITO logo" width={70} height={50} className="h-12 w-auto filter drop-shadow-lg" />
                </div>
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-2xl blur-md opacity-60 animate-pulse"></div>
                  <div className="relative border-3 border-white/80 rounded-2xl p-2 bg-white/95 backdrop-blur-sm">
                    <img
                      src={avatar || '/avatar1.svg'}
                      alt="Avatar"
                      className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover"
                    />
                  </div>
                </div>
                
                {/* Nombre */}
                <div className="text-center mb-4">
                  <h2 className="font-bold text-xl md:text-2xl text-gray-800 tracking-wider mb-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
                    {userName || 'Usuário'}
                  </h2>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full mx-auto"></div>
                </div>
              </div>
              
              {/* Stats principais */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-gray-800">{unlockedCount}</div>
                    <div className="text-sm text-gray-600">Desbloqueados</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{totalPoints}</div>
                    <div className="text-sm text-gray-600">Pontos</div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Progresso */}
              <div 
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/80 shadow-lg mb-6"
                style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-800 font-bold text-sm">Progresso Geral</span>
                  <span className="text-gray-900 font-bold text-sm">{unlockedCount}/{totalCount}</span>
                </div>
                <Progress value={(unlockedCount / totalCount) * 100} className="mb-2" />
                <div className="text-center">
                  <span className="text-xs text-gray-600">
                    {Math.round((unlockedCount / totalCount) * 100)}% completo
                  </span>
                </div>
              </div>

              {/* Stats por raridade */}
              <div 
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/80 shadow-lg"
                style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
              >
                <h3 className="font-bold text-sm text-gray-800 mb-3">Por Raridade</h3>
                <div className="space-y-2">
                  {Object.entries(stats.byRarity).map(([rarity, count]) => (
                    <div key={rarity} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getRarityColor(rarity)}`}></div>
                        <span className="text-xs capitalize text-gray-700">{rarity}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-800">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="md:w-2/3 md:pl-8">
            {/* Filtros y búsqueda */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Buscar colecionáveis..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Filtros */}
                  <div className="flex flex-wrap gap-2">
                    <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="unlocked">Desbloqueados</SelectItem>
                        <SelectItem value="locked">Bloqueados</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterRarity} onValueChange={(value: any) => setFilterRarity(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Raridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {rarities.map(rarity => (
                          <SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={filterCategory} onValueChange={(value: any) => setFilterCategory(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Ordenar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Data</SelectItem>
                        <SelectItem value="rarity">Raridade</SelectItem>
                        <SelectItem value="points">Pontos</SelectItem>
                        <SelectItem value="name">Nome</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* View Mode */}
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grid/List de colecionáveis */}
            {filteredCollectibles.length === 0 ? (
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Nenhum colecionável encontrado
                  </h3>
                  <p className="text-gray-600">
                    Tente ajustar os filtros ou buscar por outros termos.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full mb-6' : 'space-y-4'}>
                {filteredCollectibles.map((item, idx) => {
                  const IconComponent = item.icon;
                  const originalIndex = collectiblesList.findIndex(c => c.label === item.label);
                  
                  return (
                    <Card
                      key={idx}
                      className={`group relative bg-white/60 backdrop-blur-xl border border-white/80 transition-all duration-300 overflow-hidden ${
                        !item.unlocked 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:scale-105 hover:shadow-xl hover:bg-white/70 hover:shadow-2xl cursor-pointer'
                      }`}
                      onClick={() => handleCollectibleClick(originalIndex)}
                      style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.1))" }}
                    >
                      {/* Efecto de brillo para desbloqueados */}
                      {item.unlocked && (
                        <div className="absolute inset-0 bg-gradient-to-r opacity-20 blur-sm group-hover:opacity-30 transition-opacity duration-300" 
                             style={{ background: `linear-gradient(45deg, #689610, #3E88FF, #D42D66, #813684)` }}></div>
                      )}
                      
                      <CardContent className="p-4 relative z-10">
                        {viewMode === 'grid' ? (
                          <div className="flex flex-col items-center space-y-3">
                            {/* Indicador de raredad */}
                            <div className="flex justify-between items-center w-full">
                              <Badge className={`text-xs ${getRarityBadgeColor(item.rarity)}`}>
                                {item.rarity}
                              </Badge>
                              {!item.unlocked && <Lock className="w-4 h-4 text-gray-400" />}
                            </div>
                            
                            {/* Imagen */}
                            <div className="relative">
                              <div className="w-16 h-16 bg-white/80 rounded-xl flex items-center justify-center p-2 shadow-lg">
                                <img src={item.img} alt={item.label} className="w-full h-full object-contain filter drop-shadow-sm" />
                              </div>
                              {item.unlocked && (
                                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 shadow-lg">
                                  <IconComponent className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            
                            {/* Info */}
                            <div className="text-center">
                              <h3 className="font-bold text-sm text-gray-900 mb-1">{item.label}</h3>
                              <p className="text-xs text-gray-600 mb-2">{item.category}</p>
                              <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                                <Star className="w-3 h-3" />
                                <span>{item.points} pts</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            {/* Imagen */}
                            <div className="relative">
                              <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center p-2 shadow-lg">
                                <img src={item.img} alt={item.label} className="w-full h-full object-contain filter drop-shadow-sm" />
                              </div>
                              {!item.unlocked && (
                                <div className="absolute -top-1 -right-1 bg-gray-400 rounded-full p-1">
                                  <Lock className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            
                            {/* Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-sm text-gray-900">{item.label}</h3>
                                <Badge className={`text-xs ${getRarityBadgeColor(item.rarity)}`}>
                                  {item.rarity}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">{item.category}</p>
                              <p className="text-xs text-gray-500 line-clamp-2">{item.desc}</p>
                            </div>
                            
                            {/* Points */}
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Star className="w-3 h-3" />
                                <span>{item.points}</span>
                              </div>
                              {item.unlockedDate && (
                                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(item.unlockedDate).toLocaleDateString('pt-BR')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Efectos de fondo con colores INFINITO */}
        <div className="absolute top-32 left-8 w-3 h-3 rounded-full opacity-30 animate-pulse shadow-lg" style={{ backgroundColor: "#689610", filter: "blur(0.5px)" }}></div>
        <div className="absolute bottom-40 right-10 w-2 h-2 rounded-full opacity-40 animate-pulse delay-1000 shadow-lg" style={{ backgroundColor: "#3E88FF", filter: "blur(0.5px)" }}></div>
        <div className="absolute top-1/2 right-6 w-2.5 h-2.5 rounded-full opacity-35 animate-pulse delay-500 shadow-lg" style={{ backgroundColor: "#F47802", filter: "blur(0.5px)" }}></div>
        <div className="absolute bottom-1/3 left-4 w-2 h-2 rounded-full opacity-30 animate-pulse delay-700 shadow-lg" style={{ backgroundColor: "#D42D66", filter: "blur(0.5px)" }}></div>
        <div className="absolute top-2/3 left-1/4 w-1.5 h-1.5 rounded-full opacity-25 animate-pulse delay-300 shadow-lg" style={{ backgroundColor: "#EAB308", filter: "blur(0.5px)" }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full opacity-35 animate-pulse delay-800 shadow-lg" style={{ backgroundColor: "#43B2D2", filter: "blur(0.5px)" }}></div>
        <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full opacity-20 animate-pulse delay-400 shadow-lg" style={{ backgroundColor: "#813684", filter: "blur(0.5px)" }}></div>
        
        {/* Gradiente decorativo inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Modal mejorado */}
      {modal.open && modal.idx !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn" 
          onClick={() => setModal({ open: false, idx: null })}
        >
          <div 
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 border border-white/80 relative animate-scaleIn"
            onClick={e => e.stopPropagation()}
          >
            {/* Botón X superior */}
            <button
              onClick={() => setModal({ open: false, idx: null })}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Efecto de brillo de fondo */}
            <div className="absolute inset-0 bg-gradient-to-r opacity-20 rounded-3xl blur-sm animate-pulse" 
                 style={{ background: `linear-gradient(45deg, #689610, #3E88FF, #D42D66, #813684)` }}></div>
            
            <div className="relative z-10 flex flex-col items-center">
              {/* Imagen principal */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r opacity-30 rounded-3xl blur-md animate-pulse" 
                     style={{ background: `linear-gradient(45deg, #689610, #3E88FF, #D42D66, #813684)` }}></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
                  <img 
                    src={collectiblesList[modal.idx].img} 
                    alt={collectiblesList[modal.idx].label} 
                    className="w-24 h-24 object-contain filter drop-shadow-lg" 
                  />
                </div>
              </div>
              
              {/* Información */}
              <div className="text-center mb-6">
                <h4 className="font-bold text-2xl text-gray-800 mb-3 tracking-wider">
                  {collectiblesList[modal.idx].label}
                </h4>
                
                <div className="flex justify-center gap-2 mb-3">
                  <Badge className={`text-sm ${getRarityBadgeColor(collectiblesList[modal.idx].rarity)}`}>
                    {collectiblesList[modal.idx].rarity.toUpperCase()}
                  </Badge>
                  <Badge className="text-sm">
                    {collectiblesList[modal.idx].category}
                  </Badge>
                </div>
                
                <p className="text-base text-gray-700 text-center mb-4 leading-relaxed">
                  {collectiblesList[modal.idx].desc}
                </p>
                
                <div className="flex justify-center items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{collectiblesList[modal.idx].points} pontos</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Trophy className="w-4 h-4 text-purple-500" />
                    <span>Nível {collectiblesList[modal.idx].level}</span>
                  </div>
                </div>
                
                {collectiblesList[modal.idx].unlockedDate && (
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>Desbloqueado em {new Date(collectiblesList[modal.idx].unlockedDate!).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                
                <div className="w-16 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto"></div>
              </div>
              
              {/* Mensaje de desbloqueo */}
              {!collectiblesList[modal.idx].unlocked && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 shadow-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-700 font-bold">
                      {collectiblesList[modal.idx].unlockMsg || 'Ainda não disponível.'}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Botones */}
              {collectiblesList[modal.idx].unlocked && (
                <div className="flex justify-center gap-3">
                  <Button
                    onClick={() => handleShareCollectible(collectiblesList[modal.idx!])}
                    className="flex items-center gap-2"
                    variant="outline"
                  >
                    <Share2 className="w-4 h-4" />
                    Compartilhar
                  </Button>
                  <Button
                    onClick={() => handleDownloadCollectible(collectiblesList[modal.idx!])}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Menú inferior */}
      <BottomNavigationMenu />
      
      {/* Estilos personalizados */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .border-3 {
          border-width: 3px;
        }
        
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  );
} 