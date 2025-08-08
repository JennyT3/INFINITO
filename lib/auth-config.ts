import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import logger from './logger';

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) {
          logger.authError('SignIn failed: No email provided', new Error('Email is required'));
          return false;
        }

        logger.info('User signed in successfully', 'AUTH', {
          email: user.email,
          provider: account?.provider,
          method: 'signIn'
        });

        return true;
      } catch (error) {
        logger.authError('SignIn process failed', error as Error, { user: user.email });
        return false;
      }
    },
    
    async jwt({ token, user, account, profile }) {
      try {
        if (user) {
          token.id = user.id;
          token.email = user.email;
          
          logger.info('JWT token created', 'AUTH', {
            userId: user.id,
            email: user.email,
            method: 'jwt'
          });
        }
        
        return token;
      } catch (error) {
        logger.authError('JWT callback failed', error as Error, { tokenSub: token.sub });
        return token;
      }
    },
    
    async session({ session, token }) {
      try {
        if (session.user) {
          (session.user as any).id = token.id;
          (session.user as any).email = token.email;
          
          logger.info('Session created', 'AUTH', {
            userId: token.id,
            email: token.email,
            method: 'session'
          });
        }
        
        return session;
      } catch (error) {
        logger.authError('Session callback failed', error as Error, { tokenSub: token.sub });
        return session;
      }
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      logger.userAction('User signed in', {
        email: user.email,
        provider: account?.provider,
        isNewUser,
      });
    },
    
    async signOut({ session, token }) {
      logger.userAction('User signed out', {
        email: session?.user?.email,
      });
    },
  },
  debug: process.env.NODE_ENV === 'development',
}; 