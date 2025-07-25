import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { AuthOptions, User, Account, Profile, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import logger from '../../../../lib/logger';
import { InfinitoAPIError, ErrorCode } from '../../../../lib/api-error-handler';
import { NextRequest, NextResponse } from "next/server";

export const authOptions: NextAuthOptions = {
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
	callbacks: {
		async signIn({ user, account, profile }) {
			try {
				// Validações de entrada
				if (!user.email) {
					logger.authError('SignIn failed: No email provided', new Error('Email is required'));
					return false;
				}

				// Log successful sign in
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
				// Adicionar dados personalizados ao token
				if (user) {
					token.id = user.id;
					token.email = user.email;
					
					// Log token creation
					logger.info('JWT token created', 'AUTH', {
						userId: user.id,
						email: user.email,
						method: 'jwt'
					});
				}
				
				return token;
			} catch (error) {
				logger.authError('JWT callback failed', error as Error, { tokenSub: token.sub });
				throw new InfinitoAPIError(
					ErrorCode.INTERNAL_SERVER_ERROR,
					'Erro ao processar token de autenticação',
					(error as Error).message
				);
			}
		},
		
		async session({ session, token }) {
			try {
				// Adicionar dados personalizados à sessão
				if (session.user) {
					(session.user as any).id = token.id;
					(session.user as any).email = token.email;
					
					// Log session creation
					logger.info('Session created', 'AUTH', {
						userId: token.id,
						email: token.email,
						method: 'session'
					});
				}
				
				return session;
			} catch (error) {
				logger.authError('Session callback failed', error as Error, { tokenSub: token.sub });
				throw new InfinitoAPIError(
					ErrorCode.INTERNAL_SERVER_ERROR,
					'Erro ao criar sessão de utilizador',
					(error as Error).message
				);
			}
		},
	},
	events: {
		async signIn({ user, account, profile, isNewUser }) {
			logger.userAction('User signed in', {
				email: user.email,
				provider: account?.provider,
				isNewUser,
				method: 'signIn'
			});
		},
		
		async signOut({ session, token }) {
			logger.userAction('User signed out', {
				userId: token?.id || session?.user?.email,
				method: 'signOut'
			});
		},
		
		async createUser({ user }) {
			logger.userAction('New user created', {
				email: user.email,
				method: 'createUser'
			});
		},
		
		async session({ session, token }) {
			// Log session verification (only in development)
			if (process.env.NODE_ENV === 'development') {
				logger.debug('Session verified', 'AUTH', {
					userId: token?.id || session?.user?.email,
					method: 'session'
				});
			}
		},
	},
	// Configuración de cookies corregida para desarrollo
	cookies: {
		sessionToken: {
			name: process.env.NODE_ENV === 'production' 
				? `__Secure-next-auth.session-token`
				: `next-auth.session-token`,
			options: {
				httpOnly: true,
				sameSite: 'lax',
				path: '/',
				secure: process.env.NODE_ENV === 'production',
				domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost',
			},
		},
		callbackUrl: {
			name: process.env.NODE_ENV === 'production' 
				? `__Secure-next-auth.callback-url`
				: `next-auth.callback-url`,
			options: {
				httpOnly: true,
				sameSite: 'lax',
				path: '/',
				secure: process.env.NODE_ENV === 'production',
			},
		},
		csrfToken: {
			name: process.env.NODE_ENV === 'production' 
				? `__Host-next-auth.csrf-token`
				: `next-auth.csrf-token`,
			options: {
				httpOnly: true,
				sameSite: 'lax',
				path: '/',
				secure: process.env.NODE_ENV === 'production',
			},
		},
	},
	pages: {
		signIn: '/splash',
		error: '/auth/error', // Página de erro personalizada
	},
	debug: process.env.NODE_ENV === 'development',
	logger: {
		error(code, metadata) {
			logger.authError(`NextAuth Error: ${code}`, new Error(code), metadata);
		},
		warn(code) {
			logger.warn(`NextAuth Warning: ${code}`, 'AUTH');
		},
		debug(code, metadata) {
			if (process.env.NODE_ENV === 'development') {
				logger.debug(`NextAuth Debug: ${code}`, 'AUTH', metadata);
			}
		},
	},
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions); 