import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { getUser, createUser } from "@/lib/azure";

const handler = NextAuth({
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
})

export { handler as GET, handler as POST }
