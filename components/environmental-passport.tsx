"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search, User, Download, Leaf, Droplets, Zap, Award, TrendingUp, ExternalLink, Share2, Home, Recycle, Package, CheckCircle, Store, Star, Lock, HeartHandshake, Tag, ShoppingBag, Truck, Shield, AlertCircle } from "lucide-react"
import { useLanguage } from "../components/theme-provider"
import { useRouter } from "next/navigation"
import jsPDF from "jspdf"
import { QRCodeCanvas } from 'qrcode.react'
import { fetcher } from '@/lib/lib/api/fetcher'
import Image from 'next/image'

interface UserStats {
  contributions: number
  sales: number
  purchases: number
  collectibles: number
  totalImpact: {
    co2Saved: number // kg
    waterSaved: number // liters
    resourcesConserved: number // percentage
  }
  monthlyData: Array<{
    month: string
    contributions: number
    sales: number
    purchases: number
    impact: number
  }>
  recentTransactions: Array<{
    id: string
    type: "contribution" | "sale" | "purchase"
    item: string
    date: string
    impact: {
      co2: number
      water: number
    }
    location?: string
    approved?: boolean
  }>
}

interface EnvironmentalPassportProps {
  onBack: () => void
}

export default function EnvironmentalPassport({ onBack }: EnvironmentalPassportProps) {
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("6m")
  const [showShareModal, setShowShareModal] = useState(false)
  const [hoveredSection, setHoveredSection] = useState<keyof typeof sectionData | null>(null)
  const [selectedSection, setSelectedSection] = useState<keyof typeof sectionData | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const { language } = useLanguage()
  const router = useRouter()
  const [activeJourneyStep, setActiveJourneyStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [trackingNumber, setTrackingNumber] = useState("")
  const [showTrackingResults, setShowTrackingResults] = useState(false)
  const [progressStep, setProgressStep] = useState(2)
  const [contributionData, setContributionData] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // Animaciones de conteo para los valores de impacto
  const [co2Display, setCo2Display] = useState(0);
  const [waterDisplay, setWaterDisplay] = useState(0);
  const [resourcesDisplay, setResourcesDisplay] = useState(0);

  // Dados das seções do círculo
  const sectionData = {
    contribuicoes: { 
      number: userStats?.contributions || 0, 
      color: '#689610', 
      icon: HeartHandshake,
      label: 'Contributions',
      date: '2024-01-10'
    },
    compras: { 
      number: userStats?.purchases || 0, 
      color: '#3E88FF', 
      icon: Package,
      label: 'Purchases',
      date: '2024-01-12'
    },
    vendas: { 
      number: userStats?.sales || 0, 
      color: '#F47802', 
      icon: ShoppingBag,
      label: 'Sales',
      date: '2024-01-15'
    },
    doacoes: { 
      number: userStats?.collectibles || 0, 
      color: '#D42D66', 
      icon: Award,
      label: 'Donations',
      date: '2024-01-20'
    }
  };

  // Calcular total para el círculo
  const totalContributions = Object.values(sectionData).reduce((sum, section) => sum + section.number, 0);

  // Timeline de seguimiento - adaptado por idioma
  const timelineData = language === 'pt' ? [
    { date: '15 Jan 2024', status: 'Registo', completed: true },
    { date: '16 Jan 2024', status: 'Recebido', completed: true },
    { date: '18 Jan 2024', status: 'Verificado', completed: true },
    { date: '20 Jan 2024', status: 'Certificação Blockchain', completed: false }
  ] : language === 'es' ? [
    { date: '15 Jan 2024', status: 'Registrado', completed: true },
    { date: '16 Jan 2024', status: 'Recibido', completed: true },
    { date: '18 Jan 2024', status: 'Verificado', completed: true },
    { date: '20 Jan 2024', status: 'Certificado Blockchain', completed: false }
  ] : [
    { date: '15 Jan 2024', status: 'Registered', completed: true },
    { date: '16 Jan 2024', status: 'Received', completed: true },
    { date: '18 Jan 2024', status: 'Verified', completed: true },
    { date: '20 Jan 2024', status: 'Blockchain Certified', completed: false }
  ];

  // Traducciones completas
  const translations = {
    pt: {
      contributions: "Contribuições",
      sales: "Vendas",
      purchases: "Compras",
      collectibles: "Colecionáveis",
      footprint: "Pegada",
      environmental: "ambiental",
      recent: "Atividade Recente",
      journey: "Acompanha o teu percurso de contribuições →",
      download: "Descarregar PDF",
      viewOnline: "Ver Online",
      shareProfile: "Partilha o teu perfil INFINITO.me",
      anyoneLink: "Qualquer pessoa pode aceder a este link para ver o teu perfil na web",
      share: "Partilhar",
      main: "Passaporte de impacto",
      loading: "A carregar passaporte ambiental...",
      optimal: "Ótimo",
      repair: "Reparar",
      recycle: "Reciclar",
      impact: "Impacto Mensal",
      approvePurchase: "Confirmar receção",
      sale: "Venda realizada",
      purchase: "Compra efetuada",
      contribution: "Contribuição de roupa",
      delivery: "Entrega",
      verification: "Verificação",
      distribution: "Distribuição",
      certificate: "Certificado",
      date: "Data",
      hash: "Hash Blockchain",
      co2: "CO₂",
      water: "Água",
      resources: "Recursos",
      passport: "Passaporte Ambiental",
      back: "Voltar",
      enterCode: "Por favor, ingresa un código de contribución",
      noContribution: "No se encontró ninguna contribución con este código.",
      notToday: "Esta contribución no es de hoy. Solo se muestran contribuciones del día actual.",
      searchError: "Error al buscar la contribución",
      tryWith: "Probar con tu contribución:"
    },
    en: {
      contributions: "Contributions",
      sales: "Sales",
      purchases: "Purchases",
      collectibles: "Collectibles",
      footprint: "Footprint",
      environmental: "environmental",
      recent: "Recent Activity",
      journey: "Track your contributions journey →",
      download: "Download PDF",
      viewOnline: "View Online",
      shareProfile: "Share your INFINITO.me profile",
      anyoneLink: "Anyone can access this link to view your profile online",
      share: "Share",
      main: "Environmental Passport",
      loading: "Loading environmental passport...",
      optimal: "Optimal",
      repair: "Repair",
      recycle: "Recycle",
      impact: "Monthly Impact",
      approvePurchase: "Confirm receipt",
      sale: "Sale completed",
      purchase: "Purchase completed",
      contribution: "Clothing contribution",
      delivery: "Delivery",
      verification: "Verification",
      distribution: "Distribution",
      certificate: "Certificate",
      date: "Date",
      hash: "Hash Blockchain",
      co2: "CO₂",
      water: "Water",
      resources: "Resources",
      passport: "Environmental Passport",
      back: "Back",
      enterCode: "Please enter a contribution code",
      noContribution: "No contribution found with this code.",
      notToday: "This contribution is not from today. Only today's contributions are shown.",
      searchError: "Error searching for contribution",
      tryWith: "Try with your contribution:"
    },
    es: {
      contributions: "Contribuciones",
      sales: "Ventas",
      purchases: "Compras",
      collectibles: "Coleccionables",
      footprint: "Huella",
      environmental: "ambiental",
      recent: "Actividad Reciente",
      journey: "Sigue el recorrido de tus contribuciones →",
      download: "Descargar PDF",
      viewOnline: "Ver Online",
      shareProfile: "Comparte tu perfil INFINITO.me",
      anyoneLink: "Cualquier persona puede acceder a este enlace para ver tu perfil en la web",
      share: "Compartir",
      main: "Pasaporte de impacto",
      loading: "Cargando pasaporte ambiental...",
      optimal: "Óptimo",
      repair: "Reparar",
      recycle: "Reciclar",
      impact: "Impacto Mensal",
      approvePurchase: "Confirmar recepción",
      sale: "Venta realizada",
      purchase: "Compra realizada",
      contribution: "Contribución de ropa",
      delivery: "Entrega",
      verification: "Verificación",
      distribution: "Distribución",
      certificate: "Certificado",
      date: "Fecha",
      hash: "Hash Blockchain",
      co2: "CO₂",
      water: "Agua",
      resources: "Recursos",
      passport: "Pasaporte Ambiental",
      back: "Volver",
      enterCode: "Por favor, ingresa un código de contribución",
      noContribution: "No se encontró ninguna contribución con este código.",
      notToday: "Esta contribución no es de hoy. Solo se muestran contribuciones del día actual.",
      searchError: "Error al buscar la contribución",
      tryWith: "Probar con tu contribución:"
    }
  }

  // Usar el idioma seleccionado en el splash
  const t = translations[language as keyof typeof translations] || translations.en;

  // Load user data
  useEffect(() => {
    async function loadUserData() {
      try {
        setIsLoading(true)
        
        // Check if user is authenticated first
        const sessionResponse = await fetch('/api/auth/session', {
          credentials: 'include'
        });
        const session = await sessionResponse.json();
        
        if (!session || !session.user) {
          // User not authenticated - provide fallback data for development
          if (process.env.NODE_ENV === 'development') {
            console.warn('User not authenticated, using fallback data for development');
            setUserStats({
              contributions: 5,
              sales: 2,
              purchases: 3,
              collectibles: 1,
              totalImpact: { 
                co2Saved: 25.5, 
                waterSaved: 150.2, 
                resourcesConserved: 85 
              },
              monthlyData: [],
              recentTransactions: [
                {
                  id: 'CONTRIB-001',
                  type: 'contribution',
                  item: 'Camiseta de algodão',
                  date: '2024-01-15',
                  impact: { co2: 5.2, water: 25.1 },
                  location: 'Ponto de coleta',
                  approved: true,
                },
                {
                  id: 'CONTRIB-002',
                  type: 'contribution',
                  item: 'Calças jeans',
                  date: '2024-01-10',
                  impact: { co2: 8.5, water: 45.3 },
                  location: 'Recolha domiciliar',
                  approved: true,
                },
              ],
            });
            setError('Dados de teste - Configure Google OAuth para autenticação real');
            return;
          } else {
            // Production: redirect to login
            setError('Precisa fazer login para ver o passaporte ambiental');
            return;
          }
        }

        // User is authenticated, try to load real data
        const contribs = await fetcher('/api/contributions/me');
        if (!Array.isArray(contribs)) {
          throw new Error('Formato de dados inválido');
        }
        
        if (contribs.length === 0) {
          setError('Nenhuma contribuição encontrada');
          setUserStats({
            contributions: 0,
            sales: 0,
            purchases: 0,
            collectibles: 0,
            totalImpact: { co2Saved: 0, waterSaved: 0, resourcesConserved: 0 },
            monthlyData: [],
            recentTransactions: [],
          });
          return;
        }

        // Process real contributions data
        let co2Saved = 0, waterSaved = 0, resourcesConserved = 0, contributions = 0;
        let recentTransactions: any[] = [];
        
        contributions = contribs.length;
        recentTransactions = contribs.slice(-3).map((c: any, i: number) => ({
          id: c.tracking || String(i),
          type: 'contribution',
          item: c.detalles || c.tipo || 'Contribuição',
          date: c.fecha || '',
          impact: {
            co2: c.co2Saved || 0,
            water: c.waterSaved || 0,
          },
          location: c.metodo || '',
          approved: c.estado === 'Verificado' || c.estado === 'Certificado',
        }));
        
        co2Saved = contribs.reduce((sum: number, c: any) => sum + (c.co2Saved || 0), 0);
        waterSaved = contribs.reduce((sum: number, c: any) => sum + (c.waterSaved || 0), 0);
        resourcesConserved = Math.round(contribs.reduce((sum: number, c: any) => sum + (c.naturalResources || 0), 0) / (contribs.length || 1));

        setUserStats({
          contributions,
          sales: 0,
          purchases: 0,
          collectibles: 0,
          totalImpact: { co2Saved, waterSaved, resourcesConserved },
          monthlyData: [],
          recentTransactions,
        });
        setError(null);
        
      } catch (e: any) {
        console.error('Error loading user data:', e);
        
        if (e.message?.includes('401') || e.message?.includes('Unauthorized')) {
          // Authentication error
          if (process.env.NODE_ENV === 'development') {
            setError('Erro de autenticação - usando dados de teste para desenvolvimento');
            // Provide fallback data for development
            setUserStats({
              contributions: 3,
              sales: 1,
              purchases: 2,
              collectibles: 0,
              totalImpact: { co2Saved: 15.2, waterSaved: 89.5, resourcesConserved: 72 },
              monthlyData: [],
              recentTransactions: [
                {
                  id: 'TEST-001',
                  type: 'contribution',
                  item: 'Teste - Roupa reciclada',
                  date: '2024-01-01',
                  impact: { co2: 5.0, water: 20.0 },
                  location: 'Teste',
                  approved: true,
                },
              ],
            });
          } else {
            setError('Sessão expirada. Faça login novamente.');
          }
        } else {
          setError(e.message || 'Erro ao carregar dados do utilizador');
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUserData();
  }, []);

  // Animación de conteo para los valores de impacto
  useEffect(() => {
    if (userStats) {
      let co2Start = 0, waterStart = 0, resourcesStart = 0;
      const co2Target = userStats.totalImpact.co2Saved;
      const waterTarget = userStats.totalImpact.waterSaved;
      const resourcesTarget = userStats.totalImpact.resourcesConserved;
      const duration = 1200; // ms
      const steps = 40;
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setCo2Display(Math.round(co2Start + (co2Target - co2Start) * (step / steps)));
        setWaterDisplay(Math.round(waterStart + (waterTarget - waterStart) * (step / steps)));
        setResourcesDisplay(Math.round(resourcesStart + (resourcesTarget - resourcesStart) * (step / steps)));
        if (step >= steps) {
          setCo2Display(Math.round(co2Target));
          setWaterDisplay(Math.round(waterTarget));
          setResourcesDisplay(Math.round(resourcesTarget));
          clearInterval(interval);
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }
  }, [userStats]);

  // Función para compartir perfil
  const shareProfile = async () => {
    const shareData = {
              title: "My INFINITO Environmental Passport",
      text: `I have already avoided ${userStats?.totalImpact.co2Saved}kg of CO₂ and preserved ${userStats?.totalImpact.waterSaved.toLocaleString()}L of water through the circular economy!`,
      url: "https://infinito.me/user/maria-silva",
    }
    if (navigator.share) {
      try {
        setIsSharing(true)
        await navigator.share(shareData)
      } catch (e) {
        // Opcional: puedes mostrar un toast o mensaje si quieres
      } finally {
        setIsSharing(false)
      }
    } else {
      navigator.clipboard.writeText(shareData.url)
      alert("Link copiado para a área de transferência!")
    }
  }

  // Función para descargar el certificado en PDF con el diseño exacto mostrado
  const downloadCertificate = () => {
    const currentDate = "12 de abril de 2024";
    const trackingCode = trackingNumber || "CON-2024-SANCHO";
    
    // Datos específicos de Sancho
    const totalPieces = 10;
    const recyclePercent = 40; // 4 piezas para reciclar
    const repairPercent = 40; // 4 piezas para reparar
    const reusePercent = 20; // 2 piezas para reutilizar
    const co2Saved = 18.5; // Proporcionalmente menor por 10 piezas
    const waterSaved = 24.3; // Proporcionalmente menor por 10 piezas
    const resourcesConserved = 68; // Proporcionalmente menor
    
    // Materiales específicos de Sancho
    const materials = [
      { name: "Algodão", percent: 45 },
      { name: "Viscosa", percent: 35 },
      { name: "Lynon", percent: 20 }
    ];
    
    // QR Data
    const qrData = JSON.stringify({
      trackingNumber: trackingCode,
      date: currentDate,
      co2Saved: co2Saved,
      waterSaved: waterSaved,
      resourcesConserved: resourcesConserved,
      blockchain: "Certified",
      infinito: "https://infinito.me/verify/" + trackingCode
    });
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}&format=png&margin=10`;
    
    // HTML template que replica exactamente el diseño mostrado
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #EDE4DA;
            background-image: url('/fondo.png');
            background-size: cover;
            background-repeat: no-repeat;
            padding: 20px;
            line-height: 1.3;
          }
          .certificate {
            max-width: 750px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            position: relative;
          }
          .logo {
            text-align: center;
            margin-bottom: 20px;
          }
          .logo img {
            height: 60px;
            width: auto;
          }
          
          .header {
            text-align: left;
            margin-bottom: 18px;
            font-size: 15px;
            line-height: 1.4;
          }
          .header strong {
            font-weight: bold;
          }
          .header .heart {
            color: #D42D66;
            font-size: 16px;
          }
          
          .content {
            display: flex;
            gap: 30px;
            margin-bottom: 20px;
          }
          
          .left-side {
            flex: 1;
          }
          
          .right-side {
            flex: 0 0 200px;
            text-align: center;
          }
          
          .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
          }
          
          .impact-data {
            margin-bottom: 15px;
          }
          
          .impact-item {
            margin-bottom: 5px;
            font-size: 14px;
          }
          
          .materials {
            margin-bottom: 15px;
          }
          
          .materials ul {
            list-style: none;
            padding: 0;
          }
          
          .materials li {
            margin-bottom: 3px;
            font-size: 14px;
          }
          
          .robot-container {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          .robot {
            width: 140px;
            height: 140px;
            margin-bottom: 8px;
            object-fit: contain;
          }
          
          .tracking-number {
            font-size: 12px;
            color: #666;
            margin-top: 8px;
          }
          

          
          .environmental-footprint {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-radius: 12px;
            padding: 12px;
            margin-bottom: 12px;
            border: 2px solid #43B2D2;
          }
          
          .footprint-header {
            text-align: center;
            background: #43B2D2;
            color: white;
            padding: 5px 12px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 12px;
            display: inline-block;
          }
          
          .footprint-content {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .fingerprint {
            width: 70px;
            height: 70px;
            flex-shrink: 0;
          }
          
          .fingerprint img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          
          .metrics {
            display: flex;
            gap: 15px;
            flex: 1;
          }
          
          .metric {
            text-align: center;
            flex: 1;
          }
          
          .metric-icon {
            font-size: 18px;
            margin-bottom: 4px;
          }
          
          .metric-value {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-bottom: 2px;
          }
          
          .metric-label {
            font-size: 9px;
            color: #666;
            line-height: 1.2;
          }
          
          .equivalence {
            margin-bottom: 15px;
          }
          
          .equivalence-title {
            font-size: 14px;
            font-weight: bold;
            color: #D42D66;
            margin-bottom: 8px;
          }
          
          .equivalence-item {
            margin-bottom: 3px;
            font-size: 13px;
            line-height: 1.3;
          }
          
          .thanks {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 15px;
            border: 2px solid #F59E0B;
            display: flex;
            align-items: center;
            gap: 20px;
          }
          
          .thanks-content {
            flex: 1;
          }
          
          .thanks-title {
            font-size: 14px;
            font-weight: bold;
            color: #92400e;
            margin-bottom: 8px;
          }
          
          .thanks-text {
            font-size: 13px;
            color: #92400e;
            line-height: 1.4;
          }
          
          .thanks-qr {
            flex-shrink: 0;
            text-align: center;
          }
          
          .thanks-qr img {
            width: 60px;
            height: 60px;
            border: 1px solid #D97706;
            border-radius: 6px;
          }
          
          .thanks-qr-label {
            font-size: 9px;
            color: #92400e;
            margin-top: 3px;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="logo">
            <img src="/LOGO2.png" alt="INFINITO" />
          </div>
          
          <div class="header">
            <strong>Sancho <span class="heart">❤️</span></strong><br>
            Thanks to your contribution of <strong>${totalPieces} pieces on ${currentDate}</strong>, you prevented valuable materials from going to waste. Instead, you contributed to giving them a new life, promoting textile circularity and the planet thanks you.
          </div>
          
          <div class="content">
            <div class="left-side">
              <div class="impact-data">
                <div class="section-title">Impact Data</div>
                <div class="impact-item">👕 <strong>Total Pieces:</strong> ${totalPieces}</div>
                <div class="impact-item">- ♻️ ${recyclePercent}% for recycling</div>
                <div class="impact-item">- 🔧 ${repairPercent}% for repair</div>
                <div class="impact-item">- 🔄 ${reusePercent}% for reuse</div>
              </div>
              
              <div class="materials">
                <div class="section-title">Materials</div>
                <ul>
                  ${materials.map(m => `<li>• ${m.name}: ${m.percent}%</li>`).join('')}
                </ul>
              </div>
            </div>
            
            <div class="right-side">
              <div class="robot-container">
                <img src="/NFT/2.png" alt="INFINITO NFT" class="robot">
                <div class="tracking-number">${trackingCode}</div>
              </div>
            </div>
          </div>
          

          
          <div class="environmental-footprint">
            <div style="text-align: center;">
              <span class="footprint-header">Your Environmental Footprint</span>
            </div>
            <div class="footprint-content">
              <div class="fingerprint">
                <img src="/Huella.png" alt="Environmental Footprint" />
              </div>
              <div class="metrics">
                <div class="metric">
                  <div class="metric-icon">☁️</div>
                  <div class="metric-value">${co2Saved} kg</div>
                  <div class="metric-label">CO₂eq emissions avoided</div>
                </div>
                <div class="metric">
                  <div class="metric-icon">💧</div>
                  <div class="metric-value">${waterSaved} L</div>
                  <div class="metric-label">Water protected</div>
                </div>
                <div class="metric">
                  <div class="metric-icon">🌿</div>
                  <div class="metric-value">${resourcesConserved}%</div>
                  <div class="metric-label">Natural resources avoided</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="equivalence">
            <div class="equivalence-title">📍 This is equivalent to:</div>
            <div class="equivalence-item">Avoiding CO₂ emissions from a car driving for ${Math.round(co2Saved * 3.1)} km</div>
            <div class="equivalence-item">Saving enough water for ${Math.round(waterSaved * 0.76)} quick showers</div>
            <div class="equivalence-item">Protecting agricultural soil equivalent to ${Math.round(resourcesConserved * 0.65)} days of domestic production</div>
          </div>
          
          <div class="thanks">
            <div class="thanks-content">
              <div class="thanks-title">🙏 Thank you for your contribution!</div>
              <div class="thanks-text">
                We are creating an application so you can see and inspire more people with your impact.<br>
                Meanwhile, follow us and share this movement with those around you.
              </div>
            </div>
            <div class="thanks-qr">
              <img src="${qrUrl}" alt="QR Code" />
              <div class="thanks-qr-label">${trackingCode}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Crear elemento temporal para convertir a PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Esperar a que cargue y luego imprimir
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
    }
  };

  // Función para buscar contribuciones reales
  const searchContribution = async (trackingCode: string) => {
    setIsSearching(true);
    setSearchError(null);
    setContributionData(null);
    
    try {
      console.log("Buscando contribución:", trackingCode);
      
      const response = await fetch(`/api/contributions?tracking=${trackingCode}`);
      console.log("Respuesta de búsqueda:", response.status);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Could not search for contribution`);
      }
      
      const data = await response.json();
      console.log("Datos de respuesta completos:", JSON.stringify(data, null, 2));
      
      // La API devuelve { data: [...] } o directamente [...]
      const contributions = data.data || data;
      console.log("Contribuciones encontradas:", contributions);
      
      if (contributions && contributions.length > 0) {
        const contribution = contributions[0];
        console.log("Contribución seleccionada:", contribution);
        
        // Verificar si la contribución es de hoy
        const today = new Date().toISOString().split('T')[0];
        const contributionDate = new Date(contribution.createdAt).toISOString().split('T')[0];
        console.log("Fecha de contribución:", contributionDate, "Hoy:", today);
        
        if (contributionDate === today) {
          setContributionData(contribution);
          setShowTrackingResults(true);
          
          // Determinar el progreso basado en el estado
          if (contribution.estado === 'pendiente' || contribution.trackingState === 'registered') {
            setProgressStep(0); // Solo registrado
          } else if (contribution.estado === 'recibido' || contribution.trackingState === 'received') {
            setProgressStep(1); // Recibido
          } else if (contribution.estado === 'verificado' || contribution.trackingState === 'verified') {
            setProgressStep(2); // Verificado
          } else if (contribution.estado === 'certificado' || contribution.trackingState === 'certified') {
            setProgressStep(3); // Certificado
          } else {
            setProgressStep(0);
          }
        } else {
                            setSearchError(t.notToday);
        }
      } else {
                          setSearchError(t.noContribution);
      }
    } catch (error) {
      console.error("Error buscando contribución:", error);
                      setSearchError(error instanceof Error ? error.message : t.searchError);
    } finally {
      setIsSearching(false);
    }
  };

  // Función para cargar contribuciones de hoy
  const loadTodayContributions = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/contributions?date=${today}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Contribuciones de hoy:", data);
        return data;
      }
    } catch (error) {
      console.error("Error cargando contribuciones de hoy:", error);
    }
    return [];
  };

  // Loading state
  if (isLoading) {
    return (
      <div 
        className="min-h-screen font-raleway p-6 pb-24"
        style={{
          backgroundColor: "#EDE4DA",
          backgroundImage: "url('/fondo.png'), radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px)",
          backgroundSize: "cover, 20px 20px, 25px 25px",
          backgroundRepeat: "no-repeat, repeat, repeat"
        }}
      >
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105"
              style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 tracking-wider">
              {t.loading}
            </h1>
            <div className="w-5 h-5" />
          </div>
          
          <div className="bg-white/25 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/30">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#689610" }}></div>
              <span className="ml-3 text-gray-700 font-medium">{t.loading}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !userStats) {
    return (
      <div 
        className="min-h-screen font-raleway p-6 pb-24"
        style={{
          backgroundColor: "#EDE4DA",
          backgroundImage: "url('/fondo.png'), radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px)",
          backgroundSize: "cover, 20px 20px, 25px 25px",
          backgroundRepeat: "no-repeat, repeat, repeat"
        }}
      >
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105"
              style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 tracking-wider">
              {t.passport}
            </h1>
            <div className="w-5 h-5" />
          </div>
          
          <div className="bg-white/25 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5" style={{ color: "#D42D66" }} />
              <span className="font-medium text-gray-800">Erro</span>
            </div>
            <p className="text-sm text-gray-700 font-light">{error}</p>

          </div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <>
      <style jsx>{`
        @keyframes glow-passport {
          0%, 100% { box-shadow: 0 0 30px rgba(104,150,16,0.3); }
          50% { box-shadow: 0 0 50px rgba(104,150,16,0.6); }
        }
        
        @keyframes float-stats {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes pulse-metric {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
      
      <div 
        className="min-h-screen w-full flex flex-col items-center font-raleway px-2 py-4 pb-24"
        style={{
          backgroundColor: "#EDE4DA",
          backgroundImage: "url('/fondo.png'), radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px)",
          backgroundSize: "cover, 20px 20px, 25px 25px",
          backgroundRepeat: "no-repeat, repeat, repeat"
        }}
      >
        {/* Header futurista con glassmorphism */}
        <div 
          className="w-full max-w-md md:max-w-4xl lg:max-w-6xl bg-white/20 backdrop-blur-md border-b border-white/30 px-6 py-4 mb-6 rounded-2xl sticky top-4 z-10"
          style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))" }}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105"
              style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            </button>
            <h1 className="font-bold text-lg md:text-xl text-gray-800 tracking-wider">
              {t.passport}
            </h1>
            <div className="w-10 md:w-12"></div>
          </div>
        </div>
        


        {/* Logo INFINITO.me */}
        <div className="w-full flex justify-center mb-6">
          <Image 
            src="/LOGO2.png" 
            alt="Logo INFINITO" 
            width={300}
            height={120}
            className="h-20 md:h-28 object-contain" 
            loading="lazy"
            style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
          />
        </div>

        {/* Layout responsivo */}
        <div className="w-full max-w-md md:max-w-4xl lg:max-w-6xl md:flex md:gap-8 md:items-start">
          {/* Círculo interactivo - izquierda en desktop */}
          <div className="md:w-1/2 md:sticky md:top-32 flex flex-col items-center mb-6 md:mb-0">
            {/* Círculo SVG Interactivo */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6">
              <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 256 256" 
                className="transform -rotate-90"
                style={{ 
                  filter: "drop-shadow(0 8px 16px rgba(104,150,16,0.3))"
                }}
              >
                {/* Segmento Verde - Contribuições */}
                <path
                  d="M 20 128 A 108 108 0 0 1 128 20 L 128 128 Z"
                  fill={hoveredSection === 'contribuicoes' ? '#7BA428' : '#689610'}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredSection('contribuicoes')}
                  onMouseLeave={() => setHoveredSection(null)}
                  onClick={() => setSelectedSection('contribuicoes')}
                />
                
                {/* Segmento Azul - Compras */}
                <path
                  d="M 128 20 A 108 108 0 0 1 236 128 L 128 128 Z"
                  fill={hoveredSection === 'compras' ? '#5BA0FF' : '#3E88FF'}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredSection('compras')}
                  onMouseLeave={() => setHoveredSection(null)}
                  onClick={() => setSelectedSection('compras')}
                />
                
                {/* Segmento Naranja - Vendas */}
                <path
                  d="M 236 128 A 108 108 0 0 1 128 236 L 128 128 Z"
                  fill={hoveredSection === 'vendas' ? '#FF8F33' : '#F47802'}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredSection('vendas')}
                  onMouseLeave={() => setHoveredSection(null)}
                  onClick={() => setSelectedSection('vendas')}
                />
                
                {/* Segmento Rosa - Donações */}
                <path
                  d="M 128 236 A 108 108 0 0 1 20 128 L 128 128 Z"
                  fill={hoveredSection === 'doacoes' ? '#E84A7A' : '#D42D66'}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredSection('doacoes')}
                  onMouseLeave={() => setHoveredSection(null)}
                  onClick={() => setSelectedSection('doacoes')}
                />
                
                {/* Círculo interno */}
                <circle cx="128" cy="128" r="60" fill="#EDE4DA" />
                
                {/* Texto central dinámico */}
                {hoveredSection && (
                  <text 
                    x="128" 
                    y="135" 
                    textAnchor="middle" 
                    className="font-bold text-2xl fill-gray-800 transform rotate-90"
                    style={{ transformOrigin: '128px 128px' }}
                  >
                    {sectionData[hoveredSection].number}
                  </text>
                )}
              </svg>
              
              {/* Labels que aparecen en hover */}
              {hoveredSection === 'contribuicoes' && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 transition-all duration-300">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-white/40">
                    <span className="text-sm font-bold text-gray-800 tracking-wider">
                      {sectionData.contribuicoes.label}
                    </span>
                  </div>
                </div>
              )}
              
              {hoveredSection === 'compras' && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 transition-all duration-300">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-white/40">
                    <span className="text-sm font-bold text-gray-800 tracking-wider">
                      {sectionData.compras.label}
                    </span>
                  </div>
                </div>
              )}
              
              {hoveredSection === 'vendas' && (
                <div className="absolute bottom-0 right-0 transform translate-x-2 translate-y-2 transition-all duration-300">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-white/40">
                    <span className="text-sm font-bold text-gray-800 tracking-wider">
                      {sectionData.vendas.label}
                    </span>
                  </div>
                </div>
              )}
              
              {hoveredSection === 'doacoes' && (
                <div className="absolute bottom-0 left-0 transform -translate-x-2 translate-y-2 transition-all duration-300">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-white/40">
                    <span className="text-sm font-bold text-gray-800 tracking-wider">
                      {sectionData.doacoes.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Información de la sección seleccionada */}
            {selectedSection && sectionData[selectedSection] && (
              <div 
                className="bg-white/25 backdrop-blur-md rounded-2xl p-4 border border-white/30 mb-4"
                style={{ 
                  filter: `drop-shadow(0 6px 12px ${sectionData[selectedSection].color}30)`,
                  animation: "float-stats 3s ease-in-out infinite"
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: sectionData[selectedSection].color }}
                  >
                    {(() => {
                      const IconComponent = sectionData[selectedSection].icon;
                      return <IconComponent className="w-5 h-5 text-white" />;
                    })()}
                  </div>
                  <span className="font-bold text-gray-800 tracking-wider">
                    {sectionData[selectedSection].label}
                  </span>
                </div>
                
                <div className="text-center">
                  <div 
                    className="text-2xl font-bold mb-1"
                    style={{ color: sectionData[selectedSection].color }}
                  >
                    {sectionData[selectedSection].number}
                  </div>
                  <div className="text-xs text-gray-600 font-light">
                    {sectionData[selectedSection].date}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contenido principal - derecha en desktop */}
          <div className="md:w-1/2 space-y-6">
            {/* Métricas de impacto ambiental - PRIMERO */}
            <div 
              className="w-full bg-white/25 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center gap-4 mb-6 border border-white/30"
              style={{ filter: "drop-shadow(0 8px 16px rgba(104,150,16,0.2))" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Leaf className="w-6 h-6" style={{ color: "#689610" }} />
                <span className="font-bold text-gray-800 tracking-wider">{t.footprint} {t.environmental}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 mx-auto" style={{ backgroundColor: "#689610" }}>
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg md:text-xl font-bold text-gray-800 tracking-wider">{co2Display} Kg</span>
                  <p className="text-xs text-gray-600 font-medium">{t.co2} Saved</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 mx-auto" style={{ backgroundColor: "#43B2D2" }}>
                    <Droplets className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg md:text-xl font-bold text-gray-800 tracking-wider">{waterDisplay} LT</span>
                  <p className="text-xs text-gray-600 font-medium">{t.water} Saved</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 mx-auto" style={{ backgroundColor: "#F47802" }}>
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg md:text-xl font-bold text-gray-800 tracking-wider">{resourcesDisplay}%</span>
                  <p className="text-xs text-gray-600 font-medium">{t.resources}</p>
                </div>
              </div>
            </div>

            {/* Tarjetas de resumen futuristas */}
            <div className="flex w-full justify-between gap-3 mb-6">
              <div 
                className="flex-1 bg-white/25 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center border border-white/30 relative overflow-hidden"
                style={{ 
                  filter: "drop-shadow(0 6px 12px rgba(104,150,16,0.2))",
                  animation: "float-stats 3s ease-in-out infinite"
                }}
              >
                <div className="absolute inset-0 opacity-20" style={{ backgroundColor: "#689610" }}></div>
                <span className="font-semibold text-gray-800 text-xs md:text-sm relative z-10 tracking-wider">{t.contributions}</span>
                <span className="text-xl md:text-2xl font-bold relative z-10" style={{ color: "#689610" }}>
                  {userStats?.contributions ?? 0}
                </span>
              </div>
              <div 
                className="flex-1 bg-white/25 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center border border-white/30 relative overflow-hidden"
                style={{ 
                  filter: "drop-shadow(0 6px 12px rgba(62,136,255,0.2))",
                  animation: "float-stats 3s ease-in-out infinite 0.3s"
                }}
              >
                <div className="absolute inset-0 opacity-20" style={{ backgroundColor: "#3E88FF" }}></div>
                <span className="font-semibold text-gray-800 text-xs md:text-sm relative z-10 tracking-wider">{t.purchases}</span>
                  <span className="text-xl md:text-2xl font-bold relative z-10" style={{ color: "#3E88FF" }}>
                    {userStats?.purchases ?? 0}
                  </span>
              </div>
              <div 
                className="flex-1 bg-white/25 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center border border-white/30 relative overflow-hidden"
                style={{ 
                  filter: "drop-shadow(0 6px 12px rgba(244,120,2,0.2))",
                  animation: "float-stats 3s ease-in-out infinite 0.6s"
                }}
              >
                <div className="absolute inset-0 opacity-20" style={{ backgroundColor: "#F47802" }}></div>
                <span className="font-semibold text-gray-800 text-xs md:text-sm relative z-10 tracking-wider">{t.sales}</span>
                  <span className="text-xl md:text-2xl font-bold relative z-10" style={{ color: "#F47802" }}>
                    {userStats?.sales ?? 0}
                  </span>
              </div>
              <div 
                className="flex-1 bg-white/25 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center border border-white/30 relative overflow-hidden"
                style={{ 
                  filter: "drop-shadow(0 6px 12px rgba(212,45,102,0.2))",
                  animation: "float-stats 3s ease-in-out infinite 0.9s"
                }}
              >
                <div className="absolute inset-0 opacity-20" style={{ backgroundColor: "#D42D66" }}></div>
                <span className="font-semibold text-gray-800 text-xs md:text-sm relative z-10 tracking-wider">{t.collectibles}</span>
                  <span className="text-xl md:text-2xl font-bold relative z-10" style={{ color: "#D42D66" }}>
                    {userStats?.collectibles ?? 0}
                  </span>
              </div>
            </div>

            {/* Campo de búsqueda por tracking */}
            <div 
              className="w-full bg-white/25 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/30"
              style={{ filter: "drop-shadow(0 6px 12px rgba(62,136,255,0.2))" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-5 h-5" style={{ color: "#3E88FF" }} />
                <span className="font-bold text-gray-800 tracking-wider">{t.journey}</span>
              </div>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Ex: INF_1753475802913_3ewhghxth"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-gray-800 font-medium tracking-wider placeholder-gray-500 focus:outline-none focus:border-white/60 transition-all duration-300"
                />
                <button 
                  onClick={() => {
                    if (trackingNumber.trim()) {
                      searchContribution(trackingNumber.trim());
                    } else {
                      setSearchError(t.enterCode);
                    }
                  }}
                  disabled={isSearching}
                  className="px-6 py-3 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: "#3E88FF",
                    filter: "drop-shadow(0 4px 8px rgba(62,136,255,0.3))"
                  }}
                >
                  {isSearching ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Searching...
                    </div>
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
              
              {/* Mensaje de error */}
              {searchError && (
                <div className="mt-3 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                  {searchError}
                </div>
              )}
              
              {/* Botón de ejemplo para probar */}
              <div className="text-center mt-3">
                <button 
                  onClick={() => {
                    setTrackingNumber("INF_1753475802913_3ewhghxth");
                    searchContribution("INF_1753475802913_3ewhghxth");
                  }}
                  className="text-xs text-gray-600 hover:text-gray-800 underline font-light"
                >
                  {t.tryWith} INF_1753475802913_3ewhghxth
                </button>
              </div>
            </div>

            {/* Timeline de seguimiento */}
            {showTrackingResults && contributionData && (
              <div 
                className="w-full bg-white/25 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/30"
                style={{ filter: "drop-shadow(0 6px 12px rgba(104,150,16,0.2))" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Package className="w-5 h-5" style={{ color: "#689610" }} />
                  <span className="font-bold text-gray-800 tracking-wider">Tracking #{contributionData.tracking}</span>
                </div>
                
                {/* Información de la contribución */}
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/30">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Type:</span>
                      <p className="text-gray-800 capitalize">{contributionData.tipo}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Items:</span>
                      <p className="text-gray-800">
                        {contributionData.estado === 'pendiente' ? 'Pending verification' : contributionData.totalItems}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Status:</span>
                      <p className="text-gray-800 capitalize">{contributionData.estado}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Date:</span>
                      <p className="text-gray-800">{new Date(contributionData.fecha || contributionData.createdAt).toLocaleDateString('pt-PT')}</p>
                    </div>
                  </div>
                  {contributionData.detalles && (
                    <div className="mt-3">
                      <span className="font-semibold text-gray-700">Details:</span>
                      <p className="text-gray-800 text-sm">{contributionData.detalles}</p>
                    </div>
                  )}
                </div>

                {/* Barra de progreso interactiva */}
                <div className="mb-6">
                  <div className="relative">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
                      <div 
                        className="absolute top-0 left-0 h-2 rounded-full transition-all duration-500" 
                        style={{
                          width: `${(progressStep / (timelineData.length - 1)) * 100}%`,
                          backgroundColor: "#689610"
                        }}
                      ></div>
                      
                      {/* Puntos de progreso */}
                      {timelineData.map((item, index) => (
                        <div 
                          key={index}
                          className={`absolute -top-1 w-4 h-4 rounded-full transition-all duration-300 cursor-pointer border-2 border-white ${
                            index <= progressStep ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-300'
                          }`}
                          style={{left: `${(index / (timelineData.length - 1)) * 100}%`}}
                          onClick={() => setProgressStep(index)}
                          title={`${item.status} - ${item.date}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Timeline labels */}
                  <div className="flex justify-between mt-4 text-xs">
                    {timelineData.map((item, index) => (
                      <div key={index} className="text-center" style={{width: `${100 / timelineData.length}%`}}>
                        <div className={`font-bold mb-1 ${index <= progressStep ? 'text-green-600' : 'text-gray-500'}`}>
                          {item.status}
                        </div>
                        <div className="text-gray-600 font-light">{item.date}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estado atual detalhado */}
                <div 
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                  style={{ animation: "float-stats 3s ease-in-out infinite" }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#689610" }}
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 tracking-wider">
                        {timelineData[progressStep]?.status}
                      </div>
                      <div className="text-xs text-gray-600 font-light">
                        {timelineData[progressStep]?.date}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700 font-light leading-relaxed">
                                                                {progressStep === 0 && (language === 'pt' ? "Sua contribuição foi registrada no sistema INFINITO." : language === 'es' ? "Tu contribución ha sido registrada en el sistema INFINITO." : "Your contribution has been registered in the INFINITO system.")}
                      {progressStep === 1 && (language === 'pt' ? "Sua contribuição foi recebida em nosso centro de triagem." : language === 'es' ? "Tu contribución ha sido recibida en nuestro centro de clasificación." : "Your contribution has been received at our sorting center.")}
                      {progressStep === 2 && (language === 'pt' ? "Sua contribuição foi verificada e aprovada pelos nossos especialistas." : language === 'es' ? "Tu contribución ha sido verificada y aprobada por nuestros expertos." : "Your contribution has been verified and approved by our experts.")}
                      {progressStep === 3 && (language === 'pt' ? "Certificado blockchain em processamento. Receberá notificação em breve." : language === 'es' ? "Certificado blockchain en procesamiento. Recibirás notificación pronto." : "Blockchain certificate in processing. You will receive notification soon.")}
                  </div>
                </div>
              </div>
            )}

            {/* QR dinámico com informações completas - Solo aparece cuando está en "Certificação Blockchain" */}
            {showTrackingResults && progressStep === 3 && (
              <div 
                className="w-full bg-white/25 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center gap-4 mb-6 border border-white/30"
                style={{ filter: "drop-shadow(0 6px 12px rgba(67,178,210,0.2))" }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5" style={{ color: "#43B2D2" }} />
                  <span className="font-bold text-gray-800 tracking-wider">{t.certificate}</span>
                </div>
                
                <div className="bg-white/90 p-4 rounded-xl">
                  <QRCodeCanvas
                    value={JSON.stringify({
                      trackingNumber: trackingNumber || "CON-2024-001",
                      currentStatus: timelineData[progressStep]?.status,
                      date: timelineData[progressStep]?.date,
                      co2Saved: co2Display,
                      waterSaved: waterDisplay,
                      resourcesSaved: resourcesDisplay,
                      blockchain: "Certified",
                      infinito: "https://infinito.me/verify/" + (trackingNumber || "CON-2024-001")
                    })}
                    size={120}
                    bgColor="#FFFFFF"
                    fgColor="#222222"
                    level="Q"
                    includeMargin={true}
                  />
                </div>
                
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-800 mb-1">
                    #{trackingNumber || "CON-2024-001"}
                  </div>
                  <div className="text-xs text-gray-600 font-light">
                    {timelineData[progressStep]?.status} | {timelineData[progressStep]?.date}
                  </div>
                  <div className="text-xs text-gray-500 mt-2 font-light">
                    Escaneie para verificar autenticidade
                  </div>
                </div>

                {/* Botones de descarga y compartir dentro del cuadro del QR */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 mt-4">
                  <button
                    className="w-full md:flex-1 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30 flex items-center justify-center gap-2"
                    onClick={downloadCertificate}
                    style={{ 
                      backgroundColor: "#3E88FF",
                      filter: "drop-shadow(0 4px 8px rgba(62,136,255,0.3))"
                    }}
                  >
                    <Download className="w-4 h-4" />
                    <span className="tracking-wider text-sm">{t.download}</span>
                  </button>
                  <button
                    className="w-full md:flex-1 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30 flex items-center justify-center gap-2"
                    onClick={shareProfile}
                    style={{ 
                      backgroundColor: "#D42D66",
                      filter: "drop-shadow(0 4px 8px rgba(212,45,102,0.3))"
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="tracking-wider text-sm">{t.share}</span>
                  </button>
                </div>
              </div>
            )}

            {/* QR dinámico de la transacción más reciente - Solo aparece cuando está en "Certificação Blockchain" */}
            {!showTrackingResults && userStats && userStats.recentTransactions && userStats.recentTransactions.length > 0 && progressStep === 3 && (
              <div 
                className="w-full bg-white/25 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center gap-2 mb-6 border border-white/30"
                style={{ filter: "drop-shadow(0 6px 12px rgba(67,178,210,0.2))" }}
              >
                <span className="font-bold text-gray-800 mb-2 tracking-wider">{t.certificate}</span>
                <div className="bg-white/90 p-4 rounded-xl">
                  <QRCodeCanvas
                    value={JSON.stringify(userStats.recentTransactions[0])}
                    size={120}
                    bgColor="#FFFFFF"
                    fgColor="#222222"
                    level="Q"
                    includeMargin={true}
                  />
                </div>
                <span className="text-xs text-gray-600 mt-2 font-medium">
                  Tipo: {userStats.recentTransactions[0].type} | {t.date}: {userStats.recentTransactions[0].date}
                </span>

                {/* Botones de descarga y compartir dentro del cuadro del QR */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 mt-4">
                  <button
                    className="w-full md:flex-1 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30 flex items-center justify-center gap-2"
                    onClick={downloadCertificate}
                    style={{ 
                      backgroundColor: "#3E88FF",
                      filter: "drop-shadow(0 4px 8px rgba(62,136,255,0.3))"
                    }}
                  >
                    <Download className="w-4 h-4" />
                    <span className="tracking-wider text-sm">{t.download}</span>
                  </button>
                  <button
                    className="w-full md:flex-1 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30 flex items-center justify-center gap-2"
                    onClick={shareProfile}
                    style={{ 
                      backgroundColor: "#D42D66",
                      filter: "drop-shadow(0 4px 8px rgba(212,45,102,0.3))"
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="tracking-wider text-sm">{t.share}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Actividad reciente futurista */}
            <div 
              className="w-full bg-white/25 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/30"
              style={{ filter: "drop-shadow(0 6px 12px rgba(129,54,132,0.2))" }}
            >
              <span className="font-bold text-gray-800 mb-4 block tracking-wider">{t.recent}</span>
              <div className="flex flex-col gap-3">
                {userStats && userStats.recentTransactions && userStats.recentTransactions.filter(t => ['contribution', 'sale', 'purchase'].includes(t.type)).map((transaction, idx) => (
                  <div key={transaction.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300">
                    {transaction.type === 'contribution' && <Leaf className="w-5 h-5" style={{ color: "#689610" }} />}
                    {transaction.type === 'sale' && <Package className="w-5 h-5" style={{ color: "#F47802" }} />}
                    {transaction.type === 'purchase' && <ShoppingBag className="w-5 h-5" style={{ color: "#3E88FF" }} />}
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm tracking-wider">
                        {transaction.type === 'contribution' && t.contribution}
                        {transaction.type === 'sale' && t.sale}
                        {transaction.type === 'purchase' && t.purchase}
                      </div>
                      <div className="text-xs text-gray-600 font-light">{transaction.date}</div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{transaction.impact?.co2 ?? ''}kg CO₂</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compartir perfil futurista */}
            <div 
              className="w-full bg-white/25 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/30"
              style={{ filter: "drop-shadow(0 6px 12px rgba(212,45,102,0.2))" }}
            >
              <span className="font-bold text-gray-800 mb-2 block tracking-wider">{t.shareProfile}</span>
              <span className="text-xs text-gray-600 mb-4 block font-light">{t.anyoneLink}</span>
              <div className="flex gap-3 mb-4">
                <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                  <p className="text-sm text-gray-700 font-mono tracking-wider">infinito.me/User</p>
                </div>
                <button
                  onClick={shareProfile}
                  className="px-6 py-3 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30"
                  style={{ 
                    backgroundColor: "#689610",
                    filter: "drop-shadow(0 4px 8px rgba(104,150,16,0.3))"
                  }}
                >
                  {t.share}
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
      </div>
    </>
  );
}
