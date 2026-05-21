import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Test Account",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "creator" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username) return null;
        
        // For MVP local testing, we auto-create the user if they don't exist
        let user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });
        
        if (!user) {
          user = await prisma.user.create({
            data: {
              username: credentials.username,
              name: credentials.username,
              email: `${credentials.username}@example.com`,
            }
          });
        }
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        // Fetch the user to get the username
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string }
        });
        
        if (dbUser) {
          (session.user as any).id = dbUser.id;
          (session.user as any).username = dbUser.username;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
