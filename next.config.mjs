/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración experimental
  experimental: {
    // Optimizaciones de rendimiento
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Configuración de webpack
  webpack: (config, { dev, isServer }) => {
    // Configuración para desarrollo
    if (dev) {
      // Reducir warnings en desarrollo
      config.infrastructureLogging = {
        level: 'error',
      };
    }

    // Configuración para manejar módulos problemáticos
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    // Configuración para módulos externos
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        'sodium-native': 'sodium-native',
        'require-addon': 'require-addon',
      });
    }

    return config;
  },

  // Configuración de imágenes
  images: {
    // Dominios permitidos para imágenes externas
    domains: ['localhost'],
    // Formatos de imagen soportados
    formats: ['image/webp', 'image/avif'],
    // Configuración de carga de imágenes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Configuración de carga lazy
    minimumCacheTTL: 60,
  },

  // Configuración de headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Configuración de redirecciones
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },

  // Configuración de compresión
  compress: true,

  // Configuración de powered by
  poweredByHeader: false,

  // Configuración de trailing slash
  trailingSlash: false,

  // Configuración de base path
  basePath: '',

  // Configuración de asset prefix
  assetPrefix: '',

  // Configuración de output
  output: 'standalone',

  // Configuración de typescript
  typescript: {
    // Ignorar errores de TypeScript durante el build
    ignoreBuildErrors: false,
  },

  // Configuración de eslint
  eslint: {
    // Ignorar errores de ESLint durante el build
    ignoreDuringBuilds: false,
  },

  // Configuración de swc minify
  swcMinify: true,
};

export default nextConfig;
