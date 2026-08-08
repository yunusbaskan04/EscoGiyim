import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { logActivity } from './audit';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        email: { label: 'E-posta', type: 'email', placeholder: 'admin@escogiyim.com' },
        password: { label: 'Parola', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('E-posta ve şifre gereklidir.');
        }

        const inputEmail = credentials.email.toLowerCase().trim();
        const inputPassword = credentials.password;
        const envEmail = (process.env.ADMIN_EMAIL || 'admin@escogiyim.com').toLowerCase();
        const envPassword = process.env.ADMIN_PASSWORD || 'AdminEscoGiyim2026!';

        try {
          const admin = await db.admin.findUnique({
            where: { email: inputEmail },
          });

          if (admin) {
            const isValidPassword = await bcrypt.compare(inputPassword, admin.passwordHash);
            if (!isValidPassword) {
              throw new Error('Geçersiz e-posta veya şifre.');
            }

            await logActivity({
              adminId: admin.id,
              action: 'LOGIN',
              entityType: 'Admin',
              entityId: admin.id,
              details: 'Yönetici oturumu açıldı.',
            });

            return {
              id: admin.id,
              email: admin.email,
              name: admin.name,
              role: admin.role,
            };
          }

          // If admin record not in DB yet, check ENV credentials and create
          if (inputEmail === envEmail && inputPassword === envPassword) {
            const hashedPassword = await bcrypt.hash(envPassword, 10);
            const newAdmin = await db.admin.create({
              data: {
                email: envEmail,
                name: 'Esco Giyim Admin',
                passwordHash: hashedPassword,
                role: 'ADMIN',
              },
            });

            await logActivity({
              adminId: newAdmin.id,
              action: 'LOGIN',
              entityType: 'Admin',
              entityId: newAdmin.id,
              details: 'İlk yönetici girişi oluşturuldu.',
            });

            return {
              id: newAdmin.id,
              email: newAdmin.email,
              name: newAdmin.name,
              role: newAdmin.role,
            };
          }
        } catch (dbError) {
          console.warn('Database offline during login, checking ENV admin fallback:', dbError);
          // Fallback if database server is offline or not yet initialized
          if (inputEmail === envEmail && inputPassword === envPassword) {
            return {
              id: 'fallback-admin-id',
              email: envEmail,
              name: 'Esco Giyim Admin (Sistem)',
              role: 'ADMIN',
            };
          }
        }

        throw new Error('Geçersiz e-posta veya şifre.');
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || 'ADMIN';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'esco_sah_production_super_secret_jwt_key_2026_key_12345',
};

export default NextAuth(authOptions);
