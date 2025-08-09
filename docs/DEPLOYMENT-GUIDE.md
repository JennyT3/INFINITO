# Deploy to Vercel

## What you need

- [Vercel](https://vercel.com) account
- PostgreSQL database
- Anthropic API key
- Google OAuth credentials

## Quick steps

1. **Connect repo to Vercel**
   - Go to Vercel → New Project
   - Select your GitHub repository

2. **Set environment variables**
   ```
   DATABASE_URL=your_postgres_url
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=generate_random_one
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ANTHROPIC_API_KEY=your_api_key
   ```

3. **Setup database**
   ```bash
   npx prisma db push
   ```

4. **Deploy**
   - Vercel auto-deploys
   - Or run: `vercel --prod`

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add this URL: `https://your-app.vercel.app/api/auth/callback/google`

## If something breaks

- Check Vercel logs
- Verify environment variables
- Test database connection

Done 
