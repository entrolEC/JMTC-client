import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { z } from "zod";
import { authConfig } from "./auth.config";
import prisma from "@/app/lib/prismaClient";
import { User } from "@prisma/client";

async function getUser(name: string): Promise<User | null> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                name: name,
            },
        });
        return user;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw new Error("Failed to fetch user.");
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z.object({ name: z.string(), password: z.string().min(6) }).safeParse(credentials);

                if (parsedCredentials.success) {
                    const { name, password } = parsedCredentials.data;

                    const user = await getUser(name);
                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) return user;
                }

                console.log("Invalid credentials");
                return null;
            },
        }),
    ],
});
