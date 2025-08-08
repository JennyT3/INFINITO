# 🌱 INFINITO - Sustainable Fashion & Recycling Platform

A comprehensive platform for sustainable fashion, textile recycling, and environmental impact tracking. Built with Next.js, Prisma, and modern web technologies.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (for production)
- Google OAuth credentials
- Anthropic API key

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/infinito-app.git
cd infinito-app

# Install dependencies
npm install

# Set up environment variables
cp env.template .env.local
# Edit .env.local with your configuration

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Start development server
npm run dev
```

## 🛠️ Deployment

### Option 1: Automated Deployment

```bash
# Set up GitHub repository
./scripts/setup-github.sh

# Deploy to Vercel
./scripts/deploy-vercel.sh
```

### Option 2: Manual Deployment

1. **GitHub Setup**
   ```bash
   # Create repository on GitHub
   # Add remote origin
   git remote add origin https://github.com/your-username/repo-name.git
   git push -u origin main
   ```

2. **Vercel Deployment**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel --prod
   ```

## 📋 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` |
| `SHADOW_DATABASE_URL` | PostgreSQL shadow database | `postgresql://user:pass@host:5432/shadow_db` |
| `NEXTAUTH_URL` | Your deployment URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | NextAuth secret | Generate with: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | From Google Cloud Console |
| `ANTHROPIC_API_KEY` | Anthropic API key | From Anthropic dashboard |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_GOOGLE_VISION_API_KEY` | Google Vision API key | For image analysis |
| `NEXT_PUBLIC_OPENAI_API_KEY` | OpenAI API key | Alternative AI service |
| `NEXT_PUBLIC_HUGGINGFACE_API_KEY` | Hugging Face API key | Alternative AI service |

## 🏗️ Project Structure

```
IDEA/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   ├── contribuir/        # Contribution flow
│   ├── marketplace/       # Marketplace
│   └── profile/           # User profile
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── ui/               # UI components
│   └── calculadora-ambiental/ # Environmental calculator
├── lib/                  # Utilities and configurations
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── scripts/              # Deployment and utility scripts
└── docs/                 # Documentation
```

## 🎯 Features

### Core Functionality
- **User Authentication**: Google OAuth integration
- **Contribution Tracking**: Textile donation and recycling
- **Environmental Impact**: CO2 and water savings calculation
- **Marketplace**: Buy and sell sustainable fashion
- **Admin Panel**: Comprehensive management interface
- **AI Analysis**: Automated product classification

### Technical Features
- **Next.js 14**: App Router and Server Components
- **Prisma ORM**: Type-safe database operations
- **NextAuth.js**: Secure authentication
- **Tailwind CSS**: Modern styling
- **TypeScript**: Type safety throughout
- **Vercel Deployment**: Optimized for serverless

## 🗄️ Database Schema

### Key Models
- **Contribution**: User contributions and tracking
- **Product**: Marketplace products
- **User**: User profiles and authentication
- **PickupRequest**: Logistics management

## 🚀 Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Database
```bash
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio
```

### Seeding
```bash
npm run seed:admin:standard    # Seed admin data
npm run seed:scenario:mixed    # Seed test scenarios
```

### Deployment
```bash
./scripts/setup-github.sh     # Set up GitHub repository
./scripts/deploy-vercel.sh    # Deploy to Vercel
```

## 🔧 Configuration

### Next.js Configuration
- Optimized for Vercel deployment
- Image optimization enabled
- Security headers configured
- API route optimization

### Prisma Configuration
- PostgreSQL for production
- SQLite for development
- Optimized indexes
- Migration support

## 📊 Monitoring

### Vercel Analytics
- Performance monitoring
- Error tracking
- User analytics

### Database Monitoring
- Connection limits
- Query performance
- Storage usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the [Deployment Guide](DEPLOYMENT-GUIDE.md)
2. Review [Technical Roadmap](ROADMAP_TECHNICAL.md)
3. Check Vercel deployment logs
4. Verify environment variable configuration

---

**Built with ❤️ for a sustainable future**
