# 🚀 Vercel Deployment Guide - INFINITO Project

## Prerequisites

Before deploying to Vercel, ensure you have:

1. **Vercel CLI installed**: `npm install -g vercel`
2. **Vercel account**: Sign up at [vercel.com](https://vercel.com)
3. **PostgreSQL database**: Set up a production database (Vercel Postgres, Supabase, or any PostgreSQL provider)
4. **Google OAuth credentials**: For authentication
5. **Anthropic API key**: For AI features

## 🛠️ Quick Deployment

### Option 1: Automated Script
```bash
# Run the deployment script
./scripts/deploy-vercel.sh
```

### Option 2: Manual Deployment
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

## 🔧 Environment Variables Setup

After deployment, configure these environment variables in your Vercel dashboard:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` |
| `SHADOW_DATABASE_URL` | PostgreSQL shadow database | `postgresql://user:pass@host:5432/shadow_db` |
| `NEXTAUTH_URL` | Your Vercel deployment URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Random secret for NextAuth | Generate with: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | From Google Cloud Console |
| `ANTHROPIC_API_KEY` | Anthropic API key | From Anthropic dashboard |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_GOOGLE_VISION_API_KEY` | Google Vision API key | For image analysis |
| `NEXT_PUBLIC_OPENAI_API_KEY` | OpenAI API key | Alternative AI service |
| `NEXT_PUBLIC_HUGGINGFACE_API_KEY` | Hugging Face API key | Alternative AI service |

## 🗄️ Database Setup

### 1. Set up PostgreSQL Database

**Option A: Vercel Postgres (Recommended)**
```bash
# Install Vercel Postgres
vercel storage create postgres

# Link to your project
vercel env pull .env.local
```

**Option B: External PostgreSQL (Supabase, Railway, etc.)**
- Create a PostgreSQL database
- Get the connection string
- Add to Vercel environment variables

### 2. Run Database Migrations

After setting up the database:

```bash
# Push the schema to the database
npx prisma db push

# Or run migrations if you have them
npx prisma migrate deploy
```

### 3. Seed Initial Data (Optional)

```bash
# Seed admin data
npm run seed:admin:standard

# Seed test scenarios
npm run seed:scenario:mixed
```

## 🔐 Authentication Setup

### Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-app.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for development)

### NextAuth Configuration

The application uses NextAuth.js with Google provider. Ensure your `NEXTAUTH_URL` matches your Vercel deployment URL.

## 🤖 AI Services Setup

### Anthropic Claude API

1. Sign up at [Anthropic Console](https://console.anthropic.com/)
2. Create an API key
3. Add to Vercel environment variables as `ANTHROPIC_API_KEY`

### Optional AI Services

- **Google Vision API**: For image analysis
- **OpenAI API**: Alternative AI service
- **Hugging Face API**: For specialized models

## 📊 Monitoring and Analytics

### Vercel Analytics

Enable Vercel Analytics in your dashboard for:
- Performance monitoring
- Error tracking
- User analytics

### Database Monitoring

Monitor your PostgreSQL database for:
- Connection limits
- Query performance
- Storage usage

## 🔄 Continuous Deployment

### GitHub Integration

1. Connect your GitHub repository to Vercel
2. Enable automatic deployments
3. Configure branch protection rules

### Environment Variables per Environment

Set up different environment variables for:
- **Production**: Main deployment
- **Preview**: For pull requests
- **Development**: Local development

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   vercel logs
   
   # Test build locally
   npm run build
   ```

2. **Database Connection Issues**
   ```bash
   # Test database connection
   npx prisma db push
   
   # Check environment variables
   vercel env ls
   ```

3. **Authentication Problems**
   - Verify Google OAuth credentials
   - Check redirect URIs
   - Ensure `NEXTAUTH_URL` is correct

4. **API Timeouts**
   - Check function timeout settings in `vercel.json`
   - Optimize database queries
   - Use connection pooling

### Performance Optimization

1. **Database Indexes**
   ```sql
   -- Add indexes for frequently queried fields
   CREATE INDEX idx_contributions_tracking ON Contribution(tracking);
   CREATE INDEX idx_contributions_fecha ON Contribution(fecha);
   ```

2. **Image Optimization**
   - Use Next.js Image component
   - Configure CDN settings
   - Optimize image formats

3. **Caching Strategy**
   - Implement Redis for session storage
   - Use Vercel Edge Functions for caching
   - Configure static asset caching

## 📈 Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Authentication working
- [ ] AI services functional
- [ ] Admin panel accessible
- [ ] User registration/login working
- [ ] File uploads working
- [ ] Email notifications configured
- [ ] Monitoring set up
- [ ] SSL certificate active
- [ ] Performance optimized
- [ ] Error tracking configured

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js Deployment](https://next-auth.js.org/configuration/providers/google)
- [PostgreSQL on Vercel](https://vercel.com/docs/storage/vercel-postgres)

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review environment variable configuration
3. Test database connectivity
4. Verify API keys and credentials
5. Check NextAuth.js configuration

---

**Happy Deploying! 🚀**
