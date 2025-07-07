// Extender los tipos para solucionar errores de TypeScript
import "next-auth";

declare module "next-auth" {
    interface User {
        firstname?: string | null;
        lastname?: string | null;
        role: "admin" | "business";
    }

    interface Session {
        user: User;
    }
}

/*
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string | null;
      firstname?: string | null;
      lastname?: string | null;
      name?: string;
      image?: string;
      role: "admin" | "business";
    }
  }
  
  interface User {
    id: string;
    email?: string | null;
    firstname?: string | null;
    lastname?: string | null;
    name?: string;
    image?: string | null;
    role?: string;
  }
}
*/
/*
declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    role?: string;
    user?: {
      id: string;
      email?: string | null;
      firstname?: string | null;
      lastname?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}
*/