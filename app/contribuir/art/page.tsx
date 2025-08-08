"use client";
import { useState } from "react";
import { ArrowLeft, Sparkles, ShoppingBag, BarChart2, BookOpen, Share2, Video, Calendar, Palette } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BottomNavigationMenu from '../../../components/BottomNavigationMenu';

export default function ArtisticActionsPage() {
  const router = useRouter();
  const [isArtist, setIsArtist] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState<string | boolean>('');
  const [form, setForm] = useState({ quantidade: '', ponto: '' });
  const [error, setError] = useState('');
  const [profileShared, setProfileShared] = useState(false);
  const [envio, setEnvio] = useState('');
  const [tab, setTab] = useState<'blog'|'videos'|'eventos'>('blog');
  const pontos = ["Centro de Vila Real", "Biblioteca Municipal", "Mercado Municipal"];

  const handleRegister = (e: any) => {
    e.preventDefault();
    setIsArtist(true);
    setShowRequestForm(true);
  };
  const handleRequest = (e: any) => {
    e.preventDefault();
    if (!form.quantidade || isNaN(Number(form.quantidade)) || Number(form.quantidade) < 1 || Number(form.quantidade) > 15) {
      setError('Escolhe uma quantidade entre 1 e 15 peças.');
      return;
    }
    if (!form.ponto) {
      setError('Seleciona um ponto de recolha.');
      return;
    }
    setError('');
    alert('Pedido enviado! A equipa INFINITO confirmará a disponibilidade e combinará a recolha.');
    setShowRequestForm(false);
    setForm({ quantidade: '', ponto: '' });
  };

  return (
    <div className="h-screen overflow-y-auto font-raleway bg-[#EDE4DA] pb-24" style={{ backgroundImage: "url('/fondo.png')" }}>
      {/* Menú superior tipo /profile */}
      <div className="bg-white/30 backdrop-blur-md border-b border-white/30 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button onClick={() => router.push('/contribuir')} className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="font-bold text-lg md:text-xl text-gray-800 tracking-wider">Reparação Artística</h1>
          <div className="w-10"></div>
        </div>
      </div>
      {/* Hero visual en dos columnas para web */}
      <div className="max-w-2xl mx-auto px-4 flex flex-col md:flex-row gap-8 items-start md:items-center mt-8 mb-8">
        <div className="flex-shrink-0 flex justify-center w-full md:w-1/2">
          <Image src="/NFT/6.png" alt="NFT Artista" width={200} height={200} className="rounded-3xl shadow-xl mb-2" style={{maxWidth:'240px', width:'100%', height:'auto'}} />
        </div>
        <div className="flex-1 flex flex-col gap-4 items-center md:items-start w-full">
          <div className="w-full bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-4 flex flex-col items-center md:items-start">
            <h2 className="font-bold text-2xl md:text-3xl text-center md:text-left tracking-wide text-green-800 mb-1">Porquê ser artista INFINITO?</h2>
            <div className="grid grid-cols-2 gap-4 w-full mt-2 mb-2 md:grid-cols-2">
              <div className="flex flex-col items-center bg-white/80 rounded-xl p-3 shadow border border-green-100 w-full">
                <Sparkles className="w-8 h-8 text-green-700 mb-1" />
                <span className="text-xs text-gray-700 text-center">Impacto ambiental</span>
              </div>
              <div className="flex flex-col items-center bg-white/80 rounded-xl p-3 shadow border border-yellow-100 w-full">
                <ShoppingBag className="w-8 h-8 text-yellow-600 mb-1" />
                <span className="text-xs text-gray-700 text-center">Vender peças</span>
              </div>
              <div className="flex flex-col items-center bg-white/80 rounded-xl p-3 shadow border border-purple-100 w-full">
                <BarChart2 className="w-8 h-8 text-purple-600 mb-1" />
                <span className="text-xs text-gray-700 text-center">Controlo de vendas</span>
              </div>
              <div className="flex flex-col items-center bg-white/80 rounded-xl p-3 shadow border border-blue-100 w-full">
                <BookOpen className="w-8 h-8 text-blue-700 mb-1" />
                <span className="text-xs text-gray-700 text-center">Formação permanente</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Botones de ação en dos columnas para web */}
      <div className="max-w-2xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button className="bg-green-700 text-white py-5 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center justify-center gap-3 w-full" onClick={() => { if (!isArtist) setShowRequestForm('register'); else setShowRequestForm(true); }}>
          <Sparkles className="w-7 h-7" /> Solicitar peças
        </button>
        <button className="bg-purple-700 text-white py-5 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center justify-center gap-3 w-full" onClick={() => router.push('/sell-products')}>
          <ShoppingBag className="w-7 h-7" /> Vender peça
        </button>
        <button className="bg-white/80 border border-purple-200 text-purple-700 py-5 rounded-2xl font-bold shadow hover:bg-purple-100 transition-all flex items-center justify-center gap-3 w-full" onClick={() => router.push('/marketplace')}>
          <ShoppingBag className="w-6 h-6" /> Marketplace
        </button>
        <button className="bg-white/80 border border-blue-200 text-blue-700 py-5 rounded-2xl font-bold shadow hover:bg-blue-100 transition-all flex items-center justify-center gap-3 w-full" onClick={() => window.scrollTo({top: 9999, behavior: 'smooth'})}>
          <BookOpen className="w-6 h-6" /> Formação
        </button>
      </div>
      {/* Registro de artista minimalista */}
      {showRequestForm === 'register' && (
        <form className="bg-white/90 rounded-2xl p-6 shadow-xl w-full max-w-xs mx-auto mb-4 flex flex-col gap-4 items-center" onSubmit={handleRegister}>
          <input className="border rounded-lg px-3 py-2 w-full text-center" placeholder="Nome" required />
          <select className="border rounded-lg px-3 py-2 w-full text-center" value={envio} onChange={e => setEnvio(e.target.value)} required>
            <option value="">Recolha ou entrega?</option>
            <option value="envia">Faço entrega</option>
            <option value="ponto">Recolho no ponto</option>
          </select>
          <div className="flex gap-2 w-full">
            <button type="submit" className="flex-1 bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition-all flex items-center justify-center gap-2">Registar</button>
            <button type="button" className="flex-1 bg-yellow-500 text-white py-3 rounded-xl font-bold hover:bg-yellow-600 transition-all flex items-center justify-center gap-2" onClick={() => { setProfileShared(true); setTimeout(() => setProfileShared(false), 2000); }}>
              <Share2 className="w-5 h-5" /> Partilhar
            </button>
          </div>
          {profileShared && <div className="text-green-700 text-sm mt-2">Link copiado!</div>}
        </form>
      )}
      {/* Formulário de solicitação de peças minimalista */}
      {showRequestForm === true && (
        <form className="bg-white/90 rounded-2xl p-6 shadow-xl w-full max-w-xs mx-auto mb-4 flex flex-col gap-4 items-center" onSubmit={handleRequest}>
          <input className="border rounded-lg px-3 py-2 w-full text-center" type="number" min="1" max="15" value={form.quantidade} onChange={e => setForm(f => ({ ...f, quantidade: e.target.value }))} placeholder="Quantidade (máx. 15)" required />
          <select className="border rounded-lg px-3 py-2 w-full text-center" value={form.ponto} onChange={e => setForm(f => ({ ...f, ponto: e.target.value }))} required>
            <option value="">Ponto de recolha</option>
            {pontos.map((p, i) => <option key={i} value={p}>{p}</option>)}
          </select>
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <button type="submit" className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition-all">Enviar pedido</button>
        </form>
      )}
      {/* Bloco de formação com tabs */}
      <div className="w-full max-w-2xl mx-auto px-4 mt-8">
        <div className="bg-white/80 rounded-2xl shadow-xl p-4 flex flex-col gap-4">
          <div className="flex gap-2 mb-2">
            <button className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${tab==='blog' ? 'bg-green-700 text-white' : 'bg-white text-green-700 border border-green-200'}`} onClick={()=>setTab('blog')}><BookOpen className="w-5 h-5" /> Blog</button>
            <button className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${tab==='videos' ? 'bg-purple-700 text-white' : 'bg-white text-purple-700 border border-purple-200'}`} onClick={()=>setTab('videos')}><Video className="w-5 h-5" /> Vídeos</button>
            <button className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${tab==='eventos' ? 'bg-yellow-600 text-white' : 'bg-white text-yellow-600 border border-yellow-200'}`} onClick={()=>setTab('eventos')}><Calendar className="w-5 h-5" /> Eventos</button>
          </div>
          {tab==='blog' && (
            <div className="flex flex-col gap-2">
              <div className="bg-white rounded-xl p-4 shadow flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-green-700" />
                <div>
                  <div className="font-bold text-gray-800">Como dar nova vida às tuas peças</div>
                  <div className="text-xs text-gray-500">Dicas de upcycling e criatividade</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-green-700" />
                <div>
                  <div className="font-bold text-gray-800">Tendências de arte sustentável</div>
                  <div className="text-xs text-gray-500">Inspira-te com artistas portugueses</div>
                </div>
              </div>
            </div>
          )}
          {tab==='videos' && (
            <div className="flex flex-col gap-2">
              <div className="bg-white rounded-xl p-4 shadow flex items-center gap-3">
                <Video className="w-8 h-8 text-purple-700" />
                <div>
                  <div className="font-bold text-gray-800">Vídeo: Como reparar uma peça</div>
                  <div className="text-xs text-gray-500">Tutorial passo a passo</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow flex items-center gap-3">
                <Video className="w-8 h-8 text-purple-700" />
                <div>
                  <div className="font-bold text-gray-800">Entrevista: Artista INFINITO</div>
                  <div className="text-xs text-gray-500">Histórias de impacto real</div>
                </div>
              </div>
            </div>
          )}
          {tab==='eventos' && (
            <div className="flex flex-col gap-2">
              <div className="bg-white rounded-xl p-4 shadow flex items-center gap-3">
                <Calendar className="w-8 h-8 text-yellow-600" />
                <div>
                  <div className="font-bold text-gray-800">Workshop: Bordado Criativo</div>
                  <div className="text-xs text-gray-500">Vila Real, 22/06</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow flex items-center gap-3">
                <Calendar className="w-8 h-8 text-yellow-600" />
                <div>
                  <div className="font-bold text-gray-800">Encontro de Artistas</div>
                  <div className="text-xs text-gray-500">Online, 30/06</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNavigationMenu />
    </div>
  );
} 