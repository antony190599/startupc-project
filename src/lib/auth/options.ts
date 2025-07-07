/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { validatePassword } from "./password";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;


export const authOptions: NextAuthOptions = {
    providers: [
        /*
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            allowDangerousEmailAccountLinking: true,
        }),
        */
        CredentialsProvider({
            id: "credentials",
            name: "Mentor.inc",
            type: "credentials",
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials) {
                    throw new Error("no-credentials");
                }


                const { email, password } = credentials;

                if (!email || !password) {
                    throw new Error("no-credentials");
                }

                const user = await prisma.user.findFirst({
                    where: { email },
                });

                if (!user || !user.password) {
                    throw new Error("invalid-credentials");
                }

                const passwordMatch = await validatePassword({
                    password,
                    passwordHash: user.password,
                });

                if (!passwordMatch) {
                    throw new Error("invalid-credentials");
                }

                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        invalidLoginAttempts: 0,
                    },
                });

                return {
                    id: user.id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    image: user.image,
                    role: (user.role || "entrepreneur") as "admin" | "entrepreneur",
                }
            },

        })
    ],
    // adapter: PrismaAdapter(prisma), // Removed due to version incompatibility with next-auth v4
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 30, // 30 days
    },
    cookies: {
        sessionToken: {
          name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
            domain: VERCEL_DEPLOYMENT
              ? `.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
              : undefined,
            secure: VERCEL_DEPLOYMENT,
          },
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        signIn: async ({ user, account, profile }) => {
            console.log("signIn callback", { user, account, profile });

            if ((user as any)?.lockedAt) {
                return false;
            }

            if (account?.provider === "google") {
                // If the user is signing in with Google, we can check if they already exist
                const userExists = await prisma.user.findFirst({
                    where: { email: user.email as string },
                });

                if (!userExists || !profile) {
                    return true;
                }

                if (userExists && profile) {
                    const profilePic =
                        (profile as Record<string, unknown>)[account.provider === "google" ? "picture" : "avatar_url"];
                    let newAvatar: string | null = null;

                    newAvatar = typeof profilePic === "string" ? profilePic : null;


                    await prisma.user.update({
                        where: { id: userExists.id },
                        data: {
                            firstname: user.name || userExists.firstname,
                            lastname: userExists.lastname ?? "",
                            image: newAvatar || userExists.image || null,
                        },
                    });


                    return true;
                }
            }
            return true;
        },
        async jwt({ token, user, trigger }) {
            if (user) {
                // Add role and other user fields to the token
                token.user = user;
            }

            if (trigger === "update") {
                const refreshedUser = await prisma.user.findFirst({
                    where: { id: token.sub as string },
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        email: true,
                        image: true,
                        role: true,
                    }
                });
        
                if (refreshedUser) {
                  token.user = refreshedUser;
                } else {
                  return {};
                }
            }
            return token;
        },
        async session({ session, token }) {
            // Add role and user data to the session
            session.user = {
                id: token.sub,
                role: token.role as any,
                ...(token || session).user as any,
            };
            return session;
        },    
    },
    events: {
        async signIn(message) {
            const email = message.user?.email || "";

            const user = await prisma.user.findFirst({
                where: { email },
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    email: true,
                    image: true,
                    createdAt: true,
                    role: true,
                }
            });

            if (!user) {
                console.log(
                  `User ${message.user.email} not found, skipping welcome workflow...`,
                );
                return;
              }
        }
    }
}


