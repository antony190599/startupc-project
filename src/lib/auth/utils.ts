import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";
import { GeneralApiError } from "../api/errors";
import { authOptions } from "./options";

export interface Session {
  user: {
    id?: string;
    email?: string | null;
    firstname?: string | null;
    lastname?: string | null;
    name?: string;
    image?: string;
    role: "admin" | "entrepreneur";
  };
}

export const getSession = async () => {
  return getServerSession(authOptions) as Promise<Session>;
};

export const getAuthTokenOrThrow = (
  req: Request | NextRequest,
  type: "Bearer" | "Basic" = "Bearer",
) => {
  const authorizationHeader = req.headers.get("Authorization");

  if (!authorizationHeader) {
    throw new GeneralApiError({
      code: "bad_request",
      message:
        "Misconfigured authorization header. Did you forget to add 'Bearer '? Learn more: https://d.to/auth",
    });
  }

  return authorizationHeader.replace(`${type} `, "");
};

export function generateOTP() {
  // Generate a random number between 0 and 999999
  const randomNumber = Math.floor(Math.random() * 1000000);

  // Pad the number with leading zeros if necessary to ensure it is always 6 digits
  const otp = randomNumber.toString().padStart(6, "0");

  return otp;
}
