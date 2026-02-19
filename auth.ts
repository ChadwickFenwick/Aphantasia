import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHub,
        Google
    ],
    callbacks: {
        async session({ session, user }) {
            // Send properties to the client, like an access_token and user id from a provider.
            if (session.user) {
                session.user.id = user.id;
            }
            return session
        }
    }
})
