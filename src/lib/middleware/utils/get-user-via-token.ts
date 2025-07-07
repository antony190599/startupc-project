/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserProps } from "@/lib/types";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function getUserViaToken(req: NextRequest) {
  const session = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as {
    email?: string;
    role?: string;
    user?: UserProps;
  };

  // Add role to user if available
  if (session?.user && session?.role) {
    session.user.role = session.role as any;
  }

  return session?.user;
}
