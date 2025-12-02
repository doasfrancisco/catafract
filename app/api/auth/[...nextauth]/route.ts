import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { getUser, createUser } from "@/lib/azure";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            const existingUser = await getUser(user.email!);
            if (!existingUser && account?.provider === "google") {
                await createUser({
                    email: user.email!,
                    name: user.name!,
                    image: user.image!,
                    createdAt: new Date().toISOString(),
                    isPro: false,
                    provider: account?.provider,
                });
            }
            return true;
        },
    },
    pages: {
        signIn: '/login'
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
